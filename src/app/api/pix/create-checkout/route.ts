import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { createPixCheckout } from "@/lib/payments";
import { formatCentsBRL } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { amountCents?: number } | null;
  const amountCents = Math.floor(Number(body?.amountCents ?? 0));

  if (!Number.isFinite(amountCents) || amountCents < 500 || amountCents > 5000000) {
    return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
  }

  const reference = `gift_${crypto.randomBytes(10).toString("hex")}`;

  await prisma.payment.create({
    data: {
      provider: process.env.MERCADOPAGO_ACCESS_TOKEN ? "mercadopago" : "mock",
      reference,
      amountCents,
      status: "created"
    }
  });

  const result = await createPixCheckout({
    amountCents,
    description: `Presente de casamento — ${formatCentsBRL(amountCents)}`,
    reference
  });

  if (!result.ok) {
    await prisma.payment.update({
      where: { reference },
      data: { status: "unknown" }
    });
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ redirectUrl: result.redirectUrl, reference });
}
