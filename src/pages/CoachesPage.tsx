import { COACHES_DATA } from '@/src/data/academyInfo';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { CoachCard } from '@/src/components/academy/CoachCard';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function CoachesPage() {
  useDocumentTitle('Coaches');

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Coaches' }]}
        kicker="Coaching Staff"
        title="Mentorship Focused on Technical Fundamentals"
        description="Official coach names, certifications, and playing backgrounds are marked as placeholders until verified staff details are supplied by SK Tape Ball Academy."
        actions={
          <>
            <Button to="/book-trial" variant="primary" size="lg">
              Book Free Trial
            </Button>
            <Button to="/programs" variant="outlineLight" size="lg">
              View Training Programs
            </Button>
          </>
        }
      />

      <section aria-labelledby="coaches-grid-heading" className="space-y-8">
        <SectionHeader
          kicker="Staff Directory (Placeholders)"
          title="Academy Coaching Roles"
          description="Select any coach card to view the reusable profile template, coaching specialties, and related training tracks."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {COACHES_DATA.map((coach) => (
            <CoachCard key={coach.slug} coach={coach} />
          ))}
        </div>
      </section>

      <Card tone="muted" padding="lg" className="space-y-2">
        <h2 className="text-base font-bold text-[#071A36]">
          Coaching Verification Notice
        </h2>
        <p className="text-sm leading-relaxed text-[#64748B]">
          No coach identities, credentials, or years of experience have been fabricated. Official coach biographies, portraits, and certifications will populate these profile cards once supplied.
        </p>
      </Card>

      <CtaBanner
        title="Train Under a Structured Coaching System"
        description="Reserve a free trial evaluation to experience our net sessions and drill methodology."
        primaryLabel="Book Free Trial"
        primaryTo="/book-trial"
        secondaryLabel="Contact Academy"
        secondaryTo="/contact"
      />
    </div>
  );
}
