import { ArrowRight } from 'lucide-react';
import { ACADEMY_BRAND } from '@/src/data/brand';
import { RevealSection } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { WhatsAppCta } from '@/src/components/ui/WhatsAppCta';

export function FinalCtaSection() {
  return (
    <RevealSection>
      <section
        aria-labelledby="final-cta-heading"
        className="relative overflow-hidden rounded-[20px] border border-white/10 bg-[#050D1B] px-6 py-10 sm:px-10 sm:py-14 text-white shadow-[0_24px_60px_-28px_rgba(5,13,27,0.85)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#D5A52B]/10 via-transparent to-transparent"
        />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D5A52B]">
              {ACADEMY_BRAND.tagline}
            </p>
            <h2
              id="final-cta-heading"
              className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white"
            >
              Join {ACADEMY_BRAND.name}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#B4C4DC]">
              Take the next step toward sharper technique, disciplined net sessions, and confident match-day execution. Explore our coaching tracks or submit your online registration application today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button to="/register" variant="primary" size="lg">
              <span>Register Now</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button to="/programs" variant="outlineLight" size="lg">
              Explore Programs
            </Button>
            <WhatsAppCta variant="inline" />
          </div>
        </div>
      </section>
    </RevealSection>
  );
}
