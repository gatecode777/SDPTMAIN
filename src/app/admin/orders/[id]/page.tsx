"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Loader2,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getOrders } from "@/actions/order";

export default function OrderDetailsPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
  const permissions = (session?.user as any)?.permissions?.orders || { view: false, create: false, edit: false, delete: false };
  const canEdit = isSuperAdmin || permissions.edit;

  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      try {
        const data = await getOrders();
        const foundOrder = data.orders.find((o: any) => o._id === id);
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          toast.error("Order not found");
          router.push("/orders");
        }
      } catch (error) {
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id, router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge variant="secondary" className="bg-amber-100 text-amber-700"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
      case "CONFIRMED": return <Badge variant="secondary" className="bg-blue-100 text-blue-700"><CheckCircle2 className="mr-1 h-3 w-3" /> Confirmed</Badge>;
      case "SHIPPED": return <Badge variant="secondary" className="bg-purple-100 text-purple-700"><Truck className="mr-1 h-3 w-3" /> Shipped</Badge>;
      case "DELIVERED": return <Badge variant="secondary" className="bg-emerald-100 text-emerald-700"><CheckCircle2 className="mr-1 h-3 w-3" /> Delivered</Badge>;
      case "CANCELLED": return <Badge variant="destructive"><AlertCircle className="mr-1 h-3 w-3" /> Cancelled</Badge>;
      case "RETURN_REQUESTED": return <Badge variant="destructive" className="bg-red-100 text-red-700"><AlertCircle className="mr-1 h-3 w-3" /> Return Requested</Badge>;
      case "RETURNED": return <Badge variant="destructive" className="bg-gray-100 text-gray-700"><ArrowLeft className="mr-1 h-3 w-3" /> Returned</Badge>;
      case "REFUNDED": return <Badge variant="secondary" className="bg-blue-100 text-blue-700"><CreditCard className="mr-1 h-3 w-3" /> Refunded</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApproveReturn = async () => {
    if (!canEdit) {
      toast.error("You do not have permission to approve returns.");
      return;
    }
    const { approveReturn } = await import("@/actions/order");
    setLoading(true);
    try {
      const res = await approveReturn(id);
      if (res.success) {
        toast.success("Return approved and processed");
        const data = await getOrders();
        setOrder(data.orders.find((o: any) => o._id === id));
      } else {
        toast.error("Failed to approve return");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!canEdit) {
      toast.error("You do not have permission to update order status.");
      return;
    }
    const { updateOrderStatus } = await import("@/actions/order");
    setLoading(true);
    try {
      const res = await updateOrderStatus(id, status);
      if (res.success) {
        toast.success(`Order marked as ${status}`);
        const data = await getOrders();
        setOrder(data.orders.find((o: any) => o._id === id));
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRefundStatus = async (status: string) => {
    if (!canEdit) {
      toast.error("You do not have permission to update refund status.");
      return;
    }
    const { updateRefundStatus } = await import("@/actions/order");
    setLoading(true);
    try {
      const res = await updateRefundStatus(id, status);
      if (res.success) {
        toast.success(`Refund marked as ${status}`);
        const data = await getOrders();
        setOrder(data.orders.find((o: any) => o._id === id));
      } else {
        toast.error("Failed to update refund status");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!order) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
            <p className="text-muted-foreground font-mono">#{order.orderId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => toast.success("Invoice downloading...")}>
            <FileText className="mr-2 h-4 w-4" /> Download Invoice
          </Button>
          {canEdit && order.orderStatus === "PENDING" && (
            <Button onClick={() => handleUpdateStatus("CONFIRMED")}>Mark as Confirmed</Button>
          )}
          {canEdit && order.orderStatus === "CONFIRMED" && (
            <Button onClick={() => handleUpdateStatus("SHIPPED")}>Mark as Shipped</Button>
          )}
          {canEdit && order.orderStatus === "SHIPPED" && (
            <Button onClick={() => handleUpdateStatus("DELIVERED")}>Mark as Delivered</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded border bg-muted flex items-center justify-center">
                      {item.product?.thumbnail ? (
                        <img src={item.product.thumbnail} alt={item.product.name} className="h-full w-full object-cover" />
                      ) : (
                        <Package className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.product?.name || item.name || "Product Name"}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{(item.quantity * item.price).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{order.totalAmount?.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>₹{order.totalAmount?.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>Detailed timeline of order status updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.history?.slice().reverse().map((event: any, index: number) => (
                  <div key={index} className="flex gap-4 relative pb-4 last:pb-0">
                    {index !== order.history.length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-0 w-[2px] bg-muted" />
                    )}
                    <div className="mt-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center z-10">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-semibold">{event.status}</p>
                        <p className="text-[10px] text-muted-foreground">{format(new Date(event.timestamp), "MMM dd, yyyy HH:mm")}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{event.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{order.customer?.name}</p>
                  <p className="text-xs text-muted-foreground">Customer</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm">{order.customer?.email}</p>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm">{order.shippingAddress?.phone || "N/A"}</p>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                {getStatusBadge(order.orderStatus)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Payment</span>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className={order.paymentStatus === "COMPLETED" ? "border-emerald-500 text-emerald-600" : order.paymentStatus === "REFUNDED" ? "border-red-500 text-red-600" : "border-amber-500 text-amber-600"}>
                    {order.paymentStatus}
                  </Badge>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{order.paymentMethod}</span>
                </div>
              </div>

              {order.paymentDetails && (
                <div className="bg-muted/50 p-3 rounded-lg text-xs space-y-2 border border-dashed">
                  <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Transaction Info</p>
                  {order.paymentDetails.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono">{order.paymentDetails.transactionId}</span>
                    </div>
                  )}
                  {order.paymentDetails.upiId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">UPI:</span>
                      <span>{order.paymentDetails.upiId}</span>
                    </div>
                  )}
                  {order.paymentDetails.cardLast4 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Card:</span>
                      <span>**** **** **** {order.paymentDetails.cardLast4}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> Date</span>
                <span>{format(new Date(order.createdAt), "MMM dd, yyyy")}</span>
              </div>
            </CardContent>
          </Card>

          {(order.refundDetails?.refundMethod !== "NONE" || (order.orderStatus === "CANCELLED" && order.paymentStatus === "COMPLETED") || order.orderStatus === "RETURN_REQUESTED" || order.orderStatus === "RETURNED") && (
            <Card className="border-primary/20 bg-primary/5 shadow-md">
              <CardHeader className="pb-2 border-b border-primary/10">
                <CardTitle className="text-primary flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5" /> Refund Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">Refund Method:</span>
                  <Badge variant="outline" className="bg-background font-bold text-primary border-primary/30">
                    {order.refundDetails?.refundMethod || (order.paymentMethod === "COD" ? "NONE" : "ORIGINAL")}
                  </Badge>
                </div>
                {order.refundDetails.refundMethod === "ORIGINAL" ? (
                  order.paymentMethod === "UPI" && order.paymentDetails?.upiId ? (
                    <div className="flex flex-col gap-2 p-3 rounded-lg bg-emerald-50/30 border border-emerald-200/50">
                      <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Original Payment UPI (Source)</span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-emerald-900 break-all">{order.paymentDetails.upiId}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-emerald-600 hover:bg-emerald-100 flex-shrink-0"
                          onClick={() => {
                            navigator.clipboard.writeText(order.paymentDetails.upiId);
                            toast.success("Source UPI ID copied");
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </Button>
                      </div>
                      <p className="text-[10px] text-emerald-600 italic mt-1">User requested refund to original payment source.</p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground p-3 bg-muted/30 rounded border border-dashed">
                      Refund should be processed back to the original {order.paymentMethod} source.
                    </p>
                  )
                ) : (
                  <div className="space-y-3">
                    {order.paymentDetails?.upiId && (
                      <div className="flex flex-col gap-1 opacity-60">
                        <span className="text-[10px] font-bold uppercase">Original UPI (Source)</span>
                        <span className="text-xs font-mono">{order.paymentDetails.upiId}</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <span className="text-[10px] text-primary font-bold uppercase tracking-wider">New Refund UPI (Target)</span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-primary break-all">{order.refundDetails.upiId}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-primary hover:bg-primary/10 flex-shrink-0"
                          onClick={() => {
                            navigator.clipboard.writeText(order.refundDetails.upiId);
                            toast.success("Target UPI ID copied");
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm pt-2 border-t border-primary/10">
                  <span className="text-muted-foreground font-medium">Refund Status:</span>
                  <Badge className={cn(
                    "font-bold",
                    order.refundDetails?.refundStatus === "COMPLETED" 
                      ? "bg-emerald-500 text-white" 
                      : "bg-amber-500 text-white"
                  )}>
                    {order.refundDetails?.refundStatus || "PENDING"}
                  </Badge>
                </div>
                {canEdit && order.refundDetails?.refundStatus !== "COMPLETED" && (
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold" 
                    onClick={() => handleUpdateRefundStatus("COMPLETED")}
                  >
                    Mark as Refunded
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {order.returnDetails?.isReturnRequested && (
            <Card className="border-red-200 bg-red-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" /> Return Requested
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-semibold text-red-800">Reason:</p>
                  <p className="text-red-600">{order.returnDetails.reason}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-red-100">
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100">{order.returnDetails.status}</Badge>
                  <span className="text-xs text-red-500">{format(new Date(order.returnDetails.requestDate), "MMM dd, yyyy")}</span>
                </div>
                {order.returnDetails.status === "PENDING" && canEdit && (
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-white" onClick={() => handleUpdateStatus("CONFIRMED")}>Reject</Button>
                    <Button size="sm" className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleApproveReturn}>Approve Return</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {order.orderStatus === "CANCELLED" && (
            <Card className="border-destructive/20 bg-destructive/5 shadow-md">
              <CardHeader className="pb-2 border-b border-destructive/10">
                <CardTitle className="text-destructive flex items-center gap-2 text-lg">
                  <AlertCircle className="h-5 w-5" /> Order Cancelled
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-sm space-y-2">
                  <p className="font-bold text-destructive uppercase tracking-wider text-xs">Cancellation Info</p>
                  <div className="p-3 bg-background rounded-lg border border-destructive/20 text-foreground font-medium">
                    {order.history?.find((h: any) => h.status === "CANCELLED")?.comment || "No reason provided."}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
