import Link from "next/link";
import { Container } from "@/components/Container";
import { Monogram } from "@/components/Monogram";
import { site } from "@/lib/site";

const nav = [
  { href: "/o-casamento", label: "O Casamento" },
  { href: "/informacoes", label: "Informações" },
  { href: "/presentes", label: "Presentes (Pix)" },
  { href: "/rsvp", label: "Confirmar Presença" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ivory/80 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-charcoal">
              <Monogram className="h-10 w-10" />
            </div>
            <div className="hidden sm:block">
              <div className="font-serif text-base tracking-wide text-charcoal">
                {site.couple.a} &amp; {site.couple.b}
              </div>
              <div className="text-xs text-charcoal/70">{site.dateShort}</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-charcoal/80">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-charcoal transition duration-200">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="md:hidden text-xs text-charcoal/70">
            <Link href="/rsvp" className="underline underline-offset-4">RSVP</Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
