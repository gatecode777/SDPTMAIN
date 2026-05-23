"use server";

import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

export async function syncUserCart(cart: any[]) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { success: false, message: "Not authenticated" };

    await dbConnect();
    await User.findOneAndUpdate({ email: session.user.email }, { cart });
    return { success: true };
  } catch (error) {
    console.error("Failed to sync cart:", error);
    return { success: false, error: "Sync failed" };
  }
}

export async function syncUserWishlist(wishlist: string[]) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { success: false, message: "Not authenticated" };

    await dbConnect();
    await User.findOneAndUpdate({ email: session.user.email }, { wishlist });
    return { success: true };
  } catch (error) {
    console.error("Failed to sync wishlist:", error);
    return { success: false, error: "Sync failed" };
  }
}

export async function getUserData() {
  try {
    const session = await auth();
    if (!session?.user?.email) return { success: false, message: "Not authenticated" };

    await dbConnect();

    const user = await User.findOne({ email: session.user.email })
      .select("name cart wishlist addresses mobileNumber image createdAt")
      .lean();
    if (!user) return { success: false, message: "User not found" };

    return JSON.parse(JSON.stringify({ 
      success: true, 
      cart: user.cart, 
      wishlist: user.wishlist,
      addresses: user.addresses,
      mobileNumber: user.mobileNumber || "",
      image: user.image || "",
      name: user.name || "",
      createdAt: user.createdAt
    }));
  } catch (error) {
    console.error("Failed to get user data:", error);
    return { success: false, error: "Fetch failed" };
  }
}

export async function addUserAddress(address: any) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { success: false, message: "Authentication failed. Please log in again." };

    await dbConnect();
    
    
    const user = await User.findOne({ email: session.user.email }).select("_id addresses").lean();
    if (!user) return { success: false, message: "User profile not found in database." };

    const isFirst = !user.addresses || user.addresses.length === 0;
    const newAddress = {
      label: address.label || "Home",
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      isDefault: isFirst || address.isDefault || false
    };

    
    if (newAddress.isDefault) {
      await User.updateOne(
        { _id: user._id },
        { $set: { "addresses.$[].isDefault": false } }
      );
    }


    
    const updateResult = await User.findByIdAndUpdate(
      user._id,
      { $push: { addresses: newAddress } },
      { new: true, runValidators: true }
    );

    if (!updateResult) {
      return { success: false, message: "Failed to update user document." };
    }
    


    return JSON.parse(JSON.stringify({ 
      success: true, 
      message: "Address saved successfully to your cloud profile.",
      addresses: updateResult.addresses
    }));
  } catch (error: any) {
    console.error("CRITICAL DATABASE ERROR:", error);
    return { success: false, message: "Database error: " + (error.message || "Unknown error") };
  }
}

export async function deleteUserAddress(addressId: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { success: false, message: "Not authenticated" };

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email }).select("_id").lean();
    if (!user) return { success: false, message: "User not found" };

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    );

    return JSON.parse(JSON.stringify({ success: true, addresses: updatedUser.addresses }));
  } catch (error) {
    console.error("Failed to delete address:", error);
    return { success: false, error: "Failed to delete address" };
  }
}

export async function updateAddress(addressId: string, addressData: any) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { success: false, message: "Not authenticated" };

    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email }).select("_id").lean();
    if (!user) return { success: false, message: "User not found" };

    if (addressData.isDefault) {
      await User.updateOne({ _id: user._id }, { $set: { "addresses.$[].isDefault": false } });
    }

    

    const updateQuery: any = {};
    for (const key in addressData) {
      updateQuery[`addresses.$.${key}`] = addressData[key];
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id, "addresses._id": addressId },
      { $set: updateQuery },
      { new: true }
    );

    return JSON.parse(JSON.stringify({ success: true, addresses: updatedUser.addresses }));
  } catch (error) {
    console.error("Failed to update address:", error);
    return { success: false, error: "Failed to update address" };
  }
}
export async function updateUserProfile(data: { name?: string; mobileNumber?: string; image?: string; currentPassword?: string; newPassword?: string }) {
  try {
    const session = await auth();
    if (!session?.user?.email) return { success: false, message: "Not authenticated" };

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    if (!user) return { success: false, message: "User not found" };

    if (data.name) {
      user.name = data.name;
    }
    if (data.mobileNumber) {
      if (!/^\d{10,15}$/.test(data.mobileNumber.replace(/\D/g, ''))) {
        return { success: false, message: "Invalid mobile number format" };
      }
      user.mobileNumber = data.mobileNumber;
    }
    if (data.image) {
      user.image = data.image;
    }

    if (data.currentPassword && data.newPassword) {
      if (!user.password) return { success: false, message: "Password not set for this account" };
      
      const isMatch = await bcrypt.compare(data.currentPassword, user.password);
      if (!isMatch) return { success: false, message: "Current password incorrect" };

      user.password = await bcrypt.hash(data.newPassword, 10);
    }

    await user.save();
    return { success: true, user: { name: user.name, email: user.email, mobileNumber: user.mobileNumber, image: user.image } };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Update failed" };
  }
}
