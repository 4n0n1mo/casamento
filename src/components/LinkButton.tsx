import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function LinkButton({ href, children, variant = "primary", className }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60";
  const styles = {
    primary:
      "bg-terracotta text-ivory hover:translate-y-[-1px] hover:shadow-card active:translate-y-[0px]",
    secondary:
      "bg-charcoal text-ivory hover:translate-y-[-1px] hover:shadow-card active:translate-y-[0px]",
    ghost:
      "bg-transparent text-charcoal hover:bg-charcoal/5"
  }[variant];

  return (
    <Link href={href} className={cn(base, styles, className)}>
      {children}
    </Link>
  );
}
