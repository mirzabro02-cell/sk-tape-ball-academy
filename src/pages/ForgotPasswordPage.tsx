import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Info, Mail } from 'lucide-react';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { isValidEmailAddress } from '@/src/utils/validation';
import { AccountPageShell } from '@/src/components/account/AccountPageShell';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';

export function ForgotPasswordPage() {
  useDocumentTitle('Forgot Password');

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedEmail(null);

    const cleaned = email.trim();
    if (!cleaned) {
      setError('Please enter your account email address.');
      return;
    }
    if (!isValidEmailAddress(cleaned)) {
      setError('Please enter a valid email address (for example, name@example.com).');
      return;
    }

    setError(undefined);
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedEmail(cleaned);
    }, 350);
  }

  return (
    <AccountPageShell
      kicker="Account Recovery"
      title="Forgot Password"
      description="Enter the email address associated with your academy account to preview the password recovery workflow."
      maxWidth="md"
    >
      <Card padding="lg" className="space-y-6">
        <div className="flex items-start gap-3 rounded-[12px] border border-[#071A36]/15 bg-[#F5F7FA] p-4 text-xs leading-relaxed text-[#071A36]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
          <p>
            <strong>No Emails Sent:</strong> This is a frontend recovery flow. Actual reset links
            and verification emails require backend integration.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Input
            label="Account Email Address"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) {
                setError(undefined);
              }
              setSubmittedEmail(null);
            }}
            error={error}
            required
          />

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-[10px] border border-[#C8202B]/30 bg-[#C8202B]/5 px-4 py-3 text-sm text-[#C8202B]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {submittedEmail && (
            <div
              role="status"
              className="rounded-[12px] border border-[#071A36]/20 bg-[#F5F7FA] p-4 space-y-2 text-sm text-[#071A36]"
            >
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
                <span>Reset Request Validated (Frontend Demonstration)</span>
              </div>
              <p className="leading-relaxed text-[#64748B]">
                Email format verified for{' '}
                <strong className="text-[#071A36]">{submittedEmail}</strong>. No actual email was
                dispatched because password recovery requires backend integration with the academy
                authentication service.
              </p>
              <div className="pt-1">
                <Link
                  to="/reset-password"
                  className="text-xs font-semibold text-[#071A36] underline underline-offset-4 hover:text-[#C8202B]"
                >
                  Preview Reset Password Screen
                </Link>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting}
            className="gap-2"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span>{isSubmitting ? 'Validating Request...' : 'Submit Reset Request'}</span>
          </Button>
        </form>

        <div className="border-t border-[#E2E8F0] pt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link
            to="/login"
            className="font-semibold text-[#071A36] underline-offset-4 hover:text-[#C8202B] hover:underline"
          >
            Back to Login
          </Link>
          <Link
            to="/reset-password"
            className="text-[#64748B] font-medium hover:text-[#071A36]"
          >
            Go to Reset Password UI
          </Link>
        </div>
      </Card>
    </AccountPageShell>
  );
}
