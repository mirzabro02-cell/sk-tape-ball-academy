import { useEffect, useState } from 'react';
import { ArrowRight, Expand, X } from 'lucide-react';
import { GALLERY_PREVIEW_ITEMS, type GalleryPreviewItem } from '@/src/data/homeContent';
import { useScrollLock } from '@/src/hooks/useScrollLock';
import { cn } from '@/src/utils/cn';
import { Button } from '@/src/components/ui/Button';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

const GALLERY_FILTERS: Array<'All' | GalleryPreviewItem['category']> = [
  'All',
  'Drills',
  'Facility',
  'Placeholder',
];

export function GalleryPreviewSection() {
  const [activeFilter, setActiveFilter] = useState<'All' | GalleryPreviewItem['category']>('All');
  const [selectedItem, setSelectedItem] = useState<GalleryPreviewItem | null>(null);

  useScrollLock(Boolean(selectedItem));

  useEffect(() => {
    if (!selectedItem) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedItem(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);

  const visibleItems =
    activeFilter === 'All'
      ? GALLERY_PREVIEW_ITEMS
      : GALLERY_PREVIEW_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <section aria-labelledby="gallery-preview-heading" className="space-y-8">
      <SectionHeader
        kicker="Media Gallery"
        title="Training Ground & Drill Visuals"
        description="Illustrative cricket visuals paired with reserved slots for official academy match and training photography."
        action={
          <Button to="/gallery" variant="outline">
            <span>View Full Gallery</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white p-1.5 w-fit">
        {GALLERY_FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={cn(
              'rounded-[8px] px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap',
              activeFilter === filter
                ? 'bg-[#071A36] text-white'
                : 'text-[#64748B] hover:text-[#071A36] hover:bg-[#F5F7FA]',
            )}
          >
            {filter === 'Placeholder' ? 'Reserved Slots' : filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedItem(item)}
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
                {item.isPlaceholderSlot ? 'Reserved Slot' : item.category}
              </p>
              <h3 className="text-base font-bold text-[#071A36]">{item.title}</h3>
              <p className="text-xs leading-relaxed text-[#64748B]">{item.caption}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050D1B]/80 p-4 backdrop-blur-xs"
          onClick={() => setSelectedItem(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-3xl overflow-hidden rounded-[18px] border border-white/15 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#C8202B]">
                  {selectedItem.isPlaceholderSlot ? 'Reserved Gallery Slot' : selectedItem.category}
                </p>
                <h3 className="text-lg font-bold text-[#071A36]">{selectedItem.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close gallery preview"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E2E8F0] text-[#071A36] hover:bg-[#F5F7FA] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="aspect-[16/10] w-full bg-[#071A36]">
              <MediaImage
                src={selectedItem.imageSrc}
                alt={selectedItem.imageAlt}
                fallbackLabel={selectedItem.title}
                className="h-full w-full"
              />
            </div>

            <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#64748B]">{selectedItem.caption}</p>
              <Button to="/gallery" variant="secondary" size="sm" onClick={() => setSelectedItem(null)}>
                Open Gallery Page
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
