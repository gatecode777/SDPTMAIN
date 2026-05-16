"use server";

import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import Category from "@/models/Category";

export async function getAnalyticsData() {
  await dbConnect();

  try {
    const orders = await Order.find({ orderStatus: { $ne: "CANCELLED" } }).populate("items.product").lean();
    const users = await User.find({ role: "CUSTOMER" }).lean();
    const categories = await Category.find().lean();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // 1. Sales vs Profit (Monthly)
    // We'll take last 7 months
    const monthlyData: Record<string, { month: string; sales: number; profit: number }> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = monthNames[d.getMonth()];
      monthlyData[mName] = { month: mName, sales: 0, profit: 0 };
    }

    orders.forEach((order: any) => {
      const date = new Date(order.createdAt);
      const mName = monthNames[date.getMonth()];
      if (monthlyData[mName]) {
        monthlyData[mName].sales += order.totalAmount || 0;
        // Mock profit as 15% of sales
        monthlyData[mName].profit += (order.totalAmount || 0) * 0.15;
      }
    });

    const salesHistory = Object.values(monthlyData);

    // 2. Sales by Category
    const categoryStats: Record<string, number> = {};
    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        // If product is populated and has a category
        const catName = item.product?.category?.name || "Uncategorized";
        categoryStats[catName] = (categoryStats[catName] || 0) + (item.price * item.quantity);
      });
    });

    const salesByCategory = Object.entries(categoryStats).map(([name, value]) => ({ name, value }));

    // 3. User Growth (Monthly)
    const userGrowthData: Record<string, { month: string; count: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = monthNames[d.getMonth()];
      userGrowthData[mName] = { month: mName, count: 0 };
    }

    users.forEach((user: any) => {
      const date = new Date(user.createdAt);
      const mName = monthNames[date.getMonth()];
      if (userGrowthData[mName]) {
        userGrowthData[mName].count += 1;
      }
    });

    const userGrowth = Object.values(userGrowthData);

    // 4. Key Stats
    const totalSales = orders.reduce((acc: number, o: any) => acc + (o.totalAmount || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalSales / orders.length : 0;
    
    // Mock conversion rate and bounce rate for now as we don't have tracking data
    const stats = {
      totalSales,
      avgOrderValue,
      totalOrders: orders.length,
      totalCustomers: users.length,
      conversionRate: "3.2%", // Mock
      bounceRate: "42.1%", // Mock
      sessions: "48.2k" // Mock
    };

    return {
      success: true,
      salesHistory,
      salesByCategory,
      userGrowth,
      stats
    };
  } catch (error) {
    console.error("Analytics fetch failed:", error);
    return { success: false, error: "Failed to fetch analytics" };
  }
}
