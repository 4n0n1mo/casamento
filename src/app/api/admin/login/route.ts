import { NextResponse, type NextRequest } from "next/server";
import { signAdminSession, setAdminCookie, verifyPassword } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");

  if (!verifyPassword(password)) {
    const url = new URL(req.url);
    url.pathname = "/admin/login";
    url.searchParams.set("e", "1");
    return NextResponse.redirect(url);
  }

  const jwt = await signAdminSession();
  setAdminCookie(jwt);

  const url = new URL(req.url);
  url.pathname = "/admin";
  url.search = "";
  return NextResponse.redirect(url);
}
