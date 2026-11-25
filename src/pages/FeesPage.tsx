import { CheckCircle2, ClipboardCheck } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { FEES_PAGE_CONTENT } from '@/src/data/admissionsContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { RevealSection, StaggerGrid, StaggerItem } from '@/src/components/motion/MotionPrimitives';
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
            <Button to="/register" variant="primary" size="lg">
              Register Now
            </Button>
            <Button to="/admissions" variant="outlineLight" size="lg">
              Admissions Guide
            </Button>
          </>
        }
      />

      <RevealSection>
        {showPublishedPackages ? (
          <section aria-labelledby="published-packages-heading" className="space-y-8">
            <SectionHeader
              id="published-packages-heading"
              kicker="Training Packages"
              title="Published Fee Plans"
              description="Official coaching packages currently published by SK Tape Ball Academy."
            />

            <StaggerGrid className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {activePackages.map((pkg, idx) => {
                const highlighted = idx === 1;
                return (
                  <StaggerItem key={pkg.id}>
                    <Card
                      tone={highlighted ? 'navy' : 'light'}
                      padding="lg"
                      className="h-full flex flex-col justify-between gap-6"
                    >
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <p
                            className={`text-xs font-bold uppercase tracking-wider ${
                              highlighted
                                ? 'text-[#D5A52B]'
                                : 'text-[#C8202B] dark:text-[#D5A52B]'
                            }`}
                          >
                            {pkg.billingCycle}
                          </p>
                          <h3
                            className={`text-xl font-bold ${
                              highlighted ? 'text-white' : 'text-[#07152C] dark:text-white'
                            }`}
                          >
                            {pkg.name}
                          </h3>
                        </div>

                        <div
                          className={`rounded-[12px] border p-4 ${
                            highlighted
                              ? 'border-white/15 bg-[#050D1B]'
                              : 'border-[#E2E8F0] bg-[#F5F7FA] dark:border-white/10 dark:bg-[#07152C]'
                          }`}
                        >
                          <p
                            className={`text-lg font-bold ${
                              highlighted
                                ? 'text-[#D5A52B]'
                                : 'text-[#07152C] dark:text-[#D5A52B]'
                            }`}
                          >
                            {pkg.amountPlaceholder}
                          </p>
                          <p
                            className={`mt-1 text-xs ${
                              highlighted ? 'text-[#B4C4DC]' : 'text-[#64748B] dark:text-[#7F95B8]'
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
                  </StaggerItem>
                );
              })}
            </StaggerGrid>
          </section>
        ) : (
          <section aria-labelledby="fee-consultation-heading" className="space-y-8">
            <SectionHeader
              id="fee-consultation-heading"
              kicker="Onboarding Process"
              title="Fee & Placement Consultation"
              description="Program fees are shared clearly alongside your registration review and recommended batch placement."
            />

            <StaggerGrid className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {FEES_PAGE_CONTENT.consultationPoints.map((item) => (
                <StaggerItem key={item.title}>
                  <Card padding="lg" className="h-full space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#07152C] text-[#D5A52B] dark:bg-[#162B4D] dark:border dark:border-white/10">
                      <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-bold text-[#07152C] dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                      {item.detail}
                    </p>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerGrid>

            <Card
              tone="navy"
              padding="lg"
              className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#D5A52B]">
                  Direct Track Guidance
                </p>
                <h3 className="text-xl font-bold text-white">
                  Request Fee Breakdown for Your Chosen Program
                </h3>
                <p className="max-w-2xl text-sm text-[#B4C4DC]">
                  Submit a registration application or contact our academy desk so coaching leadership can share matching batch options and exact tuition details.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Button to="/register" variant="primary" size="md">
                  Register Now
                </Button>
                <Button to="/contact" variant="outlineLight" size="md">
                  Contact Us
                </Button>
              </div>
            </Card>
          </section>
        )}
      </RevealSection>

      {/* Included Coaching Standards */}
      <RevealSection>
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
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A52B]"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-[#07152C] dark:text-white">{point}</span>
              </Card>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* Fees FAQs */}
      <RevealSection>
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
      </RevealSection>

      <CtaBanner
        title="Ready to Apply for Training?"
        description="Submit your registration form for personalized batch placement and membership guidance."
        primaryLabel="Register Now"
        primaryTo="/register"
        secondaryLabel="Contact Academy"
        secondaryTo="/contact"
      />
    </div>
  );
}
