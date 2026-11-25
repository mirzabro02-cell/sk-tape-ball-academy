import { useState, type FormEvent } from 'react';
import { Calendar, List, Pencil, Plus, Trash2 } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { SCHEDULE_DAYS, type ScheduleDay } from '@/src/data/activitiesContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminScheduleItem } from '@/src/types/admin';
import { containsUnsafeHtml } from '@/src/utils/validation';
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
  const [formError, setFormError] = useState<string | null>(null);

  function openAdd(defaultDay?: ScheduleDay) {
    setEditing(null);
    setDay(defaultDay ?? 'Monday');
    setTimePlaceholder('');
    setBatchId(state.batches[0]?.id ?? '');
    setCoachName(state.coaches[0]?.fullName ?? 'To Be Assigned');
    setGroundZone('Main Practice Nets');
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(item: AdminScheduleItem) {
    setEditing(item);
    setDay(item.day);
    setTimePlaceholder(item.timePlaceholder);
    setBatchId(item.batchId);
    setCoachName(item.coachName);
    setGroundZone(item.groundZone);
    setFormError(null);
    setFormOpen(true);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!timePlaceholder.trim()) {
      setFormError('Session timing is required.');
      return;
    }
    if (containsUnsafeHtml([timePlaceholder, coachName, groundZone])) {
      setFormError('HTML tags (< or >) are not permitted.');
      return;
    }
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
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-[10px] border border-[#E2E8F0] bg-white p-1 dark:border-white/15 dark:bg-[#0F213B]">
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                  viewMode === 'calendar'
                    ? 'bg-[#07152C] text-white dark:bg-[#D5A52B] dark:text-[#050D1B]'
                    : 'text-[#64748B] dark:text-[#A3B4CC]'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Calendar</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#07152C] text-white dark:bg-[#D5A52B] dark:text-[#050D1B]'
                    : 'text-[#64748B] dark:text-[#A3B4CC]'
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 items-start">
          {SCHEDULE_DAYS.map((dayName) => {
            const items = state.schedules.filter((s) => s.day === dayName);
            return (
              <Card key={dayName} padding="sm" className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2 dark:border-white/10">
                  <h2 className="text-sm font-bold text-[#07152C] dark:text-white">{dayName}</h2>
                  <button
                    type="button"
                    onClick={() => openAdd(dayName)}
                    className="text-[11px] font-semibold text-[#07152C] hover:text-[#C8202B] dark:text-[#D5A52B] dark:hover:text-[#E2B84A] cursor-pointer"
                  >
                    + Add Slot
                  </button>
                </div>

                {items.length === 0 ? (
                  <p className="py-3 text-center text-xs text-[#64748B] dark:text-[#A3B4CC]">
                    No sessions scheduled
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {items.map((slot) => (
                      <div
                        key={slot.id}
                        className="rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] p-3 space-y-1 text-xs dark:border-white/10 dark:bg-[#07152C]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="min-w-0 break-words font-bold text-[#07152C] dark:text-white">
                            {slot.programTitle}
                          </span>
                          <div className="flex shrink-0 items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEdit(slot)}
                              aria-label={`Edit ${slot.day} ${slot.programTitle}`}
                              className="text-[#64748B] hover:text-[#07152C] dark:text-[#A3B4CC] dark:hover:text-white cursor-pointer"
                            >
                              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(slot)}
                              aria-label={`Delete ${slot.day} ${slot.programTitle}`}
                              className="text-[#C8202B]/75 hover:text-[#C8202B] dark:text-[#FCA5A5]/80 dark:hover:text-[#FCA5A5] cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <p className="font-medium text-[#07152C] dark:text-[#D5A52B]">
                          {slot.batchName}
                        </p>
                        <p className="text-[11px] text-[#64748B] dark:text-[#A3B4CC]">
                          {slot.timePlaceholder}
                        </p>
                        <p className="text-[11px] text-[#64748B] dark:text-[#A3B4CC]">
                          Coach: {slot.coachName}
                        </p>
                        <p className="text-[11px] text-[#64748B] dark:text-[#A3B4CC]">
                          Zone: {slot.groundZone}
                        </p>
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
              <thead className="bg-[#F5F7FA] text-[#64748B] dark:bg-[#07152C] dark:text-[#A3B4CC]">
                <tr className="border-b border-[#E2E8F0] dark:border-white/10">
                  <th className="px-4 py-3 font-semibold">Day</th>
                  <th className="px-4 py-3 font-semibold">Batch &amp; Program</th>
                  <th className="px-4 py-3 font-semibold">Coach</th>
                  <th className="px-4 py-3 font-semibold">Time &amp; Zone</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-white/10">
                {state.schedules.map((slot) => (
                  <tr
                    key={slot.id}
                    className="hover:bg-[#F5F7FA]/60 dark:hover:bg-[#162B4D]/60"
                  >
                    <td className="px-4 py-3 font-bold text-[#07152C] dark:text-white">
                      {slot.day}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[#07152C] dark:text-white">
                        {slot.batchName}
                      </p>
                      <p className="text-[11px] text-[#64748B] dark:text-[#A3B4CC]">
                        {slot.programTitle}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-[#64748B] dark:text-[#A3B4CC]">
                      {slot.coachName}
                    </td>
                    <td className="px-4 py-3 text-[#64748B] dark:text-[#A3B4CC]">
                      <p>{slot.timePlaceholder}</p>
                      <p className="text-[11px]">{slot.groundZone}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(slot)}
                        >
                          Edit
                        </Button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(slot)}
                          aria-label={`Delete ${slot.day} slot`}
                          className="inline-flex h-10 items-center justify-center rounded-[10px] border border-[#C8202B]/30 px-2.5 text-xs text-[#C8202B] hover:bg-[#C8202B]/10 dark:border-[#F87171]/35 dark:text-[#FCA5A5] cursor-pointer"
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
          {formError && (
            <p className="text-xs font-semibold text-[#C8202B] dark:text-[#FCA5A5]">
              {formError}
            </p>
          )}
          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4 dark:border-white/10">
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
