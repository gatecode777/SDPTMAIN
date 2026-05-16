"use client";

import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminNavbar } from "@/components/layout/admin-navbar";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ColorProvider } from "@/components/providers/color-provider";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen } = useUIStore();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <ColorProvider>
              <TooltipProvider>
                {children}
                <Toaster position="top-right" richColors />
              </TooltipProvider>
            </ColorProvider>
          </AuthProvider>
        </ThemeProvider>
      </>
    );
  }

  return (
    <>

      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <AuthProvider>
          <ColorProvider>
            <TooltipProvider>
              <div className="min-h-screen bg-muted/30">
                <AdminSidebar />
                <div
                  className={cn(
                    "flex flex-col transition-all duration-300",
                    isSidebarOpen ? "lg:pl-64" : "lg:pl-20",
                    "pl-0"
                  )}
                >
                  <AdminNavbar />
                  <main className="mt-16 p-6 min-h-[calc(100vh-64px)]">
                    {children}
                  </main>
                </div>
              </div>
              <Toaster position="top-right" richColors />
            </TooltipProvider>
          </ColorProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
