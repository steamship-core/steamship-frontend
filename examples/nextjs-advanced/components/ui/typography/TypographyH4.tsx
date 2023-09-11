import clsx from 'clsx';
import { ReactNode } from 'react';

export function TypographyH4({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<'h4'>) {
  return (
    <h4 {...rest} className={clsx('scroll-m-20 text-xl font-semibold tracking-tight', className)}>
      {children}
    </h4>
  );
}
