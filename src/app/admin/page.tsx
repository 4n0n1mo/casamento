import { cookies } from "next/headers";
import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { Divider } from "@/components/Divider";
import { Card, CardBody } from "@/components/Card";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";
import { AdminImportForm } from "@/components/admin/AdminImportForm";
import { AdminExportButtons } from "@/components/admin/AdminExportButtons";

type AdminGuestRow = { rsvpStatus: string };
type AdminGroupRow = {
  id: string;
  label: string;
  deadline: Date;
  plusOneAllowed: boolean;
  guests: AdminGuestRow[];
};

export default async function AdminPage() {
  await requireAdmin(cookies());

  const [groups, counts] = await Promise.all([
    prisma.inviteGroup.findMany({
      orderBy: { createdAt: "desc" },
      include: { guests: true }
    }),
    prisma.guest.groupBy({
      by: ["rsvpStatus"],
      _count: { _all: true }
    })
  ]);

  const stats = {
    YES: counts.find((c) => c.rsvpStatus === "YES")?._count._all ?? 0,
    NO: counts.find((c) => c.rsvpStatus === "NO")?._count._all ?? 0,
    PENDING: counts.find((c) => c.rsvpStatus === "PENDING")?._count._all ?? 0
  };

  return (
    <Container>
      <div className="py-12 md:py-16">
        <SectionTitle
          eyebrow="Admin"
          title="Convidados e RSVP"
          subtitle="Importe lista, gere tokens/QR e acompanhe confirmações."
        />

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Confirmados" value={stats.YES} />
          <StatCard label="Não vão" value={stats.NO} />
          <StatCard label="Pendentes" value={stats.PENDING} />
        </div>

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <Card>
            <CardBody className="flex flex-col gap-3">
              <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Importar</div>
              <h3 className="font-serif text-2xl text-charcoal">CSV de convidados</h3>
              <p className="text-sm text-charcoal/75">
                O CSV cria grupos e convidados, gera tokens e mantém o RSVP fechado.
              </p>
              <AdminImportForm />
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-col gap-3">
              <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Exportar</div>
              <h3 className="font-serif text-2xl text-charcoal">Planilhas</h3>
              <p className="text-sm text-charcoal/75">
                Exporte tokens (para convite/QR) e status de RSVP.
              </p>
              <AdminExportButtons />
            </CardBody>
          </Card>
        </div>

        <Divider />

        <Card>
          <CardBody className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-serif text-2xl text-charcoal">Grupos</h3>
              <Link href="/api/admin/logout" className="text-sm underline underline-offset-4 text-charcoal/80">
                Sair
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-charcoal/70">
                  <tr className="border-b border-line">
                    <th className="py-2 pr-3">Grupo</th>
                    <th className="py-2 pr-3">Deadline</th>
                    <th className="py-2 pr-3">Convidados</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((g: AdminGroupRow) => {
                    const yes = g.guests.filter((x: AdminGuestRow) => x.rsvpStatus === "YES").length;
                    const no = g.guests.filter((x: AdminGuestRow) => x.rsvpStatus === "NO").length;
                    const pending = g.guests.filter((x: AdminGuestRow) => x.rsvpStatus === "PENDING").length;
                    return (
                      <tr key={g.id} className="border-b border-line/70">
                        <td className="py-3 pr-3">
                          <div className="font-medium text-charcoal">{g.label}</div>
                          <div className="text-xs text-charcoal/60">{g.plusOneAllowed ? "Plus-one: sim" : "Plus-one: não"}</div>
                        </td>
                        <td className="py-3 pr-3 text-charcoal/80">
                          {g.deadline.toISOString().slice(0, 10)}
                        </td>
                        <td className="py-3 pr-3 text-charcoal/80">{g.guests.length}</td>
                        <td className="py-3 pr-3 text-xs text-charcoal/70">
                          <span className="mr-2">YES {yes}</span>
                          <span className="mr-2">NO {no}</span>
                          <span>PENDING {pending}</span>
                        </td>
                        <td className="py-3 pr-3">
                          <Link
                            href={`/admin/grupos/${g.id}`}
                            className="text-sm underline underline-offset-4 text-charcoal/80"
                          >
                            Ver / QR
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line bg-ivory shadow-soft p-5">
      <div className="text-xs tracking-[0.18em] uppercase text-olive/70">{label}</div>
      <div className="mt-2 font-serif text-3xl text-charcoal">{value}</div>
    </div>
  );
}
