"use server";

import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import Category from "@/models/Category";

export async function getAnalyticsData() {
  await dbConnect();

  try {
    const [orders, users, categories] = await Promise.all([
      Order.find({ orderStatus: { $ne: "CANCELLED" } })
        .populate({
          path: "items.product",
          populate: {
            path: "category",
            model: "Category"
          }
        })
        .lean(),
      User.find({ role: "CUSTOMER" }).lean(),
      Category.find().lean()
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    
    
    const monthlyData: Record<string, { month: string; sales: number; profit: number; ordersCount: number }> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = monthNames[d.getMonth()];
      monthlyData[mName] = { month: mName, sales: 0, profit: 0, ordersCount: 0 };
    }

    orders.forEach((order: any) => {
      const date = new Date(order.createdAt);
      const mName = monthNames[date.getMonth()];
      if (monthlyData[mName]) {
        monthlyData[mName].sales += order.totalAmount || 0;
        
        monthlyData[mName].profit += (order.totalAmount || 0) * 0.15;
        monthlyData[mName].ordersCount += 1;
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

    // 4. Sales by Day (past 7 days, in chronological order)
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const salesByDayList: { day: string; dateStr: string; sales: number }[] = [];
    const tempDate = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(tempDate.getDate() - i);
      const dayName = dayNames[d.getDay()];
      const dateStr = d.toISOString().split('T')[0];
      salesByDayList.push({ day: dayName, dateStr, sales: 0 });
    }

    orders.forEach((order: any) => {
      if (!order.createdAt) return;
      const orderDateStr = new Date(order.createdAt).toISOString().split('T')[0];
      const match = salesByDayList.find(item => item.dateStr === orderDateStr);
      if (match) {
        match.sales += order.totalAmount || 0;
      }
    });
    
    const salesByDay = salesByDayList.map(({ day, sales }) => ({ day, sales }));

    
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

    // MoM Growth math
    const currentMonthData = salesHistory[salesHistory.length - 1];
    const prevMonthData = salesHistory[salesHistory.length - 2];
    
    const salesGrowth = prevMonthData?.sales > 0 
      ? ((currentMonthData.sales - prevMonthData.sales) / prevMonthData.sales) * 100 
      : (currentMonthData?.sales > 0 ? 100 : 0);

    const ordersGrowth = prevMonthData?.ordersCount > 0
      ? ((currentMonthData.ordersCount - prevMonthData.ordersCount) / prevMonthData.ordersCount) * 100
      : (currentMonthData?.ordersCount > 0 ? 100 : 0);

    const currentUserMonth = userGrowth[userGrowth.length - 1];
    const prevUserMonth = userGrowth[userGrowth.length - 2];
    const customerGrowth = prevUserMonth?.count > 0
      ? ((currentUserMonth.count - prevUserMonth.count) / prevUserMonth.count) * 100
      : (currentUserMonth?.count > 0 ? 100 : 0);
    
    
    const stats = {
      totalSales,
      avgOrderValue,
      totalOrders: orders.length,
      totalCustomers: users.length,
      currentMonthOrders: currentMonthData?.ordersCount || 0,
      revenueGrowth: (salesGrowth >= 0 ? "+" : "") + salesGrowth.toFixed(1) + "%",
      ordersGrowth: (ordersGrowth >= 0 ? "+" : "") + ordersGrowth.toFixed(1) + "%",
      customerGrowth: (customerGrowth >= 0 ? "+" : "") + customerGrowth.toFixed(1) + "%",
      conversionRate: "3.2%", 
      bounceRate: "42.1%", 
      sessions: "48.2k" 
    };

    return {
      success: true,
      salesHistory,
      salesByCategory,
      salesByDay,
      userGrowth,
      stats
    };
  } catch (error) {
    console.error("Analytics fetch failed:", error);
    return { success: false, error: "Failed to fetch analytics" };
  }
}
