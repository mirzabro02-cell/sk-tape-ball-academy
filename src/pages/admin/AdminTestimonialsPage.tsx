import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminTestimonial, ApprovalStatus } from '@/src/types/admin';
import {
  AdminConfirmDialog,
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

const APPROVAL_BADGE: Record<ApprovalStatus, 'success' | 'warning' | 'neutral'> = {
  Approved: 'success',
  'Pending Review': 'warning',
  Archived: 'neutral',
};

export function AdminTestimonialsPage() {
  useDocumentTitle('Testimonials Management');
  const { showToast } = useAdminToast();
  const { state, setTestimonials } = useAcademyState();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminTestimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminTestimonial | null>(null);

  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('Player / Guardian');
  const [content, setContent] = useState('');
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('Pending Review');
  const [published, setPublished] = useState(false);

  function openAdd() {
    setEditing(null);
    setAuthorName('');
    setAuthorRole('Player / Guardian');
    setContent('');
    setApprovalStatus('Approved');
    setPublished(true);
    setFormOpen(true);
  }

  function openEdit(t: AdminTestimonial) {
    setEditing(t);
    setAuthorName(t.authorName);
    setAuthorRole(t.authorRole);
    setContent(t.content);
    setApprovalStatus(t.approvalStatus);
    setPublished(t.published);
    setFormOpen(true);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!authorName.trim() || !content.trim()) return;

    if (editing) {
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === editing.id
            ? {
                ...t,
                authorName: authorName.trim(),
                authorRole: authorRole.trim(),
                content: content.trim(),
                approvalStatus,
                published,
              }
            : t,
        ),
      );
      showToast('Testimonial Updated', `${authorName.trim()} saved.`);
    } else {
      const next: AdminTestimonial = {
        id: `test-${Date.now()}`,
        authorName: authorName.trim(),
        authorRole: authorRole.trim(),
        content: content.trim(),
        approvalStatus,
        published,
      };
      setTestimonials((prev) => [next, ...prev]);
      showToast('Testimonial Added', `${next.authorName} added.`);
    }
    setFormOpen(false);
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Testimonials Management"
        description="Manage verified player and parent reviews. The public testimonials section displays automatically once approved reviews are published."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Add Testimonial</span>
          </Button>
        }
      />

      {state.testimonials.length === 0 ? (
        <Card padding="md">
          <AdminEmptyState
            title="No testimonials added yet"
            description="Only verified, approved parent and player quotes added here appear on the public homepage."
            action={
              <Button type="button" variant="primary" size="sm" onClick={openAdd}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Add Verified Testimonial</span>
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:items-start">
          {state.testimonials.map((t) => (
            <Card key={t.id} padding="md" className="flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-[#071A36]">{t.authorName}</h2>
                    <p className="text-xs text-[#64748B]">{t.authorRole}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AdminStatusBadge
                      label={t.approvalStatus}
                      variant={APPROVAL_BADGE[t.approvalStatus]}
                    />
                    <AdminStatusBadge
                      label={t.published ? 'Published' : 'Hidden'}
                      variant={t.published ? 'navy' : 'neutral'}
                    />
                  </div>
                </div>
                <blockquote className="text-xs leading-relaxed text-[#071A36]">
                  &ldquo;{t.content}&rdquo;
                </blockquote>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] pt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTestimonials((prev) =>
                      prev.map((item) =>
                        item.id === t.id ? { ...item, published: !item.published } : item,
                      ),
                    );
                    showToast(
                      t.published ? 'Testimonial Hidden' : 'Testimonial Published',
                      `${t.authorName} visibility updated.`,
                      'info',
                    );
                  }}
                >
                  {t.published ? (
                    <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>{t.published ? 'Unpublish' : 'Publish'}</span>
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => openEdit(t)}>
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Edit</span>
                </Button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(t)}
                  aria-label={`Delete testimonial from ${t.authorName}`}
                  className="inline-flex h-9 items-center justify-center rounded-[10px] border border-[#C8202B]/30 px-3 text-xs text-[#C8202B] hover:bg-[#C8202B]/5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AdminModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Testimonial' : 'Add Testimonial'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Student / Guardian Name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
            <Input
              label="Role / Relationship"
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              required
            />
          </div>
          <Textarea
            label="Testimonial Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <Select
            label="Approval Status"
            value={approvalStatus}
            onChange={(e) => setApprovalStatus(e.target.value as ApprovalStatus)}
            options={[
              { value: 'Approved', label: 'Approved' },
              { value: 'Pending Review', label: 'Pending Review' },
              { value: 'Archived', label: 'Archived' },
            ]}
          />
          <label className="inline-flex items-center gap-2.5 text-sm text-[#071A36] cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 accent-[#071A36]"
            />
            <span>Published on public homepage</span>
          </label>
          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editing ? 'Save Testimonial' : 'Add Testimonial'}
            </Button>
          </div>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          setTestimonials((prev) => prev.filter((item) => item.id !== deleteTarget.id));
          showToast('Testimonial Deleted', 'Entry removed.', 'warning');
        }}
        title="Delete Testimonial"
        message={`Delete testimonial from ${deleteTarget?.authorName ?? ''}?`}
        confirmLabel="Delete"
        tone="danger"
      />
    </div>
  );
}
