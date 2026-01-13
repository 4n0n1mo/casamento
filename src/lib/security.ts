import { SignJWT, jwtVerify } from "jose";

const enc = new TextEncoder();

export type RsvpSession = {
  groupId: string;
  exp: number; // epoch seconds
};

export async function signRsvpSession(payload: { groupId: string; ttlSeconds: number }) {
  const secret = process.env.RSVP_SESSION_SECRET;
  if (!secret) throw new Error("RSVP_SESSION_SECRET não configurado.");
  const now = Math.floor(Date.now() / 1000);
  const exp = now + payload.ttlSeconds;

  const jwt = await new SignJWT({ groupId: payload.groupId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(enc.encode(secret));

  return { jwt, exp };
}

export async function verifyRsvpSession(jwt: string): Promise<RsvpSession | null> {
  try {
    const secret = process.env.RSVP_SESSION_SECRET;
    if (!secret) return null;
    const { payload } = await jwtVerify(jwt, enc.encode(secret));
    const groupId = typeof payload.groupId === "string" ? payload.groupId : null;
    const exp = typeof payload.exp === "number" ? payload.exp : null;
    if (!groupId || !exp) return null;
    return { groupId, exp };
  } catch {
    return null;
  }
}
