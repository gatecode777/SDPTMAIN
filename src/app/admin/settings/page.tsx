"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  Globe, 
  Save, 
  Loader2 
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { useUIStore } from "@/store/useUIStore";

import { getSettings, updateSettings } from "@/actions/settings";

const THEME_COLORS = [
  { name: "Blue", value: "0.588 0.158 241.966" },
  { name: "Emerald", value: "0.627 0.194 149.214" },
  { name: "Violet", value: "0.505 0.213 275.121" },
  { name: "Rose", value: "0.601 0.203 8.163" },
  { name: "Amber", value: "0.769 0.188 70.08" },
  { name: "Orange", value: "0.65 0.205 39.46" },
  { name: "Indigo", value: "0.435 0.182 271.17" },
  { name: "Cyan", value: "0.685 0.141 199.1" },
  { name: "Teal", value: "0.552 0.143 174.5" },
  { name: "Pink", value: "0.61 0.22 340" },
  { name: "Lime", value: "0.85 0.2 110" },
  { name: "Slate", value: "0.45 0 0" },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { themeColor, setThemeColor } = useUIStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setFetching(true);
    try {
      const result = await getSettings();
      if (result.success) {
        setSettings(result.settings);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const result = await updateSettings(data);
      if (result.success) {
        toast.success("Settings updated successfully!");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your store configurations and preferences.</p>
        </div>
        <Button type="submit" form="settings-form" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <form id="settings-form" onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Appearance & Brand Identity</CardTitle>
              <CardDescription>Customize the visual theme and branding of your admin panel.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <Label className="text-base font-semibold">Primary Theme Color</Label>
              <p className="text-sm text-muted-foreground mb-4">Choose a color that matches your brand.</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-4">
                {THEME_COLORS.map((color) => (
                  <div key={color.name} className="flex flex-col items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setThemeColor(color.value)}
                      className={cn(
                        "h-10 w-10 rounded-full border-4 transition-all hover:scale-110 shadow-sm",
                        themeColor === color.value ? "border-foreground" : "border-background"
                      )}
                      style={{ backgroundColor: `oklch(${color.value})` }}
                    />
                    <span className="text-[10px] font-medium text-muted-foreground">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Switch between light and dark dashboard themes.</p>
              </div>
              <Switch 
                checked={theme === "dark"} 
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} 
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
