import { useCallback, useState } from 'react';
import { ArrowRight, Expand } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { GALLERY_CATEGORIES } from '@/src/data/activitiesContent';
import type { AdminMediaItem } from '@/src/types/admin';
import { cn } from '@/src/utils/cn';
import { RevealSection } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { ImageLightboxModal } from '@/src/components/ui/ImageLightboxModal';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function GalleryPreviewSection() {
  const { state } = useAcademyState();
  const [activeFilter, setActiveFilter] = useState<(typeof GALLERY_CATEGORIES)[number]>('All');
  const [selectedItem, setSelectedItem] = useState<AdminMediaItem | null>(null);

  const publishedImages = state.gallery.filter(
    (item) => item.published && item.mediaType === 'image',
  );

  const visibleItems = (
    activeFilter === 'All'
      ? publishedImages
      : publishedImages.filter((item) => item.category === activeFilter)
  ).slice(0, 6);

  const selectedIndex = selectedItem
    ? visibleItems.findIndex((item) => item.id === selectedItem.id)
    : -1;

  const stepSelected = useCallback(
    (direction: -1 | 1) => {
      if (!selectedItem || visibleItems.length <= 1) return;
      const currentIdx = visibleItems.findIndex((item) => item.id === selectedItem.id);
      if (currentIdx === -1) return;
      const nextIdx = (currentIdx + direction + visibleItems.length) % visibleItems.length;
      setSelectedItem(visibleItems[nextIdx]);
    },
    [selectedItem, visibleItems],
  );

  if (publishedImages.length === 0) {
    return null;
  }

  return (
    <RevealSection>
      <section aria-labelledby="gallery-preview-heading" className="space-y-8">
        <SectionHeader
          id="gallery-preview-heading"
          kicker="Media Gallery"
          title="Training Visuals"
          description="Practice sessions and floodlit tape-ball drills from SK Tape Ball Academy."
          action={
            <Button to="/gallery" variant="outline" shape="pill">
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

        <ImageLightboxModal
          item={
            selectedItem
              ? {
                  src: selectedItem.assetPath,
                  alt: selectedItem.title,
                  title: selectedItem.title,
                  category: selectedItem.category,
                  caption: selectedItem.caption,
                }
              : null
          }
          onClose={() => setSelectedItem(null)}
          onStep={stepSelected}
          canNavigate={visibleItems.length > 1}
          counterLabel={
            selectedIndex >= 0 ? `${selectedIndex + 1} / ${visibleItems.length}` : undefined
          }
          closeLabel="Close gallery preview"
          footerAction={
            <Button
              to="/gallery"
              variant="secondary"
              size="sm"
              onClick={() => setSelectedItem(null)}
            >
              Open Gallery Page
            </Button>
          }
        />
      </section>
    </RevealSection>
  );
}
