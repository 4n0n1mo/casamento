"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site, suggestedAmounts } from "@/lib/site";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type PixLink = { valueCents: number; url: string };

function safeParseLinks(json: string): PixLink[] {
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return [];
    return arr
      .map((x) => ({ valueCents: Number(x?.valueCents), url: String(x?.url ?? "") }))
      .filter((x) => Number.isFinite(x.valueCents) && x.valueCents > 0 && x.url.startsWith("http"));
  } catch {
    return [];
  }
}

async function safeCopy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function GiftCheckout() {
  const pixLinks = useMemo(() => safeParseLinks(site.pixLinksJson), []);
  const [selected, setSelected] = useState<number>(suggestedAmounts[1].valueCents);
  const [custom, setCustom] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const selectedUrl = useMemo(() => {
    const fromList = pixLinks.find((x) => x.valueCents === selected)?.url;
    return fromList || site.pixGatewayUrl || "";
  }, [pixLinks, selected]);

  const customCents = useMemo(() => {
    const v = Number((custom || "").replace(/[^0-9.,]/g, "").replace(",", "."));
    if (!Number.isFinite(v) || v <= 0) return null;
    return Math.round(v * 100);
  }, [custom]);

  function openGateway(url: string) {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const fade = { duration: 0.2 };

  return (
    <Card className="mt-6 p-5 md:p-6">
      <div className="flex flex-col gap-2">
        <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Checkout Pix</div>
        <div className="text-sm md:text-base text-charcoal/70">{site.pixCopy}</div>
      </div>

      <div className="mt-6">
        <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Valores sugeridos</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestedAmounts.map((a) => (
            <button
              key={a.valueCents}
              type="button"
              onClick={() => setSelected(a.valueCents)}
              className={[
                "rounded-full border px-4 py-2 text-sm transition",
                selected === a.valueCents
                  ? "border-olive/30 bg-olive/10 text-olive"
                  : "border-olive/10 bg-ivory text-charcoal/70 hover:border-olive/20"
              ].join(" ")}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-charcoal/70">
            {selectedUrl
              ? "Abrimos o link do gateway em uma nova aba."
              : "Configure um link do gateway (NEXT_PUBLIC_PIX_GATEWAY_URL) ou use a chave Pix abaixo."}
          </div>
          <Button onClick={() => openGateway(selectedUrl)} disabled={!selectedUrl}>
            Presentear via Pix
          </Button>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-[1fr_auto]">
          <div>
            <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Valor livre (opcional)</div>
            <Input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Ex.: 150,00"
              className="mt-2"
              inputMode="decimal"
            />
            <div className="mt-2 text-xs text-charcoal/60">
              Para valor livre, recomendamos usar a chave Pix (abaixo). Alguns gateways não suportam valor livre por
              link.
            </div>
          </div>
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() => {
                if (!selectedUrl) return;
                openGateway(selectedUrl);
              }}
              disabled={!selectedUrl || !customCents}
            >
              Abrir gateway
            </Button>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-olive/10 bg-ivory p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Chave Pix (valor livre)</div>
              {site.pixKey ? (
                <>
                  <div className="mt-2 font-mono text-sm text-charcoal break-all">{site.pixKey}</div>
                  {site.pixKeyOwner && <div className="mt-1 text-xs text-charcoal/60">Favorecido: {site.pixKeyOwner}</div>}
                </>
              ) : (
                <div className="mt-2 text-sm text-charcoal/70">
                  Não configurada. Defina <span className="font-mono">NEXT_PUBLIC_PIX_KEY</span> para habilitar.
                </div>
              )}
            </div>
            <div className="shrink-0">
              <Button
                size="sm"
                variant="secondary"
                onClick={async () => {
                  if (!site.pixKey) return;
                  const ok = await safeCopy(site.pixKey);
                  setCopied(ok);
                  setTimeout(() => setCopied(false), 1500);
                }}
                disabled={!site.pixKey}
              >
                Copiar
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, transition: fade }}
                exit={{ opacity: 0, y: 6, transition: fade }}
                className="mt-3 text-xs text-olive"
              >
                Copiado.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}
