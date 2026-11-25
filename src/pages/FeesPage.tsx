import { CheckCircle2, CreditCard } from 'lucide-react';
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
            <Button to="/book-trial" variant="outlineLight" size="lg">
              Book Free Trial
            </Button>
          </>
        }
      />

      {/* Membership Plan Cards (Placeholders) */}
      <section aria-labelledby="membership-plans-heading" className="space-y-8">
        <SectionHeader
          kicker="Training Packages (Placeholders)"
          title="Membership Plan Structure"
          description="Official tuition prices, registration charges, and seasonal packages will replace these placeholders once released."
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {FEES_PAGE_CONTENT.plans.map((plan) => (
            <Card
              key={plan.id}
              tone={plan.highlighted ? 'navy' : 'light'}
              padding="lg"
              className="flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <p
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      plan.highlighted ? 'text-[#D9A52E]' : 'text-[#C8202B]'
                    }`}
                  >
                    {plan.tierLabel}
                  </p>
                  <h3
                    className={`text-xl font-bold ${
                      plan.highlighted ? 'text-white' : 'text-[#071A36]'
                    }`}
                  >
                    {plan.title}
                  </h3>
                </div>

                <div
                  className={`rounded-[12px] border p-4 ${
                    plan.highlighted
                      ? 'border-white/15 bg-[#050D1B]'
                      : 'border-[#E2E8F0] bg-[#F5F7FA]'
                  }`}
                >
                  <p
                    className={`text-base font-bold ${
                      plan.highlighted ? 'text-[#D9A52E]' : 'text-[#071A36]'
                    }`}
                  >
                    {plan.pricePlaceholder}
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      plan.highlighted ? 'text-white/70' : 'text-[#64748B]'
                    }`}
                  >
                    {plan.billingPlaceholder}
                  </p>
                </div>

                <p
                  className={`text-sm leading-relaxed ${
                    plan.highlighted ? 'text-white/80' : 'text-[#64748B]'
                  }`}
                >
                  {plan.summary}
                </p>

                <ul
                  className={`space-y-2.5 border-t pt-4 text-sm ${
                    plan.highlighted
                      ? 'border-white/10 text-white/85'
                      : 'border-[#E2E8F0] text-[#071A36]'
                  }`}
                >
                  {plan.includedBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]"
                        aria-hidden="true"
                      />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <Button
                  to="/register"
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  fullWidth
                >
                  Enquire / Register Interest
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Payment Information Placeholders */}
      <section aria-labelledby="payment-info-heading" className="space-y-8">
        <SectionHeader
          kicker="Billing & Policies"
          title="Payment Information (Placeholders)"
          description="Accepted payment channels and official policies are pending confirmation."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEES_PAGE_CONTENT.paymentPlaceholders.map((item) => (
            <Card key={item.title} tone="muted" padding="lg" className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#071A36] text-[#D9A52E]">
                <CreditCard className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-[#071A36]">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[#64748B]">{item.detail}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Fees FAQs */}
      <section aria-labelledby="fees-faqs-heading" className="space-y-6">
        <SectionHeader
          kicker="Membership Questions"
          title="Fees & Membership FAQs"
          action={
            <Button to="/refund-policy" variant="outline">
              Draft Refund Policy
            </Button>
          }
        />

        <FaqAccordion items={FEES_PAGE_CONTENT.faqs} />
      </section>

      <CtaBanner
        title="Start With a Free Trial or Register Interest"
        description="Submit a registration inquiry or book a trial session to be notified once official membership rates are released."
        primaryLabel="Register Now"
        primaryTo="/register"
        secondaryLabel="Book Free Trial"
        secondaryTo="/book-trial"
      />
    </div>
  );
}
