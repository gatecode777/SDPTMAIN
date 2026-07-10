import React from "react";
import { directoryStats } from "@/constants/directoryStats";
import Card from "@/components/business/Card";

export default function Stats() {
  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {directoryStats.map((stat, index) => (
            <Card 
              key={index}
              className="p-6 text-center flex flex-col items-center justify-center border border-slate-100 bg-white"
            >
              <span className="text-4xl md:text-5xl font-bold tracking-tight text-[#102E63] mb-2 font-['Albert_Sans']">
                {stat.value}
              </span>
              <span className="text-[13px] font-bold text-slate-800 uppercase tracking-wide mb-1 font-['Poppins']">
                {stat.label}
              </span>
              <span className="text-xs text-[#666] font-medium font-['Poppins']">
                {stat.description}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
