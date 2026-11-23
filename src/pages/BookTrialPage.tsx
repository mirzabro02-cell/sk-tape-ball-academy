import { useState, type FormEvent } from 'react';
import { PROGRAM_SELECT_PLACEHOLDERS } from '@/src/data/placeholders';
import { academyService } from '@/src/services/academyService';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { PlaceholderNotice } from '@/src/components/ui/PlaceholderNotice';
import { Select } from '@/src/components/ui/Select';
import { Textarea } from '@/src/components/ui/Textarea';

export function BookTrialPage() {
  useDocumentTitle('Book Free Trial');

  const [playerName, setPlayerName] = useState('');
  const [guardianOrContact, setGuardianOrContact] = useState('');
  const [preferredProgram, setPreferredProgram] = useState('');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState<{ valid: boolean; message: string } | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = academyService.validateTrialDraft({
      playerName,
      guardianOrContact,
      preferredProgram,
      notes,
    });
    setFeedback(result);
  }

  return (
    <PlaceholderNotice
      routePath="/book-trial"
      sectionLabel="Admissions & Trials"
      title="Book a Free Trial Session"
      description="Placeholder layout for the free trial booking workflow. Reusable form controls are active for UI testing; backend persistence will be wired later."
      plannedModules={[
        'Trial Slot Availability Selector',
        'Player Skill Assessment Intake Form',
        'Confirmation & Ground Reporting Instructions',
      ]}
    >
      <Card padding="lg">
        <h2 className="text-xl font-bold text-[#071A36]">
          Trial Form Controls Preview (Placeholder)
        </h2>
        <p className="mt-1 text-sm text-[#64748B]">
          Demonstrates 50px form controls and validation states without submitting to a backend yet.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Player Full Name"
            placeholder="Enter player name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
          />
          <Input
            label="Contact Email or Phone Placeholder"
            placeholder="Enter contact details"
            value={guardianOrContact}
            onChange={(e) => setGuardianOrContact(e.target.value)}
            required
          />
          <div className="sm:col-span-2">
            <Select
              label="Preferred Training Track"
              options={PROGRAM_SELECT_PLACEHOLDERS}
              value={preferredProgram}
              onChange={(e) => setPreferredProgram(e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Textarea
              label="Playing Role / Notes (Optional)"
              placeholder="e.g., Right-arm pace bowler, tape ball experience..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

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

          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <Button type="submit" variant="primary">
              Test Form Validation
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPlayerName('');
                setGuardianOrContact('');
                setPreferredProgram('');
                setNotes('');
                setFeedback(null);
              }}
            >
              Reset Fields
            </Button>
          </div>
        </form>
      </Card>
    </PlaceholderNotice>
  );
}
