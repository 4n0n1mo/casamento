import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { Divider } from "@/components/Divider";
import { TokenGate } from "@/components/rsvp/TokenGate";

export const dynamic = "force-dynamic";

export default function RsvpPage({ searchParams }: { searchParams?: { t?: string } }) {
  const t = searchParams?.t ? String(searchParams.t) : undefined;

  return (
    <Container>
      <div className="py-12 md:py-16">
        <SectionTitle
          eyebrow="RSVP"
          title="Confirmar presença (apenas convidados)"
          subtitle="Use o código do seu convite. O sistema mostra apenas os nomes autorizados para confirmação."
        />

        <Divider />

        <TokenGate mode="rsvp" initialToken={t} />
      </div>
    </Container>
  );
}
