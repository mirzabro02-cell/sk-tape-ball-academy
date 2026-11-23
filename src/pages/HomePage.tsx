import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { HeroSection } from '@/src/components/home/HeroSection';
import { AcademyIntroSection } from '@/src/components/home/AcademyIntroSection';
import { ProgramsPreviewSection } from '@/src/components/home/ProgramsPreviewSection';
import { WhyChooseSection } from '@/src/components/home/WhyChooseSection';
import { CoachesPreviewSection } from '@/src/components/home/CoachesPreviewSection';
import { SchedulePreviewSection } from '@/src/components/home/SchedulePreviewSection';
import { AchievementsPreviewSection } from '@/src/components/home/AchievementsPreviewSection';
import { MatchesEventsSection } from '@/src/components/home/MatchesEventsSection';
import { GalleryPreviewSection } from '@/src/components/home/GalleryPreviewSection';
import { TestimonialsSection } from '@/src/components/home/TestimonialsSection';
import { FinalCtaSection } from '@/src/components/home/FinalCtaSection';

export function HomePage() {
  useDocumentTitle();

  return (
    <div className="space-y-14 sm:space-y-20">
      <HeroSection />
      <AcademyIntroSection />
      <ProgramsPreviewSection />
      <WhyChooseSection />
      <CoachesPreviewSection />
      <SchedulePreviewSection />
      <AchievementsPreviewSection />
      <MatchesEventsSection />
      <GalleryPreviewSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </div>
  );
}
