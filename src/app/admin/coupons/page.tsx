"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Tag, 
  Trash2, 
  Calendar, 
  IndianRupee, 
  MoreHorizontal,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { getCoupons, updateCouponStatus, deleteCoupon } from "@/actions/coupon";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select as FormSelect, 
  SelectContent as FormSelectContent, 
  SelectItem as FormSelectItem, 
  SelectTrigger as FormSelectTrigger, 
  SelectValue as FormSelectValue 
} from "@/components/ui/select";
import { createCoupon } from "@/actions/coupon";
import { useSession } from "next-auth/react";

export default function CouponsPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
  const permissions = (session?.user as any)?.permissions?.coupons || { view: false, create: false, edit: false, delete: false };

  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [discountType, setDiscountType] = useState<string>("PERCENTAGE");

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    setLoading(true);
    try {
      const result = await getCoupons();
      if (result.success) {
        setCoupons(result.coupons);
      }
    } catch (error) {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const result = await updateCouponStatus(id, !currentStatus);
      if (result.success) {
        toast.success("Coupon status updated");
        fetchCoupons();
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const result = await deleteCoupon(id);
      if (result.success) {
        toast.success("Coupon deleted");
        fetchCoupons();
      }
    } catch (error) {
      toast.error("Failed to delete coupon");
    }
  };

  async function handleCreateCoupon(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      code: formData.get("code")?.toString().toUpperCase(),
      type: discountType === "FIXED_AMOUNT" ? "FIXED" : "PERCENTAGE",
      value: Number(formData.get("discountValue") || 0),
      expiryDate: formData.get("expiryDate"),
      usageLimit: Number(formData.get("usageLimit") || 0),
      minCartValue: Number(formData.get("minPurchaseAmount") || 0),
      isActive: true,
    };

    try {
      const result = await createCoupon(data);
      if (result.success) {
        toast.success("Coupon created successfully");
        setIsCreateModalOpen(false);
        fetchCoupons();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to create coupon");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupons & Discounts</h1>
          <p className="text-muted-foreground">Manage promotional codes and special offers.</p>
        </div>
        
        {(isSuperAdmin || permissions.create) && (
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger 
              render={
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create Coupon
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Coupon</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateCoupon} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input id="code" name="code" placeholder="SAVE20" required className="uppercase" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountType">Type</Label>
                    <FormSelect 
                      name="discountType" 
                      value={discountType} 
                      onValueChange={(val) => setDiscountType(val || "PERCENTAGE")}
                    >
                      <FormSelectTrigger>
                        <FormSelectValue placeholder="Select type">
                          {discountType === "PERCENTAGE" ? "Percentage (%)" : "Fixed Amount (₹)"}
                        </FormSelectValue>
                      </FormSelectTrigger>
                      <FormSelectContent>
                        <FormSelectItem value="PERCENTAGE">Percentage (%)</FormSelectItem>
                        <FormSelectItem value="FIXED_AMOUNT">Fixed Amount (₹)</FormSelectItem>
                      </FormSelectContent>
                    </FormSelect>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountValue">Value</Label>
                    <Input id="discountValue" name="discountValue" type="number" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minPurchaseAmount">Min. Purchase</Label>
                    <Input id="minPurchaseAmount" name="minPurchaseAmount" type="number" defaultValue="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">Usage Limit</Label>
                    <Input id="usageLimit" name="usageLimit" type="number" defaultValue="100" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" name="expiryDate" type="date" required />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={creating} className="w-full">
                    {creating ? "Creating..." : "Save Coupon"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Tag size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Coupons</p>
                <h3 className="text-2xl font-bold">
                  {coupons.filter(c => c.isActive && new Date(c.expiryDate) >= new Date()).length}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Uses</p>
                <h3 className="text-2xl font-bold">
                  {coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0).toLocaleString()}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <IndianRupee size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Discounted</p>
                <h3 className="text-2xl font-bold">₹0</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by code..." 
            className="pl-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm bg-card/50 backdrop-blur">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Coupon Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-24 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto rounded" /></TableCell>
                  </TableRow>
                ))
              ) : coupons.filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No coupons found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                coupons.filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase())).map((coupon) => {
                  const isExpired = new Date(coupon.expiryDate) < new Date();
                  return (
                    <TableRow key={coupon._id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-sm px-3 py-1 bg-primary/5 border-primary/20 text-primary">
                          {coupon.code}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize text-sm">{coupon.type.toLowerCase()}</TableCell>
                      <TableCell className="font-semibold">
                        {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `₹${coupon.value}`}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1"><Calendar size={12} className="text-muted-foreground" /> {format(new Date(coupon.expiryDate), "MMM dd, yyyy")}</span>
                          {isExpired && <span className="text-red-500 font-medium">Expired</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className="font-medium">{coupon.usedCount}</span>
                        <span className="text-muted-foreground">/{coupon.usageLimit}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn(
                          "rounded-full px-2 py-0",
                          coupon.isActive && !isExpired ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-red-100 text-red-700 hover:bg-red-100"
                        )}>
                          {coupon.isActive && !isExpired ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {(isSuperAdmin || permissions.edit || permissions.delete) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors outline-none">
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuGroup>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              </DropdownMenuGroup>
                              {(isSuperAdmin || permissions.edit) && (
                                <DropdownMenuItem onClick={() => handleToggleStatus(coupon._id, coupon.isActive)}>
                                  {coupon.isActive ? <XCircle className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                  {coupon.isActive ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                              )}
                              {(isSuperAdmin || permissions.delete) && (
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(coupon._id)}>
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
