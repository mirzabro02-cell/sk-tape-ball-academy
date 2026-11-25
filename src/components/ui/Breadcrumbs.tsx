import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/src/utils/cn';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  tone?: 'auto' | 'light' | 'dark';
  className?: string;
}

export function Breadcrumbs({ items, tone = 'dark', className }: BreadcrumbsProps) {
  const isForcedDark = tone === 'dark';
  const isForcedLight = tone === 'light';

  return (
    <nav aria-label="Breadcrumb" className={cn('flex flex-wrap items-center gap-1.5 text-xs', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight
                className={cn(
                  'h-3.5 w-3.5',
                  isForcedDark
                    ? 'text-white/45'
                    : isForcedLight
                      ? 'text-[#64748B]'
                      : 'text-[#64748B] dark:text-white/45',
                )}
                aria-hidden="true"
              />
            )}
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className={cn(
                  'font-medium transition-colors rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]',
                  isForcedDark
                    ? 'text-white/75 hover:text-[#D5A83C]'
                    : isForcedLight
                      ? 'text-[#64748B] hover:text-[#07152C]'
                      : 'text-[#64748B] hover:text-[#07152C] dark:text-white/75 dark:hover:text-[#D5A83C]',
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? 'page' : undefined}
                className={cn(
                  'font-semibold',
                  isForcedDark
                    ? 'text-[#D5A83C]'
                    : isForcedLight
                      ? 'text-[#07152C]'
                      : 'text-[#07152C] dark:text-[#D5A83C]',
                )}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
