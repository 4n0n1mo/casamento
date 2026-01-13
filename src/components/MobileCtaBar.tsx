import { LinkButton } from "@/components/LinkButton";

export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/90 backdrop-blur md:hidden">
      <div className="mx-auto max-w-5xl px-4 py-3 flex gap-3">
        <LinkButton href="/rsvp" className="flex-1 text-center" variant="secondary">
          Confirmar presença
        </LinkButton>
        <LinkButton href="/presentes" className="flex-1 text-center" variant="primary">
          Presentear
        </LinkButton>
      </div>
    </div>
  );
}
