import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Webhook genérico.
 * Para Mercado Pago, normalmente chega um evento com id do recurso; o ideal é buscar o pagamento no provedor
 * com o access token e atualizar o status. Mantemos propositalmente minimalista.
 */
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => null);

  // Se você implementar a verificação do provedor, atualize Payment por reference/providerId.
  // Aqui apenas aceitamos para evitar falhas no provedor durante testes.
  await prisma.payment.updateMany({
    where: { status: "created" },
    data: { status: "pending" }
  });

  return NextResponse.json({ ok: true });
}

export async function GET(_req: NextRequest) {
  return NextResponse.json({ ok: true });
}
