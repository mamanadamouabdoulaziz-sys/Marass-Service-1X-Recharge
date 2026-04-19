import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AlertTriangle, Menu, MessageCircle, ShieldCheck } from "lucide-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "@/components/SignInForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
type AppLayoutProps = {
  children?: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
};
export function AppLayout({ children, container = false, className, contentClassName }: AppLayoutProps): JSX.Element {
  const content = children ?? <Outlet />;
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className={`bg-background min-h-screen relative flex flex-col ${className || ""}`}>
        {/* Elite Anti-Phishing Disclaimer Banner */}
        <div className="sticky top-0 w-full bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#E11D48] text-white px-4 py-2.5 flex items-center justify-center gap-3 text-[10px] sm:text-[11px] font-black shadow-[0_4px_20px_rgba(225,29,72,0.4)] z-[60] border-b border-white/20 uppercase tracking-widest">
          <AlertTriangle className="h-4 w-4 animate-pulse shrink-0 drop-shadow-md" />
          <span className="text-center leading-none">
            DEMO ÉDUCATIF : NE TRANSFÉREZ AUCUN ARGENT RÉEL. NON AFFILIÉ À 1XBET OU AUTRES SERVICES.
          </span>
        </div>
        <Authenticated>
          {/* Global Sidebar Trigger */}
          <div className="absolute left-4 top-16 z-50">
            <SidebarTrigger className="h-10 w-10 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all rounded-xl shadow-xl backdrop-blur-md flex items-center justify-center">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
          </div>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background selection:bg-primary/30 selection:text-white pt-2 sm:pt-4 pb-20">
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
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
              <Card className="glass-dark border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden rounded-3xl">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-primary" />
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
            </div>
          </div>
        </Unauthenticated>
        {/* Persistent Official Support Footer */}
        <div className="fixed bottom-0 left-0 right-0 z-[55] bg-black/80 backdrop-blur-lg border-t border-emerald-500/20 px-4 py-3 flex items-center justify-center md:justify-between group">
          <div className="hidden md:flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Serveurs Opérationnels</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span className="text-xs font-black text-white uppercase tracking-tight">Support : <span className="text-[#25D366]">+227 80 48 48 30</span></span>
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
            </div>
          </div>
          <div className="hidden md:block text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest">
            DemoBet Intermediary v2.1.0-ELITE
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}