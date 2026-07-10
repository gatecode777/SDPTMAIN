import React from "react";
import SectionHeading from "@/components/business/SectionHeading";

export default function Timeline() {
  const steps = [
    { id: 1, title: "Connect your business", desc: "Initialize your workspace profiles and load basic operating metadata parameters." },
    { id: 2, title: "Configure modules", desc: "Toggle desired features (like the Ledger accounting engine, Wallets, or CRM lead lists)." },
    { id: 3, title: "Automate workflows", desc: "Formulate lead allocation codes, webhook logs, and automated WhatsApp chats." },
    { id: 4, title: "Track in one place", desc: "Monitor disbursement counts, transaction files, and agent logs from a single dashboard." }
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="Integration Cycle"
          title="Engineered for rapid deployment"
          subtitle="Follow this 4-step deployment cycle to align our modules with your corporate LMS databases."
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
