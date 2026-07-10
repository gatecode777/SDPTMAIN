"use client";

import React from "react";
import { motion } from "framer-motion";
import SearchBar from "./SearchBar";

export default function DirectoryHero() {
  return (
    <section className="relative py-24 md:py-32 bg-slate-50 border-b border-slate-100 text-center flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,180,216,0.06),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.04),transparent_50%)]" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold tracking-widest uppercase mb-4 text-[#102E63] bg-[#102E63]/5 px-4 py-1.5 rounded-full border border-[#102E63]/10"
        >
          Business Directory
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-[64px] font-bold tracking-tight text-[#102E63] leading-[1.1] max-w-4xl font-['Albert_Sans']"
        >
          Discover <span className="text-[#00B4D8]">1,250+</span> verified <br className="hidden sm:inline" />
          businesses across India
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-[18px] text-[#666] leading-relaxed max-w-2xl mt-6 mb-10 font-['Poppins']"
        >
          Access authenticated profiles, verified PAN/GST details, and direct contact widgets of leading local service providers, retailers, and agencies across multiple industries.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full flex justify-center"
        >
          <SearchBar />
        </motion.div>
      </div>
    </section>
  );
}
