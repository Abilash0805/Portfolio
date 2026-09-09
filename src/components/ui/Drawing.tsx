import type { ReactNode } from "react";

/**
 * Spec rows. Hairline-ruled label/value pairs — a datasheet block, not a card
 * with a shadow.
 */
export function SpecTable({
  rows,
  className = "",
}: {
  rows: { label: string; value: ReactNode }[];
  className?: string;
}) {
  return (
    <dl className={`w-full ${className}`}>
      {rows.map((row) => (
        <div
          key={row.label}
          className="rule-t grid grid-cols-[5.5rem_1fr] gap-4 py-3.5 sm:grid-cols-[9rem_1fr]"
        >
          <dt className="type-mono pt-[0.2rem] text-muted">{row.label}</dt>
          <dd className="text-[0.9375rem] leading-relaxed text-fg/85">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
