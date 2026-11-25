import { CheckCircle2, ClipboardCheck } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { FEES_PAGE_CONTENT } from '@/src/data/admissionsContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { CtaBanner } from '@/src/components/ui/CtaBanner';
import { FaqAccordion } from '@/src/components/ui/FaqAccordion';
import { PageHero } from '@/src/components/ui/PageHero';
import { SectionHeader } from '@/src/components/ui/SectionHeader';

export function FeesPage() {
  useDocumentTitle('Fees & Membership');
  const { state } = useAcademyState();

  const activePackages = state.feePackages.filter((pkg) => pkg.status === 'Active');
  const showPublishedPackages = state.siteSettings.showPublicFees && activePackages.length > 0;

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Fees & Membership' }]}
        kicker={FEES_PAGE_CONTENT.kicker}
        title={FEES_PAGE_CONTENT.title}
        description={FEES_PAGE_CONTENT.description}
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

      {showPublishedPackages ? (
        <section aria-labelledby="published-packages-heading" className="space-y-8">
          <SectionHeader
            id="published-packages-heading"
            kicker="Training Packages"
            title="Published Fee Plans"
            description="Official coaching packages currently published by SK Tape Ball Academy."
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {activePackages.map((pkg, idx) => {
              const highlighted = idx === 1;
              return (
                <Card
                  key={pkg.id}
                  tone={highlighted ? 'navy' : 'light'}
                  padding="lg"
                  className="flex flex-col justify-between gap-6"
                >
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          highlighted ? 'text-[#D9A52E]' : 'text-[#C8202B]'
                        }`}
                      >
                        {pkg.billingCycle}
                      </p>
                      <h3
                        className={`text-xl font-bold ${
                          highlighted ? 'text-white' : 'text-[#071A36]'
                        }`}
                      >
                        {pkg.name}
                      </h3>
                    </div>

                    <div
                      className={`rounded-[12px] border p-4 ${
                        highlighted
                          ? 'border-white/15 bg-[#050D1B]'
                          : 'border-[#E2E8F0] bg-[#F5F7FA]'
                      }`}
                    >
                      <p
                        className={`text-lg font-bold ${
                          highlighted ? 'text-[#D9A52E]' : 'text-[#071A36]'
                        }`}
                      >
                        {pkg.amountPlaceholder}
                      </p>
                      <p
                        className={`mt-1 text-xs ${
                          highlighted ? 'text-white/70' : 'text-[#64748B]'
                        }`}
                      >
                        Scope: {pkg.programScope}
                      </p>
                    </div>
                  </div>

                  <Button
                    to="/register"
                    variant={highlighted ? 'primary' : 'secondary'}
                    fullWidth
                  >
                    Apply for This Track
                  </Button>
                </Card>
              );
            })}
          </div>
        </section>
      ) : (
        <section aria-labelledby="fee-consultation-heading" className="space-y-8">
          <SectionHeader
            id="fee-consultation-heading"
            kicker="Onboarding Process"
            title="Fee & Placement Consultation"
            description="Program fees are shared clearly alongside your trial evaluation and recommended batch placement."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {FEES_PAGE_CONTENT.consultationPoints.map((item) => (
              <Card key={item.title} padding="lg" className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#071A36] text-[#D9A52E]">
                  <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-[#071A36]">{item.title}</h3>
                <p className="text-sm leading-relaxed text-[#64748B]">{item.detail}</p>
              </Card>
            ))}
          </div>

          <Card tone="navy" padding="lg" className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#D9A52E]">
                Direct Track Guidance
              </p>
              <h3 className="text-xl font-bold text-white">
                Request Fee Breakdown for Your Chosen Program
              </h3>
              <p className="max-w-2xl text-sm text-white/75">
                Start with a free assessment or submit a registration application so our academy desk can share matching batch options and exact tuition details.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Button to="/book-trial" variant="primary" size="md">
                Book Free Trial
              </Button>
              <Button to="/contact" variant="outlineLight" size="md">
                Contact Us
              </Button>
            </div>
          </Card>
        </section>
      )}

      {/* Included Coaching Standards */}
      <section aria-labelledby="coaching-value-heading" className="space-y-6">
        <SectionHeader
          id="coaching-value-heading"
          kicker="What Every Program Emphasizes"
          title="Core Academy Training Pillars"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            'Diagnostic strengths & weaknesses assessment',
            '20–25 structured practice methods per shot',
            '~200 athletic conditioning & mobility exercises',
            'League and single-wicket match preparation',
          ].map((point) => (
            <Card key={point} tone="muted" padding="md" className="flex items-start gap-2.5">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]"
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-[#071A36]">{point}</span>
            </Card>
          ))}
        </div>
      </section>

      {/* Fees FAQs */}
      <section aria-labelledby="fees-faqs-heading" className="space-y-6">
        <SectionHeader
          id="fees-faqs-heading"
          kicker="Membership Questions"
          title="Fees & Membership FAQs"
          action={
            <Button to="/refund-policy" variant="outline">
              Refund Policy
            </Button>
          }
        />

        <FaqAccordion items={FEES_PAGE_CONTENT.faqs} />
      </section>

      <CtaBanner
        title="Start With a Free Trial or Apply Online"
        description="Reserve a diagnostic evaluation session or submit your registration form for personalized program guidance."
        primaryLabel="Book Free Trial"
        primaryTo="/book-trial"
        secondaryLabel="Register Now"
        secondaryTo="/register"
      />
    </div>
  );
}
