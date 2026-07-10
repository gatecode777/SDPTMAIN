"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  Search, 
  FileText, 
  Star, 
  Phone, 
  Percent, 
  MapPin, 
  ShieldCheck 
} from "lucide-react";
import Button from "./Button";

import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-white">
      {/* Subtle background gradient shapes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-50/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold tracking-wide uppercase border border-blue-100/50">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              Verified • Free to List • PAN/GST
            </span>

            <h1 className="text-3xl sm:text-[40px] lg:text-[64px] font-bold tracking-tight text-slate-900 leading-[1.08] text-left">
              Find <span className="text-orange-500">verified</span> businesses.<br />
              Or be the next one customers find.
            </h1>

            <p className="text-[18px] text-[#666] leading-relaxed max-w-xl text-left">
              In India's premier B2B directory, every business listing undergoes strict PAN & GST verification. We block spam and fake reviews so you can focus on building trust and generating high-quality customer leads.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Button 
                variant="primary"
                onClick={() => router.push("/business/list")}
                className="cursor-pointer"
              >
                List your business — Free
              </Button>
              <Button 
                variant="secondary"
                onClick={() => router.push("/")}
                className="cursor-pointer"
              >
                Search Marketplace
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-y-3 gap-x-6 pt-4 border-t border-gray-100 w-full">
              <div className="flex items-center gap-2 text-sm text-[#666]">
                <Check className="w-4 h-4 text-green-500 stroke-[3]" />
                <span>No listing fee</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#666]">
                <Check className="w-4 h-4 text-green-500 stroke-[3]" />
                <span>Verified at signup</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#666]">
                <Check className="w-4 h-4 text-green-500 stroke-[3]" />
                <span>Reviews from real customers</span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full max-w-[440px] bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden pointer-events-none"
            >
              {/* Browser Header Bar */}
              <div className="bg-slate-50 px-5 py-3 border-b border-gray-100 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="bg-white border border-gray-200/60 rounded-lg text-[11px] text-gray-400 px-3 py-1 flex-1 text-center font-mono">
                  sdpt.com/listings
                </div>
              </div>

              {/* Browser Body */}
              <div className="p-6 space-y-6">
                {/* Search Bar Mockup */}
                <div className="relative">
                  <div className="w-full bg-slate-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-3">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400 font-medium">Search local service providers...</span>
                  </div>
                </div>

                {/* Grid of Six Buttons */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Search", icon: Search, color: "text-blue-500 bg-blue-50/50" },
                    { label: "Listings", icon: FileText, color: "text-purple-500 bg-purple-50/50" },
                    { label: "Reviews", icon: Star, color: "text-amber-500 bg-amber-50/50" },
                    { label: "Contact", icon: Phone, color: "text-green-500 bg-green-50/50" },
                    { label: "Offers", icon: Percent, color: "text-orange-500 bg-orange-50/50" },
                    { label: "Location", icon: MapPin, color: "text-red-500 bg-red-50/50" },
                  ].map((item, index) => {
                    const IconComp = item.icon;
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center justify-center p-4 border border-gray-100/50 rounded-2xl bg-white shadow-sm"
                      >
                        <div className={`p-2.5 rounded-xl ${item.color} mb-2`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700">{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Status Bar */}
                <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-slate-700">GST Registration Verified</span>
                  </div>
                  <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-md">Live</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
