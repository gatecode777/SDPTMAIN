"use server";

import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import { revalidatePath } from "next/cache";
import { logActivity } from "./activity-logs";
import { auth } from "@/auth";

export async function getOrders(query = {}, page = 1, limit = 10) {
  await dbConnect();
  try {
    const skip = (page - 1) * limit;
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("customer")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query)
    ]);
    
    return {
      orders: JSON.parse(JSON.stringify(orders)),
      total,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      orders: [],
      total: 0,
      pages: 0,
    };
  }
}

export async function updateOrderStatus(id: string, status: string, comment?: string, deliveryDate?: string) {
  await dbConnect();
  try {
    const session = await auth();
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
    const permissions = (session?.user as any)?.permissions?.orders || { edit: false };
    if (!isSuperAdmin && !permissions.edit) {
      return { success: false, error: "Unauthorized: You do not have permission to update order status." };
    }

    const order = await Order.findById(id);
    if (!order) throw new Error("Order not found");

    if (status) {
      order.orderStatus = status;
      order.history.push({
        status,
        timestamp: new Date(),
        comment: comment || `Status updated to ${status}`,
      });

      if (status === "DELIVERED" && order.paymentMethod === "COD" && order.paymentStatus === "PENDING") {
        order.paymentStatus = "COMPLETED";
      } else if (status === "CANCELLED" && order.paymentMethod === "COD" && order.paymentStatus === "PENDING") {
        order.paymentStatus = "CANCELLED";
      }
    }

    let finalDeliveryDate = order.deliveryDate;
    if (status === "DELIVERED") {
      const existingDateStr = order.deliveryDate ? new Date(order.deliveryDate).toISOString().split('T')[0] : "";
      if (!deliveryDate || deliveryDate === existingDateStr) {
        finalDeliveryDate = new Date();
      } else {
        finalDeliveryDate = new Date(deliveryDate);
      }
    } else if (deliveryDate) {
      finalDeliveryDate = new Date(deliveryDate);
    }
    order.deliveryDate = finalDeliveryDate;

    await order.save();
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/account");
    revalidatePath("/account?tab=orders");
    await logActivity({
      action: "UPDATE",
      module: "orders",
      description: `Updated order #${order.orderId || id} status to "${status}"`,
      targetId: id,
      targetName: order.orderId || id,
    });
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: message };
  }
}

export async function getOrderById(id: string) {
  await dbConnect();
  const order = await Order.findById(id).populate("customer").populate("items.product").lean();
  return JSON.parse(JSON.stringify(order));
}

export async function getUserOrders() {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();
    if (!session?.user?.email) return { success: false, message: "Not authenticated" };

    await dbConnect();
    const { default: User } = await import("@/models/User");
    const user = await User.findOne({ email: session.user.email });
    if (!user) return { success: false, message: "User not found" };

    const orders = await Order.find({ customer: user._id })
      .populate("items.product")
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, orders: JSON.parse(JSON.stringify(orders)) };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: message };
  }
}

export async function createOrder(orderData: any) {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();
    if (!session?.user?.email) return { success: false, message: "Not authenticated" };

    await dbConnect();
    const { default: User } = await import("@/models/User");
    const user = await User.findOne({ email: session.user.email });
    if (!user) return { success: false, message: "User not found" };

    
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newOrder = new Order({
      ...orderData,
      orderId,
      customer: user._id,
      orderStatus: "PENDING",
      paymentStatus: orderData.paymentMethod === "COD" ? "PENDING" : "COMPLETED",
      history: [{
        status: "PENDING",
        comment: "Order placed successfully"
      }]
    });

    await newOrder.save();

    
    await User.findByIdAndUpdate(user._id, { cart: [] });

    revalidatePath("/checkout");
    revalidatePath("/account?tab=orders");

    return JSON.parse(JSON.stringify({ success: true, order: newOrder }));
  } catch (error) {
    console.error("Error creating order:", error);
    const message = error instanceof Error ? error.message : "Failed to place order";
    return { success: false, message: message };
  }
}
export async function requestReturn(orderId: string, reason: string, orderData?: any) {
  try {
    await dbConnect();
    const session = await auth();
    if (!session?.user?.email) return { success: false, message: "Not authenticated" };

    const { default: User } = await import("@/models/User");
    const user = await User.findOne({ email: session.user.email });
    if (!user) return { success: false, message: "User not found" };

    const order = await Order.findById(orderId);
    if (!order) return { success: false, message: "Order not found" };

    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
    const permissions = (session?.user as any)?.permissions?.orders || { edit: false };
    const hasAdminAccess = isSuperAdmin || permissions.edit;

    if (order.customer.toString() !== user._id.toString() && !hasAdminAccess) {
      return { success: false, message: "Unauthorized: You do not have permission to return this order." };
    }

    
    if (order.orderStatus !== "DELIVERED") {
      return { success: false, message: "Only delivered orders can be returned" };
    }

    if (order.deliveryDate) {
      const delivery = new Date(order.deliveryDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - delivery.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 7) {
        return { success: false, message: "Return period (7 days) has expired" };
      }
    }

    order.orderStatus = "RETURN_REQUESTED";
    order.returnDetails = {
      isReturnRequested: true,
      reason,
      requestDate: new Date(),
      status: "PENDING",
      returnDeadline: order.deliveryDate ? new Date(new Date(order.deliveryDate).getTime() + 7 * 24 * 60 * 60 * 1000) : undefined
    };

    if (order.paymentStatus === "COMPLETED") {
      order.refundDetails = {
        refundMethod: orderData?.refundMethod || "ORIGINAL",
        upiId: orderData?.upiId,
        refundStatus: "PENDING"
      };
    }

    order.history.push({
      status: "RETURN_REQUESTED",
      comment: `Return requested. Reason: ${reason}`
    });

    await order.save();
    revalidatePath("/account?tab=orders");
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, message: message };
  }
}

