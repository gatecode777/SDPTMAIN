"use server";

import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Order from "@/models/Order";

export async function getCustomers() {
  await dbConnect();
  
  const customers = await User.find({ role: "CUSTOMER" }).sort({ createdAt: -1 }).lean();
  const customerIds = customers.map(c => c._id);
  
  const orders = await Order.find({ customer: { $in: customerIds } }).lean();
  
  const statsMap: Record<string, { orderCount: number; totalSpend: number }> = {};
  for (const order of orders) {
    if (!order.customer) continue;
    const custId = order.customer.toString();
    if (!statsMap[custId]) {
      statsMap[custId] = { orderCount: 0, totalSpend: 0 };
    }
    statsMap[custId].orderCount += 1;
    statsMap[custId].totalSpend += order.totalAmount || 0;
  }

  const customersWithStats = customers.map((customer) => {
    const custId = customer._id.toString();
    const stats = statsMap[custId] || { orderCount: 0, totalSpend: 0 };
    return {
      ...JSON.parse(JSON.stringify(customer)),
      orderCount: stats.orderCount,
      totalSpend: stats.totalSpend,
    };
  });

  return customersWithStats;
}
