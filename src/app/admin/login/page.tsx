import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { Divider } from "@/components/Divider";
import { Card, CardBody } from "@/components/Card";

export default function AdminLoginPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const e = Array.isArray(searchParams.e) ? searchParams.e[0] : searchParams.e;
  return (
    <Container>
      <div className="py-12 md:py-16">
        <SectionTitle eyebrow="Admin" title="Acesso" subtitle="Área restrita para gestão de convidados e RSVP." />
        <Divider />
        <Card>
          <CardBody className="flex flex-col gap-4">
            {e ? (
              <div className="rounded-xl border border-line bg-terracotta/10 p-4 text-sm text-terracotta">
                Senha inválida.
              </div>
            ) : null}
            <form action="/api/admin/login" method="post" className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm text-charcoal/80">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                className="w-full rounded-xl border border-line bg-white/60 px-4 py-3 text-sm outline-none transition duration-200 focus:border-gold/70 focus:ring-2 focus:ring-gold/20"
                placeholder="••••••••"
              />
              <button className="mt-3 rounded-xl bg-charcoal px-5 py-3 text-sm font-medium text-ivory transition duration-200 hover:shadow-card">
                Entrar
              </button>
            </form>
            <p className="text-xs text-charcoal/60">
              Defina <code>ADMIN_PASSWORD</code> no ambiente.
            </p>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}
