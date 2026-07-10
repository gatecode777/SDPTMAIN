"use client";

import React from "react";
import { motion } from "framer-motion";
import { stats } from "@/constants/lenders/stats";

export default function TrustBar() {
  return (
    <section className="py-12 bg-white border-b border-slate-100 shadow-sm relative z-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 items-center text-center">
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#102E63] font-['Albert_Sans'] mb-1">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wide font-['Poppins']">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
