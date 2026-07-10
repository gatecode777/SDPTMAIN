import React from "react";
import { categories, directoryCategoryIcons } from "@/constants/categories";
import SectionHeading from "@/components/business/SectionHeading";
import Card from "@/components/business/Card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CategoryGrid() {
  return (
    <section className="py-20 lg:py-28 bg-[#fafafa]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="Browse by Category"
          title="Verified businesses across major industries"
          subtitle="Explore highly specialized services offered by verified merchants and local service agencies."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => {
            const IconComp = directoryCategoryIcons[cat.iconName] || directoryCategoryIcons.Briefcase;
            return (
              <Card 
                key={index}
                className="flex flex-col justify-between p-8 group border border-slate-100 bg-white"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-sm border border-blue-100 group-hover:bg-[#102E63] group-hover:text-white transition-all duration-300">
                    <IconComp className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-[18px] font-bold text-slate-900 tracking-tight mb-2 group-hover:text-blue-600 transition-colors font-['Albert_Sans']">
                    {cat.name}
                  </h3>
                  
                  <p className="text-[13px] text-[#666] leading-relaxed mb-6 font-['Poppins']">
                    {cat.description}
                  </p>
                </div>

                <Link 
                  href={cat.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider font-['Poppins'] cursor-pointer"
                >
                  <span>Explore Directory</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
