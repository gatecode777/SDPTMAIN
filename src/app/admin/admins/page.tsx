"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldAlert,
  Loader2,
  Save,
  Check,
  LayoutDashboard,
  Users,
  ShoppingBag,
  Layers,
  ShoppingCart,
  Tag,
  FileText,
  FolderOpen
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from "@/actions/admin-manager";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

interface PermissionSet {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface AdminPermissions {
  dashboard: PermissionSet;
  users: PermissionSet;
  products: PermissionSet;
  categories: PermissionSet;
  orders: PermissionSet;
  coupons: PermissionSet;
  blogs: PermissionSet;
  blogCategories: PermissionSet;
}

const defaultPermissions: AdminPermissions = {
  dashboard: { view: false, create: false, edit: false, delete: false },
  users: { view: false, create: false, edit: false, delete: false },
  products: { view: false, create: false, edit: false, delete: false },
  categories: { view: false, create: false, edit: false, delete: false },
  orders: { view: false, create: false, edit: false, delete: false },
  coupons: { view: false, create: false, edit: false, delete: false },
  blogs: { view: false, create: false, edit: false, delete: false },
  blogCategories: { view: false, create: false, edit: false, delete: false },
};

const moduleList = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "products", label: "Products", icon: ShoppingBag },
  { id: "categories", label: "Categories", icon: Layers },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "coupons", label: "Coupons", icon: Tag },
  { id: "blogs", label: "Blogs", icon: FileText },
  { id: "blogCategories", label: "Blog Categories", icon: FolderOpen },
] as const;

type ModuleId = typeof moduleList[number]["id"];

const getPermissionsForRole = (role: string): AdminPermissions => {
  const perms = JSON.parse(JSON.stringify(defaultPermissions)) as AdminPermissions;
  
  if (role === "SUPER_ADMIN") {
    moduleList.forEach((mod) => {
      perms[mod.id] = { view: true, create: true, edit: true, delete: true };
    });
  } else if (role === "ADMIN") {
    moduleList.forEach((mod) => {
      if (mod.id === "users") {
        perms[mod.id] = { view: true, create: true, edit: true, delete: false };
      } else {
        perms[mod.id] = { view: true, create: true, edit: true, delete: true };
      }
    });
  } else if (role === "SUB_ADMIN") {
    moduleList.forEach((mod) => {
      if (mod.id === "dashboard" || mod.id === "users") {
        perms[mod.id] = { view: true, create: false, edit: false, delete: false };
      } else {
        perms[mod.id] = { view: true, create: true, edit: true, delete: false };
      }
    });
  } else if (role === "PRODUCT_MANAGER") {
    moduleList.forEach((mod) => {
      if (mod.id === "products" || mod.id === "categories" || mod.id === "blogCategories") {
        perms[mod.id] = { view: true, create: true, edit: true, delete: true };
      } else if (mod.id === "coupons") {
        perms[mod.id] = { view: true, create: true, edit: true, delete: false };
      } else if (mod.id === "dashboard") {
        perms[mod.id] = { view: true, create: false, edit: false, delete: false };
      } else {
        perms[mod.id] = { view: false, create: false, edit: false, delete: false };
      }
    });
  } else if (role === "ORDER_MANAGER") {
    moduleList.forEach((mod) => {
      if (mod.id === "orders") {
        perms[mod.id] = { view: true, create: true, edit: true, delete: true };
      } else if (mod.id === "coupons" || mod.id === "products") {
        perms[mod.id] = { view: true, create: mod.id === "coupons", edit: mod.id === "coupons", delete: false };
      } else if (mod.id === "dashboard") {
        perms[mod.id] = { view: true, create: false, edit: false, delete: false };
      } else {
        perms[mod.id] = { view: false, create: false, edit: false, delete: false };
      }
    });
  }
  
  return perms;
};

const sanitizePermissions = (perms: any): AdminPermissions => {
  const sanitized = JSON.parse(JSON.stringify(defaultPermissions)) as AdminPermissions;
  if (!perms) return sanitized;
  
  moduleList.forEach((mod) => {
    const modId = mod.id;
    if (perms[modId]) {
      sanitized[modId] = {
        view: !!perms[modId].view,
        create: !!perms[modId].create,
        edit: !!perms[modId].edit,
        delete: !!perms[modId].delete,
      };
    }
  });
  
  return sanitized;
};

