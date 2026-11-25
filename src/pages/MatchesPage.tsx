import { useState } from 'react';
import { ArrowRight, CalendarDays, MapPin, Trophy } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import type { MatchRecordStatus } from '@/src/types/admin';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { cn } from '@/src/utils/cn';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

const MATCH_FILTERS: Array<'All' | MatchRecordStatus> = ['All', 'Upcoming', 'Completed'];

export function MatchesPage() {
  useDocumentTitle('Matches & Events');
  const { state } = useAcademyState();
  const [filter, setFilter] = useState<'All' | MatchRecordStatus>('All');

  const matches = state.matches;
  const filteredMatches = matches.filter((m) => filter === 'All' || m.status === filter);

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Matches & Events' }]}
        kicker="Competitive Play"
        title="Tape Ball Leagues & Single-Wicket Events"
        description="SK Tape Ball Academy organizes competitive tape ball leagues and single-wicket events so players test structured batting, bowling, and fielding skills under real match conditions."
        actions={
          <>
            <Button to="/book-trial" variant="primary" size="lg">
              Book Free Trial
            </Button>
            <Button to="/contact" variant="outlineLight" size="lg">
              Match &amp; League Enquiries
            </Button>
          </>
        }
      />

      {matches.length > 0 ? (
        <section aria-labelledby="matches-directory-heading" className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              id="matches-directory-heading"
              kicker="Fixtures & Results"
              title="Academy Matches & Events"
              description="Official fixtures, league matches, and single-wicket events recorded by academy management."
            />

            <div className="flex flex-wrap items-center gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white p-1.5 w-fit">
              {MATCH_FILTERS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={cn(
                    'rounded-[8px] px-4 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap',
                    filter === tab
                      ? 'bg-[#071A36] text-white'
                      : 'text-[#64748B] hover:text-[#071A36] hover:bg-[#F5F7FA]',
                  )}
                >
                  {tab === 'All' ? 'All Matches' : tab}
                </button>
              ))}
            </div>
          </div>

          {filteredMatches.length === 0 ? (
            <Card tone="muted" padding="lg" className="text-center space-y-3">
              <p className="text-base font-bold text-[#071A36]">
                No {filter} Matches Listed
              </p>
              <Button variant="outline" size="sm" onClick={() => setFilter('All')}>
                View All Matches
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMatches.map((match) => (
                <Card key={match.id} interactive padding="lg" className="flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#C8202B]">
                        {match.matchType}
                      </span>
                      <span className="rounded-full bg-[#F5F7FA] px-2.5 py-0.5 text-[11px] font-semibold text-[#071A36]">
                        {match.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#071A36]">{match.title}</h3>
                    <p className="text-sm font-medium text-[#071A36]">
                      {match.academyTeam} vs {match.opponentTeam}
                    </p>

                    {(match.academyScore || match.opponentScore) && (
                      <div className="rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] p-3 text-xs space-y-1 text-[#071A36]">
                        {match.academyScore && <p>Academy: {match.academyScore}</p>}
                        {match.opponentScore && <p>Opponent: {match.opponentScore}</p>}
                      </div>
                    )}

                    {match.resultSummary && (
                      <p className="text-sm leading-relaxed text-[#64748B]">{match.resultSummary}</p>
                    )}
                  </div>

                  <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
                    <div className="space-y-1.5 text-xs text-[#64748B]">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-[#071A36]" aria-hidden="true" />
                        <span>{match.datePlaceholder}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#D9A52E]" aria-hidden="true" />
                        <span>{match.locationPlaceholder}</span>
                      </p>
                    </div>

                    <Button to={`/matches/${match.id}`} variant="outline" size="sm" fullWidth>
                      <span>View Match Details</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section aria-labelledby="competition-formats-heading" className="space-y-8">
          <SectionHeader
            id="competition-formats-heading"
            kicker="Organized Competition Formats"
            title="How SK Tape Ball Academy Tests Match Readiness"
            description="Official fixture dates and scorecards appear here once announced by academy management."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card padding="lg" className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#071A36] text-[#D9A52E]">
                <Trophy className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-[#071A36]">Academy Tape Ball Leagues</h3>
              <p className="text-sm leading-relaxed text-[#64748B]">
                Structured league competition giving training squads full-innings match play to execute tactical field settings, disciplined bowling spells, and team chases under scoreboard pressure.
              </p>
            </Card>

            <Card tone="navy" padding="lg" className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#D9A52E]/40 bg-[#050D1B] text-[#D9A52E]">
                <Trophy className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-white">Single-Wicket Events</h3>
              <p className="text-sm leading-relaxed text-white/80">
                High-intensity individual matchups isolating clutch batting against accurate pace and variations, sharpening decision-making and execution in tight overs.
              </p>
            </Card>
          </div>
        </section>
      )}

      <CtaBanner
        title="Interested in Academy Leagues or Trial Evaluations?"
        description="Book a free trial assessment or reach out to the academy desk for upcoming schedule announcements."
        primaryLabel="Book Free Trial"
        primaryTo="/book-trial"
        secondaryLabel="Contact Academy"
        secondaryTo="/contact"
      />
    </div>
  );
}
