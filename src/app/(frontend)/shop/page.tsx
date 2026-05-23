import React, { Suspense } from "react";
import { getProducts } from "@/actions/product";
import { getCategories } from "@/actions/category";
import ShopClient from "./ShopClient";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const urlCat = resolvedParams.cat || "All";
  const urlQ = resolvedParams.q || "";

  // Fetch categories and product data concurrently on the server
  const [categories, productsData] = await Promise.all([
    getCategories(),
    (async () => {
      let query: any = { status: "PUBLISHED" };
      
      if (urlCat !== "All") {
        if (urlCat.length === 24) {
          query.category = urlCat;
        } else {
          const cats = await getCategories();
          const cat = cats.find((c: any) => c.name.toLowerCase() === urlCat.toLowerCase());
          if (cat) query.category = cat._id;
        }
      }
      
      if (urlQ) {
        query.name = { $regex: urlQ, $options: "i" };
      }
      
      return getProducts(query, 1, 50);
    })()
  ]);

  return (
    <Suspense fallback={<div>Loading shop components...</div>}>
      <ShopClient
        initialProducts={productsData.products}
        categories={categories}
        initialCat={urlCat}
        initialQ={urlQ}
      />
    </Suspense>
  );
}
