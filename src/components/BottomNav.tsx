import React from "react";
import { Home, PlusCircle, ArrowDownToLine, MessageSquareWarning } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
const navItems = [
  { label: "Accueil", path: "/", icon: Home },
  { label: "Dépôt", path: "/deposit", icon: PlusCircle },
  { label: "Retrait", path: "/withdraw", icon: ArrowDownToLine },
  { label: "Support", path: "/support", icon: MessageSquareWarning },
];
export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
      {/* Visual background with blur */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl border-t border-white/5 bottom-nav-glass" />
      <div className="relative flex items-center justify-around px-2 pt-3 pb-safe-bottom h-[72px]">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 w-full transition-all duration-300 active:scale-90",
                isActive ? "text-primary nav-active" : "text-muted-foreground/60"
              )}
            >
              <div className={cn(
                "p-1 rounded-lg transition-all duration-300",
                isActive && "bg-primary/10 shadow-[0_0_15px_rgba(234,88,12,0.2)]"
              )}>
                <item.icon className={cn("h-5 w-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-tighter",
                isActive ? "opacity-100" : "opacity-60"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 h-0.5 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(234,88,12,0.8)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}