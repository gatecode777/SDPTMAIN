"use server";

import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import { revalidatePath } from "next/cache";
import { logActivity } from "./activity-logs";
import { auth } from "@/auth";

export async function getProducts(query = {}, page = 1, limit = 10, select = "-description -images -ratings") {
  await dbConnect();
  const skip = (page - 1) * limit;
  
  let queryBuilder = Product.find(query);
  if (select) {
    queryBuilder = queryBuilder.select(select);
  }
  
  const products = await queryBuilder
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
    const session = await auth();
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
    const permissions = (session?.user as any)?.permissions?.products || { view: false, create: false, edit: false, delete: false };
    if (!isSuperAdmin && !permissions.create) {
      return { success: false, error: "Unauthorized: You do not have permission to create products." };
    }

    const product = await Product.create(data);
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    await logActivity({
      action: "CREATE",
      module: "products",
      description: `Created product "${data.name}"`,
      targetId: product._id?.toString(),
      targetName: data.name,
    });
    return { success: true, product: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    return { success: false, error: message };
  }
}

export async function updateProduct(id: string, data: any) {
  await dbConnect();
  try {
    const session = await auth();
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
    const permissions = (session?.user as any)?.permissions?.products || { view: false, create: false, edit: false, delete: false };
    if (!isSuperAdmin && !permissions.edit) {
      return { success: false, error: "Unauthorized: You do not have permission to edit products." };
    }

    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath(`/product/${id}`);
    revalidatePath("/");
    await logActivity({
      action: "UPDATE",
      module: "products",
      description: `Updated product "${data.name || product?.name}"`,
      targetId: id,
      targetName: data.name || product?.name,
    });
    return { success: true, product: JSON.parse(JSON.stringify(product)) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update product";
    return { success: false, error: message };
  }
}

export async function deleteProduct(id: string) {
  await dbConnect();
  try {
    const session = await auth();
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
    const permissions = (session?.user as any)?.permissions?.products || { view: false, create: false, edit: false, delete: false };
    if (!isSuperAdmin && !permissions.delete) {
      return { success: false, error: "Unauthorized: You do not have permission to delete products." };
    }

    const product = await Product.findById(id).lean() as any;
    await Product.findByIdAndDelete(id);
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");
    await logActivity({
      action: "DELETE",
      module: "products",
      description: `Deleted product "${product?.name || id}"`,
      targetId: id,
      targetName: product?.name,
    });
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete product";
    return { success: false, error: message };
  }
}

export async function getProductById(id: string) {
  await dbConnect();
  try {
    const product = await Product.findById(id).populate("category").lean();
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error(`Error fetching product by ID (${id}):`, error);
    return null;
  }
}

export async function rateProduct(productId: string, rating: number, review?: string, userId?: string) {
  await dbConnect();
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized: You must be logged in to rate products." };
    }

    const { default: User } = await import("@/models/User");
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    if (!product.ratings) {
      product.ratings = [];
    }

    product.ratings.push({
      userId: session.user.email,
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
