import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 disabled:opacity-50 disabled:pointer-events-none";
  const styles = {
    primary:
      "bg-terracotta text-ivory hover:translate-y-[-1px] hover:shadow-card active:translate-y-[0px]",
    secondary:
      "bg-charcoal text-ivory hover:translate-y-[-1px] hover:shadow-card active:translate-y-[0px]",
    ghost:
      "bg-transparent text-charcoal hover:bg-charcoal/5"
  }[variant];

  return <button className={cn(base, styles, className)} {...props} />;
}
