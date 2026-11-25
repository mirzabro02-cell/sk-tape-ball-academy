import type { ReactNode } from 'react';
import { cn } from '@/src/utils/cn';

export interface SectionHeaderProps {
  id?: string;
  kicker?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'auto' | 'light' | 'dark';
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  id,
  kicker,
  title,
  description,
  align = 'left',
  tone = 'auto',
  action,
  className,
}: SectionHeaderProps) {
  const isForcedDark = tone === 'dark';
  const isForcedLight = tone === 'light';

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
              'text-xs font-bold tracking-[0.16em] uppercase',
              isForcedDark
                ? 'text-[#D5A52B]'
                : isForcedLight
                  ? 'text-[#1E3F73]'
                  : 'text-[#1E3F73] dark:text-[#D5A52B]',
            )}
          >
            {kicker}
          </p>
        )}
        <h2
          id={id}
          className={cn(
            'text-2xl sm:text-3xl font-extrabold tracking-tight',
            isForcedDark
              ? 'text-white'
              : isForcedLight
                ? 'text-[#07152C]'
                : 'text-[#07152C] dark:text-white',
          )}
        >
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              'text-sm sm:text-base leading-relaxed',
              isForcedDark
                ? 'text-[#B4C4DC]'
                : isForcedLight
                  ? 'text-[#475569]'
                  : 'text-[#475569] dark:text-[#B4C4DC]',
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
