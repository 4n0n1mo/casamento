import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { Divider } from "@/components/Divider";
import { GiftCard } from "@/components/GiftCard";
import { GiftCheckout } from "@/components/presents/GiftCheckout";
import { site } from "@/lib/site";

export default function GiftsPage() {
  return (
    <Container>
      <div className="py-12 md:py-16">
        <SectionTitle
          eyebrow="Presentes"
          title="Presentes simbólicos — Pix no checkout"
          subtitle={site.pixCopy}
        />

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {site.gifts.map((g) => (
            <GiftCard key={g.title} title={g.title} note={g.note} valueCents={g.value} />
          ))}
        </div>

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <GiftCheckout />
          <div className="rounded-xl border border-line bg-ivory shadow-soft p-6">
            <div className="text-xs tracking-[0.18em] uppercase text-olive/70">Transparência</div>
            <h3 className="mt-2 font-serif text-2xl text-charcoal">Como funciona</h3>
            <ul className="mt-4 text-sm text-charcoal/80 list-disc pl-5 space-y-2">
              <li>Os itens acima são apenas exemplos de “presentes”.</li>
              <li>O presente real é um valor em dinheiro via Pix pelo gateway.</li>
              <li>Você pode escolher um valor sugerido ou digitar um valor livre.</li>
              <li>Ao concluir, você retorna para uma página de agradecimento.</li>
            </ul>
            <p className="mt-4 text-xs text-charcoal/60">
              Não armazenamos dados sensíveis de pagamento; o provedor é responsável pelo checkout.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
