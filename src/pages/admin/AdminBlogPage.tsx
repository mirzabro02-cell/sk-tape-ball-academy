import { useState, type FormEvent } from 'react';
import { Bold, Heading2, List, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { ADMIN_IMAGE_ASSETS } from '@/src/assets/branding';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminBlogPost, BlogPostStatus } from '@/src/types/admin';
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
import { Select } from '@/src/components/ui/Select';
import { Textarea } from '@/src/components/ui/Textarea';

function slugifyTitle(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function AdminBlogPage() {
  useDocumentTitle('Blog & Updates Management');
  const { showToast } = useAdminToast();
  const { state, setBlogPosts } = useAcademyState();

  const posts = state.blogPosts;
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminBlogPost | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Academy Updates');
  const [tagsText, setTagsText] = useState('');
  const [coverMedia, setCoverMedia] = useState<ManagedMediaValue>(createManagedMedia(null));
  const [bodyText, setBodyText] = useState('');
  const [status, setStatus] = useState<BlogPostStatus>('Draft');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  function openCreate() {
    setEditing(null);
    setTitle('');
    setSlug('');
    setCategory('Academy Updates');
    setTagsText('Tape Ball, Coaching');
    setCoverMedia(createManagedMedia(null));
    setBodyText('');
    setStatus('Draft');
    setSeoTitle('');
    setSeoDescription('');
    setFormOpen(true);
  }

  function openEdit(post: AdminBlogPost) {
    setEditing(post);
    setTitle(post.title);
    setSlug(post.slug);
    setCategory(post.category);
    setTagsText(post.tags.join(', '));
    setCoverMedia(createManagedMedia(post.featuredImage, post.imageTransform));
    setBodyText(post.bodyText);
    setStatus(post.status);
    setSeoTitle(post.seoTitle);
    setSeoDescription(post.seoDescription);
    setFormOpen(true);
  }

  function insertFormattingToken(token: string) {
    setBodyText((prev) => (prev ? `${prev}\n${token}` : token));
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    const tags = tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editing) {
      setBlogPosts((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                title: title.trim(),
                slug: slug.trim(),
                category: category.trim(),
                tags,
                featuredImage: coverMedia.src || '',
                imageTransform: coverMedia.transform,
                bodyText,
                status,
                seoTitle,
                seoDescription,
                updatedLabel: 'Updated',
              }
            : p,
        ),
      );
      showToast('Article Updated', `"${title.trim()}" saved.`);
    } else {
      const next: AdminBlogPost = {
        id: `blog-${Date.now()}`,
        title: title.trim(),
        slug: slug.trim(),
        category: category.trim(),
        tags,
        featuredImage: coverMedia.src || '',
        imageTransform: coverMedia.transform,
        bodyText,
        status,
        seoTitle: seoTitle || `${title.trim()} | SK Tape Ball Academy`,
        seoDescription,
        updatedLabel: 'Drafted',
      };
      setBlogPosts((prev) => [next, ...prev]);
      showToast('Article Created', `"${next.title}" saved as ${status}.`);
    }
    setFormOpen(false);
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Blog & Updates Management"
        description="Write coaching notes and academy updates with featured imagery and safe structured text."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Create Article</span>
          </Button>
        }
      />

      {posts.length === 0 ? (
        <Card padding="md">
          <AdminEmptyState
            title="No articles drafted yet"
            description="Create academy announcements or tape ball technique notes here."
            action={
              <Button type="button" variant="primary" size="sm" onClick={openCreate}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Create First Article</span>
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <Card key={post.id} padding="sm" className="flex flex-col justify-between gap-4">
              <div className="space-y-3">
                {post.featuredImage && (
                  <MediaImage
                    src={post.featuredImage}
                    alt={post.title}
                    transform={post.imageTransform}
                    className="aspect-video w-full rounded-[10px]"
                  />
                )}

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold text-[#C8202B]">{post.category}</p>
                    <h2 className="text-base font-bold text-[#071A36]">{post.title}</h2>
                  </div>
                  <AdminStatusBadge
                    label={post.status}
                    variant={post.status === 'Published' ? 'success' : 'warning'}
                  />
                </div>

                <p className="text-xs leading-relaxed text-[#64748B] line-clamp-3">
                  {post.bodyText}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(post)}
                  aria-label={`Delete ${post.title}`}
                  className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#C8202B]/30 px-2.5 text-[11px] font-semibold text-[#C8202B] hover:bg-[#C8202B]/5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <Button type="button" variant="secondary" size="sm" onClick={() => openEdit(post)}>
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Edit</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AdminModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Article' : 'Create Article'}
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <ImageManager
            label="Featured Image (Optional)"
            value={coverMedia}
            onChange={setCoverMedia}
            aspectRatio="16/9"
            presetAssets={ADMIN_IMAGE_ASSETS.map((a) => ({ label: a.label, src: a.path }))}
            storageFolder="blog"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Article Title"
              value={title}
              onChange={(e) => {
                const nextTitle = e.target.value;
                setTitle(nextTitle);
                if (!editing) {
                  setSlug(slugifyTitle(nextTitle));
                }
              }}
              required
            />
            <Input
              label="URL Slug"
              value={slug}
              onChange={(e) => setSlug(slugifyTitle(e.target.value))}
              required
            />
            <Input
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as BlogPostStatus)}
              options={[
                { value: 'Draft', label: 'Draft' },
                { value: 'Published', label: 'Published' },
              ]}
            />
          </div>

          <Input
            label="Tags (Comma-separated)"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-[#071A36]">Article Body</span>
              <div className="inline-flex items-center gap-1 rounded-[8px] border border-[#E2E8F0] bg-[#F5F7FA] p-1">
                <button
                  type="button"
                  onClick={() => insertFormattingToken('## Section Heading')}
                  className="inline-flex items-center gap-1 rounded-[6px] px-2 py-1 text-[11px] font-semibold text-[#071A36] hover:bg-white cursor-pointer"
                >
                  <Heading2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Heading</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertFormattingToken('**Key Coaching Point**')}
                  className="inline-flex items-center gap-1 rounded-[6px] px-2 py-1 text-[11px] font-semibold text-[#071A36] hover:bg-white cursor-pointer"
                >
                  <Bold className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Bold</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertFormattingToken('- Key drill item')}
                  className="inline-flex items-center gap-1 rounded-[6px] px-2 py-1 text-[11px] font-semibold text-[#071A36] hover:bg-white cursor-pointer"
                >
                  <List className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Bullet</span>
                </button>
              </div>
            </div>
            <Textarea
              label=""
              aria-label="Article Body Content"
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editing ? 'Save Article' : 'Create Article'}
            </Button>
          </div>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          setBlogPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
          showToast('Article Removed', `${deleteTarget.title} deleted.`, 'warning');
        }}
        title="Delete Article"
        message={`Delete "${deleteTarget?.title ?? ''}"?`}
        confirmLabel="Delete"
        tone="danger"
      />
    </div>
  );
}
