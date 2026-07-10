"use client";

import React from "react";
import { motion } from "framer-motion";
import { Landmark, Wallet, ShieldAlert, CheckCircle, Clock } from "lucide-react";

export default function FloatingCards() {
  return (
    <div className="relative w-full max-w-[480px] h-[460px] flex items-center justify-center select-none font-['Poppins']">
      {/* Glow highlight */}
      <div className="absolute w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Card 1 - Ledger Engine (Deep Navy background, floats top-left) */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 left-4 w-[280px] bg-slate-900 border border-white/10 p-5 rounded-2xl shadow-2xl z-10 text-white"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 text-[#00B4D8] rounded-xl border border-blue-500/20">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-white tracking-wide uppercase">Ledger Engine</h4>
            <span className="text-[10px] text-slate-500">Double-entry accounting</span>
          </div>
        </div>
        
        <div className="space-y-2.5 text-[11px] font-mono border-t border-white/5 pt-4">
          <div className="flex justify-between text-slate-400">
            <span>Asset (Merchant Wallet)</span>
            <span className="text-green-400 font-bold">DR ₹1,20,000</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Liability (Accrued Payout)</span>
            <span className="text-blue-400 font-bold">CR ₹1,20,000</span>
          </div>
          <div className="flex justify-between text-slate-500 text-[10px] pt-1">
            <span>Status: Balanced</span>
            <span>Ref: TX-90812</span>
          </div>
        </div>
      </motion.div>

      {/* Card 2 - Wallet Balance (White background, floats center-right, overlaps ledger) */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-36 right-4 w-[280px] bg-white border border-slate-200/80 p-5 rounded-2xl shadow-2xl z-20 text-slate-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-slate-800 tracking-wide uppercase">Digital Wallet</h4>
            <span className="text-[10px] text-[#666]">Real-time balance</span>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">₹3,42,500.00</span>
        </div>

        <div className="border-t border-slate-100 pt-3 space-y-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Recent Transaction</span>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-700 font-semibold">GPay Deposit</span>
            <span className="text-green-600 font-bold">+₹2,500.00</span>
          </div>
        </div>
      </motion.div>

      {/* Card 3 - Compliance Audit (Translucent Glass/Black background, floats bottom-left) */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-6 left-8 w-[250px] bg-slate-950/95 border border-white/10 p-4 rounded-xl shadow-xl z-30 text-slate-300 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-white">Compliance Status</span>
        </div>

        <div className="space-y-2 text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Merchant GSTIN</span>
            <span className="inline-flex items-center gap-1 text-green-400 font-semibold">
              <CheckCircle className="w-3 h-3" /> Verified
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Risk Audit</span>
            <span className="inline-flex items-center gap-1 text-amber-400 font-semibold animate-pulse">
              <Clock className="w-3 h-3" /> Pending
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
