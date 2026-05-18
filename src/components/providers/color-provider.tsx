"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const themeColor = useUIStore((state) => state.themeColor);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      
      root.style.setProperty("--primary", `oklch(${themeColor})`);
      root.style.setProperty("--sidebar-primary", `oklch(${themeColor})`);
      
      
      root.style.setProperty("--ring", `oklch(${themeColor} / 0.5)`);
    }
  }, [themeColor]);

  return <>{children}</>;
}
