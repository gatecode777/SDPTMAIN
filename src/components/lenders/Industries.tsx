import React from "react";
import SectionHeading from "@/components/business/SectionHeading";

export default function Industries() {
  const industriesList = [
    "Retail Banks",
    "NBFCs",
    "DSA Networks",
    "Housing Finance",
    "Micro Finance",
    "Cooperative Banks",
    "Fintech Startups",
    "Insurance Providers",
    "Investment Firms",
    "Asset Managers"
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="Partner Ecosystem"
          title="Industries we work with"
          subtitle="We support diversified integration targets across the retail and commercial credit landscapes."
        />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {industriesList.map((ind, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center p-6 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 hover:border-[#102E63]/20 transition-all text-slate-700 font-bold text-xs uppercase tracking-wider text-center font-['Poppins'] cursor-default"
            >
              {ind}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
