import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { TRAINING_PROGRAMS_DATA } from '@/src/data/academyInfo';
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
  const navigate = useNavigate();
  const { setApplications } = useAcademyState();

  const [form, setForm] = useState<RegistrationFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      nextErrors.preferredBatch = 'Please choose a preferred training window.';
    }

    if (isMinor && !form.guardianConsent) {
      nextErrors.guardianConsent =
        'Guardian consent is mandatory for applicants under 18 years of age.';
    }

    if (!form.privacyConsent) {
      nextErrors.privacyConsent = 'You must agree to the Privacy and Admission policies to continue.';
    }

    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const refCode = `SK-APP-${Math.floor(100000 + Math.random() * 900000)}`;
    const matchedProgram = TRAINING_PROGRAMS_DATA.find((p) => p.slug === form.selectedProgram);
    const programLabel = matchedProgram?.title ?? form.selectedProgram;
    const studentName = form.studentName.trim();

    setApplications((prev) => [
      {
        id: `app-${Date.now()}`,
        referencePlaceholder: refCode,
        applicantName: studentName,
        age: calculatedAge ?? 0,
        isMinor,
        guardianName: form.guardianName.trim(),
        contactPlaceholder: form.whatsappNumber.trim() || form.guardianPhone.trim(),
        requestedProgram: programLabel,
        experienceLevel: form.previousExperience,
        submittedLabel: new Date().toLocaleDateString('en-PK', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        status: 'Pending',
        reviewerNotes: form.additionalMessage.trim()
          ? `Applicant note: ${form.additionalMessage.trim()} (Window: ${form.preferredBatch})`
          : `Preferred window: ${form.preferredBatch} · City/Area: ${form.cityArea.trim()}`,
        convertedToStudent: false,
      },
      ...prev,
    ]);

    window.setTimeout(() => {
      setIsSubmitting(false);
      navigate(
        `/registration-confirmation?ref=${encodeURIComponent(refCode)}&name=${encodeURIComponent(studentName)}`,
      );
    }, 250);
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      <PageHero
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Admissions', to: '/admissions' },
          { label: 'Student Registration' },
        ]}
        kicker="Academy Admissions"
        title="Student Registration Form"
        description="Complete student, guardian, and training preferences below to submit an admission application for SK Tape Ball Academy."
        actions={
          <Button to="/book-trial" variant="outlineLight" size="lg">
            Prefer a Free Trial First?
          </Button>
        }
      />

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
              placeholder="e.g., Sabzazar, Lahore"
              value={form.cityArea}
              onChange={(e) => updateField('cityArea', e.target.value)}
              error={errors.cityArea}
              required
            />

            <Input
              label="Student Contact Number (Optional)"
              type="tel"
              placeholder="03XX XXXXXXX"
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
              label="Guardian / Primary Contact Name"
              placeholder="Parent, guardian, or adult applicant name"
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
              label="Contact Phone Number"
              type="tel"
              placeholder="03XX XXXXXXX"
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
            <h2 className="mt-1 text-xl font-bold text-[#071A36]">Training Preferences</h2>
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
                label="Preferred Training Window"
                options={PREFERRED_BATCH_OPTIONS}
                value={form.preferredBatch}
                onChange={(e) => updateField('preferredBatch', e.target.value)}
                error={errors.preferredBatch}
                helperText="Exact batch lane and schedule timings are confirmed after assessment."
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
                    As parent or legal guardian of this minor applicant (age {calculatedAge}), I consent to their evaluation and participation under the{' '}
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
                  I have read and agree to the{' '}
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
                  <strong className="text-[#071A36]">Optional Photography Consent:</strong> I allow SK Tape Ball Academy to capture training photos/clips per the{' '}
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

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  setForm(INITIAL_STATE);
                  setErrors({});
                }}
              >
                Clear Form
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <Link
                to="/application-status"
                className="font-semibold text-[#071A36] underline-offset-4 hover:text-[#C8202B] hover:underline"
              >
                Track Application
              </Link>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}
