"use server";

import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";

export async function getProducts(query = {}, page = 1, limit = 10) {
  await dbConnect();
  const skip = (page - 1) * limit;
  
  const products = await Product.find(query)
    .populate("category")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
    
  const total = await Product.countDocuments(query);
  
  return {
    products: JSON.parse(JSON.stringify(products)),
    total,
    pages: Math.ceil(total / limit),
  };
}

export async function createProduct(data: any) {
  await dbConnect();
  try {
    const product = await Product.create(data);
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true, product: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    return { success: false, error: message };
  }
}

export async function updateProduct(id: string, data: any) {
  await dbConnect();
  try {
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath(`/product/${id}`);
    revalidatePath("/");
    return { success: true, product: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update product";
    return { success: false, error: message };
  }
}

export async function deleteProduct(id: string) {
  await dbConnect();
  try {
    await Product.findByIdAndDelete(id);
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete product";
    return { success: false, error: message };
  }
}

export async function getProductById(id: string) {
  await dbConnect();
  const product = await Product.findById(id).populate("category").lean();
  return JSON.parse(JSON.stringify(product));
}

export async function rateProduct(productId: string, rating: number, review?: string, userId?: string) {
  await dbConnect();
  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    if (!product.ratings) {
      product.ratings = [];
    }

    product.ratings.push({
      userId: userId || "anonymous",
      rating,
      review: review || "",
      createdAt: new Date(),
    });

    product.totalReviews = product.ratings.length;
    const totalRating = product.ratings.reduce((sum: number, r: any) => sum + r.rating, 0);
    product.averageRating = Number((totalRating / product.totalReviews).toFixed(1));

    await product.save();
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath(`/product/${productId}`);
    revalidatePath("/account");
    revalidatePath("/account?tab=orders");
    return { success: true, product: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to rate product";
    return { success: false, error: message };
  }
}
