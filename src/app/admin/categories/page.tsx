"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Layers,
  Loader2,
  Save,
  X,
  Upload
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCategories, deleteCategory, createCategory, updateCategory } from "@/actions/category";
import { uploadImages } from "@/actions/upload";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { compressImage } from "@/lib/image";
import { useSession } from "next-auth/react";

export default function CategoriesPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
  const permissions = (session?.user as any)?.permissions?.categories || { view: false, create: false, edit: false, delete: false };

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Dialog State
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [image, setImage] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const [selectedParent, setSelectedParent] = useState<string>("none");

  useEffect(() => {
    if (editingCategory) {
      setSelectedParent(editingCategory.parent?._id || editingCategory.parent || "none");
    } else {
      setSelectedParent("none");
    }
  }, [editingCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const compressedFile = await compressImage(files[0]);
      const formData = new FormData();
      formData.append("files", compressedFile);

      const result = await uploadImages(formData);
      if (result.success && result.urls && result.urls.length > 0) {
        setImage(result.urls[0]);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(result.error || "Failed to upload image");
      }
    } catch (error) {
      toast.error("Something went wrong uploading image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  async function handleDelete(id: string) {
    if (confirm("Are you sure? This will delete the category.")) {
      const result = await deleteCategory(id);
      if (result.success) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error(result.error);
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      parent: formData.get("parent") === "none" ? null : formData.get("parent"),
      image: image || "",
      isVisible: true, 
    };

    try {
      let result;
      if (editingCategory) {
        result = await updateCategory(editingCategory._id, data);
      } else {
        result = await createCategory(data);
      }

      if (result.success) {
        toast.success(editingCategory ? "Category updated" : "Category created");
        setIsOpen(false);
        fetchCategories();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  const openCreateDialog = () => {
    setEditingCategory(null);
    setImage("");
    setIsOpen(true);
  };

  const openEditDialog = (category: any) => {
    setEditingCategory(category);
    setImage(category.image || "");
    setIsOpen(true);
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Organize your hardware components into logical groups.</p>
        </div>
        <div className="flex gap-2">
          {(isSuperAdmin || permissions.create) && (
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          )}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
                <DialogDescription>
                  Configure your category settings here.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    defaultValue={editingCategory?.name} 
                    placeholder="e.g. Input Devices" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL identifier)</Label>
                  <Input 
                    id="slug" 
                    name="slug" 
                    defaultValue={editingCategory?.slug} 
                    placeholder="e.g. input-devices" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parent">Parent Category</Label>
                  <Select 
                    name="parent" 
                    value={selectedParent} 
                    onValueChange={(val) => setSelectedParent(val || "none")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent (Optional)">
                        {selectedParent === "none" ? "None (Top Level)" : categories.find(c => c._id.toString() === selectedParent)?.name}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Top Level)</SelectItem>
                      {categories.filter(c => !c.parent && c._id !== editingCategory?._id).map((cat) => (
                        <SelectItem key={cat._id.toString()} value={cat._id.toString()}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    name="description" 
                    defaultValue={editingCategory?.description} 
                    placeholder="Optional description..." 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category Image</Label>
                  {image ? (
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 rounded border bg-muted overflow-hidden">
                        <img src={image} alt="Preview" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImage("")}
                          className="absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center"
                        >
                          <X size={10} />
                        </button>
                      </div>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {image}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-dashed border-input hover:bg-accent hover:text-accent-foreground cursor-pointer text-xs font-medium">
                        <Upload size={14} className="text-muted-foreground" />
                        <span>Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploading}
                          onChange={handleImageUpload}
                        />
                      </label>
                      {uploading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {editingCategory ? "Update Category" : "Create Category"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search categories..." 
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
                <TableHead>Category Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Parent Group</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto rounded" /></TableCell>
                  </TableRow>
                ))
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category._id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {category.image ? (
                          <div className="h-8 w-8 rounded border bg-muted overflow-hidden flex-shrink-0">
                            <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase flex-shrink-0">
                            {category.name?.slice(0, 2) || "CA"}
                          </div>
                        )}
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs uppercase">{category.slug}</TableCell>
                    <TableCell>
                      {category.parent ? (
                        <Badge variant="outline" className="bg-blue-50/50 text-blue-600 border-blue-200">
                          {typeof category.parent === 'string' ? 'Parent Group' : category.parent.name}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-600">Main Group</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {category.isVisible ? (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Visible</Badge>
                      ) : (
                        <Badge variant="outline">Hidden</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {(isSuperAdmin || permissions.edit || permissions.delete) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors outline-none">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {(isSuperAdmin || permissions.edit) && (
                              <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                            )}
                            {(isSuperAdmin || permissions.edit) && (isSuperAdmin || permissions.delete) && <DropdownMenuSeparator />}
                            {(isSuperAdmin || permissions.delete) && (
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600"
                                onClick={() => handleDelete(category._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
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
