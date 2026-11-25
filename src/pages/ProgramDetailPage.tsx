import { ArrowLeft, CheckCircle2, Target, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { TRAINING_PROGRAMS_DATA } from '@/src/data/academyInfo';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { ProgramCard } from '@/src/components/academy/ProgramCard';
import { RevealSection } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function ProgramDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useAcademyState();
  const program = TRAINING_PROGRAMS_DATA.find((item) => item.slug === slug);

  useDocumentTitle(program ? program.title : 'Program Not Found');

  if (!program) {
    return (
      <Card className="mx-auto max-w-xl text-center space-y-4" padding="lg">
        <p className="text-xs font-bold uppercase tracking-wider text-[#C8202B] dark:text-[#D5A52B]">
          Program Not Found
        </p>
        <h1 className="text-2xl font-bold text-[#07152C] dark:text-white">
          Requested Training Program Unavailable
        </h1>
        <p className="text-sm text-[#475569] dark:text-[#B4C4DC]">
          The program path you entered does not match an active curriculum track. Return to the programs directory to view all nine training tracks.
        </p>
        <div className="pt-2 flex justify-center">
          <Button to="/programs" variant="primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to All Programs</span>
          </Button>
        </div>
      </Card>
    );
  }

  const managedProgram = state.programs.find(
    (p) =>
      p.code === program.code ||
      p.title.trim().toLowerCase() === program.title.trim().toLowerCase(),
  );

  const relatedPrograms = TRAINING_PROGRAMS_DATA.filter((item) =>
    program.relatedSlugs.includes(item.slug),
  );

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Programs', to: '/programs' },
          { label: program.title },
        ]}
        kicker={`${program.code} · ${program.category}`}
        title={program.title}
        description={program.introduction}
        actions={
          <>
            <Button to="/register" variant="primary" size="lg">
              Register for This Program
            </Button>
            <Button to="/fees" variant="outlineLight" size="lg">
              Fees &amp; Plans
            </Button>
            <Button to="/programs" variant="outlineLight" size="lg">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>All Programs</span>
            </Button>
          </>
        }
        aside={
          <div className="overflow-hidden rounded-[16px] border border-white/15 bg-[#050D1B]/90">
            {managedProgram?.imagePath && (
              <div className="aspect-[16/9] w-full overflow-hidden border-b border-white/10">
                <MediaImage
                  src={managedProgram.imagePath}
                  alt={program.title}
                  transform={managedProgram.imageTransform}
                  fallbackLabel={program.title}
                  className="h-full w-full"
                />
              </div>
            )}
            <div className="p-5 sm:p-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#D5A52B]">
                Track Focus
              </p>
              <p className="text-sm font-semibold text-white">{program.focusLabel}</p>
              <div className="border-t border-white/10 pt-3 text-xs leading-relaxed text-[#B4C4DC]">
                <strong className="text-white">Onboarding &amp; Batch Info:</strong>{' '}
                {program.scheduleAndFeeNote}
              </div>
            </div>
          </div>
        }
      />

      {/* Skills Covered & Training Objectives */}
      <RevealSection>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card padding="lg" className="space-y-4">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-[#D5A52B]" aria-hidden="true" />
              <h2 className="text-xl font-bold text-[#07152C] dark:text-white">Skills Covered</h2>
            </div>
            <ul className="space-y-3 border-t border-[#E2E8F0] pt-4 dark:border-white/10">
              {program.skillsCovered.map((skill) => (
                <li
                  key={skill}
                  className="flex items-start gap-2.5 text-sm text-[#475569] dark:text-[#B4C4DC]"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#07152C] dark:bg-[#D5A52B]"
                    aria-hidden="true"
                  />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card padding="lg" className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Target className="h-5 w-5 text-[#C8202B] dark:text-[#D5A52B]" aria-hidden="true" />
              <h2 className="text-xl font-bold text-[#07152C] dark:text-white">
                Training Objectives
              </h2>
            </div>
            <ul className="space-y-3 border-t border-[#E2E8F0] pt-4 dark:border-white/10">
              {program.trainingObjectives.map((objective) => (
                <li
                  key={objective}
                  className="flex items-start gap-2.5 text-sm text-[#475569] dark:text-[#B4C4DC]"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8202B] dark:bg-[#D5A52B]"
                    aria-hidden="true"
                  />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </RevealSection>

      {/* Suitable Players & Training Approach */}
      <RevealSection>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card tone="muted" padding="lg" className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Users className="h-5 w-5 text-[#07152C] dark:text-[#D5A52B]" aria-hidden="true" />
              <h2 className="text-xl font-bold text-[#07152C] dark:text-white">
                Suitable Players
              </h2>
            </div>
            <ul className="space-y-3 border-t border-[#E2E8F0] pt-4 dark:border-white/10">
              {program.suitablePlayers.map((audience) => (
                <li
                  key={audience}
                  className="flex items-start gap-2.5 text-sm text-[#07152C] dark:text-[#E2E8F0]"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D5A52B]"
                    aria-hidden="true"
                  />
                  <span>{audience}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card padding="lg" className="space-y-4">
            <h2 className="text-xl font-bold text-[#07152C] dark:text-white">Training Approach</h2>
            <ol className="space-y-3 border-t border-[#E2E8F0] pt-4 dark:border-white/10">
              {program.trainingApproach.map((step, idx) => (
                <li
                  key={step}
                  className="flex items-start gap-3 text-sm text-[#475569] dark:text-[#B4C4DC]"
                >
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-[#07152C] text-xs font-bold text-[#D5A52B] dark:bg-[#162B4D]">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </RevealSection>

      {/* Related Programs */}
      {relatedPrograms.length > 0 && (
        <RevealSection>
          <section aria-labelledby="related-programs-heading" className="space-y-6">
            <SectionHeader
              id="related-programs-heading"
              kicker="Continue Exploring"
              title="Related Training Programs"
              description="Complementary disciplines and progression tracks within SK Tape Ball Academy."
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedPrograms.map((related) => (
                <ProgramCard key={related.slug} program={related} />
              ))}
            </div>
          </section>
        </RevealSection>
      )}

      <CtaBanner
        title={`Interested in ${program.title}?`}
        description="Submit a registration application or browse our full training schedule to discuss batch placement."
        primaryLabel="Register Now"
        primaryTo="/register"
        secondaryLabel="Training Schedule"
        secondaryTo="/schedule"
      />
    </div>
  );
}
