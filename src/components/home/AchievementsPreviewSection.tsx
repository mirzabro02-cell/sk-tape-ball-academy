import { ArrowRight, Award } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function AchievementsPreviewSection() {
  const { state } = useAcademyState();
  const publishedAchievements = state.achievements.filter((a) => a.published).slice(0, 3);

  if (publishedAchievements.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="achievements-preview-heading" className="space-y-8">
      <SectionHeader
        kicker="Achievements & Recognition"
        title="Honors & Player Milestones"
        description="Verified tournament achievements, single-wicket winners, and player progress highlights from SK Tape Ball Academy."
        action={
          <Button to="/achievements" variant="outline">
            <span>View All Achievements</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {publishedAchievements.map((item) => (
          <Card key={item.id} interactive padding="sm" className="overflow-hidden flex flex-col">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-[12px] bg-[#071A36]">
              <MediaImage
                src={item.imagePath}
                alt={item.title}
                transform={item.imageTransform}
                fallbackLabel={item.title}
                className="h-full w-full"
              />
            </div>

            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#C8202B]">{item.category}</span>
                  <Award className="h-4 w-4 text-[#D9A52E]" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-[#071A36]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#64748B]">{item.description}</p>
              </div>

              <div className="border-t border-[#E2E8F0] pt-3 flex items-center justify-between text-xs text-[#64748B]">
                <span className="font-semibold text-[#071A36]">{item.playerName}</span>
                <span>{item.datePlaceholder}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
