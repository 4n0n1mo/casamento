import { NextResponse } from "next/server";
import { decryptToken } from "@/lib/tokenCrypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    const header = ["label", "deadline", "plus_one_allowed", "token", "rsvp_url"].join(",");
    return new NextResponse(header + "
", {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=tokens.csv"
      }
    });
  }

  const { prisma } = await import("@/lib/db");
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
    const rsvpUrl = `${siteUrl.replace(/\/$/, "")}/rsvp?t=${encodeURIComponent(token)}`;
    return [
      csv(g.label),
      g.deadline.toISOString(),
      g.plusOneAllowed ? "1" : "0",
      csv(token),
      csv(rsvpUrl)
    ].join(",");
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
