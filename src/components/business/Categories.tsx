import React from "react";
import { categories, iconMap } from "@/constants/data";
import SectionHeading from "./SectionHeading";

export default function Categories() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="Marketplace Categories"
          title="Twelve categories. Thousands of verified businesses."
          subtitle="Explore highly specialized services offered by verified service providers across India."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, index) => {
            const IconComp = iconMap[cat.iconName] || iconMap.Briefcase;
            return (
              <div 
                key={index}
                className="flex items-center gap-3 px-5 py-4 bg-white border border-gray-100/80 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-blue-50/50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                  <IconComp className="w-5 h-5" />
                </div>
                <span className="text-[14px] font-bold text-slate-800 leading-tight">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
