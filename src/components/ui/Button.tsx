"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-40 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-accent text-white hover:bg-accent/90",
        secondary: "bg-white border border-border text-text-primary hover:border-text-tertiary",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-hover",
      },
      size: {
        sm: "text-xs rounded-lg px-3 py-1.5",
        md: "text-sm rounded-lg px-4 py-2",
        lg: "text-sm rounded-lg px-5 py-2.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
