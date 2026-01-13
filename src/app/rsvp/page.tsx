import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { Divider } from "@/components/Divider";
import { TokenGate } from "@/components/rsvp/TokenGate";
import { Suspense } from "react";

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

        <Suspense fallback={<div className="mt-10 text-sm text-charcoal/60">Carregando…</div>}><TokenGate mode="rsvp" /></Suspense>
      </div>
    </Container>
  );
}
