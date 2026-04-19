import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AlertTriangle, Menu, MessageCircle, ShieldCheck, LogOut } from "lucide-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { SignInForm } from "@/components/SignInForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { toast } from "sonner";
type AppLayoutProps = {
  children?: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = false, className, contentClassName }: AppLayoutProps): JSX.Element {
  const content = children ?? <Outlet />;
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 150]);
  const { signOut } = useAuthActions();
  const handleSignOut = () => {
    if ("vibrate" in navigator) navigator.vibrate(50);
    void signOut();
    toast.success("Session fermée avec succès.");
  };
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className={`bg-background min-h-screen relative flex flex-col ${className || ""}`}>
        {/* Navy Complementary Disclaimer Banner */}
        <div className="sticky top-0 w-full bg-gradient-to-r from-[#be123c] via-[#ea580c] to-[#be123c] text-white px-4 py-2.5 flex items-center justify-center gap-3 text-[10px] sm:text-[11px] font-black shadow-[0_4px_25px_rgba(190,18,60,0.5)] z-[70] border-b border-white/20 uppercase tracking-widest h-[42px] sm:h-[44px]">
          <AlertTriangle className="h-4 w-4 animate-pulse shrink-0 drop-shadow-md" />
          <span className="text-center leading-none">
            DEMO ÉDUCATIF : NE TRANSFÉREZ AUCUN ARGENT RÉEL. NON AFFILIÉ À 1XBET OU AUTRES SERVICES.
          </span>
        </div>
        <Authenticated>
          <motion.div
            style={{ y: backgroundY }}
            className="fiery-bg-layer"
          />
          <div className="fiery-scrim" />
          <header className="sticky top-[42px] sm:top-[44px] left-0 right-0 z-[60] h-16 bg-background/40 backdrop-blur-2xl border-b border-white/5 px-4 flex items-center justify-between transition-colors duration-300">
            <SidebarTrigger className="h-10 w-10 bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] border-l-2 border-primary text-white hover:brightness-110 transition-all rounded-xl shadow-[0_4px_15px_rgba(30,58,138,0.5)] flex items-center justify-center group">
              <Menu className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </SidebarTrigger>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 mr-1">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">Serveur Sécurisé</span>
              </div>
              <ThemeToggle className="hover:shadow-[0_0_15px_rgba(234,88,12,0.3)]" />
              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="icon"
                aria-label="Se déconnecter"
                className="h-10 w-10 bg-[#1e3a8a]/40 border border-white/10 rounded-xl transition-all duration-200 hover:bg-destructive/20 hover:border-destructive/40 active:scale-90"
              >
                <LogOut className="h-5 w-5 text-white/80" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent selection:bg-primary/30 selection:text-white pb-24 relative z-10">
            {container ? (
              <div className={"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12" + (contentClassName ? ` ${contentClassName}` : "")}>
                {content}
              </div>
            ) : (
              content
            )}
          </main>
        </Authenticated>
        <Unauthenticated>
          <div className="flex-1 flex items-center justify-center p-4 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.2)_0%,transparent_70%)]" />
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-md space-y-8 relative z-10"
              >
                <Card className="glass-dark border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden rounded-[2rem]">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-orange-400 to-primary animate-shimmer" />
                  <CardHeader className="text-center pb-6 pt-10">
                    <div className="mx-auto mb-6 flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-black/40 flex items-center justify-center p-4 border border-white/5 shadow-2xl relative">
                        <div className="hexagon-border-glow w-full h-full flex items-center justify-center">
                          <div className="login-logo-hex w-full h-full flex items-center justify-center relative z-10 shadow-inner">
                            <span className="text-white text-5xl font-black italic drop-shadow-lg leading-none flex items-center justify-center">S</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col items-center space-y-0.5">
                        <span className="gold-teal-gradient text-sm tracking-[0.2em] uppercase leading-tight">Mararasass Service</span>
                        <span className="text-[#FFD700] text-[10px] font-black tracking-[0.5em] uppercase leading-tight">DÉPÔT • RETRAIT</span>
                        <span className="branding-glow-blue text-2xl tracking-tighter uppercase leading-none">1XBET</span>
                      </div>
                    </div>
                    <CardTitle className="text-3xl font-black text-white uppercase tracking-tighter italic leading-tight">Accès Sécurisé</CardTitle>
                    <CardDescription className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] mt-2 italic">Validation Elite Reclame</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-10 px-8">
                    <SignInForm />
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </Unauthenticated>
        <footer className="fixed bottom-0 left-0 right-0 z-[55] bg-[#1e3a8a]/60 backdrop-blur-2xl border-t border-white/10 px-4 py-3.5 flex items-center justify-center md:justify-between group transition-all duration-300">
          <div className="hidden md:flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(234,88,12,0.9)]" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Elite Support Actif</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/22780484830"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full shadow-lg hover:bg-white/10 transition-all active:scale-95 group"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366] group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-black text-white uppercase tracking-tight">WhatsApp : <span className="text-primary">+227 80 48 48 30</span></span>
              <ShieldCheck className="h-3.3 w-3.3 text-primary animate-pulse" />
            </a>
          </div>
          <div className="hidden md:block text-[9px] text-muted-foreground/30 font-black uppercase tracking-widest">
            Navy Intermediary Protocol v3.5
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}