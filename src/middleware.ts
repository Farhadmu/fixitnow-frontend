import { NextRequest, NextResponse } from "next/server";

const ROLE_PREFIXES: Record<string, string> = {
  "/dashboard/customer": "CUSTOMER",
  "/dashboard/technician": "TECHNICIAN",
  "/dashboard/admin": "ADMIN",
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const matchedPrefix = Object.keys(ROLE_PREFIXES).find((prefix) => pathname.startsWith(prefix));
  if (!matchedPrefix) return NextResponse.next();

  const token = req.cookies.get("fixitnow_token")?.value;
  const role = req.cookies.get("fixitnow_role")?.value;

  if (!token || !role) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const requiredRole = ROLE_PREFIXES[matchedPrefix];
  if (role !== requiredRole) {
    const fallback =
      role === "ADMIN" ? "/dashboard/admin" : role === "TECHNICIAN" ? "/dashboard/technician" : "/dashboard/customer";
    return NextResponse.redirect(new URL(fallback, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
