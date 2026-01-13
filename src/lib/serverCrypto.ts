import crypto from "crypto";

export function hmacSha256Hex(value: string, pepper: string) {
  return crypto.createHmac("sha256", pepper).update(value).digest("hex");
}

export function hashIp(ip: string, pepper: string) {
  // hash para logs/ratelimit sem armazenar IP em claro
  return hmacSha256Hex(ip, pepper).slice(0, 32);
}

export function getClientIp(headers: Headers) {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const cf = headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  return "0.0.0.0";
}

export function timingSafeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}
