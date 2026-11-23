import { CheckCircle2, Compass, ShieldCheck, Target } from 'lucide-react';
import { ABOUT_PAGE_CONTENT } from '@/src/data/academyInfo';
import { ACADEMY_BRAND } from '@/src/data/brand';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function AboutPage() {
  useDocumentTitle('About Us');

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
            <Button to="/book-trial" variant="outlineLight" size="lg">
              Book Free Trial
            </Button>
          </>
        }
      />

      {/* Academy Overview */}
      <section aria-labelledby="about-overview-heading">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C8202B]">
              Academy Overview
            </p>
            <h2
              id="about-overview-heading"
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[#071A36]"
            >
              Bringing Structure &amp; Discipline to Tape Ball Cricket
            </h2>
            {ABOUT_PAGE_CONTENT.overview.map((paragraph) => (
              <p key={paragraph} className="text-sm sm:text-base leading-relaxed text-[#64748B]">
                {paragraph}
              </p>
            ))}

            <Card tone="muted" padding="md" className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#071A36]">
                Official Academy Details (Placeholder Notice)
              </p>
              <p className="mt-1.5 text-sm text-[#64748B]">
                Founding timeline, leadership names, and verified ground location ({ACADEMY_BRAND.contactPlaceholders.addressPlaceholder}) will be updated once supplied by academy management.
              </p>
            </Card>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[280px] overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-[#071A36]">
              <MediaImage
                src="/src/assets/images/academy_training_lanes_1795439225599.jpg"
                alt="SK Tape Ball Academy practice lanes and agility training setup"
                fallbackLabel="Academy Overview Visual"
                className="h-full w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section aria-labelledby="mission-vision-heading" className="space-y-6">
        <SectionHeader
          kicker="Purpose & Direction"
          title="Mission and Vision"
          description="Guiding principles shaping coaching standards, session structure, and long-term player growth."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card tone="navy" padding="lg" className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#050D1B] border border-[#D9A52E]/40 text-[#D9A52E]">
              <Target className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {ABOUT_PAGE_CONTENT.mission.title}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-white/80">
              {ABOUT_PAGE_CONTENT.mission.description}
            </p>
          </Card>

          <Card tone="light" padding="lg" className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#071A36] text-[#D9A52E]">
              <Compass className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-[#071A36]">
              {ABOUT_PAGE_CONTENT.vision.title}
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-[#64748B]">
              {ABOUT_PAGE_CONTENT.vision.description}
            </p>
          </Card>
        </div>
      </section>

      {/* Training Philosophy */}
      <section aria-labelledby="philosophy-heading" className="space-y-8">
        <SectionHeader
          kicker="Training Philosophy"
          title="How We Coach Every Session"
          description="A repeatable framework designed to turn raw athletic talent into composed match performance."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {ABOUT_PAGE_CONTENT.philosophy.map((item) => (
            <Card key={item.code} padding="lg" className="space-y-2.5">
              <p className="text-xs font-bold tracking-wider text-[#C8202B]">{item.code}</p>
              <h3 className="text-lg font-bold text-[#071A36]">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[#64748B]">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Academy Values */}
      <section aria-labelledby="values-heading" className="space-y-8">
        <SectionHeader
          kicker="Core Standards"
          title="Academy Values"
          description="Behavioral and athletic expectations upheld across every batch."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ABOUT_PAGE_CONTENT.values.map((val) => (
            <Card key={val.title} padding="md" className="space-y-2">
              <ShieldCheck className="h-5 w-5 text-[#D9A52E]" aria-hidden="true" />
              <h3 className="text-base font-bold text-[#071A36]">{val.title}</h3>
              <p className="text-xs leading-relaxed text-[#64748B]">{val.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Player Development Approach */}
      <section aria-labelledby="development-heading" className="space-y-8">
        <SectionHeader
          kicker="Progression Pathway"
          title="Player Development Approach"
          description="Four clear stages guiding every entrant from initial evaluation to match-ready execution."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_PAGE_CONTENT.developmentApproach.map((stage) => (
            <Card key={stage.step} padding="lg" className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C8202B]">
                  {stage.step}
                </span>
                <CheckCircle2 className="h-4 w-4 text-[#071A36]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#071A36]">{stage.title}</h3>
              <p className="text-sm leading-relaxed text-[#64748B]">{stage.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Experience Our Coaching Standards Firsthand"
        description="Schedule a trial assessment or explore our nine specialized training programs to find the right fit."
        primaryLabel="Book Free Trial"
        primaryTo="/book-trial"
        secondaryLabel="Meet Our Coaches"
        secondaryTo="/coaches"
      />
    </div>
  );
}
