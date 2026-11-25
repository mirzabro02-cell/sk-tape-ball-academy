import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Pencil, Plus } from 'lucide-react';
import { INITIAL_ADMIN_TESTIMONIALS } from '@/src/data/adminMockData';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminTestimonial, ApprovalStatus } from '@/src/types/admin';
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

const APPROVAL_BADGE: Record<ApprovalStatus, 'success' | 'warning' | 'neutral'> = {
  Approved: 'success',
  'Pending Review': 'warning',
  Archived: 'neutral',
};

export function AdminTestimonialsPage() {
  useDocumentTitle('Testimonials Management');
  const { showToast } = useAdminToast();

  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>(
    INITIAL_ADMIN_TESTIMONIALS,
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminTestimonial | null>(null);

  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('Guardian / Parent (Placeholder)');
  const [content, setContent] = useState('');
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('Pending Review');
  const [published, setPublished] = useState(false);

  function openAdd() {
    setEditing(null);
    setAuthorName('');
    setAuthorRole('Guardian / Parent (Placeholder)');
    setContent('');
    setApprovalStatus('Pending Review');
    setPublished(false);
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
            ? { ...t, authorName, authorRole, content, approvalStatus, published }
            : t,
        ),
      );
      showToast('Testimonial Updated (Preview)', `${authorName} updated in session state.`);
    } else {
      const next: AdminTestimonial = {
        id: `test-${Date.now()}`,
        authorName,
        authorRole,
        content,
        approvalStatus,
        published,
      };
      setTestimonials((prev) => [next, ...prev]);
      showToast('Testimonial Added (Preview)', `${authorName} added to demonstration list.`);
    }
    setFormOpen(false);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Testimonials Management"
        description="Review guardian and player testimonials, verify approval status, and control website publication."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Add Testimonial</span>
          </Button>
        }
      />

      <AdminDemoNotice />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {testimonials.map((t) => (
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
                    t.published ? 'Testimonial Unpublished (Preview)' : 'Testimonial Published (Preview)',
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
            </div>
          </Card>
        ))}
      </div>

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
    </div>
  );
}
