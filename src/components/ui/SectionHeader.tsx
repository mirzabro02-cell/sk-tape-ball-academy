import type { ReactNode } from 'react';
import { cn } from '@/src/utils/cn';

export interface SectionHeaderProps {
  id?: string;
  kicker?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  id,
  kicker,
  title,
  description,
  align = 'left',
  tone = 'light',
  action,
  className,
}: SectionHeaderProps) {
  const isDark = tone === 'dark';

  return (
    <div
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl space-y-2', align === 'center' && 'mx-auto')}>
        {kicker && (
          <p
            className={cn(
              'text-xs font-semibold tracking-wider uppercase',
              isDark ? 'text-[#D9A52E]' : 'text-[#C8202B]',
            )}
          >
            {kicker}
          </p>
        )}
        <h2
          id={id}
          className={cn(
            'text-2xl sm:text-3xl font-bold tracking-tight',
            isDark ? 'text-white' : 'text-[#071A36]',
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              'text-sm sm:text-base leading-relaxed',
              isDark ? 'text-white/75' : 'text-[#64748B]',
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
