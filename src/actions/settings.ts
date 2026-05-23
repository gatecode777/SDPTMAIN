"use server";

import dbConnect from "@/lib/mongoose";
import Settings from "@/models/Settings";
import { revalidatePath } from "next/cache";
import { customCache, invalidateCacheTag } from "@/lib/cache";

export async function getSettings() {
  try {
    const settings = await customCache(
      async () => {
        await dbConnect();
        let settings = await Settings.findOne({}).lean();
        if (!settings) {
          const createdSettings = await Settings.create({});
          settings = createdSettings.toObject ? createdSettings.toObject() : createdSettings;
        }
        return settings;
      },
      "store-settings",
      ["settings"]
    );
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
    await invalidateCacheTag("settings");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
