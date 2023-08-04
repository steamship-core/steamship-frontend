import * as React from "react";

import { cn } from "../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "steamship-flex steamship-h-10 steamship-w-full steamship-rounded-md steamship-border steamship-border-input steamship-bg-background steamship-px-3 steamship-py-2 steamship-text-sm steamship-ring-offset-background file:steamship-border-0 file:steamship-bg-transparent file:steamship-text-sm file:steamship-font-medium placeholder:steamship-text-muted-foreground focus-visible:steamship-outline-none focus-visible:steamship-ring-2 focus-visible:steamship-ring-ring focus-visible:steamship-ring-offset-2 disabled:steamship-cursor-not-allowed disabled:steamship-opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
