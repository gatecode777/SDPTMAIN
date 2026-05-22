"use client";

import { cn } from "@/lib/utils";
import { 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownRight,
  Package
} from "lucide-react";
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid
} from "recharts";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const data = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 2100 },
  { name: "Mar", total: 1800 },
  { name: "Apr", total: 2400 },
  { name: "May", total: 3200 },
  { name: "Jun", total: 2800 },
  { name: "Jul", total: 3600 },
];

const revenueData = [
  { day: "Mon", amount: 400 },
  { day: "Tue", amount: 300 },
  { day: "Wed", amount: 600 },
  { day: "Thu", amount: 800 },
  { day: "Fri", amount: 500 },
  { day: "Sat", amount: 900 },
  { day: "Sun", amount: 700 },
];

import { useEffect, useState } from "react";
import { getOrders } from "@/actions/order";
import { getProducts } from "@/actions/product";
import { getCustomers } from "@/actions/customer";
import { getAnalyticsData } from "@/actions/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 15000); // 15 seconds real-time update
    return () => clearInterval(interval);
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const [ordersData, productsData, customersData, analyticsData] = await Promise.all([
        getOrders(),
        getProducts({}, 1, 5),
        getCustomers(),
        getAnalyticsData()
      ]);

      const totalRevenue = ordersData.orders.reduce((acc: number, order: any) => acc + (order.totalAmount || 0), 0);
      
      setStats({
        revenue: totalRevenue,
        orders: ordersData.orders.length,
        customers: customersData.length,
        products: productsData.total
      });

      setRecentOrders(ordersData.orders.slice(0, 5));
      if (analyticsData.success) {
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDownloadReport = () => {
    if (loading || !stats) {
      toast.error("Dashboard data is still loading. Please wait.");
      return;
    }

    try {
      let csvContent = "";
      
      // Title and Meta
      csvContent += "SDPT Dashboard Summary Report\n";
      csvContent += `Generated At,${new Date().toLocaleString()}\n\n`;
      
      // Stats Section
      csvContent += "METRIC,VALUE\n";
      csvContent += `Total Revenue,₹${stats.revenue.toLocaleString("en-IN")}\n`;
      csvContent += `Total Orders,${stats.orders}\n`;
      csvContent += `Total Customers,${stats.customers}\n`;
      csvContent += `Active Products,${stats.products}\n\n`;
      
      // Sales History Section
      if (analytics?.salesHistory && analytics.salesHistory.length > 0) {
        csvContent += "SALES HISTORY BY MONTH\n";
        csvContent += "Month,Sales\n";
        analytics.salesHistory.forEach((item: any) => {
          csvContent += `${item.month},₹${item.sales}\n`;
        });
        csvContent += "\n";
      }
      
      // Sales by Category Section
      if (analytics?.salesByCategory && analytics.salesByCategory.length > 0) {
        csvContent += "SALES BY CATEGORY\n";
        csvContent += "Category,Sales Value\n";
        analytics.salesByCategory.forEach((item: any) => {
          const catName = item.name ? `"${item.name.replace(/"/g, '""')}"` : "Uncategorized";
          csvContent += `${catName},₹${item.value}\n`;
        });
        csvContent += "\n";
      }

      // Create Blob and Download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `dashboard_report_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate report");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDownloadReport} disabled={loading}>
            Download Report
          </Button>
          <Button onClick={() => window.open("/", "_blank")}>View Store</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Revenue" 
          value={loading ? <Skeleton className="h-8 w-24" /> : `₹${stats?.revenue?.toLocaleString("en-IN")}`} 
          change={analytics?.stats?.revenueGrowth || "+0.0%"} 
          trend={(parseFloat(analytics?.stats?.revenueGrowth) || 0) >= 0 ? "up" : "down"}
          icon={IndianRupee}
        />
        <StatCard 
          title="Orders" 
          value={loading ? <Skeleton className="h-8 w-24" /> : stats?.orders} 
          change={analytics?.stats?.ordersGrowth || "+0.0%"} 
          trend={(parseFloat(analytics?.stats?.ordersGrowth) || 0) >= 0 ? "up" : "down"}
          icon={ShoppingBag}
        />
        <StatCard 
          title="Customers" 
          value={loading ? <Skeleton className="h-8 w-24" /> : stats?.customers} 
          change={analytics?.stats?.customerGrowth || "+0.0%"} 
          trend={(parseFloat(analytics?.stats?.customerGrowth) || 0) >= 0 ? "up" : "down"}
          icon={Users}
        />
        <StatCard 
          title="Active Products" 
          value={loading ? <Skeleton className="h-8 w-24" /> : stats?.products} 
          change="+0.0%" 
          trend="up"
          icon={Package}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-none bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue growth for the current year</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.salesHistory || []}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip formatter={(v: any) => `₹${v.toLocaleString()}`} />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="var(--primary)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-none bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made {analytics?.stats?.currentMonthOrders || 0} sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="ml-4 space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="ml-auto h-4 w-12" />
                  </div>
                ))
              ) : recentOrders.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No recent sales</p>
              ) : (
                recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center">
                     <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                      {order.customer?.name?.[0] || "G"}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{order.customer?.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer?.email}</p>
                    </div>
                    <div className="ml-auto font-medium">+₹{order.totalAmount.toLocaleString("en-IN")}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
         <Card className="col-span-3 shadow-sm border-none bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Sales by Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.salesByDay || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Bar 
                    dataKey="sales" 
                    fill="var(--primary)" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Tooltip formatter={(v: any) => `₹${v.toLocaleString()}`} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Latest Orders</CardTitle>
              <CardDescription>A list of your most recent transactions.</CardDescription>
            </div>
            <Button variant="link">View All</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto rounded" /></TableCell>
                    </TableRow>
                  ))
                ) : recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">No recent orders</TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium text-xs">#{order.orderId}</TableCell>
                      <TableCell>
                        <Badge variant={order.orderStatus === "DELIVERED" ? "default" : "secondary"}>
                          {order.orderStatus.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{order.totalAmount.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => window.location.href = `/admin/orders/${order._id}`}>Details</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, trend, icon: Icon }: any) {
  return (
    <Card className="shadow-sm border-none bg-card/50 backdrop-blur transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={cn(
          "flex items-center text-xs mt-1 font-medium",
          trend === "up" ? "text-emerald-500" : "text-rose-500"
        )}>
          {trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
          {change}
          <span className="text-muted-foreground ml-1">from last month</span>
        </p>
      </CardContent>
    </Card>
  );
}

function Avatar({ i }: { i: number }) {
  const colors = ["bg-blue-100 text-blue-600", "bg-purple-100 text-purple-600", "bg-amber-100 text-amber-600", "bg-emerald-100 text-emerald-600", "bg-rose-100 text-rose-600"];
  return (
    <div className={cn("h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs", colors[i-1])}>
      C{i}
    </div>
  )
}
