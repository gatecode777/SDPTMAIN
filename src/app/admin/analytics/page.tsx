"use client";

import { 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import {
  Download,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { getAnalyticsData } from "@/actions/analytics";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  async function fetchAnalytics() {
    setLoading(true);
    const res = await getAnalyticsData();
    if (res.success) {
      setData(res);
    }
    setLoading(false);
  }

  const fmt = (v: number) => `₹${v.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your store's performance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAnalytics} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh Data"}
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticStat 
          title="Total Sales" 
          value={loading ? <Skeleton className="h-8 w-24" /> : fmt(data?.stats?.totalSales || 0)} 
          change="+12.4%" 
          trend="up" 
        />
        <AnalyticStat 
          title="Avg. Order Value" 
          value={loading ? <Skeleton className="h-8 w-24" /> : fmt(data?.stats?.avgOrderValue || 0)} 
          change="+2.1%" 
          trend="up" 
        />
        <AnalyticStat 
          title="Total Orders" 
          value={loading ? <Skeleton className="h-8 w-24" /> : data?.stats?.totalOrders || 0} 
          change="+8.5%" 
          trend="up" 
        />
        <AnalyticStat 
          title="Total Customers" 
          value={loading ? <Skeleton className="h-8 w-24" /> : data?.stats?.totalCustomers || 0} 
          change="+19%" 
          trend="up" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-none bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Sales vs Profit</CardTitle>
            <CardDescription>Comparison between gross sales and net profit (estimated 15% margin).</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {loading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.salesHistory || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip formatter={(v: any) => fmt(v)} />
                  <Legend verticalAlign="top" align="right" height={36} />
                  <Area type="monotone" dataKey="sales" name="Gross Sales" stroke="#0088FE" fillOpacity={0.1} fill="#0088FE" />
                  <Area type="monotone" dataKey="profit" name="Net Profit (Est)" stroke="#00C49F" fillOpacity={0.1} fill="#00C49F" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-none bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Distribution of sales across main categories.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {loading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.salesByCategory || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(data?.salesByCategory || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => fmt(v)} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
         <Card className="shadow-sm border-none bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New customer registrations over time.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.userGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.1)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" name="New Users" stroke="hsl(var(--primary))" strokeWidth={3} dot={{r: 4, fill: "hsl(var(--primary))"}} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AnalyticStat({ title, value, change, trend }: any) {
  return (
    <Card className="shadow-sm border-none bg-card/50 backdrop-blur">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`flex items-center text-xs mt-1 font-medium ${trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
          {trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
          {change}
          <span className="text-muted-foreground ml-1">vs prev. period</span>
        </p>
      </CardContent>
    </Card>
  );
}
