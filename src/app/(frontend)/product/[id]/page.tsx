import React from "react";
import { getProductById } from "@/actions/product";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    notFound();
  }
  
  return <ProductDetailClient product={product} />;
}
