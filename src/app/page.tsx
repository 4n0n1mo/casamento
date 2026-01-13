import Image from "next/image";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/LinkButton";
import { Monogram } from "@/components/Monogram";
import { Divider } from "@/components/Divider";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { Card, CardBody } from "@/components/Card";
import { site } from "@/lib/site";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(184,155,94,0.20),transparent_40%),radial-gradient(circle_at_80%_40%,rgba(176,90,60,0.18),transparent_45%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(246,241,232,0.95),rgba(246,241,232,1))]" />
        </div>

        <Container>
          <div className="relative py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="text-charcoal">
                    <Monogram className="h-16 w-16" />
                  </div>
                  <div>
                    <div className="text-xs tracking-[0.18em] uppercase text-olive/70">
                      {site.city}
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl leading-tight text-charcoal">
                      {site.couple.a} <span className="text-gold">&amp;</span> {site.couple.b}
                    </h1>
                    <p className="mt-1 text-sm text-charcoal/75">{site.dateLong}</p>
                  </div>
                </div>

                <p className="max-w-xl text-base md:text-lg text-charcoal/80">
                  {site.tagline}
                </p>

                <div className="flex flex-wrap gap-3">
                  <LinkButton href="/rsvp" variant="secondary">
                    Confirmar presença
                  </LinkButton>
                  <LinkButton href="/presentes" variant="primary">
                    Presentear via Pix
                  </LinkButton>
                  <LinkButton href="/informacoes" variant="ghost">
                    Ver informações
                  </LinkButton>
                </div>

                <p className="text-xs text-charcoal/60">{site.rsvpDeadlineCopy}</p>
              </div>

              <div className="md:col-span-5">
                <Card className="overflow-hidden">
                  <div className="relative h-64 md:h-80">
                    {/* Opcional: substitua por /public/hero.jpg (foto do casal).
                        Se não existir, um fundo suave mantém o visual. */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(47,58,46,0.08),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(176,90,60,0.10),transparent_55%)]" />
                    <Image
                      src="/hero.jpg"
                      alt="Foto do casal (opcional)"
                      fill
                      className="object-cover opacity-90"
                      priority
                      sizes="(max-width: 768px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(246,241,232,0.10),rgba(246,241,232,0.75))]" />
                  </div>
                  <CardBody className="flex flex-col gap-2">
                    <div className="text-xs tracking-[0.18em] uppercase text-olive/70">
                      Um convite
                    </div>
                    <p className="text-sm text-charcoal/75">
                      Poucos detalhes, bem escolhidos. Aqui você confirma presença e encontra informações essenciais.
                    </p>
                  </CardBody>
                </Card>
              </div>
            </div>

            <Divider />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoPill title="RSVP fechado" desc="Apenas convidados com código conseguem confirmar." />
              <InfoPill title="Presentes via Pix" desc="Cards simbólicos e checkout seguro no gateway." />
              <InfoPill title="Informações breves" desc="Horários, região e orientações de chegada." />
            </div>
          </div>
        </Container>
      </section>

      <MobileCtaBar />
    </div>
  );
}

function InfoPill({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-line bg-ivory shadow-soft p-5 transition duration-200 hover:shadow-card hover:-translate-y-0.5">
      <div className="font-serif text-lg text-charcoal">{title}</div>
      <p className="mt-2 text-sm text-charcoal/75">{desc}</p>
    </div>
  );
}
