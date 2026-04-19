"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { PASSWORD_MIN_LENGTH, PASSWORD_TOO_SHORT_MESSAGE } from "@shared/auth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
type FormStep = "signIn" | "signUp" | "verifyEmail" | "forgotPassword" | "resetPassword";
type FieldErrorKey = "email" | "password" | "newPassword" | "otp";
type FieldErrors = Partial<Record<FieldErrorKey, string>>;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function SignInForm() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<FormStep>("signUp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);
  const resetForm = useCallback(() => {
    setPassword("");
    setNewPassword("");
    setOtp("");
    setSubmitting(false);
    setFieldErrors({});
  }, []);
  const clearFieldError = useCallback((field: FieldErrorKey) => {
    setFieldErrors((current) =>
      current[field]
        ? {
            ...current,
            [field]: undefined,
          }
        : current
    );
  }, []);
  const validateCurrentStep = useCallback(() => {
    const nextErrors: FieldErrors = {};
    const normalizedEmail = email.trim();
    if (step === "signIn" || step === "signUp" || step === "forgotPassword") {
      if (!normalizedEmail) {
        nextErrors.email = "Email is required.";
      } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
        nextErrors.email = "Enter a valid email address.";
      }
    }
    if (step === "signIn" || step === "signUp") {
      if (!password) {
        nextErrors.password = "Password is required.";
      } else if (step === "signUp" && password.length < PASSWORD_MIN_LENGTH) {
        nextErrors.password = PASSWORD_TOO_SHORT_MESSAGE;
      }
    }
    if (step === "verifyEmail" || step === "resetPassword") {
      if (otp.length !== 6) {
        nextErrors.otp = "Enter the 6-digit code from your email.";
      }
    }
    if (step === "resetPassword") {
      if (!newPassword) {
        nextErrors.newPassword = "New password is required.";
      } else if (newPassword.length < PASSWORD_MIN_LENGTH) {
        nextErrors.newPassword = PASSWORD_TOO_SHORT_MESSAGE;
      }
    }
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [email, newPassword, otp, password, step]);
  const handleSubmit = useCallback(async () => {
    if (!validateCurrentStep()) {
      return;
    }
    setSubmitting(true);
    const normalizedEmail = email.trim();
    const formData = new FormData();
    formData.set("email", normalizedEmail);
    try {
      switch (step) {
        case "signIn":
          formData.set("password", password);
          formData.set("flow", "signIn");
          await signIn("password", formData);
          break;
        case "signUp":
          formData.set("password", password);
          formData.set("flow", "signUp");
          try {
            await signIn("password", formData);
          } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            if (msg.includes("verify") || msg.includes("OTP") || msg.includes("email-verification")) {
              resetForm();
              setStep("verifyEmail");
              setResendCooldown(60);
              toast.info("Check your email for a verification code.");
              return;
            }
            throw error;
          }
          resetForm();
          setStep("verifyEmail");
          setResendCooldown(60);
          toast.info("Check your email for a verification code.");
          return;
        case "verifyEmail":
          formData.set("code", otp);
          formData.set("flow", "email-verification");
          await signIn("password", formData);
          toast.success("Email verified!");
          break;
        case "forgotPassword":
          formData.set("flow", "reset");
          await signIn("password", formData);
          resetForm();
          setStep("resetPassword");
          setResendCooldown(60);
          toast.info("Check your email for a reset code.");
          return;
        case "resetPassword":
          formData.set("code", otp);
          formData.set("newPassword", newPassword);
          formData.set("flow", "reset-verification");
          await signIn("password", formData);
          toast.success("Password reset successfully!");
          resetForm();
          setStep("signIn");
          return;
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      const lowerMsg = msg.toLowerCase();
      if (lowerMsg.includes("rate_limit") || msg.includes("429") || lowerMsg.includes("toomanyfailedattempts")) {
        toast.error("Too many attempts. Please wait a few minutes before trying again.");
      } else if (
        lowerMsg.includes("invalid password") ||
        lowerMsg.includes("password requirement") ||
        lowerMsg.includes("password must be at least")
      ) {
        setFieldErrors((current) => ({
          ...current,
          [step === "resetPassword" ? "newPassword" : "password"]: PASSWORD_TOO_SHORT_MESSAGE,
        }));
      } else if (lowerMsg.includes("invalidsecret") || lowerMsg.includes("invalid credentials")) {
        setFieldErrors((current) => ({
          ...current,
          password: "Incorrect password. Please try again.",
        }));
      } else if (
        lowerMsg.includes("invalid email") ||
        lowerMsg.includes("email format") ||
        lowerMsg.includes("valid email address")
      ) {
        setFieldErrors((current) => ({
          ...current,
          email: "Enter a valid email address.",
        }));
      } else if (lowerMsg.includes("invalidaccountid") || lowerMsg.includes("could not find")) {
        if (step === "signIn") {
          resetForm();
          setStep("signUp");
          setPassword(password);
          toast.info("No account found. Switched to sign up - please submit again.");
        } else if (step === "forgotPassword") {
          resetForm();
          setStep("resetPassword");
          setResendCooldown(60);
          toast.info("If an account exists with this email, a reset code has been sent.");
          return;
        } else {
          setFieldErrors((current) => ({
            ...current,
            email: "Account not found. Please check your email address.",
          }));
        }
      } else if (
        lowerMsg.includes("verify code") ||
        lowerMsg.includes("verification code") ||
        lowerMsg.includes("invalid code") ||
        lowerMsg.includes("expired")
      ) {
        setFieldErrors((current) => ({
          ...current,
          otp: "Invalid or expired code. Please try again or request a new one.",
        }));
      } else if (lowerMsg.includes("already exists") || lowerMsg.includes("unique") || lowerMsg.includes("duplicate")) {
        setFieldErrors((current) => ({
          ...current,
          email: "An account with this email already exists. Please sign in instead.",
        }));
      } else {
        toast.error(msg || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }, [step, email, password, newPassword, otp, signIn, resetForm, validateCurrentStep]);
  const handleResendCode = useCallback(async () => {
    if (resendCooldown > 0) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("flow", step === "verifyEmail" ? "email-verification" : "reset");
      await signIn("password", formData);
      setResendCooldown(60);
      toast.info("New code sent to your email.");
    } catch {
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [email, resendCooldown, signIn, step]);
  const inputClass = "w-full px-4 py-3 text-base bg-[#1e3a8a]/10 text-white placeholder:text-muted-foreground/50 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200";
  const buttonClass = "w-full px-6 py-4 bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white hover:brightness-110 active:scale-95 transition-all duration-200 shadow-lg font-black uppercase tracking-[0.2em] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed";
  const linkClass = "text-primary hover:text-primary/80 font-black uppercase text-[10px] tracking-widest cursor-pointer transition-colors duration-200";
  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-5"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
      >
        {(step === "signIn" || step === "signUp" || step === "forgotPassword") && (
          <div>
            <input
              className={`${inputClass} ${fieldErrors.email ? "border-destructive focus:ring-destructive/20" : ""}`}
              type="email"
              placeholder="VOTRE EMAIL"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              required
              disabled={submitting}
              autoComplete="email"
            />
            {fieldErrors.email && <p className="mt-1.5 text-[10px] font-black uppercase text-destructive tracking-widest">{fieldErrors.email}</p>}
          </div>
        )}
        {(step === "signIn" || step === "signUp") && (
          <div>
            <input
              className={`${inputClass} ${fieldErrors.password ? "border-destructive focus:ring-destructive/20" : ""}`}
              type="password"
              placeholder="MOT DE PASSE"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
              }}
              required
              disabled={submitting}
              autoComplete={step === "signUp" ? "new-password" : "current-password"}
            />
            {fieldErrors.password && <p className="mt-1.5 text-[10px] font-black uppercase text-destructive tracking-widest">{fieldErrors.password}</p>}
          </div>
        )}
        {(step === "verifyEmail" || step === "resetPassword") && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
              ENTREZ LE CODE À 6 CHIFFRES
            </p>
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => {
                setOtp(value);
                clearFieldError("otp");
              }}
              disabled={submitting}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="border-white/20 bg-white/5" />
                <InputOTPSlot index={1} className="border-white/20 bg-white/5" />
                <InputOTPSlot index={2} className="border-white/20 bg-white/5" />
                <InputOTPSlot index={3} className="border-white/20 bg-white/5" />
                <InputOTPSlot index={4} className="border-white/20 bg-white/5" />
                <InputOTPSlot index={5} className="border-white/20 bg-white/5" />
              </InputOTPGroup>
            </InputOTP>
            {fieldErrors.otp && <p className="text-[10px] font-black uppercase text-destructive tracking-widest">{fieldErrors.otp}</p>}
          </div>
        )}
        {step === "resetPassword" && (
          <div>
            <input
              className={`${inputClass} ${fieldErrors.newPassword ? "border-destructive focus:ring-destructive/20" : ""}`}
              type="password"
              placeholder="NOUVEAU MOT DE PASSE"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                clearFieldError("newPassword");
              }}
              required
              disabled={submitting}
              autoComplete="new-password"
            />
            {fieldErrors.newPassword && <p className="mt-1.5 text-[10px] font-black uppercase text-destructive tracking-widest">{fieldErrors.newPassword}</p>}
          </div>
        )}
        <button className={buttonClass} type="submit" disabled={submitting}>
          {submitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          ) : step === "signIn" ? "SE CONNECTER"
            : step === "signUp" ? "S'INSCRIRE"
            : step === "verifyEmail" ? "VÉRIFIER"
            : step === "forgotPassword" ? "ENVOYER LE CODE"
            : "RÉINITIALISER"}
        </button>
        <div className="text-center space-y-3 pt-2">
          {(step === "signIn" || step === "signUp") && (
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className={linkClass}
                onClick={() => { resetForm(); setStep(step === "signIn" ? "signUp" : "signIn"); }}
                disabled={submitting}
              >
                {step === "signIn" ? "CRÉER UN COMPTE ELITE" : "DÉJÀ MEMBRE ? SE CONNECTER"}
              </button>
              {step === "signIn" && (
                <button
                  type="button"
                  className={linkClass}
                  onClick={() => { resetForm(); setStep("forgotPassword"); }}
                  disabled={submitting}
                >
                  MOT DE PASSE OUBLIÉ ?
                </button>
              )}
            </div>
          )}
          {(step === "forgotPassword" || step === "verifyEmail" || step === "resetPassword") && (
            <button
              type="button"
              className={linkClass}
              onClick={() => { resetForm(); setStep("signIn"); }}
              disabled={submitting}
            >
              RETOUR À LA CONNEXION
            </button>
          )}
        </div>
      </form>
    </div>
  );
}