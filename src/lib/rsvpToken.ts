"use client";

import { jwtVerify, importSPKI } from "jose";
import type { JWTPayload } from "jose";

export type RsvpStatus = "YES" | "NO" | "PENDING";

export type PartyGuest = {
  id: string;
  fullName: string;
};

export type PartyTokenPayload = JWTPayload & {
  v: 1;
  label: string;
  guests: PartyGuest[];
  plusOneAllowed?: boolean;
  deadline?: string; // ISO date (YYYY-MM-DD) ou ISO datetime
  addressFull?: string;
  notes?: string;
};

const demoPayload: PartyTokenPayload = {
  v: 1,
  label: "Família Exemplo",
  guests: [
    { id: "g1", fullName: "Convidado(a) 1" },
    { id: "g2", fullName: "Convidado(a) 2" }
  ],
  plusOneAllowed: false,
  deadline: "2026-07-01",
  addressFull: "Endereço completo (demo) — Rua Exemplo, 123 — São Paulo/SP",
  notes: "Use este modo apenas para pré-visualizar a UI."
};

/**
 * Valida e decodifica o token de RSVP no navegador.
 * - Se NEXT_PUBLIC_RSVP_PUBLIC_KEY_B64 não estiver configurado, aceita apenas token "DEMO".
 * - Se configurado, exige JWT assinado (EdDSA) e retorna o payload tipado.
 */
export async function verifyPartyToken(
  tokenRaw: string,
  publicKeyB64: string
): Promise<PartyTokenPayload | null> {
  const token = (tokenRaw ?? "").trim();
  if (!token) return null;

  if (!publicKeyB64) {
    if (token.toUpperCase() === "DEMO") return demoPayload;
    return null;
  }

  try {
    const pem = atob(publicKeyB64);
    const key = await importSPKI(pem, "EdDSA");
    const { payload } = await jwtVerify(token, key, { algorithms: ["EdDSA"] });

    const p = payload as PartyTokenPayload;
    if (p?.v !== 1) return null;
    if (typeof p?.label !== "string") return null;
    if (!Array.isArray(p?.guests)) return null;

    return p;
  } catch {
    return null;
  }
}

export function isDeadlinePassed(deadline?: string): boolean {
  if (!deadline) return false;
  const d = new Date(deadline.length <= 10 ? `${deadline}T23:59:59` : deadline);
  if (Number.isNaN(d.getTime())) return false;
  return Date.now() > d.getTime();
}

export function formatDeadline(deadline?: string): string | null {
  if (!deadline) return null;
  const d = new Date(deadline.length <= 10 ? `${deadline}T00:00:00` : deadline);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "2-digit" });
}
