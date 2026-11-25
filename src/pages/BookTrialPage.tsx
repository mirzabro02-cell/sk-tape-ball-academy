import { useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { TRAINING_PROGRAMS_DATA } from '@/src/data/academyInfo';
import {
  EXPERIENCE_OPTIONS,
  PREFERRED_TRIAL_TIME_OPTIONS,
  PROGRAM_SELECT_OPTIONS,
} from '@/src/data/admissionsContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import {
  calculateAgeFromDob,
  isFutureOrTodayDate,
  isValidEmailAddress,
  isValidPhoneNumber,
} from '@/src/utils/validation';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { PageHero } from '@/src/components/ui/PageHero';
import { Select } from '@/src/components/ui/Select';
import { Textarea } from '@/src/components/ui/Textarea';

interface TrialFormState {
  studentName: string;
  dobOrAge: string;
  guardianName: string;
  contactPhone: string;
  contactEmail: string;
  preferredProgram: string;
  preferredDate: string;
  preferredTime: string;
  previousExperience: string;
  additionalMessage: string;
}

type TrialFormErrors = Partial<Record<keyof TrialFormState, string>>;

const INITIAL_TRIAL_STATE: TrialFormState = {
  studentName: '',
  dobOrAge: '',
  guardianName: '',
  contactPhone: '',
  contactEmail: '',
  preferredProgram: '',
  preferredDate: '',
  preferredTime: '',
  previousExperience: '',
  additionalMessage: '',
};

