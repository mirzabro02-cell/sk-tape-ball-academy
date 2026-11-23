import { ArrowRight, CheckCircle2, ClipboardList, ShieldCheck } from 'lucide-react';
import { ADMISSIONS_PAGE_CONTENT } from '@/src/data/admissionsContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
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
            <Button to="/book-trial" variant="outlineLight" size="lg">
              Book Free Trial First
            </Button>
          </>
        }
      />

      {/* Admission Process Steps */}
      <section aria-labelledby="admission-steps-heading" className="space-y-8">
        <SectionHeader
          kicker="Step-by-Step Pathway"
          title="Admission Process"
          description="From initial trial assessment to batch placement and ground onboarding."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ADMISSIONS_PAGE_CONTENT.steps.map((item) => (
            <Card key={item.step} padding="lg" className="space-y-3">
              <span className="inline-block text-xs font-bold tracking-wider text-[#C8202B]">
                Step {item.step}
              </span>
              <h3 className="text-lg font-bold text-[#071A36]">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[#64748B]">{item.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Eligibility & Required Information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-6 space-y-5" padding="lg">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5 text-[#D9A52E]" aria-hidden="true" />
            <h2 className="text-xl font-bold text-[#071A36]">
              Eligibility Information (Placeholders)
            </h2>
          </div>

          <div className="divide-y divide-[#E2E8F0] border-t border-[#E2E8F0]">
            {ADMISSIONS_PAGE_CONTENT.eligibilityPlaceholders.map((item) => (
              <div key={item.title} className="py-4 space-y-1">
                <h3 className="text-sm font-bold text-[#071A36]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#64748B]">{item.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card tone="navy" className="lg:col-span-6 space-y-5" padding="lg">
          <div className="flex items-center gap-2.5">
            <ClipboardList className="h-5 w-5 text-[#D9A52E]" aria-hidden="true" />
            <h2 className="text-xl font-bold text-white">Required Information</h2>
          </div>
          <p className="text-sm text-white/75">
            Prepare the following details before completing the student registration form:
          </p>
          <ul className="space-y-3 border-t border-white/10 pt-4">
            {ADMISSIONS_PAGE_CONTENT.requiredInformation.map((req) => (
              <li key={req} className="flex items-start gap-2.5 text-sm text-white/85">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]"
                  aria-hidden="true"
                />
                <span>{req}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <Button to="/admission-policy" variant="outlineLight" size="sm">
              Read Draft Admission Policy
            </Button>
          </div>
        </Card>
      </div>

      {/* Frequently Asked Admission Questions */}
      <section aria-labelledby="admission-faqs-heading" className="space-y-6">
        <SectionHeader
          kicker="Common Questions"
          title="Frequently Asked Admission Questions"
          description="Sample placeholder answers pending official academy confirmation."
          action={
            <Button to="/faqs" variant="outline">
              View All FAQs
            </Button>
          }
        />

        <FaqAccordion items={ADMISSIONS_PAGE_CONTENT.admissionFaqs} />
      </section>

      <CtaBanner
        title="Ready to Apply for Admission?"
        description="Complete the student registration form or schedule a free trial evaluation first."
        primaryLabel="Apply Now"
        primaryTo="/register"
        secondaryLabel="View Fees & Membership"
        secondaryTo="/fees"
      />
    </div>
  );
}
