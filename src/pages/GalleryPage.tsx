import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, Film, Play, X } from 'lucide-react';
import {
  GALLERY_CATEGORIES,
  GALLERY_MEDIA_ITEMS,
  GALLERY_VIDEOS_DATA,
  type GalleryCategory,
  type GalleryMediaItem,
  type VideoPlaceholderItem,
} from '@/src/data/activitiesContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { useScrollLock } from '@/src/hooks/useScrollLock';
import { cn } from '@/src/utils/cn';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function GalleryPage() {
  useDocumentTitle('Media Gallery');
  const [selectedCategory, setSelectedCategory] = useState<'All' | GalleryCategory>('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryMediaItem | null>(null);
  const [activeVideo, setActiveVideo] = useState<VideoPlaceholderItem | null>(null);

  const filteredMedia =
    selectedCategory === 'All'
      ? GALLERY_MEDIA_ITEMS
      : GALLERY_MEDIA_ITEMS.filter((item) => item.category === selectedCategory);

  const filteredVideos =
    selectedCategory === 'All'
      ? GALLERY_VIDEOS_DATA
      : GALLERY_VIDEOS_DATA.filter((vid) => vid.category === selectedCategory);

  useScrollLock(Boolean(lightboxItem) || Boolean(activeVideo));

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setLightboxItem(null);
        setActiveVideo(null);
      } else if (lightboxItem && filteredMedia.length > 1) {
        const currentIndex = filteredMedia.findIndex((m) => m.id === lightboxItem.id);
        if (currentIndex === -1) return;
        if (event.key === 'ArrowRight') {
          setLightboxItem(filteredMedia[(currentIndex + 1) % filteredMedia.length]);
        } else if (event.key === 'ArrowLeft') {
          setLightboxItem(
            filteredMedia[(currentIndex - 1 + filteredMedia.length) % filteredMedia.length],
          );
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxItem, activeVideo, filteredMedia]);

  function stepLightbox(direction: 1 | -1) {
    if (!lightboxItem || filteredMedia.length === 0) return;
    const currentIndex = filteredMedia.findIndex((m) => m.id === lightboxItem.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + direction + filteredMedia.length) % filteredMedia.length;
    setLightboxItem(filteredMedia[nextIndex]);
  }

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Gallery' }]}
        kicker="Media & Academy Activities"
        title="Photo & Video Gallery"
        description="Illustrative cricket training visuals alongside clearly labelled slots reserved for verified SK Tape Ball Academy match photography, events, and video highlights."
        actions={
          <>
            <Button to="/book-trial" variant="primary" size="lg">
              Book Free Trial
            </Button>
            <Button to="/facilities" variant="outlineLight" size="lg">
              Explore Facilities
            </Button>
          </>
        }
      />

      {/* Category Filters & Photo Grid */}
      <section aria-labelledby="image-gallery-heading" className="space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            kicker="Photo Archive"
            title="Training, Matches, Events & Facilities"
            description="Filter media by category or open any card in the interactive lightbox viewer."
          />

          <div
            role="tablist"
            aria-label="Filter gallery media by category"
            className="flex flex-wrap items-center gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white p-1.5 w-fit"
          >
            {GALLERY_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'rounded-[8px] px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap',
                  selectedCategory === category
                    ? 'bg-[#071A36] text-white'
                    : 'text-[#64748B] hover:text-[#071A36] hover:bg-[#F5F7FA]',
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredMedia.length === 0 ? (
          <Card padding="lg" className="text-center space-y-3">
            <p className="text-base font-bold text-[#071A36]">
              No Photos Available in This Category
            </p>
            <p className="text-sm text-[#64748B]">
              Official academy photography for this category has not been uploaded yet.
            </p>
            <div className="pt-1">
              <Button variant="outline" size="sm" onClick={() => setSelectedCategory('All')}>
                View All Media
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredMedia.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxItem(item)}
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
                    {item.isPlaceholderSlot ? `${item.category} · Reserved Slot` : item.category}
                  </p>
                  <h3 className="text-sm font-bold text-[#071A36]">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-[#64748B]">{item.caption}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Video Gallery Section */}
      <section aria-labelledby="video-gallery-heading" className="space-y-8">
        <SectionHeader
          kicker="Video Highlights (Placeholders)"
          title="Video Gallery & Drill Clips"
          description="Preview slots prepared for verified training reels, bowling mechanics clips, and match highlights."
        />

        {filteredVideos.length === 0 ? (
          <Card tone="muted" padding="lg" className="text-center space-y-2">
            <p className="text-sm font-semibold text-[#071A36]">
              No video reels queued for the selected category ({selectedCategory}).
            </p>
            <p className="text-xs text-[#64748B]">
              Switch to &ldquo;All&rdquo; or &ldquo;Training&rdquo; / &ldquo;Matches&rdquo; to preview video placeholder slots.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {filteredVideos.map((video) => (
              <Card key={video.id} interactive padding="sm" className="overflow-hidden flex flex-col">
                <button
                  type="button"
                  onClick={() => setActiveVideo(video)}
                  className="group relative aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-[#050D1B] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A52E]"
                >
                  <MediaImage
                    src={video.posterSrc}
                    alt={video.titlePlaceholder}
                    fallbackLabel={video.titlePlaceholder}
                    className="h-full w-full"
                    imgClassName="opacity-75 transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-[#050D1B]/35">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#D9A52E] text-[#050D1B] shadow-lg transition-transform duration-150 group-hover:scale-105">
                      <Play className="h-5 w-5 fill-current ml-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </button>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#C8202B]">
                    <span>{video.category}</span>
                    <span className="text-[#64748B]">{video.durationPlaceholder}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#071A36]">{video.titlePlaceholder}</h3>
                  <p className="text-xs leading-relaxed text-[#64748B]">
                    {video.descriptionPlaceholder}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Image Lightbox Modal */}
      {lightboxItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050D1B]/85 p-4 backdrop-blur-xs"
          onClick={() => setLightboxItem(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-4xl overflow-hidden rounded-[18px] border border-white/15 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#C8202B]">
                  {lightboxItem.isPlaceholderSlot
                    ? `${lightboxItem.category} · Reserved Slot`
                    : lightboxItem.category}
                </p>
                <h3 className="text-lg font-bold text-[#071A36]">{lightboxItem.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                aria-label="Close image lightbox"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E2E8F0] text-[#071A36] hover:bg-[#F5F7FA] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative aspect-[16/10] w-full bg-[#071A36]">
              <MediaImage
                src={lightboxItem.imageSrc}
                alt={lightboxItem.imageAlt}
                fallbackLabel={lightboxItem.title}
                className="h-full w-full"
              />
            </div>

            <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#64748B]">{lightboxItem.caption}</p>
              {filteredMedia.length > 1 && (
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => stepLightbox(-1)}>
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    <span>Previous</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => stepLightbox(1)}>
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.titlePlaceholder}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050D1B]/85 p-4 backdrop-blur-xs"
          onClick={() => setActiveVideo(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-3xl overflow-hidden rounded-[18px] border border-white/15 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#C8202B]">
                  {activeVideo.category} · Video Preview Placeholder
                </p>
                <h3 className="text-lg font-bold text-[#071A36]">
                  {activeVideo.titlePlaceholder}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video preview"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E2E8F0] text-[#071A36] hover:bg-[#F5F7FA] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative aspect-[16/9] w-full bg-[#050D1B] flex flex-col items-center justify-center gap-3 p-6 text-center text-white">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D9A52E]/50 bg-[#071A36] text-[#D9A52E]">
                <Film className="h-7 w-7" aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold text-white">
                Video Player Interface Ready (Placeholder)
              </p>
              <p className="max-w-md text-xs leading-relaxed text-white/75">
                Official video streams or uploaded academy clips will play here once connected. No fake video stream is simulated.
              </p>
            </div>

            <div className="flex items-center justify-between px-5 py-4">
              <p className="text-sm text-[#64748B]">{activeVideo.descriptionPlaceholder}</p>
            </div>
          </div>
        </div>
      )}

      <CtaBanner
        title="See Our Training Sessions in Person"
        description="Book a free trial assessment or view our training facilities."
        primaryLabel="Book Free Trial"
        primaryTo="/book-trial"
        secondaryLabel="View Facilities"
        secondaryTo="/facilities"
      />
    </div>
  );
}