export default function AdminsPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog State
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [isActive, setIsActive] = useState(true);
  const [permissions, setPermissions] = useState<AdminPermissions>(defaultPermissions);

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function fetchAdmins() {
    setLoading(true);
    try {
      const res = await getAdmins();
      if (res.success && res.admins) {
        setAdmins(res.admins);
      } else {
        toast.error(res.error || "Failed to load admin list");
      }
    } catch (error) {
      toast.error("Failed to load admin list");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure? This will permanently delete the admin account.")) {
      try {
        const res = await deleteAdmin(id);
        if (res.success) {
          toast.success("Admin account deleted successfully");
          fetchAdmins();
        } else {
          toast.error(res.error || "Failed to delete admin");
        }
      } catch (error) {
        toast.error("Failed to delete admin");
      }
    }
  }

  // Handle permission checkbox changes
  const handlePermissionChange = (module: ModuleId, action: keyof PermissionSet, checked: boolean) => {
    setPermissions((prev) => {
      const baseModule = prev[module] || { view: false, create: false, edit: false, delete: false };
      const updatedModule = { ...baseModule };
      updatedModule[action] = checked;

      // Rule: Enabling create/edit/delete auto-enables View
      if (checked && (action === "create" || action === "edit" || action === "delete")) {
        updatedModule.view = true;
      }

      // Rule: Disabling View auto-disables create/edit/delete
      if (!checked && action === "view") {
        updatedModule.create = false;
        updatedModule.edit = false;
        updatedModule.delete = false;
      }

      return {
        ...prev,
        [module]: updatedModule,
      };
    });
  };

  // Toggle "All" for a specific row
  const toggleRowAll = (module: ModuleId) => {
    setPermissions((prev) => {
      const m = prev[module] || { view: false, create: false, edit: false, delete: false };
      const allChecked = m.view && m.create && m.edit && m.delete;
      
      return {
        ...prev,
        [module]: {
          view: !allChecked,
          create: !allChecked,
          edit: !allChecked,
          delete: !allChecked,
        },
      };
    });
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name || !email || (!editingAdmin && !password)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    const data = {
      name,
      email,
      password: password || undefined,
      role,
      isActive,
      permissions,
    };

    try {
      let res;
      if (editingAdmin) {
        res = await updateAdmin(editingAdmin._id, data);
      } else {
        res = await createAdmin(data);
      }

      if (res.success) {
        toast.success(editingAdmin ? "Admin account updated" : "Admin account created");
        setIsOpen(false);
        fetchAdmins();
      } else {
        toast.error(res.error || "Failed to save admin settings");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSubmitting(false);
    }
  }

  const openCreateDialog = () => {
    setEditingAdmin(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("ADMIN");
    setIsActive(true);
    setPermissions(getPermissionsForRole("ADMIN"));
    setIsOpen(true);
  };

  const openEditDialog = (admin: any) => {
    setEditingAdmin(admin);
    setName(admin.name || "");
    setEmail(admin.email || "");
    setPassword("");
    setRole(admin.role || "ADMIN");
    setIsActive(admin.isActive !== undefined ? admin.isActive : true);
    setPermissions(sanitizePermissions(admin.permissions));
    setIsOpen(true);
  };

  const filteredAdmins = admins.filter(a => 
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Manager</h1>
          <p className="text-muted-foreground">Create, manage, and configure role-based module permissions for store administrators.</p>
        </div>
        {isSuperAdmin && (
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add Admin
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search admins by name, email or role..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-card/50 backdrop-blur">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Admin User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                {isSuperAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    {isSuperAdmin && <TableCell><Skeleton className="h-8 w-8 ml-auto rounded" /></TableCell>}
                  </TableRow>
                ))
              ) : filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isSuperAdmin ? 6 : 5} className="h-32 text-center text-muted-foreground">
                    No administrator accounts found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdmins.map((admin) => (
                  <TableRow key={admin._id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                          {admin.name?.slice(0, 2) || "AD"}
                        </div>
                        {admin.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{admin.email}</TableCell>
                    <TableCell>
                      <Badge variant={admin.role === "SUPER_ADMIN" ? "default" : "secondary"}>
                        {admin.role?.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {admin.isActive !== false ? (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                    </TableCell>
                    {isSuperAdmin && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors outline-none">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(admin)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            {admin.email !== "admin@gmail.com" && admin._id !== session?.user?.id && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() => handleDelete(admin._id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* CREATE/EDIT DIALOG */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full max-w-3xl sm:max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {editingAdmin ? "Edit Admin" : "Add Admin"}
            </DialogTitle>
            <DialogDescription>
              Configure administrator details, active status, role, and granular module permissions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Sub Admin" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="e.g. admin@store.com" 
                  required 
                  disabled={editingAdmin?.email === "admin@gmail.com"} // Lock primary super admin email
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {editingAdmin ? "New Password (leave blank to keep)" : "Password *"}
                </Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder={editingAdmin ? "Leave blank to keep current" : "Minimum 6 characters"} 
                  required={!editingAdmin} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
                <Select 
                  value={role} 
                  onValueChange={(val) => {
                    const newRole = val || "ADMIN";
                    setRole(newRole);
                    setPermissions(getPermissionsForRole(newRole));
                  }}
                  disabled={editingAdmin?.email === "admin@gmail.com"} // Lock primary super admin role
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select admin role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUB_ADMIN">Sub Admin</SelectItem>
                    <SelectItem value="PRODUCT_MANAGER">Product Manager</SelectItem>
                    <SelectItem value="ORDER_MANAGER">Order Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="isActive" 
                checked={isActive} 
                onCheckedChange={(checked) => setIsActive(checked === true)}
                disabled={editingAdmin?.email === "admin@gmail.com"} // Lock primary active status
              />
              <Label 
                htmlFor="isActive" 
                className="text-sm font-semibold cursor-pointer select-none"
              >
                Account Active
              </Label>
            </div>

            {/* MODULE PERMISSIONS GRID */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 border-b pb-2">
                <ShieldAlert className="h-5 w-5 text-[#854d0e]" />
                <Label className="text-sm font-bold uppercase tracking-wide text-[#854d0e] dark:text-[#fef08a]">
                  Module Permissions
                </Label>
                <span className="text-xs text-muted-foreground ml-2">Enabling Create/Edit/Delete auto-enables View</span>
              </div>

              <div className="rounded-lg border overflow-x-auto">
                <table className="w-full min-w-[550px] text-sm text-left">
                  <thead className="bg-[#4e3629] text-white text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-3 sm:px-4 py-2.5 sm:py-3 font-medium">Module</th>
                      <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-center font-medium">View</th>
                      <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-center font-medium">Create</th>
                      <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-center font-medium">Edit</th>
                      <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-center font-medium">Delete</th>
                      <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-center font-medium">All</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-card">
                    {moduleList.map((mod) => {
                      const modId = mod.id as ModuleId;
                      const modPerms = permissions[modId] || { view: false, create: false, edit: false, delete: false };
                      
                      return (
                        <tr key={mod.id} className="hover:bg-muted/40 transition-colors">
                          <td className="px-3 sm:px-4 py-2.5 sm:py-3 font-medium text-foreground/90">
                            <div className="flex items-center gap-2">
                              <mod.icon className="h-4 w-4 text-muted-foreground" />
                              {mod.label}
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-center">
                            <Checkbox 
                              checked={modPerms.view} 
                              onCheckedChange={(checked) => handlePermissionChange(modId, "view", checked === true)} 
                              className="mx-auto"
                            />
                          </td>
                          <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-center">
                            <Checkbox 
                              checked={modPerms.create} 
                              onCheckedChange={(checked) => handlePermissionChange(modId, "create", checked === true)} 
                              className="mx-auto"
                            />
                          </td>
                          <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-center">
                            <Checkbox 
                              checked={modPerms.edit} 
                              onCheckedChange={(checked) => handlePermissionChange(modId, "edit", checked === true)} 
                              className="mx-auto"
                            />
                          </td>
                          <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-center">
                            <Checkbox 
                              checked={modPerms.delete} 
                              onCheckedChange={(checked) => handlePermissionChange(modId, "delete", checked === true)} 
                              className="mx-auto"
                            />
                          </td>
                          <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-center">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              className="h-7 px-3 text-xs bg-muted/20"
                              onClick={() => toggleRowAll(modId)}
                            >
                              All
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {editingAdmin ? "Update Admin" : "Create Admin"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
