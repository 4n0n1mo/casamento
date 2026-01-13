import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE = "__Host-admin";

async function isValidAdminJwt(jwt: string) {
  try {
    const secret = process.env.RSVP_SESSION_SECRET;
    if (!secret) return false;
    const enc = new TextEncoder();
    const { payload } = await jwtVerify(jwt, enc.encode(secret));
    return Boolean(payload.admin);
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isLogin = pathname.startsWith("/admin/login") || pathname === "/api/admin/login";

  if (!isAdmin || isLogin) return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token || !(await isValidAdminJwt(token))) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
