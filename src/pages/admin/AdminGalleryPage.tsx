import { useMemo, useState, type FormEvent } from 'react';
import { Eye, EyeOff, Film, Image as ImageIcon, Pencil, Trash2, Upload } from 'lucide-react';
import { ADMIN_IMAGE_ASSETS, INITIAL_ADMIN_MEDIA } from '@/src/data/adminMockData';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminMediaItem } from '@/src/types/admin';
import {
  AdminConfirmDialog,
  AdminDemoNotice,
  AdminEmptyState,
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

const CATEGORIES: AdminMediaItem['category'][] = [
  'Training Drills',
  'Match Highlights',
  'Bowling Clinic',
  'Campus & Ground',
];

export function AdminGalleryPage() {
  useDocumentTitle('Gallery Management');
  const { showToast } = useAdminToast();

  const [media, setMedia] = useState<AdminMediaItem[]>(INITIAL_ADMIN_MEDIA);
  const [mediaTypeTab, setMediaTypeTab] = useState<'all' | 'image' | 'video'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminMediaItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminMediaItem | null>(null);

  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AdminMediaItem['category']>('Training Drills');
  const [caption, setCaption] = useState('');
  const [assetPath, setAssetPath] = useState(ADMIN_IMAGE_ASSETS[0].path);
  const [published, setPublished] = useState(true);

  const filtered = useMemo(() => {
    return media.filter((item) => {
      const matchesType = mediaTypeTab === 'all' || item.mediaType === mediaTypeTab;
      const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
      return matchesType && matchesCat;
    });
  }, [media, mediaTypeTab, categoryFilter]);

  function openUpload() {
    setEditing(null);
    setMediaType('image');
    setTitle('');
    setCategory('Training Drills');
    setCaption('');
    setAssetPath(ADMIN_IMAGE_ASSETS[0].path);
    setPublished(true);
    setFormOpen(true);
  }

  function openEdit(item: AdminMediaItem) {
    setEditing(item);
    setMediaType(item.mediaType);
    setTitle(item.title);
    setCategory(item.category);
    setCaption(item.caption);
    setAssetPath(item.assetPath);
    setPublished(item.published);
    setFormOpen(true);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;

    if (editing) {
      setMedia((prev) =>
        prev.map((m) =>
          m.id === editing.id
            ? { ...m, mediaType, title, category, caption, assetPath, published }
            : m,
        ),
      );
      showToast('Media Info Updated (Preview)', `${title} updated in demonstration gallery.`);
    } else {
      const next: AdminMediaItem = {
        id: `med-${Date.now()}`,
        mediaType,
        title,
        category,
        caption,
        assetPath,
        published,
        uploadedLabel: 'Session Upload Placeholder',
      };
      setMedia((prev) => [next, ...prev]);
      showToast('Media Item Added (Preview)', `${title} queued in frontend gallery preview.`);
    }
    setFormOpen(false);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gallery & Media Management"
        description="Manage photo and video assets, categories, captions, and publish controls."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={openUpload}>
            <Upload className="h-4 w-4" aria-hidden="true" />
            <span>Upload Media (UI)</span>
          </Button>
        }
      />

      <AdminDemoNotice text="Media uploads here simulate metadata and asset previews in local state. Cloud object storage will connect in a later backend phase." />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-[10px] border border-[#E2E8F0] bg-white p-1 gap-1">
          {(
            [
              { id: 'all', label: 'All Media' },
              { id: 'image', label: 'Image Gallery' },
              { id: 'video', label: 'Video Gallery' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMediaTypeTab(tab.id)}
              className={`rounded-[8px] px-3 py-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap ${
                mediaTypeTab === tab.id
                  ? 'bg-[#071A36] text-white'
                  : 'text-[#64748B] hover:text-[#071A36]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          aria-label="Filter media by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 rounded-[10px] border border-[#E2E8F0] bg-white px-3 text-xs font-medium text-[#071A36]"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card padding="md">
          <AdminEmptyState
            title="No media items match"
            description="Switch tabs or upload a demonstration media entry."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <Card key={item.id} padding="sm" className="flex flex-col justify-between gap-3">
              <div className="space-y-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-[10px] bg-[#071A36]">
                  <img
                    src={item.assetPath}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#64748B]">
                      {item.mediaType === 'video' ? (
                        <Film className="h-3.5 w-3.5 text-[#C8202B]" aria-hidden="true" />
                      ) : (
                        <ImageIcon className="h-3.5 w-3.5 text-[#D9A52E]" aria-hidden="true" />
                      )}
                      <span>
                        {item.category} · {item.mediaType.toUpperCase()}
                      </span>
                    </p>
                    <h2 className="text-sm font-bold text-[#071A36]">{item.title}</h2>
                  </div>
                  <AdminStatusBadge
                    label={item.published ? 'Published' : 'Unpublished'}
                    variant={item.published ? 'success' : 'neutral'}
                  />
                </div>

                <p className="text-xs text-[#64748B]">{item.caption}</p>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-[#E2E8F0] pt-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  aria-label={`Delete ${item.title}`}
                  className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#C8202B]/30 px-2.5 text-[11px] font-semibold text-[#C8202B] hover:bg-[#C8202B]/5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Delete</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMedia((prev) =>
                        prev.map((m) =>
                          m.id === item.id ? { ...m, published: !m.published } : m,
                        ),
                      );
                      showToast(
                        item.published ? 'Media Hidden (Preview)' : 'Media Published (Preview)',
                        `${item.title} visibility updated.`,
                        'info',
                      );
                    }}
                  >
                    {item.published ? (
                      <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    <span>{item.published ? 'Unpublish' : 'Publish'}</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => openEdit(item)}
                  >
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
        title={editing ? 'Edit Media Information' : 'Upload Media (Frontend UI)'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Media Type"
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}
              options={[
                { value: 'image', label: 'Image Asset' },
                { value: 'video', label: 'Video Clip Placeholder' },
              ]}
            />
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as AdminMediaItem['category'])}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />
          </div>
          <Input
            label="Media Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Select
            label="Select Preview Asset"
            value={assetPath}
            onChange={(e) => setAssetPath(e.target.value)}
            options={ADMIN_IMAGE_ASSETS.map((a) => ({ value: a.path, label: a.label }))}
          />
          <Textarea
            label="Caption / Description"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <label className="inline-flex items-center gap-2.5 text-sm text-[#071A36] cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 accent-[#071A36]"
            />
            <span>Published on public Gallery page</span>
          </label>
          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editing ? 'Save Media Info' : 'Add to Gallery'}
            </Button>
          </div>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          setMedia((prev) => prev.filter((m) => m.id !== deleteTarget.id));
          showToast(
            'Media Deleted (Session Only)',
            `${deleteTarget.title} removed from demonstration list.`,
            'warning',
          );
        }}
        title="Delete Media Item"
        message={`Remove "${deleteTarget?.title ?? ''}" from the demonstration gallery list?`}
        confirmLabel="Delete Media"
        tone="danger"
      />
    </div>
  );
}
