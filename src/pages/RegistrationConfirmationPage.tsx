import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ClipboardCheck, Home } from 'lucide-react';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { AccountPageShell } from '@/src/components/account/AccountPageShell';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

const NEXT_STEPS = [
  {
    step: '01',
    title: 'Application Review',
    description:
      'Academy staff review player age group, preferred training track, and guardian contact information.',
  },
  {
    step: '02',
    title: 'Baseline Review & Placement',
    description:
      'Applicants are scheduled for an initial skill review so coaches can recommend the most suitable batch.',
  },
  {
    step: '03',
    title: 'Track Status Anytime',
    description:
      'Save your application reference ID to check review updates on the Application Status page.',
  },
] as const;

export function RegistrationConfirmationPage() {
  useDocumentTitle('Registration Confirmation');
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref');
  const studentName = searchParams.get('name');

  return (
    <AccountPageShell
      kicker="Admissions Confirmation"
      title="Application Submitted"
      description="Your registration application has been recorded for review by SK Tape Ball Academy."
      maxWidth="lg"
    >
      <Card padding="lg" className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-4 border-b border-[#E2E8F0] pb-6 dark:border-white/10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#07152C] text-[#D5A52B] shadow-sm dark:bg-[#162B4D] dark:border dark:border-[#D5A52B]/40">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>

          <div className="space-y-2 max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C8202B] dark:text-[#D5A52B]">
              Registration Logged
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#07152C] dark:text-white">
              {studentName
                ? `Thank You, ${studentName}`
                : 'Thank You for Applying to SK Tape Ball Academy'}
            </h2>
            <p className="text-sm leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
              Your admission details have been received. Please save your reference ID below to track application review status.
            </p>
          </div>
        </div>

        {refCode && (
          <div className="rounded-[12px] border border-[#D5A52B]/60 bg-[#F5F7FA] p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between dark:bg-[#07152C]">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#7F95B8]">
                Application Reference ID
              </p>
              <p className="font-mono text-lg font-bold tracking-wide text-[#07152C] dark:text-white">
                {refCode}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-[10px] border border-[#07152C]/15 bg-white px-3 py-1.5 text-xs font-semibold text-[#07152C] dark:border-white/15 dark:bg-[#0F213B] dark:text-[#D5A52B]">
              <ClipboardCheck className="h-3.5 w-3.5 text-[#D5A52B]" aria-hidden="true" />
              <span>Pending Review</span>
            </span>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#07152C] dark:text-white">What Happens Next</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {NEXT_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 space-y-1.5 dark:border-white/10 dark:bg-[#07152C]"
              >
                <p className="font-mono text-xs font-extrabold uppercase tracking-wider text-[#D5A52B]">
                  Step {item.step}
                </p>
                <p className="text-sm font-bold text-[#07152C] dark:text-white">{item.title}</p>
                <p className="text-xs leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
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
            className="ml-auto text-sm font-semibold text-[#07152C] underline-offset-4 hover:text-[#C8202B] hover:underline dark:text-[#D5A52B] dark:hover:text-white"
          >
            Submit Another Application
          </Link>
        </div>
      </Card>
    </AccountPageShell>
  );
}
