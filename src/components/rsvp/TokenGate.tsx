"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/lib/site";
import {
  verifyPartyToken,
  type PartyTokenPayload,
  type RsvpStatus,
  isDeadlinePassed,
  formatDeadline
} from "@/lib/rsvpToken";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

type Mode = "rsvp" | "info";

type GuestState = {
  id: string;
  fullName: string;
  rsvpStatus: RsvpStatus;
  diet: string[];
  dietOther: string;
};

const DIET_OPTIONS = [
  "Vegetariano",
  "Vegano",
  "Sem glúten",
  "Sem lactose",
  "Alergia a nozes",
  "Alergia a frutos do mar"
] as const;

function clampToken(t: string) {
  return t.replace(/\s+/g, "").slice(0, 512);
}

async function safeCopy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function buildSummary(party: PartyTokenPayload, guests: GuestState[]) {
  const lines: string[] = [];
  lines.push(`RSVP — ${site.couple.a} & ${site.couple.b}`);
  lines.push(`Grupo: ${party.label}`);
  lines.push(`Data/hora: ${site.dateLong} • ${site.city}`);
  lines.push("---");
  for (const g of guests) {
    const status = g.rsvpStatus === "YES" ? "VAI" : g.rsvpStatus === "NO" ? "NÃO VAI" : "PENDENTE";
    const diet = [...g.diet, g.dietOther?.trim()].filter(Boolean).join(", ");
    lines.push(`${g.fullName}: ${status}${diet ? ` (Alimentação: ${diet})` : ""}`);
  }
  lines.push("---");
  lines.push(`Gerado em: ${new Date().toLocaleString("pt-BR")}`);
  return lines.join("\n");
}

