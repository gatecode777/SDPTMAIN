"use server";

import dbConnect from "@/lib/mongoose";
import Settings from "@/models/Settings";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  await dbConnect();
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({});
    }
    return { success: true, settings: JSON.parse(JSON.stringify(settings)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateSettings(data: any) {
  await dbConnect();
  try {
    const settings = await Settings.findOne({});
    if (settings) {
      await Settings.findByIdAndUpdate(settings._id, data);
    } else {
      await Settings.create(data);
    }
    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
