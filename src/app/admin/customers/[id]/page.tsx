"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Loader2, 
  Mail, 
  Calendar,
  ShoppingBag,
  IndianRupee,
  Package
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getCustomers } from "@/actions/customer";
import { getOrders } from "@/actions/order";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CustomerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const customersData = await getCustomers();
        const foundCustomer = customersData.find((c: any) => c._id === id);
        
        if (foundCustomer) {

          setCustomer(foundCustomer);
          
          const ordersData = await getOrders();
          const customerOrders = ordersData.orders.filter((o: any) => 
            o.customer && (o.customer._id === id || o.customer === id)
          );
          setOrders(customerOrders);
        } else {
          toast.error("Customer not found");
          router.push("/admin/customers");
        }
      } catch (error) {
        toast.error("Failed to load customer details");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!customer) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Profile</h1>
          <p className="text-muted-foreground">Detailed overview of customer activity and history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 border-4 border-background shadow-xl mb-4">
                  <AvatarImage src={customer.image} alt={customer.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                    {customer.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{customer.name}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Mail size={14} /> {customer.email}
                </p>
                <div className="mt-4 flex gap-2">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Verified</Badge>
                  <Badge variant="outline">Customer</Badge>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><Calendar size={16} /> Member Since</span>
                  <span className="font-medium">{format(new Date(customer.createdAt), "MMM dd, yyyy")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><ShoppingBag size={16} /> Total Orders</span>
                  <span className="font-medium">{customer.orderCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><IndianRupee size={16} /> Total Spent</span>
                  <span className="font-medium text-emerald-600 font-semibold">₹{customer.totalSpend.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.addresses && customer.addresses.length > 0 ? (
                <div className="space-y-4">
                  {customer.addresses.map((addr: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg border bg-muted/30 text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold">{addr.label || "Address"}</span>
                        {addr.isDefault && <Badge className="text-[10px] h-4">Default</Badge>}
                      </div>
                      <p>{addr.fullName}</p>
                      {addr.phone && <p className="text-muted-foreground">📞 {addr.phone}</p>}
                      <p className="text-muted-foreground">{addr.street}</p>
                      <p className="text-muted-foreground">{addr.city}, {addr.state} {addr.zipCode}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No saved addresses</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order._id} 
                      className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => router.push(`/admin/orders/${order._id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="font-medium font-mono text-sm uppercase">#{order.orderId}</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(order.createdAt), "MMM dd, yyyy")}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">₹{order.totalAmount.toLocaleString()}</p>
                        <Badge variant="outline" className="text-[10px] uppercase h-5 mt-1">
                          {order.orderStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag size={40} className="mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground text-sm">This customer hasn't placed any orders yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
