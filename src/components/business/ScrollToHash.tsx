"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          // Adjust scroll with a smooth transition
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    // Run after a short delay to ensure React DOM hydration is fully completed
    const t = setTimeout(handleScroll, 500);

    // Watch for internal hash transitions
    window.addEventListener("hashchange", handleScroll);

    return () => {
      clearTimeout(t);
      window.removeEventListener("hashchange", handleScroll);
    };
  }, [pathname]);

  return null;
}
