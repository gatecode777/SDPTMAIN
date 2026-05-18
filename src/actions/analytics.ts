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
        
        monthlyData[mName].profit += (order.totalAmount || 0) * 0.15;
      }
    });

    const salesHistory = Object.values(monthlyData);

    
    const categoryStats: Record<string, number> = {};
    orders.forEach((order: any) => {
      order.items.forEach((item: any) => {
        
        const catName = item.product?.category?.name || "Uncategorized";
        categoryStats[catName] = (categoryStats[catName] || 0) + (item.price * item.quantity);
      });
    });

    const salesByCategory = Object.entries(categoryStats).map(([name, value]) => ({ name, value }));

    
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

    
    const totalSales = orders.reduce((acc: number, o: any) => acc + (o.totalAmount || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalSales / orders.length : 0;
    
    
    const stats = {
      totalSales,
      avgOrderValue,
      totalOrders: orders.length,
      totalCustomers: users.length,
      conversionRate: "3.2%", 
      bounceRate: "42.1%", 
      sessions: "48.2k" 
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
