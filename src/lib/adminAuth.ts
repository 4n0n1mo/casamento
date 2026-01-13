import { type ReadonlyRequestCookies, cookies as nextCookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { timingSafeEqual } from "@/lib/serverCrypto";

const enc = new TextEncoder();
const COOKIE = "__Host-admin";

export async function signAdminSession() {
  const secret = process.env.RSVP_SESSION_SECRET;
  if (!secret) throw new Error("RSVP_SESSION_SECRET não configurado.");
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 7 * 24 * 3600;

  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(enc.encode(secret));
}

export async function verifyAdminSession(jwt: string) {
  try {
    const secret = process.env.RSVP_SESSION_SECRET;
    if (!secret) return false;
    const { payload } = await jwtVerify(jwt, enc.encode(secret));
    return Boolean(payload.admin);
  } catch {
    return false;
  }
}

export function adminCookieName() {
  return COOKIE;
}

export function getAdminCookie(c: ReadonlyRequestCookies) {
  return c.get(COOKIE)?.value ?? null;
}

export async function requireAdmin(c: ReadonlyRequestCookies) {
  const v = getAdminCookie(c);
  if (!v) throw new Error("admin_required");
  const ok = await verifyAdminSession(v);
  if (!ok) throw new Error("admin_required");
}

export function verifyPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  return timingSafeEqual(input, expected);
}

export function setAdminCookie(jwt: string) {
  const c = nextCookies();
  c.set(COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
}

export function clearAdminCookie() {
  const c = nextCookies();
  c.set(COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}
