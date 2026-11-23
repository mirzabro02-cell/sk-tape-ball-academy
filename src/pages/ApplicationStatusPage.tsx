import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Info,
  Search,
  XCircle,
} from 'lucide-react';
import {
  APPLICATION_STATUS_DEMOS,
  type ApplicationStatusKey,
} from '@/src/data/accountContent';
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
  ApplicationStatusKey,
  { badgeClass: string; Icon: typeof Clock }
> = {
  pending: {
    badgeClass: 'border-[#D9A52E]/50 bg-[#D9A52E]/15 text-[#071A36]',
    Icon: Clock,
  },
  'under-review': {
    badgeClass: 'border-[#071A36]/25 bg-[#071A36] text-white',
    Icon: Search,
  },
  approved: {
    badgeClass: 'border-[#D9A52E] bg-[#071A36] text-[#D9A52E]',
    Icon: CheckCircle2,
  },
  rejected: {
    badgeClass: 'border-[#C8202B]/40 bg-[#C8202B]/10 text-[#C8202B]',
    Icon: XCircle,
  },
  'more-info': {
    badgeClass: 'border-[#C8202B]/40 bg-[#F5F7FA] text-[#C8202B]',
    Icon: AlertCircle,
  },
};

const DEMO_KEYS = Object.keys(APPLICATION_STATUS_DEMOS) as ApplicationStatusKey[];

