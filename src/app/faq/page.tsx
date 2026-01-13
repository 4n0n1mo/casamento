import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { Divider } from "@/components/Divider";
import { Card, CardBody } from "@/components/Card";
import { site } from "@/lib/site";

export default function FaqPage() {
  return (
    <Container>
      <div className="py-12 md:py-16">
        <SectionTitle
          eyebrow="FAQ"
          title="Perguntas rápidas"
          subtitle="Poucas respostas, claras."
        />

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {site.faq.map((f) => (
            <Card key={f.q}>
              <CardBody className="flex flex-col gap-2">
                <div className="font-serif text-xl text-charcoal">{f.q}</div>
                <p className="text-sm text-charcoal/75">{f.a}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
