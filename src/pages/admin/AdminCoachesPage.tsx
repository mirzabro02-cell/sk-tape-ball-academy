import { useMemo, useState, type FormEvent } from 'react';
import { Eye, EyeOff, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminCoach, CoachStatus } from '@/src/types/admin';
import { createManagedMedia, type ManagedMediaValue } from '@/src/types/media';
import { containsUnsafeHtml } from '@/src/utils/validation';
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

const STATUS_BADGE: Record<CoachStatus, 'success' | 'warning' | 'neutral'> = {
  Active: 'success',
  'Part-Time': 'warning',
  'On Leave': 'neutral',
};

function slugifyCoach(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function AdminCoachesPage() {
  useDocumentTitle('Coach Management');
  const { showToast } = useAdminToast();
  const { state, setCoaches } = useAcademyState();

  const coaches = state.coaches;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | CoachStatus>('All');

  const [formOpen, setFormOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<AdminCoach | null>(null);
  const [viewCoach, setViewCoach] = useState<AdminCoach | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCoach | null>(null);

  const [fullName, setFullName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [experienceLabel, setExperienceLabel] = useState('');
  const [specialtiesText, setSpecialtiesText] = useState('');
  const [programsText, setProgramsText] = useState('');
  const [status, setStatus] = useState<CoachStatus>('Active');
  const [published, setPublished] = useState(true);
  const [bio, setBio] = useState('');
  const [portraitMedia, setPortraitMedia] = useState<ManagedMediaValue>(createManagedMedia(null));
  const [formError, setFormError] = useState<string | null>(null);

  const filteredCoaches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return coaches.filter((c) => {
      const matchesQ =
        !q ||
        c.fullName.toLowerCase().includes(q) ||
        c.roleTitle.toLowerCase().includes(q) ||
        c.specialties.some((s) => s.toLowerCase().includes(q));
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesQ && matchesStatus;
    });
  }, [coaches, searchQuery, statusFilter]);

  function openAdd() {
    setEditingCoach(null);
    setFullName('');
    setRoleTitle('');
    setExperienceLabel('');
    setSpecialtiesText('');
    setProgramsText('');
    setStatus('Active');
    setPublished(true);
    setBio('');
    setPortraitMedia(createManagedMedia(null));
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(coach: AdminCoach) {
    setEditingCoach(coach);
    setFullName(coach.fullName);
    setRoleTitle(coach.roleTitle);
    setExperienceLabel(coach.experienceLabel);
    setSpecialtiesText(coach.specialties.join(', '));
    setProgramsText(coach.assignedPrograms.join(', '));
    setStatus(coach.status);
    setPublished(coach.published ?? true);
    setBio(coach.bio);
    setPortraitMedia(createManagedMedia(coach.imageSrc, coach.imageTransform));
    setFormError(null);
    setFormOpen(true);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fullName.trim() || !roleTitle.trim()) {
      setFormError('Coach full name and role title are required.');
      return;
    }

    if (
      containsUnsafeHtml([fullName, roleTitle, experienceLabel, specialtiesText, programsText, bio])
    ) {
      setFormError('HTML tags (< or >) are not permitted.');
      return;
    }

    const specialties = specialtiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const assignedPrograms = programsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingCoach) {
      setCoaches((prev) =>
        prev.map((c) =>
          c.id === editingCoach.id
            ? {
                ...c,
                fullName: fullName.trim(),
                slug: c.slug || slugifyCoach(fullName) || c.id,
                roleTitle: roleTitle.trim(),
                experienceLabel: experienceLabel.trim(),
                specialties,
                assignedPrograms,
                status,
                published,
                bio: bio.trim(),
                imageSrc: portraitMedia.src,
                imageTransform: portraitMedia.transform,
              }
            : c,
        ),
      );
      showToast('Coach Updated', `${fullName.trim()} saved.`);
    } else {
      const id = `coach-${Date.now()}`;
      const newCoach: AdminCoach = {
        id,
        slug: slugifyCoach(fullName) || id,
        fullName: fullName.trim(),
        roleTitle: roleTitle.trim(),
        specialties,
        assignedPrograms,
        status,
        published,
        experienceLabel: experienceLabel.trim(),
        avatarLabel: fullName
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase() ?? '')
          .join(''),
        bio: bio.trim(),
        imageSrc: portraitMedia.src,
        imageTransform: portraitMedia.transform,
      };
      setCoaches((prev) => [newCoach, ...prev]);
      showToast('Coach Added', `${newCoach.fullName} added to coaching staff.`);
    }

    setFormOpen(false);
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Coach Management"
        description="Add and publish verified academy coaches, portraits, specialties, and program assignments."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Add Coach</span>
          </Button>
        }
      />

      <Card padding="md" className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          <div className="sm:col-span-8 relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search coaches by name, role, or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm text-[#071A36]"
            />
          </div>
          <div className="sm:col-span-4">
            <select
              aria-label="Filter coaches by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'All' | CoachStatus)}
              className="h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 text-sm text-[#071A36]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Part-Time">Part-Time</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        {filteredCoaches.length === 0 ? (
          <AdminEmptyState
            title={coaches.length === 0 ? 'No coaches added yet' : 'No coaches match filter'}
            description={
              coaches.length === 0
                ? 'Verified coaching profiles appear on the public Coaches page once added and published here.'
                : 'Try adjusting your search text or status filter.'
            }
            action={
              coaches.length === 0 ? (
                <Button type="button" variant="primary" size="sm" onClick={openAdd}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>Add First Coach</span>
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 items-start">
            {filteredCoaches.map((coach) => (
              <div
                key={coach.id}
                className="rounded-[14px] border border-[#E2E8F0] bg-[#F5F7FA]/60 p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {coach.imageSrc ? (
                        <MediaImage
                          src={coach.imageSrc}
                          alt={coach.fullName}
                          transform={coach.imageTransform}
                          className="h-12 w-12 shrink-0 rounded-[12px] border border-[#E2E8F0]"
                        />
                      ) : (
                        <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#071A36] text-sm font-extrabold text-[#D9A52E]">
                          {coach.avatarLabel || coach.fullName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h2 className="text-sm font-bold text-[#071A36]">{coach.fullName}</h2>
                        <p className="text-xs text-[#64748B]">{coach.roleTitle}</p>
                      </div>
                    </div>
                    <AdminStatusBadge label={coach.status} variant={STATUS_BADGE[coach.status]} />
                  </div>

                  {coach.bio && (
                    <p className="text-xs leading-relaxed text-[#64748B] line-clamp-3">
                      {coach.bio}
                    </p>
                  )}

                  {coach.specialties.length > 0 && (
                    <p className="text-xs font-semibold text-[#071A36]">
                      Specialties:{' '}
                      <span className="font-normal text-[#64748B]">
                        {coach.specialties.join(' · ')}
                      </span>
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F0] pt-3">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(coach)}
                    aria-label={`Delete ${coach.fullName}`}
                    className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#C8202B]/30 px-2.5 text-[11px] font-semibold text-[#C8202B] hover:bg-[#C8202B]/5 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCoaches((prev) =>
                          prev.map((c) =>
                            c.id === coach.id
                              ? { ...c, published: !(c.published ?? true) }
                              : c,
                          ),
                        );
                      }}
                    >
                      {coach.published ?? true ? (
                        <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>{coach.published ?? true ? 'Hide' : 'Publish'}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setViewCoach(coach)}
                    >
                      <span>View</span>
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => openEdit(coach)}
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Edit</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <AdminModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingCoach ? 'Edit Coach Profile' : 'Add Coach Profile'}
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <ImageManager
            label="Coach Portrait"
            value={portraitMedia}
            onChange={setPortraitMedia}
            aspectRatio="square"
            helperText="Upload a coach photo or paste an image URL, then adjust framing if needed."
            storageFolder="coaches"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Verified coach name"
              required
            />
            <Input
              label="Role Title"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Batting Coach"
              required
            />
            <Input
              label="Experience / Credentials"
              value={experienceLabel}
              onChange={(e) => setExperienceLabel(e.target.value)}
              placeholder="Optional verified summary"
            />
            <Select
              label="Coach Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as CoachStatus)}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Part-Time', label: 'Part-Time' },
                { value: 'On Leave', label: 'On Leave' },
              ]}
            />
            <Input
              label="Coaching Specialties (Comma-separated)"
              value={specialtiesText}
              onChange={(e) => setSpecialtiesText(e.target.value)}
              placeholder="e.g. Batting Technique, Powerplay Hitting"
            />
            <Input
              label="Assigned Programs (Comma-separated)"
              value={programsText}
              onChange={(e) => setProgramsText(e.target.value)}
              placeholder="e.g. Batting, Advanced"
            />
          </div>

          <Textarea
            label="Coach Biography"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Verified coaching background and focus areas..."
          />

          <label className="inline-flex items-center gap-2.5 text-sm text-[#071A36] cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 accent-[#071A36]"
            />
            <span>Publish on public Coaches directory</span>
          </label>

          {formError && <p className="text-xs font-semibold text-[#C8202B]">{formError}</p>}

          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingCoach ? 'Save Changes' : 'Add Coach'}
            </Button>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        open={Boolean(viewCoach)}
        onClose={() => setViewCoach(null)}
        title={viewCoach?.fullName ?? 'Coach Details'}
        subtitle={viewCoach?.roleTitle}
      >
        {viewCoach && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-4 rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4">
              {viewCoach.imageSrc ? (
                <MediaImage
                  src={viewCoach.imageSrc}
                  alt={viewCoach.fullName}
                  transform={viewCoach.imageTransform}
                  className="h-16 w-16 shrink-0 rounded-[14px]"
                />
              ) : (
                <div className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] bg-[#071A36] text-lg font-extrabold text-[#D9A52E]">
                  {viewCoach.avatarLabel}
                </div>
              )}
              <div className="space-y-1">
                {viewCoach.experienceLabel && (
                  <p className="text-xs font-semibold text-[#64748B]">
                    {viewCoach.experienceLabel}
                  </p>
                )}
                <AdminStatusBadge label={viewCoach.status} variant={STATUS_BADGE[viewCoach.status]} />
              </div>
            </div>
            {viewCoach.bio && <p className="leading-relaxed text-[#64748B]">{viewCoach.bio}</p>}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 border-t border-[#E2E8F0] pt-4 text-xs">
              <div>
                <p className="font-bold uppercase tracking-wider text-[#071A36]">Specialties</p>
                <p className="mt-1 text-[#64748B]">
                  {viewCoach.specialties.join(', ') || 'None specified'}
                </p>
              </div>
              <div>
                <p className="font-bold uppercase tracking-wider text-[#071A36]">
                  Assigned Programs
                </p>
                <p className="mt-1 text-[#64748B]">
                  {viewCoach.assignedPrograms.join(', ') || 'None specified'}
                </p>
              </div>
            </div>
          </div>
        )}
      </AdminModal>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          setCoaches((prev) => prev.filter((c) => c.id !== deleteTarget.id));
          showToast('Coach Removed', `${deleteTarget.fullName} removed.`, 'warning');
        }}
        title="Remove Coach Profile"
        message={`Remove ${deleteTarget?.fullName ?? 'this coach'} from the coaching roster?`}
        confirmLabel="Remove"
        tone="danger"
      />
    </div>
  );
}
