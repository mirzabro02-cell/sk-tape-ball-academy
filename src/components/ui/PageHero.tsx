import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';

export interface PageHeroProps {
  breadcrumbs?: BreadcrumbItem[];
  kicker: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
}

export function PageHero({
  breadcrumbs,
  kicker,
  title,
  description,
  actions,
  aside,
}: PageHeroProps) {
  const prefersReduced = useReducedMotion();

  return (
    <section className="rounded-[18px] bg-[#071A36] px-6 py-9 sm:px-10 sm:py-12 text-white border border-[#050D1B]">
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center"
      >
        <div className={aside ? 'lg:col-span-7 space-y-4' : 'lg:col-span-10 space-y-4'}>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} tone="dark" />
          )}

          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D9A52E]">
            {kicker}
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.12] tracking-tight text-white">
            {title}
          </h1>

          <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-white/80">
            {description}
          </p>

          {actions && <div className="flex flex-wrap items-center gap-3 pt-2">{actions}</div>}
        </div>

        {aside && <div className="lg:col-span-5">{aside}</div>}
      </motion.div>
    </section>
  );
}
