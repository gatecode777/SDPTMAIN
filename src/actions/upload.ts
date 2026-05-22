"use server";

import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function uploadImages(formData: FormData): Promise<{ success: boolean; urls?: string[]; error?: string }> {
  try {
    const files = formData.getAll("files") as File[];
    if (!files || files.length === 0) {
      return { success: false, error: "No files received" };
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Directory may already exist
    }

    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(cleanName);
      const baseName = path.basename(cleanName, ext);
      const filename = `${baseName}-${uniqueSuffix}${ext}`;
      
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);

      urls.push(`/uploads/${filename}`);
    }

    return { success: true, urls };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to upload images" };
  }
}


