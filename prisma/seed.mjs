import crypto from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function hashToken(token, pepper) {
  return crypto.createHmac("sha256", pepper).update(token).digest("hex");
}

function getEncKey() {
  const raw = process.env.TOKEN_ENC_KEY || "";
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) return null;
  return key;
}

function encryptToken(token) {
  const key = getEncKey();
  if (!key) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ct = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString("base64");
}

async function main() {
  const pepper = process.env.TOKEN_PEPPER || "dev-pepper";
  const token = crypto.randomBytes(16).toString("base64url"); // ~22 chars
  const tokenHash = hashToken(token, pepper);
  const tokenEnc = encryptToken(token);

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 60);

  const group = await prisma.inviteGroup.create({
    data: {
      tokenHash,
      tokenEnc,
      label: "Família Exemplo",
      deadline,
      plusOneAllowed: true,
      guests: {
        create: [
          { fullName: "Ana Exemplo" },
          { fullName: "Bruno Exemplo" },
          { fullName: "Acompanhante" }
        ]
      }
    }
  });

  // eslint-disable-next-line no-console
  console.log("\nSEED OK");
  console.log("Grupo:", group.label);
  console.log("TOKEN (para testar):", token);
  console.log("Link RSVP:", `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/rsvp?t=${encodeURIComponent(token)}`);
  if (!tokenEnc) {
    console.log("AVISO: TOKEN_ENC_KEY não configurado — admin não conseguirá exportar tokens em texto.");
  }
  console.log("\nIMPORTANTE: guarde este token; o banco guarda apenas hash e/ou token criptografado.\n");
}

main().finally(async () => {
  await prisma.$disconnect();
});
