import { ArrowLeft, CheckCircle2, UserRound } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { TRAINING_PROGRAMS_DATA } from '@/src/data/academyInfo';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { ProgramCard } from '@/src/components/academy/ProgramCard';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function CoachProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useAcademyState();

  const coach = state.coaches.find(
    (item) => item.published !== false && (item.slug === slug || item.id === slug),
  );

  useDocumentTitle(coach ? `${coach.fullName} — ${coach.roleTitle}` : 'Coach Profile Unavailable');

  if (!coach) {
    return (
      <Card className="mx-auto max-w-xl text-center space-y-4" padding="lg">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#C8202B]">
          Profile Unavailable
        </p>
        <h1 className="text-2xl font-bold text-[#071A36]">
          Coach Profile Not Found
        </h1>
        <p className="text-sm text-[#64748B]">
          This coaching profile is either unavailable or has not been published yet. Return to the Coaches directory to view published staff profiles.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Button to="/coaches" variant="primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Coaches</span>
          </Button>
          <Button to="/book-trial" variant="outline">
            Book Free Trial
          </Button>
        </div>
      </Card>
    );
  }

  const relatedPrograms = TRAINING_PROGRAMS_DATA.filter((program) =>
    coach.assignedPrograms.some(
      (assigned) =>
        assigned.toLowerCase() === program.title.toLowerCase() ||
        assigned.toLowerCase() === program.slug.toLowerCase(),
    ),
  );

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Coaches', to: '/coaches' },
          { label: coach.fullName },
        ]}
        kicker={coach.roleTitle}
        title={coach.fullName}
        description={
          coach.experienceLabel ||
          'Verified coaching staff member at SK Tape Ball Academy.'
        }
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
          coach.imageSrc ? (
            <div className="aspect-[4/3] w-full overflow-hidden rounded-[16px] border border-white/15 bg-[#050D1B]">
              <MediaImage
                src={coach.imageSrc}
                alt={coach.fullName}
                transform={coach.imageTransform}
                fallbackLabel={coach.fullName}
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className="aspect-[4/3] w-full rounded-[16px] border border-white/15 bg-[#050D1B] flex flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D9A52E]/50 bg-[#071A36] text-[#D9A52E] text-xl font-bold">
                {coach.avatarLabel || <UserRound className="h-8 w-8" aria-hidden="true" />}
              </div>
              <p className="text-xs font-medium text-white/80">{coach.roleTitle}</p>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7 space-y-4" padding="lg">
          <h2 className="text-xl font-bold text-[#071A36]">Coaching Profile</h2>
          <p className="text-sm sm:text-base leading-relaxed text-[#64748B]">
            {coach.bio || 'Official profile published by SK Tape Ball Academy.'}
          </p>
          {coach.experienceLabel && (
            <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 text-xs text-[#64748B]">
              <strong className="text-[#071A36]">Experience &amp; Background:</strong>{' '}
              {coach.experienceLabel}
            </div>
          )}
        </Card>

        <Card className="lg:col-span-5 space-y-4" padding="lg">
          <h2 className="text-xl font-bold text-[#071A36]">Coaching Specialties</h2>
          {coach.specialties.length > 0 ? (
            <ul className="space-y-3 border-t border-[#E2E8F0] pt-4">
              {coach.specialties.map((specialty) => (
                <li key={specialty} className="flex items-start gap-2.5 text-sm text-[#071A36]">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]"
                    aria-hidden="true"
                  />
                  <span>{specialty}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="border-t border-[#E2E8F0] pt-4 text-sm text-[#64748B]">
              Core academy batting, bowling, fielding, and fitness coaching.
            </p>
          )}
        </Card>
      </div>

      {relatedPrograms.length > 0 && (
        <section aria-labelledby="coach-programs-heading" className="space-y-6">
          <SectionHeader
            id="coach-programs-heading"
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
