import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '@/src/context/AdminAuthContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { ACADEMY_BRAND } from '@/src/data/brand';
import { OFFICIAL_LOGO_CONFIG } from '@/src/assets/branding';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { PasswordInput } from '@/src/components/ui/PasswordInput';

export function AdminLoginPage() {
  useDocumentTitle('Management Portal Sign In');
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isLoading,
    isAuthenticated,
    isSupabaseMode,
    hasLocalOperatorSetup,
    lockoutRemainingSec,
    signIn,
    registerLocalOperator,
  } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('Sami Khan');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const destination =
    (location.state as { from?: string } | null)?.from || '/sk-portal';

  if (!isLoading && isAuthenticated) {
    return <Navigate to={destination} replace />;
  }

  const isFirstTimeSetup = !isSupabaseMode && !hasLocalOperatorSetup;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      if (isFirstTimeSetup) {
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          return;
        }
        const result = await registerLocalOperator(email, displayName, password);
        if (!result.ok) {
          setErrorMessage(result.error ?? 'Could not configure operator access.');
          return;
        }
        navigate(destination, { replace: true });
        return;
      }

      const result = await signIn(email, password);
      if (!result.ok) {
        setErrorMessage(result.error ?? 'Sign in failed.');
        return;
      }
      navigate(destination, { replace: true });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050D1B] flex flex-col justify-center px-4 py-12 text-white">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <img
            src={OFFICIAL_LOGO_CONFIG.src}
            alt={OFFICIAL_LOGO_CONFIG.alt}
            className="h-20 w-auto object-contain"
          />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D9A52E]">
              Protected Management Access
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white">
              {ACADEMY_BRAND.name}
            </h1>
          </div>
        </div>

        <Card padding="lg" className="bg-white text-[#071A36] border-[#E2E8F0]">
          <div className="space-y-1.5 border-b border-[#E2E8F0] pb-4 mb-5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#071A36]">
              <Lock className="h-4 w-4 text-[#D9A52E]" aria-hidden="true" />
              <span>
                {isFirstTimeSetup
                  ? 'Initial Administrator Setup'
                  : 'Administrator Sign In'}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#64748B]">
              {isFirstTimeSetup
                ? 'Set your private administrator email and password to protect access to the academy management portal on this browser.'
                : isSupabaseMode
                  ? 'Sign in with a verified administrator account connected to Supabase.'
                  : 'Enter your registered administrator credentials to access the academy management portal.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isFirstTimeSetup && (
              <Input
                label="Administrator Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            )}

            <Input
              label="Administrator Email"
              type="email"
              autoComplete="username"
              placeholder="name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <PasswordInput
              label="Password"
              autoComplete={isFirstTimeSetup ? 'new-password' : 'current-password'}
              placeholder={isFirstTimeSetup ? 'Minimum 8 characters' : 'Enter password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {isFirstTimeSetup && (
              <PasswordInput
                label="Confirm Password"
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}

            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-[10px] border border-[#C8202B]/30 bg-[#C8202B]/5 px-3.5 py-2.5 text-xs font-semibold text-[#C8202B]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}

            {lockoutRemainingSec > 0 && (
              <p className="text-xs font-semibold text-[#C8202B] tabular-nums">
                Sign in temporarily paused ({lockoutRemainingSec}s remaining).
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={submitting || lockoutRemainingSec > 0}
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>
                {submitting
                  ? 'Verifying...'
                  : isFirstTimeSetup
                    ? 'Create Admin Access & Enter Portal'
                    : 'Sign In to Management Portal'}
              </span>
            </Button>
          </form>
        </Card>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-[#D9A52E] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
