"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PricingHero() {
  return (
    <section className="relative pt-24 pb-12 bg-white text-center flex flex-col items-center justify-center overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold tracking-widest uppercase mb-4 text-[#102E63] bg-blue-50 px-4 py-1.5 rounded-full"
        >
          Pricing
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-[#102E63] leading-[1.1] max-w-4xl font-['Albert_Sans']"
        >
          Simple pricing for every business
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-[#666] leading-relaxed max-w-xl mt-4 font-['Poppins']"
        >
          Start free. Upgrade when you're ready.
        </motion.p>
      </div>
    </section>
  );
}
