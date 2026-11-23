import { useMemo, useState, type FormEvent } from 'react';
import { Eye, Pencil, Plus, Search } from 'lucide-react';
import { INITIAL_ADMIN_COACHES } from '@/src/data/adminMockData';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminCoach, CoachStatus } from '@/src/types/admin';
import {
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

const STATUS_BADGE: Record<CoachStatus, 'success' | 'warning' | 'neutral'> = {
  Active: 'success',
  'Part-Time': 'warning',
  'On Leave': 'neutral',
};

export function AdminCoachesPage() {
  useDocumentTitle('Coach Management');
  const { showToast } = useAdminToast();

  const [coaches, setCoaches] = useState<AdminCoach[]>(INITIAL_ADMIN_COACHES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | CoachStatus>('All');

  const [formOpen, setFormOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState<AdminCoach | null>(null);
  const [viewCoach, setViewCoach] = useState<AdminCoach | null>(null);

  const [fullName, setFullName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [specialtiesText, setSpecialtiesText] = useState('');
  const [programsText, setProgramsText] = useState('');
  const [status, setStatus] = useState<CoachStatus>('Active');
  const [bio, setBio] = useState('');
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
    setSpecialtiesText('Batting Mechanics, Powerplay Strategy');
    setProgramsText('Batting');
    setStatus('Active');
    setBio('');
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(coach: AdminCoach) {
    setEditingCoach(coach);
    setFullName(coach.fullName);
    setRoleTitle(coach.roleTitle);
    setSpecialtiesText(coach.specialties.join(', '));
    setProgramsText(coach.assignedPrograms.join(', '));
    setStatus(coach.status);
    setBio(coach.bio);
    setFormError(null);
    setFormOpen(true);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fullName.trim() || !roleTitle.trim()) {
      setFormError('Coach name and role title are required.');
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
            ? { ...c, fullName, roleTitle, specialties, assignedPrograms, status, bio }
            : c,
        ),
      );
      showToast('Coach Updated (Frontend Preview)', `${fullName} updated in session state.`);
    } else {
      const newCoach: AdminCoach = {
        id: `coach-${Date.now()}`,
        fullName,
        roleTitle,
        specialties,
        assignedPrograms,
        status,
        experienceLabel: 'Profile Details Pending Confirmation',
        avatarLabel: fullName.slice(0, 2).toUpperCase(),
        bio: bio || 'Placeholder coaching bio.',
      };
      setCoaches((prev) => [newCoach, ...prev]);
      showToast('Coach Added (Frontend Preview)', `${fullName} added to demonstration staff list.`);
    }

    setFormOpen(false);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Coach Management"
        description="Manage coaching staff placeholders, specialties, assigned training tracks, and availability."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Add Coach</span>
          </Button>
        }
      />

      <AdminDemoNotice />

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
              className="h-11 w-full rounded-[10px] border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm text-[#071A36]"
            />
          </div>
          <div className="sm:col-span-4">
            <select
              aria-label="Filter coaches by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'All' | CoachStatus)}
              className="h-11 w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 text-sm text-[#071A36]"
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
            title="No coach profiles match"
            description="Adjust your search filter or add a new coach profile placeholder."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCoaches.map((coach) => (
              <div
                key={coach.id}
                className="rounded-[14px] border border-[#E2E8F0] bg-[#F5F7FA]/60 p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#071A36] text-sm font-extrabold text-[#D9A52E]">
                        {coach.avatarLabel}
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-[#071A36]">{coach.fullName}</h2>
                        <p className="text-xs text-[#64748B]">{coach.roleTitle}</p>
                      </div>
                    </div>
                    <AdminStatusBadge label={coach.status} variant={STATUS_BADGE[coach.status]} />
                  </div>

                  <p className="text-xs leading-relaxed text-[#64748B]">{coach.bio}</p>

                  <div className="space-y-1 text-xs">
                    <p className="font-semibold text-[#071A36]">
                      Specialties:{' '}
                      <span className="font-normal text-[#64748B]">
                        {coach.specialties.join(' · ')}
                      </span>
                    </p>
                    <p className="font-semibold text-[#071A36]">
                      Assigned Programs:{' '}
                      <span className="font-normal text-[#64748B]">
                        {coach.assignedPrograms.join(' · ')}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setViewCoach(coach)}
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Profile</span>
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
            ))}
          </div>
        )}
      </Card>

      <AdminModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingCoach ? 'Edit Coach Profile' : 'Add Coach Profile'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Coach Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Coach Profile Placeholder"
              required
            />
            <Input
              label="Role Title"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Fast Bowling Specialist"
              required
            />
            <Input
              label="Coaching Specialties (Comma-separated)"
              value={specialtiesText}
              onChange={(e) => setSpecialtiesText(e.target.value)}
            />
            <Input
              label="Assigned Programs (Comma-separated)"
              value={programsText}
              onChange={(e) => setProgramsText(e.target.value)}
            />
          </div>

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

          <Textarea
            label="Profile Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Coaching background and drill methodology..."
          />

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
              <div className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-[14px] bg-[#071A36] text-lg font-extrabold text-[#D9A52E]">
                {viewCoach.avatarLabel}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-[#64748B]">
                  Profile Image Placeholder · {viewCoach.experienceLabel}
                </p>
                <AdminStatusBadge label={viewCoach.status} variant={STATUS_BADGE[viewCoach.status]} />
              </div>
            </div>
            <p className="leading-relaxed text-[#64748B]">{viewCoach.bio}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 border-t border-[#E2E8F0] pt-4 text-xs">
              <div>
                <p className="font-bold uppercase tracking-wider text-[#071A36]">Specialties</p>
                <p className="mt-1 text-[#64748B]">{viewCoach.specialties.join(', ')}</p>
              </div>
              <div>
                <p className="font-bold uppercase tracking-wider text-[#071A36]">
                  Assigned Programs
                </p>
                <p className="mt-1 text-[#64748B]">{viewCoach.assignedPrograms.join(', ')}</p>
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
