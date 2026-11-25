import { useState, type FormEvent } from 'react';
import { Calendar, List, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { SCHEDULE_DAYS, type ScheduleDay } from '@/src/data/activitiesContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminScheduleItem } from '@/src/types/admin';
import {
  AdminConfirmDialog,
  AdminEmptyState,
  AdminModal,
  AdminPageHeader,
} from '@/src/components/admin/AdminPrimitives';
import { useAdminToast } from '@/src/components/admin/AdminToastContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';

export function AdminSchedulesPage() {
  useDocumentTitle('Schedule Management');
  const { showToast } = useAdminToast();
  const { state, setSchedules } = useAcademyState();

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminScheduleItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminScheduleItem | null>(null);

  const [day, setDay] = useState<ScheduleDay>('Monday');
  const [timePlaceholder, setTimePlaceholder] = useState('');
  const [batchId, setBatchId] = useState(state.batches[0]?.id ?? '');
  const [coachName, setCoachName] = useState(state.coaches[0]?.fullName ?? '');
  const [groundZone, setGroundZone] = useState('Main Practice Nets');

  function openAdd(defaultDay?: ScheduleDay) {
    setEditing(null);
    setDay(defaultDay ?? 'Monday');
    setTimePlaceholder('');
    setBatchId(state.batches[0]?.id ?? '');
    setCoachName(state.coaches[0]?.fullName ?? 'To Be Assigned');
    setGroundZone('Main Practice Nets');
    setFormOpen(true);
  }

  function openEdit(item: AdminScheduleItem) {
    setEditing(item);
    setDay(item.day);
    setTimePlaceholder(item.timePlaceholder);
    setBatchId(item.batchId);
    setCoachName(item.coachName);
    setGroundZone(item.groundZone);
    setFormOpen(true);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!timePlaceholder.trim()) return;
    const batch = state.batches.find((b) => b.id === batchId);
    const batchName = batch?.name ?? 'General Training Group';
    const programTitle = batch?.programTitle ?? (state.programs[0]?.title ?? 'Training Session');

    if (editing) {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editing.id
            ? {
                ...s,
                day,
                timePlaceholder: timePlaceholder.trim(),
                batchId,
                batchName,
                coachName: coachName.trim() || 'To Be Assigned',
                programTitle,
                groundZone: groundZone.trim() || 'Main Ground',
              }
            : s,
        ),
      );
      showToast('Schedule Updated', `${day} session updated.`);
    } else {
      const next: AdminScheduleItem = {
        id: `sch-${Date.now()}`,
        day,
        timePlaceholder: timePlaceholder.trim(),
        batchId,
        batchName,
        coachName: coachName.trim() || 'To Be Assigned',
        programTitle,
        groundZone: groundZone.trim() || 'Main Ground',
      };
      setSchedules((prev) => [...prev, next]);
      showToast('Schedule Slot Added', `${day} training slot created.`);
    }
    setFormOpen(false);
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Schedule Management"
        description="Configure weekly training days, timings, ground zones, and supervising coaches."
        actions={
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-[10px] border border-[#E2E8F0] bg-white p-1">
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                  viewMode === 'calendar' ? 'bg-[#071A36] text-white' : 'text-[#64748B]'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Calendar</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#071A36] text-white' : 'text-[#64748B]'
                }`}
              >
                <List className="h-3.5 w-3.5" aria-hidden="true" />
                <span>List</span>
              </button>
            </div>
            <Button type="button" variant="primary" size="sm" onClick={() => openAdd()}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Add Schedule</span>
            </Button>
          </div>
        }
      />

      {state.schedules.length === 0 ? (
        <Card padding="md">
          <AdminEmptyState
            title="No weekly schedule slots published yet"
            description="Add weekly session timings for batches and grounds. Published schedule slots appear automatically on the public Schedule page."
            action={
              <Button type="button" variant="primary" size="sm" onClick={() => openAdd('Monday')}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Add First Session Slot</span>
              </Button>
            }
          />
        </Card>
      ) : viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 items-start">
          {SCHEDULE_DAYS.map((dayName) => {
            const items = state.schedules.filter((s) => s.day === dayName);
            return (
              <Card key={dayName} padding="sm" className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                  <h2 className="text-sm font-bold text-[#071A36]">{dayName}</h2>
                  <button
                    type="button"
                    onClick={() => openAdd(dayName)}
                    className="text-[11px] font-semibold text-[#071A36] hover:text-[#C8202B] cursor-pointer"
                  >
                    + Add Slot
                  </button>
                </div>

                {items.length === 0 ? (
                  <p className="py-4 text-center text-xs text-[#64748B]">No sessions scheduled</p>
                ) : (
                  <div className="space-y-2.5">
                    {items.map((slot) => (
                      <div
                        key={slot.id}
                        className="rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] p-3 space-y-1 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-[#071A36]">{slot.programTitle}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEdit(slot)}
                              aria-label={`Edit ${slot.day} ${slot.programTitle}`}
                              className="text-[#64748B] hover:text-[#071A36] cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(slot)}
                              aria-label={`Delete ${slot.day} ${slot.programTitle}`}
                              className="text-[#C8202B]/70 hover:text-[#C8202B] cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <p className="font-medium text-[#071A36]">{slot.batchName}</p>
                        <p className="text-[11px] text-[#64748B]">{slot.timePlaceholder}</p>
                        <p className="text-[11px] text-[#64748B]">Coach: {slot.coachName}</p>
                        <p className="text-[11px] text-[#64748B]">Zone: {slot.groundZone}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card padding="sm" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-[#64748B]">
                <tr className="border-b border-[#E2E8F0]">
                  <th className="px-4 py-3 font-semibold">Day</th>
                  <th className="px-4 py-3 font-semibold">Batch &amp; Program</th>
                  <th className="px-4 py-3 font-semibold">Coach</th>
                  <th className="px-4 py-3 font-semibold">Time &amp; Zone</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {state.schedules.map((slot) => (
                  <tr key={slot.id} className="hover:bg-[#F5F7FA]/60">
                    <td className="px-4 py-3 font-bold text-[#071A36]">{slot.day}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#071A36]">{slot.batchName}</p>
                      <p className="text-[11px] text-[#64748B]">{slot.programTitle}</p>
                    </td>
                    <td className="px-4 py-3 text-[#64748B]">{slot.coachName}</td>
                    <td className="px-4 py-3 text-[#64748B]">
                      <p>{slot.timePlaceholder}</p>
                      <p className="text-[11px]">{slot.groundZone}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Button type="button" variant="outline" size="sm" onClick={() => openEdit(slot)}>
                          Edit
                        </Button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(slot)}
                          aria-label={`Delete ${slot.day} slot`}
                          className="inline-flex h-9 items-center justify-center rounded-[10px] border border-[#C8202B]/30 px-2.5 text-xs text-[#C8202B] hover:bg-[#C8202B]/5 cursor-pointer"
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
        </Card>
      )}

      <AdminModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Schedule Slot' : 'Add Schedule Slot'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Training Day"
              value={day}
              onChange={(e) => setDay(e.target.value as ScheduleDay)}
              options={SCHEDULE_DAYS.map((d) => ({ value: d, label: d }))}
            />
            <Input
              label="Session Timing"
              value={timePlaceholder}
              onChange={(e) => setTimePlaceholder(e.target.value)}
              placeholder="e.g. 6:00 PM – 8:00 PM"
              required
            />
            <Select
              label="Assign Batch"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              options={[
                { value: '', label: 'General Academy Session' },
                ...state.batches.map((b) => ({ value: b.id, label: b.name })),
              ]}
            />
            {state.coaches.length > 0 ? (
              <Select
                label="Assign Coach"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                options={[
                  { value: 'To Be Assigned', label: 'To Be Assigned' },
                  ...state.coaches.map((c) => ({ value: c.fullName, label: c.fullName })),
                ]}
              />
            ) : (
              <Input
                label="Supervising Coach"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                placeholder="Coach name or To Be Assigned"
              />
            )}
          </div>
          <Input
            label="Ground / Training Zone"
            value={groundZone}
            onChange={(e) => setGroundZone(e.target.value)}
            placeholder="e.g. Sabzazar Ground — Practice Lanes"
          />
          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editing ? 'Save Slot' : 'Add Slot'}
            </Button>
          </div>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          setSchedules((prev) => prev.filter((s) => s.id !== deleteTarget.id));
          showToast('Schedule Slot Deleted', 'Session removed from weekly calendar.', 'warning');
        }}
        title="Delete Schedule Slot"
        message={`Remove ${deleteTarget?.day ?? ''} (${deleteTarget?.timePlaceholder ?? ''}) from the schedule?`}
        confirmLabel="Remove Slot"
        tone="danger"
      />
    </div>
  );
}
