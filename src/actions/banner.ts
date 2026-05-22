"use server";

import dbConnect from "@/lib/mongoose";
import Banner from "@/models/Banner";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function getBanner() {
  await dbConnect();
  try {
    let banner = await Banner.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!banner) {
      
      banner = await Banner.findOne({}).sort({ createdAt: -1 });
      if (!banner) {
        banner = await Banner.create({});
      }
    }
    return { success: true, banner: JSON.parse(JSON.stringify(banner)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBanner(data: any) {
  await dbConnect();
  try {
    const session = await auth();
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
    const permissions = (session?.user as any)?.permissions?.products || { edit: false };
    if (!isSuperAdmin && !permissions.edit) {
      return { success: false, error: "Unauthorized: You do not have permission to edit the homepage banner." };
    }

    const banner = await Banner.findOne({});
    if (banner) {
      await Banner.findByIdAndUpdate(banner._id, data);
    } else {
      await Banner.create(data);
    }
    revalidatePath("/");
    revalidatePath("/admin/banner");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
