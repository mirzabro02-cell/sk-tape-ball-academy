import { ArrowRight, CheckCircle2, ClipboardList, ShieldCheck } from 'lucide-react';
import { ADMISSIONS_PAGE_CONTENT } from '@/src/data/admissionsContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { RevealSection, StaggerGrid, StaggerItem } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { FaqAccordion } from '@/src/components/ui/FaqAccordion';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function AdmissionsPage() {
  useDocumentTitle('Admissions');

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Admissions' }]}
        kicker={ADMISSIONS_PAGE_CONTENT.kicker}
        title={ADMISSIONS_PAGE_CONTENT.title}
        description={ADMISSIONS_PAGE_CONTENT.description}
        actions={
          <>
            <Button to="/register" variant="primary" size="lg">
              <span>Apply Now (Register)</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button to="/application-status" variant="outlineLight" size="lg">
              Track Application
            </Button>
          </>
        }
      />

      {/* Admission Process Steps */}
      <RevealSection>
        <section aria-labelledby="admission-steps-heading" className="space-y-8">
          <SectionHeader
            id="admission-steps-heading"
            kicker="Step-by-Step Pathway"
            title="Admission Process"
            description="From online registration to skill baseline review, batch placement, and ground onboarding."
          />

          <StaggerGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ADMISSIONS_PAGE_CONTENT.steps.map((item) => (
              <StaggerItem key={item.step}>
                <Card padding="lg" className="h-full space-y-3">
                  <span className="inline-block font-mono text-xs font-bold tracking-wider text-[#C8202B] dark:text-[#D5A52B]">
                    Step {item.step}
                  </span>
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

      {/* Eligibility & Required Information */}
      <RevealSection>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Card className="lg:col-span-6 space-y-5" padding="lg">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-[#D5A52B]" aria-hidden="true" />
              <h2 className="text-xl font-bold text-[#07152C] dark:text-white">
                Eligibility Standards
              </h2>
            </div>

            <div className="divide-y divide-[#E2E8F0] border-t border-[#E2E8F0] dark:divide-white/10 dark:border-white/10">
              {ADMISSIONS_PAGE_CONTENT.eligibilityStandards.map((item) => (
                <div key={item.title} className="py-4 space-y-1">
                  <h3 className="text-sm font-bold text-[#07152C] dark:text-white">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card tone="navy" className="lg:col-span-6 space-y-5" padding="lg">
            <div className="flex items-center gap-2.5">
              <ClipboardList className="h-5 w-5 text-[#D9A52E]" aria-hidden="true" />
              <h2 className="text-xl font-bold text-white">Required Information</h2>
            </div>
            <p className="text-sm text-[#B4C4DC]">
              Prepare the following details before completing the student registration form:
            </p>
            <ul className="space-y-3 border-t border-white/10 pt-4">
              {ADMISSIONS_PAGE_CONTENT.requiredInformation.map((req) => (
                <li key={req} className="flex items-start gap-2.5 text-sm text-[#E2E8F0]">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A52B]"
                    aria-hidden="true"
                  />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <Button to="/admission-policy" variant="outlineLight" size="sm">
                Read Admission Policy
              </Button>
            </div>
          </Card>
        </div>
      </RevealSection>

      {/* Frequently Asked Admission Questions */}
      <RevealSection>
        <section aria-labelledby="admission-faqs-heading" className="space-y-6">
          <SectionHeader
            id="admission-faqs-heading"
            kicker="Common Questions"
            title="Frequently Asked Admission Questions"
            action={
              <Button to="/faqs" variant="outline">
                View All FAQs
              </Button>
            }
          />

          <FaqAccordion items={ADMISSIONS_PAGE_CONTENT.admissionFaqs} />
        </section>
      </RevealSection>

      <CtaBanner
        title="Ready to Apply for Admission?"
        description="Complete the student registration form or explore our training fees and batch plans."
        primaryLabel="Apply Now"
        primaryTo="/register"
        secondaryLabel="View Fees & Membership"
        secondaryTo="/fees"
      />
    </div>
  );
}
