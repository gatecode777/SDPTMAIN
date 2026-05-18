"use server";

import dbConnect from "@/lib/mongoose";
import Banner from "@/models/Banner";
import { revalidatePath } from "next/cache";

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
