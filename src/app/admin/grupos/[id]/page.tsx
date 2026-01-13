import { cookies } from "next/headers";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { Divider } from "@/components/Divider";
import { Card, CardBody } from "@/components/Card";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";
import { AdminQrBlock } from "@/components/admin/AdminQrBlock";
type GuestRow = { id: string; fullName: string; rsvpStatus: string };

export default async function GroupPage({ params }: { params: { id: string } }) {
  await requireAdmin(cookies());

  const group = await prisma.inviteGroup.findUnique({
    where: { id: params.id },
    include: { guests: true }
  });

  if (!group) {
    return (
      <Container>
        <div className="py-12 md:py-16">
          <SectionTitle eyebrow="Admin" title="Grupo não encontrado" />
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-12 md:py-16">
        <SectionTitle
          eyebrow="Admin"
          title={group.label}
          subtitle="Veja QR code e lista de convidados (tokens não ficam em texto no banco)."
        />

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <AdminQrBlock groupId={group.id} />

          <Card>
            <CardBody>
              <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Convidados</div>
              <ul className="mt-3 space-y-2 text-sm text-charcoal/80">
                {group.guests.map((g: GuestRow) => (
                  <li key={g.id} className="flex items-center justify-between gap-3">
                    <span>{g.fullName}</span>
                    <span className="text-xs text-charcoal/60">{g.rsvpStatus}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Link href="/admin" className="text-sm underline underline-offset-4 text-charcoal/80">
                  Voltar
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Container>
  );
}
