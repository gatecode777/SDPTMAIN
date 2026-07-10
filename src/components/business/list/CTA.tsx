"use client";

import React from "react";
import Button from "@/components/business/Button";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

export default function CTA() {
  const router = useRouter();
  const { status } = useSession();

  const handleStartFree = () => {
    if (status === "authenticated") {
      router.push("/builder/wizard");
    } else {
      window.dispatchEvent(new Event("openAuthModal"));
    }
  };

  return (
    <section className="py-24 bg-[#102E63] text-white text-center relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,180,216,0.1),transparent_40%)]" />
      
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight font-['Albert_Sans']">
          List your business today. It's free.
        </h2>
        <p className="text-slate-300 max-w-xl text-base md:text-lg mb-10 font-['Poppins']">
          Take less than 60 seconds to create your verified listing, generate your smart brand website, and connect directly with local clients.
        </p>
        <Button 
          variant="primary" 
          onClick={handleStartFree}
          className="bg-white hover:bg-slate-50 text-[#102E63] font-bold px-8 py-4 shadow-lg shadow-white/5 cursor-pointer"
        >
          Get Started Free →
        </Button>
      </div>
    </section>
  );
}
