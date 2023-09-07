import clsx from 'clsx';
import { ReactNode } from 'react';

export function TypographyLead({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p {...rest} className={clsx('text-xl text-muted-foreground', className)}>
      {children}
    </p>
  );
}
