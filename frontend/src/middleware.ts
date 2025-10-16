import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value || req.nextUrl.searchParams.get("token") || null;

  const protectedRoutes = ["/dashboard", "/chat", "/profile", "/documents", "/fraud-checker", "/document-analysis", "/expense-upload"];
  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/chat", "/profile", "/documents", "/fraud-checker", "/document-analysis", "/expense-upload"],
};
