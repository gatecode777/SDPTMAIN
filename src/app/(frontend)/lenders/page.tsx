import React from "react";
import Hero from "@/components/lenders/Hero";
import TrustBar from "@/components/lenders/TrustBar";
import Features from "@/components/lenders/Features";
import LoanCategories from "@/components/lenders/LoanCategories";
import Timeline from "@/components/lenders/Timeline";
import LeadQuality from "@/components/lenders/LeadQuality";
import PlatformFeatures from "@/components/lenders/PlatformFeatures";
import Industries from "@/components/lenders/Industries";
import Testimonials from "@/components/lenders/Testimonials";
import FAQ from "@/components/lenders/FAQ";
import CTA from "@/components/lenders/CTA";

export const metadata = {
  title: "Lenders Portal - SDPT Credit Network",
  description: "Acquire pre-screened borrowers and grow your credit portfolios. Verified client leads matching your location, product type, and risk profiles in real-time.",
};

export default function LendersPage() {
  return (
    <div className="directory-page min-h-screen bg-white antialiased text-slate-800">
      <Hero />
      <TrustBar />
      <Features />
      <LoanCategories />
      <Timeline />
      <LeadQuality />
      <PlatformFeatures />
      <Industries />
      <Testimonials />
      <FAQ />
      <CTA />
    </div>
  );
}