export function ApplicationStatusPage() {
  useDocumentTitle('Application Status Tracker');

  const [reference, setReference] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [errors, setErrors] = useState<LookupErrors>({});
  const [isSearching, setIsSearching] = useState(false);
  const [activeStatusKey, setActiveStatusKey] = useState<ApplicationStatusKey>('under-review');
  const [lookupBanner, setLookupBanner] = useState<string | null>(null);

  const activeDemo = APPLICATION_STATUS_DEMOS[activeStatusKey];
  const StatusIcon = STATUS_BADGE_STYLES[activeStatusKey].Icon;

  function validateLookup(): LookupErrors {
    const nextErrors: LookupErrors = {};
    if (!reference.trim() || reference.trim().length < 4) {
      nextErrors.reference = 'Please enter an application reference ID (at least 4 characters).';
    }
    if (!contactPhone.trim()) {
      nextErrors.contactPhone = 'Please enter the student or guardian contact number.';
    } else if (!isValidPhoneNumber(contactPhone)) {
      nextErrors.contactPhone = 'Enter a valid phone number (7–15 digits).';
    }
    return nextErrors;
  }

  function handleLookupSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLookupBanner(null);

    const nextErrors = validateLookup();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSearching(true);

    window.setTimeout(() => {
      setIsSearching(false);
      setLookupBanner(
        `Validated tracking query for reference "${reference.trim()}". No real student records are stored yet—displaying demonstration status templates below.`,
      );
    }, 350);
  }

  return (
    <AccountPageShell
      kicker="Application Tracking"
      title="Track Admission Application"
      description="Check application progress and review all five official admission status layouts."
      maxWidth="xl"
    >
      <Card padding="lg" className="space-y-6">
        <div className="flex items-start gap-3 rounded-[12px] border border-[#071A36]/15 bg-[#F5F7FA] p-4 text-xs leading-relaxed text-[#071A36]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
          <p>
            <strong>Demonstration Data Only:</strong> No real student records or personal
            information exist in this frontend build. Live tracking queries will connect to the
            academy database in a later phase.
          </p>
        </div>

        <form onSubmit={handleLookupSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Application Reference"
              placeholder="e.g. [APP-REF-PLACEHOLDER]"
              value={reference}
              onChange={(e) => {
                setReference(e.target.value);
                if (errors.reference) {
                  setErrors((prev) => ({ ...prev, reference: undefined }));
                }
                setLookupBanner(null);
              }}
              error={errors.reference}
              required
            />

            <Input
              label="Student Contact Number"
              type="tel"
              placeholder="+92 300 0000000"
              value={contactPhone}
              onChange={(e) => {
                setContactPhone(e.target.value);
                if (errors.contactPhone) {
                  setErrors((prev) => ({ ...prev, contactPhone: undefined }));
                }
                setLookupBanner(null);
              }}
              error={errors.contactPhone}
              required
            />
          </div>

          {lookupBanner && (
            <div
              role="status"
              className="flex items-start gap-2.5 rounded-[10px] border border-[#071A36]/20 bg-[#F5F7FA] px-4 py-3 text-sm text-[#071A36]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
              <span>{lookupBanner}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSearching}
              className="gap-2"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>{isSearching ? 'Checking Inputs...' : 'Track Application'}</span>
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

      {/* Demonstration State Selector + Status Card */}
      <Card padding="lg" className="space-y-6">
        <div className="space-y-2 border-b border-[#E2E8F0] pb-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C8202B]">
            Status State Preview (Demonstration Templates)
          </p>
          <h2 className="text-xl font-bold text-[#071A36]">
            Inspect All 5 Admission Status States
          </h2>
          <p className="text-sm text-[#64748B]">
            Select any status below to preview how applicants see their application progress and
            next instructions.
          </p>

          <div className="flex flex-wrap gap-2 pt-2" role="tablist" aria-label="Application status demonstration states">
            {DEMO_KEYS.map((key) => {
              const demo = APPLICATION_STATUS_DEMOS[key];
              const isSelected = activeStatusKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setActiveStatusKey(key)}
                  className={cn(
                    'rounded-[10px] border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap',
                    isSelected
                      ? 'border-[#071A36] bg-[#071A36] text-white'
                      : 'border-[#E2E8F0] bg-[#F5F7FA] text-[#071A36] hover:border-[#071A36]/40',
                  )}
                >
                  {demo.statusLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Status Overview */}
        <div className="rounded-[14px] border border-[#E2E8F0] bg-[#F5F7FA] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Sample Reference Placeholder
              </p>
              <p className="font-mono text-sm font-bold text-[#071A36]">
                {activeDemo.sampleRefPlaceholder}
              </p>
            </div>

            <span
              className={cn(
                'inline-flex items-center gap-2 rounded-[10px] border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider',
                STATUS_BADGE_STYLES[activeStatusKey].badgeClass,
              )}
            >
              <StatusIcon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{activeDemo.statusLabel}</span>
            </span>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-extrabold text-[#071A36]">{activeDemo.headline}</h3>
            <p className="text-sm leading-relaxed text-[#64748B]">{activeDemo.summary}</p>
          </div>
        </div>

        {/* Progress Timeline & Instructions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#071A36]">
              Application Progress Timeline
            </h3>
            <ol className="space-y-3">
              {activeDemo.timeline.map((step) => {
                const stateStyle =
                  step.state === 'completed'
                    ? 'border-[#071A36]/20 bg-white'
                    : step.state === 'active'
                      ? 'border-[#D9A52E] bg-[#D9A52E]/10'
                      : step.state === 'attention'
                        ? 'border-[#C8202B]/40 bg-[#C8202B]/5'
                        : 'border-[#E2E8F0] bg-[#F5F7FA]';

                return (
                  <li
                    key={step.label}
                    className={cn('rounded-[12px] border p-4 flex items-start gap-3', stateStyle)}
                  >
                    <span className="mt-0.5 shrink-0">
                      {step.state === 'completed' ? (
                        <CheckCircle2 className="h-4 w-4 text-[#071A36]" aria-hidden="true" />
                      ) : step.state === 'active' ? (
                        <Clock className="h-4 w-4 text-[#D9A52E]" aria-hidden="true" />
                      ) : step.state === 'attention' ? (
                        <AlertCircle className="h-4 w-4 text-[#C8202B]" aria-hidden="true" />
                      ) : (
                        <span className="inline-block h-4 w-4 rounded-full border-2 border-[#CBD5E1]" />
                      )}
                    </span>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-[#071A36]">{step.label}</p>
                      <p className="text-xs leading-relaxed text-[#64748B]">{step.note}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#071A36]">
              Helpful Instructions
            </h3>
            <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 space-y-3">
              <ul className="space-y-2.5 text-sm leading-relaxed text-[#071A36]">
                {activeDemo.instructions.map((instruction) => (
                  <li key={instruction} className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D9A52E]" />
                    <span className="text-xs leading-relaxed text-[#64748B]">{instruction}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-[#E2E8F0] pt-3 flex flex-wrap gap-2">
                <Button to="/contact" variant="outline" size="sm">
                  Contact Admissions
                </Button>
                <Button to="/login" variant="secondary" size="sm">
                  Member Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </AccountPageShell>
  );
}
