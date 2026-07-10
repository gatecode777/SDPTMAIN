import React from "react";
import { testimonials } from "@/constants/data";
import SectionHeading from "./SectionHeading";
import Card from "./Card";
import { Quote } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading
          badge="Testimonials"
          title="What business owners on SDPT say."
          subtitle="Discover how verified merchants and service providers are scaling their operations using our marketplace."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, index) => {
            const initials = test.name.split(" ").map(n => n[0]).join("");
            return (
              <Card key={index} className="flex flex-col justify-between p-8 min-h-[280px]">
                <div>
                  <Quote className="w-8 h-8 text-blue-100 mb-4 fill-blue-50" />
                  <p className="text-[15px] text-[#666] leading-relaxed mb-6 italic">
                    "{test.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-slate-900">{test.name}</h4>
                    <p className="text-xs text-[#666]">{test.role} • {test.location}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
