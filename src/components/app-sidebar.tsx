import React from "react";
import { Home, PlusCircle, ArrowDownToLine, MessageSquareWarning, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarSeparator,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
const navItems = [
  { label: "Tableau de bord", path: "/", icon: Home },
  { label: "Dépôt", path: "/deposit", icon: PlusCircle },
  { label: "Retrait", path: "/withdraw", icon: ArrowDownToLine },
  { label: "Réclamation", path: "/support", icon: MessageSquareWarning },
];
export function AppSidebar(): JSX.Element {
  const { pathname } = useLocation();
  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="text-primary-foreground h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">DemoBet Pay</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path} className="px-2">
                <SidebarMenuButton asChild isActive={pathname === item.path} className="py-6 px-4">
                  <Link to={item.path}>
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="text-[10px] text-muted-foreground uppercase font-semibold text-center">
          Système Sécurisé Demo
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}