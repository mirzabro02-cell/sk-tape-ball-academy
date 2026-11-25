import { ArrowLeft, CheckCircle2, UserRound } from 'lucide-react';
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
        <p className="text-xs font-bold uppercase tracking-wider text-[#C8202B] dark:text-[#D5A52B]">
          Profile Unavailable
        </p>
        <h1 className="text-2xl font-bold text-[#07152C] dark:text-white">
          Coach Profile Not Found
        </h1>
        <p className="text-sm text-[#475569] dark:text-[#B4C4DC]">
          This coaching profile is either unavailable or has not been published yet. Return to the Coaches directory to view published staff profiles.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Button to="/coaches" variant="primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back to Coaches</span>
          </Button>
          <Button to="/register" variant="outline">
            Register Now
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
            <Button to="/register" variant="primary" size="lg">
              Register Now
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
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D5A52B]/50 bg-[#07152C] text-[#D5A52B] text-xl font-bold">
                {coach.avatarLabel || <UserRound className="h-8 w-8" aria-hidden="true" />}
              </div>
              <p className="text-xs font-medium text-[#B4C4DC]">{coach.roleTitle}</p>
            </div>
          )
        }
      />

      <RevealSection>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-7 space-y-4" padding="lg">
            <h2 className="text-xl font-bold text-[#07152C] dark:text-white">Coaching Profile</h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
              {coach.bio || 'Official profile published by SK Tape Ball Academy.'}
            </p>
            {coach.experienceLabel && (
              <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 text-xs text-[#475569] dark:border-white/10 dark:bg-[#07152C] dark:text-[#B4C4DC]">
                <strong className="text-[#07152C] dark:text-white">Experience &amp; Background:</strong>{' '}
                {coach.experienceLabel}
              </div>
            )}
          </Card>

          <Card className="lg:col-span-5 space-y-4" padding="lg">
            <h2 className="text-xl font-bold text-[#07152C] dark:text-white">
              Coaching Specialties
            </h2>
            {coach.specialties.length > 0 ? (
              <ul className="space-y-3 border-t border-[#E2E8F0] pt-4 dark:border-white/10">
                {coach.specialties.map((specialty) => (
                  <li
                    key={specialty}
                    className="flex items-start gap-2.5 text-sm text-[#07152C] dark:text-[#E2E8F0]"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A52B]"
                      aria-hidden="true"
                    />
                    <span>{specialty}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="border-t border-[#E2E8F0] pt-4 text-sm text-[#475569] dark:border-white/10 dark:text-[#B4C4DC]">
                Core academy batting, bowling, fielding, and fitness coaching.
              </p>
            )}
          </Card>
        </div>
      </RevealSection>

      {relatedPrograms.length > 0 && (
        <RevealSection>
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
        </RevealSection>
      )}

      <CtaBanner
        title="Ready to Train With SK Tape Ball Academy?"
        description="Submit a registration application or browse our complete training program directory."
        primaryLabel="Register Now"
        primaryTo="/register"
        secondaryLabel="Explore Programs"
        secondaryTo="/programs"
      />
    </div>
  );
}