export function BookTrialPage() {
  useDocumentTitle('Book Free Trial');
  const { setTrials } = useAcademyState();

  const [form, setForm] = useState<TrialFormState>(INITIAL_TRIAL_STATE);
  const [errors, setErrors] = useState<TrialFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedConfirmation, setSubmittedConfirmation] = useState<{
    studentName: string;
    requestCode: string;
  } | null>(null);

  function updateField<K extends keyof TrialFormState>(field: K, value: TrialFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (submittedConfirmation) {
      setSubmittedConfirmation(null);
    }
  }

  function validateDobOrAge(raw: string): string | null {
    const trimmed = raw.trim();
    if (!trimmed) {
      return 'Please enter the student’s age (5–65) or date of birth (YYYY-MM-DD).';
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const age = calculateAgeFromDob(trimmed);
      if (age === null || age < 5 || age > 65) {
        return 'Please enter a valid date of birth (age between 5 and 65).';
      }
      return null;
    }
    const numericAge = Number(trimmed);
    if (!Number.isInteger(numericAge) || numericAge < 5 || numericAge > 65) {
      return 'Enter a whole age between 5 and 65, or a date as YYYY-MM-DD.';
    }
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: TrialFormErrors = {};

    if (!form.studentName.trim() || form.studentName.trim().length < 2) {
      nextErrors.studentName = 'Please enter the student’s name.';
    }

    const dobAgeError = validateDobOrAge(form.dobOrAge);
    if (dobAgeError) {
      nextErrors.dobOrAge = dobAgeError;
    }

    if (!form.guardianName.trim()) {
      nextErrors.guardianName = 'Guardian or primary contact name is required.';
    }

    if (!form.contactPhone.trim()) {
      nextErrors.contactPhone = 'Contact phone or WhatsApp number is required.';
    } else if (!isValidPhoneNumber(form.contactPhone)) {
      nextErrors.contactPhone = 'Please enter a valid phone number (7–15 digits).';
    }

    if (form.contactEmail.trim() && !isValidEmailAddress(form.contactEmail)) {
      nextErrors.contactEmail = 'Please enter a valid email address.';
    }

    if (!form.preferredProgram) {
      nextErrors.preferredProgram = 'Please choose a preferred training program.';
    }

    if (!form.preferredDate) {
      nextErrors.preferredDate = 'Please select a preferred trial date.';
    } else if (!isFutureOrTodayDate(form.preferredDate)) {
      nextErrors.preferredDate = 'Preferred trial date cannot be in the past.';
    }

    if (!form.preferredTime) {
      nextErrors.preferredTime = 'Please select a preferred time window.';
    }

    if (!form.previousExperience) {
      nextErrors.previousExperience = 'Please select previous cricket experience.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmittedConfirmation(null);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const requestCode = `SK-TRL-${Math.floor(100000 + Math.random() * 900000)}`;
    const matchedProgram = TRAINING_PROGRAMS_DATA.find((p) => p.slug === form.preferredProgram);
    const studentName = form.studentName.trim();

    setTrials((prev) => [
      {
        id: `trl-${Date.now()}`,
        requestCode,
        playerName: studentName,
        ageGroup: form.dobOrAge.trim(),
        contactPlaceholder: form.contactPhone.trim(),
        requestedProgram: matchedProgram?.title ?? form.preferredProgram,
        preferredDate: form.preferredDate,
        preferredTimeSlot: form.preferredTime,
        status: 'Requested (Unconfirmed)',
        staffNote: form.additionalMessage.trim()
          ? `Guardian: ${form.guardianName.trim()} · ${form.additionalMessage.trim()}`
          : `Guardian: ${form.guardianName.trim()} · Level: ${form.previousExperience}`,
      },
      ...prev,
    ]);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedConfirmation({ studentName, requestCode });
      setForm(INITIAL_TRIAL_STATE);
    }, 250);
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      <PageHero
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Admissions', to: '/admissions' },
          { label: 'Book Free Trial' },
        ]}
        kicker="Trial Evaluation Request"
        title="Book a Free Trial Session"
        description="Request an initial batting, bowling, fielding, or keeping assessment with our coaching team in Sabzazar, Lahore."
      />

      {/* Confirmation Policy Notice */}
      <Card tone="navy" padding="md" className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#D9A52E]" aria-hidden="true" />
        <div className="space-y-1 text-sm">
          <p className="font-bold text-white">Trial Confirmation Policy</p>
          <p className="text-white/85">
            Your trial request will be reviewed by the academy team. Your session slot is confirmed only after staff follow-up.
          </p>
        </div>
      </Card>

      <Card padding="lg">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Student Name"
              placeholder="Enter student full name"
              value={form.studentName}
              onChange={(e) => updateField('studentName', e.target.value)}
              error={errors.studentName}
              required
            />

            <Input
              label="Date of Birth or Age"
              placeholder="e.g., 16 or 2010-05-14"
              helperText="Enter age in years (5–65) or date as YYYY-MM-DD."
              value={form.dobOrAge}
              onChange={(e) => updateField('dobOrAge', e.target.value)}
              error={errors.dobOrAge}
              required
            />

            <Input
              label="Guardian / Primary Contact Name"
              placeholder="Parent, guardian, or adult applicant name"
              value={form.guardianName}
              onChange={(e) => updateField('guardianName', e.target.value)}
              error={errors.guardianName}
              required
            />

            <Input
              label="Contact Phone / WhatsApp"
              type="tel"
              placeholder="03XX XXXXXXX"
              value={form.contactPhone}
              onChange={(e) => updateField('contactPhone', e.target.value)}
              error={errors.contactPhone}
              required
            />

            <Input
              label="Contact Email (Optional)"
              type="email"
              placeholder="contact@example.com"
              value={form.contactEmail}
              onChange={(e) => updateField('contactEmail', e.target.value)}
              error={errors.contactEmail}
            />

            <Select
              label="Preferred Training Program"
              options={PROGRAM_SELECT_OPTIONS}
              value={form.preferredProgram}
              onChange={(e) => updateField('preferredProgram', e.target.value)}
              error={errors.preferredProgram}
              required
            />

            <Input
              label="Preferred Date"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={form.preferredDate}
              onChange={(e) => updateField('preferredDate', e.target.value)}
              error={errors.preferredDate}
              required
            />

            <Select
              label="Preferred Time Window"
              options={PREFERRED_TRIAL_TIME_OPTIONS}
              value={form.preferredTime}
              onChange={(e) => updateField('preferredTime', e.target.value)}
              error={errors.preferredTime}
              required
            />

            <div className="sm:col-span-2">
              <Select
                label="Previous Cricket Experience"
                options={EXPERIENCE_OPTIONS}
                value={form.previousExperience}
                onChange={(e) => updateField('previousExperience', e.target.value)}
                error={errors.previousExperience}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Textarea
                label="Additional Message (Optional)"
                placeholder="Mention playing role (batsman, fast bowler, spinner, keeper) or specific questions..."
                value={form.additionalMessage}
                onChange={(e) => updateField('additionalMessage', e.target.value)}
              />
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-[10px] border border-[#C8202B]/30 bg-[#C8202B]/5 px-4 py-3 text-sm text-[#C8202B]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Please fix the highlighted validation errors before submitting.</span>
            </div>
          )}

          {submittedConfirmation && (
            <div
              role="status"
              className="rounded-[12px] border border-[#071A36]/20 bg-[#F5F7FA] p-5 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#071A36]">
                  <CheckCircle2 className="h-5 w-5 text-[#D9A52E]" aria-hidden="true" />
                  <span>Trial Request Logged</span>
                </div>
                <span className="rounded-[8px] border border-[#071A36]/15 bg-white px-3 py-1 font-mono text-xs font-bold text-[#071A36]">
                  {submittedConfirmation.requestCode}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#64748B]">
                Thank you. Trial request for{' '}
                <strong className="text-[#071A36]">{submittedConfirmation.studentName}</strong> has been received and marked as <strong className="text-[#071A36]">Requested (Unconfirmed)</strong>. Academy staff will review availability and follow up directly to confirm your ground slot.
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting Request...' : 'Request Free Trial'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setForm(INITIAL_TRIAL_STATE);
                setErrors({});
                setSubmittedConfirmation(null);
              }}
            >
              Reset Form
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
