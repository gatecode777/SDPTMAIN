import React from "react";
import { products, iconMap } from "@/constants/data";
import SectionHeading from "./SectionHeading";
import Card from "./Card";
import { ArrowRight } from "lucide-react";

export default function Products() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading
          badge="Product Ecosystem"
          title="Wherever you start, you're on SDPT."
          subtitle="A unified suite of products to scale, invoice, digitize, and finance your business operations."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod, index) => {
            const IconComp = iconMap[prod.logoName] || iconMap.QrCode;
            return (
              <Card key={index} className="flex flex-col justify-between p-8 group">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-500/10 group-hover:scale-110 transition-transform duration-300">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {prod.name}
                  </h3>
                  <p className="text-[14px] text-[#666] leading-relaxed mb-6">
                    {prod.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[13px] font-bold text-blue-600 group-hover:gap-2 transition-all cursor-pointer">
                  <span>{prod.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
