import { ArrowLeft, CalendarClock, Mail, MessageCircle, Phone, Wrench } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { HERO_STADIUM_VISUAL, OFFICIAL_LOGO_CONFIG } from '@/src/assets/branding';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { ADMIN_BASE_PATH } from '@/src/data/adminNav';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { useReducedMotion } from '@/src/hooks/useReducedMotion';
import { sanitizeExternalUrl } from '@/src/utils/validation';
import { MediaImage } from '@/src/components/ui/MediaImage';

export interface MaintenancePageProps {
  previewMode?: boolean;
}

function buildWhatsAppLink(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const url = sanitizeExternalUrl(trimmed);
  if (url) return url;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length >= 7) {
    return `https://wa.me/${digits}`;
  }
  return null;
}

export function MaintenancePage({ previewMode = false }: MaintenancePageProps) {
  useDocumentTitle('Scheduled Maintenance');
  const prefersReduced = useReducedMotion();
  const { state, getSafeWhatsAppHref } = useAcademyState();
  const { siteSettings } = state;
  const { maintenance } = siteSettings;

  const heading = maintenance.heading.trim() || "We're Under Maintenance";
  const message =
    maintenance.message.trim() ||
    'We are upgrading our academy website and training systems to deliver a better experience. We will be back soon.';
  const reopeningDateTime = maintenance.reopeningDateTime.trim();
  const phone = maintenance.contactPhone.trim() || siteSettings.phone.trim();
  const email = maintenance.contactEmail.trim() || siteSettings.email.trim();
  const whatsappHref =
    buildWhatsAppLink(maintenance.whatsapp) || getSafeWhatsAppHref();
  const bgSrc = maintenance.backgroundMedia?.src || HERO_STADIUM_VISUAL;
  const crestSrc = siteSettings.logo.src || OFFICIAL_LOGO_CONFIG.src;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050D1B] text-white px-4 py-10 sm:px-6">
      {/* Stadium Background Layer */}
      <div className="absolute inset-0">
        <MediaImage
          src={bgSrc}
          alt="SK Tape Ball Academy stadium background"
          transform={maintenance.backgroundMedia?.transform}
          fallbackLabel={siteSettings.academyName}
          priority
          className="h-full w-full"
          imgClassName="opacity-35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#050D1B]/85 via-[#07152C]/88 to-[#050D1B]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-[#D5A52B]/12 blur-3xl"
        />
      </div>

      {previewMode && (
        <div className="relative z-20 mb-6 flex flex-wrap items-center justify-center gap-3 rounded-full border border-[#D5A52B]/40 bg-[#0F213B]/90 px-4 py-2 text-xs text-white shadow-lg backdrop-blur-md">
          <span className="font-semibold text-[#D5A52B]">
            Maintenance Page Preview
          </span>
          <span className="text-white/70">
            Status: {maintenance.enabled ? 'Enabled on Public Site' : 'Currently Disabled'}
          </span>
          <Link
            to={`${ADMIN_BASE_PATH}/maintenance`}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#D5A52B] px-3 py-1 font-bold text-[#050D1B] hover:bg-[#E2B84A] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to Admin</span>
          </Link>
        </div>
      )}

      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl rounded-[22px] border border-white/15 bg-[#0F213B]/85 p-7 sm:p-11 text-center shadow-[0_28px_70px_-24px_rgba(5,13,27,0.9)] backdrop-blur-md"
      >
        <div className="mx-auto flex flex-col items-center space-y-5">
          <img
            src={crestSrc}
            alt={siteSettings.academyName}
            className="h-24 w-24 sm:h-28 sm:w-28 object-contain drop-shadow-[0_10px_24px_rgba(5,13,27,0.85)]"
          />

          <div className="inline-flex h-14 w-14 items-center justify-center rounded-[14px] border border-[#D5A52B]/40 bg-[#07152C] text-[#D5A52B] shadow-[0_10px_28px_-10px_rgba(213,165,43,0.55)]">
            <Wrench className="h-7 w-7" aria-hidden="true" />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D5A52B]">
              {siteSettings.academyName} · {siteSettings.locationText}
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white leading-[1.02]">
              {heading}
            </h1>
            <p className="mx-auto max-w-xl text-sm sm:text-base leading-relaxed text-[#C2D0E3]">
              {message}
            </p>
          </div>

          {reopeningDateTime && (
            <div className="inline-flex items-center gap-2.5 rounded-[12px] border border-[#D5A52B]/35 bg-[#07152C]/90 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white">
              <CalendarClock className="h-4 w-4 text-[#D5A52B] shrink-0" aria-hidden="true" />
              <span>Expected Reopening:</span>
              <span className="text-[#D5A52B]">{reopeningDateTime}</span>
            </div>
          )}

          {(phone || email || whatsappHref) && (
            <div className="w-full border-t border-white/10 pt-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7F95B8]">
                Direct Academy Contact
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-[#D5A52B] px-5 text-xs font-bold text-[#050D1B] shadow-[0_8px_22px_-6px_rgba(213,165,43,0.55)] hover:bg-[#E2B84A] transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    <span>WhatsApp Desk</span>
                  </a>
                )}
                {phone && (
                  <a
                    href={`tel:${phone.replace(/\s+/g, '')}`}
                    className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-white/20 bg-[#07152C]/80 px-4 text-xs font-semibold text-white hover:border-[#D5A52B]/60 transition-colors"
                  >
                    <Phone className="h-4 w-4 text-[#D5A52B]" aria-hidden="true" />
                    <span>{phone}</span>
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-white/20 bg-[#07152C]/80 px-4 text-xs font-semibold text-white hover:border-[#D5A52B]/60 transition-colors"
                  >
                    <Mail className="h-4 w-4 text-[#D5A52B]" aria-hidden="true" />
                    <span>{email}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          <p className="pt-2 text-[11px] text-[#7F95B8]">
            {siteSettings.tagline}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
