import { ArrowRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { RevealSection, StaggerGrid, StaggerItem } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function UpdatesPreviewSection() {
  const { state } = useAcademyState();
  const sectionMeta = state.websiteSections.find((s) => s.id === 'blog');
  const publishedPosts = state.blogPosts
    .filter((post) => post.status === 'Published')
    .slice(0, 3);

  if (publishedPosts.length === 0) {
    return null;
  }

  return (
    <RevealSection>
      <section aria-labelledby="home-updates-heading" className="space-y-7">
        <SectionHeader
          id="home-updates-heading"
          kicker="Academy Desk"
          title={sectionMeta?.headline || 'News & Updates'}
          description={
            sectionMeta?.subheadline ||
            'Official training announcements, tournament notices, and academy updates.'
          }
          action={
            <Button to="/updates" variant="outline" shape="pill">
              <span>{sectionMeta?.ctaLabel || 'All Updates'}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <StaggerGrid className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {publishedPosts.map((post) => (
            <StaggerItem key={post.id}>
              <Card
                interactive
                padding="md"
                className="h-full flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  {post.featuredImage && (
                    <div className="aspect-[16/9] overflow-hidden rounded-[12px] bg-[#07152C]">
                      <MediaImage
                        src={post.featuredImage}
                        alt={post.title}
                        transform={post.imageTransform}
                        fallbackLabel={post.title}
                        className="h-full w-full"
                      />
                    </div>
                  )}
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#C8202B] dark:text-[#D5A83C]">
                    {post.category}
                  </p>
                  <h3 className="text-lg font-bold text-[#07152C] dark:text-white leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC] line-clamp-3">
                    {post.bodyText}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3 text-xs dark:border-white/10">
                  <span className="inline-flex items-center gap-1.5 text-[#64748B] dark:text-[#7F95B8]">
                    <CalendarDays className="h-3.5 w-3.5 text-[#D5A83C]" aria-hidden="true" />
                    {post.updatedLabel}
                  </span>
                  <Link
                    to="/updates"
                    className="inline-flex items-center gap-1 font-semibold text-[#07152C] hover:text-[#C8202B] dark:text-[#D5A83C] dark:hover:text-white"
                  >
                    <span>Read More</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>
    </RevealSection>
  );
}
