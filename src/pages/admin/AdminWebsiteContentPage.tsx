import { useEffect, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { ArrowDown, ArrowUp, CheckCircle2, Eye, EyeOff, Globe, Save, X } from 'lucide-react';
import heroImg from '@/src/assets/images/hero_cricket_academy_1795439223672.jpg';
import lanesImg from '@/src/assets/images/academy_training_lanes_1795439225599.jpg';
import { HERO_STADIUM_VISUAL } from '@/src/assets/branding';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { useScrollLock } from '@/src/hooks/useScrollLock';
import type { AdminWebsiteContentSection } from '@/src/types/admin';
import { containsUnsafeHtml } from '@/src/utils/validation';
import { AdminPageHeader, AdminStatusBadge } from '@/src/components/admin/AdminPrimitives';
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
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [valuesDraft, setValuesDraft] = useState(state.siteSettings.aboutValues.join(', '));

  useEffect(() => {
    setValuesDraft(state.siteSettings.aboutValues.join(', '));
  }, [state.siteSettings.aboutValues]);

  useScrollLock(previewModalOpen);

  useEffect(() => {
    if (!previewModalOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPreviewModalOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [previewModalOpen]);

  const activeSection = sections.find((s) => s.id === selectedId) ?? sections[0];
  const activeIndex = sections.findIndex((s) => s.id === activeSection?.id);

  function updateField<K extends keyof AdminWebsiteContentSection>(
    field: K,
    value: AdminWebsiteContentSection[K],
  ) {
    if (!activeSection) return;
    setWebsiteSections((prev) =>
      prev.map((sec) => (sec.id === activeSection.id ? { ...sec, [field]: value } : sec)),
    );
  }

  function moveSection(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    setWebsiteSections((prev) => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  }

  function saveCurrentSection(publish = false) {
    if (!activeSection) return;
    const fieldsToCheck = [
      activeSection.headline,
      activeSection.subheadline,
      activeSection.ctaLabel,
      activeSection.bodyNotes,
    ];
    if (activeSection.id === 'about') {
      fieldsToCheck.push(
        state.siteSettings.founderName,
        state.siteSettings.founderRole,
        state.siteSettings.aboutStory,
        state.siteSettings.aboutMission,
        state.siteSettings.aboutVision,
        valuesDraft,
      );
    }

    if (containsUnsafeHtml(fieldsToCheck)) {
      showToast(
        'Blocked Unsafe Input',
        'HTML tags (< or >) are not permitted in website text.',
        'warning',
      );
      return;
    }

    if (activeSection.id === 'about') {
      const parsedValues = valuesDraft
        .split(/[,\n]+/)
        .map((v) => v.trim())
        .filter(Boolean);
      updateSiteSettings((prev) => ({
        ...prev,
        aboutValues: parsedValues,
      }));
    }

    setWebsiteSections((prev) =>
      prev.map((sec) =>
        sec.id === activeSection.id
          ? {
              ...sec,
              published: publish ? true : (sec.published ?? true),
              lastUpdatedLabel: publish ? 'Published' : 'Saved',
            }
          : sec,
      ),
    );
    showToast(
      publish ? 'Section Published' : 'Changes Saved',
      `"${activeSection.label}" ${publish ? 'is now live on the website' : 'changes saved'}.`,
    );
  }

  function handleSaveSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveCurrentSection(false);
  }

  if (!activeSection) return null;
  const isVisible = activeSection.visible !== false;

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Website Content Management (CMS)"
        description="Manage website section headlines, copy, visibility, order, and hero/about visuals with live preview."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setPreviewModalOpen(true)}>
              <Eye className="h-4 w-4" aria-hidden="true" />
              <span>Preview</span>
            </Button>
            <Button to="/" variant="secondary" size="sm">
              <Globe className="h-4 w-4 text-[#D5A52B]" aria-hidden="true" />
              <span>View Public Site</span>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Compact Sticky Left Sidebar: Section Selector + Live Preview Card */}
        <div className="lg:col-span-5 lg:sticky lg:top-[84px] space-y-5">
          <Card padding="sm" className="space-y-1.5">
            <div className="flex items-center justify-between px-3 py-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#A3B4CC]">
                Website Sections ({sections.length})
              </p>
              <span className="text-[11px] font-medium text-[#64748B] dark:text-[#7F95B8]">
                {sections.filter((s) => s.visible !== false).length} visible
              </span>
            </div>
            <div className="space-y-1 max-h-[340px] overflow-y-auto pr-0.5">
              {sections.map((sec, idx) => {
                const active = sec.id === activeSection.id;
                const secVisible = sec.visible !== false;
                return (
                  <div
                    key={sec.id}
                    className={`flex items-center gap-1 rounded-[10px] px-2 py-1.5 transition-colors ${
                      active
                        ? 'bg-[#D5A52B] text-[#050D1B]'
                        : 'text-[#07152C] hover:bg-[#F5F7FA] dark:text-[#E2E8F0] dark:hover:bg-[#162B4D]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(sec.id)}
                      className="flex min-w-0 flex-1 items-center justify-between gap-2 px-1.5 py-1 text-left text-xs font-semibold cursor-pointer"
                    >
                      <span className="truncate">{sec.label}</span>
                      <span
                        className={`text-[10px] font-semibold shrink-0 ${
                          active ? 'text-[#050D1B]/80' : 'text-[#64748B] dark:text-[#A3B4CC]'
                        }`}
                      >
                        {secVisible ? (sec.published === false ? 'Draft' : 'Live') : 'Hidden'}
                      </span>
                    </button>

                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveSection(idx, -1)}
                        disabled={idx === 0}
                        aria-label={`Move ${sec.label} up`}
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-[6px] disabled:opacity-30 cursor-pointer ${
                          active ? 'hover:bg-[#050D1B]/10' : 'hover:bg-[#E2E8F0] dark:hover:bg-white/10'
                        }`}
                      >
                        <ArrowUp className="h-3 w-3" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(idx, 1)}
                        disabled={idx === sections.length - 1}
                        aria-label={`Move ${sec.label} down`}
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-[6px] disabled:opacity-30 cursor-pointer ${
                          active ? 'hover:bg-[#050D1B]/10' : 'hover:bg-[#E2E8F0] dark:hover:bg-white/10'
                        }`}
                      >
                        <ArrowDown className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card tone="navy" padding="md" className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#D5A52B]">
                Live Section Preview
              </p>
              <AdminStatusBadge
                label={isVisible ? 'Visible' : 'Hidden'}
                variant={isVisible ? 'success' : 'neutral'}
              />
            </div>
            <h3 className="font-display text-xl font-bold text-white leading-tight">
              {activeSection.headline}
            </h3>
            <p className="text-sm text-white/80">{activeSection.subheadline}</p>
            {activeSection.bodyNotes && (
              <p className="text-xs leading-relaxed text-white/65 line-clamp-3">
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

        {/* Right Column: Compact Structured Section Editor */}
        <div className="lg:col-span-7">
          <Card padding="lg" className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4 dark:border-white/10">
              <div>
                <h2 className="text-lg font-bold text-[#07152C] dark:text-white">
                  {activeSection.label}
                </h2>
                <p className="text-xs text-[#64748B] dark:text-[#A3B4CC]">
                  Section #{activeIndex + 1} · Status: {activeSection.lastUpdatedLabel}
                </p>
              </div>

              <button
                type="button"
                onClick={() => updateField('visible', !isVisible)}
                className={`inline-flex h-9 items-center gap-2 rounded-[10px] border px-3 text-xs font-semibold transition-colors cursor-pointer ${
                  isVisible
                    ? 'border-[#D5A52B]/50 bg-[#D5A52B]/15 text-[#9A6F0A] dark:text-[#D5A52B]'
                    : 'border-[#E2E8F0] bg-[#F5F7FA] text-[#64748B] dark:border-white/15 dark:bg-[#07152C] dark:text-[#A3B4CC]'
                }`}
              >
                {isVisible ? (
                  <>
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Visible on Homepage</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Hidden on Homepage</span>
                  </>
                )}
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-4">
              <div className="space-y-4">
                <Input
                  label="Section Heading"
                  value={activeSection.headline}
                  onChange={(e) => updateField('headline', e.target.value)}
                  required
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Supporting Subheading"
                    value={activeSection.subheadline}
                    onChange={(e) => updateField('subheadline', e.target.value)}
                    required
                  />
                  <Input
                    label="Primary Button Label"
                    value={activeSection.ctaLabel}
                    onChange={(e) => updateField('ctaLabel', e.target.value)}
                  />
                </div>
                <Textarea
                  label="Section Description / Summary"
                  value={activeSection.bodyNotes}
                  onChange={(e) => updateField('bodyNotes', e.target.value)}
                />
              </div>

              {activeSection.id === 'hero' && (
                <div className="border-t border-[#E2E8F0] pt-4 dark:border-white/10">
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
                </div>
              )}

              {activeSection.id === 'about' && (
                <div className="space-y-5 border-t border-[#E2E8F0] pt-4 dark:border-white/10">
                  <ImageManager
                    label="Owner Photo (Sami Khan)"
                    helperText="Upload an actual portrait of Founder / Owner Sami Khan for the public About page. When empty, no portrait or placeholder frame is shown."
                    value={state.siteSettings.ownerMedia}
                    onChange={(ownerMedia) =>
                      updateSiteSettings((prev) => ({ ...prev, ownerMedia }))
                    }
                    aspectRatio="4/3"
                    storageFolder="owner"
                  />

                  <div className="space-y-4 rounded-[14px] border border-[#E2E8F0] bg-[#F5F7FA]/60 p-4 dark:border-white/10 dark:bg-[#07152C]/60">
                    <div>
                      <h3 className="text-sm font-bold text-[#07152C] dark:text-white">
                        About Page — Founder Profile, Story, Mission &amp; Vision
                      </h3>
                      <p className="text-xs text-[#64748B] dark:text-[#A3B4CC]">
                        Leave any unconfirmed field empty to hide it cleanly on the public About page.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Input
                        label="Founder / Owner Name"
                        value={state.siteSettings.founderName}
                        onChange={(e) =>
                          updateSiteSettings((prev) => ({
                            ...prev,
                            founderName: e.target.value,
                          }))
                        }
                      />
                      <Input
                        label="Owner Role Title"
                        value={state.siteSettings.founderRole}
                        onChange={(e) =>
                          updateSiteSettings((prev) => ({
                            ...prev,
                            founderRole: e.target.value,
                          }))
                        }
                        placeholder="Founder / Owner"
                      />
                    </div>

                    <Textarea
                      label="Founder Story (Separate paragraphs with a blank line)"
                      value={state.siteSettings.aboutStory}
                      onChange={(e) =>
                        updateSiteSettings((prev) => ({
                          ...prev,
                          aboutStory: e.target.value,
                        }))
                      }
                      rows={4}
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Textarea
                        label="Academy Mission"
                        value={state.siteSettings.aboutMission}
                        onChange={(e) =>
                          updateSiteSettings((prev) => ({
                            ...prev,
                            aboutMission: e.target.value,
                          }))
                        }
                        rows={4}
                      />
                      <Textarea
                        label="Academy Vision"
                        value={state.siteSettings.aboutVision}
                        onChange={(e) =>
                          updateSiteSettings((prev) => ({
                            ...prev,
                            aboutVision: e.target.value,
                          }))
                        }
                        rows={4}
                      />
                    </div>

                    <Input
                      label="Core Academy Values (Comma-separated)"
                      value={valuesDraft}
                      onChange={(e) => setValuesDraft(e.target.value)}
                      placeholder="Discipline, Hard Work, Consistency, Fitness..."
                    />
                  </div>

                  <ImageManager
                    label="Homepage Academy Ground Visual"
                    helperText="General academy training ground image shown on the Homepage introduction section."
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
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E2E8F0] dark:border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewModalOpen(true)}
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  <span>Preview</span>
                </Button>

                <div className="flex flex-wrap items-center gap-2.5">
                  <Button type="submit" variant="secondary" size="sm">
                    <Save className="h-4 w-4" aria-hidden="true" />
                    <span>Save Changes</span>
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => saveCurrentSection(true)}
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span>Publish</span>
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </div>

      {/* Live Preview Modal */}
      {previewModalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#050D1B]/80 p-3 sm:p-6 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Website Section Live Preview"
            onClick={() => setPreviewModalOpen(false)}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[20px] border border-white/15 bg-[#07152C] p-5 sm:p-8 text-white shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D5A52B]">
                    Live Section Preview
                  </p>
                  <p className="text-sm font-bold text-white">{activeSection.label}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(false)}
                  aria-label="Close preview"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/15 text-white hover:bg-white/10 cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="rounded-[16px] border border-white/10 bg-[#0F213B] p-6 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#D5A52B]">
                  {activeSection.subheadline}
                </p>
                <h3 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white">
                  {activeSection.headline}
                </h3>
                {activeSection.bodyNotes && (
                  <p className="text-sm leading-relaxed text-[#C2D0E3]">
                    {activeSection.bodyNotes}
                  </p>
                )}
                {activeSection.ctaLabel && (
                  <div className="pt-1">
                    <span className="inline-flex h-11 items-center rounded-[10px] bg-[#D5A52B] px-6 text-xs font-bold text-[#050D1B]">
                      {activeSection.ctaLabel}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outlineLight" size="sm" onClick={() => setPreviewModalOpen(false)}>
                  Close Preview
                </Button>
                <Button to={activeSection.id === 'about' ? '/about' : '/'} variant="primary" size="sm">
                  {activeSection.id === 'about' ? 'Open Live About Page' : 'Open Live Homepage'}
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
