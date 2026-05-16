import { auth } from "./auth.edge";
import { NextResponse } from "next/server";

export default auth((req) => {
  const role = req.auth?.user?.role;
  
  if (req.nextUrl.pathname.startsWith("/settings") && role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
