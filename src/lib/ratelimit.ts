import { prisma } from "@/lib/db";

type RateLimitResult = { allowed: boolean; captchaRequired: boolean };

export async function checkRsvpRateLimit(params: {
  ipHash: string;
  groupId?: string;
  now?: Date;
}) : Promise<RateLimitResult> {
  const now = params.now ?? new Date();

  // janela curta: 10 min (falhas por IP)
  const tenMinAgo = new Date(now.getTime() - 10 * 60 * 1000);

  const failuresByIp = await prisma.rSVPAttempt.count({
    where: {
      ipHash: params.ipHash,
      success: false,
      createdAt: { gte: tenMinAgo }
    }
  });

  // bloqueio leve após muitas falhas
  if (failuresByIp >= 12) return { allowed: false, captchaRequired: true };
  if (failuresByIp >= 6) return { allowed: true, captchaRequired: true };

  // janela: 30 min (falhas por grupo) – só se groupId conhecido
  if (params.groupId) {
    const thirtyMinAgo = new Date(now.getTime() - 30 * 60 * 1000);
    const failuresByGroup = await prisma.rSVPAttempt.count({
      where: {
        groupId: params.groupId,
        success: false,
        createdAt: { gte: thirtyMinAgo }
      }
    });
    if (failuresByGroup >= 10) return { allowed: false, captchaRequired: true };
    if (failuresByGroup >= 4) return { allowed: true, captchaRequired: true };
  }

  return { allowed: true, captchaRequired: false };
}

export async function logRsvpAttempt(params: {
  ipHash: string;
  success: boolean;
  groupId?: string;
}) {
  await prisma.rSVPAttempt.create({
    data: {
      ipHash: params.ipHash,
      success: params.success,
      groupId: params.groupId
    }
  });
}
