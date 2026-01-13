import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { Divider } from "@/components/Divider";
import { TokenGate } from "@/components/rsvp/TokenGate";

export default function RsvpPage() {
  return (
    <Container>
      <div className="py-12 md:py-16">
        <SectionTitle
          eyebrow="RSVP"
          title="Confirmar presença (apenas convidados)"
          subtitle="Use o código do seu convite. O sistema mostra apenas os nomes autorizados para confirmação."
        />

        <Divider />

        <TokenGate mode="rsvp" />
      </div>
    </Container>
  );
}
