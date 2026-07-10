import React from "react";
import SectionHeading from "@/components/business/SectionHeading";

export default function Timeline() {
  const steps = [
    { id: 1, title: "Apply to become a partner", desc: "Submit your banking licenses, DSA registrations, or private lending credentials." },
    { id: 2, title: "Verification & onboarding", desc: "Our risk team audits and activates your institutional billing dashboard within 24 hours." },
    { id: 3, title: "Configure filters", desc: "Establish regional filters, select loan product types, and map LMS webhook links." },
    { id: 4, title: "Receive leads", desc: "Qualified, real-time inquiries start loading instantly to your dashboard." }
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="Integration Steps"
          title="Onboarding Process"
          subtitle="Follow these 4 simple steps to integrate your operations and start accepting applications."
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              {/* Connector line for desktop */}
              {index < 3 && (
                <div className="hidden md:block absolute top-[28px] left-[58%] w-[84%] h-[2px] bg-slate-200 z-0" />
              )}
              
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-6 z-10 border-4 border-white shadow-md">
                {step.id}
              </div>
              
              <h3 className="text-[16px] font-bold text-slate-900 mb-2 leading-snug font-['Albert_Sans']">
                {step.title}
              </h3>
              
              <p className="text-xs text-[#666] leading-relaxed max-w-[200px] font-['Poppins']">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
