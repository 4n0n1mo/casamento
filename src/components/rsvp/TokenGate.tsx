"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Card, CardBody } from "@/components/Card";
import { cn } from "@/lib/utils";

type Guest = { id: string; fullName: string; rsvpStatus: "YES" | "NO" | "PENDING"; diet?: string | null };
type Party = { label: string; deadline: string; plusOneAllowed: boolean; guests: Guest[]; addressFull?: string | null };

function TurnstileWidget({ onToken }: { onToken: (t: string) => void }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;

    const scriptId = "turnstile-script";
    if (document.getElementById(scriptId)) return;

    const s = document.createElement("script");
    s.id = scriptId;
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    document.body.appendChild(s);
  }, []);

  if (!siteKey) return null;

  // data-callback chama função global – fazemos ponte simples
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).onTurnstileSuccess = (token: string) => onToken(token);

  return (
    <div
      className="cf-turnstile"
      data-sitekey={siteKey}
      data-callback="onTurnstileSuccess"
    />
  );
}

export function TokenGate({
  mode,
  initialToken
}: {
  mode: "rsvp" | "address";
  initialToken?: string;
}) {  const tokenFromUrl = initialToken ?? "";
  const [token, setToken] = useState(tokenFromUrl);
  const [party, setParty] = useState<Party | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>("");

  const title = mode === "rsvp" ? "Confirmar presença" : "Endereço completo";

  useEffect(() => {
    if (tokenFromUrl && !party) {
      // Auto-lookup se veio via QR com token
      void lookup(tokenFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenFromUrl]);

  async function lookup(tokenValue: string) {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/rsvp/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ token: tokenValue, mode, turnstileToken: captchaToken || undefined })
      });

      const data = await res.json();
      if (!res.ok) {
        setCaptchaRequired(Boolean(data?.captchaRequired));
        setMsg("Não foi possível validar o código. Verifique e tente novamente.");
        return;
      }
      setCaptchaRequired(false);
      setParty(data.party as Party);
    } catch {
      setMsg("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (!party) {
    return (
      <Card>
        <CardBody className="flex flex-col gap-4">
          <div>
            <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Acesso</div>
            <h2 className="font-serif text-2xl text-charcoal">{title}</h2>
            <p className="mt-2 text-sm text-charcoal/75">
              Digite o código do seu convite. Ele também pode vir automaticamente pelo QR Code.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-charcoal/80" htmlFor="token">Código do convite</label>
            <input
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className={cn(
                "w-full rounded-xl border border-line bg-white/60 px-4 py-3 text-sm outline-none transition duration-200",
                "focus:border-gold/70 focus:ring-2 focus:ring-gold/20"
              )}
              placeholder="Ex.: 8mQw7ZpK... (sem espaços)"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          {captchaRequired ? (
            <div className="rounded-xl border border-line bg-white/40 p-4">
              <p className="text-sm text-charcoal/75 mb-3">
                Por segurança, conclua a verificação abaixo e tente novamente.
              </p>
              <TurnstileWidget onToken={(t) => setCaptchaToken(t)} />
            </div>
          ) : null}

          {msg ? <p className="text-sm text-terracotta">{msg}</p> : null}

          <Button
            onClick={() => lookup(token)}
            disabled={loading || token.trim().length < 10 || (captchaRequired && !captchaToken)}
          >
            {loading ? "Validando..." : "Continuar"}
          </Button>

          <p className="text-xs text-charcoal/60">
            O RSVP é fechado. Apenas convidados com código conseguem confirmar.
          </p>
        </CardBody>
      </Card>
    );
  }

  if (mode === "address") {
    return (
      <Card>
        <CardBody className="flex flex-col gap-3">
          <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Convidados</div>
          <h2 className="font-serif text-2xl text-charcoal">Endereço completo</h2>
          {party.addressFull ? (
            <p className="text-sm text-charcoal/80 whitespace-pre-line">{party.addressFull}</p>
          ) : (
            <p className="text-sm text-charcoal/75">
              O endereço completo ainda não foi configurado.
            </p>
          )}
          <p className="text-xs text-charcoal/60">
            Este conteúdo é protegido pelo código do convite.
          </p>
        </CardBody>
      </Card>
    );
  }

  return <RsvpForm party={party} />;
}

