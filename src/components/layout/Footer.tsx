import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
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

  const founderLine = [
    siteSettings.founderName ? `Founded by ${siteSettings.founderName}` : '',
    siteSettings.launchedNote,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#07152C] via-[#07152C] to-[#050D1B] text-white">
      <div
        className="h-[2.5px] w-full bg-gradient-to-r from-[#07152C] via-[#D5A83C] to-[#C8202B]"
        aria-hidden="true"
      />

      {/* Restrained stadium corner accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rotate-45 bg-gradient-to-tr from-[#D5A83C]/12 via-[#D5A83C]/4 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-10 h-64 w-64 -rotate-45 bg-gradient-to-bl from-[#D5A83C]/10 via-[#1E3F73]/18 to-transparent"
      />

      <PageContainer className="relative py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4 space-y-5">
            <OfficialLogo tone="dark" size="lg" layout="stacked" />

            <div className="space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D5A83C]">
                {siteSettings.tagline}
              </p>
              <p className="max-w-md text-sm leading-relaxed text-[#B8C7DF]">
                {siteSettings.footerBio}
              </p>
              {founderLine && (
                <p className="text-xs font-medium text-[#859BB9]">
                  {founderLine}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Button
                to="/register"
                variant="primary"
                size="sm"
                shape="pill"
                rightIcon={<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
              >
                Register Now
              </Button>
              <Button to="/programs" variant="outlineLight" size="sm" shape="pill">
                Explore Programs
              </Button>
            </div>
          </div>

          <nav aria-label="Quick Links" className="lg:col-span-2 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#D5A83C]">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_PRIMARY_LINKS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="group inline-flex items-center gap-1.5 rounded-[4px] text-sm text-[#B8C7DF] transition-colors duration-150 hover:text-[#D5A83C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]"
                  >
                    <ArrowRight
                      className="h-3 w-3 text-[#D5A83C]/75 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[#D5A83C] motion-reduce:group-hover:translate-x-0"
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Admissions and Explore" className="lg:col-span-3 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#D5A83C]">
              Admissions &amp; Explore
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_ADMISSIONS_LINKS.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="group inline-flex items-center gap-1.5 rounded-[4px] text-sm text-[#B8C7DF] transition-colors duration-150 hover:text-[#D5A83C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]"
                  >
                    <ArrowRight
                      className="h-3 w-3 text-[#D5A83C]/75 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[#D5A83C] motion-reduce:group-hover:translate-x-0"
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#D5A83C]">
              Academy Info
            </h3>

            <ul className="space-y-3 text-sm text-[#B8C7DF]">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A83C]" aria-hidden="true" />
                <div className="space-y-0.5">
                  <p className="font-medium text-white">
                    {siteSettings.locationText || 'Sabzazar, Lahore, Pakistan'}
                  </p>
                  {safeMapUrl && (
                    <a
                      href={safeMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-[4px] text-xs font-medium text-[#D5A83C] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]"
                    >
                      <span>View Ground Map</span>
                      <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </li>

              {siteSettings.phone.trim() && (
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-[#D5A83C]" aria-hidden="true" />
                  <a
                    href={`tel:${siteSettings.phone.replace(/\s+/g, '')}`}
                    className="rounded-[4px] hover:text-[#D5A83C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]"
                  >
                    {siteSettings.phone}
                  </a>
                </li>
              )}

              {siteSettings.email.trim() && (
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-[#D5A83C]" aria-hidden="true" />
                  <a
                    href={`mailto:${siteSettings.email.trim()}`}
                    className="rounded-[4px] hover:text-[#D5A83C] transition-colors break-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]"
                  >
                    {siteSettings.email}
                  </a>
                </li>
              )}

              {siteSettings.trainingHours.trim() && (
                <li className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A83C]" aria-hidden="true" />
                  <span>{siteSettings.trainingHours}</span>
                </li>
              )}
            </ul>

            {waHref ? (
              <div className="pt-1">
                <WhatsAppCta variant="inline" />
              </div>
            ) : (
              <div className="rounded-[12px] border border-white/12 bg-[#0F213B]/85 px-3.5 py-2.5 text-xs leading-relaxed text-[#B8C7DF]">
                Direct inquiries:{' '}
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-0.5 rounded-[4px] font-semibold text-[#D5A83C] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]"
                >
                  <span>Contact Page</span>
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </div>
            )}

            {socialChannels.length > 0 && (
              <div className="pt-2 border-t border-white/10 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#859BB9]">
                  Follow Us
                </p>
                <div className="flex flex-wrap gap-2">
                  {socialChannels.map((channel) => (
                    <a
                      key={channel.id}
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-[8px] border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/90 hover:border-[#D5A83C]/65 hover:text-[#D5A83C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]"
                    >
                      <span>{channel.label}</span>
                      <ExternalLink className="h-3 w-3 opacity-75" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-start gap-2.5 rounded-[12px] border border-[#D5A83C]/28 bg-[#0F213B]/65 px-3.5 py-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#D5A83C]" aria-hidden="true" />
              <div className="text-xs leading-snug">
                <p className="font-bold text-white">Structured Coaching</p>
                <p className="text-[#859BB9]">Discipline, fitness &amp; match preparation</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-[#859BB9] sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {currentYear} {siteSettings.academyName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              to="/privacy-policy"
              className="rounded-[4px] hover:text-[#D5A83C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="rounded-[4px] hover:text-[#D5A83C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              to="/admission-policy"
              className="rounded-[4px] hover:text-[#D5A83C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]"
            >
              Admission Policy
            </Link>
            <Link
              to="/child-safety"
              className="rounded-[4px] hover:text-[#D5A83C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A83C]"
            >
              Child Safety Policy
            </Link>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
