export type CreateCheckoutResult =
  | { ok: true; redirectUrl: string; reference: string }
  | { ok: false; error: string };

export type CreateCheckoutInput = {
  amountCents: number;
  description: string;
  reference: string;
};
