"use server";

import dbConnect from "@/lib/mongoose";
import ActivityLog from "@/models/ActivityLog";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// ─── Types ─────────────────────────────────────────────────────────────────
export type LogAction = "CREATE" | "UPDATE" | "DELETE" | "VIEW" | "LOGIN" | "LOGOUT" | "EXPORT" | "OTHER";
export type LogModule =
  | "products"
  | "categories"
  | "orders"
  | "customers"
  | "coupons"
  | "banner"
  | "admins"
  | "settings"
  | "analytics"
  | "queries"
  | "auth"
  | "other";

interface LogPayload {
  action: LogAction;
  module: LogModule;
  description: string;
  targetId?: string;
  targetName?: string;
  metadata?: Record<string, any>;
}

// ─── Core Logger (server-only, callable from other server actions) ──────────
export async function logActivity(payload: LogPayload) {
  try {
    const session = await auth();
    if (!session?.user?.id) return; // silently skip if no session

    await dbConnect();
    await ActivityLog.create({
      adminId: session.user.id,
      adminName: session.user.name || "Unknown",
      adminEmail: session.user.email || "",
      adminRole: session.user.role || "ADMIN",
      action: payload.action,
      module: payload.module,
      description: payload.description,
      targetId: payload.targetId,
      targetName: payload.targetName,
      metadata: payload.metadata,
    });
  } catch (err) {
    // Non-fatal — never let logging crash the main action
    console.error("[ActivityLog] Failed to log activity:", err);
  }
}

// ─── Fetch Logs (with filters + pagination) ────────────────────────────────
export async function getActivityLogs({
  page = 1,
  limit = 30,
  adminId,
  module,
  action,
  search,
  dateFrom,
  dateTo,
}: {
  page?: number;
  limit?: number;
  adminId?: string;
  module?: string;
  action?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
} = {}) {
  await dbConnect();
  try {
    const session = await auth();
    if (!session?.user || session.user.role === "CUSTOMER") {
      return { success: false, error: "Unauthorized" };
    }

    const filter: Record<string, any> = {};
    if (adminId) filter.adminId = adminId;
    if (module && module !== "all") filter.module = module;
    if (action && action !== "all") filter.action = action;
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: "i" } },
        { adminName: { $regex: search, $options: "i" } },
        { targetName: { $regex: search, $options: "i" } },
      ];
    }
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      ActivityLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ActivityLog.countDocuments(filter),
    ]);

    // Action-level summary counts (for stat cards)
    const [viewCount, editCount, createCount, deleteCount, loginCount] = await Promise.all([
      ActivityLog.countDocuments({ ...filter, action: "VIEW" }),
      ActivityLog.countDocuments({ ...filter, action: "UPDATE" }),
      ActivityLog.countDocuments({ ...filter, action: "CREATE" }),
      ActivityLog.countDocuments({ ...filter, action: "DELETE" }),
      ActivityLog.countDocuments({ ...filter, action: "LOGIN" }),
    ]);

    return {
      success: true,
      logs: JSON.parse(JSON.stringify(logs)),
      total,
      pages: Math.ceil(total / limit),
      stats: { viewCount, editCount, createCount, deleteCount, loginCount },
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch logs" };
  }
}

// ─── Get distinct admins (for filter dropdown) ─────────────────────────────
export async function getLogAdmins() {
  await dbConnect();
  try {
    const session = await auth();
    if (!session?.user || session.user.role === "CUSTOMER") {
      return { success: false, error: "Unauthorized" };
    }
    const admins = await ActivityLog.aggregate([
      { $group: { _id: "$adminId", name: { $first: "$adminName" }, email: { $first: "$adminEmail" } } },
      { $sort: { name: 1 } },
    ]);
    return { success: true, admins };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ─── Clear all logs (SUPER_ADMIN only) ─────────────────────────────────────
export async function clearActivityLogs() {
  await dbConnect();
  try {
    const session = await auth();
    if (
      !session?.user ||
      (session.user.role !== "SUPER_ADMIN" && session.user.email !== "admin@gmail.com")
    ) {
      return { success: false, error: "Only SUPER_ADMIN can clear logs" };
    }
    await ActivityLog.deleteMany({});
    revalidatePath("/admin/activity-logs");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
