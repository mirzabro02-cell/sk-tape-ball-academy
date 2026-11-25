import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { FOOTER_ADMISSIONS_LINKS, FOOTER_PRIMARY_LINKS } from '@/src/data/navigation';
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

  const founderLine = [siteSettings.founderName ? `Founded by ${siteSettings.founderName}` : '', siteSettings.launchedNote]
    .filter(Boolean)
    .join(' · ');

  return (
    <footer className="relative border-t border-white/10 bg-[#050D1B] text-white">
      <div
        className="h-[2px] w-full bg-gradient-to-r from-[#07152C] via-[#D5A52B] to-[#C8202B]"
        aria-hidden="true"
      />

      <PageContainer className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4 space-y-5">
            <OfficialLogo tone="dark" size="lg" />

            <div className="space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D5A52B]">
                {siteSettings.tagline}
              </p>
              <p className="max-w-md text-sm leading-relaxed text-[#B4C4DC]">
                {siteSettings.footerBio}
              </p>
              {founderLine && (
                <p className="text-xs font-medium text-[#7F95B8]">
                  {founderLine}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Button to="/register" variant="primary" size="sm">
                Register Now
              </Button>
              <Button to="/programs" variant="outlineLight" size="sm">
                Explore Programs
              </Button>
            </div>
          </div>

          <nav aria-label="Academy Links" className="lg:col-span-2 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#D5A52B]">
              Academy
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_PRIMARY_LINKS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="inline-flex items-center text-sm text-[#B4C4DC] transition-colors duration-150 hover:text-[#D5A52B]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Admissions Links" className="lg:col-span-3 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#D5A52B]">
              Admissions &amp; Explore
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_ADMISSIONS_LINKS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="inline-flex items-center text-sm text-[#B4C4DC] transition-colors duration-150 hover:text-[#D5A52B]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#D5A52B]">
              Contact &amp; Ground
            </h3>

            <ul className="space-y-3 text-sm text-[#B4C4DC]">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A52B]" aria-hidden="true" />
                <div className="space-y-0.5">
                  <p className="font-medium text-white">
                    {siteSettings.locationText || 'Sabzazar, Lahore, Pakistan'}
                  </p>
                  {safeMapUrl && (
                    <a
                      href={safeMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#D5A52B] hover:underline"
                    >
                      <span>View Ground Map</span>
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </li>

              {siteSettings.phone.trim() && (
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-[#D5A52B]" aria-hidden="true" />
                  <a
                    href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`}
                    className="hover:text-[#D5A52B] transition-colors"
                  >
                    {siteSettings.phone}
                  </a>
                </li>
              )}

              {siteSettings.email.trim() && (
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-[#D5A52B]" aria-hidden="true" />
                  <a
                    href={`mailto:${siteSettings.email.trim()}`}
                    className="hover:text-[#D5A52B] transition-colors break-all"
                  >
                    {siteSettings.email}
                  </a>
                </li>
              )}

              {siteSettings.trainingHours.trim() && (
                <li className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A52B]" aria-hidden="true" />
                  <span>{siteSettings.trainingHours}</span>
                </li>
              )}
            </ul>

            {waHref ? (
              <div className="pt-1">
                <WhatsAppCta variant="inline" />
              </div>
            ) : (
              <div className="rounded-[12px] border border-white/10 bg-[#0F213B]/80 px-3.5 py-2.5 text-xs leading-relaxed text-[#B4C4DC]">
                Direct inquiries:{' '}
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-0.5 font-semibold text-[#D5A52B] hover:underline"
                >
                  <span>Contact Page</span>
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            )}

            {socialChannels.length > 0 && (
              <div className="pt-2 border-t border-white/10 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7F95B8]">
                  Official Channels
                </p>
                <div className="flex flex-wrap gap-2">
                  {socialChannels.map((channel) => (
                    <a
                      key={channel.id}
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-[8px] border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/85 hover:border-[#D5A52B]/60 hover:text-[#D5A52B] transition-colors"
                    >
                      <span>{channel.label}</span>
                      <ExternalLink className="h-3 w-3 opacity-75" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-[#7F95B8] sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {currentYear} {siteSettings.academyName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link to="/admission-policy" className="hover:text-white transition-colors">
              Admission Policy
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
