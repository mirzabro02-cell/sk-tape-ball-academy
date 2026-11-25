import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TrainingProgramDetail } from '@/src/data/academyInfo';
import { Card } from '@/src/components/ui/Card';

export interface ProgramCardProps {
  program: TrainingProgramDetail;
}

export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Card interactive padding="lg" className="h-full flex flex-col justify-between gap-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-bold tracking-wider text-[#C8202B] dark:text-[#D5A52B]">
            {program.code} · {program.category}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-[#07152C] dark:text-white">{program.title}</h3>
          <p className="text-xs font-medium text-[#64748B] dark:text-[#7F95B8]">
            {program.focusLabel}
          </p>
        </div>

        <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
          {program.shortDescription}
        </p>

        <ul className="border-t border-[#E2E8F0] pt-4 space-y-1.5 text-xs text-[#07152C] dark:border-white/10 dark:text-white/85">
          {program.skillsCovered.slice(0, 2).map((skill) => (
            <li key={skill} className="flex items-start gap-2">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D5A52B]"
                aria-hidden="true"
              />
              <span>{skill}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-1">
        <Link
          to={`/programs/${program.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#07152C] hover:text-[#C8202B] dark:text-[#D5A52B] dark:hover:text-white transition-colors"
        >
          <span>View Program Details</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}
