import { ArrowRight } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { ACADEMY_INTRO_CONTENT } from '@/src/data/homeContent';
import { RevealSection } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { MediaImage } from '@/src/components/ui/MediaImage';

export function AcademyIntroSection() {
  const { state } = useAcademyState();
  const aboutSection = state.websiteSections.find((s) => s.id === 'about');
  const aboutSrc = state.siteSettings.aboutMedia.src || ACADEMY_INTRO_CONTENT.imageSrc;

  return (
    <RevealSection>
      <section aria-labelledby="academy-intro-heading">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C8202B] dark:text-[#D5A83C]">
                {ACADEMY_INTRO_CONTENT.kicker}
              </p>
              <h2
                id="academy-intro-heading"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#07152C] dark:text-white"
              >
                {aboutSection?.headline || ACADEMY_INTRO_CONTENT.title}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#475569] dark:text-[#B8C7DF]">
                {aboutSection?.bodyNotes || ACADEMY_INTRO_CONTENT.overview}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ACADEMY_INTRO_CONTENT.approachSteps.map((step) => (
                <Card key={step.code} padding="md" className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#C8202B] dark:text-[#D5A83C]">
                      {step.code}
                    </span>
                    <h3 className="text-sm font-bold text-[#07152C] dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-[#475569] dark:text-[#B8C7DF]">
                    {step.description}
                  </p>
                </Card>
              ))}
            </div>

            <div>
              <Button to={ACADEMY_INTRO_CONTENT.cta.to} variant="secondary" shape="pill">
                <span>{aboutSection?.ctaLabel || ACADEMY_INTRO_CONTENT.cta.label}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[260px] lg:min-h-[400px] overflow-hidden rounded-[18px] border border-[#E2E8F0] bg-[#07152C] shadow-[0_18px_40px_-24px_rgba(5,13,27,0.4)] dark:border-white/10">
              <MediaImage
                src={aboutSrc}
                alt={ACADEMY_INTRO_CONTENT.imageAlt}
                transform={state.siteSettings.aboutMedia.transform}
                fallbackLabel="SK Tape Ball Academy Training Ground"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </RevealSection>
  );
}
