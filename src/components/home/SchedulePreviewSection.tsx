import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { SCHEDULE_PREVIEW_PLACEHOLDERS } from '@/src/data/homeContent';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function SchedulePreviewSection() {
  return (
    <section aria-labelledby="schedule-preview-heading" className="space-y-8">
      <SectionHeader
        kicker="Training Schedule"
        title="Weekly Session Structure"
        description="Official batch days and exact training timings will be published once confirmed. Below is the academy session framework."
        action={
          <Button to="/schedule" variant="outline">
            <span>View Full Schedule</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />

      {/* Desktop / Tablet Structured Table */}
      <Card padding="sm" className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F5F7FA] text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                <th className="px-5 py-3.5">Session Track</th>
                <th className="px-5 py-3.5">Days (Placeholder)</th>
                <th className="px-5 py-3.5">Timing (Placeholder)</th>
                <th className="px-5 py-3.5">Primary Focus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-sm">
              {SCHEDULE_PREVIEW_PLACEHOLDERS.map((slot) => (
                <tr key={slot.id} className="hover:bg-[#F5F7FA]/70 transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#071A36]">
                    {slot.sessionLabel}
                  </td>
                  <td className="px-5 py-4 text-[#64748B]">{slot.daysPlaceholder}</td>
                  <td className="px-5 py-4 font-medium text-[#C8202B] tabular-nums">
                    {slot.timingPlaceholder}
                  </td>
                  <td className="px-5 py-4 text-[#071A36]">{slot.focusPlaceholder}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Card Stack */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {SCHEDULE_PREVIEW_PLACEHOLDERS.map((slot) => (
          <Card key={slot.id} padding="md" className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-[#071A36]">{slot.sessionLabel}</h3>
              <span className="text-xs font-semibold text-[#C8202B]">
                {slot.timingPlaceholder}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-[#64748B]">
              <p className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-[#071A36]" aria-hidden="true" />
                <span>{slot.daysPlaceholder}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-[#D9A52E]" aria-hidden="true" />
                <span>{slot.focusPlaceholder}</span>
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
