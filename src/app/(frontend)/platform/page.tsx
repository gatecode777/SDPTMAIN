import React from "react";
import PlatformPageClient from "@/components/platform/PlatformPageClient";

export const metadata = {
  title: "Platform Infrastructure - SDPT Business Tools",
  description: "Unified double-entry ledger, digital wallet operations, customer directories, and API webhook web integration dashboards.",
};

export default function PlatformPage() {
  return (
    <div className="directory-page min-h-screen bg-white antialiased text-slate-800">
      <PlatformPageClient />
    </div>
  );
}
