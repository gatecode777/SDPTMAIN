"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Users,
  ShoppingCart,
  Tag,
  BarChart3,
  Settings,
  Image,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
  Shield,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/store/useUIStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { signOut, useSession } from "next-auth/react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { label: "Products", icon: ShoppingBag, href: "/admin/products" },
  { label: "Categories", icon: Layers, href: "/admin/categories" },
  { label: "Banner", icon: Image, href: "/admin/banner" },
  { label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { label: "Customers", icon: Users, href: "/admin/customers" },
  { label: "Coupons", icon: Tag, href: "/admin/coupons" },
  { label: "Queries", icon: HelpCircle, href: "/admin/queries" },
  { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
  { label: "Activity Logs", icon: ClipboardList, href: "/admin/activity-logs" },
  { label: "Admin Manager", icon: Shield, href: "/admin/admins" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export function AdminSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log("AdminSidebar debug session:", session, "role:", session?.user?.role);
    setMounted(true);
    
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        closeSidebar();
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname, closeSidebar, session]);

  if (!mounted) return null;

  return (
    <>
      {}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <div className={cn("flex items-center gap-2", !isSidebarOpen && "lg:hidden")}>
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <ShoppingBag className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">AdminPanel</span>
            </Link>
          </div>
          
          {!isSidebarOpen && (
             <div className="hidden lg:flex mx-auto h-8 w-8 rounded-lg bg-primary items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-primary-foreground" />
             </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-120px)] px-3 py-4">
          <nav className="space-y-1">
            {menuItems
              .filter((item) => {
                const isSuper = session?.user?.role === "SUPER_ADMIN" || session?.user?.email === "admin@gmail.com";
                if (isSuper) return true;

                if (item.href === "/admin/admins" || item.href === "/admin/settings") {
                  return false;
                }

                const perms = (session?.user as any)?.permissions;
                if (!perms) return false;

                if (item.href === "/admin/dashboard" || item.href === "/admin/analytics" || item.href === "/admin/activity-logs") {
                  return !!perms.dashboard?.view;
                }
                if (item.href === "/admin/products" || item.href === "/admin/banner") {
                  return !!perms.products?.view;
                }
                if (item.href === "/admin/categories") {
                  return !!perms.categories?.view;
                }
                if (item.href === "/admin/orders") {
                  return !!perms.orders?.view;
                }
                if (item.href === "/admin/customers" || item.href === "/admin/queries") {
                  return !!perms.users?.view;
                }
                if (item.href === "/admin/coupons") {
                  return !!perms.coupons?.view;
                }

                return true;
              })
              .map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent group relative",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground",
                    !isSidebarOpen && "lg:justify-center"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "group-hover:text-primary")} />
                  {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                  
                  {}
                  {!isSidebarOpen && (
                     <div className="absolute left-14 hidden rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground group-hover:block border shadow-md whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="absolute bottom-0 w-full border-t p-4 bg-card">
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors",
              !isSidebarOpen && "lg:justify-center lg:px-0"
            )}
            onClick={() => signOut()}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
