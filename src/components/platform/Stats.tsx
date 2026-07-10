import React from "react";
import { stats } from "@/constants/platform/stats";
import SectionHeading from "@/components/business/SectionHeading";
import Card from "@/components/business/Card";

export default function Stats() {
  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="Metrics & Performance"
          title="Everything connected through one intelligent platform"
          subtitle="We operate with bank-grade reliability, serving high-volume transactions with strict compliance metrics."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {stats.map((stat, index) => (
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
