"use client";

import { cn } from "@/lib/utils";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  ShoppingBag
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getProducts, deleteProduct } from "@/actions/product";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

export default function ProductsPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
  const permissions = (session?.user as any)?.permissions?.products || { view: false, create: false, edit: false, delete: false };

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(1, searchTerm, statusFilter);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchProducts(page, searchTerm, statusFilter);
  }, [page]);

  async function fetchProducts(currentPage = page, search = searchTerm, status = statusFilter) {
    setLoading(true);
    try {
      const query: any = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { sku: { $regex: search, $options: "i" } }
        ];
      }
      if (status !== "ALL") {
        query.status = status;
      }
      const data = await getProducts(query, currentPage, 10);
      setProducts(data.products);
      setTotalPages(data.pages || 1);
      setPage(currentPage);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this product?")) {
      const result = await deleteProduct(id);
      if (result.success) {
        toast.success("Product deleted successfully");
        fetchProducts(page, searchTerm, statusFilter);
      } else {
        toast.error(result.error);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog and inventory.</p>
        </div>
        {(isSuperAdmin || permissions.create) && (
          <div className="flex gap-2">
            <Link href="/admin/products/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search products by name or SKU..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <Filter className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setStatusFilter("ALL")} className={statusFilter === "ALL" ? "bg-muted" : ""}>
              All Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("PUBLISHED")} className={statusFilter === "PUBLISHED" ? "bg-muted" : ""}>
              Published
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("DRAFT")} className={statusFilter === "DRAFT" ? "bg-muted" : ""}>
              Draft
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-card/50 backdrop-blur">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-10 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto rounded" /></TableCell>
                  </TableRow>
                ))
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product._id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center overflow-hidden border">
                        {product.thumbnail ? (
                          <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs uppercase">{product.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {typeof product.category === 'object' && product.category !== null ? product.category.name : "Uncategorized"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">₹{product.offerPrice.toFixed(2)}</span>
                        {product.discountPercentage > 0 && (
                          <span className="text-[10px] text-muted-foreground line-through">₹{product.mrp.toFixed(2)}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "text-sm font-medium",
                        product.stockQuantity <= product.lowStockAlert ? "text-red-500" : "text-emerald-500"
                      )}>
                        {product.stockQuantity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status === "PUBLISHED" ? "default" : "secondary"}>
                        {product.status}
                      </Badge>
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
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => window.location.href = `/product/${product._id}`}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          {(isSuperAdmin || permissions.edit) && (
                            <DropdownMenuItem onClick={() => window.location.href = `/admin/products/edit/${product._id}`}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                          )}
                          {(isSuperAdmin || permissions.delete) && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600"
                                onClick={() => handleDelete(product._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </>
                          )}
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

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

