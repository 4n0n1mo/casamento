import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  clearAdminCookie();
  const url = new URL(req.url);
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}
