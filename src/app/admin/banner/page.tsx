"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { 
  Save, 
  Image as ImageIcon, 
  Clock, 
  Type, 
  Link as LinkIcon,
  Zap,
  Eye
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getBanner, updateBanner } from "@/actions/banner";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";

export default function BannerPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
  const permissions = (session?.user as any)?.permissions?.products || { edit: false };
  const canEdit = isSuperAdmin || permissions.edit;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<any>({
    badge: "",
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    imageUrl: "",
    expiryDate: "",
    isActive: true,
  });

  useEffect(() => {
    fetchBanner();
  }, []);

  async function fetchBanner() {
    setLoading(true);
    try {
      const data = await getBanner();
      if (data.success) {
        setBanner(data.banner);
      } else {
        toast.error("Failed to load banner data");
      }
    } catch (error) {
      toast.error("An error occurred while loading banner");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit) {
      toast.error("You do not have permission to modify the banner.");
      return;
    }
    setSaving(true);
    try {
      const result = await updateBanner(banner);
      if (result.success) {
        toast.success("Banner updated successfully");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to update banner");
    } finally {
      setSaving(false);
    }
  }

  const handleChange = (field: string, value: any) => {
    if (!canEdit) return;
    setBanner((prev: any) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Homepage Banner</h1>
          <p className="text-muted-foreground">Manage the promotional banner on your store's homepage.</p>
        </div>
        {canEdit && (
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5 text-primary" />
                Content Settings
              </CardTitle>
              <CardDescription>Update the text content of your promotional banner.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="badge">Badge Text</Label>
                <div className="relative">
                  <Zap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="badge" 
                    placeholder="e.g., Limited Time Offer" 
                    className="pl-9"
                    value={banner.badge}
                    onChange={(e) => handleChange("badge", e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Banner Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Summer Gaming Sale" 
                  value={banner.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  disabled={!canEdit}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description Text</Label>
                <Textarea 
                  id="description" 
                  placeholder="Tell your customers about the promotion..." 
                  className="min-h-[100px]"
                  value={banner.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  disabled={!canEdit}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-primary" />
                Action Button
              </CardTitle>
              <CardDescription>Configure where the banner leads your customers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="btnText">Button Text</Label>
                  <Input 
                    id="btnText" 
                    placeholder="e.g., Shop Now" 
                    value={banner.buttonText}
                    onChange={(e) => handleChange("buttonText", e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="btnLink">Button Link</Label>
                  <Input 
                    id="btnLink" 
                    placeholder="e.g., /shop" 
                    value={banner.buttonLink}
                    onChange={(e) => handleChange("buttonLink", e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                Visuals & Timer
              </CardTitle>
              <CardDescription>Manage the image and countdown timer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input 
                  id="imageUrl" 
                  placeholder="https://..." 
                  value={banner.imageUrl}
                  onChange={(e) => handleChange("imageUrl", e.target.value)}
                  disabled={!canEdit}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date (for Countdown)</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="expiry" 
                    type="datetime-local" 
                    className="pl-9"
                    value={banner.expiryDate ? new Date(banner.expiryDate).toISOString().slice(0, 16) : ""}
                    onChange={(e) => handleChange("expiryDate", e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-0.5">
                  <Label className="text-base">Banner Status</Label>
                  <p className="text-sm text-muted-foreground">Visible on the homepage when active.</p>
                </div>
                <Switch 
                  checked={banner.isActive}
                  onCheckedChange={(checked) => handleChange("isActive", checked)}
                  disabled={!canEdit}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-dashed">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Live Preview (Stylized)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-[#0a0a0f] p-4 text-white space-y-3 relative overflow-hidden">
                <div className="flex items-center gap-1 text-[8px] bg-white/10 w-fit px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                  <Zap size={8} /> {banner.badge || "LIMITED OFFER"}
                </div>
                <h3 className="text-lg font-bold leading-tight">{banner.title || "Your Title Here"}</h3>
                <p className="text-[10px] text-gray-400 line-clamp-2">{banner.description || "Banner description goes here..."}</p>
                <div className="flex items-center gap-2">
                  <div className="bg-white/10 px-2 py-1 rounded text-[10px] font-mono">05 : 12 : 45</div>
                  <div className="bg-blue-600 px-3 py-1 rounded text-[10px] font-bold ml-auto">{banner.buttonText || "Shop Now"}</div>
                </div>
                <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-blue-500/20 to-transparent pointer-events-none" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
