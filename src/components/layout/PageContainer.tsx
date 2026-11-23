import type { ReactNode } from 'react';
import { cn } from '@/src/utils/cn';

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section';
}

export function PageContainer({
  children,
  className,
  as: Component = 'div',
}: PageContainerProps) {
  return (
    <Component
      className={cn('mx-auto w-full max-w-[1260px] px-4 sm:px-6 lg:px-8', className)}
    >
      {children}
    </Component>
  );
}
