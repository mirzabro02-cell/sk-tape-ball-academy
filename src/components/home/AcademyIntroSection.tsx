import { ArrowRight, CheckCircle2 } from 'lucide-react';
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
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C8202B] dark:text-[#D5A52B]">
                {ACADEMY_INTRO_CONTENT.kicker}
              </p>
              <h2
                id="academy-intro-heading"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#07152C] dark:text-white"
              >
                {aboutSection?.headline || ACADEMY_INTRO_CONTENT.title}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                {ACADEMY_INTRO_CONTENT.overview}
              </p>
            </div>

            <Card padding="md" className="space-y-4">
              <h3 className="text-base font-bold text-[#07152C] dark:text-white">
                {ACADEMY_INTRO_CONTENT.philosophyTitle}
              </h3>
              <ul className="space-y-3">
                {ACADEMY_INTRO_CONTENT.philosophyPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A52B]"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <div>
              <Button to={ACADEMY_INTRO_CONTENT.cta.to} variant="secondary">
                <span>{aboutSection?.ctaLabel || ACADEMY_INTRO_CONTENT.cta.label}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[280px] lg:min-h-[430px] overflow-hidden rounded-[18px] border border-[#E2E8F0] bg-[#07152C] shadow-[0_18px_40px_-24px_rgba(5,13,27,0.4)] dark:border-white/10">
              <MediaImage
                src={aboutSrc}
                alt={ACADEMY_INTRO_CONTENT.imageAlt}
                transform={state.siteSettings.aboutMedia.transform}
                fallbackLabel="Academy Practice Lanes & Agility Zone"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>
    </RevealSection>
  );
}
