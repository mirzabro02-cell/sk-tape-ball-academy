import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { PageContainer } from '@/src/components/layout/PageContainer';
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
import { UpdatesPreviewSection } from '@/src/components/home/UpdatesPreviewSection';
import { ContactPreviewSection } from '@/src/components/home/ContactPreviewSection';
import { FinalCtaSection } from '@/src/components/home/FinalCtaSection';

export function HomePage() {
  useDocumentTitle();
  const { state } = useAcademyState();

  const isSectionVisible = (id: string) => {
    const found = state.websiteSections.find((s) => s.id === id);
    return found ? found.visible !== false : true;
  };

  return (
    <div>
      {isSectionVisible('hero') && <HeroSection />}

      <PageContainer className="mt-12 sm:mt-16 space-y-14 sm:space-y-20">
        {isSectionVisible('programs') && <ProgramsPreviewSection />}
        {isSectionVisible('about') && <AcademyIntroSection />}
        <WhyChooseSection />
        {isSectionVisible('coaches') && <CoachesPreviewSection />}
        <SchedulePreviewSection />
        {isSectionVisible('achievements') && <AchievementsPreviewSection />}
        {isSectionVisible('matches') && <MatchesEventsSection />}
        {isSectionVisible('gallery') && <GalleryPreviewSection />}
        {isSectionVisible('testimonials') && <TestimonialsSection />}
        {isSectionVisible('blog') && <UpdatesPreviewSection />}
        {isSectionVisible('contact') && <ContactPreviewSection />}
        <FinalCtaSection />
      </PageContainer>
    </div>
  );
}
