"use server";

import dbConnect from "@/lib/mongoose";
import Query from "@/models/Query";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function submitQuery(formData: { name: string; email: string; phone?: string; subject: string; message: string }) {
  try {
    await dbConnect();
    const newQuery = new Query({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "",
      subject: formData.subject,
      message: formData.message,
      status: "PENDING",
    });

    await newQuery.save();
    revalidatePath("/admin/queries");
    return { success: true };
  } catch (error) {
    console.error("Error submitting query:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to submit query" };
  }
}

export async function getQueries(filter = {}, page = 1, limit = 20) {
  try {
    await dbConnect();
    const skip = (page - 1) * limit;

    const [queries, total] = await Promise.all([
      Query.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Query.countDocuments(filter)
    ]);

    return {
      success: true,
      queries: JSON.parse(JSON.stringify(queries)),
      total,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching queries:", error);
    return { success: false, queries: [], total: 0, pages: 0 };
  }
}

export async function updateQueryStatus(id: string, status: string, adminNotes?: string) {
  try {
    await dbConnect();
    const session = await auth();
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
    const permissions = (session?.user as any)?.permissions?.users || { edit: false };
    if (!isSuperAdmin && !permissions.edit) {
      return { success: false, error: "Unauthorized: You do not have permission to modify customer queries." };
    }

    const query = await Query.findById(id);
    if (!query) throw new Error("Query not found");

    if (status) query.status = status;
    if (adminNotes !== undefined) query.adminNotes = adminNotes;

    await query.save();
    revalidatePath("/admin/queries");
    return { success: true };
  } catch (error) {
    console.error("Error updating query status:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update query status" };
  }
}
