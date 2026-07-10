"use client";

import React from "react";
import { PricingPlan } from "@/constants/pricing";
import Card from "@/components/business/Card";
import Button from "@/components/business/Button";
import { Check } from "lucide-react";

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

  const handlePricingClick = () => {
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
          ? "border-2 border-blue-600 bg-white shadow-xl lg:scale-105 lg:-translate-y-2 z-10" 
          : "border border-gray-100/80 bg-white"
      }`}
    >
      {isFeatured && (
        <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
          Most Popular
        </span>
      )}
      
      <div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight font-['Albert_Sans'] mb-2">
          {plan.name}
        </h3>
        <p className="text-xs text-[#666] leading-relaxed mb-6 font-['Poppins']">
          {plan.description}
        </p>
        
        <div className="flex items-baseline gap-1 mb-8 font-['Albert_Sans']">
          <span className="text-4xl md:text-5xl font-bold text-slate-900">
            {plan.price}
          </span>
          <span className="text-sm text-[#666] font-semibold">
            /{plan.period}
          </span>
        </div>
        
        <ul className="space-y-4 mb-8 font-['Poppins']">
          {plan.features.map((feat, index) => (
            <li key={index} className="flex gap-3 text-[13px] text-slate-700 items-start">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {plan.name.toLowerCase() === "free" ? (
        <Button 
          variant={isFeatured ? "primary" : "secondary"}
          onClick={handlePricingClick}
          className={`w-full mt-auto cursor-pointer ${isFeatured ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
        >
          {plan.cta}
        </Button>
      ) : (
        <Link href={`/business/checkout?plan=${plan.name.toLowerCase()}`} className="w-full">
          <Button 
            variant={isFeatured ? "primary" : "secondary"}
            className={`w-full mt-auto cursor-pointer ${isFeatured ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
          >
            {plan.cta}
          </Button>
        </Link>
      )}
    </Card>
  );
}
