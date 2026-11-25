import { ArrowLeft, CalendarDays, MapPin, Trophy, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { PageHero } from '@/src/components/ui/PageHero';

export function MatchDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useAcademyState();

  const match = state.matches.find((item) => item.id === slug);

  useDocumentTitle(match ? match.title : 'Match Details Unavailable');

  if (!match) {
    return (
      <Card className="mx-auto max-w-xl text-center space-y-4" padding="lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#C8202B]">
          Match Not Found
        </p>
        <h1 className="text-2xl font-bold text-[#071A36]">
          Requested Match or Event Unavailable
        </h1>
        <p className="text-sm text-[#64748B]">
          The requested fixture or match record could not be found. Return to the Matches &amp; Events directory to view active listings.
        </p>
        <div className="pt-2 flex justify-center">
          <Button to="/matches" variant="primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Matches &amp; Events</span>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-12 sm:space-y-16">
      <PageHero
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Matches & Events', to: '/matches' },
          { label: match.title },
        ]}
        kicker={`${match.matchType} · ${match.status}`}
        title={match.title}
        description={
          match.resultSummary ||
          `${match.academyTeam} vs ${match.opponentTeam} organized by SK Tape Ball Academy.`
        }
        actions={
          <>
            <Button to="/book-trial" variant="primary" size="lg">
              Book Free Trial
            </Button>
            <Button to="/matches" variant="outlineLight" size="lg">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>All Matches &amp; Events</span>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5 space-y-4" padding="lg">
          <h2 className="text-lg font-bold text-[#071A36]">Match Information</h2>
          <div className="space-y-3 border-t border-[#E2E8F0] pt-4 text-sm text-[#64748B]">
            <p className="flex items-start gap-2.5">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#071A36]" aria-hidden="true" />
              <span>
                <strong className="text-[#071A36]">Schedule:</strong> {match.datePlaceholder}
              </span>
            </p>
            <p className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
              <span>
                <strong className="text-[#071A36]">Ground / Venue:</strong>{' '}
                {match.locationPlaceholder}
              </span>
            </p>
            <p className="flex items-start gap-2.5">
              <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-[#C8202B]" aria-hidden="true" />
              <span>
                <strong className="text-[#071A36]">Status:</strong> {match.status}
              </span>
            </p>
          </div>
        </Card>

        <Card className="lg:col-span-7 space-y-4" padding="lg">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#071A36]" aria-hidden="true" />
            <h2 className="text-lg font-bold text-[#071A36]">Competing Sides &amp; Scores</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 border-t border-[#E2E8F0] pt-4 sm:grid-cols-2">
            <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#C8202B]">
                Academy Side
              </p>
              <p className="text-base font-bold text-[#071A36]">{match.academyTeam}</p>
              {match.academyScore && (
                <p className="text-sm font-semibold text-[#64748B]">{match.academyScore}</p>
              )}
            </div>

            <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Opponent / Group
              </p>
              <p className="text-base font-bold text-[#071A36]">{match.opponentTeam}</p>
              {match.opponentScore && (
                <p className="text-sm font-semibold text-[#64748B]">{match.opponentScore}</p>
              )}
            </div>
          </div>

          {match.resultSummary && (
            <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-4 text-sm text-[#071A36]">
              <strong>Summary:</strong> {match.resultSummary}
            </div>
          )}
        </Card>
      </div>

      <CtaBanner
        title="Join Upcoming Academy Matches & Trials"
        description="Contact SK Tape Ball Academy or submit a free trial booking to get evaluated for upcoming training cohorts."
        primaryLabel="Book Free Trial"
        primaryTo="/book-trial"
        secondaryLabel="Contact Desk"
        secondaryTo="/contact"
      />
    </div>
  );
}
