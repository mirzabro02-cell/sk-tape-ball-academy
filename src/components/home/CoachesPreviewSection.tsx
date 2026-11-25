import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { CoachCard } from '@/src/components/academy/CoachCard';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function CoachesPreviewSection() {
  const { state } = useAcademyState();
  const publishedCoaches = state.coaches.filter((c) => c.published !== false);

  return (
    <section aria-labelledby="coaches-preview-heading" className="space-y-8">
      <SectionHeader
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {publishedCoaches.slice(0, 3).map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      ) : (
        <Card padding="lg" className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#071A36] text-[#D9A52E]">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-[#071A36]">
                Official Coaching Roster Coming Soon
              </h3>
              <p className="text-sm leading-relaxed text-[#64748B]">
                SK Tape Ball Academy publishes only verified coach names, credentials, and portraits. Check back soon or book a free trial assessment in Sabzazar, Lahore to meet our coaching team on the ground.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Button to="/book-trial" variant="primary" size="sm">
              Book Free Trial
            </Button>
            <Button to="/coaches" variant="outline" size="sm">
              Coaches Page
            </Button>
          </div>
        </Card>
      )}
    </section>
  );
}
