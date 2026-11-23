import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Check, CheckCircle2, Info, KeyRound } from 'lucide-react';
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
      ? 'bg-[#D9A52E]'
      : strength.label === 'Fair'
        ? 'bg-[#071A36]'
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
        'Password validation passed (Strength: ' +
          strength.label +
          '). Frontend-only preview: no password was changed because actual password resets require backend authentication integration.',
      );
    }, 350);
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
        <div className="flex items-start gap-3 rounded-[12px] border border-[#071A36]/15 bg-[#F5F7FA] p-4 text-xs leading-relaxed text-[#071A36]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
          <p>
            <strong>Backend Integration Required:</strong> This interface validates password
            strength and matching on the client only. Actual password resets require a verified
            backend recovery token.
          </p>
        </div>

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

          <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#071A36]">Password Strength Guidance</span>
              <span
                className={
                  strength.label === 'Strong'
                    ? 'text-[#071A36]'
                    : strength.label === 'Fair'
                      ? 'text-[#071A36]'
                      : 'text-[#C8202B]'
                }
              >
                {newPassword ? strength.label : 'Not entered'}
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
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
                    rule.met ? 'font-medium text-[#071A36]' : 'text-[#64748B]'
                  }`}
                >
                  <span
                    className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      rule.met
                        ? 'border-[#071A36] bg-[#071A36] text-[#D9A52E]'
                        : 'border-[#E2E8F0] bg-white text-transparent'
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
              className="flex items-start gap-2.5 rounded-[10px] border border-[#C8202B]/30 bg-[#C8202B]/5 px-4 py-3 text-sm text-[#C8202B]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Please resolve the highlighted password requirements above.</span>
            </div>
          )}

          {resetMessage && (
            <div
              role="status"
              className="flex items-start gap-2.5 rounded-[10px] border border-[#071A36]/20 bg-[#F5F7FA] px-4 py-3.5 text-sm leading-relaxed text-[#071A36]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
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
            <span>{isSubmitting ? 'Validating Password...' : 'Reset Password'}</span>
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
            to="/forgot-password"
            className="text-[#64748B] font-medium hover:text-[#071A36]"
          >
            Request Another Reset
          </Link>
        </div>
      </Card>
    </AccountPageShell>
  );
}
