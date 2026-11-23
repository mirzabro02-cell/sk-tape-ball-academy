import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ClipboardCheck, Home, Info } from 'lucide-react';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { AccountPageShell } from '@/src/components/account/AccountPageShell';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

const NEXT_STEPS = [
  {
    step: '01',
    title: 'Initial Review & Guardian Check',
    description:
      'Once backend admissions are connected, academy staff review student age category, preferred program, and guardian contact details.',
  },
  {
    step: '02',
    title: 'Assessment or Batch Assignment',
    description:
      'Applicants may be invited for an on-ground evaluation session or matched directly to an appropriate training lane and coach.',
  },
  {
    step: '03',
    title: 'Track Progress Online',
    description:
      'Use your future academy reference ID and registered contact number on the Application Status page to view updates.',
  },
] as const;

export function RegistrationConfirmationPage() {
  useDocumentTitle('Registration Confirmation');

  return (
    <AccountPageShell
      kicker="Admissions Confirmation"
      title="Registration Confirmation"
      description="Preview of the confirmation state displayed after submitting a student admission application."
      maxWidth="lg"
    >
      <Card padding="lg" className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-4 border-b border-[#E2E8F0] pb-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#071A36] text-[#D9A52E] shadow-sm">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>

          <div className="space-y-2 max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C8202B]">
              Demonstration Screen
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#071A36]">
              Registration Received — Frontend Demonstration
            </h2>
            <p className="text-sm leading-relaxed text-[#64748B]">
              Thank you for reviewing the SK Tape Ball Academy registration confirmation flow. No
              database record has been created yet; real application references will be generated
              automatically once backend persistence is connected.
            </p>
          </div>
        </div>

        <div className="rounded-[12px] border border-[#D9A52E]/60 bg-[#F5F7FA] p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Application Reference Placeholder
            </p>
            <p className="font-mono text-lg font-bold tracking-wide text-[#071A36]">
              [APP-REF-PLACEHOLDER]
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-[10px] border border-[#071A36]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#071A36]">
            <ClipboardCheck className="h-3.5 w-3.5 text-[#D9A52E]" aria-hidden="true" />
            <span>Sample Placeholder ID</span>
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#071A36]">What Happens Next</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {NEXT_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 space-y-1.5"
              >
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#D9A52E]">
                  Step {item.step}
                </p>
                <p className="text-sm font-bold text-[#071A36]">{item.title}</p>
                <p className="text-xs leading-relaxed text-[#64748B]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-[12px] border border-[#071A36]/15 bg-[#F5F7FA] p-4 text-xs leading-relaxed text-[#071A36]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
          <p>
            This confirmation page is a non-persisted frontend template. Please use the{' '}
            <Link to="/contact" className="font-semibold underline hover:text-[#C8202B]">
              Contact Page
            </Link>{' '}
            for direct academy inquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button to="/" variant="outline" size="lg" className="gap-2">
            <Home className="h-4 w-4" aria-hidden="true" />
            <span>Return Home</span>
          </Button>
          <Button to="/application-status" variant="primary" size="lg" className="gap-2">
            <span>Track Application</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Link
            to="/register"
            className="ml-auto text-sm font-semibold text-[#071A36] underline-offset-4 hover:text-[#C8202B] hover:underline"
          >
            Back to Registration Form
          </Link>
        </div>
      </Card>
    </AccountPageShell>
  );
}
