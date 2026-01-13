import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function makeMissingDbProxy(): PrismaClient {
  return new Proxy({} as PrismaClient, {
    get() {
      throw new Error("DATABASE_URL não configurado. Defina DATABASE_URL (ex.: file:./prisma/dev.db ou Postgres) para usar recursos de RSVP/Admin.");
    }
  });
}

function makePrisma(): PrismaClient {
  return (
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
    })
  );
}

export const prisma: PrismaClient = process.env.DATABASE_URL ? makePrisma() : makeMissingDbProxy();

if (process.env.NODE_ENV !== "production" && process.env.DATABASE_URL) globalForPrisma.prisma = prisma;
