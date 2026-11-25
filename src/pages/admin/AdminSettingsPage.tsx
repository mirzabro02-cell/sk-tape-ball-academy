import { useState, type FormEvent } from 'react';
import { AlertCircle, Save, ShieldCheck } from 'lucide-react';
import heroImg from '@/src/assets/images/hero_cricket_academy_1795439223672.jpg';
import lanesImg from '@/src/assets/images/academy_training_lanes_1795439225599.jpg';
import battingImg from '@/src/assets/images/drill_power_batting_1795439224792.jpg';
import { OFFICIAL_LOGO_CONFIG } from '@/src/assets/branding';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useAdminAuth } from '@/src/context/AdminAuthContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { containsUnsafeHtml, sanitizeExternalUrl } from '@/src/utils/validation';
import { AdminPageHeader } from '@/src/components/admin/AdminPrimitives';
import { ImageManager } from '@/src/components/admin/ImageManager';
import { useAdminToast } from '@/src/components/admin/AdminToastContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';

type SettingsTab =
  | 'academy'
  | 'logo'
  | 'contact'
  | 'social'
  | 'seo'
  | 'notifications'
  | 'profile'
  | 'security';

const SETTINGS_TABS: { id: SettingsTab; label: string }[] = [
  { id: 'academy', label: 'Academy Info' },
  { id: 'logo', label: 'Logo & Visuals' },
  { id: 'contact', label: 'Contact & Location' },
  { id: 'social', label: 'Social Media Links' },
  { id: 'seo', label: 'Website SEO' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'profile', label: 'Admin Profile' },
  { id: 'security', label: 'Security' },
];

