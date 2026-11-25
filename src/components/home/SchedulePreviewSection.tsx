import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function SchedulePreviewSection() {
  const { state } = useAcademyState();
  const visibleSlots = state.schedules.slice(0, 6);

  return (
    <section aria-labelledby="schedule-preview-heading" className="space-y-8">
      <SectionHeader
        kicker="Training Schedule"
        title="Weekly Training Calendar"
        description={
          visibleSlots.length > 0
            ? 'Live session slots scheduled across our Sabzazar, Lahore training tracks.'
            : 'Sessions are organized by program track and skill readiness. Exact batch timings are shared upon registration and trial confirmation.'
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
                  <tr className="border-b border-[#E2E8F0] bg-[#F5F7FA] text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                    <th className="px-5 py-3.5">Day</th>
                    <th className="px-5 py-3.5">Program &amp; Batch</th>
                    <th className="px-5 py-3.5">Timing</th>
                    <th className="px-5 py-3.5">Coach &amp; Ground</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-sm">
                  {visibleSlots.map((slot) => (
                    <tr key={slot.id} className="hover:bg-[#F5F7FA]/70 transition-colors">
                      <td className="px-5 py-4 font-semibold text-[#071A36]">{slot.day}</td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#071A36]">{slot.programTitle}</p>
                        <p className="text-xs text-[#64748B]">{slot.batchName}</p>
                      </td>
                      <td className="px-5 py-4 font-medium text-[#C8202B] tabular-nums">
                        {slot.timePlaceholder}
                      </td>
                      <td className="px-5 py-4 text-[#071A36]">
                        <p>{slot.coachName}</p>
                        <p className="text-xs text-[#64748B]">{slot.groundZone}</p>
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
                  <h3 className="text-base font-bold text-[#071A36]">{slot.programTitle}</h3>
                  <span className="text-xs font-semibold text-[#C8202B]">{slot.timePlaceholder}</span>
                </div>
                <div className="space-y-1.5 text-xs text-[#64748B]">
                  <p className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[#071A36]" aria-hidden="true" />
                    <span>
                      {slot.day} · {slot.batchName}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#D9A52E]" aria-hidden="true" />
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
            <h3 className="text-lg font-bold text-[#071A36]">
              Batch Timings Assigned After Trial Assessment
            </h3>
            <p className="text-sm leading-relaxed text-[#64748B]">
              Prospective players start with an initial evaluation in Sabzazar, Lahore so coaching staff can assign an appropriate group and weekly training timing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button to="/book-trial" variant="primary" size="sm">
              Request Trial Session
            </Button>
            <Button to="/schedule" variant="outline" size="sm">
              Schedule Details
            </Button>
          </div>
        </Card>
      )}
    </section>
  );
}
