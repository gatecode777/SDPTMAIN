"use server";

import dbConnect from "@/lib/mongoose";
import Category from "@/models/Category";
import { revalidatePath } from "next/cache";
import { logActivity } from "./activity-logs";
import { auth } from "@/auth";
import { customCache, invalidateCacheTag } from "@/lib/cache";

export async function getCategories() {
  try {
    const categories = await customCache(
      async () => {
        await dbConnect();
        return Category.find({}).populate("parent").sort({ createdAt: -1 }).lean();
      },
      "categories-list",
      ["categories"]
    );
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function createCategory(data: any) {
  await dbConnect();
  try {
    const session = await auth();
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
    const permissions = (session?.user as any)?.permissions?.categories || { view: false, create: false, edit: false, delete: false };
    if (!isSuperAdmin && !permissions.create) {
      return { success: false, error: "Unauthorized: You do not have permission to create categories." };
    }

    const category = await Category.create(data);
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    await invalidateCacheTag("categories");
    await logActivity({
      action: "CREATE",
      module: "categories",
      description: `Created category "${data.name}"`,
      targetId: category._id?.toString(),
      targetName: data.name,
    });
    return { success: true, category: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create category";
    return { success: false, error: message };
  }
}

export async function updateCategory(id: string, data: any) {
  await dbConnect();
  try {
    const session = await auth();
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
    const permissions = (session?.user as any)?.permissions?.categories || { view: false, create: false, edit: false, delete: false };
    if (!isSuperAdmin && !permissions.edit) {
      return { success: false, error: "Unauthorized: You do not have permission to edit categories." };
    }

    const category = await Category.findByIdAndUpdate(id, data, { new: true });
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    await invalidateCacheTag("categories");
    await logActivity({
      action: "UPDATE",
      module: "categories",
      description: `Updated category "${data.name || category?.name}"`,
      targetId: id,
      targetName: data.name || category?.name,
    });
    return { success: true, category: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update category";
    return { success: false, error: message };
  }
}

export async function deleteCategory(id: string) {
  await dbConnect();
  try {
    const session = await auth();
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
    const permissions = (session?.user as any)?.permissions?.categories || { view: false, create: false, edit: false, delete: false };
    if (!isSuperAdmin && !permissions.delete) {
      return { success: false, error: "Unauthorized: You do not have permission to delete categories." };
    }

    const category = await Category.findById(id).lean() as any;
    await Category.findByIdAndDelete(id);
    revalidatePath("/admin/categories");
    revalidatePath("/shop");
    revalidatePath("/");
    await invalidateCacheTag("categories");
    await logActivity({
      action: "DELETE",
      module: "categories",
      description: `Deleted category "${category?.name || id}"`,
      targetId: id,
      targetName: category?.name,
    });
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete category";
    return { success: false, error: message };
  }
}
