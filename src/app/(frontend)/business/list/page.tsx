import React from "react";
import Hero from "@/components/business/list/Hero";
import Steps from "@/components/business/list/Steps";
import Benefits from "@/components/business/list/Benefits";
import Pricing from "@/components/business/list/Pricing";
import FAQIntro from "@/components/business/list/FAQIntro";
import CTA from "@/components/business/list/CTA";
import FAQAccordion from "@/components/business/list/FAQAccordion";
import Footer from "@/components/business/Footer";

export const metadata = {
  title: "List Your Business - SDPT AI Website Builder",
  description: "Get a free AI business website generated in 60 seconds. List your business on SDPT and receive direct leads via WhatsApp without commissions.",
};

export default function ListBusinessPage() {
  return (
    <div className="business-page min-h-screen bg-white antialiased text-slate-800">
      <Hero />
      <Steps />
      <Benefits />
      <Pricing />
      <FAQIntro />
      <CTA />
      <FAQAccordion />
      <Footer />
    </div>
  );
}
