import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Expand, Play, X } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { GALLERY_CATEGORIES, type GalleryCategory } from '@/src/data/activitiesContent';
import type { AdminMediaItem } from '@/src/types/admin';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { useScrollLock } from '@/src/hooks/useScrollLock';
import { cn } from '@/src/utils/cn';
import { sanitizeExternalUrl } from '@/src/utils/validation';
import { RevealSection } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { ImageLightboxModal } from '@/src/components/ui/ImageLightboxModal';
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

  useScrollLock(Boolean(activeVideo));

  useEffect(() => {
    if (!activeVideo) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActiveVideo(null);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeVideo]);

  const stepLightbox = useCallback(
    (direction: -1 | 1) => {
      if (!lightboxItem || filteredImages.length <= 1) return;
      const currentIndex = filteredImages.findIndex((m) => m.id === lightboxItem.id);
      if (currentIndex === -1) return;
      const nextIndex = (currentIndex + direction + filteredImages.length) % filteredImages.length;
      setLightboxItem(filteredImages[nextIndex]);
    },
    [lightboxItem, filteredImages],
  );

  const selectedIndex = lightboxItem
    ? filteredImages.findIndex((m) => m.id === lightboxItem.id)
    : -1;

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Gallery' }]}
        kicker="Media & Training Ground"
        title="Photo & Video Gallery"
        description="Training drills, bowling sessions, catching stations, and pitch environments from SK Tape Ball Academy."
        actions={
          <>
            <Button to="/register" variant="primary" size="lg">
              Register Now
            </Button>
            <Button to="/facilities" variant="outlineLight" size="lg">
              Explore Facilities
            </Button>
          </>
        }
      />

      <RevealSection>
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
              className="flex flex-wrap items-center gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white p-1.5 w-fit dark:border-white/10 dark:bg-[#0F213B]"
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
                      ? 'bg-[#07152C] text-white dark:bg-[#D5A52B] dark:text-[#07152C]'
                      : 'text-[#64748B] hover:text-[#07152C] hover:bg-[#F5F7FA] dark:text-[#B4C4DC] dark:hover:text-white dark:hover:bg-white/5',
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {filteredImages.length === 0 ? (
            <Card tone="muted" padding="lg" className="text-center space-y-3">
              <p className="text-base font-bold text-[#07152C] dark:text-white">
                No Published Photos in {selectedCategory}
              </p>
              <p className="text-sm text-[#475569] dark:text-[#B4C4DC]">
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
                  className="group relative overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-[#D5A52B] dark:border-white/10 dark:bg-[#0F213B] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A52B]"
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
                    <h3 className="text-sm font-bold text-[#07152C] dark:text-white">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-xs leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </RevealSection>

      {/* Video Highlights */}
      {filteredVideos.length > 0 && (
        <RevealSection>
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
                    className="group relative aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-[#050D1B] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A52B]"
                  >
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#07152C] to-[#050D1B]">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#D5A52B] text-[#050D1B] shadow-lg transition-transform duration-150 group-hover:scale-105">
                        <Play className="h-5 w-5 fill-current ml-0.5" aria-hidden="true" />
                      </span>
                    </div>
                  </button>

                  <div className="p-4 space-y-2">
                    <p className="text-[11px] font-semibold text-[#C8202B] dark:text-[#D5A52B]">
                      {video.category}
                    </p>
                    <h3 className="text-base font-bold text-[#07152C] dark:text-white">
                      {video.title}
                    </h3>
                    {video.caption && (
                      <p className="text-xs leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                        {video.caption}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </RevealSection>
      )}

      {/* Full Uncropped Image Lightbox */}
      <ImageLightboxModal
        item={
          lightboxItem
            ? {
                src: lightboxItem.assetPath,
                alt: lightboxItem.title,
                title: lightboxItem.title,
                category: lightboxItem.category,
                caption: lightboxItem.caption,
              }
            : null
        }
        onClose={() => setLightboxItem(null)}
        onStep={stepLightbox}
        canNavigate={filteredImages.length > 1}
        counterLabel={
          selectedIndex >= 0 ? `${selectedIndex + 1} / ${filteredImages.length}` : undefined
        }
        closeLabel="Close image lightbox"
      />

      {/* Video Modal */}
      {activeVideo &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activeVideo.title}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#050D1B]/85 p-3 sm:p-6 backdrop-blur-xs"
            onClick={() => setActiveVideo(null)}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[18px] border border-white/15 bg-white shadow-2xl dark:bg-[#0F213B]"
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#E2E8F0] px-5 py-4 dark:border-white/10">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#C8202B] dark:text-[#D5A52B] truncate">
                    {activeVideo.category}
                  </p>
                  <h3 className="text-lg font-bold text-[#07152C] dark:text-white truncate">
                    {activeVideo.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  aria-label="Close video modal"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-[#CBD5E1] text-[#07152C] hover:bg-[#F5F7FA] dark:border-white/20 dark:text-white dark:hover:bg-[#162B4D] cursor-pointer"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 space-y-4">
                {activeVideo.caption && (
                  <p className="text-sm text-[#475569] dark:text-[#B4C4DC]">
                    {activeVideo.caption}
                  </p>
                )}
                {sanitizeExternalUrl(activeVideo.assetPath) && (
                  <a
                    href={sanitizeExternalUrl(activeVideo.assetPath) ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-[10px] bg-[#07152C] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#162B4D] dark:bg-[#D5A52B] dark:text-[#07152C]"
                  >
                    Open Video Link
                  </a>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}

      <CtaBanner
        title="See Our Training Sessions in Person"
        description="Submit your player registration or inspect our training environment in Sabzazar, Lahore."
        primaryLabel="Register Now"
        primaryTo="/register"
        secondaryLabel="View Facilities"
        secondaryTo="/facilities"
      />
    </div>
  );
}
