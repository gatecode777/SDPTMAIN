import { auth } from "./auth.edge";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const email = req.auth?.user?.email;
  const pathname = req.nextUrl.pathname;

  // Protect admin panel routes
  if (pathname.startsWith("/admin")) {
    // 1. Allow login page
    if (pathname === "/admin/login") {
      if (isLoggedIn && role !== "CUSTOMER") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
      }
      return null;
    }

    // 2. Force login for all other admin routes
    if (!isLoggedIn) {
      const loginUrl = new URL("/admin/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 3. Deny customer accounts access to admin dashboard
    if (role === "CUSTOMER") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    // 4. Restrict Admin Manager and Settings pages to SUPER_ADMIN/admin@gmail.com
    if (pathname.startsWith("/admin/admins") || pathname.startsWith("/admin/settings")) {
      if (role !== "SUPER_ADMIN" && email !== "admin@gmail.com") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
      }
    }
  }

  return null;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
