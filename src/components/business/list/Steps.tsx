"use client";

import React from "react";
import { steps, stepsIconMap } from "@/constants/steps";
import Card from "@/components/business/Card";
import SectionHeading from "@/components/business/SectionHeading";

export default function Steps() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="Onboarding"
          title="3 steps. Less than 60 seconds."
          subtitle="Launching your custom business website is faster than making a cup of tea. Here is how it works."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step) => {
            const IconComp = stepsIconMap[step.iconName] || stepsIconMap.Type;
            return (
              <Card key={step.id} className="p-8 flex flex-col items-center text-center relative group">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-6 shadow-sm border border-blue-100 group-hover:bg-[#102E63] group-hover:text-white transition-all duration-300">
                  {step.id}
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 text-slate-700 mb-4 group-hover:bg-slate-100 transition-colors">
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-[18px] font-bold text-slate-900 mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-[14px] text-[#666] leading-relaxed">
                  {step.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
