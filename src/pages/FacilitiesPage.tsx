import { useEffect, useState } from 'react';
import { CheckCircle2, Expand, ShieldAlert, Wrench, X } from 'lucide-react';
import { FACILITIES_PAGE_CONTENT } from '@/src/data/academyInfo';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { useScrollLock } from '@/src/hooks/useScrollLock';
import { RevealSection, StaggerGrid, StaggerItem } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

type FacilityGalleryItem = (typeof FACILITIES_PAGE_CONTENT.galleryItems)[number];

export function FacilitiesPage() {
  useDocumentTitle('Facilities');
  const [selectedPhoto, setSelectedPhoto] = useState<FacilityGalleryItem | null>(null);

  useScrollLock(Boolean(selectedPhoto));

  useEffect(() => {
    if (!selectedPhoto) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]);

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Facilities' }]}
        kicker={FACILITIES_PAGE_CONTENT.kicker}
        title={FACILITIES_PAGE_CONTENT.title}
        description={FACILITIES_PAGE_CONTENT.heroDescription}
        actions={
          <>
            <Button to="/contact" variant="primary" size="lg">
              Inquire About Ground Access
            </Button>
            <Button to="/register" variant="outlineLight" size="lg">
              Register Now
            </Button>
          </>
        }
      />

      {/* Facilities Overview & Training Area */}
      <RevealSection>
        <section aria-labelledby="facilities-overview-heading" className="space-y-8">
          <SectionHeader
            id="facilities-overview-heading"
            kicker="Ground Overview"
            title="Training Area & Practice Zones"
            description={FACILITIES_PAGE_CONTENT.overview}
          />

          <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {FACILITIES_PAGE_CONTENT.trainingAreas.map((area) => (
              <StaggerItem key={area.code}>
                <Card padding="lg" className="h-full space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-mono font-bold tracking-wider text-[#C8202B] dark:text-[#D5A52B]">
                      {area.code}
                    </span>
                    <span className="font-medium text-[#64748B] dark:text-[#7F95B8]">
                      {area.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#07152C] dark:text-white">
                    {area.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                    {area.description}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      </RevealSection>

      {/* Equipment & Training Resources */}
      <RevealSection>
        <section aria-labelledby="equipment-heading" className="space-y-8">
          <SectionHeader
            id="equipment-heading"
            kicker="Training Resources"
            title="Equipment & Drill Infrastructure"
            description="Structured gear and target apparatus supporting skill-focused cricket practice."
          />

          <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FACILITIES_PAGE_CONTENT.equipmentResources.map((item) => (
              <StaggerItem key={item.title}>
                <Card padding="lg" className="h-full space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#07152C] text-[#D5A52B] dark:bg-[#162B4D] dark:border dark:border-white/10">
                    <Wrench className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-[#07152C] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                    {item.description}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      </RevealSection>

      {/* Safety & Player Development */}
      <RevealSection>
        <section aria-labelledby="safety-heading">
          <Card
            tone="navy"
            padding="lg"
            className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center"
          >
            <div className="lg:col-span-5 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D5A52B]">
                <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                <span>Player Welfare</span>
              </div>
              <h2 id="safety-heading" className="text-2xl sm:text-3xl font-bold text-white">
                Safety &amp; Player Development Standards
              </h2>
              <p className="text-sm leading-relaxed text-[#B4C4DC]">
                High-tempo cricket sessions require disciplined lane control, warm-up preparation, and coach supervision at every drill station.
              </p>
            </div>

            <div className="lg:col-span-7">
              <ul className="space-y-3 rounded-[14px] border border-white/10 bg-[#050D1B]/80 p-5 sm:p-6">
                {FACILITIES_PAGE_CONTENT.safetyStandards.map((standard) => (
                  <li key={standard} className="flex items-start gap-2.5 text-sm text-[#E2E8F0]">
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A52B]"
                      aria-hidden="true"
                    />
                    <span>{standard}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </section>
      </RevealSection>

      {/* Facility Gallery Preview */}
      <RevealSection>
        <section aria-labelledby="facilities-gallery-heading" className="space-y-8">
          <SectionHeader
            id="facilities-gallery-heading"
            kicker="Facility Preview"
            title="Ground & Net Visuals"
            description="Practice lanes and floodlit evening pitch training environment."
            action={
              <Button to="/gallery" variant="outline">
                View Full Gallery
              </Button>
            }
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {FACILITIES_PAGE_CONTENT.galleryItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedPhoto(item)}
                className="group relative overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white text-left transition-all duration-150 hover:border-[#D5A52B] dark:border-white/10 dark:bg-[#0F213B] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A52B]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <MediaImage
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fallbackLabel={item.title}
                    className="h-full w-full"
                    imgClassName="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#050D1B]/80 text-[#D5A52B] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  >
                    <Expand className="h-4 w-4" />
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="text-base font-bold text-[#07152C] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#475569] dark:text-[#B4C4DC]">{item.caption}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </RevealSection>

      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050D1B]/85 p-4 backdrop-blur-xs"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-3xl overflow-hidden rounded-[18px] border border-white/15 bg-white shadow-2xl dark:bg-[#0F213B]"
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4 dark:border-white/10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#C8202B] dark:text-[#D5A52B]">
                  Facility Preview
                </p>
                <h3 className="text-lg font-bold text-[#07152C] dark:text-white">
                  {selectedPhoto.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close facility photo preview"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E2E8F0] text-[#07152C] hover:bg-[#F5F7FA] dark:border-white/15 dark:text-white dark:hover:bg-[#162B4D] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="aspect-[16/10] w-full bg-[#07152C]">
              <MediaImage
                src={selectedPhoto.imageSrc}
                alt={selectedPhoto.imageAlt}
                fallbackLabel={selectedPhoto.title}
                className="h-full w-full"
              />
            </div>
            <div className="px-5 py-4 text-sm text-[#475569] dark:text-[#B4C4DC]">
              {selectedPhoto.caption}
            </div>
          </div>
        </div>
      )}

      <CtaBanner
        title="Questions About Ground Location or Training Setup?"
        description="Reach out via our Contact page or submit your registration application to join a training batch."
        primaryLabel="Contact Academy"
        primaryTo="/contact"
        secondaryLabel="Register Now"
        secondaryTo="/register"
      />
    </div>
  );
}
