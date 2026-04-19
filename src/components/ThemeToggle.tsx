import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
interface ThemeToggleProps {
  className?: string;
}
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className={cn(
        "h-10 w-10 bg-[#1e3a8a]/40 border border-white/10 rounded-xl transition-all duration-200 hover:bg-[#1e3a8a]/60 active:scale-90 z-50",
        className
      )}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-primary animate-in fade-in zoom-in duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-primary animate-in fade-in zoom-in duration-300" />
      )}
    </Button>
  );
}