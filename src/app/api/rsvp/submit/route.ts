import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyRsvpSession } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get("__Host-rsvp")?.value ?? "";
  const session = await verifyRsvpSession(cookie);

  if (!session) {
    return NextResponse.json({ message: "Sessão inválida. Abra o link do convite novamente." }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | { guests?: Array<{ id: string; rsvpStatus: "YES" | "NO" | "PENDING"; diet?: string }> }
    | null;

  const guests = body?.guests ?? [];
  if (!Array.isArray(guests) || guests.length === 0) {
    return NextResponse.json({ message: "Payload inválido." }, { status: 400 });
  }

  const group = await prisma.inviteGroup.findUnique({
    where: { id: session.groupId },
    include: { guests: true }
  });

  if (!group) return NextResponse.json({ message: "Sessão inválida." }, { status: 401 });

  const now = new Date();
  if (now > group.deadline) {
    return NextResponse.json({ message: "Prazo encerrado para alterações." }, { status: 403 });
  }

  // impedir alteração/adição fora do grupo
  const allowedIds = new Set(group.guests.map((g) => g.id));
  for (const g of guests) {
    if (!allowedIds.has(g.id)) {
      return NextResponse.json({ message: "Convidado inválido." }, { status: 400 });
    }
  }


  // Regra de +1: se não permitido, bloqueia confirmação de um convidado chamado "Acompanhante" (se existir).
  if (!group.plusOneAllowed) {
    const plus = group.guests.find((g) => g.fullName.toLowerCase() === "acompanhante");
    if (plus) {
      const sent = guests.find((x) => x.id === plus.id);
      if (sent?.rsvpStatus === "YES") {
        return NextResponse.json({ message: "Acompanhante não autorizado para este convite." }, { status: 403 });
      }
    }
  }

  await prisma.$transaction(
    guests.map((g) =>
      prisma.guest.update({
        where: { id: g.id },
        data: {
          rsvpStatus: g.rsvpStatus,
          diet: (g.diet ?? "").slice(0, 200)
        }
      })
    )
  );

  return NextResponse.json({ ok: true });
}
