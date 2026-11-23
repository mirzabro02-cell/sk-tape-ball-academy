import { useState, type FormEvent } from 'react';
import { Eye, Save } from 'lucide-react';
import { INITIAL_WEBSITE_CONTENT_SECTIONS } from '@/src/data/adminMockData';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminWebsiteContentSection } from '@/src/types/admin';
import {
  AdminDemoNotice,
  AdminPageHeader,
} from '@/src/components/admin/AdminPrimitives';
import { useAdminToast } from '@/src/components/admin/AdminToastContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Textarea } from '@/src/components/ui/Textarea';

export function AdminWebsiteContentPage() {
  useDocumentTitle('Website Content Management');
  const { showToast } = useAdminToast();

  const [sections, setSections] = useState<AdminWebsiteContentSection[]>(
    INITIAL_WEBSITE_CONTENT_SECTIONS,
  );
  const [selectedId, setSelectedId] = useState(INITIAL_WEBSITE_CONTENT_SECTIONS[0].id);

  const activeSection = sections.find((s) => s.id === selectedId) ?? sections[0];

  function updateField<K extends keyof AdminWebsiteContentSection>(
    field: K,
    value: AdminWebsiteContentSection[K],
  ) {
    setSections((prev) =>
      prev.map((sec) => (sec.id === activeSection.id ? { ...sec, [field]: value } : sec)),
    );
  }

  function handleSaveSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === activeSection.id
          ? { ...sec, lastUpdatedLabel: 'Updated in Session Preview' }
          : sec,
      ),
    );
    showToast(
      'CMS Section Saved (Frontend Preview)',
      `"${activeSection.label}" changes stored in current browser session only.`,
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Website Content Management (CMS)"
        description="Edit public website section headlines, supporting copy, and calls to action with live safe previews."
        actions={
          <Button to="/" variant="outline" size="sm">
            <Eye className="h-4 w-4" aria-hidden="true" />
            <span>Open Public Homepage</span>
          </Button>
        }
      />

      <AdminDemoNotice text="Changes update the CMS demonstration preview state in this session. Database-backed CMS persistence will connect in a later phase." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Section Selector List */}
        <Card padding="sm" className="lg:col-span-4 space-y-1.5">
          <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#64748B]">
            Website Sections (11)
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

        {/* Editor + Live Preview */}
        <div className="lg:col-span-8 space-y-6">
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
                label="Editorial Notes / Managed Body Copy"
                value={activeSection.bodyNotes}
                onChange={(e) => updateField('bodyNotes', e.target.value)}
              />
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="sm">
                  <Save className="h-4 w-4" aria-hidden="true" />
                  <span>Save Section Preview</span>
                </Button>
              </div>
            </form>
          </Card>

          <Card tone="navy" padding="lg" className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#D9A52E]">
              Live Section Preview Placeholder
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
