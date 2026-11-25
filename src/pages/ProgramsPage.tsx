import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  PROGRAM_BENEFITS,
  TRAINING_PROGRAMS_DATA,
  type ProgramCategory,
} from '@/src/data/academyInfo';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { cn } from '@/src/utils/cn';
import { ProgramCard } from '@/src/components/academy/ProgramCard';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

const CATEGORY_FILTERS: Array<'All' | ProgramCategory> = [
  'All',
  'Skill Track',
  'Level Track',
  'Individual Coaching',
];

export function ProgramsPage() {
  useDocumentTitle('Training Programs');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProgramCategory>('All');

  const filteredPrograms =
    selectedCategory === 'All'
      ? TRAINING_PROGRAMS_DATA
      : TRAINING_PROGRAMS_DATA.filter((program) => program.category === selectedCategory);

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Training Programs' }]}
        kicker="Curriculum & Coaching Tracks"
        title="Training Programs Built for Every Stage of Tape Ball Cricket"
        description="Explore athletic conditioning (~200 exercises), diagnostic tape ball batting (20–25 methods per shot), speed and accuracy bowling, complete fielding, wicket keeping, and 1-on-1 coaching."
        actions={
          <>
            <Button to="/book-trial" variant="primary" size="lg">
              Book Free Trial
            </Button>
            <Button to="/register" variant="outlineLight" size="lg">
              Register Now
            </Button>
          </>
        }
      />

      {/* Introduction & Interactive Category Filter */}
      <section aria-labelledby="programs-listing-heading" className="space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="programs-listing-heading"
            kicker="9 Structured Programs"
            title="Choose Your Training Track"
            description="Select any program card below to inspect skills covered, training objectives, suitable players, and coaching approach."
          />

          <div
            role="tablist"
            aria-label="Filter programs by category"
            className="flex flex-wrap items-center gap-1.5 rounded-[12px] border border-[#E2E8F0] bg-white p-1.5 w-fit"
          >
            {CATEGORY_FILTERS.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'rounded-[8px] px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap',
                  selectedCategory === category
                    ? 'bg-[#071A36] text-white'
                    : 'text-[#64748B] hover:text-[#071A36] hover:bg-[#F5F7FA]',
                )}
              >
                {category === 'All' ? 'All Programs (9)' : category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program) => (
            <ProgramCard key={program.slug} program={program} />
          ))}
        </div>
      </section>

      {/* Training Benefits */}
      <section aria-labelledby="training-benefits-heading" className="space-y-8">
        <SectionHeader
          id="training-benefits-heading"
          kicker="Why Structured Programs Work"
          title="Key Training Benefits"
          description="Every track combines athletic preparation with structured technical repetition and competitive match readiness."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAM_BENEFITS.map((benefit) => (
            <Card key={benefit.code} padding="lg" className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-[#C8202B]">
                  {benefit.code}
                </span>
                <CheckCircle2 className="h-4 w-4 text-[#D9A52E]" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-[#071A36]">{benefit.title}</h3>
              <p className="text-sm leading-relaxed text-[#64748B]">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Ready to Start Your Training Track?"
        description="Book a free trial assessment to receive batch placement guidance, or submit an enrollment inquiry."
        primaryLabel="Register Now"
        primaryTo="/register"
        secondaryLabel="Book Free Trial"
        secondaryTo="/book-trial"
      />
    </div>
  );
}
