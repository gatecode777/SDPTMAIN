"use client";

import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/business/Button";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

export default function Hero() {
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
    <section className="relative py-24 md:py-32 bg-[#102E63] text-white overflow-hidden text-center flex flex-col items-center justify-center">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,180,216,0.15),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.1),transparent_50%)]" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold tracking-widest uppercase mb-4 text-[#00B4D8] bg-[#00B4D8]/10 px-4 py-1.5 rounded-full border border-[#00B4D8]/20"
        >
          Free — No Credit Card Required
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-[64px] font-bold tracking-tight text-white leading-[1.1] max-w-4xl font-['Albert_Sans']"
        >
          List Your Business on SDPT <br />
          <span className="text-[#00B4D8]">
            — Free AI Website in 60 Seconds
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-[18px] text-slate-300 leading-relaxed max-w-2xl mt-6 font-['Poppins']"
        >
          No coding, no design skills, and no setup fees. Simply enter your business details and let our AI engine generate a high-speed, SEO-optimized landing page, customized QR code, and direct WhatsApp lead buttons in a flash.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center gap-3 mt-10 w-full sm:w-auto"
        >
          <Button 
            variant="primary" 
            onClick={handleStartFree}
            className="bg-[#00B4D8] hover:bg-[#0096b4] text-[#102E63] font-bold shadow-lg shadow-[#00B4D8]/10 px-8 py-4 cursor-pointer"
          >
            Get Started Free →
          </Button>
          <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase font-['Poppins']">
            Trusted by thousands of businesses
          </span>
        </motion.div>
      </div>
    </section>
  );
}
