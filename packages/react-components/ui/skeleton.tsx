import { cn } from "../lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "steamship-animate-pulse steamship-rounded-md steamship-bg-muted",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
