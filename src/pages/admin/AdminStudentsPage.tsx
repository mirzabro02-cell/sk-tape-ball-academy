import { useMemo, useState, type FormEvent } from 'react';
import { Eye, Layers, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminStudent, StudentStatus } from '@/src/types/admin';
import {
  AdminConfirmDialog,
  AdminEmptyState,
  AdminModal,
  AdminPageHeader,
  AdminPagination,
  AdminStatusBadge,
} from '@/src/components/admin/AdminPrimitives';
import { useAdminToast } from '@/src/components/admin/AdminToastContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { Textarea } from '@/src/components/ui/Textarea';

const STATUS_BADGE_MAP: Record<StudentStatus, 'success' | 'danger' | 'neutral'> = {
  Active: 'success',
  'On Hold': 'neutral',
  Inactive: 'danger',
};

export function AdminStudentsPage() {
  useDocumentTitle('Student Management');
  const { showToast } = useAdminToast();
  const { state, saveStudent, removeStudent } = useAcademyState();

  const programOptions = useMemo(() => {
    const titles = state.programs.map((p) => p.title);
    return titles.length > 0
      ? titles
      : ['Athletic Fitness & Conditioning', 'Tape Ball Batting', 'Tape Ball Bowling', 'Fielding & Catching'];
  }, [state.programs]);

  const batchOptions = state.batches;

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | StudentStatus>('All');
  const [programFilter, setProgramFilter] = useState<string>('All');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<AdminStudent | null>(null);
  const [formState, setFormState] = useState({
    fullName: '',
    ageGroup: 'Youth Division',
    contactPlaceholder: '',
    guardianName: '',
    program: programOptions[0] ?? 'Tape Ball Batting',
    batchId: batchOptions[0]?.id ?? '',
    batchName: batchOptions[0]?.name ?? 'Unassigned',
    status: 'Active' as StudentStatus,
    notes: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [profileStudent, setProfileStudent] = useState<AdminStudent | null>(null);
  const [assignStudent, setAssignStudent] = useState<AdminStudent | null>(null);
  const [assignProgram, setAssignProgram] = useState('');
  const [assignBatchId, setAssignBatchId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdminStudent | null>(null);

  const pageSize = 8;

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return state.students.filter((s) => {
      const matchesQuery =
        !q ||
        s.fullName.toLowerCase().includes(q) ||
        s.studentCode.toLowerCase().includes(q) ||
        s.guardianName.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
      const matchesProgram = programFilter === 'All' || s.program === programFilter;
      return matchesQuery && matchesStatus && matchesProgram;
    });
  }, [state.students, searchQuery, statusFilter, programFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function openAddModal() {
    setEditingStudent(null);
    setFormState({
      fullName: '',
      ageGroup: 'Youth Division',
      contactPlaceholder: '',
      guardianName: '',
      program: programOptions[0] ?? 'Tape Ball Batting',
      batchId: batchOptions[0]?.id ?? '',
      batchName: batchOptions[0]?.name ?? 'Unassigned',
      status: 'Active',
      notes: '',
    });
    setFormError(null);
    setFormOpen(true);
  }

  function openEditModal(student: AdminStudent) {
    setEditingStudent(student);
    setFormState({
      fullName: student.fullName,
      ageGroup: student.ageGroup,
      contactPlaceholder: student.contactPlaceholder,
      guardianName: student.guardianName,
      program: student.program,
      batchId: student.batchId,
      batchName: student.batchName,
      status: student.status,
      notes: student.notes,
    });
    setFormError(null);
    setFormOpen(true);
  }

  async function handleSaveStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    if (!formState.fullName.trim() || !formState.guardianName.trim()) {
      setFormError('Student name and guardian or primary contact name are required.');
      return;
    }

    const matchedBatch = batchOptions.find((b) => b.id === formState.batchId);
    const batchName = matchedBatch?.name ?? (formState.batchId ? formState.batchName : 'Unassigned');

    setIsSaving(true);
    try {
      const nextIndex = state.students.length + 1;
      const payload: Omit<AdminStudent, 'id' | 'joinedLabel'> = {
        studentCode: editingStudent?.studentCode ?? `SK-${String(nextIndex).padStart(4, '0')}`,
        fullName: formState.fullName.trim(),
        ageGroup: formState.ageGroup,
        contactPlaceholder: formState.contactPlaceholder.trim(),
        guardianName: formState.guardianName.trim(),
        program: formState.program,
        batchId: formState.batchId,
        batchName,
        status: formState.status,
        attendanceRate: editingStudent?.attendanceRate ?? 100,
        notes: formState.notes.trim(),
      };

      const res = await saveStudent(payload, editingStudent?.id);
      if (!res.ok) {
        setFormError(res.error ?? 'Failed to save student record.');
        return;
      }

      showToast(
        editingStudent ? 'Student Updated' : 'Student Added',
        editingStudent
          ? `${payload.fullName} saved.`
          : `${payload.fullName} added to academy roster.`,
      );
      setFormOpen(false);
    } finally {
      setIsSaving(false);
    }
  }

  function openAssignModal(student: AdminStudent) {
    setAssignStudent(student);
    setAssignProgram(student.program);
    setAssignBatchId(student.batchId || batchOptions[0]?.id || '');
  }

  async function handleSaveAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!assignStudent) return;
    const matchedBatch = batchOptions.find((b) => b.id === assignBatchId);
    setIsSaving(true);
    try {
      const res = await saveStudent(
        {
          studentCode: assignStudent.studentCode,
          fullName: assignStudent.fullName,
          ageGroup: assignStudent.ageGroup,
          contactPlaceholder: assignStudent.contactPlaceholder,
          guardianName: assignStudent.guardianName,
          program: assignProgram,
          batchId: assignBatchId,
          batchName: matchedBatch?.name ?? 'Unassigned',
          status: assignStudent.status,
          attendanceRate: assignStudent.attendanceRate,
          notes: assignStudent.notes,
        },
        assignStudent.id,
      );
      if (!res.ok) {
        showToast('Placement Error', res.error ?? 'Unable to update batch assignment.', 'warning');
        return;
      }
      showToast('Placement Updated', `${assignStudent.fullName} assigned to ${assignProgram}.`);
      setAssignStudent(null);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Student Management"
        description="Manage enrolled players, program tracks, batch assignments, and contact records."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={openAddModal}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Add Student</span>
          </Button>
        }
      />

      <Card padding="md" className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-6 relative">
            <label htmlFor="student-search" className="sr-only">
              Search students
            </label>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#8499B8]"
              aria-hidden="true"
            />
            <input
              id="student-search"
              type="search"
              placeholder="Search by student name, code, or guardian..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm text-[#07152C] placeholder:text-[#64748B] focus:border-[#07152C] focus:outline-none focus:ring-2 focus:ring-[#D5A52B]/60 dark:border-white/15 dark:bg-[#07152C] dark:text-white dark:placeholder:text-[#8499B8] dark:focus:border-[#D5A52B]"
            />
          </div>

          <div className="md:col-span-3">
            <select
              aria-label="Filter by student status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'All' | StudentStatus);
                setPage(1);
              }}
              className="h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 text-sm text-[#07152C] dark:border-white/15 dark:bg-[#07152C] dark:text-white"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              aria-label="Filter by program"
              value={programFilter}
              onChange={(e) => {
                setProgramFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 text-sm text-[#07152C] dark:border-white/15 dark:bg-[#07152C] dark:text-white"
            >
              <option value="All">All Programs</option>
              {programOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-[12px] border border-[#E2E8F0] dark:border-white/10">
          {paginatedStudents.length === 0 ? (
            <AdminEmptyState
              title={state.students.length === 0 ? 'No students enrolled yet' : 'No matching student records'}
              description={
                state.students.length === 0
                  ? 'Add a student record directly or approve and convert incoming registration applications.'
                  : 'Adjust your search query or filters to view matching athletes.'
              }
              action={
                state.students.length === 0 ? (
                  <Button type="button" variant="primary" size="sm" onClick={openAddModal}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>Add First Student</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('All');
                      setProgramFilter('All');
                    }}
                  >
                    Reset Filters
                  </Button>
                )
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F7FA] text-[#64748B] dark:bg-[#07152C] dark:text-[#A3B4CC]">
                  <tr className="border-b border-[#E2E8F0] dark:border-white/10">
                    <th className="px-4 py-3 font-semibold">Student</th>
                    <th className="px-4 py-3 font-semibold">Division</th>
                    <th className="px-4 py-3 font-semibold">Program &amp; Batch</th>
                    <th className="px-4 py-3 font-semibold">Attendance</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white dark:divide-white/10 dark:bg-[#0F213B]">
                  {paginatedStudents.map((stu) => (
                    <tr
                      key={stu.id}
                      className="hover:bg-[#F5F7FA]/60 dark:hover:bg-[#162B4D]/60"
                    >
                      <td className="px-4 py-3">
                        <p className="font-bold text-[#07152C] dark:text-white">{stu.fullName}</p>
                        <p className="font-mono text-[11px] text-[#64748B] dark:text-[#A3B4CC]">
                          {stu.studentCode}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-[#07152C] dark:text-[#E2E8F0] whitespace-nowrap">
                        {stu.ageGroup}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#07152C] dark:text-white">
                          {stu.program}
                        </p>
                        <p className="text-[11px] text-[#64748B] dark:text-[#A3B4CC]">
                          {stu.batchName}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-[#07152C] dark:text-[#D5A52B] tabular-nums">
                        {stu.attendanceRate}%
                      </td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge
                          label={stu.status}
                          variant={STATUS_BADGE_MAP[stu.status] ?? 'neutral'}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setProfileStudent(stu)}
                            aria-label={`View ${stu.fullName}`}
                            className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#E2E8F0] px-2.5 text-[11px] font-semibold text-[#07152C] hover:bg-[#F5F7FA] dark:border-white/15 dark:text-[#E2E8F0] dark:hover:bg-[#162B4D] cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openAssignModal(stu)}
                            aria-label={`Assign batch for ${stu.fullName}`}
                            className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#E2E8F0] px-2.5 text-[11px] font-semibold text-[#07152C] hover:bg-[#F5F7FA] dark:border-white/15 dark:text-[#E2E8F0] dark:hover:bg-[#162B4D] cursor-pointer"
                          >
                            <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Batch</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(stu)}
                            aria-label={`Edit ${stu.fullName}`}
                            className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#E2E8F0] px-2.5 text-[11px] font-semibold text-[#07152C] hover:bg-[#F5F7FA] dark:border-white/15 dark:text-[#E2E8F0] dark:hover:bg-[#162B4D] cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(stu)}
                            aria-label={`Remove ${stu.fullName}`}
                            className="inline-flex h-8 items-center justify-center rounded-[8px] border border-[#C8202B]/30 px-2 text-[11px] font-semibold text-[#C8202B] hover:bg-[#C8202B]/10 dark:border-[#F87171]/35 dark:text-[#FCA5A5] cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <AdminPagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={filteredStudents.length}
            onPageChange={setPage}
          />
        </div>
      </Card>

      <AdminModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingStudent ? 'Edit Student Record' : 'Add Student'}
      >
        <form onSubmit={handleSaveStudent} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Student Full Name"
              value={formState.fullName}
              onChange={(e) => setFormState((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Player full name"
              required
            />
            <Input
              label="Division / Category"
              value={formState.ageGroup}
              onChange={(e) => setFormState((prev) => ({ ...prev, ageGroup: e.target.value }))}
              placeholder="e.g. Junior / Youth / Open"
            />
            <Input
              label="Guardian / Primary Contact Name"
              value={formState.guardianName}
              onChange={(e) => setFormState((prev) => ({ ...prev, guardianName: e.target.value }))}
              placeholder="Guardian or emergency contact"
              required
            />
            <Input
              label="Contact Number"
              value={formState.contactPlaceholder}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, contactPlaceholder: e.target.value }))
              }
              placeholder="Phone or WhatsApp number"
            />
            <Select
              label="Training Program"
              value={formState.program}
              onChange={(e) => setFormState((prev) => ({ ...prev, program: e.target.value }))}
              options={programOptions.map((p) => ({ value: p, label: p }))}
            />
            <Select
              label="Student Status"
              value={formState.status}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, status: e.target.value as StudentStatus }))
              }
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'On Hold', label: 'On Hold' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
            />
          </div>

          <Select
            label="Assigned Batch"
            value={formState.batchId}
            onChange={(e) => setFormState((prev) => ({ ...prev, batchId: e.target.value }))}
            options={[
              { value: '', label: 'Unassigned (Assign Later)' },
              ...batchOptions.map((b) => ({ value: b.id, label: b.name })),
            ]}
          />

          <Textarea
            label="Coaching / Administration Notes"
            value={formState.notes}
            onChange={(e) => setFormState((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Optional skill focus or batch notes..."
          />

          {formError && (
            <p className="text-xs font-semibold text-[#C8202B] dark:text-[#FCA5A5]">
              {formError}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4 dark:border-white/10">
            <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSaving}>
              {isSaving
                ? 'Saving...'
                : editingStudent
                  ? 'Save Changes'
                  : 'Create Student Record'}
            </Button>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        open={Boolean(profileStudent)}
        onClose={() => setProfileStudent(null)}
        title={profileStudent?.fullName ?? 'Student Profile'}
        subtitle={
          profileStudent
            ? `ID: ${profileStudent.studentCode} · Joined ${profileStudent.joinedLabel}`
            : undefined
        }
      >
        {profileStudent && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 dark:border-white/10 dark:bg-[#07152C]">
              <div>
                <p className="text-xs text-[#64748B] dark:text-[#A3B4CC]">Division</p>
                <p className="font-semibold text-[#07152C] dark:text-white">
                  {profileStudent.ageGroup}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#64748B] dark:text-[#A3B4CC]">
                  Guardian / Emergency Contact
                </p>
                <p className="font-semibold text-[#07152C] dark:text-white">
                  {profileStudent.guardianName}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#64748B] dark:text-[#A3B4CC]">Contact Number</p>
                <p className="font-semibold text-[#07152C] dark:text-white">
                  {profileStudent.contactPlaceholder || 'Not recorded'}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#64748B] dark:text-[#A3B4CC]">Assigned Program</p>
                <p className="font-semibold text-[#07152C] dark:text-white">
                  {profileStudent.program}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#64748B] dark:text-[#A3B4CC]">Batch Placement</p>
                <p className="font-semibold text-[#07152C] dark:text-white">
                  {profileStudent.batchName}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#64748B] dark:text-[#A3B4CC]">Status</p>
                <div className="mt-1">
                  <AdminStatusBadge
                    label={profileStudent.status}
                    variant={STATUS_BADGE_MAP[profileStudent.status] ?? 'neutral'}
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#A3B4CC]">
                Development Notes
              </p>
              <p className="mt-1 text-sm text-[#07152C] dark:text-[#E2E8F0]">
                {profileStudent.notes || 'No notes recorded.'}
              </p>
            </div>
          </div>
        )}
      </AdminModal>

      <AdminModal
        open={Boolean(assignStudent)}
        onClose={() => setAssignStudent(null)}
        title="Assign Program & Batch"
        subtitle={assignStudent ? `Updating placement for ${assignStudent.fullName}` : undefined}
        maxWidth="md"
      >
        <form onSubmit={handleSaveAssignment} className="space-y-4">
          <Select
            label="Target Training Program"
            value={assignProgram}
            onChange={(e) => setAssignProgram(e.target.value)}
            options={programOptions.map((p) => ({ value: p, label: p }))}
          />
          <Select
            label="Target Batch"
            value={assignBatchId}
            onChange={(e) => setAssignBatchId(e.target.value)}
            options={[
              { value: '', label: 'Unassigned' },
              ...batchOptions.map((b) => ({ value: b.id, label: b.name })),
            ]}
          />
          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4 dark:border-white/10">
            <Button type="button" variant="outline" size="sm" onClick={() => setAssignStudent(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isSaving}>
              {isSaving ? 'Applying...' : 'Apply Placement'}
            </Button>
          </div>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          const target = deleteTarget;
          void removeStudent(target.id).then((res) => {
            if (res.ok) {
              showToast('Student Removed', `${target.fullName} removed from roster.`, 'warning');
            } else {
              showToast('Remove Failed', res.error ?? 'Could not remove student.', 'warning');
            }
          });
        }}
        title="Remove Student Record"
        message={`Remove ${deleteTarget?.fullName ?? 'this student'} from the academy roster?`}
        confirmLabel="Remove Student"
        tone="danger"
      />
    </div>
  );
}
