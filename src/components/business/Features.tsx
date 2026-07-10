import React from "react";
import { features, iconMap } from "@/constants/data";
import SectionHeading from "./SectionHeading";
import Card from "./Card";

export default function Features() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading
          badge="Why SDPT"
          title="Three things that no other marketplace in India offers."
          subtitle="Built to prioritize business independence and consumer trust with modern SaaS features."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, index) => {
            const IconComp = iconMap[feat.iconName] || iconMap.CheckCircle;
            return (
              <Card key={index} className="flex flex-col items-start p-8">
                <div className={`p-3 rounded-2xl ${feat.color} mb-6`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                  {feat.title}
                </h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
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
