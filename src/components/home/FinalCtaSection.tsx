import { ArrowRight } from 'lucide-react';
import { ACADEMY_BRAND } from '@/src/data/brand';
import { Button } from '@/src/components/ui/Button';
import { WhatsAppCta } from '@/src/components/ui/WhatsAppCta';

export function FinalCtaSection() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="rounded-[18px] bg-[#071A36] px-6 py-10 sm:px-10 sm:py-14 text-white border border-[#050D1B]"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#D9A52E]">
            {ACADEMY_BRAND.tagline}
          </p>
          <h2
            id="final-cta-heading"
            className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white"
          >
            Join {ACADEMY_BRAND.name}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-white/80">
            Take the next step toward sharper technique, disciplined net sessions, and confident match-day execution. Start with a free trial assessment or submit a registration inquiry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button to="/register" variant="primary" size="lg">
            <span>Register Now</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button to="/book-trial" variant="outlineLight" size="lg">
            Book Free Trial
          </Button>
          <WhatsAppCta variant="inline" />
        </div>
      </div>
    </section>
  );
}
