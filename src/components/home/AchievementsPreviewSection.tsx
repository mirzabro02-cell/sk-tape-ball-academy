import { ArrowRight, Award, UserCheck } from 'lucide-react';
import { ACHIEVEMENTS_PREVIEW_PLACEHOLDERS } from '@/src/data/homeContent';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function AchievementsPreviewSection() {
  return (
    <section aria-labelledby="achievements-preview-heading" className="space-y-8">
      <SectionHeader
        kicker="Achievements & Recognition"
        title="Honors & Player Milestones"
        description="Placeholder cards reserved for verified academy tournament honors and official player progression records."
        action={
          <Button to="/achievements" variant="outline">
            <span>View All Achievements</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {ACHIEVEMENTS_PREVIEW_PLACEHOLDERS.map((item) => (
          <Card key={item.id} interactive padding="lg" className="flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#C8202B]">
                  {item.categoryLabel}
                </span>
                <Award className="h-5 w-5 text-[#D9A52E]" aria-hidden="true" />
              </div>

              <h3 className="text-lg font-bold text-[#071A36]">
                {item.titlePlaceholder}
              </h3>

              <p className="text-sm leading-relaxed text-[#64748B]">
                {item.summaryPlaceholder}
              </p>
            </div>

            <div className="flex items-center gap-3 border-t border-[#E2E8F0] pt-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F7FA] border border-[#E2E8F0] text-[#071A36]">
                <UserCheck className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#071A36] truncate">
                  {item.playerPlaceholder}
                </p>
                <p className="text-[11px] text-[#64748B]">Verified Record Pending</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
