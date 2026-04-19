"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  if (!isAuthenticated) {
    return null;
  }
  const handleSignOut = () => {
    if ("vibrate" in navigator) navigator.vibrate(50);
    void signOut();
    toast.success("Déconnexion réussie !");
  };
  return (
    <Button
      onClick={handleSignOut}
      className="btn-orange group relative px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
    >
      <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      <span>Déconnexion</span>
    </Button>
  );
}