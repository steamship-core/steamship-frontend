import clsx from 'clsx';
import { ReactNode } from 'react';

export function TypographyMuted({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p {...rest} className={clsx('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  );
}
