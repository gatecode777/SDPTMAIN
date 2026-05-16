"use server";

import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import Order from "@/models/Order";

export async function getCustomers() {
  await dbConnect();
  // Fetch users with role CUSTOMER
  const customers = await User.find({ role: "CUSTOMER" }).sort({ createdAt: -1 });
  
  // For each customer, get their order count and total spend
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
