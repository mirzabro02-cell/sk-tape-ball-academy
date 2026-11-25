import { ArrowRight, MapPin } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { RevealSection } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';

export function ContactPreviewSection() {
  const { state } = useAcademyState();
  const { siteSettings } = state;
  const sectionMeta = state.websiteSections.find((s) => s.id === 'contact');

  const rawCtaLabel = sectionMeta?.ctaLabel?.trim();
  const ctaLabel = rawCtaLabel && rawCtaLabel.toLowerCase() !== 'send message' ? rawCtaLabel : 'Contact Us';

  return (
    <RevealSection>
      <section aria-labelledby="home-contact-heading">
        <div className="flex flex-col gap-5 rounded-[18px] border border-[#E2E8F0] bg-white px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 shadow-[var(--shadow-card)] dark:border-white/12 dark:bg-[#0F213B]">
          <div className="space-y-1.5 min-w-0">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#C8202B] dark:text-[#D5A52B]">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{siteSettings.locationText}</span>
            </p>
            <h2
              id="home-contact-heading"
              className="text-lg sm:text-xl font-bold text-[#07152C] dark:text-white"
            >
              {sectionMeta?.headline || 'Have Questions About Training or Admissions?'}
            </h2>
          </div>

          <div className="shrink-0">
            <Button to="/contact" variant="outline" size="md" shape="pill">
              <span>{ctaLabel}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </RevealSection>
  );
}
