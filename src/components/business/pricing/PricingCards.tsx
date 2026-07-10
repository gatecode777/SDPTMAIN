import React from "react";
import { pricingPagePlans } from "@/constants/pricing";
import PricingCard from "./PricingCard";

export default function PricingCards() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {pricingPagePlans.map((plan, index) => (
            <div key={index} className="h-full">
              <PricingCard plan={plan} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
