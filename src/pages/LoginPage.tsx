import { useState, type FormEvent } from 'react';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { PlaceholderNotice } from '@/src/components/ui/PlaceholderNotice';

export function LoginPage() {
  useDocumentTitle('Member Login');

  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(
      'Authentication is not active in Part 1. Real Supabase Auth sign-in will be integrated in a later part.',
    );
  }

  return (
    <PlaceholderNotice
      routePath="/login"
      sectionLabel="Portal Access"
      title="Member & Portal Login"
      description="Placeholder authentication route. No fake login or mock session state is active in Part 1."
      plannedModules={[
        'Supabase Auth Email/Password Sign-In',
        'Role-Based Redirect (Player / Coach / Admin)',
        'Password Recovery Flow',
      ]}
    >
      <Card className="max-w-lg" padding="lg">
        <h2 className="text-xl font-bold text-[#071A36]">Sign-In Form Placeholder</h2>
        <p className="mt-1 text-sm text-[#64748B]">
          No fake authentication is performed here; submitting displays integration status.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Account Email"
            type="email"
            placeholder="Enter account email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Password field placeholder"
            required
          />

          {statusMessage && (
            <div className="rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] px-4 py-3 text-sm text-[#071A36]">
              {statusMessage}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button type="submit" variant="secondary">
              Check Auth Status
            </Button>
            <Button to="/register" variant="outline">
              Go to Register
            </Button>
          </div>
        </form>
      </Card>
    </PlaceholderNotice>
  );
}
