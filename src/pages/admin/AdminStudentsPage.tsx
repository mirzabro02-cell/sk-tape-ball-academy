import { useMemo, useState, type FormEvent } from 'react';
import { Eye, Layers, Pencil, Plus, Search } from 'lucide-react';
import { INITIAL_ADMIN_BATCHES, INITIAL_ADMIN_STUDENTS } from '@/src/data/adminMockData';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminStudent, StudentStatus } from '@/src/types/admin';
import {
  AdminDemoNotice,
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

const STATUS_BADGE_MAP: Record<StudentStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  Active: 'success',
  Trial: 'warning',
  'On Hold': 'neutral',
  Inactive: 'danger',
};

const PROGRAM_OPTIONS = [
  'Batting',
  'Fast Bowling',
  'Spin Bowling',
  'Fielding',
  'Wicket Keeping',
  'Fitness & Agility',
  'Beginner Foundation',
  'Advanced Competitive',
  'Personal Coaching',
];

const EMPTY_FORM: Omit<AdminStudent, 'id' | 'studentCode' | 'joinedLabel' | 'attendanceRate'> = {
  fullName: '',
  ageGroup: 'U-17 Youth',
  contactPlaceholder: '',
  guardianName: '',
  program: 'Batting',
  batchId: INITIAL_ADMIN_BATCHES[0].id,
  batchName: INITIAL_ADMIN_BATCHES[0].name,
  status: 'Active',
  notes: '',
};

