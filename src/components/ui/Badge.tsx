"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-medium rounded-full",
  {
    variants: {
      variant: {
        confirmed: "text-confirmed bg-confirmed-bg",
        pending: "text-pending bg-pending-bg",
        alert: "text-alert bg-alert-bg",
        info: "text-info bg-info-bg",
        neutral: "text-text-secondary bg-muted",
      },
      size: {
        sm: "text-[10px] px-1.5 py-0.5",
        md: "text-[11px] px-2 py-0.5",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, size, children, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)}>
      {children}
    </span>
  );
}
