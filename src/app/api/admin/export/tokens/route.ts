import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { decryptToken } from "@/lib/tokenCrypto";

export const runtime = "nodejs";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const groups = await prisma.inviteGroup.findMany({ orderBy: { createdAt: "desc" } });

  const header = ["label", "deadline", "plus_one_allowed", "token", "rsvp_url"].join(",");
  const lines = groups.map((g) => {
    let token = "";
    try {
      token = decryptToken(g.tokenEnc);
    } catch {
      token = "";
    }
    const url = token ? `${siteUrl}/rsvp?t=${encodeURIComponent(token)}` : "";
    return [csv(g.label), g.deadline.toISOString().slice(0, 10), String(g.plusOneAllowed), csv(token), csv(url)].join(",");
  });

  const csvText = [header, ...lines].join("\n");

  return new NextResponse(csvText, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=tokens.csv"
    }
  });
}

function csv(v: string) {
  const s = String(v ?? "").replace(/"/g, '""');
  return `"${s}"`;
}