export function TokenGate({ mode = "rsvp" as Mode }: { mode?: Mode }) {
  const sp = useSearchParams();
  const initialToken = useMemo(() => clampToken(sp.get("t") ?? ""), [sp]);

  const [token, setToken] = useState(initialToken);
  const [loading, setLoading] = useState(false);
  const [party, setParty] = useState<PartyTokenPayload | null>(null);
  const [guests, setGuests] = useState<GuestState[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const deadlineLabel = useMemo(() => formatDeadline(party?.deadline), [party?.deadline]);
  const deadlinePassed = useMemo(() => isDeadlinePassed(party?.deadline), [party?.deadline]);

  useEffect(() => {
    if (!initialToken) return;
    void handleValidate(initialToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialToken]);

  async function handleValidate(tokenToValidate?: string) {
    const t = clampToken(tokenToValidate ?? token);
    setToken(t);
    setError(null);
    setSubmitted(false);
    setSummary(null);
    setLoading(true);
    try {
      const payload = await verifyPartyToken(t, site.rsvpPublicKeyB64);
      if (!payload) {
        setParty(null);
        setGuests([]);
        setError(site.rsvpPublicKeyB64 ? "Código inválido." : "RSVP não configurado. Use token DEMO para pré-visualizar.");
        return;
      }
      setParty(payload);
      setGuests(
        (payload.guests ?? []).map((g) => ({
          id: g.id,
          fullName: g.fullName,
          rsvpStatus: "PENDING",
          diet: [],
          dietOther: ""
        }))
      );
    } finally {
      setLoading(false);
    }
  }

  function setGuestStatus(id: string, status: RsvpStatus) {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, rsvpStatus: status } : g)));
  }

  function toggleDiet(id: string, opt: string) {
    setGuests((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const has = g.diet.includes(opt);
        const diet = has ? g.diet.filter((x) => x !== opt) : [...g.diet, opt];
        return { ...g, diet };
      })
    );
  }

  function setDietOther(id: string, value: string) {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, dietOther: value } : g)));
  }

  async function handleSubmit() {
    if (!party) return;
    if (deadlinePassed) {
      setError("Este RSVP está fechado para este grupo.");
      return;
    }

    setError(null);
    setLoading(true);

    const payload = {
      token,
      groupLabel: party.label,
      deadline: party.deadline,
      responses: guests.map((g) => ({
        guestId: g.id,
        fullName: g.fullName,
        rsvpStatus: g.rsvpStatus,
        diet: g.diet,
        dietOther: g.dietOther?.trim() || undefined
      })),
      createdAt: new Date().toISOString()
    };

    try {
      if (site.rsvpWebhookUrl) {
        const res = await fetch(site.rsvpWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          setError("Não foi possível enviar agora. Tente novamente.");
          return;
        }
      }

      const s = buildSummary(party, guests);
      setSummary(s);
      setSubmitted(true);
    } catch {
      setError("Não foi possível enviar agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const fade = { duration: 0.2 };

  return (
    <section className="mt-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
            {mode === "info" ? "Acesso do convidado" : "Confirmar presença"}
          </h2>
          <p className="mt-2 text-sm md:text-base text-charcoal/70 max-w-[60ch]">
            {mode === "info"
              ? "Para ver o endereço completo, use o código do seu convite (token) ou acesse pelo QR."
              : "Use o código do seu convite (token) ou acesse pelo QR para confirmar presença do seu grupo."}
          </p>
          {!site.rsvpPublicKeyB64 && (
            <p className="mt-2 text-xs text-charcoal/60">
              Pré-visualização: use o token <span className="font-mono">DEMO</span>.
            </p>
          )}
        </div>

        {party && (
          <div className="hidden md:flex items-center gap-2">
            <Badge>{party.label}</Badge>
            {deadlineLabel && <Badge variant={deadlinePassed ? "muted" : "accent"}>Até {deadlineLabel}</Badge>}
          </div>
        )}
      </div>

      <Card className="mt-6 p-5 md:p-6">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div>
            <label className="text-xs tracking-[0.18em] uppercase text-olive/70">Código (token)</label>
            <Input
              value={token}
              onChange={(e) => setToken(clampToken(e.target.value))}
              placeholder={site.rsvpPublicKeyB64 ? "Cole aqui o token do convite" : "DEMO"}
              className="mt-2 font-mono"
              inputMode="text"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={() => void handleValidate()} disabled={loading || !token}>
              {loading ? "Validando…" : "Acessar"}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, transition: fade }}
              exit={{ opacity: 0, y: 6, transition: fade }}
              className="mt-4 text-sm text-terracotta"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {party && mode === "info" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: fade }}
              exit={{ opacity: 0, y: 10, transition: fade }}
              className="mt-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Endereço completo</div>
                  <div className="mt-2 text-base md:text-lg text-charcoal">
                    {party.addressFull || "Endereço não informado neste token."}
                  </div>
                  {party.notes && <div className="mt-2 text-sm text-charcoal/70">{party.notes}</div>}
                </div>
                <div className="shrink-0">
                  <Button
                    variant="secondary"
                    onClick={() => void safeCopy(party.addressFull || "")}
                    disabled={!party.addressFull}
                  >
                    Copiar
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-sm text-charcoal/60">
                Se precisar, use o mapa da região: {" "}
                <a className="underline" href={site.mapLink} target="_blank" rel="noreferrer">
                  abrir no Maps
                </a>
                .
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {party && mode === "rsvp" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: fade }}
              exit={{ opacity: 0, y: 10, transition: fade }}
              className="mt-6"
            >
              <div className="flex flex-wrap items-center gap-2 md:hidden">
                <Badge>{party.label}</Badge>
                {deadlineLabel && <Badge variant={deadlinePassed ? "muted" : "accent"}>Até {deadlineLabel}</Badge>}
              </div>

              {deadlinePassed && (
                <div className="mt-4 rounded-xl border border-terracotta/25 bg-terracotta/5 p-4 text-sm text-charcoal/80">
                  Este RSVP está fechado para este grupo.
                </div>
              )}

              <div className="mt-5">
                <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Convidados</div>
                <div className="mt-3 space-y-4">
                  {guests.map((g) => (
                    <div key={g.id} className="rounded-2xl border border-olive/10 p-4 md:p-5">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="text-base md:text-lg text-charcoal">{g.fullName}</div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={g.rsvpStatus === "YES" ? "primary" : "secondary"}
                            onClick={() => setGuestStatus(g.id, "YES")}
                            disabled={deadlinePassed}
                          >
                            Vai
                          </Button>
                          <Button
                            size="sm"
                            variant={g.rsvpStatus === "NO" ? "primary" : "secondary"}
                            onClick={() => setGuestStatus(g.id, "NO")}
                            disabled={deadlinePassed}
                          >
                            Não vai
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-xs tracking-[0.18em] uppercase text-olive/70">
                          Restrição alimentar (opcional)
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {DIET_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => toggleDiet(g.id, opt)}
                              disabled={deadlinePassed}
                              className={[
                                "rounded-full border px-3 py-1 text-xs transition",
                                g.diet.includes(opt)
                                  ? "border-olive/30 bg-olive/10 text-olive"
                                  : "border-olive/10 bg-ivory text-charcoal/70 hover:border-olive/20"
                              ].join(" ")}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        <div className="mt-3">
                          <Input
                            value={g.dietOther}
                            onChange={(e) => setDietOther(g.id, e.target.value)}
                            placeholder="Outro (opcional)"
                            className="text-sm"
                            disabled={deadlinePassed}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="text-sm text-charcoal/70">
                    {deadlineLabel
                      ? `Você pode enviar/alterar sua resposta até ${deadlineLabel}. Enviaremos sempre a última confirmação recebida.`
                      : "Você pode enviar/alterar sua resposta reenviando a confirmação."}
                  </div>
                  <Button onClick={() => void handleSubmit()} disabled={loading || !party || deadlinePassed}>
                    {loading ? "Enviando…" : "Confirmar"}
                  </Button>
                </div>

                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0, transition: fade }}
                      exit={{ opacity: 0, y: 10, transition: fade }}
                      className="mt-6 rounded-2xl border border-olive/15 bg-olive/5 p-5"
                    >
                      <div className="text-base md:text-lg font-serif text-charcoal">Confirmação registrada.</div>
                      <div className="mt-2 text-sm text-charcoal/70">
                        Obrigado! Se quiser guardar um comprovante, copie o resumo abaixo.
                      </div>

                      {summary && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Resumo</div>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={async () => {
                                const ok = await safeCopy(summary);
                                if (!ok) setError("Não foi possível copiar. Selecione o texto manualmente.");
                              }}
                            >
                              Copiar
                            </Button>
                          </div>
                          <pre className="mt-2 whitespace-pre-wrap rounded-xl border border-olive/10 bg-ivory p-4 text-xs text-charcoal/80">{summary}</pre>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </section>
  );
}
