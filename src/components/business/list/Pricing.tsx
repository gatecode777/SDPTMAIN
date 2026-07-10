import React from "react";
import { plans } from "@/constants/pricing";
import SectionHeading from "@/components/business/SectionHeading";
import PricingCard from "./PricingCard";

export default function Pricing() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <SectionHeading 
          badge="Pricing Plans"
          title="Start free. Upgrade when you grow."
          subtitle="All plans include basic SEO tools and free hosting forever. Scale your business on your own terms."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className="h-full">
              <PricingCard plan={plan} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
