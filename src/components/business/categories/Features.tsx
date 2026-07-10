import React from "react";
import { features, directoryFeaturesIconMap } from "@/constants/features";
import SectionHeading from "@/components/business/SectionHeading";
import Card from "@/components/business/Card";

export default function Features() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="Why Our Directory"
          title="Why choose our directory"
          subtitle="We focus on quality and security, ensuring you connect with genuine business entities."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {features.map((feat, index) => {
            const IconComp = directoryFeaturesIconMap[feat.iconName] || directoryFeaturesIconMap.ShieldCheck;
            return (
              <Card 
                key={index}
                className="flex flex-col items-start p-8 border border-slate-100 bg-white"
              >
                <div className={`p-3 rounded-2xl ${feat.color} mb-6`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-[18px] font-bold text-slate-900 tracking-tight mb-3 font-['Albert_Sans']">
                  {feat.title}
                </h3>
                <p className="text-[14px] text-[#666] leading-relaxed font-['Poppins']">
                  {feat.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
