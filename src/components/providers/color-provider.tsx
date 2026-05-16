"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const themeColor = useUIStore((state) => state.themeColor);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      // Overriding the primary color variables from globals.css
      root.style.setProperty("--primary", `oklch(${themeColor})`);
      root.style.setProperty("--sidebar-primary", `oklch(${themeColor})`);
      
      // Also update ring and other related variables if needed
      root.style.setProperty("--ring", `oklch(${themeColor} / 0.5)`);
    }
  }, [themeColor]);

  return <>{children}</>;
}
