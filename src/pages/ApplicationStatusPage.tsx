import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  XCircle,
} from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import type { AdminApplication, AdmissionDecisionStatus } from '@/src/types/admin';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { isValidPhoneNumber } from '@/src/utils/validation';
import { AccountPageShell } from '@/src/components/account/AccountPageShell';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { cn } from '@/src/utils/cn';

interface LookupErrors {
  reference?: string;
  contactPhone?: string;
}

const STATUS_BADGE_STYLES: Record<
  AdmissionDecisionStatus,
  { badgeClass: string; Icon: typeof Clock; summary: string }
> = {
  Pending: {
    badgeClass: 'border-[#D9A52E]/50 bg-[#D9A52E]/15 text-[#071A36]',
    Icon: Clock,
    summary: 'Your application has been logged and is awaiting initial staff review.',
  },
  'Under Review': {
    badgeClass: 'border-[#071A36]/25 bg-[#071A36] text-white',
    Icon: Search,
    summary: 'Admissions staff are reviewing player background and batch availability.',
  },
  Approved: {
    badgeClass: 'border-[#D9A52E] bg-[#071A36] text-[#D9A52E]',
    Icon: CheckCircle2,
    summary:
      'Your application has been approved. Please follow onboarding guidance from academy staff.',
  },
  Rejected: {
    badgeClass: 'border-[#C8202B]/40 bg-[#C8202B]/10 text-[#C8202B]',
    Icon: XCircle,
    summary:
      'This application was not approved for the requested intake. Contact our desk for details.',
  },
  'More Information Required': {
    badgeClass: 'border-[#C8202B]/40 bg-[#F5F7FA] text-[#C8202B]',
    Icon: AlertCircle,
    summary:
      'Additional details are needed before completing review. Please contact academy admissions.',
  },
};

export function ApplicationStatusPage() {
  useDocumentTitle('Application Status Tracker');
  const { state } = useAcademyState();

  const [reference, setReference] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [errors, setErrors] = useState<LookupErrors>({});
  const [matchedApplication, setMatchedApplication] = useState<AdminApplication | null>(null);
  const [searchedEmpty, setSearchedEmpty] = useState(false);

  function validateLookup(): LookupErrors {
    const nextErrors: LookupErrors = {};
    if (!reference.trim() || reference.trim().length < 4) {
      nextErrors.reference = 'Please enter your application reference ID (e.g., SK-APP-123456).';
    }
    if (contactPhone.trim() && !isValidPhoneNumber(contactPhone)) {
      nextErrors.contactPhone = 'Enter a valid phone number (7–15 digits).';
    }
    return nextErrors;
  }

  function handleLookupSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMatchedApplication(null);
    setSearchedEmpty(false);

    const nextErrors = validateLookup();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const targetRef = reference.trim().toLowerCase();
    const targetDigits = contactPhone.replace(/\D/g, '');

    const found = state.applications.find((app) => {
      const refMatch = app.referencePlaceholder.trim().toLowerCase() === targetRef;
      if (!refMatch) return false;
      if (!targetDigits) return true;
      const storedDigits = app.contactPlaceholder.replace(/\D/g, '');
      return !storedDigits || storedDigits.endsWith(targetDigits.slice(-7));
    });

    if (found) {
      setMatchedApplication(found);
    } else {
      setSearchedEmpty(true);
    }
  }

  const statusMeta = matchedApplication ? STATUS_BADGE_STYLES[matchedApplication.status] : null;
  const StatusIcon = statusMeta?.Icon ?? Clock;

  return (
    <AccountPageShell
      kicker="Application Tracking"
      title="Track Admission Application"
      description="Enter your application reference ID from registration to check your current admission review status."
      maxWidth="xl"
    >
      <Card padding="lg" className="space-y-6">
        <form onSubmit={handleLookupSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Application Reference"
              placeholder="e.g., SK-APP-123456"
              value={reference}
              onChange={(e) => {
                setReference(e.target.value);
                if (errors.reference) {
                  setErrors((prev) => ({ ...prev, reference: undefined }));
                }
              }}
              error={errors.reference}
              required
            />

            <Input
              label="Contact Number (Optional Verification)"
              type="tel"
              placeholder="03XX XXXXXXX"
              value={contactPhone}
              onChange={(e) => {
                setContactPhone(e.target.value);
                if (errors.contactPhone) {
                  setErrors((prev) => ({ ...prev, contactPhone: undefined }));
                }
              }}
              error={errors.contactPhone}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button type="submit" variant="primary" size="lg" className="gap-2">
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>Track Application</span>
            </Button>

            <Link
              to="/register"
              className="text-sm font-semibold text-[#071A36] underline-offset-4 hover:text-[#C8202B] hover:underline"
            >
              Submit New Registration
            </Link>
          </div>
        </form>
      </Card>

      {searchedEmpty && (
        <Card tone="muted" padding="lg" className="space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#C8202B]" aria-hidden="true" />
            <div className="space-y-1.5">
              <h2 className="text-base font-bold text-[#071A36]">
                No Matching Application Found
              </h2>
              <p className="text-sm leading-relaxed text-[#64748B]">
                We could not find an application matching reference{' '}
                <strong className="text-[#071A36]">{reference.trim()}</strong>. Double-check the reference ID issued when submitting your registration, or contact SK Tape Ball Academy for assistance.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button to="/register" variant="primary" size="sm">
              Register New Application
            </Button>
            <Button to="/contact" variant="outline" size="sm">
              Contact Admissions
            </Button>
          </div>
        </Card>
      )}

      {matchedApplication && statusMeta && (
        <Card padding="lg" className="space-y-6">
          <div className="rounded-[14px] border border-[#E2E8F0] bg-[#F5F7FA] p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Reference ID
                </p>
                <p className="font-mono text-sm font-bold text-[#071A36]">
                  {matchedApplication.referencePlaceholder}
                </p>
              </div>

              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-[10px] border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider',
                  statusMeta.badgeClass,
                )}
              >
                <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{matchedApplication.status}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 border-t border-[#E2E8F0] pt-4 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs text-[#64748B]">Applicant</p>
                <p className="font-semibold text-[#071A36]">{matchedApplication.applicantName}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">Program</p>
                <p className="font-semibold text-[#071A36]">{matchedApplication.requestedProgram}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">Submitted</p>
                <p className="font-semibold text-[#071A36]">{matchedApplication.submittedLabel}</p>
              </div>
            </div>

            <p className="text-sm text-[#64748B]">{statusMeta.summary}</p>

            {matchedApplication.reviewerNotes && (
              <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-3.5 text-xs text-[#64748B]">
                <strong className="text-[#071A36]">Notes:</strong> {matchedApplication.reviewerNotes}
              </div>
            )}
          </div>
        </Card>
      )}
    </AccountPageShell>
  );
}
