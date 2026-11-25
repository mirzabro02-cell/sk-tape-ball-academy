import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { isValidEmailAddress, sanitizeExternalUrl } from '@/src/utils/validation';
import { RevealSection } from '@/src/components/motion/MotionPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';
import { WhatsAppCta } from '@/src/components/ui/WhatsAppCta';

export function ContactPreviewSection() {
  const { state, getSafeWhatsAppHref } = useAcademyState();
  const { siteSettings } = state;
  const sectionMeta = state.websiteSections.find((s) => s.id === 'contact');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sentName, setSentName] = useState<string | null>(null);

  const whatsappHref = getSafeWhatsAppHref();
  const socials = [
    { id: 'Facebook', href: sanitizeExternalUrl(siteSettings.socials.facebook) },
    { id: 'Instagram', href: sanitizeExternalUrl(siteSettings.socials.instagram) },
    { id: 'YouTube', href: sanitizeExternalUrl(siteSettings.socials.youtube) },
    { id: 'TikTok', href: sanitizeExternalUrl(siteSettings.socials.tiktok) },
  ].filter((item): item is { id: string; href: string } => Boolean(item.href));

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSentName(null);

    if (fullName.trim().length < 2) {
      setError('Please enter your name.');
      return;
    }
    if (!isValidEmailAddress(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 8) {
      setError('Please enter a message of at least 8 characters.');
      return;
    }

    setSentName(fullName.trim());
    setFullName('');
    setEmail('');
    setMessage('');
  }

  return (
    <RevealSection>
      <section aria-labelledby="home-contact-heading">
        <div className="overflow-hidden rounded-[22px] border border-[#E2E8F0] bg-white shadow-[var(--shadow-card)] dark:border-white/12 dark:bg-[#0F213B]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Info Panel (Dark Navy Showcase Style) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#07152C] via-[#0E203E] to-[#050D1B] p-7 sm:p-10 text-white flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D5A52B]">
                  Get In Touch
                </p>
                <h2
                  id="home-contact-heading"
                  className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white"
                >
                  {sectionMeta?.headline || 'We Are Here To Help You'}
                </h2>
                <p className="text-sm leading-relaxed text-[#C2D0E3]">
                  Send an inquiry regarding training programs or admissions in{' '}
                  {siteSettings.locationText}.
                </p>
              </div>

              <div className="space-y-3.5 text-sm text-[#C2D0E3]">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A52B]" aria-hidden="true" />
                  <span>{siteSettings.locationText}</span>
                </div>

                {siteSettings.phone.trim() && (
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A52B]" aria-hidden="true" />
                    <a
                      href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`}
                      className="hover:text-white underline-offset-2 hover:underline"
                    >
                      {siteSettings.phone}
                    </a>
                  </div>
                )}

                {siteSettings.email.trim() && (
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A52B]" aria-hidden="true" />
                    <a
                      href={`mailto:${siteSettings.email}`}
                      className="hover:text-white underline-offset-2 hover:underline"
                    >
                      {siteSettings.email}
                    </a>
                  </div>
                )}

                {siteSettings.trainingHours.trim() && (
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A52B]" aria-hidden="true" />
                    <span>{siteSettings.trainingHours}</span>
                  </div>
                )}
              </div>

              {(whatsappHref || socials.length > 0) && (
                <div className="space-y-3 border-t border-white/10 pt-4">
                  {whatsappHref && <WhatsAppCta hideIfUnconfigured />}
                  {socials.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {socials.map((soc) => (
                        <a
                          key={soc.id}
                          href={soc.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-9 items-center rounded-[8px] border border-white/15 bg-white/5 px-3 text-xs font-semibold text-white/85 hover:border-[#D5A52B]/60 hover:text-[#D5A52B] transition-colors"
                        >
                          {soc.id}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Inquiry Form */}
            <div className="lg:col-span-7 p-7 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Your Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Player or parent name"
                    required
                  />
                  <Input
                    label="Your Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <Textarea
                  label="Your Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about training programs or admissions..."
                  required
                />

                {error && (
                  <p className="text-xs font-semibold text-[#C8202B] dark:text-[#FCA5A5]" role="alert">
                    {error}
                  </p>
                )}

                {sentName && (
                  <Card tone="muted" padding="sm" className="flex items-center gap-2.5 text-xs">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#D5A83C]" aria-hidden="true" />
                    <span className="text-[#07152C] dark:text-white">
                      Thank you, <strong>{sentName}</strong>. For full enrollment submissions, please use the{' '}
                      <Link to="/register" className="font-bold text-[#D5A83C] underline">
                        Admissions Registration Form
                      </Link>
                      .
                    </span>
                  </Card>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <Button to="/contact" variant="outline" size="sm" shape="pill">
                    Full Contact Page
                  </Button>
                  <Button type="submit" variant="primary" size="md" shape="pill">
                    <span>{sectionMeta?.ctaLabel || 'Send Message'}</span>
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </RevealSection>
  );
}
