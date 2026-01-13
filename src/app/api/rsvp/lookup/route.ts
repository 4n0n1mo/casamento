import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getClientIp, hashIp, hmacSha256Hex } from "@/lib/serverCrypto";
import { checkRsvpRateLimit, logRsvpAttempt } from "@/lib/ratelimit";
import { signRsvpSession } from "@/lib/security";
import { verifyTurnstileToken } from "@/lib/turnstile";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as
    | { token?: string; mode?: "rsvp" | "address"; turnstileToken?: string }
    | null;

  const token = (body?.token ?? "").trim();
  const mode = body?.mode === "address" ? "address" : "rsvp";

  const pepper = process.env.TOKEN_PEPPER ?? "";
  const ip = getClientIp(req.headers);
  const ipHash = hashIp(ip, pepper || "dev-pepper");

  if (token.length < 10) {
    await logRsvpAttempt({ ipHash, success: false });
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  // Lookup group id early (if possible), to apply per-group limits later.
  const tokenHash = hmacSha256Hex(token, pepper || "dev-pepper");
  const group = await prisma.inviteGroup.findUnique({
    where: { tokenHash },
    include: { guests: true }
  });

  const rl = await checkRsvpRateLimit({ ipHash, groupId: group?.id });
  if (!rl.allowed) {
    await logRsvpAttempt({ ipHash, success: false, groupId: group?.id });
    return NextResponse.json({ error: "rate_limited", captchaRequired: true }, { status: 429 });
  }

  if (rl.captchaRequired) {
    const turnstileToken = body?.turnstileToken ?? "";
    if (!turnstileToken) {
      await logRsvpAttempt({ ipHash, success: false, groupId: group?.id });
      return NextResponse.json({ error: "captcha_required", captchaRequired: true }, { status: 400 });
    }
    const v = await verifyTurnstileToken(turnstileToken, ip);
    if (!v.ok) {
      await logRsvpAttempt({ ipHash, success: false, groupId: group?.id });
      return NextResponse.json({ error: "captcha_invalid", captchaRequired: true }, { status: 400 });
    }
  }

  // Erro genérico para reduzir enumeração
  if (!group) {
    await logRsvpAttempt({ ipHash, success: false });
    return NextResponse.json({ error: "invalid", captchaRequired: rl.captchaRequired }, { status: 400 });
  }

  // deadline enforce
  const now = new Date();
  if (now > group.deadline) {
    await logRsvpAttempt({ ipHash, success: false, groupId: group.id });
    return NextResponse.json({ error: "invalid", captchaRequired: rl.captchaRequired }, { status: 400 });
  }

  await logRsvpAttempt({ ipHash, success: true, groupId: group.id });

  // Sessão curta (2h) – edições também checadas no submit com deadline real
  const { jwt } = await signRsvpSession({ groupId: group.id, ttlSeconds: 2 * 3600 });

  const res = NextResponse.json({
    party: {
      label: group.label,
      deadline: group.deadline.toISOString(),
      plusOneAllowed: group.plusOneAllowed,
      guests: group.guests.map((g) => ({
        id: g.id,
        fullName: g.fullName,
        rsvpStatus: g.rsvpStatus,
        diet: g.diet
      })),
      addressFull: mode === "address" ? (process.env.EVENT_ADDRESS_FULL ?? "") : null
    }
  });

  res.cookies.set("__Host-rsvp", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });

  return res;
}
