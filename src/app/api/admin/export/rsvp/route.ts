import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
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
