import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ACADEMY_INTRO_CONTENT } from '@/src/data/homeContent';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { MediaImage } from '@/src/components/ui/MediaImage';

export function AcademyIntroSection() {
  return (
    <section aria-labelledby="academy-intro-heading">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C8202B]">
              {ACADEMY_INTRO_CONTENT.kicker}
            </p>
            <h2
              id="academy-intro-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[#071A36]"
            >
              {ACADEMY_INTRO_CONTENT.title}
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#64748B]">
              {ACADEMY_INTRO_CONTENT.overview}
            </p>
          </div>

          <Card padding="md" tone="light" className="space-y-4">
            <h3 className="text-base font-bold text-[#071A36]">
              {ACADEMY_INTRO_CONTENT.philosophyTitle}
            </h3>
            <ul className="space-y-3">
              {ACADEMY_INTRO_CONTENT.philosophyPoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#64748B]">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]"
                    aria-hidden="true"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Card>

          <div>
            <Button to={ACADEMY_INTRO_CONTENT.cta.to} variant="secondary">
              <span>{ACADEMY_INTRO_CONTENT.cta.label}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="h-full min-h-[280px] lg:min-h-[420px] overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-[#071A36]">
            <MediaImage
              src={ACADEMY_INTRO_CONTENT.imageSrc}
              alt={ACADEMY_INTRO_CONTENT.imageAlt}
              fallbackLabel="Academy Practice Lanes & Agility Zone"
              className="h-full w-full"
              imgClassName="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
