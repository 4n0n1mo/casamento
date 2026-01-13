import type { CreateCheckoutInput, CreateCheckoutResult } from "@/lib/payments/types";
import { createMercadoPagoCheckout } from "@/lib/payments/providers/mercadopago";

export async function createPixCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
  // Prioridade: Mercado Pago (Checkout Pro)
  const mp = await createMercadoPagoCheckout(input);
  if (mp.ok) return mp;

  // Fallback: modo "mock" para dev (sem gateway configurado).
  // Em produção, remova este fallback e exija gateway.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    ok: true,
    redirectUrl: `${siteUrl}/obrigado?mock=1&ref=${encodeURIComponent(input.reference)}`,
    reference: input.reference
  };
}
