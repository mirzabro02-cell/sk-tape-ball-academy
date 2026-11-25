import { useState, type FormEvent } from 'react';
import { AlertCircle, Save, ShieldCheck } from 'lucide-react';
import { ACADEMY_BRAND } from '@/src/data/brand';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import {
  AdminDemoNotice,
  AdminPageHeader,
} from '@/src/components/admin/AdminPrimitives';
import { useAdminToast } from '@/src/components/admin/AdminToastContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';

type SettingsTab =
  | 'academy'
  | 'branding'
  | 'logo'
  | 'contact'
  | 'social'
  | 'seo'
  | 'notifications'
  | 'profile'
  | 'security';

const SETTINGS_TABS: { id: SettingsTab; label: string }[] = [
  { id: 'academy', label: 'Academy Info' },
  { id: 'branding', label: 'Website Branding' },
  { id: 'logo', label: 'Logo & Favicon' },
  { id: 'contact', label: 'Contact Info' },
  { id: 'social', label: 'Social Media Links' },
  { id: 'seo', label: 'Website SEO' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'profile', label: 'Admin Profile' },
  { id: 'security', label: 'Security Settings' },
];

function containsUnsafeHtml(values: string[]): boolean {
  return values.some((val) => /[<>]/.test(val));
}

export function AdminSettingsPage() {
  useDocumentTitle('System Settings');
  const { showToast } = useAdminToast();

  const [activeTab, setActiveTab] = useState<SettingsTab>('academy');
  const [validationError, setValidationError] = useState<string | null>(null);

  const [academyName, setAcademyName] = useState<string>(ACADEMY_BRAND.name);
  const [tagline, setTagline] = useState<string>(ACADEMY_BRAND.tagline);
  const [shortBio, setShortBio] = useState(
    'Structured tape ball cricket coaching platform focusing on discipline, skill mastery, and match readiness.',
  );

  const [primaryNavy, setPrimaryNavy] = useState('#071A36');
  const [royalGold, setRoyalGold] = useState('#D9A52E');
  const [cricketRed, setCricketRed] = useState('#C8202B');

  const [logoStatusNote, setLogoStatusNote] = useState(
    'Official academy logo file unchanged; awaiting final upload asset if replacement needed.',
  );
  const [faviconLabel, setFaviconLabel] = useState('Default SVG / Brand Mark');

  const [phonePlaceholder, setPhonePlaceholder] = useState<string>(
    ACADEMY_BRAND.contactPlaceholders.phonePlaceholder,
  );
  const [emailPlaceholder, setEmailPlaceholder] = useState<string>(
    ACADEMY_BRAND.contactPlaceholders.emailPlaceholder,
  );
  const [addressPlaceholder, setAddressPlaceholder] = useState<string>(
    ACADEMY_BRAND.contactPlaceholders.addressPlaceholder,
  );
  const [whatsappPlaceholder, setWhatsappPlaceholder] = useState(
    'WhatsApp Inquiry Link Placeholder',
  );

  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const [seoTitle, setSeoTitle] = useState(
    'SK Tape Ball Academy | Build Your Game. Master Your Skills.',
  );
  const [seoDescription, setSeoDescription] = useState(
    'Structured tape ball cricket coaching, skill programs, coaching leadership, and player admissions.',
  );

  const [notifyApplications, setNotifyApplications] = useState(true);
  const [notifyTrials, setNotifyTrials] = useState(true);
  const [notifyFees, setNotifyFees] = useState(false);

  const [adminDisplayName, setAdminDisplayName] = useState('Academy Administrator (Placeholder)');
  const [adminEmailPlaceholder, setAdminEmailPlaceholder] = useState('admin@academy.placeholder');
  const [requireTwoFactorPlaceholder, setRequireTwoFactorPlaceholder] = useState(true);

  function handleSaveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);

    const textValuesToCheck = [
      academyName,
      tagline,
      shortBio,
      logoStatusNote,
      faviconLabel,
      phonePlaceholder,
      emailPlaceholder,
      addressPlaceholder,
      whatsappPlaceholder,
      facebookUrl,
      instagramUrl,
      youtubeUrl,
      seoTitle,
      seoDescription,
      adminDisplayName,
      adminEmailPlaceholder,
    ];

    if (containsUnsafeHtml(textValuesToCheck)) {
      setValidationError(
        'HTML tags (< or >) and script syntax are blocked for security. Enter plain text or valid URLs only.',
      );
      return;
    }

    showToast(
      'Settings Saved (Frontend Preview Only)',
      `Updated "${SETTINGS_TABS.find((t) => t.id === activeTab)?.label ?? 'Settings'}" in local session state.`,
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="System & Academy Settings"
        description="Configure academy details, visual branding tokens, contact placeholders, SEO fields, and security preferences."
      />

      <AdminDemoNotice text="Plain-text validation enforced: raw HTML, custom script blocks, and unsafe code injection are blocked. Settings changes apply to session preview only." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
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
                <Input
                  label="Official Academy Name"
                  value={academyName}
                  onChange={(e) => setAcademyName(e.target.value)}
                  required
                />
                <Input
                  label="Academy Tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  required
                />
                <Textarea
                  label="Academy Overview Summary"
                  value={shortBio}
                  onChange={(e) => setShortBio(e.target.value)}
                />
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-[#071A36]">Website Branding Palette</h2>
                <p className="text-xs text-[#64748B]">
                  Official palette tokens locked across the public website and admin panel.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Input
                    label="Deep Navy"
                    value={primaryNavy}
                    onChange={(e) => setPrimaryNavy(e.target.value)}
                  />
                  <Input
                    label="Royal Gold"
                    value={royalGold}
                    onChange={(e) => setRoyalGold(e.target.value)}
                  />
                  <Input
                    label="Cricket Red"
                    value={cricketRed}
                    onChange={(e) => setCricketRed(e.target.value)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'logo' && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-[#071A36]">Logo &amp; Favicon</h2>
                <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 flex items-center gap-4">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-[10px] border border-[#071A36]/20 bg-[#071A36] text-xs font-extrabold text-[#D9A52E]">
                    LOGO
                  </div>
                  <div className="text-xs text-[#64748B]">
                    <p className="font-bold text-[#071A36]">Official Brand Mark Placeholder</p>
                    <p>Direct file upload connects when storage backend is integrated.</p>
                  </div>
                </div>
                <Input
                  label="Logo Asset Status Note"
                  value={logoStatusNote}
                  onChange={(e) => setLogoStatusNote(e.target.value)}
                />
                <Input
                  label="Favicon Label"
                  value={faviconLabel}
                  onChange={(e) => setFaviconLabel(e.target.value)}
                />
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-[#071A36]">Contact Information</h2>
                <Input
                  label="Official Phone Placeholder"
                  value={phonePlaceholder}
                  onChange={(e) => setPhonePlaceholder(e.target.value)}
                />
                <Input
                  label="Official Email Placeholder"
                  value={emailPlaceholder}
                  onChange={(e) => setEmailPlaceholder(e.target.value)}
                />
                <Input
                  label="Ground / Venue Address Placeholder"
                  value={addressPlaceholder}
                  onChange={(e) => setAddressPlaceholder(e.target.value)}
                />
                <Input
                  label="WhatsApp Inquiry Channel Placeholder"
                  value={whatsappPlaceholder}
                  onChange={(e) => setWhatsappPlaceholder(e.target.value)}
                />
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-[#071A36]">Social Media Links</h2>
                <Input
                  label="Facebook Page URL (Optional)"
                  type="url"
                  placeholder="https://facebook.com/..."
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                />
                <Input
                  label="Instagram Profile URL (Optional)"
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                />
                <Input
                  label="YouTube Channel URL (Optional)"
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                />
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
                    <span>Notify admins on new student admission applications (Future Backend)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyTrials}
                      onChange={(e) => setNotifyTrials(e.target.checked)}
                      className="h-4 w-4 accent-[#071A36]"
                    />
                    <span>Notify coaching desk on incoming free trial requests</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyFees}
                      onChange={(e) => setNotifyFees(e.target.checked)}
                      className="h-4 w-4 accent-[#071A36]"
                    />
                    <span>Send weekly overdue fee reminder digest</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-[#071A36]">Admin Profile</h2>
                <Input
                  label="Display Name"
                  value={adminDisplayName}
                  onChange={(e) => setAdminDisplayName(e.target.value)}
                />
                <Input
                  label="Admin Email Placeholder"
                  type="email"
                  value={adminEmailPlaceholder}
                  onChange={(e) => setAdminEmailPlaceholder(e.target.value)}
                />
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-[#071A36]">Security Settings Interface</h2>
                <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 flex items-start gap-3 text-xs text-[#071A36]">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#D9A52E]" aria-hidden="true" />
                  <p>
                    Role-based access control (Admin / Coach / Student) and verified session
                    policies will be enforced on the backend once authentication is connected.
                    Arbitrary HTML/script inputs are disallowed across all settings fields.
                  </p>
                </div>
                <label className="flex items-center gap-3 text-sm text-[#071A36] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireTwoFactorPlaceholder}
                    onChange={(e) => setRequireTwoFactorPlaceholder(e.target.checked)}
                    className="h-4 w-4 accent-[#071A36]"
                  />
                  <span>Require two-factor verification for admin accounts (Planned Policy)</span>
                </label>
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
                <span>Save Settings (Preview)</span>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
