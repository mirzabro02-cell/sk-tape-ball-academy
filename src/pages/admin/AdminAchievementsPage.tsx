import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { ADMIN_IMAGE_ASSETS } from '@/src/assets/branding';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminAchievement } from '@/src/types/admin';
import { createManagedMedia, type ManagedMediaValue } from '@/src/types/media';
import {
  AdminConfirmDialog,
  AdminEmptyState,
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
import { Textarea } from '@/src/components/ui/Textarea';

export function AdminAchievementsPage() {
  useDocumentTitle('Achievements Management');
  const { showToast } = useAdminToast();
  const { state, setAchievements } = useAcademyState();

  const items = state.achievements;
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminAchievement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminAchievement | null>(null);

  const [title, setTitle] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [category, setCategory] = useState('Tournament Honors');
  const [datePlaceholder, setDatePlaceholder] = useState('');
  const [description, setDescription] = useState('');
  const [mediaValue, setMediaValue] = useState<ManagedMediaValue>(createManagedMedia(null));
  const [published, setPublished] = useState(true);

  function openAdd() {
    setEditing(null);
    setTitle('');
    setPlayerName('');
    setCategory('Tournament Honors');
    setDatePlaceholder('');
    setDescription('');
    setMediaValue(createManagedMedia(null));
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
    setMediaValue(createManagedMedia(item.imagePath, item.imageTransform));
    setPublished(item.published);
    setFormOpen(true);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const imagePath = mediaValue.src || '';

    if (editing) {
      setAchievements((prev) =>
        prev.map((i) =>
          i.id === editing.id
            ? {
                ...i,
                title: title.trim(),
                playerName: playerName.trim(),
                category: category.trim(),
                datePlaceholder: datePlaceholder.trim(),
                description: description.trim(),
                imagePath,
                imageTransform: mediaValue.transform,
                published,
              }
            : i,
        ),
      );
      showToast('Achievement Updated', `${title.trim()} saved.`);
    } else {
      const next: AdminAchievement = {
        id: `ach-${Date.now()}`,
        title: title.trim(),
        playerName: playerName.trim(),
        category: category.trim(),
        datePlaceholder: datePlaceholder.trim(),
        description: description.trim(),
        imagePath,
        imageTransform: mediaValue.transform,
        published,
      };
      setAchievements((prev) => [next, ...prev]);
      showToast('Achievement Added', `${next.title} created.`);
    }
    setFormOpen(false);
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Achievements Management"
        description="Manage verified player milestones, tournament honors, imagery, and public visibility."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Add Achievement</span>
          </Button>
        }
      />

      {items.length === 0 ? (
        <Card padding="md">
          <AdminEmptyState
            title="No achievements published yet"
            description="Verified tournament honors and player milestones added here appear cleanly on the public Achievements page."
            action={
              <Button type="button" variant="primary" size="sm" onClick={openAdd}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Add First Achievement</span>
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id} padding="sm" className="flex flex-col justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {item.imagePath && (
                  <MediaImage
                    src={item.imagePath}
                    alt={item.title}
                    transform={item.imageTransform}
                    className="h-32 w-full sm:w-40 shrink-0 rounded-[10px]"
                  />
                )}

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-semibold text-[#C8202B]">
                      {item.category}
                      {item.datePlaceholder ? ` · ${item.datePlaceholder}` : ''}
                    </span>
                    <AdminStatusBadge
                      label={item.published ? 'Published' : 'Hidden'}
                      variant={item.published ? 'success' : 'neutral'}
                    />
                  </div>
                  <h2 className="text-base font-bold text-[#071A36]">{item.title}</h2>
                  {item.playerName && (
                    <p className="text-xs font-semibold text-[#071A36]">
                      Recipient: <span className="text-[#64748B]">{item.playerName}</span>
                    </p>
                  )}
                  <p className="text-xs leading-relaxed text-[#64748B]">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-[#E2E8F0] pt-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  aria-label={`Delete ${item.title}`}
                  className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#C8202B]/30 px-2.5 text-[11px] font-semibold text-[#C8202B] hover:bg-[#C8202B]/5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setAchievements((prev) =>
                        prev.map((i) =>
                          i.id === item.id ? { ...i, published: !i.published } : i,
                        ),
                      )
                    }
                  >
                    {item.published ? (
                      <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    <span>{item.published ? 'Hide' : 'Publish'}</span>
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => openEdit(item)}>
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Edit</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AdminModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Achievement' : 'Add Achievement'}
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <ImageManager
            label="Achievement Photo (Optional)"
            value={mediaValue}
            onChange={setMediaValue}
            aspectRatio="4/3"
            presetAssets={ADMIN_IMAGE_ASSETS.map((a) => ({ label: a.label, src: a.path }))}
            storageFolder="achievements"
          />
          <Input
            label="Achievement Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="Player / Squad Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <Input
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <Input
              label="Date / Season"
              value={datePlaceholder}
              onChange={(e) => setDatePlaceholder(e.target.value)}
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

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          setAchievements((prev) => prev.filter((i) => i.id !== deleteTarget.id));
          showToast('Achievement Removed', `${deleteTarget.title} deleted.`, 'warning');
        }}
        title="Remove Achievement"
        message={`Delete "${deleteTarget?.title ?? ''}"?`}
        confirmLabel="Delete"
        tone="danger"
      />
    </div>
  );
}
