import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, Play, X } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { GALLERY_CATEGORIES, type GalleryCategory } from '@/src/data/activitiesContent';
import type { AdminMediaItem } from '@/src/types/admin';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { useScrollLock } from '@/src/hooks/useScrollLock';
import { cn } from '@/src/utils/cn';
import { sanitizeExternalUrl } from '@/src/utils/validation';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function GalleryPage() {
  useDocumentTitle('Media Gallery');
  const { state } = useAcademyState();
  const [selectedCategory, setSelectedCategory] = useState<'All' | GalleryCategory>('All');
  const [lightboxItem, setLightboxItem] = useState<AdminMediaItem | null>(null);
  const [activeVideo, setActiveVideo] = useState<AdminMediaItem | null>(null);

  const publishedImages = state.gallery.filter(
    (item) => item.published && item.mediaType === 'image',
  );
  const publishedVideos = state.gallery.filter(
    (item) => item.published && item.mediaType === 'video',
  );

  const filteredImages =
    selectedCategory === 'All'
      ? publishedImages
      : publishedImages.filter((item) => item.category === selectedCategory);

  const filteredVideos =
    selectedCategory === 'All'
      ? publishedVideos
      : publishedVideos.filter((item) => item.category === selectedCategory);

  useScrollLock(Boolean(lightboxItem) || Boolean(activeVideo));

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setLightboxItem(null);
        setActiveVideo(null);
      } else if (lightboxItem && filteredImages.length > 1) {
        const currentIndex = filteredImages.findIndex((m) => m.id === lightboxItem.id);
        if (currentIndex === -1) return;
        if (event.key === 'ArrowRight') {
          setLightboxItem(filteredImages[(currentIndex + 1) % filteredImages.length]);
        } else if (event.key === 'ArrowLeft') {
          setLightboxItem(
            filteredImages[(currentIndex - 1 + filteredImages.length) % filteredImages.length],
          );
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxItem, activeVideo, filteredImages]);

  function stepLightbox(direction: 1 | -1) {
    if (!lightboxItem || filteredImages.length === 0) return;
    const currentIndex = filteredImages.findIndex((m) => m.id === lightboxItem.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + direction + filteredImages.length) % filteredImages.length;
    setLightboxItem(filteredImages[nextIndex]);
  }

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Gallery' }]}
        kicker="Media & Training Ground"
        title="Photo & Video Gallery"
        description="Training drills, bowling sessions, catching stations, and pitch environments from SK Tape Ball Academy."
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
            id="image-gallery-heading"
            kicker="Photo Archive"
            title="Training, Drills & Facilities"
            description="Filter media by category or open any photograph in the interactive lightbox viewer."
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

        {filteredImages.length === 0 ? (
          <Card tone="muted" padding="lg" className="text-center space-y-3">
            <p className="text-base font-bold text-[#071A36]">
              No Published Photos in {selectedCategory}
            </p>
            <p className="text-sm text-[#64748B]">
              Try selecting another category to browse available academy visuals.
            </p>
            {selectedCategory !== 'All' && (
              <div className="pt-1">
                <Button variant="outline" size="sm" onClick={() => setSelectedCategory('All')}>
                  View All Media
                </Button>
              </div>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredImages.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxItem(item)}
                className="group relative overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white text-left transition-all duration-150 hover:border-[#D9A52E] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A52E]"
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
                    className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#050D1B]/75 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  >
                    <Expand className="h-4 w-4" />
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C8202B]">
                    {item.category}
                  </p>
                  <h3 className="text-sm font-bold text-[#071A36]">{item.title}</h3>
                  {item.caption && (
                    <p className="text-xs leading-relaxed text-[#64748B]">{item.caption}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Video Highlights (Only shown when published video items exist) */}
      {filteredVideos.length > 0 && (
        <section aria-labelledby="video-gallery-heading" className="space-y-8">
          <SectionHeader
            id="video-gallery-heading"
            kicker="Video Highlights"
            title="Published Drill & Match Clips"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {filteredVideos.map((video) => (
              <Card key={video.id} interactive padding="sm" className="overflow-hidden flex flex-col">
                <button
                  type="button"
                  onClick={() => setActiveVideo(video)}
                  className="group relative aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-[#050D1B] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A52E]"
                >
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#071A36] to-[#050D1B]">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#D9A52E] text-[#050D1B] shadow-lg transition-transform duration-150 group-hover:scale-105">
                      <Play className="h-5 w-5 fill-current ml-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </button>

                <div className="p-4 space-y-2">
                  <p className="text-[11px] font-semibold text-[#C8202B]">{video.category}</p>
                  <h3 className="text-base font-bold text-[#071A36]">{video.title}</h3>
                  {video.caption && (
                    <p className="text-xs leading-relaxed text-[#64748B]">{video.caption}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

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
                  {lightboxItem.category}
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
                src={lightboxItem.assetPath}
                alt={lightboxItem.title}
                transform={lightboxItem.imageTransform}
                fallbackLabel={lightboxItem.title}
                className="h-full w-full"
              />
            </div>

            <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#64748B]">{lightboxItem.caption}</p>
              {filteredImages.length > 1 && (
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

      {/* Video Modal */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
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
                  {activeVideo.category}
                </p>
                <h3 className="text-lg font-bold text-[#071A36]">{activeVideo.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video modal"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E2E8F0] text-[#071A36] hover:bg-[#F5F7FA] cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {activeVideo.caption && (
                <p className="text-sm text-[#64748B]">{activeVideo.caption}</p>
              )}
              {sanitizeExternalUrl(activeVideo.assetPath) && (
                <a
                  href={sanitizeExternalUrl(activeVideo.assetPath) ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[10px] bg-[#071A36] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0b254b]"
                >
                  Open Video Link
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <CtaBanner
        title="See Our Training Sessions in Person"
        description="Book a free trial assessment or view our training environment in Sabzazar, Lahore."
        primaryLabel="Book Free Trial"
        primaryTo="/book-trial"
        secondaryLabel="View Facilities"
        secondaryTo="/facilities"
      />
    </div>
  );
}
