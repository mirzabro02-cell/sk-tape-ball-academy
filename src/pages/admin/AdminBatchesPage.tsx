import { useState, type FormEvent } from 'react';
import { Pencil, Plus, Users } from 'lucide-react';
import {
  INITIAL_ADMIN_BATCHES,
  INITIAL_ADMIN_COACHES,
  INITIAL_ADMIN_PROGRAMS,
  INITIAL_ADMIN_STUDENTS,
} from '@/src/data/adminMockData';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminBatch, BatchStatus } from '@/src/types/admin';
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

const BATCH_STATUS_BADGE: Record<BatchStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  Open: 'success',
  Upcoming: 'warning',
  Full: 'danger',
  Archived: 'neutral',
};

export function AdminBatchesPage() {
  useDocumentTitle('Batch Management');
  const { showToast } = useAdminToast();

  const [batches, setBatches] = useState<AdminBatch[]>(INITIAL_ADMIN_BATCHES);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBatch | null>(null);
  const [assigningBatch, setAssigningBatch] = useState<AdminBatch | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const [name, setName] = useState('');
  const [programTitle, setProgramTitle] = useState(INITIAL_ADMIN_PROGRAMS[0].title);
  const [coachId, setCoachId] = useState(INITIAL_ADMIN_COACHES[0].id);
  const [capacity, setCapacity] = useState('15');
  const [timingPlaceholder, setTimingPlaceholder] = useState('[Batch Timing Placeholder]');
  const [status, setStatus] = useState<BatchStatus>('Open');

  function openCreate() {
    setEditing(null);
    setName('');
    setProgramTitle(INITIAL_ADMIN_PROGRAMS[0].title);
    setCoachId(INITIAL_ADMIN_COACHES[0].id);
    setCapacity('15');
    setTimingPlaceholder('[Batch Timing Placeholder]');
    setStatus('Open');
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
    setFormOpen(true);
  }

  function handleSaveBatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    const coach = INITIAL_ADMIN_COACHES.find((c) => c.id === coachId);
    const parsedCap = Math.max(1, Number(capacity) || 12);

    if (editing) {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === editing.id
            ? {
                ...b,
                name,
                programTitle,
                coachId,
                coachName: coach?.fullName ?? b.coachName,
                capacity: parsedCap,
                timingPlaceholder,
                status,
              }
            : b,
        ),
      );
      showToast('Batch Updated (Preview)', `${name} updated in demonstration session.`);
    } else {
      const next: AdminBatch = {
        id: `batch-${Date.now()}`,
        name,
        programTitle,
        coachId,
        coachName: coach?.fullName ?? 'Coach Placeholder',
        capacity: parsedCap,
        assignedStudentIds: [],
        timingPlaceholder,
        status,
      };
      setBatches((prev) => [next, ...prev]);
      showToast('Batch Created (Preview)', `${name} added to demonstration batches.`);
    }
    setFormOpen(false);
  }

  function openStudentAssignment(batch: AdminBatch) {
    setAssigningBatch(batch);
    setSelectedStudentIds(batch.assignedStudentIds);
  }

  function handleSaveAssignedStudents() {
    if (!assigningBatch) return;
    setBatches((prev) =>
      prev.map((b) =>
        b.id === assigningBatch.id
          ? {
              ...b,
              assignedStudentIds: selectedStudentIds,
              status: selectedStudentIds.length >= b.capacity ? 'Full' : b.status,
            }
          : b,
      ),
    );
    showToast(
      'Batch Roster Updated (Preview)',
      `${selectedStudentIds.length} demonstration student(s) assigned to ${assigningBatch.name}.`,
    );
    setAssigningBatch(null);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Batch Management"
        description="Create training batches, assign coaches and students, and monitor demonstration slot capacity."
        actions={
          <Button type="button" variant="primary" size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Create Batch</span>
          </Button>
        }
      />

      <AdminDemoNotice />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {batches.map((batch) => {
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
                  <p className="text-[#64748B]">Schedule Placeholder</p>
                  <p className="font-semibold text-[#071A36]">{batch.timingPlaceholder}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#071A36]">Capacity Utilization (Demo)</span>
                  <span className="font-mono font-bold text-[#071A36] tabular-nums">
                    {batch.assignedStudentIds.length} / {batch.capacity} ({fillPct}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
                  <div
                    className="h-full bg-[#D9A52E]"
                    style={{ width: `${Math.max(4, fillPct)}%` }}
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
                  <span>Edit Batch</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

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
            placeholder="e.g. Evening Batting Group B (Demo)"
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Program Selection"
              value={programTitle}
              onChange={(e) => setProgramTitle(e.target.value)}
              options={INITIAL_ADMIN_PROGRAMS.map((p) => ({ value: p.title, label: p.title }))}
            />
            <Select
              label="Assigned Coach"
              value={coachId}
              onChange={(e) => setCoachId(e.target.value)}
              options={INITIAL_ADMIN_COACHES.map((c) => ({ value: c.id, label: c.fullName }))}
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
            label="Timing Placeholder"
            value={timingPlaceholder}
            onChange={(e) => setTimingPlaceholder(e.target.value)}
          />
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
        subtitle="Select demonstration student profiles to assign to this batch."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {INITIAL_ADMIN_STUDENTS.map((stu) => {
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
    </div>
  );
}
