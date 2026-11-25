import { useState } from 'react';
import { ArrowRight, CalendarDays, MapPin, Trophy } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { RevealSection, StaggerGrid, StaggerItem } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

type MatchTab = 'all' | 'upcoming' | 'results' | 'events';

export function MatchesEventsSection() {
  const { state } = useAcademyState();
  const [activeTab, setActiveTab] = useState<MatchTab>('all');
  const sectionMeta = state.websiteSections.find((s) => s.id === 'matches');

  const filteredMatches = state.matches.filter((m) => {
    if (activeTab === 'upcoming') return m.status === 'Upcoming';
    if (activeTab === 'results') return m.status === 'Completed';
    if (activeTab === 'events') return m.matchType === 'Night Tape Ball Event' || m.matchType === 'Inter-Batch Challenge';
    return true;
  });

  const visibleMatches = filteredMatches.slice(0, 4);

  const tabs: { id: MatchTab; label: string }[] = [
    { id: 'all', label: 'All Fixtures' },
    { id: 'upcoming', label: 'Upcoming Matches' },
    { id: 'results', label: 'Recent Results' },
    { id: 'events', label: 'Tournaments' },
  ];

  return (
    <RevealSection>
      <section aria-labelledby="matches-events-heading" className="space-y-7">
        <SectionHeader
          id="matches-events-heading"
          kicker="Competitions & Events"
          title={sectionMeta?.headline || 'Matches & Results'}
          description={
            sectionMeta?.subheadline ||
            'Scheduled academy fixtures, match results, and single-wicket tape ball events.'
          }
          action={
            <Button to="/matches" variant="outline">
              <span>{sectionMeta?.ctaLabel || 'Matches & Events'}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        {state.matches.length > 0 ? (
          <div className="space-y-5">
            {/* Filter Tabs (Matches & Results Showcase) */}
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Match categories">
              {tabs.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-[10px] px-4 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#D5A52B] text-[#050D1B] shadow-[0_6px_16px_-6px_rgba(213,165,43,0.55)]'
                        : 'border border-[#E2E8F0] bg-white text-[#07152C] hover:border-[#D5A52B]/60 dark:border-white/12 dark:bg-[#0F213B] dark:text-white/85 dark:hover:border-[#D5A52B]/55'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {visibleMatches.length === 0 ? (
              <Card padding="lg" className="text-center space-y-2">
                <p className="text-sm font-bold text-[#07152C] dark:text-white">
                  No fixtures in this category yet
                </p>
                <p className="text-xs text-[#64748B] dark:text-[#A3B4CC]">
                  Switch tabs or check the Matches page for upcoming schedule updates.
                </p>
              </Card>
            ) : (
              <StaggerGrid className="space-y-3">
                {visibleMatches.map((eventItem) => (
                  <StaggerItem key={eventItem.id}>
                    <Card
                      interactive
                      padding="md"
                      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#07152C] border border-[#D5A52B]/35 text-[#D5A52B] dark:bg-[#050D1B]">
                          <Trophy className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#C8202B] dark:text-[#D5A52B]">
                            <span>{eventItem.matchType}</span>
                            <span aria-hidden="true">·</span>
                            <span>{eventItem.status}</span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-[#07152C] dark:text-white truncate">
                            {eventItem.academyTeam} vs {eventItem.opponentTeam}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64748B] dark:text-[#A3B4CC]">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5 text-[#D5A52B]" aria-hidden="true" />
                              {eventItem.datePlaceholder}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-[#D5A52B]" aria-hidden="true" />
                              {eventItem.locationPlaceholder}
                            </span>
                            {eventItem.resultSummary && (
                              <span className="text-[#475569] dark:text-[#C2D0E3]">
                                {eventItem.resultSummary}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <Button to={`/matches/${eventItem.id}`} variant="primary" size="sm">
                          <span>View Details</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card padding="lg" className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#07152C] text-[#D5A52B] dark:bg-[#162B4D] dark:border dark:border-white/10">
                <Trophy className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#07152C] dark:text-white">
                Academy Tape Ball Leagues
              </h3>
              <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                Structured multi-team league formats giving enrolled players match-intensity overs across powerplay hitting, middle-over control, and death-over bowling.
              </p>
            </Card>

            <Card padding="lg" className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#07152C] text-[#D5A52B] dark:bg-[#162B4D] dark:border dark:border-white/10">
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#07152C] dark:text-white">
                Single-Wicket Events
              </h3>
              <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                Fast-paced 1-on-1 competitive challenges sharpening individual batting precision, bowling execution under pressure, and composure.
              </p>
            </Card>
          </div>
        )}
      </section>
    </RevealSection>
  );
}