export async function cancelOrder(orderId: string, reason: string, orderData?: any) {
  try {
    await dbConnect();
    const session = await auth();
    if (!session?.user?.email) return { success: false, message: "Not authenticated" };

    const { default: User } = await import("@/models/User");
    const user = await User.findOne({ email: session.user.email });
    if (!user) return { success: false, message: "User not found" };

    const order = await Order.findById(orderId);
    if (!order) return { success: false, message: "Order not found" };

    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
    const permissions = (session?.user as any)?.permissions?.orders || { edit: false };
    const hasAdminAccess = isSuperAdmin || permissions.edit;

    if (order.customer.toString() !== user._id.toString() && !hasAdminAccess) {
      return { success: false, message: "Unauthorized: You do not have permission to cancel this order." };
    }

    const allowedStatuses = ["PENDING", "CONFIRMED", "PACKED"];
    if (!allowedStatuses.includes(order.orderStatus)) {
      return { success: false, message: `Cannot cancel order in ${order.orderStatus} status. Orders can only be cancelled before they are shipped.` };
    }

    order.orderStatus = "CANCELLED";
    
    if (order.paymentStatus === "COMPLETED") {
      order.refundDetails = {
        refundMethod: orderData?.refundMethod || "ORIGINAL",
        upiId: orderData?.upiId,
        refundStatus: "PENDING"
      };
    } else if (order.paymentMethod === "COD" && order.paymentStatus === "PENDING") {
      order.paymentStatus = "CANCELLED";
    }

    order.history.push({
      status: "CANCELLED",
      comment: `Order cancelled by user. Reason: ${reason}`
    });

    await order.save();
    revalidatePath("/account?tab=orders");
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, message: message };
  }
}

export async function approveReturn(orderId: string) {
  try {
    await dbConnect();
    const session = await auth();
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
    const permissions = (session?.user as any)?.permissions?.orders || { edit: false };
    if (!isSuperAdmin && !permissions.edit) {
      return { success: false, message: "Unauthorized: You do not have permission to approve returns." };
    }

    const order = await Order.findById(orderId);
    if (!order) return { success: false, message: "Order not found" };

    order.orderStatus = "RETURNED";
    order.paymentStatus = "REFUNDED";
    order.returnDetails.status = "COMPLETED";
    if (order.refundDetails) {
      order.refundDetails.refundStatus = "COMPLETED";
    }
    order.history.push({
      status: "RETURNED",
      comment: "Return approved and processed"
    });

    await order.save();
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/account?tab=orders");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, message: message };
  }
}

export async function updateRefundStatus(orderId: string, status: string) {
  try {
    await dbConnect();
    const session = await auth();
    const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
    const permissions = (session?.user as any)?.permissions?.orders || { edit: false };
    if (!isSuperAdmin && !permissions.edit) {
      return { success: false, message: "Unauthorized: You do not have permission to update refund status." };
    }

    const order = await Order.findById(orderId);
    if (!order) return { success: false, message: "Order not found" };

    if (!order.refundDetails) {
      order.refundDetails = { refundMethod: "NONE", refundStatus: "NONE" };
    }

    order.refundDetails.refundStatus = status;
    if (status === "COMPLETED") {
      order.paymentStatus = "REFUNDED";
      order.orderStatus = "REFUNDED";
    }

    order.history.push({
      status: "REFUND_UPDATED",
      comment: `Refund status updated to ${status}`
    });

    await order.save();
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, message: message };
  }
}
