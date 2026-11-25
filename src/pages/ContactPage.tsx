import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Share2,
} from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { isValidEmailAddress, isValidPhoneNumber, sanitizeExternalUrl } from '@/src/utils/validation';
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

export function ContactPage() {
  useDocumentTitle('Contact');
  const { state, getSafeWhatsAppHref } = useAcademyState();
  const { siteSettings } = state;

  const [form, setForm] = useState<ContactFormState>(INITIAL_CONTACT);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const whatsappHref = getSafeWhatsAppHref();
  const safeMapHref = sanitizeExternalUrl(siteSettings.mapUrl);

  const activeSocials = [
    { id: 'facebook', label: 'Facebook', href: sanitizeExternalUrl(siteSettings.socials.facebook) },
    { id: 'instagram', label: 'Instagram', href: sanitizeExternalUrl(siteSettings.socials.instagram) },
    { id: 'youtube', label: 'YouTube', href: sanitizeExternalUrl(siteSettings.socials.youtube) },
    { id: 'tiktok', label: 'TikTok', href: sanitizeExternalUrl(siteSettings.socials.tiktok) },
  ].filter((item): item is { id: string; label: string; href: string } => Boolean(item.href));

  function updateField<K extends keyof ContactFormState>(field: K, value: ContactFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (submittedName) {
      setSubmittedName(null);
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
      setSubmittedName(null);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedName(form.fullName.trim());
      setForm(INITIAL_CONTACT);
    }, 300);
  }

  return (
    <div className="space-y-14 sm:space-y-16">
      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        kicker="Academy Desk"
        title="Contact SK Tape Ball Academy"
        description={`Reach out regarding training tracks, trial assessments, or admissions in ${siteSettings.locationText}.`}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left: Verified Contact Details */}
        <div className="lg:col-span-5 space-y-6">
          <Card padding="lg" className="space-y-5">
            <h2 className="text-xl font-bold text-[#071A36]">Academy Information</h2>

            <div className="space-y-4 border-t border-[#E2E8F0] pt-4 text-sm text-[#64748B]">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C8202B]" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-[#071A36]">Operating Ground</p>
                  <p>{siteSettings.locationText}</p>
                </div>
              </div>

              {siteSettings.phone.trim() && (
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#071A36]" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[#071A36]">Academy Phone</p>
                    <a
                      href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`}
                      className="hover:text-[#071A36] underline-offset-2 hover:underline"
                    >
                      {siteSettings.phone}
                    </a>
                  </div>
                </div>
              )}

              {siteSettings.email.trim() && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#071A36]" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[#071A36]">Official Email</p>
                    <a
                      href={`mailto:${siteSettings.email}`}
                      className="hover:text-[#071A36] underline-offset-2 hover:underline"
                    >
                      {siteSettings.email}
                    </a>
                  </div>
                </div>
              )}

              {siteSettings.trainingHours.trim() && (
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[#071A36]">Ground &amp; Coaching Hours</p>
                    <p>{siteSettings.trainingHours}</p>
                  </div>
                </div>
              )}

              {!siteSettings.phone.trim() && !siteSettings.email.trim() && (
                <p className="rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] px-3.5 py-3 text-xs leading-relaxed text-[#64748B]">
                  Online trial requests, registration applications, and direct enquiry messages are open daily. Official telephone and email channels appear here once published.
                </p>
              )}
            </div>

            {whatsappHref && (
              <div className="border-t border-[#E2E8F0] pt-4 space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Direct Messaging
                </p>
                <WhatsAppCta variant="banner" />
              </div>
            )}

            {activeSocials.length > 0 && (
              <div className="border-t border-[#E2E8F0] pt-4 space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Official Channels
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeSocials.map((social) => (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#E2E8F0] bg-[#F5F7FA] px-3 py-2 text-xs font-semibold text-[#071A36] hover:border-[#D9A52E]"
                    >
                      <Share2 className="h-3.5 w-3.5 text-[#C8202B]" aria-hidden="true" />
                      <span>{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card tone="navy" padding="lg" className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D9A52E]">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>Location &amp; Directions</span>
            </div>
            <p className="text-base font-bold text-white">{siteSettings.locationText}</p>
            <p className="text-xs leading-relaxed text-white/75">
              {siteSettings.launchedNote}. New players are encouraged to book a free trial assessment ahead of visiting for structured ground onboarding.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {safeMapHref && (
                <a
                  href={safeMapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#D9A52E] px-4 py-2 text-xs font-semibold text-[#050D1B] hover:bg-[#e5b544]"
                >
                  <span>Open Ground Directions</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
              <Button to="/book-trial" variant="outlineLight" size="sm">
                Book Free Trial
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: Contact Enquiry Form */}
        <Card className="lg:col-span-7" padding="lg">
          <h2 className="text-xl font-bold text-[#071A36]">Send an Enquiry</h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Questions about training tracks, 1-on-1 coaching, leagues, or admissions? Send your message below.
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
                placeholder="03XX XXXXXXX"
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

            {submittedName && (
              <div
                role="status"
                className="rounded-[12px] border border-[#071A36]/20 bg-[#F5F7FA] p-4 space-y-1.5"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-[#071A36]">
                  <CheckCircle2 className="h-4 w-4 text-[#D9A52E]" aria-hidden="true" />
                  <span>Enquiry Prepared</span>
                </div>
                <p className="text-xs leading-relaxed text-[#64748B]">
                  Thank you, <strong className="text-[#071A36]">{submittedName}</strong>. For immediate trial scheduling or admissions registration, you may also submit the dedicated{' '}
                  <a href="/book-trial" className="font-semibold text-[#071A36] underline">
                    Book Free Trial
                  </a>{' '}
                  or{' '}
                  <a href="/register" className="font-semibold text-[#071A36] underline">
                    Register Now
                  </a>{' '}
                  forms directly.
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Send Enquiry'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  setForm(INITIAL_CONTACT);
                  setErrors({});
                  setSubmittedName(null);
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
