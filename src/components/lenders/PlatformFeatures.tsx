import React from "react";
import { platformFeatures, platformFeaturesIconMap } from "@/constants/lenders/platformFeatures";
import SectionHeading from "@/components/business/SectionHeading";
import Card from "@/components/business/Card";

export default function PlatformFeatures() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="Product Tools"
          title="Enterprise Platform Features"
          subtitle="Unlock advanced B2B digital capabilities designed to simplify client distribution and tracking workflows."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {platformFeatures.map((feat, index) => {
            const IconComp = platformFeaturesIconMap[feat.iconName] || platformFeaturesIconMap.LayoutDashboard;
            return (
              <Card 
                key={index}
                className="p-6 border border-slate-100 bg-white group flex flex-col justify-between"
              >
                <div>
                  <div className="p-2.5 bg-slate-50 text-slate-700 rounded-xl mb-4 w-fit group-hover:bg-[#102E63] group-hover:text-white transition-colors duration-300">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-[14px] font-bold text-slate-900 mb-1.5 font-['Albert_Sans']">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#666] leading-relaxed font-['Poppins']">
                    {feat.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
