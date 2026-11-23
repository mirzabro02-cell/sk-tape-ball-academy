import { useState } from 'react';
import { ArrowRight, Award, UserRound } from 'lucide-react';
import {
  ACADEMY_ACHIEVEMENTS_DATA,
  ACHIEVEMENT_CATEGORIES,
  PLAYER_PROFILES_DATA,
  type AchievementCategory,
} from '@/src/data/activitiesContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { cn } from '@/src/utils/cn';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function AchievementsPage() {
  useDocumentTitle('Achievements & Player Profiles');
  const [selectedCategory, setSelectedCategory] = useState<'All' | AchievementCategory>('All');

  const visibleAchievements =
    selectedCategory === 'All'
      ? ACADEMY_ACHIEVEMENTS_DATA
      : ACADEMY_ACHIEVEMENTS_DATA.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Achievements' }]}
        kicker="Honors & Player Spotlights (Demonstration Content)"
        title="Academy Achievements & Player Profiles"
        description="Structured showcase ready for verified tournament honors, squad milestones, and player profiles. All entries below are clearly labelled demonstration placeholders—no statistics or achievements are invented."
        actions={
          <>
            <Button to="/register" variant="primary" size="lg">
              Register Now
            </Button>
            <Button to="/book-trial" variant="outlineLight" size="lg">
              Book Free Trial
            </Button>
          </>
        }
      />

      {/* Achievement Categories & Academy Achievement Cards */}
      <section aria-labelledby="academy-achievements-heading" className="space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            kicker="Academy Honors"
            title="Achievement Categories (Placeholders)"
            description="Filter honors by category. Verified records will populate directly once confirmed."
          />

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
        </div>

        {visibleAchievements.length === 0 ? (
          <Card padding="lg" className="text-center space-y-3">
            <p className="text-base font-bold text-[#071A36]">
              No Achievements in This Category
            </p>
            <Button variant="outline" size="sm" onClick={() => setSelectedCategory('All')}>
              Show All Categories
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {visibleAchievements.map((item) => (
              <Card key={item.id} interactive padding="lg" className="flex flex-col justify-between gap-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#C8202B]">
                      {item.category} · {item.yearOrPeriodPlaceholder}
                    </span>
                    <Award className="h-5 w-5 text-[#D9A52E]" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-[#071A36]">{item.titlePlaceholder}</h3>
                  <p className="text-sm leading-relaxed text-[#64748B]">
                    {item.summaryPlaceholder}
                  </p>
                </div>

                {item.linkedPlayerSlug && (
                  <div className="border-t border-[#E2E8F0] pt-4">
                    <Button to={`/players/${item.linkedPlayerSlug}`} variant="outline" size="sm">
                      <span>View Player Profile</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Player Recognition & Spotlight Section */}
      <section aria-labelledby="player-spotlight-heading" className="space-y-8">
        <SectionHeader
          kicker="Player Recognition"
          title="Player Spotlight Profiles (Sample Placeholders)"
          description="Select any player card below to open the reusable /players/:slug profile route."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLAYER_PROFILES_DATA.map((player) => (
            <Card key={player.slug} interactive padding="sm" className="overflow-hidden flex flex-col">
              <div className="aspect-[4/3] w-full rounded-[12px] border border-[#E2E8F0] bg-[#071A36] flex flex-col items-center justify-center gap-2.5 text-center p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D9A52E]/40 bg-[#050D1B] text-[#D9A52E]">
                  <UserRound className="h-6 w-6" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium text-white/80">
                  {player.photoPlaceholderLabel}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#C8202B]">
                    {player.spotlightTag}
                  </p>
                  <h3 className="text-base font-bold text-[#071A36]">
                    {player.namePlaceholder}
                  </h3>
                  <p className="text-xs font-medium text-[#071A36]/80">{player.playingRole}</p>
                  <p className="text-xs text-[#64748B] pt-1">
                    {player.battingStyle} · {player.bowlingStyle}
                  </p>
                </div>

                <Button to={`/players/${player.slug}`} variant="secondary" size="sm" fullWidth>
                  <span>View Player Profile</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Start Building Your Own Match Record"
        description="Join a structured SK Tape Ball Academy batch or book a free trial evaluation."
        primaryLabel="Book Free Trial"
        primaryTo="/book-trial"
        secondaryLabel="Register Now"
        secondaryTo="/register"
      />
    </div>
  );
}
