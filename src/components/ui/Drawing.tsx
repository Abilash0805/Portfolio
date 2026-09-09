import type { ReactNode } from "react";

/**
 * The section index lives in the left gutter as a drawing callout — a part
 * number on a technical drawing. Deliberately NOT a tracked-out all-caps
 * eyebrow sitting above the heading.
 */
export function GutterIndex({ n, label }: { n: string; label: string }) {
  return (
    <div className="md:col-span-1 md:sticky md:top-24 md:self-start">
      <div className="flex items-baseline gap-3 md:block">
        <span className="type-mono text-brass">{n}</span>
        <span className="type-mono block text-muted-fg md:mt-2 md:[writing-mode:vertical-rl]">
          {label}
        </span>
      </div>
    </div>
  );
}

/**
 * Datasheet rows. Hairline-ruled label/value pairs — the spec block off a
 * component datasheet, not a card with a shadow.
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
          className="rule-t grid grid-cols-[5.5rem_1fr] gap-4 py-3 sm:grid-cols-[9.5rem_1fr]"
        >
          <dt className="type-mono pt-[0.2rem] text-muted-fg">{row.label}</dt>
          <dd className="text-[0.9375rem] leading-relaxed text-current/85">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
