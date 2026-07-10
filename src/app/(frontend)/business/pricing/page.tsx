import React from "react";
import PricingHero from "@/components/business/pricing/PricingHero";
import PricingCards from "@/components/business/pricing/PricingCards";
import InfoBanner from "@/components/business/pricing/InfoBanner";
import TrustSection from "@/components/business/pricing/TrustSection";
import FAQAccordion from "@/components/business/pricing/FAQAccordion";
import CTASection from "@/components/business/pricing/CTASection";

export const metadata = {
  title: "Pricing Plans - SDPT Business Tools",
  description: "Select the pricing package that fits your scaling store requirements. Start free or upgrade for custom domains and automated AI landing pages.",
};

export default function PricingPage() {
  return (
    <div className="directory-page min-h-screen bg-white antialiased text-slate-800">
      <PricingHero />
      <PricingCards />
      <InfoBanner />
      <TrustSection />
      <FAQAccordion />
      <CTASection />
    </div>
  );
}
