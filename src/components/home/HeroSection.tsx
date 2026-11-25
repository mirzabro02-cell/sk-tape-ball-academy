import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { HERO_CONTENT } from '@/src/data/homeContent';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { Button } from '@/src/components/ui/Button';
import { MediaImage } from '@/src/components/ui/MediaImage';

export function HeroSection() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden rounded-[18px] bg-[#050D1B] text-white border border-[#071A36]"
    >
      <div className="absolute inset-0">
        <MediaImage
          src={HERO_CONTENT.imageSrc}
          alt={HERO_CONTENT.imageAlt}
          fallbackLabel="SK Tape Ball Academy Floodlit Ground"
          priority
          className="h-full w-full"
          imgClassName="h-full w-full object-cover object-center opacity-60"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#050D1B] via-[#050D1B]/90 to-[#071A36]/55"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#050D1B] via-transparent to-[#050D1B]/40"
        />
      </div>

      <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl space-y-6"
        >
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[#D9A52E]">
            {HERO_CONTENT.tagline}
          </p>

          <h1 className="text-[2rem] sm:text-[2.75rem] lg:text-[3.35rem] font-extrabold leading-[1.08] tracking-tight text-white">
            {HERO_CONTENT.headline}
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-white/85 max-w-xl">
            {HERO_CONTENT.supportingText}
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Button to={HERO_CONTENT.primaryCta.to} variant="primary" size="lg">
              <span>{HERO_CONTENT.primaryCta.label}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button to={HERO_CONTENT.secondaryCta.to} variant="outlineLight" size="lg">
              {HERO_CONTENT.secondaryCta.label}
            </Button>
          </div>
        </motion.div>

        <div className="mt-10 border-t border-white/15 pt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-white/75">
          <span className="text-[#D9A52E] font-semibold">Core Focus</span>
          <span aria-hidden="true">·</span>
          <span>Batting &amp; Power Hitting</span>
          <span aria-hidden="true">·</span>
          <span>Fast &amp; Spin Bowling</span>
          <span aria-hidden="true">·</span>
          <span>Fielding &amp; Keeping</span>
          <span aria-hidden="true">·</span>
          <span>Athletic Conditioning</span>
        </div>
      </div>
    </section>
  );
}
