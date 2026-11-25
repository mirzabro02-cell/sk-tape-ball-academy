import { ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { HERO_CONTENT } from '@/src/data/homeContent';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { Button } from '@/src/components/ui/Button';
import { MediaImage } from '@/src/components/ui/MediaImage';

export function HeroSection() {
  const prefersReduced = useReducedMotion();
  const { state } = useAcademyState();
  const heroSection = state.websiteSections.find((s) => s.id === 'hero');

  const headline = heroSection?.headline || HERO_CONTENT.headline;
  const tagline = state.siteSettings.tagline || HERO_CONTENT.tagline;
  const supportingText = heroSection?.bodyNotes || HERO_CONTENT.supportingText;
  const primaryCtaLabel = heroSection?.ctaLabel || HERO_CONTENT.primaryCta.label;
  const heroSrc = state.siteSettings.heroMedia.src || HERO_CONTENT.imageSrc;

  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden rounded-[18px] bg-[#050D1B] text-white border border-[#071A36]"
    >
      <div className="absolute inset-0">
        <MediaImage
          src={heroSrc}
          alt={HERO_CONTENT.imageAlt}
          transform={state.siteSettings.heroMedia.transform}
          fallbackLabel={state.siteSettings.academyName}
          priority
          className="h-full w-full"
          imgClassName="opacity-60"
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
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[#D9A52E]">
            <span>{tagline}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wider text-white/75 normal-case">
              <MapPin className="h-3.5 w-3.5 text-[#D9A52E]" aria-hidden="true" />
              {state.siteSettings.locationText}
            </span>
          </div>

          <h1 className="text-[2rem] sm:text-[2.75rem] lg:text-[3.35rem] font-extrabold leading-[1.08] tracking-tight text-white">
            {headline}
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-white/85 max-w-xl">
            {supportingText}
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Button to={HERO_CONTENT.primaryCta.to} variant="primary" size="lg">
              <span>{primaryCtaLabel}</span>
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
          <span>~200 Fitness Exercises</span>
          <span aria-hidden="true">·</span>
          <span>20–25 Batting Drill Methods/Shot</span>
          <span aria-hidden="true">·</span>
          <span>Bowling Speed &amp; Line Control</span>
          <span aria-hidden="true">·</span>
          <span>Short, Fast &amp; Long Catching</span>
        </div>
      </div>
    </section>
  );
}
