import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Newspaper, Tag, X } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import type { AdminBlogPost } from '@/src/types/admin';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { useScrollLock } from '@/src/hooks/useScrollLock';
import { cn } from '@/src/utils/cn';
import { RevealSection, StaggerGrid, StaggerItem } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function UpdatesPage() {
  useDocumentTitle('Academy Updates & News');
  const { state } = useAcademyState();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePost, setActivePost] = useState<AdminBlogPost | null>(null);

  useScrollLock(Boolean(activePost));

  useEffect(() => {
    if (!activePost) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActivePost(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [activePost]);

  const publishedPosts = useMemo(
    () => state.blogPosts.filter((post) => post.status === 'Published'),
    [state.blogPosts],
  );

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(publishedPosts.map((post) => post.category.trim()).filter(Boolean)),
    );
    return ['All', ...unique];
  }, [publishedPosts]);

  const visiblePosts =
    selectedCategory === 'All'
      ? publishedPosts
      : publishedPosts.filter((post) => post.category.trim() === selectedCategory);

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Academy Updates' }]}
        kicker="News & Announcements"
        title="Academy Updates & Training Notices"
        description="Official notices, match reports, league schedules, and coaching announcements published by SK Tape Ball Academy."
        actions={
          <>
            <Button to="/register" variant="primary" size="lg">
              Register Now
            </Button>
            <Button to="/matches" variant="outlineLight" size="lg">
              Matches &amp; Leagues
            </Button>
          </>
        }
      />

      <RevealSection>
        <section aria-labelledby="updates-listing-heading" className="space-y-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              id="updates-listing-heading"
              kicker="Published Articles"
              title="Latest Academy Announcements"
              description="Verified notices and seasonal bulletins from Sabzazar, Lahore."
            />

            {categories.length > 1 && (
              <div
                role="tablist"
                aria-label="Filter updates by category"
                className="flex flex-wrap items-center gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white p-1.5 w-fit dark:border-white/10 dark:bg-[#0F213B]"
              >
                {categories.map((category) => (
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
            )}
          </div>

          {publishedPosts.length === 0 ? (
            <Card tone="muted" padding="lg" className="space-y-4">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#07152C] text-[#D5A52B] dark:bg-[#162B4D] dark:border dark:border-white/10">
                    <Newspaper className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-[#07152C] dark:text-white">
                      No Published Announcements Yet
                    </h3>
                    <p className="max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                      Official academy bulletins, tournament announcements, and coaching articles will appear here as soon as they are published by academy administration.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 shrink-0">
                  <Button to="/programs" variant="outline" size="md">
                    Training Programs
                  </Button>
                  <Button to="/register" variant="primary" size="md">
                    Register Now
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <StaggerGrid key={selectedCategory} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visiblePosts.map((post) => (
                <StaggerItem key={post.id}>
                  <Card interactive padding="sm" className="h-full overflow-hidden flex flex-col">
                    {post.featuredImage && (
                      <div className="aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-[#07152C]">
                        <MediaImage
                          src={post.featuredImage}
                          alt={post.title}
                          transform={post.imageTransform}
                          fallbackLabel={post.title}
                          className="h-full w-full"
                        />
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#C8202B] dark:text-[#D5A52B]">
                          <span>{post.category}</span>
                          {post.updatedLabel && (
                            <span className="inline-flex items-center gap-1 text-[#64748B] dark:text-[#7F95B8]">
                              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                              {post.updatedLabel}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-[#07152C] dark:text-white">
                          {post.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC] line-clamp-3">
                          {post.bodyText}
                        </p>
                      </div>

                      <div className="border-t border-[#E2E8F0] pt-3 flex items-center justify-between gap-3 dark:border-white/10">
                        <Button
                          variant="outline"
                          size="sm"
                          fullWidth
                          onClick={() => setActivePost(post)}
                        >
                          Read Update
                        </Button>
                      </div>
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
        </section>
      </RevealSection>

      {activePost &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={activePost.title}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#050D1B]/85 p-3 sm:p-6 backdrop-blur-xs"
            onClick={() => setActivePost(null)}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-[18px] border border-white/15 bg-white shadow-2xl dark:bg-[#0F213B]"
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#E2E8F0] bg-white px-5 py-4 sm:px-6 dark:border-white/10 dark:bg-[#0F213B]">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#C8202B] dark:text-[#D5A52B] truncate">
                    {activePost.category}
                    {activePost.updatedLabel ? ` · ${activePost.updatedLabel}` : ''}
                  </p>
                  <h2 className="text-lg sm:text-xl font-bold text-[#07152C] dark:text-white truncate">
                    {activePost.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePost(null)}
                  aria-label="Close update article"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-[#CBD5E1] text-[#07152C] hover:bg-[#F5F7FA] dark:border-white/20 dark:text-white dark:hover:bg-[#162B4D] cursor-pointer"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="overflow-y-auto">
                {activePost.featuredImage && (
                  <div className="flex items-center justify-center bg-[#050D1B] p-2 sm:p-4">
                    <img
                      src={activePost.featuredImage}
                      alt={activePost.title}
                      referrerPolicy="no-referrer"
                      className="block max-h-[45dvh] w-auto max-w-full object-contain"
                    />
                  </div>
                )}

                <div className="p-5 sm:p-6 space-y-4">
                  {activePost.bodyText
                    .split(/\n+/)
                    .map((paragraph) => paragraph.trim())
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-sm sm:text-base leading-relaxed text-[#475569] dark:text-[#B4C4DC]"
                      >
                        {paragraph}
                      </p>
                    ))}

                  {activePost.tags.length > 0 && (
                    <div className="border-t border-[#E2E8F0] pt-4 flex flex-wrap items-center gap-2 dark:border-white/10">
                      <Tag className="h-3.5 w-3.5 text-[#D5A52B]" aria-hidden="true" />
                      <span className="text-xs text-[#64748B] dark:text-[#7F95B8]">
                        {activePost.tags.join(' · ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <CtaBanner
        title="Join SK Tape Ball Academy"
        description="Explore our structured cricket coaching programs or submit your student registration application today."
        primaryLabel="Register Now"
        primaryTo="/register"
        secondaryLabel="Training Programs"
        secondaryTo="/programs"
      />
    </div>
  );
}
