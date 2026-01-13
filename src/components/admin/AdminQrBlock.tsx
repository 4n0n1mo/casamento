import { prisma } from "@/lib/db";
import { Card, CardBody } from "@/components/Card";
import { adminGetGroupToken } from "@/lib/adminTokens";
import { AdminRegenerateTokenButton } from "@/components/admin/AdminRegenerateTokenButton";
import Image from "next/image";

export async function AdminQrBlock({ groupId }: { groupId: string }) {
  const group = await prisma.inviteGroup.findUnique({ where: { id: groupId } });
  const result = await adminGetGroupToken(groupId);

  if (!result.ok) {
    return (
      <Card>
        <CardBody className="flex flex-col gap-3">
          <div className="text-xs tracking-[0.18em] uppercase text-olive/70">QR Code</div>
          <p className="text-sm text-terracotta">
            Não foi possível ler o token. Verifique TOKEN_ENC_KEY e NEXT_PUBLIC_SITE_URL.
          </p>
          <AdminRegenerateTokenButton groupId={groupId} />
        </CardBody>
      </Card>
    );
  }

  const { token, qrDataUrl, rsvpUrl } = result;

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div>
          <div className="text-xs tracking-[0.18em] uppercase text-olive/70">QR Code</div>
          <h3 className="font-serif text-2xl text-charcoal">Link protegido</h3>
          <p className="mt-2 text-sm text-charcoal/75">
            Imprima o QR no convite ou envie o link abaixo. O token é armazenado criptografado.
          </p>
        </div>

        <div className="rounded-xl border border-line bg-white/35 p-4">
          <div className="text-xs text-charcoal/60">TOKEN</div>
          <div className="mt-1 font-mono text-sm break-all text-charcoal">{token}</div>

          <div className="mt-4 text-xs text-charcoal/60">URL RSVP</div>
          <div className="mt-1 text-sm break-all text-charcoal/80">{rsvpUrl}</div>
        </div>

        <div className="rounded-xl border border-line bg-white/35 p-4">
          <div className="relative w-full aspect-square max-w-[240px]">
            <Image src={qrDataUrl} alt="QR Code RSVP" fill className="object-contain" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs text-charcoal/60">
            Grupo: <strong>{group?.label}</strong>
          </p>
          <AdminRegenerateTokenButton groupId={groupId} />
          <p className="text-xs text-charcoal/55">
            Regenerar invalida o token antigo (QR/link antigos param de funcionar).
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
