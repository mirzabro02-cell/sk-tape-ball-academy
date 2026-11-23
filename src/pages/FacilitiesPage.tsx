import { useEffect, useState } from 'react';
import { CheckCircle2, Expand, ShieldAlert, Wrench, X } from 'lucide-react';
import { FACILITIES_PAGE_CONTENT } from '@/src/data/academyInfo';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { useScrollLock } from '@/src/hooks/useScrollLock';
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
    if (!selectedPhoto) {
      return;
    }
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
            <Button to="/book-trial" variant="outlineLight" size="lg">
              Book Free Trial
            </Button>
          </>
        }
      />

      {/* Facilities Overview & Training Area */}
      <section aria-labelledby="facilities-overview-heading" className="space-y-8">
        <SectionHeader
          kicker="Ground Overview"
          title="Training Area & Practice Facilities"
          description={FACILITIES_PAGE_CONTENT.overview}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {FACILITIES_PAGE_CONTENT.trainingAreas.map((area) => (
            <Card key={area.code} padding="lg" className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-bold tracking-wider text-[#C8202B]">{area.code}</span>
                <span className="font-medium text-[#64748B]">{area.status}</span>
              </div>
              <h3 className="text-lg font-bold text-[#071A36]">{area.title}</h3>
              <p className="text-sm leading-relaxed text-[#64748B]">{area.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Equipment & Training Resources */}
      <section aria-labelledby="equipment-heading" className="space-y-8">
        <SectionHeader
          kicker="Training Resources"
          title="Equipment & Drill Infrastructure"
          description="Structured gear and target apparatus supporting skill-focused cricket practice."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FACILITIES_PAGE_CONTENT.equipmentResources.map((item) => (
            <Card key={item.title} padding="lg" className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#071A36] text-[#D9A52E]">
                <Wrench className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-[#071A36]">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[#64748B]">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Safety & Player Development */}
      <section aria-labelledby="safety-heading">
        <Card tone="navy" padding="lg" className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D9A52E]">
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              <span>Player Welfare</span>
            </div>
            <h2 id="safety-heading" className="text-2xl sm:text-3xl font-bold text-white">
              Safety &amp; Player Development Standards
            </h2>
            <p className="text-sm leading-relaxed text-white/80">
              High-tempo cricket sessions require disciplined lane control, warm-up preparation, and coach supervision at every drill station.
            </p>
          </div>

          <div className="lg:col-span-7">
            <ul className="space-y-3 rounded-[14px] border border-white/10 bg-[#050D1B]/80 p-5 sm:p-6">
              {FACILITIES_PAGE_CONTENT.safetyStandards.map((standard) => (
                <li key={standard} className="flex items-start gap-2.5 text-sm text-white/85">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
                  <span>{standard}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>

      {/* Facility Gallery Preview */}
      <section aria-labelledby="facilities-gallery-heading" className="space-y-8">
        <SectionHeader
          kicker="Facility Preview"
          title="Ground & Net Visuals"
          description="Illustrative cricket facility imagery alongside reserved slots for verified academy ground photographs."
          action={
            <Button to="/gallery" variant="outline">
              View Full Gallery
            </Button>
          }
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FACILITIES_PAGE_CONTENT.galleryItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedPhoto(item)}
              className="group relative overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white text-left transition-all duration-150 hover:border-[#D9A52E] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A52E]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <MediaImage
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fallbackLabel={item.title}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#050D1B]/75 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                >
                  <Expand className="h-4 w-4" />
                </span>
              </div>
              <div className="p-4 space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C8202B]">
                  {item.isPlaceholder ? 'Reserved Photo Slot' : 'Illustrative View'}
                </p>
                <h3 className="text-sm font-bold text-[#071A36]">{item.title}</h3>
                <p className="text-xs text-[#64748B]">{item.caption}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050D1B]/80 p-4 backdrop-blur-xs"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-3xl overflow-hidden rounded-[18px] border border-white/15 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#C8202B]">
                  {selectedPhoto.isPlaceholder ? 'Reserved Facility Slot' : 'Facility Preview'}
                </p>
                <h3 className="text-lg font-bold text-[#071A36]">{selectedPhoto.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close facility photo preview"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E2E8F0] text-[#071A36] hover:bg-[#F5F7FA] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="aspect-[16/10] w-full bg-[#071A36]">
              <MediaImage
                src={selectedPhoto.imageSrc}
                alt={selectedPhoto.imageAlt}
                fallbackLabel={selectedPhoto.title}
                className="h-full w-full"
              />
            </div>
            <div className="px-5 py-4 text-sm text-[#64748B]">{selectedPhoto.caption}</div>
          </div>
        </div>
      )}

      <CtaBanner
        title="Questions About Ground Location or Training Setup?"
        description="Reach out via our Contact page or reserve a free trial session to visit during practice hours."
        primaryLabel="Contact Academy"
        primaryTo="/contact"
        secondaryLabel="Book Free Trial"
        secondaryTo="/book-trial"
      />
    </div>
  );
}
