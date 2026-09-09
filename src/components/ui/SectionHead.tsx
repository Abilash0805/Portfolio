import { Separator } from "@/components/ui/separator";

/**
 * Every chapter opens the same way: a part number, a name, then a rule that
 * carries the scroll charge. Consistent enough to be structure, not decoration.
 */
export function SectionHead({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <span className="type-mono text-signal">{index}</span>
        <span className="type-mono text-muted">{label}</span>
      </div>
      <Separator className="mt-5" />
    </div>
  );
}
