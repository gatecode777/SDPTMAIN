"use client";

import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/business/Button";
import FloatingCards from "./FloatingCards";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative py-20 lg:py-28 bg-[#102E63] text-white overflow-hidden flex items-center">
      {/* Background radial effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,180,216,0.12),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.08),transparent_50%)]" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Onboarding copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4 text-[#00B4D8] bg-[#00B4D8]/10 px-4 py-1.5 rounded-full border border-[#00B4D8]/20 font-['Poppins']"
            >
              Financial Infrastructure Platform
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-white leading-[1.1] max-w-2xl font-['Albert_Sans']"
            >
              One Platform. <br />
              <span className="text-[#00B4D8]">Everything Your Business Needs to Scale.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mt-6 font-['Poppins']"
            >
              Build, automate and manage your business operations using a unified platform designed for payments, lending, customer management, compliance and analytics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto"
            >
              <Button
                variant="primary"
                onClick={() => {
                  const el = document.getElementById("platform-modules");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-[#00B4D8] hover:bg-[#0096b4] text-[#102E63] font-bold px-8 py-4 shadow-lg shadow-[#00B4D8]/10 w-full sm:w-auto text-center"
              >
                Explore Platform
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push("/contact")}
                className="border border-white/20 text-white bg-transparent hover:bg-white/10 font-bold px-8 py-4 w-full sm:w-auto text-center"
              >
                Book Demo
              </Button>
            </motion.div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xs text-slate-400 mt-6 font-medium uppercase tracking-wider font-['Poppins']"
            >
              Trusted by startups, SMEs and enterprise businesses.
            </motion.span>
          </div>

          {/* Right Column - Overlapping Floating Cards */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <FloatingCards />
          </div>

        </div>
      </div>
    </section>
  );
}
