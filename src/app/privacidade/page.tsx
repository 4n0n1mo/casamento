import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { Divider } from "@/components/Divider";
import { Card, CardBody } from "@/components/Card";

export default function PrivacyPage() {
  return (
    <Container>
      <div className="py-12 md:py-16">
        <SectionTitle
          eyebrow="Privacidade"
          title="Dados mínimos, finalidade clara"
          subtitle="Resumo objetivo em conformidade com a LGPD."
        />

        <Divider />

        <Card>
          <CardBody className="flex flex-col gap-6 text-sm text-charcoal/80">
            <section className="flex flex-col gap-2">
              <h2 className="font-serif text-xl text-charcoal">O que coletamos</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Status de presença (vai/não vai) por convidado pré-cadastrado.</li>
                <li>Restrições alimentares (opcional) em formato simples.</li>
                <li>Registros técnicos mínimos para segurança: data/hora e hash do IP (não armazenamos IP em claro).</li>
              </ul>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-serif text-xl text-charcoal">Para que usamos</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Contagem de convidados e organização do evento.</li>
                <li>Mitigação de abuso (tentativas repetidas, automação, enumeração de códigos).</li>
              </ul>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-serif text-xl text-charcoal">Pagamentos</h2>
              <p>
                O checkout Pix é feito no ambiente do gateway. Este site não coleta dados de cartão e não exibe dados pessoais de pagamento.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-serif text-xl text-charcoal">Retenção</h2>
              <p>
                Mantemos os dados do RSVP apenas pelo período necessário para organização do evento.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="font-serif text-xl text-charcoal">Contato</h2>
              <p>
                Inclua aqui um e-mail de contato (opcional) para solicitações relacionadas a dados.
              </p>
            </section>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}
