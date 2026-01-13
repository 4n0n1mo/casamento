import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { parseCsv } from "@/lib/csv";
import { hmacSha256Hex } from "@/lib/utils";
import { encryptToken } from "@/lib/tokenCrypto";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const pepper = process.env.TOKEN_PEPPER ?? "";
  if (!pepper) return NextResponse.json({ error: "missing_TOKEN_PEPPER" }, { status: 500 });
  if (!process.env.TOKEN_ENC_KEY) return NextResponse.json({ error: "missing_TOKEN_ENC_KEY" }, { status: 500 });

  const fd = await req.formData();
  const file = fd.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "missing_file" }, { status: 400 });

  const text = await file.text();
  const { headers, rows } = parseCsv(text);

  const idx = (name: string) => headers.findIndex((h) => h.toLowerCase() === name.toLowerCase());
  const iLabel = idx("label");
  const iDeadline = idx("deadline");
  const iPlus = idx("plus_one_allowed");
  const iGuests = idx("guests");

  if ([iLabel, iDeadline, iPlus, iGuests].some((i) => i < 0)) {
    return NextResponse.json({ error: "invalid_headers" }, { status: 400 });
  }

  let groups = 0;
  let guests = 0;

  for (const r of rows) {
    const label = (r[iLabel] ?? "").replace(/^"|"$/g, "");
    const deadlineStr = (r[iDeadline] ?? "").replace(/^"|"$/g, "");
    const plusStr = (r[iPlus] ?? "").replace(/^"|"$/g, "");
    const guestsStr = (r[iGuests] ?? "").replace(/^"|"$/g, "");

    if (!label || !deadlineStr || !guestsStr) continue;

    const deadline = new Date(`${deadlineStr}T23:59:59.000Z`);
    if (Number.isNaN(deadline.getTime())) continue;

    const plusOneAllowed = plusStr.toLowerCase() === "true";

    const token = crypto.randomBytes(16).toString("base64url");
    const tokenHash = hmacSha256Hex(token, pepper);
    let tokenEnc = "";
    try {
      tokenEnc = encryptToken(token);
    } catch {
      return NextResponse.json({ error: "invalid_TOKEN_ENC_KEY" }, { status: 500 });
    }

    const guestNames = guestsStr
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 25);

    // regra: sem nomes novos. Se plus_one_allowed, inclua "Acompanhante" no CSV.
    const group = await prisma.inviteGroup.create({
      data: {
        tokenHash,
        tokenEnc,
        label,
        deadline,
        plusOneAllowed,
        guests: { create: guestNames.map((fullName) => ({ fullName })) }
      }
    });

    groups += 1;
    guests += guestNames.length;

    // Para o fluxo “projeto completo”, deixamos o token disponível só via export/tokens.
    // Em produção, guarde o CSV exportado imediatamente.
  }

  return NextResponse.json({ ok: true, groups, guests });
}
