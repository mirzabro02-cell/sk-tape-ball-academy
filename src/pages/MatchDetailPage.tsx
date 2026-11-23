import { ArrowLeft, CalendarDays, MapPin, Trophy, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { MATCHES_EVENTS_DATA } from '@/src/data/activitiesContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { PageHero } from '@/src/components/ui/PageHero';

export function MatchDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const eventItem = MATCHES_EVENTS_DATA.find((item) => item.slug === slug);

  useDocumentTitle(eventItem ? eventItem.titlePlaceholder : 'Event Not Found');

  if (!eventItem) {
    return (
      <Card className="mx-auto max-w-xl text-center space-y-4" padding="lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#C8202B]">
          Event Not Found
        </p>
        <h1 className="text-2xl font-bold text-[#071A36]">
          Requested Match or Event Unavailable
        </h1>
        <p className="text-sm text-[#64748B]">
          The requested match or event slug could not be found. Return to the Matches &amp; Events directory to view active placeholders.
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

  const primaryAction =
    eventItem.ctaType === 'trial'
      ? { label: 'Book Free Trial', to: '/book-trial' }
      : eventItem.ctaType === 'register'
        ? { label: 'Register Interest', to: '/register' }
        : { label: 'Enquire About Event', to: '/contact' };

  return (
    <div className="space-y-12 sm:space-y-16">
      <PageHero
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Matches & Events', to: '/matches' },
          { label: eventItem.titlePlaceholder },
        ]}
        kicker={eventItem.statusBadge}
        title={eventItem.titlePlaceholder}
        description={eventItem.fullDescription}
        actions={
          <>
            <Button to={primaryAction.to} variant="primary" size="lg">
              {primaryAction.label}
            </Button>
            <Button to="/matches" variant="outlineLight" size="lg">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>All Matches &amp; Events</span>
            </Button>
          </>
        }
        aside={
          <div className="aspect-[16/10] w-full overflow-hidden rounded-[16px] border border-white/15 bg-[#050D1B]">
            <MediaImage
              src={eventItem.imageSrc}
              alt={eventItem.imageAlt}
              fallbackLabel={eventItem.titlePlaceholder}
              className="h-full w-full"
            />
          </div>
        }
      />

      {/* Event Metadata & Participants */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5 space-y-4" padding="lg">
          <h2 className="text-lg font-bold text-[#071A36]">Event Information</h2>
          <div className="space-y-3 border-t border-[#E2E8F0] pt-4 text-sm text-[#64748B]">
            <p className="flex items-start gap-2.5">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#071A36]" aria-hidden="true" />
              <span>
                <strong className="text-[#071A36]">Date &amp; Time:</strong>{' '}
                {eventItem.datePlaceholder}
              </span>
            </p>
            <p className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
              <span>
                <strong className="text-[#071A36]">Location:</strong>{' '}
                {eventItem.locationPlaceholder}
              </span>
            </p>
            <p className="flex items-start gap-2.5">
              <Trophy className="mt-0.5 h-4 w-4 shrink-0 text-[#C8202B]" aria-hidden="true" />
              <span>
                <strong className="text-[#071A36]">Match Status:</strong>{' '}
                {eventItem.statusBadge}
              </span>
            </p>
          </div>
        </Card>

        <Card className="lg:col-span-7 space-y-4" padding="lg">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#071A36]" aria-hidden="true" />
            <h2 className="text-lg font-bold text-[#071A36]">
              Teams / Participants (Placeholders)
            </h2>
          </div>
          <ul className="space-y-2.5 border-t border-[#E2E8F0] pt-4">
            {eventItem.participantsPlaceholder.map((participant) => (
              <li
                key={participant}
                className="rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] px-4 py-3 text-sm font-medium text-[#071A36]"
              >
                {participant}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Results / Scorecard Section */}
      <Card padding="lg" className="space-y-4">
        <h2 className="text-xl font-bold text-[#071A36]">
          Results &amp; Scorecard Status
        </h2>
        <p className="text-sm text-[#64748B]">{eventItem.scorecardNote}</p>

        {eventItem.scorecardRowsPlaceholder.length > 0 && (
          <div className="overflow-x-auto border-t border-[#E2E8F0] pt-4">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  <th className="py-2.5 pr-4">Innings</th>
                  <th className="py-2.5 pr-4">Team / Squad</th>
                  <th className="py-2.5">Scorecard Summary (Placeholder)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {eventItem.scorecardRowsPlaceholder.map((row) => (
                  <tr key={row.inningLabel}>
                    <td className="py-3 pr-4 font-semibold text-[#071A36]">
                      {row.inningLabel}
                    </td>
                    <td className="py-3 pr-4 text-[#64748B]">{row.teamLabel}</td>
                    <td className="py-3 font-medium text-[#C8202B] tabular-nums">
                      {row.summaryPlaceholder}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <CtaBanner
        title="Want Updates on Fixtures &amp; Open Trials?"
        description="Contact SK Tape Ball Academy or register for upcoming assessment camps."
        primaryLabel={primaryAction.label}
        primaryTo={primaryAction.to}
        secondaryLabel="Contact Desk"
        secondaryTo="/contact"
      />
    </div>
  );
}
