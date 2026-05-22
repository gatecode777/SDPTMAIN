"use client";

import { cn } from "@/lib/utils";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MoreHorizontal,
  Eye,
  Filter,
  Download,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  RotateCcw,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getOrders } from "@/actions/order";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

export default function OrdersPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
  const permissions = (session?.user as any)?.permissions?.orders || { view: false, create: false, edit: false, delete: false };
  const canEdit = isSuperAdmin || permissions.edit;

  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data.orders);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    if (!canEdit) {
      toast.error("You do not have permission to update order status.");
      return;
    }
    setUpdating(true);
    try {
      const { updateOrderStatus } = await import("@/actions/order");
      const res = await updateOrderStatus(selectedOrder._id, newStatus, comment, deliveryDate);
      if (res.success) {
        toast.success("Order status updated successfully");
        setStatusModalOpen(false);
        fetchOrders();
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
      case "CONFIRMED": return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100"><CheckCircle2 className="mr-1 h-3 w-3" /> Confirmed</Badge>;
      case "SHIPPED": return <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100"><Truck className="mr-1 h-3 w-3" /> Shipped</Badge>;
      case "DELIVERED": return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"><CheckCircle2 className="mr-1 h-3 w-3" /> Delivered</Badge>;
      case "CANCELLED": return <Badge variant="destructive"><AlertCircle className="mr-1 h-3 w-3" /> Cancelled</Badge>;
      case "RETURN_REQUESTED": return <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100"><RotateCcw className="mr-1 h-3 w-3" /> Return Requested</Badge>;
      case "RETURNED": return <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100"><ArrowLeft className="mr-1 h-3 w-3" /> Returned</Badge>;
      case "REFUNDED": return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100"><CreditCard className="mr-1 h-3 w-3" /> Refunded</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleExportOrders = () => {
    if (orders.length === 0) {
      toast.error("No orders available to export");
      return;
    }

    try {
      let csvContent = "";
      
      // Headers
      csvContent += "Order ID,Customer Name,Customer Email,Date,Total Amount (₹),Order Status,Payment Status,Payment Method\n";
      
      // Rows
      orders.forEach((order: any) => {
        const orderId = order.orderId ? `"${order.orderId.replace(/"/g, '""')}"` : "";
        const name = order.customer?.name ? `"${order.customer.name.replace(/"/g, '""')}"` : "";
        const email = order.customer?.email ? `"${order.customer.email.replace(/"/g, '""')}"` : "";
        const date = order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : "";
        const total = order.totalAmount || 0;
        const oStatus = order.orderStatus || "";
        const pStatus = order.paymentStatus || "";
        const pMethod = order.paymentMethod || "";
        
        csvContent += `${orderId},${name},${email},${date},${total},${oStatus},${pStatus},${pMethod}\n`;
      });

      // Download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Orders data exported successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export orders data");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders.</p>
        </div>
        <Button variant="outline" onClick={handleExportOrders} disabled={loading}>
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard title="Total Orders" value={orders.length.toLocaleString()} icon={Calendar} color="text-blue-600" />
        <SummaryCard title="Pending" value={orders.filter(o => o.orderStatus === "PENDING").length.toString()} icon={Clock} color="text-amber-600" />
        <SummaryCard title="Shipped" value={orders.filter(o => o.orderStatus === "SHIPPED").length.toString()} icon={Truck} color="text-purple-600" />
        <SummaryCard title="Completed" value={orders.filter(o => o.orderStatus === "DELIVERED").length.toString()} icon={CheckCircle2} color="text-emerald-600" />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search orders by ID or customer..." className="pl-9" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-card/50 backdrop-blur">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto rounded" /></TableCell>
                  </TableRow>
                ))
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs uppercase">#{order.orderId}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{order.customer?.name}</span>
                        <span className="text-[10px] text-muted-foreground">{order.customer?.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{format(new Date(order.createdAt), "MMM dd, yyyy")}</TableCell>
                    <TableCell className="font-semibold">₹{order.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(order.orderStatus)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={order.paymentStatus === "COMPLETED" ? "border-emerald-500 text-emerald-600" : "border-amber-500 text-amber-600"}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8")}>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          </DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => router.push(`/admin/orders/${order._id}`)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          {canEdit && (
                            <DropdownMenuItem onClick={() => {
                              setSelectedOrder(order);
                              setNewStatus(order.orderStatus);
                              setDeliveryDate(order.deliveryDate ? format(new Date(order.deliveryDate), "yyyy-MM-dd") : "");
                              setComment("");
                              setStatusModalOpen(true);
                            }}>
                              <Truck className="mr-2 h-4 w-4" /> Update Status
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => toast.success(`Downloading invoice for order #${order.orderId}...`)}>
                            <Download className="mr-2 h-4 w-4" /> Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {statusModalOpen && canEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background w-full max-w-md p-6 rounded-xl shadow-2xl border animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4">Update Order Status</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Status</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="PENDING" className="bg-background text-foreground">Pending</option>
                  <option value="CONFIRMED" className="bg-background text-foreground">Confirmed</option>
                  <option value="SHIPPED" className="bg-background text-foreground">Shipped</option>
                  <option value="DELIVERED" className="bg-background text-foreground">Delivered</option>
                  <option value="CANCELLED" className="bg-background text-foreground">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Delivery Date</label>
                <Input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Comment</label>
                <Input
                  placeholder="e.g. Order shipped via FedEx"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
              <Button variant="outline" onClick={() => setStatusModalOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateStatus} disabled={updating}>
                {updating ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center ${color}`}>
            <Icon size={20} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
