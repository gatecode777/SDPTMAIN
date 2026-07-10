import React from "react";
import { testimonials } from "@/constants/lenders/testimonials";
import SectionHeading from "@/components/business/SectionHeading";
import Card from "@/components/business/Card";
import { Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="Success Stories"
          title="What our partners say"
          subtitle="Discover how leading NBFCs and financial consultants disburse loan volumes faster."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((test, index) => (
            <Card 
              key={index}
              hoverLift={true}
              className="p-8 border border-slate-100 bg-white relative flex flex-col justify-between"
            >
              <Quote className="w-8 h-8 text-blue-100 absolute top-6 right-8 pointer-events-none" />
              
              <p className="text-[14px] text-slate-700 italic leading-relaxed mb-8 relative z-10">
                "{test.quote}"
              </p>
              
              <div className="flex items-center gap-3.5 border-t border-slate-50 pt-4">
                <div className="w-10 h-10 rounded-full bg-[#102E63] text-white flex items-center justify-center font-bold text-sm">
                  {test.avatarText}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {test.name}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium block">
                    {test.position}, {test.company}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
