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
    <section className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#07152C] via-[#101D35] to-[#050D1B] px-6 py-9 sm:px-10 sm:py-12 text-white border border-white/14 shadow-[var(--shadow-card)]">
      {/* Subtle stadium floodlight accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#D5A83C]/14 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -bottom-24 h-52 w-52 rounded-full bg-[#1E3F73]/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D5A83C]/60 to-transparent"
      />

      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="relative grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center"
      >
        <div className={aside ? 'lg:col-span-7 space-y-4' : 'lg:col-span-10 space-y-4'}>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs items={breadcrumbs} tone="dark" />
          )}

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D5A83C]">
            {kicker}
          </p>

          <h1 className="font-display text-3xl sm:text-5xl font-extrabold uppercase leading-[1.03] tracking-tight text-white">
            {title}
          </h1>

          <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-[#C2D0E3]">
            {description}
          </p>

          {actions && <div className="flex flex-wrap items-center gap-3 pt-2">{actions}</div>}
        </div>

        {aside && <div className="lg:col-span-5">{aside}</div>}
      </motion.div>
    </section>
  );
}
