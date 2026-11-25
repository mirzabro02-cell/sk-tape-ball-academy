import { Activity, ArrowRight, Crosshair, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { TRAINING_PROGRAMS_PREVIEW } from '@/src/data/homeContent';
import { RevealSection, StaggerGrid, StaggerItem } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

const PROGRAM_ICONS = {
  'fitness-agility': Activity,
  batting: Target,
  'fast-bowling': Zap,
  fielding: Crosshair,
} as const;

export function ProgramsPreviewSection() {
  const { state } = useAcademyState();
  const sectionMeta = state.websiteSections.find((s) => s.id === 'programs');

  const confirmedPrograms = TRAINING_PROGRAMS_PREVIEW.filter((item) => {
    const matched = state.programs.find((p) => p.id === item.programId);
    return matched ? matched.published !== false : true;
  });

  if (confirmedPrograms.length === 0) {
    return null;
  }

  return (
    <RevealSection>
      <section aria-labelledby="programs-preview-heading" className="space-y-8">
        <SectionHeader
          id="programs-preview-heading"
          kicker="Training Programs"
          title={sectionMeta?.headline || 'Core Training Areas'}
          description="Four confirmed coaching tracks focused on conditioning and core tape-ball cricket skills."
          action={
            <Button to="/programs" variant="outline" shape="pill">
              <span>{sectionMeta?.ctaLabel || 'View All Programs'}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <StaggerGrid className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {confirmedPrograms.map((program) => {
            const Icon = PROGRAM_ICONS[program.id as keyof typeof PROGRAM_ICONS] ?? Target;

            return (
              <StaggerItem key={program.id}>
                <Card
                  interactive
                  padding="lg"
                  className="h-full flex flex-col justify-between gap-5"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold tracking-wider text-[#C8202B] dark:text-[#D5A83C]">
                        {program.code}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#07152C] text-[#D5A83C] dark:bg-[#162B4D] dark:border dark:border-white/10">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-[#07152C] dark:text-white">
                      {program.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B8C7DF]">
                      {program.description}
                    </p>
                  </div>

                  <div className="border-t border-[#E2E8F0] pt-3.5 dark:border-white/10">
                    <Link
                      to={`/programs/${program.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#07152C] hover:text-[#C8202B] dark:text-[#D5A83C] dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C] rounded-[4px]"
                    >
                      <span>Program Details</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </section>
    </RevealSection>
  );
}
