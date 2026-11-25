import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
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
import { RevealSection } from '@/src/components/motion/MotionPrimitives';
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
        description={`Reach out regarding training tracks, coaching programs, league events, or admissions in ${siteSettings.locationText}.`}
      />

      <RevealSection>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left: Verified Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <Card padding="lg" className="space-y-5">
              <h2 className="text-xl font-bold text-[#07152C] dark:text-white">
                Academy Information
              </h2>

              <div className="space-y-4 border-t border-[#E2E8F0] pt-4 text-sm text-[#475569] dark:border-white/10 dark:text-[#B4C4DC]">
                <div className="flex items-start gap-3">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#C8202B] dark:text-[#D5A52B]"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-semibold text-[#07152C] dark:text-white">Operating Ground</p>
                    <p>{siteSettings.locationText}</p>
                  </div>
                </div>

                {siteSettings.phone.trim() && (
                  <div className="flex items-start gap-3">
                    <Phone
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#07152C] dark:text-[#D5A52B]"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-[#07152C] dark:text-white">Academy Phone</p>
                      <a
                        href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`}
                        className="hover:text-[#07152C] dark:hover:text-white underline-offset-2 hover:underline"
                      >
                        {siteSettings.phone}
                      </a>
                    </div>
                  </div>
                )}

                {siteSettings.email.trim() && (
                  <div className="flex items-start gap-3">
                    <Mail
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#07152C] dark:text-[#D5A52B]"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-semibold text-[#07152C] dark:text-white">Official Email</p>
                      <a
                        href={`mailto:${siteSettings.email}`}
                        className="hover:text-[#07152C] dark:hover:text-white underline-offset-2 hover:underline"
                      >
                        {siteSettings.email}
                      </a>
                    </div>
                  </div>
                )}

                {siteSettings.trainingHours.trim() && (
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A52B]" aria-hidden="true" />
                    <div>
                      <p className="font-semibold text-[#07152C] dark:text-white">
                        Ground &amp; Coaching Hours
                      </p>
                      <p>{siteSettings.trainingHours}</p>
                    </div>
                  </div>
                )}

                {!siteSettings.phone.trim() && !siteSettings.email.trim() && (
                  <p className="rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] px-3.5 py-3 text-xs leading-relaxed text-[#475569] dark:border-white/10 dark:bg-[#07152C] dark:text-[#B4C4DC]">
                    Online registration applications and direct enquiry messages are open daily. Official telephone and email channels appear here once published.
                  </p>
                )}
              </div>

              {whatsappHref && (
                <div className="border-t border-[#E2E8F0] pt-4 space-y-2.5 dark:border-white/10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#7F95B8]">
                    Direct Messaging
                  </p>
                  <WhatsAppCta variant="banner" />
                </div>
              )}

              {activeSocials.length > 0 && (
                <div className="border-t border-[#E2E8F0] pt-4 space-y-2.5 dark:border-white/10">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#7F95B8]">
                    Official Channels
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeSocials.map((social) => (
                      <a
                        key={social.id}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#E2E8F0] bg-[#F5F7FA] px-3 py-2 text-xs font-semibold text-[#07152C] hover:border-[#D5A52B] dark:border-white/10 dark:bg-[#07152C] dark:text-white"
                      >
                        <Share2
                          className="h-3.5 w-3.5 text-[#C8202B] dark:text-[#D5A52B]"
                          aria-hidden="true"
                        />
                        <span>{social.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <Card tone="navy" padding="lg" className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D5A52B]">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>Location &amp; Directions</span>
              </div>
              <p className="text-base font-bold text-white">{siteSettings.locationText}</p>
              <p className="text-xs leading-relaxed text-[#B4C4DC]">
                {siteSettings.launchedNote}. New players are encouraged to submit an online registration application ahead of visiting for structured ground onboarding.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2">
                {safeMapHref && (
                  <a
                    href={safeMapHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#D5A52B] px-4 py-2 text-xs font-semibold text-[#050D1B] hover:bg-[#E1B63E]"
                  >
                    <span>Open Ground Directions</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
                <Button to="/register" variant="outlineLight" size="sm">
                  Register Now
                </Button>
              </div>
            </Card>
          </div>

          {/* Right: Contact Enquiry Form */}
          <Card className="lg:col-span-7" padding="lg">
            <h2 className="text-xl font-bold text-[#07152C] dark:text-white">Send an Enquiry</h2>
            <p className="mt-1 text-sm text-[#475569] dark:text-[#B4C4DC]">
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
                  placeholder="e.g., Admissions or Batch Timing Enquiry"
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
                  className="flex items-start gap-2.5 rounded-[10px] border border-[#C8202B]/30 bg-[#C8202B]/10 px-4 py-3 text-sm text-[#C8202B] dark:text-[#FCA5A5]"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Please correct the highlighted fields above.</span>
                </div>
              )}

              {submittedName && (
                <div
                  role="status"
                  className="rounded-[12px] border border-[#07152C]/20 bg-[#F5F7FA] p-4 space-y-1.5 dark:border-white/15 dark:bg-[#07152C]"
                >
                  <div className="flex items-center gap-2 text-sm font-bold text-[#07152C] dark:text-white">
                    <CheckCircle2 className="h-4 w-4 text-[#D5A52B]" aria-hidden="true" />
                    <span>Enquiry Prepared</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#475569] dark:text-[#B4C4DC]">
                    Thank you, <strong className="text-[#07152C] dark:text-white">{submittedName}</strong>. For immediate admissions intake or program enrollment, you may also submit the{' '}
                    <Link
                      to="/register"
                      className="font-semibold text-[#07152C] underline dark:text-[#D5A52B]"
                    >
                      Register Now
                    </Link>{' '}
                    application form directly.
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
      </RevealSection>
    </div>
  );
}
