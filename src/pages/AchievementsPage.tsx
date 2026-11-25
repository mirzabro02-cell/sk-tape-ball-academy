import { useState } from 'react';
import { Award } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import {
  ACHIEVEMENT_CATEGORIES,
  type AchievementCategory,
} from '@/src/data/activitiesContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { cn } from '@/src/utils/cn';
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
            <Button to="/book-trial" variant="primary" size="lg">
              Book Free Trial
            </Button>
            <Button to="/programs" variant="outlineLight" size="lg">
              Explore Training Programs
            </Button>
          </>
        }
      />

      <section aria-labelledby="academy-achievements-heading" className="space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="academy-achievements-heading"
            kicker="Verified Records"
            title="Published Academy Honors"
            description="Only verified achievements and squad milestones published by academy management appear here."
          />

          {publishedAchievements.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white p-1.5 w-fit">
              {ACHIEVEMENT_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
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
          )}
        </div>

        {publishedAchievements.length === 0 ? (
          <Card tone="muted" padding="lg" className="space-y-4">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#071A36] text-[#D9A52E]">
                  <Award className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-[#071A36]">
                    Official Milestones Will Appear Here
                  </h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-[#64748B]">
                    Since launching on 18 August 2024 and establishing operations in Sabzazar, Lahore, SK Tape Ball Academy publishes verified tournament honors, league standings, and player awards here as official seasons conclude.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Button to="/matches" variant="outline" size="md">
                  Matches &amp; Leagues
                </Button>
                <Button to="/book-trial" variant="primary" size="md">
                  Book Free Trial
                </Button>
              </div>
            </div>
          </Card>
        ) : visibleAchievements.length === 0 ? (
          <Card padding="lg" className="text-center space-y-3">
            <p className="text-base font-bold text-[#071A36]">
              No Published Honors in {selectedCategory}
            </p>
            <Button variant="outline" size="sm" onClick={() => setSelectedCategory('All')}>
              Show All Categories
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleAchievements.map((item) => (
              <Card key={item.id} interactive padding="sm" className="overflow-hidden flex flex-col">
                {item.imagePath && (
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-[#071A36]">
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
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#C8202B]">
                      <span>
                        {item.category}
                        {item.datePlaceholder ? ` · ${item.datePlaceholder}` : ''}
                      </span>
                      <Award className="h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold text-[#071A36]">{item.title}</h3>
                    {item.playerName && (
                      <p className="text-xs font-semibold text-[#071A36]/80">
                        Recipient: {item.playerName}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed text-[#64748B]">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <CtaBanner
        title="Train Toward Your Next Competitive Milestone"
        description="Join a structured SK Tape Ball Academy track or book a free trial evaluation."
        primaryLabel="Book Free Trial"
        primaryTo="/book-trial"
        secondaryLabel="Register Now"
        secondaryTo="/register"
      />
    </div>
  );
}
