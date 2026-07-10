import React from "react";
import { loanCategories, loanCategoriesIconMap } from "@/constants/lenders/loanCategories";
import SectionHeading from "@/components/business/SectionHeading";
import Card from "@/components/business/Card";

export default function LoanCategories() {
  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-100">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="Product Coverage"
          title="Products we support"
          subtitle="Match inquiries with custom risk guidelines across a diverse catalog of credit schemes."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loanCategories.map((cat, index) => {
            const IconComp = loanCategoriesIconMap[cat.iconName] || loanCategoriesIconMap.User;
            return (
              <Card 
                key={index}
                className="p-6 border border-slate-100 bg-white group flex flex-col justify-between"
              >
                <div>
                  <div className="p-2.5 bg-slate-50 text-slate-700 rounded-xl mb-4 w-fit group-hover:bg-[#102E63] group-hover:text-white transition-colors duration-300">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="text-[15px] font-bold text-slate-900 mb-1.5 font-['Albert_Sans']">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#666] leading-relaxed font-['Poppins']">
                    {cat.description}
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