export function AdminSettingsPage() {
  useDocumentTitle('System Settings');
  const { showToast } = useAdminToast();
  const { state, updateSiteSettings } = useAcademyState();
  const { isSupabaseMode, user } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<SettingsTab>('academy');
  const [validationError, setValidationError] = useState<string | null>(null);

  const [academyName, setAcademyName] = useState(state.siteSettings.academyName);
  const [tagline, setTagline] = useState(state.siteSettings.tagline);
  const [footerBio, setFooterBio] = useState(state.siteSettings.footerBio);
  const [founderName, setFounderName] = useState(state.siteSettings.founderName);
  const [launchedNote, setLaunchedNote] = useState(state.siteSettings.launchedNote);
  const [showPublicFees, setShowPublicFees] = useState(state.siteSettings.showPublicFees);

  const [logo, setLogo] = useState(state.siteSettings.logo);
  const [heroMedia, setHeroMedia] = useState(state.siteSettings.heroMedia);
  const [aboutMedia, setAboutMedia] = useState(state.siteSettings.aboutMedia);

  const [phone, setPhone] = useState(state.siteSettings.phone);
  const [whatsappUrlOrNumber, setWhatsappUrlOrNumber] = useState(
    state.siteSettings.whatsappUrlOrNumber,
  );
  const [email, setEmail] = useState(state.siteSettings.email);
  const [locationText, setLocationText] = useState(state.siteSettings.locationText);
  const [mapUrl, setMapUrl] = useState(state.siteSettings.mapUrl);
  const [trainingHours, setTrainingHours] = useState(state.siteSettings.trainingHours);

  const [facebookUrl, setFacebookUrl] = useState(state.siteSettings.socials.facebook);
  const [instagramUrl, setInstagramUrl] = useState(state.siteSettings.socials.instagram);
  const [youtubeUrl, setYoutubeUrl] = useState(state.siteSettings.socials.youtube);
  const [tiktokUrl, setTiktokUrl] = useState(state.siteSettings.socials.tiktok);

  const [seoTitle, setSeoTitle] = useState(state.siteSettings.seoTitle);
  const [seoDescription, setSeoDescription] = useState(state.siteSettings.seoDescription);

  const [notifyApplications, setNotifyApplications] = useState(
    state.siteSettings.notifyApplications,
  );
  const [notifyTrials, setNotifyTrials] = useState(state.siteSettings.notifyTrials);
  const [notifyFees, setNotifyFees] = useState(state.siteSettings.notifyFees);

  const [adminDisplayName, setAdminDisplayName] = useState(
    state.siteSettings.adminDisplayName,
  );
  const [adminEmail, setAdminEmail] = useState(
    state.siteSettings.adminEmail || user?.email || '',
  );

  function handleSaveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);

    const textValues = [
      academyName,
      tagline,
      footerBio,
      founderName,
      launchedNote,
      phone,
      whatsappUrlOrNumber,
      email,
      locationText,
      mapUrl,
      trainingHours,
      facebookUrl,
      instagramUrl,
      youtubeUrl,
      tiktokUrl,
      seoTitle,
      seoDescription,
      adminDisplayName,
      adminEmail,
    ];

    if (containsUnsafeHtml(textValues)) {
      setValidationError(
        'HTML tags (< or >) are blocked for security. Enter plain text or valid URLs only.',
      );
      return;
    }

    const urlFields = [
      { label: 'Google Maps URL', val: mapUrl },
      { label: 'Facebook URL', val: facebookUrl },
      { label: 'Instagram URL', val: instagramUrl },
      { label: 'YouTube URL', val: youtubeUrl },
      { label: 'TikTok URL', val: tiktokUrl },
    ];

    for (const item of urlFields) {
      if (item.val.trim() && !sanitizeExternalUrl(item.val)) {
        setValidationError(`${item.label} must start with https:// or http://.`);
        return;
      }
    }

    updateSiteSettings((prev) => ({
      ...prev,
      academyName: academyName.trim() || prev.academyName,
      tagline: tagline.trim() || prev.tagline,
      footerBio: footerBio.trim(),
      founderName: founderName.trim(),
      launchedNote: launchedNote.trim(),
      showPublicFees,
      logo,
      heroMedia,
      aboutMedia,
      phone: phone.trim(),
      whatsappUrlOrNumber: whatsappUrlOrNumber.trim(),
      email: email.trim(),
      locationText: locationText.trim() || 'Sabzazar, Lahore, Pakistan',
      mapUrl: mapUrl.trim(),
      trainingHours: trainingHours.trim(),
      socials: {
        facebook: facebookUrl.trim(),
        instagram: instagramUrl.trim(),
        youtube: youtubeUrl.trim(),
        tiktok: tiktokUrl.trim(),
      },
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
      notifyApplications,
      notifyTrials,
      notifyFees,
      adminDisplayName: adminDisplayName.trim() || 'Administrator',
      adminEmail: adminEmail.trim(),
    }));

    showToast(
      'Settings Saved',
      `Updated "${SETTINGS_TABS.find((t) => t.id === activeTab)?.label ?? 'Settings'}" across the website.`,
    );
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="System & Academy Settings"
        description="Manage academy details, official logo & hero images, contact channels, social links, and SEO settings."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <Card padding="sm" className="lg:col-span-3 space-y-1">
          {SETTINGS_TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setValidationError(null);
                }}
                className={`flex w-full items-center justify-between rounded-[10px] px-3.5 py-2.5 text-left text-xs font-semibold transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#071A36] text-white'
                    : 'text-[#071A36] hover:bg-[#F5F7FA]'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </Card>

        <Card padding="lg" className="lg:col-span-9">
          <form onSubmit={handleSaveSettings} className="space-y-5">
            {activeTab === 'academy' && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-[#071A36]">Academy Information</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Official Academy Name"
                    value={academyName}
                    onChange={(e) => setAcademyName(e.target.value)}
                    required
                  />
                  <Input
                    label="Official Slogan / Tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    required
                  />
                  <Input
                    label="Founder / Owner"
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                  />
                  <Input
                    label="Launch Note"
                    value={launchedNote}
                    onChange={(e) => setLaunchedNote(e.target.value)}
                  />
                </div>
                <Textarea
                  label="Footer & Academy Summary"
                  value={footerBio}
                  onChange={(e) => setFooterBio(e.target.value)}
                />
                <label className="flex items-center gap-3 rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] px-4 py-3 text-xs text-[#071A36] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPublicFees}
                    onChange={(e) => setShowPublicFees(e.target.checked)}
                    className="h-4 w-4 accent-[#071A36]"
                  />
                  <span>
                    Show published fee packages on the public Fees page (keep unchecked until
                    official rates are finalized)
                  </span>
                </label>
              </div>
            )}

            {activeTab === 'logo' && (
              <div className="space-y-5">
                <h2 className="text-base font-bold text-[#071A36]">
                  Official Crest &amp; Homepage Visuals
                </h2>
                <ImageManager
                  label="Academy Crest / Logo"
                  value={logo}
                  onChange={setLogo}
                  aspectRatio="square"
                  allowRemove={false}
                  helperText="Official crest shown in Header, Footer, and Management Portal."
                  presetAssets={[
                    { label: 'Official SK Tape Ball Academy Crest', src: OFFICIAL_LOGO_CONFIG.src },
                  ]}
                  storageFolder="branding"
                />
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  <ImageManager
                    label="Homepage Hero Backdrop"
                    value={heroMedia}
                    onChange={setHeroMedia}
                    aspectRatio="16/9"
                    presetAssets={[
                      { label: 'Floodlit Pitch Backdrop', src: heroImg },
                      { label: 'Practice Lanes', src: lanesImg },
                      { label: 'Power Batting Drill', src: battingImg },
                    ]}
                    storageFolder="hero"
                  />
                  <ImageManager
                    label="Academy Introduction Visual"
                    value={aboutMedia}
                    onChange={setAboutMedia}
                    aspectRatio="4/3"
                    presetAssets={[
                      { label: 'Practice Lanes', src: lanesImg },
                      { label: 'Floodlit Pitch', src: heroImg },
                    ]}
                    storageFolder="about"
                  />
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-[#071A36]">
                  Contact &amp; Location Details
                </h2>
                <p className="text-xs text-[#64748B]">
                  Leave any unconfirmed channel blank—blank channels are hidden cleanly on the
                  public website rather than showing placeholder text.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Location / Area"
                    value={locationText}
                    onChange={(e) => setLocationText(e.target.value)}
                    placeholder="Sabzazar, Lahore, Pakistan"
                    required
                  />
                  <Input
                    label="Google Maps Link (Optional)"
                    type="url"
                    value={mapUrl}
                    onChange={(e) => setMapUrl(e.target.value)}
                    placeholder="https://maps.google.com/..."
                  />
                  <Input
                    label="Official Phone Number (Optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 ..."
                  />
                  <Input
                    label="WhatsApp Number or Full Link (Optional)"
                    value={whatsappUrlOrNumber}
                    onChange={(e) => setWhatsappUrlOrNumber(e.target.value)}
                    placeholder="+92300... or https://wa.me/..."
                  />
                  <Input
                    label="Official Email (Optional)"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@..."
                  />
                  <Input
                    label="Training Hours (Optional)"
                    value={trainingHours}
                    onChange={(e) => setTrainingHours(e.target.value)}
                    placeholder="e.g. Mon–Sat · 4:00 PM – 9:00 PM"
                  />
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-[#071A36]">Social Media Links</h2>
                <p className="text-xs text-[#64748B]">
                  Only populated, valid social URLs appear in the public footer and contact page.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Facebook URL"
                    type="url"
                    placeholder="https://facebook.com/..."
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                  />
                  <Input
                    label="Instagram URL"
                    type="url"
                    placeholder="https://instagram.com/..."
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                  />
                  <Input
                    label="YouTube URL"
                    type="url"
                    placeholder="https://youtube.com/..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                  <Input
                    label="TikTok URL"
                    type="url"
                    placeholder="https://tiktok.com/@..."
                    value={tiktokUrl}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-[#071A36]">Website SEO Settings</h2>
                <Input
                  label="Default Meta Title"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                />
                <Textarea
                  label="Default Meta Description"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                />
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-[#071A36]">Notification Preferences</h2>
                <div className="space-y-3 text-sm text-[#071A36]">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyApplications}
                      onChange={(e) => setNotifyApplications(e.target.checked)}
                      className="h-4 w-4 accent-[#071A36]"
                    />
                    <span>Alert portal on new student admission applications</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyTrials}
                      onChange={(e) => setNotifyTrials(e.target.checked)}
                      className="h-4 w-4 accent-[#071A36]"
                    />
                    <span>Alert coaching desk on incoming free trial requests</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyFees}
                      onChange={(e) => setNotifyFees(e.target.checked)}
                      className="h-4 w-4 accent-[#071A36]"
                    />
                    <span>Track overdue fee reminders</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-[#071A36]">Administrator Profile</h2>
                <Input
                  label="Display Name"
                  value={adminDisplayName}
                  onChange={(e) => setAdminDisplayName(e.target.value)}
                />
                <Input
                  label="Contact Email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-[#071A36]">Portal Access Security</h2>
                <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 flex items-start gap-3 text-xs text-[#071A36]">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
                  <div className="space-y-1.5">
                    <p className="font-semibold">
                      {isSupabaseMode
                        ? 'Supabase Authentication & Admin Role Check Active'
                        : 'Protected Local Operator Access Active'}
                    </p>
                    <p className="text-[#64748B]">
                      This management portal is not linked from any public page and blocks search
                      engine indexing via robots meta tags. HTML script injection is blocked across
                      all text fields, and external links require HTTP/HTTPS protocols.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {validationError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-[10px] border border-[#C8202B]/30 bg-[#C8202B]/5 px-4 py-3 text-xs font-semibold text-[#C8202B]"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="flex justify-end border-t border-[#E2E8F0] pt-4">
              <Button type="submit" variant="primary" size="sm">
                <Save className="h-4 w-4" aria-hidden="true" />
                <span>Save Settings</span>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
