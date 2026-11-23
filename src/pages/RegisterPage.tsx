import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import {
  EXPERIENCE_OPTIONS,
  GENDER_OPTIONAL_OPTIONS,
  PREFERRED_BATCH_OPTIONS,
  PROGRAM_SELECT_OPTIONS,
  RELATIONSHIP_OPTIONS,
} from '@/src/data/admissionsContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import {
  calculateAgeFromDob,
  isValidEmailAddress,
  isValidPhoneNumber,
} from '@/src/utils/validation';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { PageHero } from '@/src/components/ui/PageHero';
import { Select } from '@/src/components/ui/Select';
import { Textarea } from '@/src/components/ui/Textarea';

interface RegistrationFormState {
  studentName: string;
  dateOfBirth: string;
  gender: string;
  studentPhone: string;
  studentEmail: string;
  cityArea: string;
  guardianName: string;
  relationship: string;
  guardianPhone: string;
  whatsappNumber: string;
  guardianEmail: string;
  selectedProgram: string;
  previousExperience: string;
  preferredBatch: string;
  additionalMessage: string;
  guardianConsent: boolean;
  privacyConsent: boolean;
  photographyConsent: boolean;
}

type FormErrors = Partial<Record<keyof RegistrationFormState, string>>;

const INITIAL_STATE: RegistrationFormState = {
  studentName: '',
  dateOfBirth: '',
  gender: '',
  studentPhone: '',
  studentEmail: '',
  cityArea: '',
  guardianName: '',
  relationship: '',
  guardianPhone: '',
  whatsappNumber: '',
  guardianEmail: '',
  selectedProgram: '',
  previousExperience: '',
  preferredBatch: '',
  additionalMessage: '',
  guardianConsent: false,
  privacyConsent: false,
  photographyConsent: false,
};

