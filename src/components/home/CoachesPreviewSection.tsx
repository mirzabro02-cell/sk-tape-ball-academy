import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { CoachCard } from '@/src/components/academy/CoachCard';
import { RevealSection, StaggerGrid, StaggerItem } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function CoachesPreviewSection() {
  const { state } = useAcademyState();
  const publishedCoaches = state.coaches.filter((c) => c.published !== false);

  return (
    <RevealSection>
      <section aria-labelledby="coaches-preview-heading" className="space-y-8">
        <SectionHeader
          id="coaches-preview-heading"
          kicker="Coaching Leadership"
          title="Coaching Staff Directory"
          description={
            publishedCoaches.length > 0
              ? 'Verified coaches leading fitness, batting, bowling, and fielding programs at SK Tape Ball Academy.'
              : 'Led by founder Sami Khan, official coach profiles are added once verified by academy administration.'
          }
          action={
            <Button to="/coaches" variant="outline">
              <span>Coaches Directory</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          }
        />

        {publishedCoaches.length > 0 ? (
          <StaggerGrid className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {publishedCoaches.slice(0, 3).map((coach) => (
              <StaggerItem key={coach.id}>
                <CoachCard coach={coach} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        ) : (
          <Card padding="lg" className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4 max-w-2xl">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#07152C] text-[#D5A52B] dark:bg-[#162B4D] dark:border dark:border-white/10">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#07152C] dark:text-white">
                  Official Coaching Roster Coming Soon
                </h3>
                <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                  SK Tape Ball Academy publishes only verified coach names, credentials, and portraits. Submit a registration inquiry or visit us in Sabzazar, Lahore to connect with our coaching leadership.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Button to="/register" variant="primary" size="sm">
                Register Now
              </Button>
              <Button to="/coaches" variant="outline" size="sm">
                Coaches Page
              </Button>
            </div>
          </Card>
        )}
      </section>
    </RevealSection>
  );
}