function DietChips({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const options: Array<{ k: string; label: string }> = [
    { k: "vegetariano", label: "Vegetariano" },
    { k: "vegano", label: "Vegano" },
    { k: "sem_gluten", label: "Sem glúten" },
    { k: "sem_lactose", label: "Sem lactose" },
    { k: "alergia_nozes", label: "Alergia a nozes" }
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o.k);
        return (
          <button
            type="button"
            key={o.k}
            onClick={() =>
              onChange(active ? value.filter((x) => x !== o.k) : [...value, o.k])
            }
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition duration-200",
              active
                ? "border-olive bg-olive/10 text-olive"
                : "border-line bg-white/30 text-charcoal/75 hover:bg-charcoal/5"
            )}
            aria-pressed={active}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function RsvpForm({ party }: { party: Party }) {
  const initial = useMemo(() => {
    return party.guests.map((g) => ({
      id: g.id,
      fullName: g.fullName,
      rsvpStatus: g.rsvpStatus,
      diet: g.diet ? g.diet.split(";").filter(Boolean) : []
    }));
  }, [party.guests]);

  const [rows, setRows] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function setStatus(id: string, status: "YES" | "NO") {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, rsvpStatus: status } : r)));
  }

  function setDiet(id: string, diet: string[]) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, diet } : r)));
  }

  async function submit() {
    setSaving(true);
    setErr(null);
    setOk(false);

    try {
      const res = await fetch("/api/rsvp/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          guests: rows.map((r) => ({
            id: r.id,
            rsvpStatus: r.rsvpStatus,
            diet: r.diet.join(";")
          }))
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErr(data?.message || "Não foi possível salvar. Tente novamente.");
        return;
      }

      setOk(true);
    } catch {
      setErr("Falha de conexão. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardBody className="flex flex-col gap-6">
        <div>
          <div className="text-xs tracking-[0.18em] uppercase text-olive/70">{party.label}</div>
          <h2 className="font-serif text-2xl text-charcoal">Confirmar presença</h2>
          <p className="mt-2 text-sm text-charcoal/75">
            Selecione <strong>Vai</strong> ou <strong>Não vai</strong> para cada pessoa. Você pode editar até a data limite.
          </p>
            {party.plusOneAllowed ? null : (
              <p className="mt-2 text-xs text-charcoal/60">
                Observação: este convite não possui acompanhante adicional.
              </p>
            )}
        </div>

        <div className="flex flex-col gap-4">
          {rows.map((r) => (
            <div key={r.id} className="rounded-xl border border-line bg-white/35 p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-charcoal">{r.fullName}</div>
                    <div className="text-xs text-charcoal/60">Restrição alimentar (opcional)</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs transition duration-200",
                        r.rsvpStatus === "YES"
                          ? "border-olive bg-olive/10 text-olive"
                          : "border-line bg-white/30 text-charcoal/75 hover:bg-charcoal/5"
                      )}
                      onClick={() => setStatus(r.id, "YES")}
                      aria-pressed={r.rsvpStatus === "YES"}
                    >
                      Vai
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs transition duration-200",
                        r.rsvpStatus === "NO"
                          ? "border-terracotta bg-terracotta/10 text-terracotta"
                          : "border-line bg-white/30 text-charcoal/75 hover:bg-charcoal/5"
                      )}
                      onClick={() => setStatus(r.id, "NO")}
                      aria-pressed={r.rsvpStatus === "NO"}
                    >
                      Não vai
                    </button>
                  </div>
                </div>
                <DietChips value={r.diet} onChange={(d) => setDiet(r.id, d)} />
              </div>
            </div>
          ))}
        </div>

        {err ? <p className="text-sm text-terracotta">{err}</p> : null}
        {ok ? (
          <div className="rounded-xl border border-line bg-olive/5 p-4 text-sm text-olive">
            Presença atualizada com sucesso.
          </div>
        ) : null}

        <Button onClick={submit} disabled={saving}>
          {saving ? "Salvando..." : "Confirmar"}
        </Button>

        <p className="text-xs text-charcoal/60">
          Política: usamos apenas para contagem de convidados e restrições alimentares.
        </p>
      </CardBody>
    </Card>
  );
}
