import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  CalendarClock,
  Eye,
  Mail,
  MessageCircle,
  Phone,
  Power,
  Save,
  Wrench,
} from 'lucide-react';
import heroImg from '@/src/assets/images/hero_cricket_academy_1795439223672.jpg';
import lanesImg from '@/src/assets/images/academy_training_lanes_1795439225599.jpg';
import { HERO_STADIUM_VISUAL, OFFICIAL_LOGO_CONFIG } from '@/src/assets/branding';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { containsUnsafeHtml } from '@/src/utils/validation';
import { AdminPageHeader, AdminStatusBadge } from '@/src/components/admin/AdminPrimitives';
import { ImageManager } from '@/src/components/admin/ImageManager';
import { useAdminToast } from '@/src/components/admin/AdminToastContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { Textarea } from '@/src/components/ui/Textarea';

export function AdminMaintenancePage() {
  useDocumentTitle('Maintenance Mode');
  const { showToast } = useAdminToast();
  const { state, updateSiteSettings } = useAcademyState();
  const { siteSettings } = state;

  const [enabled, setEnabled] = useState(siteSettings.maintenance.enabled);
  const [heading, setHeading] = useState(siteSettings.maintenance.heading);
  const [message, setMessage] = useState(siteSettings.maintenance.message);
  const [reopeningDateTime, setReopeningDateTime] = useState(
    siteSettings.maintenance.reopeningDateTime,
  );
  const [contactPhone, setContactPhone] = useState(siteSettings.maintenance.contactPhone);
  const [contactEmail, setContactEmail] = useState(siteSettings.maintenance.contactEmail);
  const [whatsapp, setWhatsapp] = useState(siteSettings.maintenance.whatsapp);
  const [backgroundMedia, setBackgroundMedia] = useState(
    siteSettings.maintenance.backgroundMedia,
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const previewPhone = contactPhone.trim() || siteSettings.phone.trim();
  const previewEmail = contactEmail.trim() || siteSettings.email.trim();
  const previewWhatsapp = whatsapp.trim() || siteSettings.whatsappUrlOrNumber.trim();
  const crestSrc = siteSettings.logo.src || OFFICIAL_LOGO_CONFIG.src;

  function persistMaintenance(nextEnabled: boolean, triggerToast = true) {
    setValidationError(null);
    if (
      containsUnsafeHtml([
        heading,
        message,
        reopeningDateTime,
        contactPhone,
        contactEmail,
        whatsapp,
      ])
    ) {
      setValidationError(
        'HTML tags (< or >) are blocked for security. Enter plain text or valid URLs only.',
      );
      return;
    }

    updateSiteSettings((prev) => ({
      ...prev,
      maintenance: {
        enabled: nextEnabled,
        heading: heading.trim() || "We're Under Maintenance",
        message: message.trim() || prev.maintenance.message,
        reopeningDateTime: reopeningDateTime.trim(),
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim(),
        whatsapp: whatsapp.trim(),
        backgroundMedia,
      },
    }));

    if (triggerToast) {
      showToast(
        nextEnabled ? 'Maintenance Mode Enabled' : 'Maintenance Settings Saved',
        nextEnabled
          ? 'Public routes now display the maintenance notice. Admin portal access remains active.'
          : 'Public website remains live and accessible.',
      );
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    persistMaintenance(enabled, true);
  }

  function handleQuickToggle() {
    const next = !enabled;
    setEnabled(next);
    persistMaintenance(next, true);
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Maintenance Mode"
        description="Control public website availability during upgrades while keeping Admin Portal access fully active."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <AdminStatusBadge
              label={enabled ? 'Maintenance Active' : 'Website Live'}
              variant={enabled ? 'warning' : 'success'}
            />
            <Button to="/maintenance-preview" variant="outline" size="sm">
              <Eye className="h-4 w-4" aria-hidden="true" />
              <span>Preview Page</span>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left Form Controls */}
        <Card padding="lg" className="lg:col-span-7 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Enable / Disable Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 dark:border-white/10 dark:bg-[#07152C]">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#07152C] text-[#D5A52B] dark:bg-[#162B4D]">
                  <Power className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#07152C] dark:text-white">
                    Enable Maintenance Mode
                  </h2>
                  <p className="text-xs text-[#64748B] dark:text-[#A3B4CC]">
                    Redirects all public pages to the maintenance notice. <code className="font-mono">/sk-portal</code> stays open.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                onClick={handleQuickToggle}
                className={`relative inline-flex h-7 w-13 shrink-0 items-center rounded-full border transition-colors cursor-pointer ${
                  enabled
                    ? 'border-[#D5A52B] bg-[#D5A52B]'
                    : 'border-[#CBD5E1] bg-[#CBD5E1] dark:border-white/20 dark:bg-[#162B4D]'
                }`}
              >
                <span className="sr-only">Toggle maintenance mode</span>
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    enabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Message Heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="We're Under Maintenance"
                required
              />

              <Textarea
                label="Message Description"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain why the website is temporarily unavailable and when visitors should check back."
                required
              />

              <Input
                label="Expected Reopening Date & Time (Optional)"
                value={reopeningDateTime}
                onChange={(e) => setReopeningDateTime(e.target.value)}
                placeholder="e.g. 27 Nov 2026 · 10:00 AM PKT"
              />
            </div>

            <div className="border-t border-[#E2E8F0] pt-4 space-y-4 dark:border-white/10">
              <div>
                <h3 className="text-sm font-bold text-[#07152C] dark:text-white">
                  Contact &amp; WhatsApp Details (Optional Overrides)
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#A3B4CC]">
                  Leave blank to automatically inherit configured channels from Academy Settings.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input
                  label="Contact Phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder={siteSettings.phone || '+92 ...'}
                />
                <Input
                  label="Contact Email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder={siteSettings.email || 'info@...'}
                />
                <Input
                  label="WhatsApp Number / Link"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder={siteSettings.whatsappUrlOrNumber || '+92300...'}
                />
              </div>
            </div>

            <div className="border-t border-[#E2E8F0] pt-4 dark:border-white/10">
              <ImageManager
                label="Maintenance Background Visual"
                value={backgroundMedia}
                onChange={setBackgroundMedia}
                aspectRatio="16/9"
                presetAssets={[
                  { label: 'Stadium Tape Ball Action Hero', src: HERO_STADIUM_VISUAL },
                  { label: 'Floodlit Pitch Backdrop', src: heroImg },
                  { label: 'Practice Lanes', src: lanesImg },
                ]}
                storageFolder="maintenance"
              />
            </div>

            {validationError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-[10px] border border-[#C8202B]/30 bg-[#C8202B]/10 px-4 py-3 text-xs font-semibold text-[#C8202B] dark:border-[#F87171]/35 dark:text-[#FCA5A5]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4 dark:border-white/10">
              <Button to="/maintenance-preview" variant="outline" size="sm">
                <Eye className="h-4 w-4" aria-hidden="true" />
                <span>Preview Page</span>
              </Button>
              <Button type="submit" variant="primary" size="sm">
                <Save className="h-4 w-4" aria-hidden="true" />
                <span>Save Settings</span>
              </Button>
            </div>
          </form>
        </Card>

        {/* Sticky Live Dark Card Preview */}
        <div className="lg:col-span-5 lg:sticky lg:top-[84px] space-y-3">
          <div className="relative overflow-hidden rounded-[20px] border border-white/15 bg-[#050D1B] p-6 text-center text-white shadow-[0_24px_60px_-24px_rgba(5,13,27,0.85)]">
            <div className="absolute inset-0">
              <MediaImage
                src={backgroundMedia.src || HERO_STADIUM_VISUAL}
                alt="Maintenance background preview"
                transform={backgroundMedia.transform}
                fallbackLabel={siteSettings.academyName}
                className="h-full w-full"
                imgClassName="opacity-30"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-b from-[#050D1B]/80 via-[#07152C]/88 to-[#050D1B]"
              />
            </div>

            <div className="relative z-10 flex flex-col items-center space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D5A52B]">
                Live Maintenance Card Preview
              </p>

              <img
                src={crestSrc}
                alt={siteSettings.academyName}
                className="h-16 w-16 object-contain"
              />

              <div className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-[#D5A52B]/40 bg-[#0F213B] text-[#D5A52B]">
                <Wrench className="h-5 w-5" aria-hidden="true" />
              </div>

              <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white leading-tight">
                {heading.trim() || "We're Under Maintenance"}
              </h3>

              <p className="text-xs leading-relaxed text-[#C2D0E3]">
                {message.trim() || 'Maintenance message preview appears here.'}
              </p>

              {reopeningDateTime.trim() && (
                <div className="inline-flex items-center gap-2 rounded-[10px] border border-[#D5A52B]/35 bg-[#0F213B]/90 px-3 py-1.5 text-[11px] font-semibold text-white">
                  <CalendarClock className="h-3.5 w-3.5 text-[#D5A52B]" aria-hidden="true" />
                  <span>{reopeningDateTime.trim()}</span>
                </div>
              )}

              {(previewPhone || previewEmail || previewWhatsapp) && (
                <div className="w-full border-t border-white/10 pt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#B4C4DC]">
                  {previewWhatsapp && (
                    <span className="inline-flex items-center gap-1 text-[#D5A52B]">
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>WhatsApp</span>
                    </span>
                  )}
                  {previewPhone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-[#D5A52B]" aria-hidden="true" />
                      <span>{previewPhone}</span>
                    </span>
                  )}
                  {previewEmail && (
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-[#D5A52B]" aria-hidden="true" />
                      <span>{previewEmail}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
