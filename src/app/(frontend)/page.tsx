
import Slider from "@/components/frontend/Slider";
import Features from "@/components/frontend/Features";
import Categories from "@/components/frontend/Categories";
import Bestseller from "@/components/frontend/Bestseller";
import PromoBanner from "@/components/frontend/PromoBanner";

import Services from "@/components/frontend/Services";
import Brands from "@/components/frontend/Brands";

import { getCategories } from "@/actions/category";
import { getProducts } from "@/actions/product";
import { getBanner } from "@/actions/banner";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch homepage data concurrently on the server
  const [categories, bestsellerData, bannerData] = await Promise.all([
    getCategories(),
    getProducts({ status: "PUBLISHED" }, 1, 8),
    getBanner()
  ]);

  const banner = bannerData.success && bannerData.banner?.isActive ? bannerData.banner : null;

  return (
    <>
      <Slider />
      <Features />
      <Categories initialCategories={categories} />
      <Bestseller initialProducts={bestsellerData.products} />
      <PromoBanner initialBanner={banner} />

      <Services />
      <Brands />
    </>
  );
}
