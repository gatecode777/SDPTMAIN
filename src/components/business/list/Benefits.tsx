import React from "react";
import { benefits } from "@/constants/benefits";
import { testimonials } from "@/constants/testimonials";
import { CheckCircle2, Quote } from "lucide-react";
import Card from "@/components/business/Card";

export default function Benefits() {
  return (
    <section className="py-20 lg:py-28 bg-slate-50/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column - Benefits list */}
          <div className="lg:col-span-7 space-y-8">
            <span className="text-xs font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full">
              Benefits
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight max-w-xl font-['Albert_Sans']">
              Everything a small business needs to get found online
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-3.5 items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[15px] font-bold text-slate-800 leading-tight mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-xs text-[#666] leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Testimonials */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {testimonials.map((test, index) => (
              <Card 
                key={index} 
                hoverLift={false} 
                className="bg-blue-50/20 border border-blue-100/30 p-8 rounded-2xl relative"
              >
                <Quote className="w-8 h-8 text-blue-200/40 absolute top-6 right-8 pointer-events-none" />
                <p className="text-[14px] text-slate-800 font-medium leading-relaxed mb-6 relative z-10 italic">
                  "{test.quote}"
                </p>
                <div className="flex items-center justify-between text-xs font-semibold text-[#666]">
                  <span className="text-slate-900 font-bold">{test.author}</span>
                  <span>{test.location}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
