"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Card, CardBody } from "@/components/Card";
import { cn, formatCentsBRL } from "@/lib/utils";
import { suggestedAmounts } from "@/lib/site";

export function GiftCheckout() {
  const [selected, setSelected] = useState<number>(suggestedAmounts[1].valueCents);
  const [custom, setCustom] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const amountCents = useMemo(() => {
    const n = Number(custom.replace(/[^0-9]/g, ""));
    if (custom.trim().length > 0 && Number.isFinite(n)) return n * 100; // custom em reais
    return selected;
  }, [custom, selected]);

  async function startCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/pix/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ amountCents })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "checkout_failed");
      window.location.href = data.redirectUrl as string;
    } catch {
      alert("Não foi possível iniciar o checkout. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardBody className="flex flex-col gap-5">
        <div>
          <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Checkout Pix</div>
          <h3 className="font-serif text-2xl text-charcoal">Presentear via Pix</h3>
          <p className="mt-2 text-sm text-charcoal/75">
            Escolha um valor sugerido ou defina um valor livre. Você será direcionado ao checkout do gateway.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestedAmounts.map((a) => {
            const active = selected === a.valueCents && custom.trim() === "";
            return (
              <button
                key={a.valueCents}
                type="button"
                onClick={() => {
                  setSelected(a.valueCents);
                  setCustom("");
                }}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition duration-200",
                  active
                    ? "border-olive bg-olive/10 text-olive"
                    : "border-line bg-white/30 text-charcoal/75 hover:bg-charcoal/5"
                )}
                aria-pressed={active}
              >
                {a.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-charcoal/80" htmlFor="valorLivre">
            Valor livre (em reais) — opcional
          </label>
          <input
            id="valorLivre"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className={cn(
              "w-full rounded-xl border border-line bg-white/60 px-4 py-3 text-sm outline-none transition duration-200",
              "focus:border-gold/70 focus:ring-2 focus:ring-gold/20"
            )}
            placeholder="Ex.: 75"
            inputMode="numeric"
          />
          <div className="text-xs text-charcoal/60">
            Total: <span className="font-medium text-charcoal">{formatCentsBRL(amountCents)}</span>
          </div>
        </div>

        <Button onClick={startCheckout} disabled={loading || amountCents < 500}>
          {loading ? "Abrindo checkout..." : "Presentear via Pix"}
        </Button>

        <p className="text-xs text-charcoal/60">
          Você verá a confirmação no seu app do banco/gateway. Não exibimos dados pessoais nesta página.
        </p>
      </CardBody>
    </Card>
  );
}
