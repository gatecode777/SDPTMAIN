import React from "react";
import { securityFeatures, securityIconMap } from "@/constants/platform/security";
import SectionHeading from "@/components/business/SectionHeading";
import Card from "@/components/business/Card";

export default function Security() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="Compliance & Privacy"
          title="Security Built Into Every Layer"
          subtitle="We align our code protocols with global regulatory checklists to secure enterprise payment data."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {securityFeatures.map((feat, index) => {
            const IconComp = securityIconMap[feat.iconName] || securityIconMap.Key;
            return (
              <Card 
                key={index}
                className="flex flex-col items-start p-8 border border-slate-100 bg-white"
              >
                <div className={`p-3 rounded-2xl ${feat.color} mb-6`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="text-[17px] font-bold text-slate-900 tracking-tight mb-3 font-['Albert_Sans']">
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
