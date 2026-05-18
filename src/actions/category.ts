"use server";

import dbConnect from "@/lib/mongoose";
import Category from "@/models/Category";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  await dbConnect();
  const categories = await Category.find({}).populate("parent").sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(categories));
}

export async function createCategory(data: any) {
  await dbConnect();
  try {
    const category = await Category.create(data);
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true, category: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create category";
    return { success: false, error: message };
  }
}

export async function updateCategory(id: string, data: any) {
  await dbConnect();
  try {
    const category = await Category.findByIdAndUpdate(id, data, { new: true });
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true, category: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update category";
    return { success: false, error: message };
  }
}

export async function deleteCategory(id: string) {
  await dbConnect();
  try {
    
    await Category.findByIdAndDelete(id);
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete category";
    return { success: false, error: message };
  }
}
