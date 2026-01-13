import { NextResponse, type NextRequest } from "next/server";
import { adminRegenerateGroupToken } from "@/lib/adminTokens";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { groupId?: string } | null;
  const groupId = String(body?.groupId ?? "");
  if (!groupId) return NextResponse.json({ error: "missing_groupId" }, { status: 400 });

  const r = await adminRegenerateGroupToken(groupId);
  if (!r.ok) return NextResponse.json({ error: "failed" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
