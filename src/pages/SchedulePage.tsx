import { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import {
  SCHEDULE_CATEGORIES,
  SCHEDULE_DAYS,
  SCHEDULE_INFO_GUIDELINES,
  WEEKLY_SCHEDULE_SLOTS,
  type ScheduleCategory,
  type ScheduleDay,
} from '@/src/data/activitiesContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { cn } from '@/src/utils/cn';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function SchedulePage() {
  useDocumentTitle('Training Schedule');
  const [selectedDay, setSelectedDay] = useState<'All' | ScheduleDay>('All');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ScheduleCategory>('All');

  const filteredSlots = WEEKLY_SCHEDULE_SLOTS.filter((slot) => {
    const matchesDay = selectedDay === 'All' || slot.day === selectedDay;
    const matchesCat =
      selectedCategory === 'All' || slot.programCategory === selectedCategory;
    return matchesDay && matchesCat;
  });

  function resetFilters() {
    setSelectedDay('All');
    setSelectedCategory('All');
  }

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Training Schedule' }]}
        kicker="Weekly Timetable (Sample Placeholders)"
        title="Training Schedule & Session Structure"
        description="Structured weekly training framework across batting, pace, spin, fielding, keeping, and match simulations. Official batch timings and availability remain clearly labelled placeholders until confirmed."
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

      {/* Interactive Filters & Schedule Layout */}
      <section aria-labelledby="weekly-schedule-heading" className="space-y-6">
        <SectionHeader
          kicker="Day-Wise Presentation"
          title="Weekly Practice Schedule (Placeholder Data)"
          description="Filter by day or training category. Data structure is prepared for live Supabase schedule updates."
        />

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white p-1.5">
            <button
              type="button"
              onClick={() => setSelectedDay('All')}
              className={cn(
                'rounded-[8px] px-3 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap',
                selectedDay === 'All'
                  ? 'bg-[#071A36] text-white'
                  : 'text-[#64748B] hover:text-[#071A36] hover:bg-[#F5F7FA]',
              )}
            >
              All Days
            </button>
            {SCHEDULE_DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={cn(
                  'rounded-[8px] px-3 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap',
                  selectedDay === day
                    ? 'bg-[#071A36] text-white'
                    : 'text-[#64748B] hover:text-[#071A36] hover:bg-[#F5F7FA]',
                )}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white p-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={cn(
                'rounded-[8px] px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
                selectedCategory === 'All'
                  ? 'bg-[#D9A52E] text-[#050D1B] font-semibold'
                  : 'text-[#64748B] hover:text-[#071A36] hover:bg-[#F5F7FA]',
              )}
            >
              All Categories
            </button>
            {SCHEDULE_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'rounded-[8px] px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
                  selectedCategory === category
                    ? 'bg-[#D9A52E] text-[#050D1B] font-semibold'
                    : 'text-[#64748B] hover:text-[#071A36] hover:bg-[#F5F7FA]',
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredSlots.length === 0 ? (
          <Card padding="lg" className="text-center space-y-3">
            <p className="text-base font-bold text-[#071A36]">
              No Schedule Slots Match Current Filters
            </p>
            <p className="text-sm text-[#64748B]">
              Try selecting another day or reset filters to view all placeholder session slots.
            </p>
            <div className="pt-1">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset Schedule Filters
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Desktop Table Presentation */}
            <Card padding="sm" className="hidden lg:block overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F5F7FA] text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      <th className="px-5 py-3.5">Day</th>
                      <th className="px-5 py-3.5">Program Category</th>
                      <th className="px-5 py-3.5">Batch (Placeholder)</th>
                      <th className="px-5 py-3.5">Timing (Placeholder)</th>
                      <th className="px-5 py-3.5">Zone &amp; Session Focus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-sm">
                    {filteredSlots.map((slot) => (
                      <tr key={slot.id} className="hover:bg-[#F5F7FA]/70 transition-colors">
                        <td className="px-5 py-4 font-bold text-[#071A36] whitespace-nowrap">
                          {slot.day}
                        </td>
                        <td className="px-5 py-4 font-semibold text-[#C8202B] whitespace-nowrap">
                          {slot.programCategory}
                        </td>
                        <td className="px-5 py-4 text-[#071A36]">{slot.batchPlaceholder}</td>
                        <td className="px-5 py-4 font-medium text-[#64748B] tabular-nums whitespace-nowrap">
                          {slot.timingPlaceholder}
                        </td>
                        <td className="px-5 py-4 space-y-1">
                          <p className="text-xs font-semibold text-[#071A36]">
                            {slot.zonePlaceholder}
                          </p>
                          <p className="text-xs text-[#64748B]">{slot.focusSummary}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Mobile & Tablet Day Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
              {filteredSlots.map((slot) => (
                <Card key={slot.id} padding="md" className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#071A36]">
                      <Calendar className="h-4 w-4 text-[#D9A52E]" aria-hidden="true" />
                      <span>{slot.day}</span>
                    </span>
                    <span className="text-xs font-semibold text-[#C8202B]">
                      {slot.programCategory}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-[#071A36]">{slot.batchPlaceholder}</p>
                  <p className="text-xs leading-relaxed text-[#64748B]">{slot.focusSummary}</p>

                  <div className="border-t border-[#E2E8F0] pt-3 space-y-1.5 text-xs text-[#64748B]">
                    <p className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-[#071A36]" aria-hidden="true" />
                      <span>{slot.timingPlaceholder}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[#D9A52E]" aria-hidden="true" />
                      <span>{slot.zonePlaceholder}</span>
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Schedule Information Section */}
      <section aria-labelledby="schedule-info-heading" className="space-y-8">
        <SectionHeader
          kicker="Session Policies"
          title="Training Schedule Information"
          description="Important guidelines for batch placement, reporting discipline, and timing confirmations."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SCHEDULE_INFO_GUIDELINES.map((item) => (
            <Card key={item.title} tone="muted" padding="lg" className="space-y-2.5">
              <h3 className="text-base font-bold text-[#071A36]">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[#64748B]">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Ready to Confirm Your Preferred Batch Slot?"
        description="Submit a registration inquiry or book a free trial assessment to receive verified timing updates once published."
        primaryLabel="Register Now"
        primaryTo="/register"
        secondaryLabel="Book Free Trial"
        secondaryTo="/book-trial"
      />
    </div>
  );
}
