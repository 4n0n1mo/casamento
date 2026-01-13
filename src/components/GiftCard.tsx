import { Card, CardBody } from "@/components/Card";
import { formatCentsBRL } from "@/lib/utils";

export function GiftCard({
  title,
  note,
  valueCents
}: {
  title: string;
  note: string;
  valueCents: number;
}) {
  return (
    <Card className="transition duration-200 hover:shadow-card hover:-translate-y-0.5">
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-serif text-xl text-charcoal">{title}</h3>
          <div className="text-sm font-medium text-olive">{formatCentsBRL(valueCents)}</div>
        </div>
        <p className="text-sm text-charcoal/75">{note}</p>
        <div className="h-px bg-line my-1" />
        <p className="text-xs text-charcoal/60">
          Presente simbólico. O presente real será via Pix no checkout.
        </p>
      </CardBody>
    </Card>
  );
}
