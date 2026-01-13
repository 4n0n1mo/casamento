export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCentsBRL(valueCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(valueCents / 100);
}

export function safeParseCents(input: unknown) {
  const raw = typeof input === "string" ? input : "";
  const normalized = raw.replace(/[^0-9]/g, "");
  if (!normalized) return null;
  const cents = Number(normalized);
  if (!Number.isFinite(cents)) return null;
  return cents;
}
