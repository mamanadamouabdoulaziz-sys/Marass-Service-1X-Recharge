import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AlertTriangle, Menu, MessageCircle, ShieldCheck } from "lucide-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "@/components/SignInForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className={`bg-background min-h-screen relative flex flex-col ${className || ""}`}>
        {/* Navy Complementary Disclaimer Banner */}
        <div className="sticky top-0 w-full bg-gradient-to-r from-[#be123c] via-[#ea580c] to-[#be123c] text-white px-4 py-2.5 flex items-center justify-center gap-3 text-[10px] sm:text-[11px] font-black shadow-[0_4px_20px_rgba(234,88,12,0.4)] z-[70] border-b border-white/20 uppercase tracking-widest">
          <AlertTriangle className="h-4 w-4 animate-pulse shrink-0 drop-shadow-md" />
          <span className="text-center leading-none">
            DEMO ÉDUCATIF : NE TRANSFÉREZ AUCUN ARGENT RÉEL. NON AFFILIÉ À 1XBET OU AUTRES SERVICES.
          </span>
        </div>
        <Authenticated>
          {/* Fiery Bull Parallax Background */}
          <motion.div 
            style={{ y: backgroundY }}
            className="fiery-bg-layer" 
          />
          <div className="fiery-scrim" />
          {/* Header Controls Container */}
          <header className="sticky top-[42px] sm:top-[44px] left-0 right-0 z-[60] h-16 bg-background/60 backdrop-blur-xl border-b border-white/5 px-4 flex items-center justify-between">
            <SidebarTrigger className="h-10 w-10 bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] border-l-2 border-primary text-white hover:opacity-90 transition-all rounded-xl shadow-lg flex items-center justify-center">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <div className="flex items-center gap-3">
              <ThemeToggle className="" />
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
          <div className="flex-1 flex items-center justify-center p-4 bg-background">
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md space-y-8"
              >
                <Card className="glass-dark border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden rounded-3xl">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-orange-400 to-primary" />
                  <CardHeader className="text-center pb-6 pt-10">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20 shadow-inner group">
                      <ShieldCheck className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <CardTitle className="text-3xl font-black text-white uppercase tracking-tighter italic leading-tight">Accès Sécurisé</CardTitle>
                    <CardDescription className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Connectez-vous pour continuer</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-10 px-8">
                    <SignInForm />
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </Unauthenticated>
        {/* Navy Support Footer */}
        <footer className="fixed bottom-0 left-0 right-0 z-[55] bg-[#1e3a8a]/80 backdrop-blur-lg border-t border-white/5 px-4 py-3 flex items-center justify-center md:justify-between group">
          <div className="hidden md:flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(234,88,12,0.8)]" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Elite Support Actif</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full shadow-lg">
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span className="text-xs font-black text-white uppercase tracking-tight">WhatsApp : <span className="text-primary">+227 80 48 48 30</span></span>
              <ShieldCheck className="h-3 w-3 text-primary" />
            </div>
          </div>
          <div className="hidden md:block text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest">
            DemoBet Navy Intermediary v3.1
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}