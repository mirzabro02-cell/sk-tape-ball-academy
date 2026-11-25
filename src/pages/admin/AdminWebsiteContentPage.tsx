import { useState, type FormEvent } from 'react';
import { Eye, Save } from 'lucide-react';
import heroImg from '@/src/assets/images/hero_cricket_academy_1795439223672.jpg';
import lanesImg from '@/src/assets/images/academy_training_lanes_1795439225599.jpg';
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
        <Card padding="sm" className="lg:col-span-4 space-y-1">
          <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#64748B]">
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
                      ? 'bg-[#071A36] text-white'
                      : 'text-[#071A36] hover:bg-[#F5F7FA]'
                  }`}
                >
                  <span>{sec.label}</span>
                  <span
                    className={`text-[10px] font-normal ${
                      active ? 'text-[#D9A52E]' : 'text-[#64748B]'
                    }`}
                  >
                    Edit
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="lg:col-span-8 space-y-5">
          <Card padding="lg" className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#071A36]">{activeSection.label}</h2>
                <p className="text-xs text-[#64748B]">{activeSection.lastUpdatedLabel}</p>
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
                    { label: 'Floodlit Pitch Backdrop', src: heroImg },
                  ]}
                  storageFolder="about"
                />
              )}

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="sm">
                  <Save className="h-4 w-4" aria-hidden="true" />
                  <span>Save Section</span>
                </Button>
              </div>
            </form>
          </Card>

          <Card tone="navy" padding="lg" className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#D9A52E]">
              Live Preview
            </p>
            <h3 className="text-xl font-extrabold text-white">{activeSection.headline}</h3>
            <p className="text-sm text-white/80">{activeSection.subheadline}</p>
            <p className="text-xs leading-relaxed text-white/65">{activeSection.bodyNotes}</p>
            <div className="pt-2">
              <span className="inline-flex h-10 items-center rounded-[10px] bg-[#D9A52E] px-4 text-xs font-bold text-[#050D1B]">
                {activeSection.ctaLabel || 'Action Button'}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
