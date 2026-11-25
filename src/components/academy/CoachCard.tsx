import { ArrowRight, UserRound } from 'lucide-react';
import type { CoachProfileData } from '@/src/data/academyInfo';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

export interface CoachCardProps {
  coach: CoachProfileData;
}

export function CoachCard({ coach }: CoachCardProps) {
  return (
    <Card interactive padding="sm" className="overflow-hidden flex flex-col">
      <div className="aspect-[4/3] w-full rounded-[12px] border border-[#E2E8F0] bg-[#071A36] flex flex-col items-center justify-center gap-2.5 text-center p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#D9A52E]/40 bg-[#050D1B] text-[#D9A52E]">
          <UserRound className="h-7 w-7" aria-hidden="true" />
        </div>
        <span className="text-xs font-medium tracking-wide text-white/80">
          {coach.imagePlaceholderLabel}
        </span>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#C8202B]">
            {coach.rolePlaceholder}
          </p>
          <h3 className="text-lg font-bold text-[#071A36]">
            {coach.namePlaceholder}
          </h3>
          <p className="text-xs text-[#64748B]">{coach.experiencePlaceholder}</p>
          <p className="pt-1 text-sm leading-relaxed text-[#64748B]">
            {coach.biographyPlaceholder}
          </p>
        </div>

        <div className="border-t border-[#E2E8F0] pt-4">
          <Button to={`/coaches/${coach.slug}`} variant="outline" size="sm" fullWidth>
            <span>View Profile</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
