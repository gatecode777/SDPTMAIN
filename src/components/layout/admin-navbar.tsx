"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

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

import { Search, Bell, Moon, Sun, Menu } from "lucide-react";

export function AdminNavbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const { isSidebarOpen, toggleSidebar, themeColor, setThemeColor } = useUIStore();
  const { theme, setTheme } = useTheme();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 flex h-16 items-center border-b bg-background/95 backdrop-blur transition-all duration-300",
        isSidebarOpen ? "lg:left-64" : "lg:left-20",
        "left-0"
      )}
    >
      <div className="flex w-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </Button>
          <div className="relative w-96 max-w-sm hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search dashboard..."
              className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
              <div 
                className="h-4 w-4 rounded-full border border-white/20" 
                style={{ backgroundColor: `oklch(${themeColor})` }}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="grid grid-cols-5 gap-2 p-3 w-48">
              {THEME_COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setThemeColor(color.value)}
                  className={cn(
                    "h-6 w-6 rounded-full border-2 transition-all hover:scale-110",
                    themeColor === color.value ? "border-foreground scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: `oklch(${color.value})` }}
                  title={color.name}
                />
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-10 w-10 rounded-full flex items-center justify-center hover:bg-muted transition-colors outline-none">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "Admin"} />
                <AvatarFallback>{session?.user?.name?.[0] || "A"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/admin/settings")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/admin/settings")}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={() => signOut()}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
