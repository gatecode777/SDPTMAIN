"use client";

import React from "react";
import { steps } from "@/constants/data";
import SectionHeading from "./SectionHeading";
import Card from "./Card";
import Button from "./Button";
import { useRouter } from "next/navigation";

export default function HowItWorks() {
  const router = useRouter();

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-slate-50/50">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="How It Works"
          title="Three minutes to a listing that ranks."
          subtitle="Our step-by-step onboarding gets your business live and optimized for local search engines instantly."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto relative mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center">
              {/* Connector Line for Desktop */}
              {index < 2 && (
                <div className="hidden md:block absolute top-[44px] left-[55%] w-[90%] h-[2px] bg-slate-100 z-0" />
              )}

              <Card 
                hoverLift={true}
                className="flex flex-col items-start p-8 border border-slate-100 bg-white relative z-10 w-full"
              >
                {/* Step Circle */}
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-6">
                  {step.id}
                </div>

                <h3 className="text-[17px] font-bold text-slate-900 mb-2 font-['Albert_Sans']">
                  {step.title}
                </h3>
                <p className="text-[15px] text-[#666] leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={() => router.push("/business/list")}
            className="bg-[#1e1b4b] hover:bg-[#12103e] text-white cursor-pointer"
          >
            List Your Business Now
          </Button>
        </div>
      </div>
    </section>
  );
}
