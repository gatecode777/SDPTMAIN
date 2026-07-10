import React from "react";
import { features, lenderFeaturesIconMap } from "@/constants/lenders/features";
import SectionHeading from "@/components/business/SectionHeading";
import Card from "@/components/business/Card";

export default function Features() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="Marketplace Benefits"
          title="Why lenders choose our platform"
          subtitle="We focus on credit verification depth, instant delivery, and robust B2B LMS integrations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {features.map((feat, index) => {
            const IconComp = lenderFeaturesIconMap[feat.iconName] || lenderFeaturesIconMap.UserCheck;
            return (
              <Card 
                key={index}
                className="flex flex-col items-start p-8 border border-slate-100 bg-white"
              >
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-6 shadow-sm border border-blue-100/40">
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="text-[17px] font-bold text-slate-900 tracking-tight mb-2.5 font-['Albert_Sans']">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#666] leading-relaxed font-['Poppins']">
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
