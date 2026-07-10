"use client";

import React from "react";
import Button from "@/components/business/Button";
import { useRouter } from "next/navigation";

export default function BusinessCTA() {
  const router = useRouter();

  return (
    <section className="py-24 bg-[#102E63] text-white text-center relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,180,216,0.1),transparent_40%)]" />
      <div className="absolute top-1/2 left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-4 right-12 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight font-['Albert_Sans']">
          Own a business?
        </h2>
        
        <p className="text-slate-300 max-w-xl text-base md:text-lg mb-10 font-['Poppins']">
          Join our premium verified directory, get found by thousands of customers, and capture high-converting leads directly on your phone.
        </p>

        <Button 
          variant="primary" 
          onClick={() => router.push("/business/list")}
          className="bg-white hover:bg-slate-50 text-[#102E63] font-bold px-8 py-4 shadow-lg shadow-white/5"
        >
          List Your Business
        </Button>
      </div>
    </section>
  );
}
