import { useEffect, useState } from 'react';
import { ArrowRight, Expand, X } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { GALLERY_CATEGORIES } from '@/src/data/activitiesContent';
import { useScrollLock } from '@/src/hooks/useScrollLock';
import type { AdminMediaItem } from '@/src/types/admin';
import { cn } from '@/src/utils/cn';
import { RevealSection } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function GalleryPreviewSection() {
  const { state } = useAcademyState();
  const [activeFilter, setActiveFilter] = useState<(typeof GALLERY_CATEGORIES)[number]>('All');
  const [selectedItem, setSelectedItem] = useState<AdminMediaItem | null>(null);

  useScrollLock(Boolean(selectedItem));

  useEffect(() => {
    if (!selectedItem) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedItem(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);

  const publishedImages = state.gallery.filter(
    (item) => item.published && item.mediaType === 'image',
  );

  if (publishedImages.length === 0) {
    return null;
  }

  const visibleItems = (
    activeFilter === 'All'
      ? publishedImages
      : publishedImages.filter((item) => item.category === activeFilter)
  ).slice(0, 6);

  return (
    <RevealSection>
      <section aria-labelledby="gallery-preview-heading" className="space-y-8">
        <SectionHeader
          id="gallery-preview-heading"
          kicker="Media Gallery"
          title="Training Ground & Session Visuals"
          description="Practice drills, pace bowling clinics, catching stations, and campus views from SK Tape Ball Academy."
          action={
            <Button to="/gallery" variant="outline">
              <span>View Full Gallery</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <div className="flex flex-wrap items-center gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white p-1.5 w-fit dark:border-white/10 dark:bg-[#0F213B]">
          {GALLERY_CATEGORIES.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'rounded-[8px] px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap',
                activeFilter === filter
                  ? 'bg-[#07152C] text-white dark:bg-[#D5A52B] dark:text-[#07152C]'
                  : 'text-[#64748B] hover:text-[#07152C] hover:bg-[#F5F7FA] dark:text-[#B4C4DC] dark:hover:text-white dark:hover:bg-white/5',
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedItem(item)}
              className="group relative overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D5A52B] dark:border-white/10 dark:bg-[#0F213B] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A52B]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <MediaImage
                  src={item.assetPath}
                  alt={item.title}
                  transform={item.imageTransform}
                  fallbackLabel={item.title}
                  className="h-full w-full"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#050D1B]/80 text-[#D5A52B] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                >
                  <Expand className="h-4 w-4" />
                </span>
              </div>

              <div className="p-4 space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C8202B] dark:text-[#D5A52B]">
                  {item.category}
                </p>
                <h3 className="text-base font-bold text-[#07152C] dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                  {item.caption}
                </p>
              </div>
            </button>
          ))}
        </div>

        {selectedItem && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedItem.title}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#050D1B]/85 p-4 backdrop-blur-xs"
            onClick={() => setSelectedItem(null)}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-3xl overflow-hidden rounded-[18px] border border-white/15 bg-white shadow-2xl dark:bg-[#0F213B]"
            >
              <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4 dark:border-white/10">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#C8202B] dark:text-[#D5A52B]">
                    {selectedItem.category}
                  </p>
                  <h3 className="text-lg font-bold text-[#07152C] dark:text-white">
                    {selectedItem.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  aria-label="Close gallery preview"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E2E8F0] text-[#07152C] hover:bg-[#F5F7FA] dark:border-white/15 dark:text-white dark:hover:bg-[#162B4D] cursor-pointer"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="aspect-[16/10] w-full bg-[#07152C]">
                <MediaImage
                  src={selectedItem.assetPath}
                  alt={selectedItem.title}
                  transform={selectedItem.imageTransform}
                  fallbackLabel={selectedItem.title}
                  className="h-full w-full"
                />
              </div>

              <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#475569] dark:text-[#B4C4DC]">
                  {selectedItem.caption}
                </p>
                <Button
                  to="/gallery"
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedItem(null)}
                >
                  Open Gallery Page
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </RevealSection>
  );
}
