import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { Divider } from "@/components/Divider";
import { Card, CardBody } from "@/components/Card";
import { site } from "@/lib/site";

export default function WeddingPage() {
  return (
    <Container>
      <div className="py-12 md:py-16">
        <SectionTitle
          eyebrow="O Casamento"
          title="Uma celebração direta e elegante"
          subtitle="Poucas informações, com intenção. O essencial para viver o dia com leveza."
        />

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardBody>
              <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Data</div>
              <div className="mt-2 font-serif text-xl text-charcoal">{site.dateLong}</div>
              <div className="mt-1 text-sm text-charcoal/75">{site.city}</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Horários</div>
              <div className="mt-2 text-sm text-charcoal/80">
                <p><strong>Cerimônia</strong> — {site.ceremonyTime}</p>
                <p><strong>Recepção</strong> — {site.receptionTime}</p>
              </div>
              <p className="mt-2 text-xs text-charcoal/60">Chegue com 15 min de antecedência.</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Traje</div>
              <div className="mt-2 font-serif text-xl text-charcoal">{site.dressCode}</div>
              <p className="mt-2 text-sm text-charcoal/75">
                Tons neutros e terrosos combinam com a proposta (opcional).
              </p>
            </CardBody>
          </Card>
        </div>

        <Divider />

        <Card>
          <CardBody className="flex flex-col gap-3">
            <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Nota</div>
            <p className="text-sm text-charcoal/80 max-w-3xl">
              Se precisar de algo específico (acessibilidade, restrição alimentar importante, logística),
              use o RSVP para registrar. Para dúvidas adicionais, inclua um contato no rodapé (opcional).
            </p>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}
