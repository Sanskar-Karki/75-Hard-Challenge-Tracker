"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 🛡️ Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300",
        "bg-zinc-100 hover:bg-zinc-200 ring-1 ring-zinc-200 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 dark:ring-zinc-800",
        "active:scale-95 cursor-pointer z-50 group shadow-sm"
      )}
      aria-label="Toggle Theme"
    >
      <div className="relative h-5 w-5">
        <Sun 
          className={cn(
            "absolute inset-0 h-5 w-5 transform transition-all duration-500",
            isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100 text-amber-500"
          )} 
        />
        <Moon 
          className={cn(
            "absolute inset-0 h-5 w-5 transform transition-all duration-500",
            isDark ? "scale-100 rotate-0 opacity-100 text-indigo-400" : "scale-0 -rotate-90 opacity-0"
          )} 
        />
      </div>
      
      {/* 🏙️ Glow Effect on Hover */}
      <div className={cn(
        "absolute inset-0 -z-10 rounded-xl opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-40",
        isDark ? "bg-indigo-500" : "bg-amber-500"
      )} />
    </button>
  );
}
