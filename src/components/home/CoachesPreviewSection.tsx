import { ArrowRight, UserRound } from 'lucide-react';
import { COACHES_PREVIEW_PLACEHOLDERS } from '@/src/data/homeContent';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function CoachesPreviewSection() {
  return (
    <section aria-labelledby="coaches-preview-heading" className="space-y-8">
      <SectionHeader
        kicker="Coaching Leadership"
        title="Meet the Coaching Staff"
        description="Coach profile slots below are clearly marked placeholders awaiting verified staff names, credentials, and official portraits."
        action={
          <Button to="/coaches" variant="outline">
            <span>View All Coaches</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {COACHES_PREVIEW_PLACEHOLDERS.map((coach) => (
          <Card key={coach.id} interactive padding="sm" className="overflow-hidden flex flex-col">
            <div className="aspect-[4/3] w-full rounded-[12px] border border-[#E2E8F0] bg-[#071A36] flex flex-col items-center justify-center gap-2.5 text-center p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D9A52E]/40 bg-[#050D1B] text-[#D9A52E]">
                <UserRound className="h-7 w-7" aria-hidden="true" />
              </div>
              <span className="text-xs font-medium tracking-wide text-white/80">
                Coach Image Placeholder
              </span>
            </div>

            <div className="p-4 sm:p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-[#C8202B]">
                  {coach.rolePlaceholder}
                </p>
                <h3 className="text-lg font-bold text-[#071A36]">
                  {coach.namePlaceholder}
                </h3>
                <p className="text-xs font-medium text-[#071A36]/80">
                  {coach.specialtyPlaceholder}
                </p>
              </div>
              <div className="pt-2 space-y-3">
                <p className="text-sm leading-relaxed text-[#64748B]">
                  {coach.bioPlaceholder}
                </p>
                <Button to={`/coaches/${coach.slug}`} variant="outline" size="sm" fullWidth>
                  <span>View Profile</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
