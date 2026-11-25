import { useState, type FormEvent } from 'react';
import { Eye, Save } from 'lucide-react';
import heroImg from '@/src/assets/images/hero_cricket_academy_1795439223672.jpg';
import lanesImg from '@/src/assets/images/academy_training_lanes_1795439225599.jpg';
import { HERO_STADIUM_VISUAL } from '@/src/assets/branding';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminWebsiteContentSection } from '@/src/types/admin';
import { containsUnsafeHtml } from '@/src/utils/validation';
import { AdminPageHeader } from '@/src/components/admin/AdminPrimitives';
import { ImageManager } from '@/src/components/admin/ImageManager';
import { useAdminToast } from '@/src/components/admin/AdminToastContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';

export function AdminWebsiteContentPage() {
  useDocumentTitle('Website Content Management');
  const { showToast } = useAdminToast();
  const { state, setWebsiteSections, updateSiteSettings } = useAcademyState();

  const sections = state.websiteSections;
  const [selectedId, setSelectedId] = useState(sections[0]?.id ?? 'hero');
  const activeSection = sections.find((s) => s.id === selectedId) ?? sections[0];

  function updateField<K extends keyof AdminWebsiteContentSection>(
    field: K,
    value: AdminWebsiteContentSection[K],
  ) {
    if (!activeSection) return;
    setWebsiteSections((prev) =>
      prev.map((sec) => (sec.id === activeSection.id ? { ...sec, [field]: value } : sec)),
    );
  }

  function handleSaveSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeSection) return;
    if (
      containsUnsafeHtml([
        activeSection.headline,
        activeSection.subheadline,
        activeSection.ctaLabel,
        activeSection.bodyNotes,
      ])
    ) {
      showToast(
        'Blocked Unsafe Input',
        'HTML tags (< or >) are not permitted in website text.',
        'warning',
      );
      return;
    }

    setWebsiteSections((prev) =>
      prev.map((sec) =>
        sec.id === activeSection.id ? { ...sec, lastUpdatedLabel: 'Updated' } : sec,
      ),
    );
    showToast('Content Updated', `"${activeSection.label}" changes saved.`);
  }

  if (!activeSection) return null;

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Website Content Management (CMS)"
        description="Update section headlines, supporting copy, and homepage hero/about images."
        actions={
          <Button to="/" variant="outline" size="sm">
            <Eye className="h-4 w-4" aria-hidden="true" />
            <span>Open Public Homepage</span>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Sticky Left Rail: Section Selector + Live Preview balanced together to avoid blank vertical voids */}
        <div className="lg:col-span-5 lg:sticky lg:top-[84px] space-y-5">
          <Card padding="sm" className="space-y-1.5">
            <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#A3B4CC]">
              Website Sections ({sections.length})
            </p>
            <div className="space-y-1">
              {sections.map((sec) => {
                const active = sec.id === activeSection.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSelectedId(sec.id)}
                    className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-left text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#D5A52B] text-[#050D1B]'
                        : 'text-[#07152C] hover:bg-[#F5F7FA] dark:text-[#E2E8F0] dark:hover:bg-[#162B4D]'
                    }`}
                  >
                    <span className="truncate">{sec.label}</span>
                    <span
                      className={`text-[10px] font-semibold shrink-0 ${
                        active ? 'text-[#050D1B]/80' : 'text-[#64748B] dark:text-[#A3B4CC]'
                      }`}
                    >
                      {active ? 'Editing' : 'Edit'}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card tone="navy" padding="md" className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#D5A52B]">
              Live Website Preview
            </p>
            <h3 className="font-display text-xl font-bold text-white leading-tight">
              {activeSection.headline}
            </h3>
            <p className="text-sm text-white/80">{activeSection.subheadline}</p>
            {activeSection.bodyNotes && (
              <p className="text-xs leading-relaxed text-white/65 line-clamp-4">
                {activeSection.bodyNotes}
              </p>
            )}
            <div className="pt-1">
              <span className="inline-flex h-9 items-center rounded-[10px] bg-[#D5A52B] px-4 text-xs font-bold text-[#050D1B]">
                {activeSection.ctaLabel || 'Action Button'}
              </span>
            </div>
          </Card>
        </div>

        {/* Right Column: Section Editor */}
        <div className="lg:col-span-7">
          <Card padding="lg" className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3 dark:border-white/10">
              <div>
                <h2 className="text-lg font-bold text-[#07152C] dark:text-white">
                  {activeSection.label}
                </h2>
                <p className="text-xs text-[#64748B] dark:text-[#A3B4CC]">
                  {activeSection.lastUpdatedLabel}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-4">
              <Input
                label="Section Headline"
                value={activeSection.headline}
                onChange={(e) => updateField('headline', e.target.value)}
                required
              />
              <Input
                label="Supporting Subheadline"
                value={activeSection.subheadline}
                onChange={(e) => updateField('subheadline', e.target.value)}
                required
              />
              <Input
                label="Primary CTA Label"
                value={activeSection.ctaLabel}
                onChange={(e) => updateField('ctaLabel', e.target.value)}
              />
              <Textarea
                label="Section Copy / Summary"
                value={activeSection.bodyNotes}
                onChange={(e) => updateField('bodyNotes', e.target.value)}
              />

              {activeSection.id === 'hero' && (
                <ImageManager
                  label="Hero Backdrop Image"
                  value={state.siteSettings.heroMedia}
                  onChange={(heroMedia) =>
                    updateSiteSettings((prev) => ({ ...prev, heroMedia }))
                  }
                  aspectRatio="16/9"
                  presetAssets={[
                    { label: 'Stadium Tape Ball Action Hero', src: HERO_STADIUM_VISUAL },
                    { label: 'Floodlit Pitch Backdrop', src: heroImg },
                    { label: 'Practice Lanes', src: lanesImg },
                  ]}
                  storageFolder="hero"
                />
              )}

              {activeSection.id === 'about' && (
                <ImageManager
                  label="About Section Image"
                  value={state.siteSettings.aboutMedia}
                  onChange={(aboutMedia) =>
                    updateSiteSettings((prev) => ({ ...prev, aboutMedia }))
                  }
                  aspectRatio="4/3"
                  presetAssets={[
                    { label: 'Practice Lanes', src: lanesImg },
                    { label: 'Stadium Tape Ball Action Hero', src: HERO_STADIUM_VISUAL },
                    { label: 'Floodlit Pitch Backdrop', src: heroImg },
                  ]}
                  storageFolder="about"
                />
              )}

              <div className="flex justify-end pt-2 border-t border-[#E2E8F0] dark:border-white/10">
                <Button type="submit" variant="primary" size="sm">
                  <Save className="h-4 w-4" aria-hidden="true" />
                  <span>Save Section</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
