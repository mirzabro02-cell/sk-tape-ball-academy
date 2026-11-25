import { ArrowRight } from 'lucide-react';
import { ACADEMY_BRAND } from '@/src/data/brand';
import { Button } from './Button';

export interface CtaBannerProps {
  kicker?: string;
  title: string;
  description: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
}

export function CtaBanner({
  kicker = ACADEMY_BRAND.tagline,
  title,
  description,
  primaryLabel = 'Register Now',
  primaryTo = '/register',
  secondaryLabel = 'Explore Programs',
  secondaryTo = '/programs',
}: CtaBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#0F213B] via-[#07152C] to-[#050D1B] px-6 py-9 sm:px-10 sm:py-12 text-white border border-white/14 shadow-[var(--shadow-card)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-[#D5A52B]/14 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D5A52B]/45 to-transparent"
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D5A52B]">
            {kicker}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {title}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-[#C2D0E3]">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            to={primaryTo}
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          >
            {primaryLabel}
          </Button>
          <Button to={secondaryTo} variant="outlineLight" size="lg">
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
