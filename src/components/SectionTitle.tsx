export function SectionTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col gap-3">
      {eyebrow ? (
        <div className="text-xs tracking-[0.18em] uppercase text-olive/70">{eyebrow}</div>
      ) : null}
      <h1 className="font-serif text-3xl md:text-4xl leading-tight text-charcoal">
        {title}
      </h1>
      {subtitle ? <p className="max-w-2xl text-charcoal/75">{subtitle}</p> : null}
    </div>
  );
}
