import { ArrowRight, Compass, MapPin, Target, UserCheck } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { ABOUT_PAGE_CONTENT } from '@/src/data/academyInfo';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { RevealSection, StaggerGrid, StaggerItem } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function AboutPage() {
  useDocumentTitle('About Us');
  const { state } = useAcademyState();
  const { siteSettings } = state;

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About Us' }]}
        kicker={ABOUT_PAGE_CONTENT.kicker}
        title={ABOUT_PAGE_CONTENT.title}
        description={ABOUT_PAGE_CONTENT.heroDescription}
        actions={
          <>
            <Button to="/programs" variant="primary" size="lg" shape="pill">
              Explore Programs
            </Button>
            <Button to="/register" variant="outlineLight" size="lg" shape="pill">
              Register Now
            </Button>
          </>
        }
      />

      {/* Founder Story & Academy Profile */}
      <RevealSection>
        <section aria-labelledby="about-overview-heading">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C8202B] dark:text-[#D5A83C]">
                  Founder Story
                </p>
                <h2
                  id="about-overview-heading"
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#07152C] dark:text-white"
                >
                  Why SK Tape Ball Academy Was Started
                </h2>
                <div className="space-y-3">
                  {ABOUT_PAGE_CONTENT.overview.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-sm sm:text-base leading-relaxed text-[#475569] dark:text-[#B8C7DF]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <Card tone="muted" padding="md" className="space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#07152C] dark:text-[#D5A83C]">
                  Academy Profile
                </p>
                <div className="grid grid-cols-1 gap-2 text-sm text-[#475569] dark:text-[#B8C7DF] sm:grid-cols-2">
                  {siteSettings.founderName.trim() && (
                    <p className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 shrink-0 text-[#D5A83C]" aria-hidden="true" />
                      <span>
                        <strong className="text-[#07152C] dark:text-white">Founder:</strong>{' '}
                        {siteSettings.founderName}
                      </span>
                    </p>
                  )}
                  {siteSettings.locationText.trim() && (
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-[#C8202B] dark:text-[#D5A83C]" aria-hidden="true" />
                      <span>
                        <strong className="text-[#07152C] dark:text-white">Location:</strong>{' '}
                        {siteSettings.locationText}
                      </span>
                    </p>
                  )}
                </div>
                {siteSettings.launchedNote.trim() && (
                  <p className="text-xs text-[#64748B] dark:text-[#859BB9]">
                    {siteSettings.launchedNote}
                  </p>
                )}
              </Card>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full min-h-[280px] overflow-hidden rounded-[18px] border border-[#E2E8F0] bg-[#07152C] dark:border-white/10">
                <MediaImage
                  src={siteSettings.aboutMedia.src}
                  alt="SK Tape Ball Academy practice lanes and agility training setup"
                  transform={siteSettings.aboutMedia.transform}
                  fallbackLabel="SK Tape Ball Academy Training Ground"
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* Mission, Vision & Confirmed Values */}
      <RevealSection>
        <section aria-labelledby="mission-vision-heading" className="space-y-6">
          <SectionHeader
            id="mission-vision-heading"
            kicker="Purpose & Standards"
            title="Mission, Vision & Values"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card tone="navy" padding="lg" className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#050D1B] border border-[#D5A83C]/40 text-[#D5A83C]">
                <Target className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {ABOUT_PAGE_CONTENT.mission.title}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-[#B8C7DF]">
                {ABOUT_PAGE_CONTENT.mission.description}
              </p>
            </Card>

            <Card padding="lg" className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#07152C] text-[#D5A83C] dark:bg-[#162B4D] dark:border dark:border-white/10">
                <Compass className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-[#07152C] dark:text-white">
                {ABOUT_PAGE_CONTENT.vision.title}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-[#475569] dark:text-[#B8C7DF]">
                {ABOUT_PAGE_CONTENT.vision.description}
              </p>
            </Card>
          </div>

          <Card padding="md" className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#C8202B] dark:text-[#D5A83C]">
              Core Academy Values
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {ABOUT_PAGE_CONTENT.values.map((val) => (
                <span
                  key={val}
                  className="inline-flex items-center rounded-[8px] border border-[#E2E8F0] bg-[#F4F6FA] px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#07152C] dark:border-white/12 dark:bg-[#09172E] dark:text-white"
                >
                  {val}
                </span>
              ))}
            </div>
          </Card>
        </section>
      </RevealSection>

      {/* Coaching Method (Non-repetitive; track details remain on /programs) */}
      <RevealSection>
        <section aria-labelledby="philosophy-heading" className="space-y-8">
          <SectionHeader
            id="philosophy-heading"
            kicker="Training Approach"
            title="Skill-Based & Repetition-Focused"
            description="Training follows a clear four-step method. Detailed tracks for Fitness, Batting, Bowling, and Fielding are on the Training Programs page."
            action={
              <Button to="/programs" variant="outline" shape="pill">
                <span>View Training Programs</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            }
          />

          <StaggerGrid className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_PAGE_CONTENT.philosophy.map((item) => (
              <StaggerItem key={item.code}>
                <Card padding="lg" className="h-full space-y-2.5">
                  <p className="font-mono text-xs font-bold tracking-wider text-[#C8202B] dark:text-[#D5A83C]">
                    {item.code}
                  </p>
                  <h3 className="text-base font-bold text-[#07152C] dark:text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B8C7DF]">
                    {item.description}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      </RevealSection>

      <CtaBanner
        title="Ready to Train With Structure?"
        description="Explore our confirmed training areas or submit an online registration application."
        primaryLabel="Register Now"
        primaryTo="/register"
        secondaryLabel="Training Programs"
        secondaryTo="/programs"
      />
    </div>
  );
}
