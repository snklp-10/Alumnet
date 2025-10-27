import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // read token cookie (if your auth uses a different cookie name adjust here)
  const token = req.cookies.get("auth_token")?.value;

  const pathname = req.nextUrl.pathname;

  // Routes that require authentication
  const protectedRoutes = ["/dashboard", "/register"];

  // If user tries to access a protected route but is not authenticated, send them to /login
  const isTryingProtected = protectedRoutes.some((p) => pathname.startsWith(p));
  if (isTryingProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If user is authenticated and tries to access auth routes, redirect to dashboard
  const authRoutes = ["/login", "/signup", "/register"];
  if (token && authRoutes.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/register", "/dashboard", "/login", "/signup"],
};
