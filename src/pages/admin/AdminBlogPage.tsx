import { useState, type FormEvent } from 'react';
import { Bold, Heading2, List, Pencil, Plus } from 'lucide-react';
import {
  ADMIN_IMAGE_ASSETS,
  INITIAL_ADMIN_BLOG_POSTS,
} from '@/src/data/adminMockData';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminBlogPost, BlogPostStatus } from '@/src/types/admin';
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

function slugifyTitle(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function AdminBlogPage() {
  useDocumentTitle('Blog Management');
  const { showToast } = useAdminToast();

  const [posts, setPosts] = useState<AdminBlogPost[]>(INITIAL_ADMIN_BLOG_POSTS);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBlogPost | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Bowling Technique');
  const [tagsText, setTagsText] = useState('');
  const [featuredImage, setFeaturedImage] = useState(ADMIN_IMAGE_ASSETS[0].path);
  const [bodyText, setBodyText] = useState('');
  const [status, setStatus] = useState<BlogPostStatus>('Draft');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  function openCreate() {
    setEditing(null);
    setTitle('');
    setSlug('');
    setCategory('Bowling Technique');
    setTagsText('Tape Ball, Coaching');
    setFeaturedImage(ADMIN_IMAGE_ASSETS[0].path);
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
    setFeaturedImage(post.featuredImage);
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
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                title,
                slug,
                category,
                tags,
                featuredImage,
                bodyText,
                status,
                seoTitle,
                seoDescription,
                updatedLabel: 'Session Updated',
              }
            : p,
        ),
      );
      showToast('Blog Post Updated (Preview)', `"${title}" saved in demonstration state.`);
    } else {
      const next: AdminBlogPost = {
        id: `blog-${Date.now()}`,
        title,
        slug,
        category,
        tags,
        featuredImage,
        bodyText,
        status,
        seoTitle: seoTitle || `${title} | SK Tape Ball Academy`,
        seoDescription,
        updatedLabel: 'Session Draft',
      };
      setPosts((prev) => [next, ...prev]);
      showToast('Blog Post Created (Preview)', `"${title}" created as ${status}.`);
    }
    setFormOpen(false);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog & Editorial Management"
        description="Draft coaching articles, manage URL slugs, featured visuals, categories, and SEO metadata."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Create Post</span>
          </Button>
        }
      />

      <AdminDemoNotice text="Article content uses safe structured text blocks without raw HTML injection or unsafe script execution." />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.id} padding="sm" className="flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="aspect-video w-full overflow-hidden rounded-[10px] bg-[#071A36]">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold text-[#C8202B]">{post.category}</p>
                  <h2 className="text-base font-bold text-[#071A36]">{post.title}</h2>
                  <p className="font-mono text-[11px] text-[#64748B]">/blog/{post.slug}</p>
                </div>
                <AdminStatusBadge
                  label={post.status}
                  variant={post.status === 'Published' ? 'success' : 'warning'}
                />
              </div>

              <p className="text-xs leading-relaxed text-[#64748B] line-clamp-3">
                {post.bodyText}
              </p>

              <p className="text-[11px] font-medium text-[#64748B]">
                Tags: {post.tags.join(' · ') || 'None'}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3">
              <span className="text-[11px] text-[#64748B]">{post.updatedLabel}</span>
              <Button type="button" variant="secondary" size="sm" onClick={() => openEdit(post)}>
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Edit Post</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AdminModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Blog Post' : 'Create Blog Post'}
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Post Title"
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
            <Input
              label="Tags (Comma-separated)"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
            />
            <Select
              label="Featured Image"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              options={ADMIN_IMAGE_ASSETS.map((a) => ({ value: a.path, label: a.label }))}
            />
            <Select
              label="Publication Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as BlogPostStatus)}
              options={[
                { value: 'Draft', label: 'Draft' },
                { value: 'Published', label: 'Published' },
              ]}
            />
          </div>

          {/* Safe Structured Text Toolbar */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium text-[#071A36]">
                Article Content (Safe Structured Editor)
              </span>
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
                  onClick={() => insertFormattingToken('**Key Coaching Cue**')}
                  className="inline-flex items-center gap-1 rounded-[6px] px-2 py-1 text-[11px] font-semibold text-[#071A36] hover:bg-white cursor-pointer"
                >
                  <Bold className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Bold</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertFormattingToken('- Drill checklist item')}
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
              placeholder="Write structured coaching insights..."
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-[#E2E8F0] pt-4">
            <Input
              label="SEO Title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Search title..."
            />
            <Input
              label="SEO Meta Description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Concise search summary..."
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editing ? 'Save Post' : 'Create Post'}
            </Button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
