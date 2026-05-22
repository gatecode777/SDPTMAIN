"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  MoreHorizontal, 
  Mail,
  Calendar,
  ShoppingBag,
  IndianRupee,
  User as UserIcon,
  Filter,
  Download
} from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { getCustomers } from "@/actions/customer";
import { format } from "date-fns";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportData = () => {
    const listToExport = filteredCustomers.length > 0 ? filteredCustomers : customers;
    if (listToExport.length === 0) {
      toast.error("No customer data available to export");
      return;
    }

    try {
      let csvContent = "";
      
      // Headers
      csvContent += "Customer ID,Name,Email,Joined Date,Orders Count,Total Spent (₹)\n";
      
      // Rows
      listToExport.forEach((customer: any) => {
        const id = customer._id || "";
        const name = customer.name ? `"${customer.name.replace(/"/g, '""')}"` : "";
        const email = customer.email ? `"${customer.email.replace(/"/g, '""')}"` : "";
        const joinedDate = customer.createdAt ? new Date(customer.createdAt).toISOString().split('T')[0] : "";
        const orderCount = customer.orderCount || 0;
        const totalSpend = customer.totalSpend || 0;
        
        csvContent += `${id},${name},${email},${joinedDate},${orderCount},${totalSpend.toFixed(2)}\n`;
      });

      // Download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `customers_export_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Customers data exported successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export customer data");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your customer database and viewing their activity.</p>
        </div>
        <Button variant="outline" onClick={handleExportData} disabled={loading}>
          <Download className="mr-2 h-4 w-4" /> Export Data
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by name or email..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto rounded" /></TableCell>
                  </TableRow>
                ))
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer._id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarImage src={customer.image} alt={customer.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {customer.name?.[0] || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      <div className="flex items-center gap-1">
                        <Mail size={14} className="text-muted-foreground/60" />
                        {customer.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-muted-foreground/60" />
                        {format(new Date(customer.createdAt), "MMM dd, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-1">
                        <ShoppingBag size={14} className="text-muted-foreground/60" />
                        {customer.orderCount}
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-1 font-semibold text-emerald-600">
                        <IndianRupee size={14} />
                        {customer.totalSpend.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors outline-none">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          </DropdownMenuGroup>
                          <DropdownMenuItem onClick={() => router.push(`/admin/customers/${customer._id}`)}>
                            <UserIcon className="mr-2 h-4 w-4" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/admin/customers/${customer._id}`)}>
                            <ShoppingBag className="mr-2 h-4 w-4" /> View Orders
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
    </div>
  );
}
