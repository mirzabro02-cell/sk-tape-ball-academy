import { ArrowRight } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { CoachCard } from '@/src/components/academy/CoachCard';
import { RevealSection, StaggerGrid, StaggerItem } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function CoachesPreviewSection() {
  const { state } = useAcademyState();
  const publishedCoaches = state.coaches.filter((c) => c.published !== false);

  if (publishedCoaches.length === 0) {
    return null;
  }

  return (
    <RevealSection>
      <section aria-labelledby="coaches-preview-heading" className="space-y-8">
        <SectionHeader
          id="coaches-preview-heading"
          kicker="Coaching Leadership"
          title="Coaching Staff Directory"
          description="Verified coaches leading training programs at SK Tape Ball Academy."
          action={
            <Button to="/coaches" variant="outline" shape="pill">
              <span>Coaches Directory</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        <StaggerGrid className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {publishedCoaches.slice(0, 3).map((coach) => (
            <StaggerItem key={coach.id}>
              <CoachCard coach={coach} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>
    </RevealSection>
  );
}
