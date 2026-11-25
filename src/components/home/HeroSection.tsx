import { ArrowRight, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { HERO_CONTENT } from '@/src/data/homeContent';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { PageContainer } from '@/src/components/layout/PageContainer';
import { Button } from '@/src/components/ui/Button';
import { MediaImage } from '@/src/components/ui/MediaImage';

export function HeroSection() {
  const prefersReduced = useReducedMotion();
  const { state } = useAcademyState();
  const heroSection = state.websiteSections.find((s) => s.id === 'hero');

  const customHeadline = heroSection?.headline?.trim();
  const isDefaultHeadline =
    !customHeadline ||
    customHeadline.toLowerCase() === 'where dreams meet opportunities.' ||
    customHeadline.toLowerCase() === 'sk tape ball academy' ||
    customHeadline.toLowerCase().includes('structured tape ball cricket coaching');

  const supportingText = heroSection?.bodyNotes?.trim() || HERO_CONTENT.supportingText;
  const primaryCtaLabel = heroSection?.ctaLabel?.trim() || HERO_CONTENT.primaryCta.label;
  const heroSrc = state.siteSettings.heroMedia.src || HERO_CONTENT.imageSrc;

  return (
    <section
      aria-label="Hero"
      className="relative w-full overflow-hidden border-b border-white/10 bg-[#07152C] text-white"
    >
      {/* Full-bleed cricket stadium image */}
      <div className="absolute inset-0">
        <MediaImage
          src={heroSrc}
          alt={HERO_CONTENT.imageAlt}
          transform={state.siteSettings.heroMedia.transform}
          fallbackLabel={state.siteSettings.academyName}
          priority
          className="h-full w-full"
          imgClassName="opacity-100"
        />
        {/* Left-to-right dark gradient behind text for high readability while preserving player visual on the right */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#050D1B]/96 via-[#07152C]/88 to-[#07152C]/55 sm:via-[#07152C]/72 sm:to-[#07152C]/15"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#050D1B]/80 via-transparent to-[#07152C]/35"
        />
      </div>

      {/* Text directly over image, aligned with site container */}
      <PageContainer className="relative z-10 flex min-h-[400px] sm:min-h-[480px] lg:min-h-[540px] items-center py-12 sm:py-16 lg:py-20">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl space-y-5"
        >
          <h1 className="font-display text-4xl sm:text-6xl lg:text-[4.5rem] font-extrabold uppercase leading-[0.95] tracking-tight text-white drop-shadow-[0_2px_14px_rgba(5,13,27,0.65)]">
            {isDefaultHeadline ? (
              <>
                <span className="block">{HERO_CONTENT.headlineTop}</span>
                <span className="block text-[#D5A83C]">{HERO_CONTENT.headlineAccent}</span>
              </>
            ) : (
              customHeadline
            )}
          </h1>

          <p className="max-w-lg text-sm sm:text-base lg:text-[17px] leading-relaxed text-[#E2E8F0] drop-shadow-[0_1px_8px_rgba(5,13,27,0.6)]">
            {supportingText}
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <Button to={HERO_CONTENT.primaryCta.to} variant="primary" size="lg" shape="pill">
              <span>{primaryCtaLabel}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button to={HERO_CONTENT.secondaryCta.to} variant="outlineLight" size="lg" shape="pill">
              <Compass className="h-4 w-4 text-[#D5A83C]" aria-hidden="true" />
              <span>{HERO_CONTENT.secondaryCta.label}</span>
            </Button>
          </div>
        </motion.div>
      </PageContainer>
    </section>
  );
}
