import { ArrowLeft, CalendarDays, MapPin, Trophy, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { RevealSection } from '@/src/components/motion/MotionPrimitives';
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
        <p className="text-xs font-bold uppercase tracking-wider text-[#C8202B] dark:text-[#D5A52B]">
          Match Not Found
        </p>
        <h1 className="text-2xl font-bold text-[#07152C] dark:text-white">
          Requested Match or Event Unavailable
        </h1>
        <p className="text-sm text-[#475569] dark:text-[#B4C4DC]">
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
            <Button to="/register" variant="primary" size="lg">
              Register Now
            </Button>
            <Button to="/matches" variant="outlineLight" size="lg">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>All Matches &amp; Events</span>
            </Button>
          </>
        }
      />

      <RevealSection>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-5 space-y-4" padding="lg">
            <h2 className="text-lg font-bold text-[#07152C] dark:text-white">Match Information</h2>
            <div className="space-y-3 border-t border-[#E2E8F0] pt-4 text-sm text-[#475569] dark:border-white/10 dark:text-[#B4C4DC]">
              <p className="flex items-start gap-2.5">
                <CalendarDays
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#07152C] dark:text-[#D5A52B]"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-[#07152C] dark:text-white">Schedule:</strong>{' '}
                  {match.datePlaceholder}
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A52B]" aria-hidden="true" />
                <span>
                  <strong className="text-[#07152C] dark:text-white">Ground / Venue:</strong>{' '}
                  {match.locationPlaceholder}
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <Trophy
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#C8202B] dark:text-[#D5A52B]"
                  aria-hidden="true"
                />
                <span>
                  <strong className="text-[#07152C] dark:text-white">Status:</strong> {match.status}
                </span>
              </p>
            </div>
          </Card>

          <Card className="lg:col-span-7 space-y-4" padding="lg">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#07152C] dark:text-[#D5A52B]" aria-hidden="true" />
              <h2 className="text-lg font-bold text-[#07152C] dark:text-white">
                Competing Sides &amp; Scores
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 border-t border-[#E2E8F0] pt-4 sm:grid-cols-2 dark:border-white/10">
              <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 space-y-1 dark:border-white/10 dark:bg-[#07152C]">
                <p className="text-xs font-bold uppercase tracking-wider text-[#C8202B] dark:text-[#D5A52B]">
                  Academy Side
                </p>
                <p className="text-base font-bold text-[#07152C] dark:text-white">
                  {match.academyTeam}
                </p>
                {match.academyScore && (
                  <p className="text-sm font-semibold text-[#475569] dark:text-[#B4C4DC]">
                    {match.academyScore}
                  </p>
                )}
              </div>

              <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 space-y-1 dark:border-white/10 dark:bg-[#07152C]">
                <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#7F95B8]">
                  Opponent / Group
                </p>
                <p className="text-base font-bold text-[#07152C] dark:text-white">
                  {match.opponentTeam}
                </p>
                {match.opponentScore && (
                  <p className="text-sm font-semibold text-[#475569] dark:text-[#B4C4DC]">
                    {match.opponentScore}
                  </p>
                )}
              </div>
            </div>

            {match.resultSummary && (
              <div className="rounded-[12px] border border-[#E2E8F0] bg-white p-4 text-sm text-[#07152C] dark:border-white/10 dark:bg-[#162B4D] dark:text-white">
                <strong>Summary:</strong> {match.resultSummary}
              </div>
            )}
          </Card>
        </div>
      </RevealSection>

      <CtaBanner
        title="Join Upcoming Academy Matches & League Cohorts"
        description="Contact SK Tape Ball Academy or submit an online registration to join upcoming training cohorts."
        primaryLabel="Register Now"
        primaryTo="/register"
        secondaryLabel="Contact Desk"
        secondaryTo="/contact"
      />
    </div>
  );
}
