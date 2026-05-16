"use server";

import dbConnect from "@/lib/mongoose";
import Coupon from "@/models/Coupon";
import { revalidatePath } from "next/cache";

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
    return { success: true, coupon: JSON.parse(JSON.stringify(coupon)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCoupon(id: string) {
  await dbConnect();
  try {
    await Coupon.findByIdAndDelete(id);
    revalidatePath("/coupons");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCouponStatus(id: string, isActive: boolean) {
  await dbConnect();
  try {
    await Coupon.findByIdAndUpdate(id, { isActive });
    revalidatePath("/coupons");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
