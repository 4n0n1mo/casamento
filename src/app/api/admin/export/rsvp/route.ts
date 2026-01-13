import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    const header = ["group_label", "guest_name", "rsvp_status", "diet", "updated_at"].join(",");
    return new NextResponse(header + "
", {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=rsvp.csv"
      }
    });
  }

  const { prisma } = await import("@/lib/db");
  const guests = await prisma.guest.findMany({
    include: { group: true },
    orderBy: [{ group: { label: "asc" } }, { fullName: "asc" }]
  });

  const header = ["group_label", "guest_name", "rsvp_status", "diet", "updated_at"].join(",");
  const lines = guests.map((g) =>
    [csv(g.group.label), csv(g.fullName), g.rsvpStatus, csv(g.diet ?? ""), g.updatedAt.toISOString()].join(",")
  );

  const csvText = [header, ...lines].join("\n");

  return new NextResponse(csvText, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=rsvp.csv"
    }
  });
}

function csv(v: string) {
  const s = String(v ?? "").replace(/"/g, '""');
  return `"${s}"`;
}
