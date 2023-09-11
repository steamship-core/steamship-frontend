import clsx from 'clsx';
import { ReactNode } from 'react';

export function TypographyH3({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & React.ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3 {...rest} className={clsx('scroll-m-20 text-2xl font-semibold tracking-tight', className)}>
      {children}
    </h3>
  );
}
