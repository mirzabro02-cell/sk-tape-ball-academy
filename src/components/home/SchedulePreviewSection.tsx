import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { RevealSection } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function SchedulePreviewSection() {
  const { state } = useAcademyState();
  const visibleSlots = state.schedules.slice(0, 6);

  return (
    <RevealSection>
      <section aria-labelledby="schedule-preview-heading" className="space-y-8">
        <SectionHeader
          id="schedule-preview-heading"
          kicker="Training Schedule"
          title="Weekly Training Calendar"
          description={
            visibleSlots.length > 0
              ? 'Live session slots scheduled across our Sabzazar, Lahore training tracks.'
              : 'Sessions are organized by program track and skill readiness. Exact batch timings are shared upon registration review.'
          }
          action={
            <Button to="/schedule" variant="outline">
              <span>View Full Schedule</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        {visibleSlots.length > 0 ? (
          <>
            <Card padding="sm" className="hidden md:block overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F5F7FA] text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:border-white/10 dark:bg-[#07152C] dark:text-[#7F95B8]">
                      <th className="px-5 py-3.5">Day</th>
                      <th className="px-5 py-3.5">Program &amp; Batch</th>
                      <th className="px-5 py-3.5">Timing</th>
                      <th className="px-5 py-3.5">Coach &amp; Ground</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-sm dark:divide-white/10">
                    {visibleSlots.map((slot) => (
                      <tr
                        key={slot.id}
                        className="hover:bg-[#F5F7FA]/80 dark:hover:bg-white/[0.03] transition-colors"
                      >
                        <td className="px-5 py-4 font-semibold text-[#07152C] dark:text-white">
                          {slot.day}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#071A36] dark:text-white">
                            {slot.programTitle}
                          </p>
                          <p className="text-xs text-[#64748B] dark:text-[#7F95B8]">
                            {slot.batchName}
                          </p>
                        </td>
                        <td className="px-5 py-4 font-semibold text-[#C8202B] dark:text-[#D5A52B] tabular-nums">
                          {slot.timePlaceholder}
                        </td>
                        <td className="px-5 py-4 text-[#07152C] dark:text-white/90">
                          <p>{slot.coachName}</p>
                          <p className="text-xs text-[#64748B] dark:text-[#7F95B8]">
                            {slot.groundZone}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 md:hidden">
              {visibleSlots.map((slot) => (
                <Card key={slot.id} padding="md" className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-[#07152C] dark:text-white">
                      {slot.programTitle}
                    </h3>
                    <span className="text-xs font-semibold text-[#C8202B] dark:text-[#D5A52B]">
                      {slot.timePlaceholder}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-[#475569] dark:text-[#B4C4DC]">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-[#07152C] dark:text-[#D5A52B]" aria-hidden="true" />
                      <span>
                        {slot.day} · {slot.batchName}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-[#D5A52B]" aria-hidden="true" />
                      <span>
                        {slot.coachName} · {slot.groundZone}
                      </span>
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card padding="lg" className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5 max-w-2xl">
              <h3 className="text-lg font-bold text-[#07152C] dark:text-white">
                Batch Timings Assigned After Registration Review
              </h3>
              <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                Prospective players start with an initial skill and fitness review in Sabzazar, Lahore so coaching staff can assign an appropriate group and weekly training timing.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Button to="/register" variant="primary" size="sm">
                Register Now
              </Button>
              <Button to="/schedule" variant="outline" size="sm">
                Schedule Details
              </Button>
            </div>
          </Card>
        )}
      </section>
    </RevealSection>
  );
}
