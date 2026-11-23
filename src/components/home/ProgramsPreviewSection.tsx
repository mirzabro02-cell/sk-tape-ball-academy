import { Activity, ArrowRight, Compass, Crosshair, Shield, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TRAINING_PROGRAMS_PREVIEW } from '@/src/data/homeContent';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

const PROGRAM_ICONS = {
  batting: Target,
  'fast-bowling': Zap,
  'spin-bowling': Compass,
  fielding: Crosshair,
  'wicket-keeping': Shield,
  'fitness-agility': Activity,
} as const;

export function ProgramsPreviewSection() {
  return (
    <section aria-labelledby="programs-preview-heading" className="space-y-8">
      <SectionHeader
        kicker="Training Programs"
        title="Focused Disciplines for Every Role"
        description="Six core coaching tracks covering technical skills, tactical match play, and athletic conditioning."
        action={
          <Button to="/programs" variant="outline">
            <span>View All Programs</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TRAINING_PROGRAMS_PREVIEW.map((program) => {
          const Icon =
            PROGRAM_ICONS[program.id as keyof typeof PROGRAM_ICONS] ?? Target;

          return (
            <Card key={program.id} interactive padding="lg" className="flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider text-[#C8202B]">
                    {program.code}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#071A36] text-[#D9A52E]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#071A36]">{program.title}</h3>
                  <p className="text-xs font-medium text-[#64748B]">{program.focusLabel}</p>
                </div>

                <p className="text-sm leading-relaxed text-[#64748B]">
                  {program.description}
                </p>
              </div>

              <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
                <ul className="space-y-1.5 text-xs text-[#071A36]">
                  {program.drills.map((drill) => (
                    <li key={drill} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D9A52E]" aria-hidden="true" />
                      <span>{drill}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/programs/${program.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#071A36] hover:text-[#C8202B] transition-colors"
                >
                  <span>Program Details</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
