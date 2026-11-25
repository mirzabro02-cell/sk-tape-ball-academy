import { ArrowRight, CalendarDays, MapPin, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function MatchesEventsSection() {
  const { state } = useAcademyState();
  const visibleMatches = state.matches.slice(0, 3);

  return (
    <section aria-labelledby="matches-events-heading" className="space-y-8">
      <SectionHeader
        kicker="Competitions & Events"
        title="Tape Ball Leagues & Single-Wicket Events"
        description={
          visibleMatches.length > 0
            ? 'Scheduled fixtures, academy leagues, and single-wicket results.'
            : 'SK Tape Ball Academy organizes competitive tape ball leagues and single-wicket tournaments so players test skills under real match pressure.'
        }
        action={
          <Button to="/matches" variant="outline">
            <span>Matches &amp; Events</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />

      {visibleMatches.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {visibleMatches.map((eventItem) => (
            <Card
              key={eventItem.id}
              interactive
              padding="lg"
              className="flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#C8202B]">
                  {eventItem.matchType} · {eventItem.status}
                </p>
                <h3 className="text-lg font-bold text-[#071A36]">{eventItem.title}</h3>
                <p className="text-sm leading-relaxed text-[#64748B]">{eventItem.resultSummary}</p>
              </div>

              <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
                <div className="space-y-2 text-xs text-[#64748B]">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5 text-[#071A36]" aria-hidden="true" />
                    <span>{eventItem.datePlaceholder}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#D9A52E]" aria-hidden="true" />
                    <span>{eventItem.locationPlaceholder}</span>
                  </p>
                </div>

                <Link
                  to={`/matches/${eventItem.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#071A36] hover:text-[#C8202B] transition-colors"
                >
                  <span>Event Details</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card padding="lg" className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#071A36] text-[#D9A52E]">
              <Trophy className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-[#071A36]">Academy Tape Ball Leagues</h3>
            <p className="text-sm leading-relaxed text-[#64748B]">
              Structured multi-team league formats giving enrolled players match-intensity overs across powerplay hitting, middle-over control, and death-over bowling.
            </p>
          </Card>

          <Card padding="lg" className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#071A36] text-[#D9A52E]">
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-[#071A36]">Single-Wicket Events</h3>
            <p className="text-sm leading-relaxed text-[#64748B]">
              Fast-paced 1-on-1 competitive challenges sharpening individual batting precision, bowling execution under pressure, and composure.
            </p>
          </Card>
        </div>
      )}
    </section>
  );
}
