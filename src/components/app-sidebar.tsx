import React from "react";
import { Home, PlusCircle, ArrowDownToLine, MessageSquareWarning, ShieldCheck, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
const navItems = [
  { label: "Tableau de bord", path: "/", icon: Home },
  { label: "Dépôt", path: "/deposit", icon: PlusCircle },
  { label: "Retrait", path: "/withdraw", icon: ArrowDownToLine },
  { label: "Réclamation", path: "/support", icon: MessageSquareWarning },
];
export function AppSidebar(): JSX.Element {
  const { pathname } = useLocation();
  const { signOut } = useAuthActions();
  const handleSignOut = () => {
    if ("vibrate" in navigator) navigator.vibrate(50);
    void signOut();
    toast.success("Déconnexion réussie !");
  };
  return (
    <Sidebar className="border-r border-white/5 bg-[#1e3a8a]/10">
      <SidebarHeader className="border-b border-white/5 px-4 py-8 bg-[#1e3a8a]/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#1e40af] to-[#3b82f6] flex items-center justify-center shadow-lg shadow-blue-900/40">
            <ShieldCheck className="text-white h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white uppercase leading-none">DemoBet</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1 italic">ELITE NAVY</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-6 bg-transparent">
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path} className="px-3 mb-1">
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.path}
                  className={`py-7 px-4 rounded-xl transition-all duration-300 border ${
                    pathname === item.path
                      ? "bg-primary/10 border-primary/40 text-primary"
                      : "hover:bg-white/5 border-transparent text-muted-foreground hover:text-white"
                  }`}
                >
                  <Link to={item.path} className="flex items-center gap-4">
                    <item.icon className={`h-5 w-5 ${pathname === item.path ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-white/5 p-6 bg-[#1e3a8a]/10 space-y-4">
        <Button 
          onClick={handleSignOut}
          className="w-full btn-orange h-12 rounded-xl group relative overflow-hidden"
        >
          <LogOut className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          <span className="font-black uppercase tracking-widest text-[11px]">Déconnexion</span>
        </Button>
        <div className="glass-dark rounded-lg p-3 text-center border-white/5">
          <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-60">
            Secure Navy System v3.0
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}