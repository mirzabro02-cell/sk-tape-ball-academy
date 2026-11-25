import { useState } from 'react';
import { Award } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import {
  ACHIEVEMENT_CATEGORIES,
  type AchievementCategory,
} from '@/src/data/activitiesContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { cn } from '@/src/utils/cn';
import { RevealSection, StaggerGrid, StaggerItem } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function AchievementsPage() {
  useDocumentTitle('Achievements & Milestones');
  const { state } = useAcademyState();
  const [selectedCategory, setSelectedCategory] = useState<'All' | AchievementCategory>('All');

  const publishedAchievements = state.achievements.filter((item) => item.published);
  const visibleAchievements =
    selectedCategory === 'All'
      ? publishedAchievements
      : publishedAchievements.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Achievements' }]}
        kicker="Honors & Milestones"
        title="Academy Achievements & Recognition"
        description="Official tournament milestones, player honors, and competitive highlights recorded by SK Tape Ball Academy."
        actions={
          <>
            <Button to="/register" variant="primary" size="lg">
              Register Now
            </Button>
            <Button to="/programs" variant="outlineLight" size="lg">
              Explore Training Programs
            </Button>
          </>
        }
      />

      <RevealSection>
        <section aria-labelledby="academy-achievements-heading" className="space-y-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              id="academy-achievements-heading"
              kicker="Verified Records"
              title="Published Academy Honors"
              description="Only verified achievements and squad milestones published by academy management appear here."
            />

            {publishedAchievements.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white p-1.5 w-fit dark:border-white/10 dark:bg-[#0F213B]">
                {ACHIEVEMENT_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
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

          {publishedAchievements.length === 0 ? (
            <Card tone="muted" padding="lg" className="space-y-4">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#07152C] text-[#D5A52B] dark:bg-[#162B4D] dark:border dark:border-white/10">
                    <Award className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-[#07152C] dark:text-white">
                      Official Milestones Will Appear Here
                    </h3>
                    <p className="max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                      Since launching on 18 August 2024 and establishing operations in Sabzazar, Lahore, SK Tape Ball Academy publishes verified tournament honors, league standings, and player awards here as official seasons conclude.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 shrink-0">
                  <Button to="/matches" variant="outline" size="md">
                    Matches &amp; Leagues
                  </Button>
                  <Button to="/register" variant="primary" size="md">
                    Register Now
                  </Button>
                </div>
              </div>
            </Card>
          ) : visibleAchievements.length === 0 ? (
            <Card padding="lg" className="text-center space-y-3">
              <p className="text-base font-bold text-[#07152C] dark:text-white">
                No Published Honors in {selectedCategory}
              </p>
              <Button variant="outline" size="sm" onClick={() => setSelectedCategory('All')}>
                Show All Categories
              </Button>
            </Card>
          ) : (
            <StaggerGrid key={selectedCategory} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleAchievements.map((item) => (
                <StaggerItem key={item.id}>
                  <Card
                    interactive
                    padding="sm"
                    className="h-full overflow-hidden flex flex-col"
                  >
                    {item.imagePath && (
                      <div className="aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-[#07152C]">
                        <MediaImage
                          src={item.imagePath}
                          alt={item.title}
                          transform={item.imageTransform}
                          fallbackLabel={item.title}
                          className="h-full w-full"
                        />
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#C8202B] dark:text-[#D5A52B]">
                          <span>
                            {item.category}
                            {item.datePlaceholder ? ` · ${item.datePlaceholder}` : ''}
                          </span>
                          <Award className="h-4 w-4 shrink-0 text-[#D5A52B]" aria-hidden="true" />
                        </div>
                        <h3 className="text-lg font-bold text-[#07152C] dark:text-white">
                          {item.title}
                        </h3>
                        {item.playerName && (
                          <p className="text-xs font-semibold text-[#07152C]/80 dark:text-[#E2E8F0]">
                            Recipient: {item.playerName}
                          </p>
                        )}
                        <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
        </section>
      </RevealSection>

      <CtaBanner
        title="Train Toward Your Next Competitive Milestone"
        description="Join a structured SK Tape Ball Academy track or submit an online registration application."
        primaryLabel="Register Now"
        primaryTo="/register"
        secondaryLabel="Explore Programs"
        secondaryTo="/programs"
      />
    </div>
  );
}
