import Link from "next/link";
import { Container } from "@/components/Container";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ivory">
      <Container>
        <div className="py-10 text-sm text-charcoal/75 flex flex-col gap-3">
          <p className="max-w-3xl">
            Este site coleta apenas o mínimo necessário para contagem de convidados (RSVP) e não exibe dados sensíveis.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/privacidade" className="underline underline-offset-4">Privacidade</Link>
            <Link href="/presentes" className="underline underline-offset-4">Presentear (Pix)</Link>
            <Link href="/rsvp" className="underline underline-offset-4">Confirmar presença</Link>
          </div>
          <p className="text-xs text-charcoal/55">
            © {new Date().getFullYear()} — Site do casamento.
          </p>
        </div>
      </Container>
    </footer>
  );
}
