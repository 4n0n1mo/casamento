import crypto from "crypto";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { hmacSha256Hex } from "@/lib/serverCrypto";
import { encryptToken, decryptToken } from "@/lib/tokenCrypto";

export async function adminGetGroupToken(groupId: string): Promise<
  | { ok: true; token: string; rsvpUrl: string; qrDataUrl: string }
  | { ok: false }
> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return { ok: false };

  const group = await prisma.inviteGroup.findUnique({ where: { id: groupId } });
  if (!group?.tokenEnc) return { ok: false };

  let token = "";
  try {
    token = decryptToken(group.tokenEnc);
  } catch {
    return { ok: false };
  }

  const rsvpUrl = `${siteUrl}/rsvp?t=${encodeURIComponent(token)}`;

  const qrDataUrl = await QRCode.toDataURL(rsvpUrl, {
    margin: 1,
    width: 360
  });

  return { ok: true, token, rsvpUrl, qrDataUrl };
}

export async function adminRegenerateGroupToken(groupId: string): Promise<
  | { ok: true; token: string; rsvpUrl: string; qrDataUrl: string }
  | { ok: false }
> {
  const pepper = process.env.TOKEN_PEPPER;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!pepper || !siteUrl) return { ok: false };

  const token = crypto.randomBytes(16).toString("base64url");
  const tokenHash = hmacSha256Hex(token, pepper);
  let tokenEnc = "";
  try {
    tokenEnc = encryptToken(token);
  } catch {
    return { ok: false };
  }

  await prisma.inviteGroup.update({
    where: { id: groupId },
    data: { tokenHash, tokenEnc }
  });

  const rsvpUrl = `${siteUrl}/rsvp?t=${encodeURIComponent(token)}`;

  const qrDataUrl = await QRCode.toDataURL(rsvpUrl, {
    margin: 1,
    width: 360
  });

  return { ok: true, token, rsvpUrl, qrDataUrl };
}
