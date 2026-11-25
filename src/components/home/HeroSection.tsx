import { Activity, ArrowRight, Compass, MapPin, ShieldCheck, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { HERO_CONTENT } from '@/src/data/homeContent';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { AnimatedCounter } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { MediaImage } from '@/src/components/ui/MediaImage';

export function HeroSection() {
  const prefersReduced = useReducedMotion();
  const { state } = useAcademyState();
  const heroSection = state.websiteSections.find((s) => s.id === 'hero');

  const customHeadline = heroSection?.headline?.trim();
  const isDefaultHeadline =
    !customHeadline ||
    customHeadline.toLowerCase() === 'sk tape ball academy' ||
    customHeadline.toLowerCase().includes('sk tape ball');

  const tagline = state.siteSettings.tagline || HERO_CONTENT.tagline;
  const supportingText = heroSection?.bodyNotes || HERO_CONTENT.supportingText;
  const primaryCtaLabel = heroSection?.ctaLabel || HERO_CONTENT.primaryCta.label;
  const heroSrc = state.siteSettings.heroMedia.src || HERO_CONTENT.imageSrc;
  const publishedProgramsCount = Math.max(
    state.programs.filter((program) => program.published).length,
    6,
  );

  const highlightCards = [
    {
      id: 'fitness',
      icon: Activity,
      value: '~200',
      label: 'Fitness Exercises',
      numeric: null as number | null,
    },
    {
      id: 'batting-methods',
      icon: Target,
      value: '20–25',
      label: 'Methods Per Shot',
      numeric: null as number | null,
    },
    {
      id: 'tracks',
      icon: ShieldCheck,
      value: String(publishedProgramsCount),
      label: 'Coaching Tracks',
      numeric: publishedProgramsCount,
    },
    {
      id: 'established',
      icon: MapPin,
      value: 'Aug 2024',
      label: 'Sabzazar · Lahore',
      numeric: null as number | null,
    },
  ];

  return (
    <section
      aria-label="Hero"
      className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#07152C] text-white shadow-[0_24px_60px_-24px_rgba(5,13,27,0.75)]"
    >
      {/* Stadium Background Visual */}
      <div className="absolute inset-0">
        <MediaImage
          src={heroSrc}
          alt={HERO_CONTENT.imageAlt}
          transform={state.siteSettings.heroMedia.transform}
          fallbackLabel={state.siteSettings.academyName}
          priority
          className="h-full w-full"
          imgClassName="object-right opacity-85"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#07152C] via-[#07152C]/88 to-[#07152C]/20"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#050D1B] via-transparent to-[#07152C]/45"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pt-12 pb-8 sm:px-10 sm:pt-16 sm:pb-10 lg:px-14 lg:pt-20 lg:pb-12">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl space-y-5"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#D5A52B]">
            <span>{HERO_CONTENT.motto}</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-[#B4C4DC] normal-case">
              <MapPin className="h-3.5 w-3.5 text-[#D5A52B]" aria-hidden="true" />
              {state.siteSettings.locationText}
            </span>
          </div>

          <h1 className="font-display text-[2.85rem] sm:text-[4rem] lg:text-[4.65rem] font-extrabold uppercase leading-[0.96] tracking-tight text-white">
            {isDefaultHeadline ? (
              <>
                <span className="block">{HERO_CONTENT.headlineTop}</span>
                <span className="block text-[#D5A52B]">{HERO_CONTENT.headlineAccent}</span>
              </>
            ) : (
              customHeadline
            )}
          </h1>

          <p className="text-base sm:text-xl font-bold tracking-wide text-white">
            {tagline}
          </p>

          <p className="max-w-xl text-sm sm:text-base leading-relaxed text-[#B4C4DC]">
            {supportingText}
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Button to={HERO_CONTENT.primaryCta.to} variant="primary" size="lg">
              <span>{primaryCtaLabel}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button to={HERO_CONTENT.secondaryCta.to} variant="outlineLight" size="lg">
              <Compass className="h-4 w-4 text-[#D5A52B]" aria-hidden="true" />
              <span>{HERO_CONTENT.secondaryCta.label}</span>
            </Button>
          </div>
        </motion.div>

        {/* Bottom 4-Card Glass Highlight Strip (Design 1 Signature) */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReduced ? 0 : 0.45,
            delay: prefersReduced ? 0 : 0.14,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {highlightCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-center gap-3.5 rounded-[14px] border border-white/15 bg-[#0F213B]/85 px-4 py-3.5 backdrop-blur-md transition-colors hover:border-[#D5A52B]/45"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#07152C] border border-[#D5A52B]/30 text-[#D5A52B]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xl sm:text-2xl font-extrabold leading-none text-white tabular-nums">
                    {item.numeric !== null ? <AnimatedCounter value={item.numeric} /> : item.value}
                  </p>
                  <p className="mt-1 truncate text-xs font-medium text-[#B4C4DC]">
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
