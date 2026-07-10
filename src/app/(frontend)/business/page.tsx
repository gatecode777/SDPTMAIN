import React from "react";
import Hero from "@/components/business/Hero";
import Stats from "@/components/business/Stats";
import Categories from "@/components/business/Categories";
import Features from "@/components/business/Features";
import HowItWorks from "@/components/business/HowItWorks";
import Testimonials from "@/components/business/Testimonials";
import FAQ from "@/components/business/FAQ";
import Contact from "@/components/business/Contact";
import Products from "@/components/business/Products";
import Footer from "@/components/business/Footer";
import ScrollToHash from "@/components/business/ScrollToHash";

export const metadata = {
  title: "SDPT - Verified Business Marketplace",
  description: "Find verified local businesses in India or list your business for free. Strict PAN and GST registration checks ensure high trust and direct customer connections.",
};

export default function BusinessPage() {
  return (
    <div className="business-page min-h-screen bg-white antialiased text-slate-800">
      <ScrollToHash />
      <Hero />
      <Stats />
      <Categories />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Contact />
      <Products />
      <Footer />
    </div>
  );
}
