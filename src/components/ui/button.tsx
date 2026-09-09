"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[background-color,border-color,color,box-shadow] duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent cursor-pointer [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // The one primary action: a lit control on a dark ground.
        default:
          "bg-accent text-on-accent shadow-[0_0_0_1px_var(--color-accent),0_8px_30px_-6px_color-mix(in_oklab,var(--color-accent)_60%,transparent)] hover:shadow-[0_0_0_1px_var(--color-accent),0_10px_44px_-4px_color-mix(in_oklab,var(--color-accent)_75%,transparent)]",
        // Glass: sits on the field without blocking it out.
        glass:
          "border border-hairline bg-white/[0.04] text-fg backdrop-blur-md hover:border-accent/50 hover:bg-white/[0.07]",
        ghost: "text-muted hover:text-fg",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-[0.8125rem]",
        lg: "h-14 px-8 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
