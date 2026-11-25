import { UserRoundCheck } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { CoachCard } from '@/src/components/academy/CoachCard';
import { RevealSection, StaggerGrid, StaggerItem } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function CoachesPage() {
  useDocumentTitle('Coaches');
  const { state } = useAcademyState();

  const publishedCoaches = state.coaches.filter((coach) => coach.published !== false);

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Coaches' }]}
        kicker="Coaching Staff"
        title="Mentorship Focused on Technical Fundamentals"
        description="Structured tape ball coaching guided by diagnostic assessment, progressive shot methods, pace and accuracy work, and disciplined match preparation."
        actions={
          <>
            <Button to="/register" variant="primary" size="lg">
              Register Now
            </Button>
            <Button to="/programs" variant="outlineLight" size="lg">
              View Training Programs
            </Button>
          </>
        }
      />

      <RevealSection>
        <section aria-labelledby="coaches-grid-heading" className="space-y-8">
          <SectionHeader
            id="coaches-grid-heading"
            kicker="Academy Staff"
            title="Coaching Directory"
            description="Only verified, official coaching profiles published by SK Tape Ball Academy are displayed here."
          />

          {publishedCoaches.length > 0 ? (
            <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {publishedCoaches.map((coach) => (
                <StaggerItem key={coach.id}>
                  <CoachCard coach={coach} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          ) : (
            <Card tone="muted" padding="lg" className="space-y-5">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#07152C] text-[#D5A52B] dark:bg-[#162B4D] dark:border dark:border-white/10">
                    <UserRoundCheck className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-[#07152C] dark:text-white">
                      Official Coaching Roster Coming Soon
                    </h3>
                    <p className="max-w-2xl text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                      Verified coaching biographies, specializations, and portraits will appear here once finalized by SK Tape Ball Academy. Prospective players can register online or contact the academy directly.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <Button to="/register" variant="primary" size="md">
                    Register Now
                  </Button>
                  <Button to="/contact" variant="outline" size="md">
                    Contact Us
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </section>
      </RevealSection>

      <CtaBanner
        title="Train Under a Structured Coaching System"
        description="Submit a registration application in Sabzazar, Lahore to experience our batting, bowling, fielding, and conditioning methodology."
        primaryLabel="Register Now"
        primaryTo="/register"
        secondaryLabel="Contact Academy"
        secondaryTo="/contact"
      />
    </div>
  );
}
