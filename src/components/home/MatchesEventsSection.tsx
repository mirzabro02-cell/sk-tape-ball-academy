import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MATCHES_EVENTS_PLACEHOLDERS } from '@/src/data/homeContent';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function MatchesEventsSection() {
  return (
    <section aria-labelledby="matches-events-heading" className="space-y-8">
      <SectionHeader
        kicker="Matches & Events"
        title="Upcoming Fixtures & Academy Events"
        description="Placeholder cards prepared for upcoming practice matches, open trial camps, and verified match recaps."
        action={
          <Button to="/matches" variant="outline">
            <span>View All Events</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {MATCHES_EVENTS_PLACEHOLDERS.map((eventItem) => (
          <Card key={eventItem.id} interactive padding="lg" className="flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#C8202B]">
                {eventItem.statusLabel}
              </p>
              <h3 className="text-lg font-bold text-[#071A36]">
                {eventItem.titlePlaceholder}
              </h3>
              <p className="text-sm leading-relaxed text-[#64748B]">
                {eventItem.notesPlaceholder}
              </p>
            </div>

            <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
              <div className="space-y-2 text-xs text-[#64748B]">
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-3.5 w-3.5 text-[#071A36]" aria-hidden="true" />
                  <span>{eventItem.datePlaceholder}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#D9A52E]" aria-hidden="true" />
                  <span>{eventItem.venuePlaceholder}</span>
                </p>
              </div>

              <Link
                to={`/matches/${eventItem.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#071A36] hover:text-[#C8202B] transition-colors"
              >
                <span>Event Details</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
