import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Check, CheckCircle2, KeyRound } from 'lucide-react';
import { evaluatePasswordStrength } from '@/src/data/accountContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { AccountPageShell } from '@/src/components/account/AccountPageShell';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { PasswordInput } from '@/src/components/ui/PasswordInput';

interface ResetErrors {
  newPassword?: string;
  confirmPassword?: string;
}

export function ResetPasswordPage() {
  useDocumentTitle('Reset Password');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ResetErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const strength = useMemo(() => evaluatePasswordStrength(newPassword), [newPassword]);

  const strengthBarColor =
    strength.label === 'Strong'
      ? 'bg-[#D5A52B]'
      : strength.label === 'Fair'
        ? 'bg-[#07152C] dark:bg-white'
        : 'bg-[#C8202B]';

  const strengthWidthPercent = newPassword ? Math.max(20, (strength.score / 5) * 100) : 0;

  function validate(): ResetErrors {
    const nextErrors: ResetErrors = {};

    if (!newPassword) {
      nextErrors.newPassword = 'Please enter a new password.';
    } else if (!strength.checks.minLength || strength.score < 3) {
      nextErrors.newPassword =
        'Choose at least 8 characters and meet at least 3 password strength criteria.';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your new password.';
    } else if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = 'Passwords do not match. Please re-enter carefully.';
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResetMessage(null);

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setResetMessage(
        'Password criteria confirmed (' +
          strength.label +
          '). Contact SK Tape Ball Academy administration if you need your member account credentials re-issued.',
      );
    }, 300);
  }

  const ruleItems = [
    { label: 'At least 8 characters', met: strength.checks.minLength },
    { label: 'One uppercase letter (A–Z)', met: strength.checks.hasUppercase },
    { label: 'One lowercase letter (a–z)', met: strength.checks.hasLowercase },
    { label: 'One number (0–9)', met: strength.checks.hasNumber },
    { label: 'One special character (!@#$)', met: strength.checks.hasSpecial },
  ];

  return (
    <AccountPageShell
      kicker="Account Security"
      title="Reset Password"
      description="Create a strong new password meeting SK Tape Ball Academy security standards."
      maxWidth="md"
    >
      <Card padding="lg" className="space-y-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <PasswordInput
            label="New Password"
            autoComplete="new-password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.newPassword) {
                setErrors((prev) => ({ ...prev, newPassword: undefined }));
              }
              setResetMessage(null);
            }}
            error={errors.newPassword}
            required
          />

          <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 space-y-3 dark:border-white/10 dark:bg-[#07152C]">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#07152C] dark:text-white">Password Strength</span>
              <span
                className={
                  strength.label === 'Strong' || strength.label === 'Fair'
                    ? 'text-[#07152C] dark:text-[#D5A52B]'
                    : 'text-[#C8202B] dark:text-[#FCA5A5]'
                }
              >
                {newPassword ? strength.label : 'Not entered'}
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0] dark:bg-white/10">
              <div
                className={`h-full transition-all duration-200 ${strengthBarColor}`}
                style={{ width: `${strengthWidthPercent}%` }}
              />
            </div>

            <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 pt-1">
              {ruleItems.map((rule) => (
                <li
                  key={rule.label}
                  className={`flex items-center gap-2 text-xs ${
                    rule.met
                      ? 'font-medium text-[#07152C] dark:text-white'
                      : 'text-[#64748B] dark:text-[#7F95B8]'
                  }`}
                >
                  <span
                    className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      rule.met
                        ? 'border-[#07152C] bg-[#07152C] text-[#D5A52B] dark:border-[#D5A52B] dark:bg-[#D5A52B] dark:text-[#07152C]'
                        : 'border-[#E2E8F0] bg-white text-transparent dark:border-white/15 dark:bg-[#0F213B]'
                    }`}
                  >
                    <Check className="h-2.5 w-2.5" aria-hidden="true" />
                  </span>
                  <span>{rule.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <PasswordInput
            label="Confirm New Password"
            autoComplete="new-password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }
              setResetMessage(null);
            }}
            error={errors.confirmPassword}
            required
          />

          {Object.keys(errors).length > 0 && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-[10px] border border-[#C8202B]/30 bg-[#C8202B]/10 px-4 py-3 text-sm text-[#C8202B] dark:text-[#FCA5A5]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Please resolve the highlighted password requirements above.</span>
            </div>
          )}

          {resetMessage && (
            <div
              role="status"
              className="flex items-start gap-2.5 rounded-[10px] border border-[#07152C]/20 bg-[#F5F7FA] px-4 py-3.5 text-sm leading-relaxed text-[#07152C] dark:border-white/15 dark:bg-[#07152C] dark:text-[#E2E8F0]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A52B]" aria-hidden="true" />
              <span>{resetMessage}</span>
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
            <KeyRound className="h-4 w-4" aria-hidden="true" />
            <span>{isSubmitting ? 'Saving...' : 'Reset Password'}</span>
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
            to="/forgot-password"
            className="text-[#475569] font-medium hover:text-[#07152C] dark:text-[#B4C4DC] dark:hover:text-white"
          >
            Request Another Reset
          </Link>
        </div>
      </Card>
    </AccountPageShell>
  );
}
