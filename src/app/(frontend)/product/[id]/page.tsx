import React from "react";
import { getProductById, getProducts } from "@/actions/product";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  try {
    const data = await getProducts({ status: "PUBLISHED" }, 1, 50, "_id");
    return data.products.map((p: any) => ({
      id: p._id.toString(),
    }));
  } catch (error) {
    console.error("Failed to generate static params for products:", error);
    return [];
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    notFound();
  }
  
  return <ProductDetailClient product={product} />;
}
