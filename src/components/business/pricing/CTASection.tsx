"use client";

import React from "react";
import Button from "@/components/business/Button";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="py-24 bg-[#102E63] text-white text-center relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,180,216,0.1),transparent_40%)]" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight font-['Albert_Sans']">
          Ready to grow your business?
        </h2>
        
        <p className="text-slate-300 max-w-xl text-base md:text-lg mb-10 font-['Poppins']">
          Select the pricing plan that matches your current scale and start generating verified customer reviews, local search presence, and direct WhatsApp lead bookings today.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button 
            variant="primary" 
            onClick={() => router.push("/business/list")}
            className="bg-white hover:bg-slate-50 text-[#102E63] font-bold px-8 py-4 shadow-lg shadow-white/5 w-full sm:w-auto"
          >
            Get Started
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => router.push("/contact")}
            className="border border-white/30 text-white bg-transparent hover:bg-white/10 font-bold px-8 py-4 w-full sm:w-auto"
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
}
