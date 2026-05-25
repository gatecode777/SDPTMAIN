"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ArrowLeft,
  Loader2,
  Upload,
  X,
  Save,
  Eye
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { createProduct } from "@/actions/product";
import { uploadImages } from "@/actions/upload";
import { compressImage } from "@/lib/image";
import RichTextEditor from "@/components/RichTextEditor";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Description is too short"),
  shortDescription: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  sku: z.string().min(3, "SKU is required"),
  mrp: z.coerce.number().min(0),
  discountPercentage: z.coerce.number().min(0).max(100).default(0),
  stockQuantity: z.coerce.number().min(0),
  lowStockAlert: z.coerce.number().min(0).default(10),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("PUBLISHED"),
  isFeatured: z.boolean().default(false),
  isOnOffer: z.boolean().default(false),
  offerDescription: z.string().optional(),
  warrantyDuration: z.coerce.number().min(0).max(6).default(0),
});

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    import("@/actions/category").then(({ getCategories }) => {
      getCategories().then(setCategories);
    });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      category: "",
      sku: "",
      mrp: 0,
      discountPercentage: 0,
      stockQuantity: 0,
      lowStockAlert: 10,
      status: "PUBLISHED",
      isFeatured: false,
      isOnOffer: false,
      offerDescription: "",
      warrantyDuration: 0,
    },
  });

  const watchName = form.watch("name");
  const watchMrp = form.watch("mrp");
  const watchDiscount = form.watch("discountPercentage");
  const offerPrice = watchMrp - (watchMrp * watchDiscount) / 100;

  useEffect(() => {
    if (watchName) {
      const generatedSlug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [watchName, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);
    try {
      const result = await createProduct({
        ...values,
        images,
        thumbnail: images[0],
        price: offerPrice,
        offerPrice,
      });

      if (result.success) {
        toast.success("Product created successfully");
        router.push("/admin/products");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const compressedFiles = await Promise.all(
        Array.from(files).map((file) => compressImage(file))
      );

      const formData = new FormData();
      compressedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const result = await uploadImages(formData);
      if (result.success && result.urls) {
        setImages((prev) => [...prev, ...result.urls!]);
        toast.success("Images uploaded successfully");
      } else {
        toast.error(result.error || "Failed to upload images");
      }
    } catch (error) {
      toast.error("Something went wrong uploading images");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };


  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
            <p className="text-muted-foreground">Add a new product to your store.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => { }}>
            <Eye className="mr-2 h-4 w-4" /> Preview
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Product
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the primary details of the product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. ASUS ROG Strix B550-F Motherboard" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="asus-rog-strix-b550-f" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input placeholder="MB-ASUS-B550-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          placeholder="Detailed description of the product..."
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media Gallery</CardTitle>
                <CardDescription>Upload high-quality images of your product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {images.map((url, index) => (
                    <div key={index} className="group relative aspect-square rounded-lg border bg-muted overflow-hidden">
                      <img src={url} alt="Product" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <label className={`flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed ${uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-accent cursor-pointer"} transition-colors`}>
                    {uploading ? (
                      <>
                        <Loader2 className="h-6 w-6 text-muted-foreground mb-2 animate-spin" />
                        <span className="text-xs font-medium text-muted-foreground">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                        <span className="text-xs font-medium text-muted-foreground">Upload Image</span>
                        <input type="file" multiple accept="image/*" className="hidden" disabled={uploading} onChange={handleImageUpload} />
                      </>
                    )}
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">You can upload up to 5 images. Recommended size 800x800px.</p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => setImages(["https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800", "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800"])}
                  >
                    Use Hardware Demo Images
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory & Shipping</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stockQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lowStockAlert"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Low Stock Threshold</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="mrp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MRP (List Price)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                          <Input type="number" className="pl-7" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount (%)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="number" className="pr-7" {...field} />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="p-4 rounded-lg bg-muted/50 border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Offer Price:</span>
                    <span className="font-bold text-emerald-600">₹{offerPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        key={categories.length}
                        onValueChange={field.onChange} 
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category">
                              {categories.find(c => c._id.toString() === field.value?.toString())?.name}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat._id.toString()} value={cat._id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Published</FormLabel>
                        <FormDescription>Make this product visible to customers.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value !== "DRAFT"}
                          onCheckedChange={(val) => field.onChange(val ? "PUBLISHED" : "DRAFT")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured</FormLabel>
                        <FormDescription>Show on homepage featured section.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isOnOffer"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">On Offer</FormLabel>
                        <FormDescription>Enable special offer for this product.</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {form.watch("isOnOffer") && (
                  <FormField
                    control={form.control}
                    name="offerDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Offer Description</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Free Thermal Paste or 10% Off on CPU Bundle" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="warrantyDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warranty Duration (Months)</FormLabel>
                      <Select onValueChange={(val) => field.onChange(val ? parseInt(val) : 0)} value={field.value?.toString() || "0"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((month) => (
                            <SelectItem key={month} value={month.toString()}>
                              {month} {month === 1 ? "Month" : "Months"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}






