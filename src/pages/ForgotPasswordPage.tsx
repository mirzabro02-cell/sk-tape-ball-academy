import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';
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
    }, 300);
  }

  return (
    <AccountPageShell
      kicker="Account Recovery"
      title="Forgot Password"
      description="Enter the email address linked to your player account to request recovery assistance."
      maxWidth="md"
    >
      <Card padding="lg" className="space-y-6">
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
              className="flex items-start gap-2.5 rounded-[10px] border border-[#C8202B]/30 bg-[#C8202B]/10 px-4 py-3 text-sm text-[#C8202B] dark:text-[#FCA5A5]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {submittedEmail && (
            <div
              role="status"
              className="rounded-[12px] border border-[#07152C]/20 bg-[#F5F7FA] p-4 space-y-2 text-sm text-[#07152C] dark:border-white/15 dark:bg-[#07152C] dark:text-[#E2E8F0]"
            >
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#D5A52B]" aria-hidden="true" />
                <span>Recovery Request Noted</span>
              </div>
              <p className="leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                If <strong className="text-[#07152C] dark:text-white">{submittedEmail}</strong> is associated with an active enrolled account, please contact SK Tape Ball Academy administration to reset access credentials directly.
              </p>
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
            <span>{isSubmitting ? 'Submitting Request...' : 'Request Account Recovery'}</span>
          </Button>
        </form>

        <div className="border-t border-[#E2E8F0] pt-5 flex flex-wrap items-center justify-between gap-3 text-sm dark:border-white/10">
          <Link
            to="/login"
            className="font-semibold text-[#07152C] underline-offset-4 hover:text-[#C8202B] hover:underline dark:text-[#D5A52B] dark:hover:text-white"
          >
            Back to Login
          </Link>
          <Link
            to="/contact"
            className="text-[#475569] font-medium hover:text-[#07152C] dark:text-[#B4C4DC] dark:hover:text-white"
          >
            Contact Support Desk
          </Link>
        </div>
      </Card>
    </AccountPageShell>
  );
}