export function RegisterPage() {
  useDocumentTitle('Student Registration');

  const [form, setForm] = useState<RegistrationFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validatedSummary, setValidatedSummary] = useState<{
    studentName: string;
    calculatedAge: number;
    isMinor: boolean;
    photographyOptIn: boolean;
  } | null>(null);

  const calculatedAge = useMemo(
    () => calculateAgeFromDob(form.dateOfBirth),
    [form.dateOfBirth],
  );
  const isMinor = calculatedAge !== null && calculatedAge < 18;

  function updateField<K extends keyof RegistrationFormState>(
    field: K,
    value: RegistrationFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (validatedSummary) {
      setValidatedSummary(null);
    }
  }

  function validateForm(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!form.studentName.trim() || form.studentName.trim().length < 2) {
      nextErrors.studentName = 'Please enter the student’s full name.';
    }

    if (!form.dateOfBirth) {
      nextErrors.dateOfBirth = 'Date of birth is required.';
    } else if (calculatedAge === null) {
      nextErrors.dateOfBirth = 'Please enter a valid past date of birth.';
    } else if (calculatedAge < 5 || calculatedAge > 65) {
      nextErrors.dateOfBirth = 'Calculated age must be between 5 and 65 years.';
    }

    if (form.studentPhone.trim() && !isValidPhoneNumber(form.studentPhone)) {
      nextErrors.studentPhone = 'Please enter a valid contact phone number (7–15 digits).';
    }

    if (form.studentEmail.trim() && !isValidEmailAddress(form.studentEmail)) {
      nextErrors.studentEmail = 'Please enter a valid student email address.';
    }

    if (!form.cityArea.trim()) {
      nextErrors.cityArea = 'Please enter your city or neighborhood area.';
    }

    if (!form.guardianName.trim() || form.guardianName.trim().length < 2) {
      nextErrors.guardianName = 'Guardian / emergency contact full name is required.';
    }

    if (!form.relationship) {
      nextErrors.relationship = 'Please select the relationship with the student.';
    }

    if (!form.guardianPhone.trim()) {
      nextErrors.guardianPhone = 'Guardian contact number is required.';
    } else if (!isValidPhoneNumber(form.guardianPhone)) {
      nextErrors.guardianPhone = 'Enter a valid phone number (7–15 digits).';
    }

    if (!form.whatsappNumber.trim()) {
      nextErrors.whatsappNumber = 'WhatsApp number is required for schedule updates.';
    } else if (!isValidPhoneNumber(form.whatsappNumber)) {
      nextErrors.whatsappNumber = 'Enter a valid WhatsApp number (7–15 digits).';
    }

    if (form.guardianEmail.trim() && !isValidEmailAddress(form.guardianEmail)) {
      nextErrors.guardianEmail = 'Please enter a valid guardian email address.';
    }

    if (!form.selectedProgram) {
      nextErrors.selectedProgram = 'Please select a training program.';
    }

    if (!form.previousExperience) {
      nextErrors.previousExperience = 'Please select previous cricket experience.';
    }

    if (!form.preferredBatch) {
      nextErrors.preferredBatch = 'Please choose a preferred batch placeholder.';
    }

    if (isMinor && !form.guardianConsent) {
      nextErrors.guardianConsent =
        'Guardian consent is mandatory for applicants under 18 years of age.';
    }

    if (!form.privacyConsent) {
      nextErrors.privacyConsent = 'You must agree to the draft Privacy Policy to continue.';
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setValidatedSummary(null);
      return;
    }

    setErrors({});
    setIsValidating(true);

    window.setTimeout(() => {
      setIsValidating(false);
      setValidatedSummary({
        studentName: form.studentName.trim(),
        calculatedAge: calculatedAge ?? 0,
        isMinor,
        photographyOptIn: form.photographyConsent,
      });
    }, 350);
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      <PageHero
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Admissions', to: '/admissions' },
          { label: 'Student Registration' },
        ]}
        kicker="Admission Application (Frontend Preview)"
        title="Student Registration Form"
        description="Complete all student, guardian, and training details below. This Part 5 form runs client-side validation only and does not submit or store data on a backend server yet."
        actions={
          <Button to="/book-trial" variant="outlineLight" size="lg">
            Prefer a Free Trial First?
          </Button>
        }
      />

      <Card tone="muted" padding="md" className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#071A36]" aria-hidden="true" />
        <p className="text-sm text-[#64748B]">
          <strong className="text-[#071A36]">Frontend-Only Mode:</strong> All required fields, phone formats, date of birth age calculation, and minor guardian consent rules are actively validated in-browser. No personal data is transmitted or saved yet.
        </p>
      </Card>

      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {/* Section 1: Student Information */}
        <Card padding="lg" className="space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#C8202B]">
              Section 01
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#071A36]">Student Information</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Student Full Name"
              placeholder="Enter student full name"
              value={form.studentName}
              onChange={(e) => updateField('studentName', e.target.value)}
              error={errors.studentName}
              required
            />

            <div className="space-y-1.5">
              <Input
                label="Date of Birth"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={form.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
                error={errors.dateOfBirth}
                required
              />
              {calculatedAge !== null && (
                <p className="text-xs font-medium text-[#071A36]">
                  Calculated Age: <span className="font-bold tabular-nums">{calculatedAge}</span> years{' '}
                  <span className="text-[#64748B]">
                    ({isMinor ? 'Under 18 — Guardian consent required below' : 'Adult applicant (18+)'})
                  </span>
                </p>
              )}
            </div>

            <Select
              label="Gender (Optional)"
              options={GENDER_OPTIONAL_OPTIONS}
              value={form.gender}
              onChange={(e) => updateField('gender', e.target.value)}
            />

            <Input
              label="City / Area"
              placeholder="e.g., City / Neighborhood"
              value={form.cityArea}
              onChange={(e) => updateField('cityArea', e.target.value)}
              error={errors.cityArea}
              required
            />

            <Input
              label="Student Contact Number (Optional)"
              type="tel"
              placeholder="Optional mobile number"
              value={form.studentPhone}
              onChange={(e) => updateField('studentPhone', e.target.value)}
              error={errors.studentPhone}
            />

            <Input
              label="Student Email (Optional)"
              type="email"
              placeholder="student@example.com"
              value={form.studentEmail}
              onChange={(e) => updateField('studentEmail', e.target.value)}
              error={errors.studentEmail}
            />
          </div>
        </Card>

        {/* Section 2: Guardian Information */}
        <Card padding="lg" className="space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#C8202B]">
              Section 02
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#071A36]">
              Guardian / Primary Contact Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Guardian Full Name"
              placeholder="Parent or guardian full name"
              value={form.guardianName}
              onChange={(e) => updateField('guardianName', e.target.value)}
              error={errors.guardianName}
              required
            />

            <Select
              label="Relationship with Student"
              options={RELATIONSHIP_OPTIONS}
              value={form.relationship}
              onChange={(e) => updateField('relationship', e.target.value)}
              error={errors.relationship}
              required
            />

            <Input
              label="Guardian Contact Number"
              type="tel"
              placeholder="7–15 digit phone number"
              value={form.guardianPhone}
              onChange={(e) => updateField('guardianPhone', e.target.value)}
              error={errors.guardianPhone}
              required
            />

            <Input
              label="WhatsApp Number"
              type="tel"
              placeholder="WhatsApp contact number"
              value={form.whatsappNumber}
              onChange={(e) => updateField('whatsappNumber', e.target.value)}
              error={errors.whatsappNumber}
              required
            />

            <div className="sm:col-span-2">
              <Input
                label="Guardian Email (Optional)"
                type="email"
                placeholder="guardian@example.com"
                value={form.guardianEmail}
                onChange={(e) => updateField('guardianEmail', e.target.value)}
                error={errors.guardianEmail}
              />
            </div>
          </div>
        </Card>

        {/* Section 3: Training Information */}
        <Card padding="lg" className="space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#C8202B]">
              Section 03
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#071A36]">Training Information</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Select
              label="Selected Training Program"
              options={PROGRAM_SELECT_OPTIONS}
              value={form.selectedProgram}
              onChange={(e) => updateField('selectedProgram', e.target.value)}
              error={errors.selectedProgram}
              required
            />

            <Select
              label="Previous Cricket Experience"
              options={EXPERIENCE_OPTIONS}
              value={form.previousExperience}
              onChange={(e) => updateField('previousExperience', e.target.value)}
              error={errors.previousExperience}
              required
            />

            <div className="sm:col-span-2">
              <Select
                label="Preferred Batch (Placeholder Options)"
                options={PREFERRED_BATCH_OPTIONS}
                value={form.preferredBatch}
                onChange={(e) => updateField('preferredBatch', e.target.value)}
                error={errors.preferredBatch}
                helperText="Exact batch timings will be confirmed once academy schedules are finalized."
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Textarea
                label="Additional Message (Optional)"
                placeholder="Share preferred batting/bowling role, fitness goals, or schedule notes..."
                value={form.additionalMessage}
                onChange={(e) => updateField('additionalMessage', e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Section 4: Consent */}
        <Card padding="lg" className="space-y-5">
          <div className="border-b border-[#E2E8F0] pb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#C8202B]">
              Section 04
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#071A36]">Consent &amp; Policies</h2>
          </div>

          <div className="space-y-4">
            {isMinor && (
              <div className="rounded-[12px] border border-[#D9A52E] bg-[#D9A52E]/10 p-4 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.guardianConsent}
                    onChange={(e) => updateField('guardianConsent', e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-[#071A36] accent-[#071A36]"
                  />
                  <span className="text-sm text-[#071A36]">
                    <strong className="font-semibold">
                      Guardian Consent (Required for Under-18 Applicants):
                    </strong>{' '}
                    As parent or legal guardian of this minor applicant (age {calculatedAge}), I consent to their evaluation and participation under the draft{' '}
                    <Link to="/child-safety" className="underline font-semibold hover:text-[#C8202B]">
                      Child Safety Policy
                    </Link>
                    .
                  </span>
                </label>
                {errors.guardianConsent && (
                  <p className="text-xs font-semibold text-[#C8202B]">
                    {errors.guardianConsent}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.privacyConsent}
                  onChange={(e) => updateField('privacyConsent', e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#071A36] accent-[#071A36]"
                />
                <span className="text-sm text-[#071A36]">
                  I have read and agree to the draft{' '}
                  <Link to="/privacy-policy" className="underline font-semibold hover:text-[#C8202B]">
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link to="/admission-policy" className="underline font-semibold hover:text-[#C8202B]">
                    Admission Policy
                  </Link>
                  . <span className="text-[#C8202B]">*</span>
                </span>
              </label>
              {errors.privacyConsent && (
                <p className="text-xs font-semibold text-[#C8202B]">{errors.privacyConsent}</p>
              )}
            </div>

            <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.photographyConsent}
                  onChange={(e) => updateField('photographyConsent', e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#071A36] accent-[#071A36]"
                />
                <span className="text-sm text-[#64748B]">
                  <strong className="text-[#071A36]">Optional Photography Consent:</strong> I allow SK Tape Ball Academy to capture training photos/clips per the draft{' '}
                  <Link
                    to="/photography-consent"
                    className="underline font-semibold text-[#071A36] hover:text-[#C8202B]"
                  >
                    Photography Consent Policy
                  </Link>
                  . (Optional — declining does not affect admission.)
                </span>
              </label>
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-[10px] border border-[#C8202B]/30 bg-[#C8202B]/5 px-4 py-3 text-sm text-[#C8202B]"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Please review and resolve the highlighted validation errors above.</span>
            </div>
          )}

          {validatedSummary && (
            <div
              role="status"
              className="rounded-[12px] border border-[#071A36]/20 bg-[#F5F7FA] p-5 space-y-2"
            >
              <div className="flex items-center gap-2 text-sm font-bold text-[#071A36]">
                <CheckCircle2 className="h-5 w-5 text-[#D9A52E]" aria-hidden="true" />
                <span>Frontend Validation Complete — Demonstration Only (Not Submitted)</span>
              </div>
              <p className="text-sm leading-relaxed text-[#64748B]">
                All required inputs for <strong className="text-[#071A36]">{validatedSummary.studentName}</strong> (calculated age: <strong className="text-[#071A36]">{validatedSummary.calculatedAge}</strong>, {validatedSummary.isMinor ? 'minor guardian consent verified' : 'adult applicant'}, photography consent: {validatedSummary.photographyOptIn ? 'opted in' : 'not selected'}) passed validation. Because no backend or database is connected yet, this application has <strong>not</strong> been submitted or saved.
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button type="submit" variant="primary" size="lg" disabled={isValidating}>
              {isValidating ? 'Validating Registration Form...' : 'Validate Registration Form'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setForm(INITIAL_STATE);
                setErrors({});
                setValidatedSummary(null);
              }}
            >
              Clear Form
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
