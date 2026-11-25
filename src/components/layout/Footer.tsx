import { Link } from 'react-router-dom';
import { Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { FOOTER_PRIMARY_LINKS } from '@/src/data/navigation';
import { sanitizeExternalUrl } from '@/src/utils/validation';
import { Button } from '@/src/components/ui/Button';
import { OfficialLogo } from '@/src/components/ui/OfficialLogo';
import { WhatsAppCta } from '@/src/components/ui/WhatsAppCta';
import { PageContainer } from './PageContainer';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { state, getSafeWhatsAppHref } = useAcademyState();
  const { siteSettings } = state;

  const waHref = getSafeWhatsAppHref();
  const safeMapUrl = sanitizeExternalUrl(siteSettings.mapUrl);

  const socialChannels = [
    { id: 'facebook', label: 'Facebook', url: sanitizeExternalUrl(siteSettings.socials.facebook) },
    { id: 'instagram', label: 'Instagram', url: sanitizeExternalUrl(siteSettings.socials.instagram) },
    { id: 'youtube', label: 'YouTube', url: sanitizeExternalUrl(siteSettings.socials.youtube) },
    { id: 'tiktok', label: 'TikTok', url: sanitizeExternalUrl(siteSettings.socials.tiktok) },
  ].filter((item): item is { id: string; label: string; url: string } => Boolean(item.url));

  const hasSocialColumn = socialChannels.length > 0;

  return (
    <footer className="border-t border-[#071A36] bg-[#050D1B] text-white">
      <PageContainer className="py-12 sm:py-14">
        <div
          className={`grid grid-cols-1 gap-10 md:grid-cols-2 ${
            hasSocialColumn ? 'lg:grid-cols-12' : 'lg:grid-cols-12'
          }`}
        >
          {/* Column 1: Academy Identity */}
          <div className={`${hasSocialColumn ? 'lg:col-span-4' : 'lg:col-span-5'} space-y-4`}>
            <OfficialLogo tone="dark" size="lg" />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D9A52E]">
              {siteSettings.tagline}
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-white/75">
              {siteSettings.footerBio}
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Button to="/book-trial" variant="primary" size="sm">
                Book Free Trial
              </Button>
              <Button to="/register" variant="outlineLight" size="sm">
                Register Now
              </Button>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className={`${hasSocialColumn ? 'lg:col-span-3' : 'lg:col-span-3'} space-y-4`}>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#D9A52E]">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_PRIMARY_LINKS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-white/75 transition-colors duration-150 hover:text-[#D9A52E]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className={`${hasSocialColumn ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-4`}>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#D9A52E]">
              Contact
            </h3>

            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
                <div>
                  <p className="font-medium text-white">
                    {siteSettings.locationText || 'Sabzazar, Lahore, Pakistan'}
                  </p>
                  {safeMapUrl && (
                    <a
                      href={safeMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-[#D9A52E] hover:underline"
                    >
                      <span>View Ground Map</span>
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </li>

              {siteSettings.phone.trim() && (
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
                  <a
                    href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`}
                    className="hover:text-[#D9A52E] transition-colors"
                  >
                    {siteSettings.phone}
                  </a>
                </li>
              )}

              {siteSettings.email.trim() && (
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
                  <a
                    href={`mailto:${siteSettings.email.trim()}`}
                    className="hover:text-[#D9A52E] transition-colors break-all"
                  >
                    {siteSettings.email}
                  </a>
                </li>
              )}

              {siteSettings.trainingHours.trim() && (
                <li className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
                  <span className="text-white/75">{siteSettings.trainingHours}</span>
                </li>
              )}
            </ul>

            {waHref ? (
              <div className="pt-1">
                <WhatsAppCta variant="inline" />
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-white/60">
                Use our{' '}
                <Link to="/contact" className="text-[#D9A52E] hover:underline font-medium">
                  contact page
                </Link>{' '}
                or{' '}
                <Link to="/book-trial" className="text-[#D9A52E] hover:underline font-medium">
                  trial booking form
                </Link>{' '}
                for direct academy inquiries.
              </p>
            )}
          </div>

          {/* Column 4: Social Media (Rendered only when valid official links exist) */}
          {hasSocialColumn && (
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#D9A52E]">
                Follow Academy
              </h3>
              <ul className="space-y-2.5">
                {socialChannels.map((channel) => (
                  <li key={channel.id}>
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-white/75 hover:text-[#D9A52E] transition-colors"
                    >
                      <span>{channel.label}</span>
                      <ExternalLink className="h-3 w-3 opacity-75" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {currentYear} {siteSettings.academyName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/child-safety" className="hover:text-white transition-colors">
              Child Safety Policy
            </Link>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
