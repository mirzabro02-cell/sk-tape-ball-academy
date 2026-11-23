import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/src/utils/cn';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  tone?: 'light' | 'dark';
  className?: string;
}

export function Breadcrumbs({ items, tone = 'dark', className }: BreadcrumbsProps) {
  const isDark = tone === 'dark';

  return (
    <nav aria-label="Breadcrumb" className={cn('flex flex-wrap items-center gap-1.5 text-xs', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight
                className={cn('h-3.5 w-3.5', isDark ? 'text-white/45' : 'text-[#64748B]')}
                aria-hidden="true"
              />
            )}
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className={cn(
                  'font-medium transition-colors',
                  isDark
                    ? 'text-white/75 hover:text-[#D9A52E]'
                    : 'text-[#64748B] hover:text-[#071A36]',
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={isLast ? 'page' : undefined}
                className={cn(
                  'font-semibold',
                  isDark ? 'text-[#D9A52E]' : 'text-[#071A36]',
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
