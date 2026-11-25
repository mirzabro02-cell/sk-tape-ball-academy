import { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import {
  SCHEDULE_DAYS,
  SCHEDULE_INFO_GUIDELINES,
  type ScheduleDay,
} from '@/src/data/activitiesContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { cn } from '@/src/utils/cn';
import { RevealSection } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function SchedulePage() {
  useDocumentTitle('Training Schedule');
  const { state } = useAcademyState();
  const [selectedDay, setSelectedDay] = useState<'All' | ScheduleDay>('All');

  const schedules = state.schedules;
  const filteredSlots = schedules.filter(
    (slot) => selectedDay === 'All' || slot.day === selectedDay,
  );

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Training Schedule' }]}
        kicker="Weekly Timetable"
        title="Training Schedule & Session Structure"
        description="Organized weekly coaching across athletic fitness, batting drill progressions, pace and spin bowling, catching stations, and match play."
        actions={
          <>
            <Button to="/register" variant="primary" size="lg">
              Register Now
            </Button>
            <Button to="/programs" variant="outlineLight" size="lg">
              Explore Programs
            </Button>
          </>
        }
      />

      <RevealSection>
        {schedules.length > 0 ? (
          <section aria-labelledby="weekly-schedule-heading" className="space-y-6">
            <SectionHeader
              id="weekly-schedule-heading"
              kicker="Published Timetable"
              title="Active Weekly Practice Slots"
              description="Filter published academy batches by training day."
            />

            <div className="flex flex-wrap items-center gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white p-1.5 w-fit dark:border-white/10 dark:bg-[#0F213B]">
              <button
                type="button"
                onClick={() => setSelectedDay('All')}
                className={cn(
                  'rounded-[8px] px-3 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap',
                  selectedDay === 'All'
                    ? 'bg-[#07152C] text-white dark:bg-[#D5A52B] dark:text-[#07152C]'
                    : 'text-[#64748B] hover:text-[#07152C] hover:bg-[#F5F7FA] dark:text-[#B4C4DC] dark:hover:text-white dark:hover:bg-white/5',
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
                      ? 'bg-[#07152C] text-white dark:bg-[#D5A52B] dark:text-[#07152C]'
                      : 'text-[#64748B] hover:text-[#07152C] hover:bg-[#F5F7FA] dark:text-[#B4C4DC] dark:hover:text-white dark:hover:bg-white/5',
                  )}
                >
                  {day}
                </button>
              ))}
            </div>

            {filteredSlots.length === 0 ? (
              <Card padding="lg" className="text-center space-y-3">
                <p className="text-base font-bold text-[#07152C] dark:text-white">
                  No Sessions Scheduled on {selectedDay}
                </p>
                <Button variant="outline" size="sm" onClick={() => setSelectedDay('All')}>
                  Show All Days
                </Button>
              </Card>
            ) : (
              <>
                <Card padding="sm" className="hidden lg:block overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] bg-[#F5F7FA] text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:border-white/10 dark:bg-[#07152C] dark:text-[#7F95B8]">
                          <th className="px-5 py-3.5">Day</th>
                          <th className="px-5 py-3.5">Program Track</th>
                          <th className="px-5 py-3.5">Batch</th>
                          <th className="px-5 py-3.5">Time Window</th>
                          <th className="px-5 py-3.5">Zone &amp; Coach</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0] text-sm dark:divide-white/10">
                        {filteredSlots.map((slot) => (
                          <tr
                            key={slot.id}
                            className="hover:bg-[#F5F7FA]/70 dark:hover:bg-white/[0.03] transition-colors"
                          >
                            <td className="px-5 py-4 font-bold text-[#07152C] dark:text-white whitespace-nowrap">
                              {slot.day}
                            </td>
                            <td className="px-5 py-4 font-semibold text-[#C8202B] dark:text-[#D5A52B] whitespace-nowrap">
                              {slot.programTitle}
                            </td>
                            <td className="px-5 py-4 text-[#07152C] dark:text-white/90">
                              {slot.batchName}
                            </td>
                            <td className="px-5 py-4 font-medium text-[#475569] dark:text-[#B4C4DC] tabular-nums whitespace-nowrap">
                              {slot.timePlaceholder}
                            </td>
                            <td className="px-5 py-4 text-xs text-[#475569] dark:text-[#B4C4DC]">
                              <span className="font-semibold text-[#07152C] dark:text-white">
                                {slot.groundZone}
                              </span>
                              {slot.coachName ? ` · ${slot.coachName}` : ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
                  {filteredSlots.map((slot) => (
                    <Card key={slot.id} padding="md" className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#07152C] dark:text-white">
                          <Calendar className="h-4 w-4 text-[#D5A52B]" aria-hidden="true" />
                          <span>{slot.day}</span>
                        </span>
                        <span className="text-xs font-semibold text-[#C8202B] dark:text-[#D5A52B]">
                          {slot.programTitle}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-[#07152C] dark:text-white">
                        {slot.batchName}
                      </p>

                      <div className="border-t border-[#E2E8F0] pt-3 space-y-1.5 text-xs text-[#475569] dark:border-white/10 dark:text-[#B4C4DC]">
                        <p className="flex items-center gap-2">
                          <Clock
                            className="h-3.5 w-3.5 text-[#07152C] dark:text-[#D5A52B]"
                            aria-hidden="true"
                          />
                          <span>{slot.timePlaceholder}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-[#D5A52B]" aria-hidden="true" />
                          <span>
                            {slot.groundZone}
                            {slot.coachName ? ` · ${slot.coachName}` : ''}
                          </span>
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </section>
        ) : (
          <section aria-labelledby="schedule-structure-heading" className="space-y-6">
            <SectionHeader
              id="schedule-structure-heading"
              kicker="Session Structure"
              title="Batch Placement & Timing Requests"
              description="Official ground batch timings are assigned individually after registration review and cohort grouping in Sabzazar, Lahore."
            />

            <Card
              tone="muted"
              padding="lg"
              className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#07152C] dark:text-white">
                  Preferred Training Windows Available During Application
                </h3>
                <p className="max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                  Select your preferred morning, afternoon, evening, or weekend window when submitting your admission form. Academy staff confirm your exact lane and session time once evaluated.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Button to="/register" variant="primary" size="md">
                  Register Now
                </Button>
                <Button to="/contact" variant="outline" size="md">
                  Enquire Directly
                </Button>
              </div>
            </Card>
          </section>
        )}
      </RevealSection>

      {/* Schedule Information Section */}
      <RevealSection>
        <section aria-labelledby="schedule-info-heading" className="space-y-8">
          <SectionHeader
            id="schedule-info-heading"
            kicker="Session Policies"
            title="Training Schedule Guidelines"
            description="How weekly sessions combine athletic conditioning, structured drill blocks, and match preparation."
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SCHEDULE_INFO_GUIDELINES.map((item) => (
              <Card key={item.title} tone="muted" padding="lg" className="space-y-2.5">
                <h3 className="text-base font-bold text-[#07152C] dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </section>
      </RevealSection>

      <CtaBanner
        title="Ready to Confirm Your Training Batch?"
        description="Complete your registration application to receive confirmed session timings in Sabzazar, Lahore."
        primaryLabel="Register Now"
        primaryTo="/register"
        secondaryLabel="Contact Academy"
        secondaryTo="/contact"
      />
    </div>
  );
}
