import type { CreateCheckoutInput, CreateCheckoutResult } from "@/lib/payments/types";

type MpPreferenceResponse = {
  id: string;
  init_point: string;
  sandbox_init_point: string;
};

export async function createMercadoPagoCheckout(
  input: CreateCheckoutInput
): Promise<CreateCheckoutResult> {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!accessToken) return { ok: false, error: "gateway_not_configured" };
  if (!siteUrl) return { ok: false, error: "site_url_not_configured" };

  const body = {
    items: [
      {
        title: input.description,
        quantity: 1,
        currency_id: "BRL",
        unit_price: input.amountCents / 100
      }
    ],
    external_reference: input.reference,
    back_urls: {
      success: `${siteUrl}/obrigado`,
      pending: `${siteUrl}/obrigado`,
      failure: `${siteUrl}/presentes?status=falha`
    },
    auto_return: "approved",
    notification_url: `${siteUrl}/api/pix/webhook`
  };

  const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  if (!res.ok) {
    return { ok: false, error: `provider_http_${res.status}` };
  }

  const data = (await res.json()) as MpPreferenceResponse;

  const redirectUrl = data.init_point || data.sandbox_init_point;
  if (!redirectUrl) return { ok: false, error: "provider_missing_url" };

  return { ok: true, redirectUrl, reference: input.reference };
}
