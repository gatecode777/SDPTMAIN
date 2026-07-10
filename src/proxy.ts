import { auth } from "./auth.edge";
import { NextResponse } from "next/server";

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const hostname = req.headers.get("host") || "";

  // 1. Skip static assets, APIs, and next internal files
  if (
    pathname.startsWith("/api") || 
    pathname.startsWith("/_next") || 
    pathname.includes(".") || 
    pathname === "/favicon.ico"
  ) {
    return null;
  }

  // 2. Subdomain check
  const isIpOrLocalhost = 
    hostname.includes("localhost") || 
    hostname.includes("127.0.0.1") || 
    /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}/.test(hostname);

  const hostParts = hostname.split(":")[0].split(".");
  let isMainDomain = false;
  let cleanHost = "";

  if (isIpOrLocalhost) {
    if (hostParts.length > 1 && hostParts[0] !== "localhost" && !/^[0-9]+$/.test(hostParts[0])) {
      cleanHost = hostParts[0];
    } else {
      isMainDomain = true;
    }
  } else {
    if (hostParts.length <= 2) {
      isMainDomain = true;
    } else if (hostParts.length === 3 && hostParts[0] === "www") {
      isMainDomain = true;
    } else {
      cleanHost = hostParts[0];
    }
  }

  if (!isMainDomain && cleanHost && cleanHost !== "www") {
    // Rewrite path to /sites/[subdomain]
    return NextResponse.rewrite(new URL(`/sites/${cleanHost}${pathname}`, req.url));
  }

  // 3. Admin panel checks (for main domain)
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const email = req.auth?.user?.email;
  const permissions = (req.auth?.user as any)?.permissions;

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

    // Helper to find first allowed route for this user
    const getFirstAllowedRoute = () => {
      if (!permissions) return null;
      if (permissions.dashboard?.view) return "/admin/dashboard";
      if (permissions.products?.view) return "/admin/products";
      if (permissions.categories?.view) return "/admin/categories";
      if (permissions.orders?.view) return "/admin/orders";
      if (permissions.users?.view) return "/admin/customers";
      if (permissions.coupons?.view) return "/admin/coupons";
      return null;
    };

    // 4. Restrict Admin Manager and Settings pages to SUPER_ADMIN/admin@gmail.com
    if (pathname.startsWith("/admin/admins") || pathname.startsWith("/admin/settings")) {
      if (role !== "SUPER_ADMIN" && email !== "admin@gmail.com") {
        const fallback = getFirstAllowedRoute();
        return NextResponse.redirect(new URL(fallback || "/admin/login", req.nextUrl));
      }
    }

    // 5. Restrict other routes based on granular permissions
    if (role !== "SUPER_ADMIN" && email !== "admin@gmail.com") {
      let isAllowed = true;

      if (pathname.startsWith("/admin/dashboard") || pathname.startsWith("/admin/analytics") || pathname.startsWith("/admin/activity-logs")) {
        isAllowed = !!permissions?.dashboard?.view;
      } else if (pathname.startsWith("/admin/products/create")) {
        isAllowed = !!permissions?.products?.create;
      } else if (pathname.startsWith("/admin/products/edit")) {
        isAllowed = !!permissions?.products?.edit;
      } else if (pathname.startsWith("/admin/products") || pathname.startsWith("/admin/banner")) {
        isAllowed = !!permissions?.products?.view;
      } else if (pathname.startsWith("/admin/categories")) {
        isAllowed = !!permissions?.categories?.view;
      } else if (pathname.startsWith("/admin/orders")) {
        isAllowed = !!permissions?.orders?.view;
      } else if (pathname.startsWith("/admin/customers") || pathname.startsWith("/admin/queries")) {
        isAllowed = !!permissions?.users?.view;
      } else if (pathname.startsWith("/admin/coupons")) {
        isAllowed = !!permissions?.coupons?.view;
      }

      if (!isAllowed) {
        const fallback = getFirstAllowedRoute();
        if (fallback && fallback !== pathname) {
          return NextResponse.redirect(new URL(fallback, req.nextUrl));
        } else {
          // If no fallback is available, redirect to login page and clear session cookie
          const loginRedirect = NextResponse.redirect(new URL("/admin/login", req.nextUrl));
          loginRedirect.cookies.delete("next-auth.session-token");
          loginRedirect.cookies.delete("next-auth.callback-url");
          loginRedirect.cookies.delete("next-auth.csrf-token");
          return loginRedirect;
        }
      }
    }
  }

  return null;
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
