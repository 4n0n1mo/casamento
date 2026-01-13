/**
 * Gera tokens de RSVP (JWT EdDSA) a partir de um CSV simples.
 *
 * Entrada CSV (UTF-8) — cabeçalho obrigatório:
 *   label,deadline,addressFull,plusOneAllowed,guests
 *
 * - guests: nomes separados por "|" (pipe). Ex.: "Ana|Bruno|Carla"
 * - deadline: YYYY-MM-DD (opcional)
 * - plusOneAllowed: true/false (opcional; default false)
 *
 * Requer PRIVATE_KEY_PEM em env (PEM PKCS8 gerado pelo script rsvp-keygen).
 *
 * Saída (stdout): CSV com label,token,url
 *
 * Uso:
 *   PRIVATE_KEY_PEM="..." npm run gen:rsvp-tokens -- ./data/invites.csv https://seu-dominio.com
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { SignJWT, importPKCS8 } from "jose";

const [,, inputCsv, baseUrl] = process.argv;
if (!inputCsv || !baseUrl) {
  console.error("Uso: npm run gen:rsvp-tokens -- <input.csv> <baseUrl>");
  process.exit(1);
}

const privPem = process.env.PRIVATE_KEY_PEM;
if (!privPem) {
  console.error("Defina PRIVATE_KEY_PEM no ambiente (PEM PKCS8).\nDica: rode `npm run gen:rsvp-keys` primeiro.");
  process.exit(1);
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = lines.shift().split(",").map((s) => s.trim());
  const rows = [];
  for (const line of lines) {
    // Parser simples (sem aspas). Adequado para CSV interno.
    const cols = line.split(",");
    const obj = {};
    header.forEach((h, i) => (obj[h] = (cols[i] ?? "").trim()));
    rows.push(obj);
  }
  return rows;
}

function guestId(label, name) {
  const h = crypto
    .createHash("sha256")
    .update(label + "::" + name)
    .digest("base64url");
  return h.slice(0, 12);
}

const data = fs.readFileSync(path.resolve(inputCsv), "utf8");
const rows = parseCsv(data);

const key = await importPKCS8(privPem, "EdDSA");

const out = [];
out.push(["label", "token", "url"].join(","));

for (const r of rows) {
  const label = r.label || "Grupo";
  const deadline = (r.deadline || "").trim();
  const addressFull = (r.addressFull || "").trim();
  const plusOneAllowed = String(r.plusOneAllowed || "false").toLowerCase() === "true";
  const guestsRaw = (r.guests || "").trim();

  const guestNames = guestsRaw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

  const guests = guestNames.map((n) => ({ id: guestId(label, n), fullName: n }));

  const payload = {
    v: 1,
    label,
    guests,
    plusOneAllowed,
    deadline: deadline || undefined,
    addressFull: addressFull || undefined
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "EdDSA" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(key);

  const url = new URL("/rsvp", baseUrl);
  url.searchParams.set("t", token);

  out.push([label, token, url.toString()].join(","));
}

process.stdout.write(out.join("\n") + "\n");
