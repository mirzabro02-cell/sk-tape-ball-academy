import { useState, type FormEvent } from 'react';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminBatch, BatchStatus } from '@/src/types/admin';
import { containsUnsafeHtml } from '@/src/utils/validation';
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

const BATCH_STATUS_BADGE: Record<BatchStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  Open: 'success',
  Upcoming: 'warning',
  Full: 'danger',
  Archived: 'neutral',
};

export function AdminBatchesPage() {
  useDocumentTitle('Batch Management');
  const { showToast } = useAdminToast();
  const { state, setBatches, setStudents } = useAcademyState();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBatch | null>(null);
  const [assigningBatch, setAssigningBatch] = useState<AdminBatch | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<AdminBatch | null>(null);

  const defaultProgram = state.programs[0]?.title ?? 'Tape Ball Batting';
  const defaultCoachId = state.coaches[0]?.id ?? '';

  const [name, setName] = useState('');
  const [programTitle, setProgramTitle] = useState(defaultProgram);
  const [coachId, setCoachId] = useState(defaultCoachId);
  const [capacity, setCapacity] = useState('15');
  const [timingPlaceholder, setTimingPlaceholder] = useState('');
  const [status, setStatus] = useState<BatchStatus>('Open');
  const [formError, setFormError] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setName('');
    setProgramTitle(defaultProgram);
    setCoachId(defaultCoachId);
    setCapacity('15');
    setTimingPlaceholder('');
    setStatus('Open');
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(batch: AdminBatch) {
    setEditing(batch);
    setName(batch.name);
    setProgramTitle(batch.programTitle);
    setCoachId(batch.coachId);
    setCapacity(String(batch.capacity));
    setTimingPlaceholder(batch.timingPlaceholder);
    setStatus(batch.status);
    setFormError(null);
    setFormOpen(true);
  }

  function handleSaveBatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setFormError('Batch name is required.');
      return;
    }
    if (containsUnsafeHtml([name, timingPlaceholder])) {
      setFormError('HTML tags (< or >) are not permitted.');
      return;
    }
    setFormError(null);
    const trimmedName = name.trim();
    const coach = state.coaches.find((c) => c.id === coachId);
    const parsedCap = Math.max(1, Number(capacity) || 12);

    if (editing) {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === editing.id
            ? {
                ...b,
                name: trimmedName,
                programTitle,
                coachId,
                coachName: coach?.fullName ?? 'To Be Assigned',
                capacity: parsedCap,
                timingPlaceholder: timingPlaceholder.trim() || 'Schedule to be set',
                status,
              }
            : b,
        ),
      );
      if (editing.name !== trimmedName) {
        setStudents((prev) =>
          prev.map((s) => (s.batchId === editing.id ? { ...s, batchName: trimmedName } : s)),
        );
      }
      showToast('Batch Updated', `${trimmedName} updated.`);
    } else {
      const next: AdminBatch = {
        id: `batch-${Date.now()}`,
        name: trimmedName,
        programTitle,
        coachId,
        coachName: coach?.fullName ?? 'To Be Assigned',
        capacity: parsedCap,
        assignedStudentIds: [],
        timingPlaceholder: timingPlaceholder.trim() || 'Schedule to be set',
        status,
      };
      setBatches((prev) => [next, ...prev]);
      showToast('Batch Created', `${next.name} created.`);
    }
    setFormOpen(false);
  }

  function openStudentAssignment(batch: AdminBatch) {
    setAssigningBatch(batch);
    setSelectedStudentIds(batch.assignedStudentIds);
  }

  function handleSaveAssignedStudents() {
    if (!assigningBatch) return;
    const assignedSet = new Set(selectedStudentIds);
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id === assigningBatch.id) {
          return {
            ...b,
            assignedStudentIds: selectedStudentIds,
            status: selectedStudentIds.length >= b.capacity ? 'Full' : b.status,
          };
        }
        return {
          ...b,
          assignedStudentIds: b.assignedStudentIds.filter((sid) => !assignedSet.has(sid)),
        };
      }),
    );
    setStudents((prev) =>
      prev.map((stu) => {
        if (assignedSet.has(stu.id)) {
          return { ...stu, batchId: assigningBatch.id, batchName: assigningBatch.name };
        }
        if (stu.batchId === assigningBatch.id) {
          return { ...stu, batchId: '', batchName: 'Unassigned' };
        }
        return stu;
      }),
    );
    showToast(
      'Batch Roster Updated',
      `${selectedStudentIds.length} student(s) assigned to ${assigningBatch.name}.`,
    );
    setAssigningBatch(null);
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Batch Management"
        description="Organize training batches, assign coaches and enrolled students, and monitor group capacity."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Create Batch</span>
          </Button>
        }
      />

      {state.batches.length === 0 ? (
        <Card padding="md">
          <AdminEmptyState
            title="No training batches created yet"
            description="Create a training batch to group enrolled students by program track, timing, and supervising coach."
            action={
              <Button type="button" variant="primary" size="sm" onClick={openCreate}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Create First Batch</span>
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:items-start">
          {state.batches.map((batch) => {
            const fillPct = Math.min(
              100,
              Math.round((batch.assignedStudentIds.length / Math.max(1, batch.capacity)) * 100),
            );
            return (
              <Card key={batch.id} padding="md" className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                      {batch.programTitle}
                    </p>
                    <h2 className="text-base font-bold text-[#071A36]">{batch.name}</h2>
                  </div>
                  <AdminStatusBadge label={batch.status} variant={BATCH_STATUS_BADGE[batch.status]} />
                </div>

                <div className="grid grid-cols-2 gap-3 rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] p-3 text-xs">
                  <div>
                    <p className="text-[#64748B]">Assigned Coach</p>
                    <p className="font-semibold text-[#071A36]">{batch.coachName}</p>
                  </div>
                  <div>
                    <p className="text-[#64748B]">Session Timing</p>
                    <p className="font-semibold text-[#071A36]">{batch.timingPlaceholder}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#071A36]">Capacity Utilization</span>
                    <span className="font-mono font-bold text-[#071A36] tabular-nums">
                      {batch.assignedStudentIds.length} / {batch.capacity} ({fillPct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                    <div
                      className="h-full bg-[#D9A52E]"
                      style={{ width: `${fillPct === 0 ? 0 : Math.max(4, fillPct)}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#E2E8F0] pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openStudentAssignment(batch)}
                  >
                    <Users className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Assign Students</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => openEdit(batch)}
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Edit</span>
                  </Button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(batch)}
                    aria-label={`Delete ${batch.name}`}
                    className="inline-flex h-9 items-center justify-center rounded-[10px] border border-[#C8202B]/30 px-3 text-xs font-semibold text-[#C8202B] hover:bg-[#C8202B]/5 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AdminModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Batch' : 'Create New Batch'}
      >
        <form onSubmit={handleSaveBatch} className="space-y-4">
          <Input
            label="Batch Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Evening Batting Group A"
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Program Track"
              value={programTitle}
              onChange={(e) => setProgramTitle(e.target.value)}
              options={state.programs.map((p) => ({ value: p.title, label: p.title }))}
            />
            <Select
              label="Assigned Coach"
              value={coachId}
              onChange={(e) => setCoachId(e.target.value)}
              options={[
                { value: '', label: 'To Be Assigned' },
                ...state.coaches.map((c) => ({ value: c.id, label: c.fullName })),
              ]}
            />
            <Input
              label="Max Capacity"
              type="number"
              min={1}
              max={60}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
            <Select
              label="Batch Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as BatchStatus)}
              options={[
                { value: 'Open', label: 'Open' },
                { value: 'Upcoming', label: 'Upcoming' },
                { value: 'Full', label: 'Full' },
                { value: 'Archived', label: 'Archived' },
              ]}
            />
          </div>
          <Input
            label="Training Timing"
            value={timingPlaceholder}
            onChange={(e) => setTimingPlaceholder(e.target.value)}
            placeholder="e.g. Mon, Wed, Fri · 6:00 PM – 8:00 PM"
          />
          {formError && <p className="text-xs font-semibold text-[#C8202B]">{formError}</p>}
          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editing ? 'Save Batch' : 'Create Batch'}
            </Button>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        open={Boolean(assigningBatch)}
        onClose={() => setAssigningBatch(null)}
        title={`Assign Students — ${assigningBatch?.name ?? ''}`}
        maxWidth="md"
      >
        <div className="space-y-4">
          {state.students.length === 0 ? (
            <p className="text-xs text-[#64748B] py-4 text-center">
              No student records exist yet. Add students in Student Management first.
            </p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {state.students.map((stu) => {
                const checked = selectedStudentIds.includes(stu.id);
                return (
                  <label
                    key={stu.id}
                    className="flex items-center justify-between rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] px-3.5 py-2.5 text-xs cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setSelectedStudentIds((prev) =>
                            checked ? prev.filter((id) => id !== stu.id) : [...prev, stu.id],
                          )
                        }
                        className="h-4 w-4 accent-[#071A36]"
                      />
                      <span>
                        <strong className="block text-[#071A36]">{stu.fullName}</strong>
                        <span className="text-[#64748B]">
                          {stu.studentCode} · {stu.program}
                        </span>
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}
          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAssigningBatch(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleSaveAssignedStudents}
            >
              Save Roster Assignment
            </Button>
          </div>
        </div>
      </AdminModal>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          setBatches((prev) => prev.filter((b) => b.id !== deleteTarget.id));
          setStudents((prev) =>
            prev.map((s) =>
              s.batchId === deleteTarget.id ? { ...s, batchId: '', batchName: 'Unassigned' } : s,
            ),
          );
          showToast('Batch Deleted', `${deleteTarget.name} removed.`, 'warning');
        }}
        title="Delete Training Batch"
        message={`Delete batch "${deleteTarget?.name ?? ''}"? Enrolled student records will remain intact.`}
        confirmLabel="Delete Batch"
        tone="danger"
      />
    </div>
  );
}
