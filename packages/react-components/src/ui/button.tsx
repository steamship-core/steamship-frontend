import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "steamship-inline-flex steamship-items-center steamship-justify-center steamship-rounded-md steamship-text-sm steamship-font-medium steamship-ring-offset-background steamship-transition-colors focus-visible:steamship-outline-none focus-visible:steamship-ring-2 focus-visible:steamship-ring-ring focus-visible:steamship-ring-offset-2 disabled:steamship-pointer-events-none disabled:steamship-opacity-50",
  {
    variants: {
      variant: {
        default:
          "steamship-bg-primary steamship-text-primary-foreground hover:steamship-bg-primary/90",
        destructive:
          "steamship-bg-destructive steamship-text-destructive-foreground hover:steamship-bg-destructive/90",
        outline:
          "steamship-border steamship-border-input steamship-bg-background hover:steamship-bg-accent hover:steamship-text-accent-foreground",
        secondary:
          "steamship-bg-secondary steamship-text-secondary-foreground hover:steamship-bg-secondary/80",
        ghost:
          "hover:steamship-bg-accent hover:steamship-text-accent-foreground",
        link: "steamship-text-primary steamship-underline-offset-4 hover:steamship-underline",
      },
      size: {
        default: "steamship-h-10 steamship-px-4 steamship-py-2",
        sm: "steamship-h-9 steamship-rounded-md steamship-px-3",
        lg: "steamship-h-11 steamship-rounded-md steamship-px-8",
        icon: "steamship-h-10 steamship-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
