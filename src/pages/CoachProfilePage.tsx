import { ArrowLeft, CheckCircle2, UserRound } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { COACHES_DATA, TRAINING_PROGRAMS_DATA } from '@/src/data/academyInfo';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { ProgramCard } from '@/src/components/academy/ProgramCard';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function CoachProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const coach = COACHES_DATA.find((item) => item.slug === slug);

  useDocumentTitle(coach ? coach.rolePlaceholder : 'Coach Profile Not Found');

  if (!coach) {
    return (
      <Card className="mx-auto max-w-xl text-center space-y-4" padding="lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#C8202B]">
          Profile Not Found
        </p>
        <h1 className="text-2xl font-bold text-[#071A36]">
          Coach Profile Placeholder Unavailable
        </h1>
        <p className="text-sm text-[#64748B]">
          The requested coach profile route could not be found. Return to the coaches directory to view available profile placeholders.
        </p>
        <div className="pt-2 flex justify-center">
          <Button to="/coaches" variant="primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Coaches</span>
          </Button>
        </div>
      </Card>
    );
  }

  const relatedPrograms = TRAINING_PROGRAMS_DATA.filter((program) =>
    coach.relatedProgramSlugs.includes(program.slug),
  );

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Coaches', to: '/coaches' },
          { label: coach.namePlaceholder },
        ]}
        kicker={coach.rolePlaceholder}
        title={coach.namePlaceholder}
        description={coach.experiencePlaceholder}
        actions={
          <>
            <Button to="/book-trial" variant="primary" size="lg">
              Book Free Trial
            </Button>
            <Button to="/coaches" variant="outlineLight" size="lg">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>All Coaches</span>
            </Button>
          </>
        }
        aside={
          <div className="aspect-[4/3] w-full rounded-[16px] border border-white/15 bg-[#050D1B] flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D9A52E]/50 bg-[#071A36] text-[#D9A52E]">
              <UserRound className="h-8 w-8" aria-hidden="true" />
            </div>
            <p className="text-xs font-medium text-white/80">
              {coach.imagePlaceholderLabel}
            </p>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7 space-y-4" padding="lg">
          <h2 className="text-xl font-bold text-[#071A36]">Biography (Placeholder)</h2>
          <p className="text-sm sm:text-base leading-relaxed text-[#64748B]">
            {coach.biographyPlaceholder}
          </p>
          <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 text-xs text-[#64748B]">
            <strong className="text-[#071A36]">Experience &amp; Qualifications:</strong>{' '}
            {coach.experiencePlaceholder}
          </div>
        </Card>

        <Card className="lg:col-span-5 space-y-4" padding="lg">
          <h2 className="text-xl font-bold text-[#071A36]">Coaching Specialties</h2>
          <ul className="space-y-3 border-t border-[#E2E8F0] pt-4">
            {coach.specialties.map((specialty) => (
              <li key={specialty} className="flex items-start gap-2.5 text-sm text-[#071A36]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
                <span>{specialty}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {relatedPrograms.length > 0 && (
        <section aria-labelledby="coach-programs-heading" className="space-y-6">
          <SectionHeader
            kicker="Associated Tracks"
            title="Related Training Programs"
            description="Training disciplines aligned with this coaching role."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedPrograms.map((program) => (
              <ProgramCard key={program.slug} program={program} />
            ))}
          </div>
        </section>
      )}

      <CtaBanner
        title="Ready to Train With SK Tape Ball Academy?"
        description="Book a free trial session or browse our complete training program directory."
        primaryLabel="Book Free Trial"
        primaryTo="/book-trial"
        secondaryLabel="Explore Programs"
        secondaryTo="/programs"
      />
    </div>
  );
}