export function AdminStudentsPage() {
  useDocumentTitle('Student Management');
  const { showToast } = useAdminToast();

  const [students, setStudents] = useState<AdminStudent[]>(INITIAL_ADMIN_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | StudentStatus>('All');
  const [programFilter, setProgramFilter] = useState<string>('All');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<AdminStudent | null>(null);
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const [profileStudent, setProfileStudent] = useState<AdminStudent | null>(null);
  const [assignStudent, setAssignStudent] = useState<AdminStudent | null>(null);
  const [assignProgram, setAssignProgram] = useState('');
  const [assignBatchId, setAssignBatchId] = useState('');

  const pageSize = 5;

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return students.filter((s) => {
      const matchesQuery =
        !q ||
        s.fullName.toLowerCase().includes(q) ||
        s.studentCode.toLowerCase().includes(q) ||
        s.guardianName.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
      const matchesProgram = programFilter === 'All' || s.program === programFilter;
      return matchesQuery && matchesStatus && matchesProgram;
    });
  }, [students, searchQuery, statusFilter, programFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function openAddModal() {
    setEditingStudent(null);
    setFormState(EMPTY_FORM);
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

  function handleSaveStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formState.fullName.trim() || !formState.guardianName.trim()) {
      setFormError('Student name and guardian/contact name are required.');
      return;
    }

    const matchedBatch = INITIAL_ADMIN_BATCHES.find((b) => b.id === formState.batchId);
    const batchName = matchedBatch?.name ?? formState.batchName;

    if (editingStudent) {
      setStudents((prev) =>
        prev.map((item) =>
          item.id === editingStudent.id ? { ...item, ...formState, batchName } : item,
        ),
      );
      showToast(
        'Student Updated (Frontend Preview)',
        `${formState.fullName} updated in session state only.`,
      );
    } else {
      const newEntry: AdminStudent = {
        id: `stu-${Date.now()}`,
        studentCode: `DEMO-STU-${String(students.length + 1).padStart(3, '0')}`,
        ...formState,
        batchName,
        contactPlaceholder: formState.contactPlaceholder.trim() || '[Contact Placeholder]',
        joinedLabel: 'Session Addition (Demo)',
        attendanceRate: 100,
      };
      setStudents((prev) => [newEntry, ...prev]);
      showToast(
        'Student Added (Frontend Preview)',
        `${newEntry.fullName} added to local demonstration roster.`,
      );
    }
    setFormOpen(false);
  }

  function openAssignModal(student: AdminStudent) {
    setAssignStudent(student);
    setAssignProgram(student.program);
    setAssignBatchId(student.batchId);
  }

  function handleSaveAssignment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!assignStudent) return;
    const matchedBatch = INITIAL_ADMIN_BATCHES.find((b) => b.id === assignBatchId);
    setStudents((prev) =>
      prev.map((item) =>
        item.id === assignStudent.id
          ? {
              ...item,
              program: assignProgram,
              batchId: assignBatchId,
              batchName: matchedBatch?.name ?? item.batchName,
            }
          : item,
      ),
    );
    showToast(
      'Program & Batch Assigned (Demo)',
      `${assignStudent.fullName} assigned to ${assignProgram}.`,
    );
    setAssignStudent(null);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Student Management"
        description="Manage demonstration student profiles, enrollment status, and program/batch placements."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={openAddModal}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Add Student</span>
          </Button>
        }
      />

      <AdminDemoNotice />

      <Card padding="md" className="space-y-4">
        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-6 relative">
            <label htmlFor="student-search" className="sr-only">
              Search students
            </label>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]"
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
              className="h-11 w-full rounded-[10px] border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm text-[#071A36] placeholder:text-[#64748B] focus:border-[#071A36] focus:outline-none focus:ring-2 focus:ring-[#D9A52E]/50"
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
              className="h-11 w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 text-sm text-[#071A36]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Trial">Trial</option>
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
              className="h-11 w-full rounded-[10px] border border-[#E2E8F0] bg-white px-3 text-sm text-[#071A36]"
            >
              <option value="All">All Programs</option>
              {PROGRAM_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-[12px] border border-[#E2E8F0]">
          {paginatedStudents.length === 0 ? (
            <AdminEmptyState
              title="No matching student records"
              description="Adjust your search query or filters, or add a demonstration student record."
              action={
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
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F7FA] text-[#64748B]">
                  <tr className="border-b border-[#E2E8F0]">
                    <th className="px-4 py-3 font-semibold">Student</th>
                    <th className="px-4 py-3 font-semibold">Age Group</th>
                    <th className="px-4 py-3 font-semibold">Program &amp; Batch</th>
                    <th className="px-4 py-3 font-semibold">Attendance</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {paginatedStudents.map((stu) => (
                    <tr key={stu.id} className="hover:bg-[#F5F7FA]/60">
                      <td className="px-4 py-3">
                        <p className="font-bold text-[#071A36]">{stu.fullName}</p>
                        <p className="font-mono text-[11px] text-[#64748B]">{stu.studentCode}</p>
                      </td>
                      <td className="px-4 py-3 text-[#071A36] whitespace-nowrap">
                        {stu.ageGroup}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#071A36]">{stu.program}</p>
                        <p className="text-[11px] text-[#64748B]">{stu.batchName}</p>
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-[#071A36] tabular-nums">
                        {stu.attendanceRate}%
                      </td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge
                          label={stu.status}
                          variant={STATUS_BADGE_MAP[stu.status]}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setProfileStudent(stu)}
                            title="View profile"
                            aria-label={`View ${stu.fullName}`}
                            className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#E2E8F0] px-2.5 text-[11px] font-semibold text-[#071A36] hover:bg-[#F5F7FA] cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openAssignModal(stu)}
                            title="Assign program/batch"
                            aria-label={`Assign batch for ${stu.fullName}`}
                            className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#E2E8F0] px-2.5 text-[11px] font-semibold text-[#071A36] hover:bg-[#F5F7FA] cursor-pointer"
                          >
                            <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Batch</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(stu)}
                            title="Edit student"
                            aria-label={`Edit ${stu.fullName}`}
                            className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#E2E8F0] px-2.5 text-[11px] font-semibold text-[#071A36] hover:bg-[#F5F7FA] cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Edit</span>
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

      {/* Add / Edit Modal */}
      <AdminModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingStudent ? 'Edit Student (Demonstration)' : 'Add Student (Demonstration)'}
        subtitle="Changes apply to current preview session state only."
      >
        <form onSubmit={handleSaveStudent} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Student Full Name"
              value={formState.fullName}
              onChange={(e) => setFormState((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="e.g. Sample Student Name"
              required
            />
            <Select
              label="Age Group"
              value={formState.ageGroup}
              onChange={(e) => setFormState((prev) => ({ ...prev, ageGroup: e.target.value }))}
              options={[
                { value: 'U-15 Junior', label: 'U-15 Junior' },
                { value: 'U-17 Youth', label: 'U-17 Youth' },
                { value: 'U-19 Competitive', label: 'U-19 Competitive' },
                { value: 'Senior Open', label: 'Senior Open' },
              ]}
            />
            <Input
              label="Guardian / Primary Contact Name"
              value={formState.guardianName}
              onChange={(e) => setFormState((prev) => ({ ...prev, guardianName: e.target.value }))}
              placeholder="e.g. Sample Guardian"
              required
            />
            <Input
              label="Contact Phone Placeholder"
              value={formState.contactPlaceholder}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, contactPlaceholder: e.target.value }))
              }
              placeholder="[Phone Placeholder]"
            />
            <Select
              label="Training Program"
              value={formState.program}
              onChange={(e) => setFormState((prev) => ({ ...prev, program: e.target.value }))}
              options={PROGRAM_OPTIONS.map((p) => ({ value: p, label: p }))}
            />
            <Select
              label="Student Status"
              value={formState.status}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, status: e.target.value as StudentStatus }))
              }
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Trial', label: 'Trial' },
                { value: 'On Hold', label: 'On Hold' },
                { value: 'Inactive', label: 'Inactive' },
              ]}
            />
          </div>

          <Select
            label="Assigned Batch"
            value={formState.batchId}
            onChange={(e) => setFormState((prev) => ({ ...prev, batchId: e.target.value }))}
            options={INITIAL_ADMIN_BATCHES.map((b) => ({ value: b.id, label: b.name }))}
          />

          <Textarea
            label="Coaching / Administration Notes"
            value={formState.notes}
            onChange={(e) => setFormState((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Optional skill focus or batch notes..."
          />

          {formError && <p className="text-xs font-semibold text-[#C8202B]">{formError}</p>}

          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingStudent ? 'Save Changes' : 'Create Student Record'}
            </Button>
          </div>
        </form>
      </AdminModal>

      {/* Profile Modal */}
      <AdminModal
        open={Boolean(profileStudent)}
        onClose={() => setProfileStudent(null)}
        title={profileStudent?.fullName ?? 'Student Profile'}
        subtitle={`Demonstration Code: ${profileStudent?.studentCode ?? ''}`}
      >
        {profileStudent && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4">
              <div>
                <p className="text-xs text-[#64748B]">Age Category</p>
                <p className="font-semibold text-[#071A36]">{profileStudent.ageGroup}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">Guardian / Emergency Contact</p>
                <p className="font-semibold text-[#071A36]">{profileStudent.guardianName}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">Assigned Program</p>
                <p className="font-semibold text-[#071A36]">{profileStudent.program}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">Batch Placement</p>
                <p className="font-semibold text-[#071A36]">{profileStudent.batchName}</p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">Attendance Rate (Demo)</p>
                <p className="font-mono font-bold text-[#071A36] tabular-nums">
                  {profileStudent.attendanceRate}%
                </p>
              </div>
              <div>
                <p className="text-xs text-[#64748B]">Status</p>
                <AdminStatusBadge
                  label={profileStudent.status}
                  variant={STATUS_BADGE_MAP[profileStudent.status]}
                />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Development Notes
              </p>
              <p className="mt-1 text-sm text-[#071A36]">
                {profileStudent.notes || 'No demonstration notes recorded.'}
              </p>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Program & Batch Assignment Modal */}
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
            options={PROGRAM_OPTIONS.map((p) => ({ value: p, label: p }))}
          />
          <Select
            label="Target Batch"
            value={assignBatchId}
            onChange={(e) => setAssignBatchId(e.target.value)}
            options={INITIAL_ADMIN_BATCHES.map((b) => ({ value: b.id, label: b.name }))}
          />
          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setAssignStudent(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Apply Placement
            </Button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
