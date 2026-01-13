import { Container } from "@/components/Container";
import { SectionTitle } from "@/components/SectionTitle";
import { Divider } from "@/components/Divider";
import { Card, CardBody } from "@/components/Card";
import Link from "next/link";

export default function ThanksPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const status = Array.isArray(searchParams.status) ? searchParams.status[0] : searchParams.status;
  const paymentId = Array.isArray(searchParams.payment_id) ? searchParams.payment_id[0] : searchParams.payment_id;
  const mock = Array.isArray(searchParams.mock) ? searchParams.mock[0] : searchParams.mock;

  return (
    <Container>
      <div className="py-12 md:py-16">
        <SectionTitle
          eyebrow="Obrigado"
          title="Com carinho, muito obrigado"
          subtitle="Se você concluiu o Pix, a confirmação aparece no seu aplicativo do banco/gateway."
        />

        <Divider />

        <Card>
          <CardBody className="flex flex-col gap-3">
            <div className="text-sm text-charcoal/80">
              <p>
                {mock ? (
                  <strong>Modo demonstração:</strong>
                ) : (
                  <strong>Status:</strong>
                )}{" "}
                {status ? status : mock ? "mock" : "em processamento"}
              </p>
              {paymentId ? (
                <p className="text-xs text-charcoal/60">
                  Identificador (parcial): {String(paymentId).slice(-6)}
                </p>
              ) : null}
            </div>

            <div className="h-px bg-line" />

            <p className="text-sm text-charcoal/75 max-w-3xl">
              Este site não exibe informações sensíveis de pagamento. Caso precise de confirmação adicional,
              entre em contato com os noivos.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/presentes" className="text-sm underline underline-offset-4">
                Voltar para presentes
              </Link>
              <Link href="/" className="text-sm underline underline-offset-4">
                Voltar para home
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}
