"use server";

import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { logActivity } from "./activity-logs";

export async function getAdmins() {
  await dbConnect();
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role === "CUSTOMER") {
      return { success: false, error: "Unauthorized" };
    }

    const admins = await User.find({ role: { $ne: "CUSTOMER" } })
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, admins: JSON.parse(JSON.stringify(admins)) };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to fetch admins" };
  }
}

export async function createAdmin(data: any) {
  await dbConnect();
  try {
    const session = await auth();
    if (!session || !session.user || (session.user.role !== "SUPER_ADMIN" && session.user.email !== "admin@gmail.com")) {
      return { success: false, error: "Only SUPER_ADMIN can create admins" };
    }

    if (!data.name || !data.email || !data.password || !data.role) {
      return { success: false, error: "Missing required fields" };
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email }).select("_id").lean();
    if (existingUser) {
      return { success: false, error: "Email is already in use" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const adminData = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      isActive: data.isActive !== undefined ? data.isActive : true,
      permissions: data.permissions || {
        dashboard: { view: false, create: false, edit: false, delete: false },
        users: { view: false, create: false, edit: false, delete: false },
        products: { view: false, create: false, edit: false, delete: false },
        categories: { view: false, create: false, edit: false, delete: false },
        orders: { view: false, create: false, edit: false, delete: false },
        coupons: { view: false, create: false, edit: false, delete: false },
        blogs: { view: false, create: false, edit: false, delete: false },
        blogCategories: { view: false, create: false, edit: false, delete: false },
      },
    };

    const newAdmin = await User.create(adminData);
    revalidatePath("/admin/admins");
    await logActivity({
      action: "CREATE",
      module: "admins",
      description: `Created admin account "${data.name}" (${data.email}) with role ${data.role}`,
      targetId: newAdmin._id?.toString(),
      targetName: data.name,
    });
    return { success: true, admin: JSON.parse(JSON.stringify(newAdmin)) };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create admin" };
  }
}

export async function updateAdmin(id: string, data: any) {
  await dbConnect();
  try {
    const session = await auth();
    if (!session || !session.user || (session.user.role !== "SUPER_ADMIN" && session.user.email !== "admin@gmail.com")) {
      return { success: false, error: "Only SUPER_ADMIN can update admins" };
    }

    const admin = await User.findById(id);
    if (!admin) {
      return { success: false, error: "Admin not found" };
    }

    // Protect against modifying the master super admin's role to something else
    if (admin.email === "admin@gmail.com" && data.role && data.role !== "SUPER_ADMIN") {
      return { success: false, error: "Cannot change the role of the primary Super Admin" };
    }

    // Protect against deactivating the master super admin
    if (admin.email === "admin@gmail.com" && data.isActive === false) {
      return { success: false, error: "Cannot deactivate the primary Super Admin" };
    }

    if (data.name) admin.name = data.name;
    if (data.email) {
      const emailExists = await User.findOne({ email: data.email, _id: { $ne: id } }).select("_id").lean();
      if (emailExists) {
        return { success: false, error: "Email is already in use by another user" };
      }
      admin.email = data.email;
    }
    if (data.role) admin.role = data.role;
    if (data.isActive !== undefined) admin.isActive = data.isActive;
    if (data.permissions) {
      admin.permissions = data.permissions;
      admin.markModified("permissions");
    }

    if (data.password && data.password.trim() !== "") {
      admin.password = await bcrypt.hash(data.password, 10);
    }

    await admin.save();
    revalidatePath("/admin/admins");
    await logActivity({
      action: "UPDATE",
      module: "admins",
      description: `Updated admin account "${admin.name}" (${admin.email})`,
      targetId: id,
      targetName: admin.name,
    });
    return { success: true, admin: JSON.parse(JSON.stringify(admin)) };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update admin" };
  }
}

export async function deleteAdmin(id: string) {
  await dbConnect();
  try {
    const session = await auth();
    if (!session || !session.user || (session.user.role !== "SUPER_ADMIN" && session.user.email !== "admin@gmail.com")) {
      return { success: false, error: "Only SUPER_ADMIN can delete admins" };
    }

    // Protect against deleting self
    if (session.user.id === id) {
      return { success: false, error: "You cannot delete your own account" };
    }

    const admin = await User.findById(id);
    if (!admin) {
      return { success: false, error: "Admin not found" };
    }

    // Protect against deleting primary super admin
    if (admin.email === "admin@gmail.com") {
      return { success: false, error: "Cannot delete the primary Super Admin account" };
    }

    await User.findByIdAndDelete(id);
    revalidatePath("/admin/admins");
    await logActivity({
      action: "DELETE",
      module: "admins",
      description: `Deleted admin account "${admin.name}" (${admin.email})`,
      targetId: id,
      targetName: admin.name,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete admin" };
  }
}
