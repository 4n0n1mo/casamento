import Link from "next/link";
import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { Divider } from "@/components/Divider";
import { Card, CardBody } from "@/components/Card";
import { TokenGate } from "@/components/rsvp/TokenGate";
import { site } from "@/lib/site";

export default function InfoPage() {
  return (
    <Container>
      <div className="py-12 md:py-16">
        <SectionTitle
          eyebrow="Informações"
          title="Tudo o que você precisa, sem ruído"
          subtitle="Região, horários e orientações. O endereço completo é protegido para convidados."
        />

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardBody className="flex flex-col gap-3">
              <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Local</div>
              <div className="font-serif text-xl text-charcoal">{site.locationPublic}</div>
              <p className="text-sm text-charcoal/75">
                Para chegar com tranquilidade, sugerimos considerar trânsito e estacionamento.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={site.mapLink}
                  target="_blank"
                  className="text-sm underline underline-offset-4 text-charcoal/80"
                >
                  Abrir no mapa
                </Link>
                <Link
                  href="#endereco"
                  className="text-sm underline underline-offset-4 text-charcoal/80"
                >
                  Ver endereço completo (convidados)
                </Link>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-col gap-3">
              <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Horários</div>
              <p className="text-sm text-charcoal/80">
                <strong>Cerimônia</strong> — {site.ceremonyTime}<br />
                <strong>Recepção</strong> — {site.receptionTime}
              </p>
              <div className="h-px bg-line" />
              <p className="text-sm text-charcoal/75">
                <strong>Estacionamento</strong>: região com opções próximas.<br />
                <strong>Como chegar</strong>: priorize apps de rota no dia.
              </p>
            </CardBody>
          </Card>
        </div>

        <Divider />

        <div id="endereco" className="scroll-mt-24">
          <div className="mb-5">
            <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Convidados</div>
            <h2 className="font-serif text-2xl text-charcoal">Endereço completo (protegido)</h2>
            <p className="mt-2 text-sm text-charcoal/75 max-w-2xl">
              Para evitar exposição pública, o endereço completo aparece apenas após validação do código do convite.
            </p>
          </div>
          <TokenGate mode="address" />
        </div>

        <Divider />

        <Card>
          <CardBody className="flex flex-col gap-2">
            <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Dica</div>
            <p className="text-sm text-charcoal/80">
              Se você preferir, adicione aqui um contato de apoio (cerimonial/organização) para dúvidas de última hora.
            </p>
            <p className="text-xs text-charcoal/60">
              Ex.: “Dúvidas no dia: (11) 99999-9999”.
            </p>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}
