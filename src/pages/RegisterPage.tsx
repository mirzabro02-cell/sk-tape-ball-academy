import { useState, type FormEvent } from 'react';
import { PROGRAM_SELECT_PLACEHOLDERS } from '@/src/data/placeholders';
import { academyService } from '@/src/services/academyService';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { PlaceholderNotice } from '@/src/components/ui/PlaceholderNotice';
import { Select } from '@/src/components/ui/Select';

export function RegisterPage() {
  useDocumentTitle('Register Now');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phonePlaceholder, setPhonePlaceholder] = useState('');
  const [programInterest, setProgramInterest] = useState('');
  const [feedback, setFeedback] = useState<{ valid: boolean; message: string } | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(
      academyService.validateRegistrationDraft({
        fullName,
        email,
        phonePlaceholder,
        programInterest,
      }),
    );
  }

  return (
    <PlaceholderNotice
      routePath="/register"
      sectionLabel="Player Enrollment"
      title="Academy Registration"
      description="Placeholder page for player admission and enrollment. Full registration flow and Supabase account creation will be implemented in later parts."
      plannedModules={[
        'Player & Guardian Profile Form',
        'Batch & Fee Plan Selection',
        'Academy Code of Conduct Acknowledgement',
      ]}
    >
      <Card padding="lg">
        <h2 className="text-xl font-bold text-[#071A36]">
          Registration Controls Preview (Placeholder)
        </h2>
        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Full Name"
            placeholder="Enter player full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Contact Phone"
            type="tel"
            placeholder="Phone number"
            value={phonePlaceholder}
            onChange={(e) => setPhonePlaceholder(e.target.value)}
          />
          <Select
            label="Program Interest"
            options={PROGRAM_SELECT_PLACEHOLDERS}
            value={programInterest}
            onChange={(e) => setProgramInterest(e.target.value)}
          />

          {feedback && (
            <div
              className={`sm:col-span-2 rounded-[10px] border px-4 py-3 text-sm ${
                feedback.valid
                  ? 'border-[#071A36]/20 bg-[#F5F7FA] text-[#071A36]'
                  : 'border-[#C8202B]/30 bg-[#C8202B]/5 text-[#C8202B]'
              }`}
            >
              {feedback.message}
            </div>
          )}

          <div className="sm:col-span-2 flex flex-wrap gap-3">
            <Button type="submit" variant="primary">
              Validate Registration Draft
            </Button>
            <Button to="/login" variant="outline">
              Existing Member Login
            </Button>
          </div>
        </form>
      </Card>
    </PlaceholderNotice>
  );
}
