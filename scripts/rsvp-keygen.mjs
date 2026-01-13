/**
 * Gera um par de chaves Ed25519 (EdDSA) para assinar tokens de RSVP.
 * Saída:
 *  - imprime PUBLIC KEY (PEM) e PRIVATE KEY (PEM)
 *  - imprime NEXT_PUBLIC_RSVP_PUBLIC_KEY_B64 (base64) para uso no Vercel
 *
 * Uso:
 *   npm run gen:rsvp-keys
 */

import { generateKeyPair } from "node:crypto";
import { promisify } from "node:util";
import { exportPKCS8, exportSPKI } from "jose";

const gen = promisify(generateKeyPair);

const { publicKey, privateKey } = await gen("ed25519");

const publicPem = await exportSPKI(publicKey);
const privatePem = await exportPKCS8(privateKey);

const publicB64 = Buffer.from(publicPem, "utf8").toString("base64");

console.log("\nPUBLIC_KEY_PEM:\n" + publicPem);
console.log("\nPRIVATE_KEY_PEM:\n" + privatePem);
console.log("\nNEXT_PUBLIC_RSVP_PUBLIC_KEY_B64=" + publicB64 + "\n");
