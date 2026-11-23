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
  secondaryLabel = 'Book Free Trial',
  secondaryTo = '/book-trial',
}: CtaBannerProps) {
  return (
    <section className="rounded-[18px] bg-[#071A36] px-6 py-9 sm:px-10 sm:py-12 text-white border border-[#050D1B]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D9A52E]">
            {kicker}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {title}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-white/80">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button to={primaryTo} variant="primary" size="lg">
            <span>{primaryLabel}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button to={secondaryTo} variant="outlineLight" size="lg">
            {secondaryLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
