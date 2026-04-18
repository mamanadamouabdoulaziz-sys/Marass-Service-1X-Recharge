import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AlertTriangle } from "lucide-react";
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
      <SidebarInset className={`bg-background min-h-screen ${className || ""}`}>
        {/* Anti-Phishing Disclaimer Banner */}
        <div className="sticky top-0 w-full bg-[#E11D48] text-white px-4 py-2 flex items-center justify-center gap-3 text-[11px] sm:text-xs font-black shadow-xl z-[60] border-b border-white/10 uppercase tracking-tighter">
          <AlertTriangle className="h-4 w-4 animate-pulse shrink-0" />
          <span className="text-center">
            DEMO: CECI EST UN CLONE À BUT ÉDUCATIF. NE TRANSFEREZ AUCUN FOND RÉEL. NON AFFILIÉ À 1XBET.
          </span>
        </div>
        <div className="absolute left-2 top-14 z-20">
          <SidebarTrigger className="bg-white/5 border-white/10 text-white hover:bg-white/10" />
        </div>
        <div className="flex-1 overflow-auto bg-background">
          {container ? (
            <div className={"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12" + (contentClassName ? ` ${contentClassName}` : "")}>
              {content}
            </div>
          ) : (
            content
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}