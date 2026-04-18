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
      <SidebarInset className={className}>
        <div className="w-full bg-destructive text-destructive-foreground px-4 py-3 flex items-center justify-center gap-3 text-sm font-bold shadow-md z-50">
          <AlertTriangle className="h-5 w-5 animate-pulse shrink-0" />
          <span className="text-center">
            ATTENTION: DEMO APPLICATION. CECI EST UN CLONE À BUT ÉDUCATIF. NE TRANSFEREZ AUCUN FOND RÉEL. NON AFFILIÉ À 1XBET.
          </span>
        </div>
        <div className="absolute left-2 top-14 z-20">
          <SidebarTrigger />
        </div>
        <div className="flex-1 overflow-auto">
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