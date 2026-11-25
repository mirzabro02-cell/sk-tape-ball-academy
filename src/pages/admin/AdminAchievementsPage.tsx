import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Pencil, Plus } from 'lucide-react';
import {
  ADMIN_IMAGE_ASSETS,
  INITIAL_ADMIN_ACHIEVEMENTS,
  INITIAL_ADMIN_STUDENTS,
} from '@/src/data/adminMockData';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminAchievement } from '@/src/types/admin';
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

export function AdminAchievementsPage() {
  useDocumentTitle('Achievements Management');
  const { showToast } = useAdminToast();

  const [items, setItems] = useState<AdminAchievement[]>(INITIAL_ADMIN_ACHIEVEMENTS);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminAchievement | null>(null);

  const [title, setTitle] = useState('');
  const [playerName, setPlayerName] = useState(INITIAL_ADMIN_STUDENTS[0].fullName);
  const [category, setCategory] = useState('Academy Recognition');
  const [datePlaceholder, setDatePlaceholder] = useState('[Quarter Placeholder]');
  const [description, setDescription] = useState('');
  const [imagePath, setImagePath] = useState(ADMIN_IMAGE_ASSETS[0].path);
  const [published, setPublished] = useState(true);

  function openAdd() {
    setEditing(null);
    setTitle('');
    setPlayerName(INITIAL_ADMIN_STUDENTS[0].fullName);
    setCategory('Academy Recognition');
    setDatePlaceholder('[Quarter Placeholder]');
    setDescription('');
    setImagePath(ADMIN_IMAGE_ASSETS[0].path);
    setPublished(true);
    setFormOpen(true);
  }

  function openEdit(item: AdminAchievement) {
    setEditing(item);
    setTitle(item.title);
    setPlayerName(item.playerName);
    setCategory(item.category);
    setDatePlaceholder(item.datePlaceholder);
    setDescription(item.description);
    setImagePath(item.imagePath);
    setPublished(item.published);
    setFormOpen(true);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !description.trim()) return;

    if (editing) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editing.id
            ? { ...i, title, playerName, category, datePlaceholder, description, imagePath, published }
            : i,
        ),
      );
      showToast('Achievement Updated (Preview)', `${title} updated in demonstration session.`);
    } else {
      const next: AdminAchievement = {
        id: `ach-${Date.now()}`,
        title,
        playerName,
        category,
        datePlaceholder,
        description,
        imagePath,
        published,
      };
      setItems((prev) => [next, ...prev]);
      showToast('Achievement Added (Preview)', `${title} created in demonstration list.`);
    }
    setFormOpen(false);
  }

  function togglePublish(item: AdminAchievement) {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, published: !i.published } : i)),
    );
    showToast(
      item.published ? 'Achievement Unpublished (Preview)' : 'Achievement Published (Preview)',
      `${item.title} visibility updated in session state.`,
      'info',
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Achievements Management"
        description="Manage player awards, training milestones, assigned profiles, and public publish states."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Add Achievement</span>
          </Button>
        }
      />

      <AdminDemoNotice />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id} padding="sm" className="flex flex-col justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-32 w-full sm:w-40 shrink-0 overflow-hidden rounded-[10px] bg-[#071A36]">
                <img
                  src={item.imagePath}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-[#C8202B]">
                    {item.category} · {item.datePlaceholder}
                  </span>
                  <AdminStatusBadge
                    label={item.published ? 'Published' : 'Unpublished'}
                    variant={item.published ? 'success' : 'neutral'}
                  />
                </div>
                <h2 className="text-base font-bold text-[#071A36]">{item.title}</h2>
                <p className="text-xs font-semibold text-[#071A36]">
                  Assigned Player: <span className="text-[#64748B]">{item.playerName}</span>
                </p>
                <p className="text-xs leading-relaxed text-[#64748B]">{item.description}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => togglePublish(item)}
              >
                {item.published ? (
                  <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>{item.published ? 'Unpublish' : 'Publish'}</span>
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={() => openEdit(item)}>
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
        title={editing ? 'Edit Achievement' : 'Add Achievement'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Achievement Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Assign Player"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              options={INITIAL_ADMIN_STUDENTS.map((s) => ({
                value: s.fullName,
                label: s.fullName,
              }))}
            />
            <Input
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <Input
              label="Date / Period Placeholder"
              value={datePlaceholder}
              onChange={(e) => setDatePlaceholder(e.target.value)}
              required
            />
            <Select
              label="Achievement Image Asset"
              value={imagePath}
              onChange={(e) => setImagePath(e.target.value)}
              options={ADMIN_IMAGE_ASSETS.map((a) => ({ value: a.path, label: a.label }))}
            />
          </div>
          <Textarea
            label="Description"
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
            <span>Publish on public Achievements showcase</span>
          </label>
          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editing ? 'Save Achievement' : 'Create Achievement'}
            </Button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
