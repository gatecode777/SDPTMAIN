"use client";

import React from "react";
import { PricingPlan } from "@/constants/pricing";
import Card from "@/components/business/Card";
import Button from "@/components/business/Button";
import FeatureList from "./FeatureList";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface PricingCardProps {
  plan: PricingPlan;
}

export default function PricingCard({ plan }: PricingCardProps) {
  const isFeatured = plan.isPopular;
  const { status } = useSession();
  const router = useRouter();

  // Custom button styling based on plan name
  let btnClass = "";
  let btnVariant: "primary" | "secondary" = "secondary";
  
  if (plan.name === "STARTER") {
    btnVariant = "primary";
    btnClass = "bg-blue-600 hover:bg-blue-700 text-white w-full py-4";
  } else if (plan.name === "PROFESSIONAL") {
    btnVariant = "primary";
    btnClass = "bg-[#102E63] hover:bg-[#0a1f44] text-white w-full py-4";
  } else {
    btnVariant = "secondary";
    btnClass = "border border-blue-600 text-blue-600 hover:bg-blue-50/50 w-full py-4";
  }

  const handleFreeClick = () => {
    if (status === "authenticated") {
      router.push("/builder/wizard");
    } else {
      window.dispatchEvent(new Event("openAuthModal"));
    }
  };

  return (
    <Card 
      hoverLift={true}
      className={`flex flex-col justify-between p-8 relative h-full ${
        isFeatured 
          ? "border-2 border-blue-600 bg-white shadow-xl lg:scale-105 z-10" 
          : "border border-gray-200/80 bg-white shadow-sm"
      }`}
    >
      {isFeatured && (
        <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md z-20">
          Most Popular
        </span>
      )}
      
      <div>
        <span className="text-xs font-extrabold tracking-wider text-slate-400 uppercase font-['Albert_Sans'] block mb-2">
          {plan.name}
        </span>
        
        <div className="flex items-baseline gap-1 mb-1 font-['Albert_Sans']">
          <span className="text-4xl md:text-5xl font-bold text-slate-900">
            {plan.price}
          </span>
        </div>
        <span className="text-xs text-slate-400 font-medium font-['Poppins'] block mb-6">
          {plan.period}
        </span>
        
        <FeatureList features={plan.features} isFeatured={isFeatured} />
      </div>

      {plan.name === "FREE" ? (
        <Button variant={btnVariant} className={`${btnClass} cursor-pointer`} onClick={handleFreeClick}>
          {plan.cta}
        </Button>
      ) : (
        <Link href={plan.name === "STARTER" ? "/business/checkout?plan=pro" : "/business/checkout?plan=business"} className="w-full">
          <Button variant={btnVariant} className={`${btnClass} cursor-pointer`}>
            {plan.cta}
          </Button>
        </Link>
      )}
    </Card>
  );
}
