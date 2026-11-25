import { useMemo, useState, type FormEvent } from 'react';
import { Eye, EyeOff, Pencil, Plus } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { ADMIN_IMAGE_ASSETS } from '@/src/assets/branding';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminProgram } from '@/src/types/admin';
import { createManagedMedia, type ManagedMediaValue } from '@/src/types/media';
import {
  AdminModal,
  AdminPageHeader,
  AdminStatusBadge,
} from '@/src/components/admin/AdminPrimitives';
import { ImageManager } from '@/src/components/admin/ImageManager';
import { useAdminToast } from '@/src/components/admin/AdminToastContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { MediaImage } from '@/src/components/ui/MediaImage';
import { Select } from '@/src/components/ui/Select';
import { Textarea } from '@/src/components/ui/Textarea';

export function AdminProgramsPage() {
  useDocumentTitle('Program Management');
  const { showToast } = useAdminToast();
  const { state, setPrograms } = useAcademyState();

  const programs = state.programs;
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProgram | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AdminProgram['category']>('Skill Track');
  const [description, setDescription] = useState('');
  const [programMedia, setProgramMedia] = useState<ManagedMediaValue>(
    createManagedMedia(ADMIN_IMAGE_ASSETS[0]?.path),
  );
  const [published, setPublished] = useState(true);

  const filtered = useMemo(() => {
    if (categoryFilter === 'All') return programs;
    return programs.filter((p) => p.category === categoryFilter);
  }, [programs, categoryFilter]);

  function openAdd() {
    setEditing(null);
    setTitle('');
    setCategory('Skill Track');
    setDescription('');
    setProgramMedia(createManagedMedia(ADMIN_IMAGE_ASSETS[0]?.path));
    setPublished(true);
    setFormOpen(true);
  }

  function openEdit(prog: AdminProgram) {
    setEditing(prog);
    setTitle(prog.title);
    setCategory(prog.category);
    setDescription(prog.description);
    setProgramMedia(createManagedMedia(prog.imagePath, prog.imageTransform));
    setPublished(prog.published);
    setFormOpen(true);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const imagePath = programMedia.src || ADMIN_IMAGE_ASSETS[0]?.path || '';

    if (editing) {
      setPrograms((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                title: title.trim(),
                category,
                description: description.trim(),
                imagePath,
                imageTransform: programMedia.transform,
                published,
              }
            : p,
        ),
      );
      showToast('Program Updated', `${title.trim()} updated.`);
    } else {
      const next: AdminProgram = {
        id: `prog-${Date.now()}`,
        code: String(programs.length + 1).padStart(2, '0'),
        title: title.trim(),
        category,
        description: description.trim(),
        imagePath,
        imageTransform: programMedia.transform,
        published,
        enrolledDemoCount: 0,
      };
      setPrograms((prev) => [...prev, next]);
      showToast('Program Added', `${next.title} created.`);
    }
    setFormOpen(false);
  }

  function togglePublish(prog: AdminProgram) {
    setPrograms((prev) =>
      prev.map((p) => (p.id === prog.id ? { ...p, published: !p.published } : p)),
    );
    showToast(
      prog.published ? 'Program Hidden' : 'Program Published',
      `${prog.title} visibility updated.`,
      'info',
    );
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Training Programs Management"
        description="Manage academy coaching tracks, descriptions, imagery, and publish visibility."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Add Program</span>
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Skill Track', 'Level Track', 'Individual Coaching'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-[10px] border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              categoryFilter === cat
                ? 'border-[#07152C] bg-[#07152C] text-white dark:border-[#D5A52B] dark:bg-[#D5A52B] dark:text-[#050D1B]'
                : 'border-[#E2E8F0] bg-white text-[#07152C] hover:bg-[#F5F7FA] dark:border-white/15 dark:bg-[#0F213B] dark:text-[#E2E8F0] dark:hover:bg-[#162B4D]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((prog) => (
          <Card key={prog.id} padding="sm" className="overflow-hidden flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <MediaImage
                src={prog.imagePath}
                alt={prog.title}
                transform={prog.imageTransform}
                className="aspect-video w-full rounded-[10px]"
              />

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#A3B4CC]">
                    {prog.code} · {prog.category}
                  </p>
                  <h2 className="text-base font-bold text-[#07152C] dark:text-white">
                    {prog.title}
                  </h2>
                </div>
                <AdminStatusBadge
                  label={prog.published ? 'Published' : 'Hidden'}
                  variant={prog.published ? 'success' : 'neutral'}
                />
              </div>

              <p className="text-xs leading-relaxed text-[#64748B] dark:text-[#A3B4CC]">
                {prog.description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] pt-3 dark:border-white/10">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => togglePublish(prog)}
              >
                {prog.published ? (
                  <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>{prog.published ? 'Hide' : 'Publish'}</span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => openEdit(prog)}
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Edit</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AdminModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Training Program' : 'Add Training Program'}
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <ImageManager
            label="Program Cover Image"
            value={programMedia}
            onChange={setProgramMedia}
            aspectRatio="16/9"
            presetAssets={ADMIN_IMAGE_ASSETS.map((a) => ({ label: a.label, src: a.path }))}
            storageFolder="programs"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Program Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Wicket Keeping"
              required
            />
            <Select
              label="Program Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as AdminProgram['category'])}
              options={[
                { value: 'Skill Track', label: 'Skill Track' },
                { value: 'Level Track', label: 'Level Track' },
                { value: 'Individual Coaching', label: 'Individual Coaching' },
              ]}
            />
          </div>

          <Textarea
            label="Program Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label className="inline-flex items-center gap-2.5 text-sm text-[#07152C] dark:text-[#E2E8F0] cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 accent-[#D5A52B]"
            />
            <span>Visible on public Training Programs listing</span>
          </label>

          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4 dark:border-white/10">
            <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editing ? 'Save Program' : 'Create Program'}
            </Button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
