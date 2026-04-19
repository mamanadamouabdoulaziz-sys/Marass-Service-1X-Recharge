import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AlertTriangle, Menu } from "lucide-react";
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
        {/* Elite Anti-Phishing Disclaimer Banner - Critical visual integration */}
        <div className="sticky top-0 w-full bg-gradient-to-r from-[#E11D48] via-[#F43F5E] to-[#E11D48] text-white px-4 py-2.5 flex items-center justify-center gap-3 text-[10px] sm:text-[11px] font-black shadow-[0_4px_20px_rgba(225,29,72,0.4)] z-[60] border-b border-white/20 uppercase tracking-widest">
          <AlertTriangle className="h-4 w-4 animate-pulse shrink-0 drop-shadow-md" />
          <span className="text-center leading-none">
            DEMO ÉDUCATIF : NE TRANSFÉREZ AUCUN ARGENT RÉEL. NON AFFILIÉ À 1XBET OU AUTRES SERVICES.
          </span>
        </div>
        {/* Global Sidebar Trigger with refined Elite styling */}
        <div className="absolute left-4 top-16 z-50">
          <SidebarTrigger className="h-10 w-10 bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all rounded-xl shadow-xl backdrop-blur-md flex items-center justify-center">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background selection:bg-primary/30 selection:text-white pt-2 sm:pt-4">
          {container ? (
            <div className={"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12" + (contentClassName ? ` ${contentClassName}` : "")}>
              {content}
            </div>
          ) : (
            content
          )}
        </main>
        {/* Subtle footer indicator */}
        <div className="py-6 px-8 border-t border-white/5 text-center bg-black/20">
          <p className="text-[10px] text-muted-foreground/40 uppercase font-black tracking-[0.5em]">
            DemoBet Financial Intermediary System v2.1.0-ELITE
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}