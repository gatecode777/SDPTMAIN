"use server";

import dbConnect from "@/lib/mongoose";
import Coupon from "@/models/Coupon";
import { revalidatePath } from "next/cache";
import { logActivity } from "./activity-logs";

export async function getCoupons() {
  await dbConnect();
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return { success: true, coupons: JSON.parse(JSON.stringify(coupons)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCoupon(data: any) {
  await dbConnect();
  try {
    const coupon = await Coupon.create(data);
    revalidatePath("/coupons");
    await logActivity({
      action: "CREATE",
      module: "coupons",
      description: `Created coupon "${data.code}" (${data.discount}% off)`,
      targetId: coupon._id?.toString(),
      targetName: data.code,
    });
    return { success: true, coupon: JSON.parse(JSON.stringify(coupon)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCoupon(id: string) {
  await dbConnect();
  try {
    const coupon = await Coupon.findById(id).lean() as any;
    await Coupon.findByIdAndDelete(id);
    revalidatePath("/coupons");
    await logActivity({
      action: "DELETE",
      module: "coupons",
      description: `Deleted coupon "${coupon?.code || id}"`,
      targetId: id,
      targetName: coupon?.code,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCouponStatus(id: string, isActive: boolean) {
  await dbConnect();
  try {
    const coupon = await Coupon.findById(id).lean() as any;
    await Coupon.findByIdAndUpdate(id, { isActive });
    revalidatePath("/coupons");
    await logActivity({
      action: "UPDATE",
      module: "coupons",
      description: `${isActive ? "Activated" : "Deactivated"} coupon "${coupon?.code || id}"`,
      targetId: id,
      targetName: coupon?.code,
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
