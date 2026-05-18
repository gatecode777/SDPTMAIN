"use server";

import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Order from "@/models/Order";

export async function getCustomers() {
  await dbConnect();
  
  const customers = await User.find({ role: "CUSTOMER" }).sort({ createdAt: -1 });
  
  
  const customersWithStats = await Promise.all(customers.map(async (customer) => {
    const orders = await Order.find({ customer: customer._id });
    const totalSpend = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      ...JSON.parse(JSON.stringify(customer)),
      orderCount: orders.length,
      totalSpend,
    };
  }));

  return customersWithStats;
}
