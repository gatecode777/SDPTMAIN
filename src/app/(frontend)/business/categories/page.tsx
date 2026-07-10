import React from "react";
import DirectoryHero from "@/components/business/categories/DirectoryHero";
import Stats from "@/components/business/categories/Stats";
import CategoryGrid from "@/components/business/categories/CategoryGrid";
import CityGrid from "@/components/business/categories/CityGrid";
import Features from "@/components/business/categories/Features";
import BusinessCTA from "@/components/business/categories/BusinessCTA";

export const metadata = {
  title: "Business Directory - SDPT Service Marketplace",
  description: "Browse verified local businesses, tech startups, agencies, and financial distributors in India. Filter by category or home city.",
};

export default function BusinessDirectoryPage() {
  return (
    <div className="directory-page min-h-screen bg-white antialiased text-slate-800">
      <DirectoryHero />
      <Stats />
      <CategoryGrid />
      <CityGrid />
      <Features />
      <BusinessCTA />
    </div>
  );
}
