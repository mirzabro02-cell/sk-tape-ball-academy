import { useState } from 'react';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import { MATCHES_EVENTS_DATA, type MatchEventStatus } from '@/src/data/activitiesContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { cn } from '@/src/utils/cn';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

const EVENT_FILTERS: Array<'All' | MatchEventStatus> = [
  'All',
  'Upcoming Event',
  'Recent Match',
];

export function MatchesPage() {
  useDocumentTitle('Matches & Events');
  const [filter, setFilter] = useState<'All' | MatchEventStatus>('All');

  const upcomingEvents = MATCHES_EVENTS_DATA.filter((item) => item.type === 'Upcoming Event');
  const recentMatches = MATCHES_EVENTS_DATA.filter((item) => item.type === 'Recent Match');

  const showUpcoming = filter === 'All' || filter === 'Upcoming Event';
  const showRecent = filter === 'All' || filter === 'Recent Match';

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Matches & Events' }]}
        kicker="Competition & Academy Activities"
        title="Matches, Trial Camps & Events"
        description="Placeholder directory prepared for upcoming fixtures, trial camps, and verified match recaps. No synthetic match results, dates, or opponents are invented."
        actions={
          <>
            <Button to="/book-trial" variant="primary" size="lg">
              Book Free Trial
            </Button>
            <Button to="/contact" variant="outlineLight" size="lg">
              Match &amp; Fixture Enquiries
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white p-1.5 w-fit">
        {EVENT_FILTERS.map((tab) => (
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
            {tab === 'All' ? 'All Events & Matches' : `${tab}s`}
          </button>
        ))}
      </div>

      {showUpcoming && (
        <section aria-labelledby="upcoming-events-heading" className="space-y-8">
          <SectionHeader
            kicker="Calendar Slots"
            title="Upcoming Events (Placeholders)"
            description="Open any event card to view full details, participant placeholders, and registration links."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {upcomingEvents.map((item) => (
              <Card key={item.slug} interactive padding="sm" className="overflow-hidden flex flex-col">
                <div className="aspect-[16/10] w-full overflow-hidden rounded-[12px]">
                  <MediaImage
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fallbackLabel={item.titlePlaceholder}
                    className="h-full w-full"
                  />
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#C8202B]">{item.statusBadge}</p>
                    <h3 className="text-lg font-bold text-[#071A36]">{item.titlePlaceholder}</h3>
                    <p className="text-sm leading-relaxed text-[#64748B]">
                      {item.shortDescription}
                    </p>
                  </div>

                  <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
                    <div className="space-y-1.5 text-xs text-[#64748B]">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-[#071A36]" aria-hidden="true" />
                        <span>{item.datePlaceholder}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-[#D9A52E]" aria-hidden="true" />
                        <span>{item.locationPlaceholder}</span>
                      </p>
                    </div>

                    <Button to={`/matches/${item.slug}`} variant="outline" size="sm" fullWidth>
                      <span>View Event Details</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {showRecent && (
        <section aria-labelledby="recent-matches-heading" className="space-y-8">
          <SectionHeader
            kicker="Match Archive"
            title="Recent Matches & Clinics (Placeholders)"
            description="Verified match results and official scorecards will appear here once recorded."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {recentMatches.map((item) => (
              <Card key={item.slug} interactive padding="sm" className="overflow-hidden grid grid-cols-1 sm:grid-cols-12">
                <div className="sm:col-span-5 aspect-[4/3] sm:aspect-auto overflow-hidden rounded-[12px]">
                  <MediaImage
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fallbackLabel={item.titlePlaceholder}
                    className="h-full w-full"
                  />
                </div>
                <div className="sm:col-span-7 p-4 sm:p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#C8202B]">{item.statusBadge}</p>
                    <h3 className="text-lg font-bold text-[#071A36]">{item.titlePlaceholder}</h3>
                    <p className="text-sm leading-relaxed text-[#64748B]">
                      {item.shortDescription}
                    </p>
                  </div>

                  <div className="border-t border-[#E2E8F0] pt-3 space-y-3">
                    <p className="text-xs text-[#64748B]">{item.datePlaceholder}</p>
                    <Button to={`/matches/${item.slug}`} variant="secondary" size="sm" fullWidth>
                      <span>View Match Details</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <CtaBanner
        title="Interested in Upcoming Trial Camps or Practice Fixtures?"
        description="Book a free trial assessment or contact the academy desk for upcoming event confirmations."
        primaryLabel="Book Free Trial"
        primaryTo="/book-trial"
        secondaryLabel="Contact Academy"
        secondaryTo="/contact"
      />
    </div>
  );
}
