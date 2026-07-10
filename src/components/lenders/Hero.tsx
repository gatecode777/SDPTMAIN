"use client";

import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/business/Button";
import { useRouter } from "next/navigation";
import { ShieldCheck, User, Landmark, Sparkles, CheckCircle } from "lucide-react";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative py-20 lg:py-28 bg-[#102E63] text-white overflow-hidden flex items-center">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,180,216,0.15),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.1),transparent_50%)]" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column - Pitch */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4 text-[#00B4D8] bg-[#00B4D8]/10 px-4 py-1.5 rounded-full border border-[#00B4D8]/20 font-['Poppins']"
            >
              For Banks • NBFCs • Private Lenders
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-white leading-[1.1] max-w-2xl font-['Albert_Sans']"
            >
              Grow Your Lending Business with <span className="text-[#00B4D8]">Qualified Borrowers</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mt-6 font-['Poppins']"
            >
              Join our verified lending marketplace and receive high-intent customer inquiries from individuals and businesses actively looking for loans.
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
                  const el = document.getElementById("lender-signup");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-[#00B4D8] hover:bg-[#0096b4] text-[#102E63] font-bold px-8 py-4 shadow-lg shadow-[#00B4D8]/10 w-full sm:w-auto text-center"
              >
                Become a Lending Partner
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push("/contact")}
                className="border border-white/20 text-white bg-transparent hover:bg-white/10 font-bold px-8 py-4 w-full sm:w-auto text-center"
              >
                Talk to Sales
              </Button>
            </motion.div>
          </div>

          {/* Right Column - Premium Dashboard Illustration */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Background glowing sphere */}
            <div className="absolute w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-[420px] bg-slate-900/90 rounded-2xl border border-white/10 p-6 shadow-2xl relative"
            >
              {/* Browser Header Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">SDPT LMS v1.0</span>
              </div>

              {/* Main App Content Mock */}
              <div className="space-y-4 font-['Poppins']">
                {/* Lead Card 1 */}
                <div className="bg-slate-800/80 border border-white/5 p-4 rounded-xl relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold bg-[#00B4D8]/10 text-[#00B4D8] border border-[#00B4D8]/20 px-2 py-0.5 rounded">
                      NEW LEAD
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">2 mins ago</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">Aarav Sharma</h4>
                  <div className="grid grid-cols-2 gap-y-2 mt-3 text-[10px] text-slate-300">
                    <div>
                      <span className="text-slate-500 block">LOAN TYPE</span>
                      <span className="font-semibold text-white">Business Loan</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">LOAN AMOUNT</span>
                      <span className="font-semibold text-[#00B4D8]">₹15,00,000</span>
                    </div>
                  </div>
                </div>

                {/* Score Widget */}
                <div className="bg-slate-800/80 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 text-green-400 rounded-lg">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">Borrower Score</span>
                      <span className="text-xs font-bold text-white">785 (Excellent)</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-green-400">CREDIT OK</span>
                </div>

                {/* Manager widget */}
                <div className="bg-slate-800/80 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-[11px]">
                      AM
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">Assigned Manager</span>
                      <span className="text-xs text-slate-300">Amit R. (DSA Lead)</span>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </div>
              </div>

              {/* Floating micro card - Top Right */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 bg-white text-slate-900 border border-slate-100 rounded-xl p-3.5 shadow-xl flex items-center gap-3 z-20 pointer-events-none"
              >
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block font-bold">DISBURSED</span>
                  <span className="text-xs font-bold text-slate-800">₹500Cr+ Facilitated</span>
                </div>
              </motion.div>

              {/* Floating micro card - Bottom Left */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute -bottom-6 -left-6 bg-white text-slate-900 border border-slate-100 rounded-xl p-3 shadow-xl flex items-center gap-2.5 z-20 pointer-events-none"
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-[10px] font-bold text-slate-800">PAN & GST Vetted</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
