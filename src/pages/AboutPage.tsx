import { CheckCircle2, Compass, MapPin, ShieldCheck, Target, UserCheck } from 'lucide-react';
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
            <Button to="/programs" variant="primary" size="lg">
              Explore Training Programs
            </Button>
            <Button to="/register" variant="outlineLight" size="lg">
              Register Now
            </Button>
          </>
        }
      />

      {/* Academy Overview */}
      <RevealSection>
        <section aria-labelledby="about-overview-heading">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-6 space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C8202B] dark:text-[#D5A52B]">
                Academy Overview
              </p>
              <h2
                id="about-overview-heading"
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#07152C] dark:text-white"
              >
                Bringing Structure &amp; Discipline to Tape Ball Cricket
              </h2>
              {ABOUT_PAGE_CONTENT.overview.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm sm:text-base leading-relaxed text-[#475569] dark:text-[#B4C4DC]"
                >
                  {paragraph}
                </p>
              ))}

              <Card tone="muted" padding="md" className="mt-4 space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#07152C] dark:text-[#D5A52B]">
                  Official Academy Profile
                </p>
                <div className="grid grid-cols-1 gap-2 text-sm text-[#475569] dark:text-[#B4C4DC] sm:grid-cols-2">
                  <p className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 shrink-0 text-[#D5A52B]" aria-hidden="true" />
                    <span>
                      <strong className="text-[#07152C] dark:text-white">Founder:</strong>{' '}
                      {siteSettings.founderName}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-[#C8202B] dark:text-[#D5A52B]" aria-hidden="true" />
                    <span>
                      <strong className="text-[#07152C] dark:text-white">Operating Base:</strong>{' '}
                      {siteSettings.locationText}
                    </span>
                  </p>
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#7F95B8]">
                  {siteSettings.launchedNote}
                </p>
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

      {/* Mission & Vision */}
      <RevealSection>
        <section aria-labelledby="mission-vision-heading" className="space-y-6">
          <SectionHeader
            id="mission-vision-heading"
            kicker="Purpose & Direction"
            title="Mission and Vision"
            description="Guiding principles shaping coaching standards, session structure, and long-term player growth."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card tone="navy" padding="lg" className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#050D1B] border border-[#D5A52B]/40 text-[#D5A52B]">
                <Target className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {ABOUT_PAGE_CONTENT.mission.title}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-[#B4C4DC]">
                {ABOUT_PAGE_CONTENT.mission.description}
              </p>
            </Card>

            <Card padding="lg" className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#07152C] text-[#D5A52B] dark:bg-[#162B4D] dark:border dark:border-white/10">
                <Compass className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-[#07152C] dark:text-white">
                {ABOUT_PAGE_CONTENT.vision.title}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                {ABOUT_PAGE_CONTENT.vision.description}
              </p>
            </Card>
          </div>
        </section>
      </RevealSection>

      {/* Training Philosophy */}
      <RevealSection>
        <section aria-labelledby="philosophy-heading" className="space-y-8">
          <SectionHeader
            id="philosophy-heading"
            kicker="Training Philosophy"
            title="How We Coach Every Session"
            description="A repeatable framework designed to turn raw athletic talent into composed match performance."
          />

          <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {ABOUT_PAGE_CONTENT.philosophy.map((item) => (
              <StaggerItem key={item.code}>
                <Card padding="lg" className="h-full space-y-2.5">
                  <p className="font-mono text-xs font-bold tracking-wider text-[#C8202B] dark:text-[#D5A52B]">
                    {item.code}
                  </p>
                  <h3 className="text-lg font-bold text-[#07152C] dark:text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                    {item.description}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      </RevealSection>

      {/* Academy Values */}
      <RevealSection>
        <section aria-labelledby="values-heading" className="space-y-8">
          <SectionHeader
            id="values-heading"
            kicker="Core Standards"
            title="Nine Academy Values"
            description="Behavioral and athletic principles upheld across every training group."
          />

          <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ABOUT_PAGE_CONTENT.values.map((val) => (
              <StaggerItem key={val.title}>
                <Card padding="md" className="h-full space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-[#D5A52B]" aria-hidden="true" />
                    <h3 className="text-base font-bold text-[#07152C] dark:text-white">
                      {val.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                    {val.description}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      </RevealSection>

      {/* Player Development Approach */}
      <RevealSection>
        <section aria-labelledby="development-heading" className="space-y-8">
          <SectionHeader
            id="development-heading"
            kicker="Progression Pathway"
            title="Player Development Approach"
            description="Four clear stages guiding every entrant from initial evaluation to match-ready execution."
          />

          <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_PAGE_CONTENT.developmentApproach.map((stage) => (
              <StaggerItem key={stage.step}>
                <Card padding="lg" className="h-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C8202B] dark:text-[#D5A52B]">
                      {stage.step}
                    </span>
                    <CheckCircle2
                      className="h-4 w-4 text-[#07152C] dark:text-[#D5A52B]"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-[#07152C] dark:text-white">
                    {stage.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                    {stage.description}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      </RevealSection>

      <CtaBanner
        title="Experience Our Coaching Standards Firsthand"
        description="Submit your player registration or explore our nine specialized training programs to find the right fit."
        primaryLabel="Register Now"
        primaryTo="/register"
        secondaryLabel="Training Programs"
        secondaryTo="/programs"
      />
    </div>
  );
}
