import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { isValidEmailAddress, isValidPhoneNumber } from '@/src/utils/validation';
import { AccountPageShell } from '@/src/components/account/AccountPageShell';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { PasswordInput } from '@/src/components/ui/PasswordInput';

interface LoginErrors {
  identifier?: string;
  password?: string;
}

export function LoginPage() {
  useDocumentTitle('Player Account Login');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isChecking, setIsChecking] = useState(false);
  const [formErrorBanner, setFormErrorBanner] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  function validate(): LoginErrors {
    const nextErrors: LoginErrors = {};
    const trimmedId = identifier.trim();

    if (!trimmedId) {
      nextErrors.identifier = 'Please enter your registered email address or phone number.';
    } else if (!isValidEmailAddress(trimmedId) && !isValidPhoneNumber(trimmedId)) {
      nextErrors.identifier = 'Enter a valid email address or phone number (7–15 digits).';
    }

    if (!password) {
      nextErrors.password = 'Please enter your password.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormErrorBanner(null);
    setStatusNotice(null);

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setFormErrorBanner('Please review the highlighted fields before continuing.');
      return;
    }

    setErrors({});
    setIsChecking(true);

    window.setTimeout(() => {
      setIsChecking(false);
      setStatusNotice(
        `Player portal access for "${identifier.trim()}"${rememberMe ? ' (device preference noted)' : ''} is issued only after active squad enrollment is confirmed by academy staff.`,
      );
    }, 300);
  }

  return (
    <AccountPageShell
      kicker="Player & Guardian Access"
      title="Player Account Login"
      description="Sign in with credentials issued after squad admission to view attendance updates and session notices."
      maxWidth="md"
    >
      <Card padding="lg" className="space-y-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Input
            label="Email or Phone Number"
            type="text"
            autoComplete="username"
            placeholder="player@example.com or 03XX XXXXXXX"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (errors.identifier) {
                setErrors((prev) => ({ ...prev, identifier: undefined }));
              }
              setFormErrorBanner(null);
              setStatusNotice(null);
            }}
            error={errors.identifier}
            required
          />

          <PasswordInput
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
              setFormErrorBanner(null);
              setStatusNotice(null);
            }}
            error={errors.password}
            required
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <label className="inline-flex items-center gap-2.5 text-sm text-[#07152C] dark:text-[#E2E8F0] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#E2E8F0] accent-[#D5A52B]"
              />
              <span>Remember me on this device</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-[#07152C] underline-offset-4 hover:text-[#C8202B] hover:underline dark:text-[#D5A52B] dark:hover:text-white"
            >
              Forgot password?
            </Link>
          </div>

          {formErrorBanner && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-[10px] border border-[#C8202B]/30 bg-[#C8202B]/10 px-4 py-3 text-sm text-[#C8202B] dark:text-[#FCA5A5]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{formErrorBanner}</span>
            </div>
          )}

          {statusNotice && (
            <div
              role="status"
              className="flex items-start gap-2.5 rounded-[10px] border border-[#07152C]/20 bg-[#F5F7FA] px-4 py-3.5 text-sm leading-relaxed text-[#07152C] dark:border-white/15 dark:bg-[#07152C] dark:text-[#E2E8F0]"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A52B]" aria-hidden="true" />
              <span>{statusNotice}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isChecking}
            className="gap-2"
          >
            <Lock className="h-4 w-4" aria-hidden="true" />
            <span>{isChecking ? 'Checking Account...' : 'Sign In'}</span>
          </Button>
        </form>

        <div className="border-t border-[#E2E8F0] pt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm dark:border-white/10">
          <p className="text-[#475569] dark:text-[#B4C4DC]">
            New to SK Tape Ball Academy?{' '}
            <Link
              to="/register"
              className="font-semibold text-[#07152C] underline-offset-4 hover:text-[#C8202B] hover:underline dark:text-[#D5A52B] dark:hover:text-white"
            >
              Register Now
            </Link>
          </p>
          <Link
            to="/application-status"
            className="font-semibold text-[#07152C] underline-offset-4 hover:text-[#C8202B] hover:underline dark:text-[#D5A52B] dark:hover:text-white"
          >
            Track Application Status
          </Link>
        </div>
      </Card>
    </AccountPageShell>
  );
}
