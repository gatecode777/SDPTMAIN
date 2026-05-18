
import Slider from "@/components/frontend/Slider";
import Features from "@/components/frontend/Features";
import Categories from "@/components/frontend/Categories";
import Bestseller from "@/components/frontend/Bestseller";
import PromoBanner from "@/components/frontend/PromoBanner";

import Services from "@/components/frontend/Services";
import Brands from "@/components/frontend/Brands";

export default function Home() {
  return (
    <>
      <Slider />
      <Features />
      <Categories />
      <Bestseller />
      <PromoBanner />

      <Services />
      <Brands />
    </>
  );
}
