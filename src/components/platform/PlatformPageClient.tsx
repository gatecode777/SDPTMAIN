"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Hero from "@/components/platform/Hero";
import Stats from "@/components/platform/Stats";
import Modules from "@/components/platform/Modules";
import Capabilities from "@/components/platform/Capabilities";
import Timeline from "@/components/platform/Timeline";
import Benefits from "@/components/platform/Benefits";
import Security from "@/components/platform/Security";
import Industries from "@/components/platform/Industries";
import Testimonials from "@/components/platform/Testimonials";
import FAQ from "@/components/platform/FAQ";
import CTA from "@/components/platform/CTA";

export default function PlatformPageClient() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/?login=true");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-['Poppins']">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#102E63] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Verifying credentials...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Redirecting...
  }

  return (
    <>
      <Hero />
      <Stats />
      <Modules />
      <Capabilities />
      <Timeline />
      <Benefits />
      <Security />
      <Industries />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
