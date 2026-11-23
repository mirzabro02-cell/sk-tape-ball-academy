import { useMemo, useState, type FormEvent } from 'react';
import { Eye, EyeOff, Pencil, Plus } from 'lucide-react';
import { ADMIN_IMAGE_ASSETS, INITIAL_ADMIN_PROGRAMS } from '@/src/data/adminMockData';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminProgram } from '@/src/types/admin';
import {
  AdminDemoNotice,
  AdminModal,
  AdminPageHeader,
  AdminStatusBadge,
} from '@/src/components/admin/AdminPrimitives';
import { useAdminToast } from '@/src/components/admin/AdminToastContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { Textarea } from '@/src/components/ui/Textarea';

export function AdminProgramsPage() {
  useDocumentTitle('Program Management');
  const { showToast } = useAdminToast();

  const [programs, setPrograms] = useState<AdminProgram[]>(INITIAL_ADMIN_PROGRAMS);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProgram | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AdminProgram['category']>('Skill Track');
  const [description, setDescription] = useState('');
  const [imagePath, setImagePath] = useState(ADMIN_IMAGE_ASSETS[0].path);
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
    setImagePath(ADMIN_IMAGE_ASSETS[0].path);
    setPublished(true);
    setFormOpen(true);
  }

  function openEdit(prog: AdminProgram) {
    setEditing(prog);
    setTitle(prog.title);
    setCategory(prog.category);
    setDescription(prog.description);
    setImagePath(prog.imagePath);
    setPublished(prog.published);
    setFormOpen(true);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !description.trim()) return;

    if (editing) {
      setPrograms((prev) =>
        prev.map((p) =>
          p.id === editing.id ? { ...p, title, category, description, imagePath, published } : p,
        ),
      );
      showToast('Program Updated (Preview)', `${title} updated in demonstration state.`);
    } else {
      const next: AdminProgram = {
        id: `prog-${Date.now()}`,
        code: String(programs.length + 1).padStart(2, '0'),
        title,
        category,
        description,
        imagePath,
        published,
        enrolledDemoCount: 0,
      };
      setPrograms((prev) => [...prev, next]);
      showToast('Program Added (Preview)', `${title} created in session state.`);
    }
    setFormOpen(false);
  }

  function togglePublish(prog: AdminProgram) {
    setPrograms((prev) =>
      prev.map((p) => (p.id === prog.id ? { ...p, published: !p.published } : p)),
    );
    showToast(
      prog.published ? 'Program Unpublished (Preview)' : 'Program Published (Preview)',
      `${prog.title} visibility toggled in demonstration session.`,
      'info',
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Training Programs Management"
        description="Configure academy skill tracks, descriptions, visual assets, and public publish states."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Add Program</span>
          </Button>
        }
      />

      <AdminDemoNotice />

      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Skill Track', 'Level Track', 'Individual Coaching'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-[10px] border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              categoryFilter === cat
                ? 'border-[#071A36] bg-[#071A36] text-white'
                : 'border-[#E2E8F0] bg-white text-[#071A36] hover:bg-[#F5F7FA]'
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
              <div className="aspect-video w-full overflow-hidden rounded-[10px] bg-[#071A36]">
                <img
                  src={prog.imagePath}
                  alt={prog.title}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                    {prog.code} · {prog.category}
                  </p>
                  <h2 className="text-base font-bold text-[#071A36]">{prog.title}</h2>
                </div>
                <AdminStatusBadge
                  label={prog.published ? 'Published' : 'Unpublished'}
                  variant={prog.published ? 'success' : 'neutral'}
                />
              </div>

              <p className="text-xs leading-relaxed text-[#64748B]">{prog.description}</p>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-[#E2E8F0] pt-3">
              <span className="text-[11px] font-mono font-semibold text-[#64748B] tabular-nums">
                Demo Enrolled: {prog.enrolledDemoCount}
              </span>
              <div className="flex items-center gap-2">
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
                  <span>{prog.published ? 'Unpublish' : 'Publish'}</span>
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
            </div>
          </Card>
        ))}
      </div>

      <AdminModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Training Program' : 'Add Training Program'}
      >
        <form onSubmit={handleSave} className="space-y-4">
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

          <Select
            label="Program Image Asset"
            value={imagePath}
            onChange={(e) => setImagePath(e.target.value)}
            options={ADMIN_IMAGE_ASSETS.map((img) => ({ value: img.path, label: img.label }))}
          />

          <Textarea
            label="Program Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label className="inline-flex items-center gap-2.5 text-sm text-[#071A36] cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 accent-[#071A36]"
            />
            <span>Visible on public Training Programs listing</span>
          </label>

          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
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
