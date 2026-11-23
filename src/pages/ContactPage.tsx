import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Share2,
} from 'lucide-react';
import { ACADEMY_BRAND } from '@/src/data/brand';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { isValidEmailAddress, isValidPhoneNumber } from '@/src/utils/validation';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { PageHero } from '@/src/components/ui/PageHero';
import { Textarea } from '@/src/components/ui/Textarea';
import { WhatsAppCta } from '@/src/components/ui/WhatsAppCta';

interface ContactFormState {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type ContactErrors = Partial<Record<keyof ContactFormState, string>>;

const INITIAL_CONTACT: ContactFormState = {
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const SOCIAL_CHANNEL_PLACEHOLDERS = [
  { id: 'instagram', label: 'Instagram (Placeholder)' },
  { id: 'facebook', label: 'Facebook (Placeholder)' },
  { id: 'youtube', label: 'YouTube (Placeholder)' },
] as const;

export function ContactPage() {
  useDocumentTitle('Contact');

  const [form, setForm] = useState<ContactFormState>(INITIAL_CONTACT);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validatedName, setValidatedName] = useState<string | null>(null);
  const [socialNotice, setSocialNotice] = useState<string | null>(null);

  function updateField<K extends keyof ContactFormState>(field: K, value: ContactFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (validatedName) {
      setValidatedName(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: ContactErrors = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email address is required.';
    } else if (!isValidEmailAddress(form.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (form.phone.trim() && !isValidPhoneNumber(form.phone)) {
      nextErrors.phone = 'Please enter a valid phone number (7–15 digits).';
    }

    if (!form.subject.trim()) {
      nextErrors.subject = 'Please enter an enquiry subject.';
    }

    if (!form.message.trim() || form.message.trim().length < 10) {
      nextErrors.message = 'Please enter a message of at least 10 characters.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setValidatedName(null);
      return;
    }

    setErrors({});
    setIsValidating(true);

    window.setTimeout(() => {
      setIsValidating(false);
      setValidatedName(form.fullName.trim());
    }, 350);
  }

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        kicker="Academy Desk"
        title="Contact SK Tape Ball Academy"
        description="Reach out with questions about training programs, trials, or admissions. All phone numbers, WhatsApp links, social handles, and ground locations remain clearly labelled placeholders until confirmed."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left: Contact Info, Office Hours, WhatsApp & Social Placeholders */}
        <div className="lg:col-span-5 space-y-6">
          <Card padding="lg" className="space-y-5">
            <h2 className="text-xl font-bold text-[#071A36]">
              Contact Information (Placeholders)
            </h2>

            <div className="space-y-4 border-t border-[#E2E8F0] pt-4 text-sm text-[#64748B]">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C8202B]" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-[#071A36]">Ground Location</p>
                  <p>{ACADEMY_BRAND.contactPlaceholders.addressPlaceholder}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#071A36]" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-[#071A36]">Academy Phone</p>
                  <p>{ACADEMY_BRAND.contactPlaceholders.phonePlaceholder}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#071A36]" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-[#071A36]">Official Email</p>
                  <p>{ACADEMY_BRAND.contactPlaceholders.emailPlaceholder}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-[#071A36]">Office &amp; Ground Hours</p>
                  <p>{ACADEMY_BRAND.contactPlaceholders.hoursPlaceholder}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Direct Messaging Placeholder
              </p>
              <WhatsAppCta variant="banner" />
            </div>

            <div className="border-t border-[#E2E8F0] pt-4 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Social Media Placeholders
              </p>
              <div className="flex flex-wrap gap-2">
                {SOCIAL_CHANNEL_PLACEHOLDERS.map((social) => (
                  <button
                    key={social.id}
                    type="button"
                    onClick={() =>
                      setSocialNotice(
                        `${social.label}: Official social profile link will be connected once verified.`,
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#E2E8F0] bg-[#F5F7FA] px-3 py-2 text-xs font-semibold text-[#071A36] hover:border-[#D9A52E] cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5 text-[#C8202B]" aria-hidden="true" />
                    <span>{social.label}</span>
                  </button>
                ))}
              </div>
              {socialNotice && (
                <p className="text-xs font-medium text-[#071A36]">{socialNotice}</p>
              )}
            </div>
          </Card>

          {/* Map / Location Placeholder */}
          <Card tone="navy" padding="lg" className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D9A52E]">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>Map &amp; Directions Placeholder</span>
            </div>
            <div className="aspect-[16/9] w-full rounded-[12px] border border-white/15 bg-[#050D1B] flex flex-col items-center justify-center p-5 text-center space-y-2">
              <MapPin className="h-7 w-7 text-[#D9A52E]" aria-hidden="true" />
              <p className="text-sm font-semibold text-white">
                Academy Ground Map Slot
              </p>
              <p className="text-xs text-white/70 max-w-xs">
                Verified map coordinates and ground directions will be embedded here once the official academy address is confirmed.
              </p>
            </div>
          </Card>
        </div>

        {/* Right: Contact Enquiry Form */}
        <Card className="lg:col-span-7" padding="lg">
          <h2 className="text-xl font-bold text-[#071A36]">Send an Enquiry (Frontend Preview)</h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Validates fields locally without transmitting data until backend messaging is connected.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                error={errors.fullName}
                required
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                error={errors.email}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="Phone Number (Optional)"
                type="tel"
                placeholder="7–15 digit phone number"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                error={errors.phone}
              />
              <Input
                label="Subject"
                placeholder="e.g., Admissions or Trial Timing Enquiry"
                value={form.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                error={errors.subject}
                required
              />
            </div>

            <Textarea
              label="Message"
              placeholder="Write your question or enquiry..."
              value={form.message}
              onChange={(e) => updateField('message', e.target.value)}
              error={errors.message}
              required
            />

            {Object.keys(errors).length > 0 && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-[10px] border border-[#C8202B]/30 bg-[#C8202B]/5 px-4 py-3 text-sm text-[#C8202B]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Please correct the highlighted fields above.</span>
              </div>
            )}

            {validatedName && (
              <div
                role="status"
                className="rounded-[12px] border border-[#071A36]/20 bg-[#F5F7FA] p-4 space-y-1.5"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-[#071A36]">
                  <CheckCircle2 className="h-4 w-4 text-[#D9A52E]" aria-hidden="true" />
                  <span>Enquiry Validated (Demonstration Only — Not Sent)</span>
                </div>
                <p className="text-xs leading-relaxed text-[#64748B]">
                  Thank you, <strong className="text-[#071A36]">{validatedName}</strong>. Your enquiry fields passed validation. Live email/backend delivery will be enabled once official academy contact endpoints are connected.
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" variant="primary" size="lg" disabled={isValidating}>
                {isValidating ? 'Validating Enquiry...' : 'Validate & Preview Enquiry'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  setForm(INITIAL_CONTACT);
                  setErrors({});
                  setValidatedName(null);
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
