import { useState, type FormEvent } from 'react';
import { Calendar, List, Pencil, Plus } from 'lucide-react';
import {
  INITIAL_ADMIN_BATCHES,
  INITIAL_ADMIN_COACHES,
  INITIAL_ADMIN_SCHEDULES,
} from '@/src/data/adminMockData';
import { SCHEDULE_DAYS, type ScheduleDay } from '@/src/data/activitiesContent';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminScheduleItem } from '@/src/types/admin';
import {
  AdminDemoNotice,
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

  const [schedules, setSchedules] = useState<AdminScheduleItem[]>(INITIAL_ADMIN_SCHEDULES);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminScheduleItem | null>(null);

  const [day, setDay] = useState<ScheduleDay>('Monday');
  const [timePlaceholder, setTimePlaceholder] = useState('[Time Slot Placeholder]');
  const [batchId, setBatchId] = useState(INITIAL_ADMIN_BATCHES[0].id);
  const [coachName, setCoachName] = useState(INITIAL_ADMIN_COACHES[0].fullName);
  const [groundZone, setGroundZone] = useState('Main Practice Nets (Placeholder)');

  function openAdd(defaultDay?: ScheduleDay) {
    setEditing(null);
    setDay(defaultDay ?? 'Monday');
    setTimePlaceholder('[Time Slot Placeholder]');
    setBatchId(INITIAL_ADMIN_BATCHES[0].id);
    setCoachName(INITIAL_ADMIN_COACHES[0].fullName);
    setGroundZone('Main Practice Nets (Placeholder)');
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
    const batch = INITIAL_ADMIN_BATCHES.find((b) => b.id === batchId);
    const batchName = batch?.name ?? 'Batch Placeholder';
    const programTitle = batch?.programTitle ?? 'Training Track';

    if (editing) {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editing.id
            ? { ...s, day, timePlaceholder, batchId, batchName, coachName, programTitle, groundZone }
            : s,
        ),
      );
      showToast('Schedule Updated (Preview)', `${day} slot updated in demonstration calendar.`);
    } else {
      const next: AdminScheduleItem = {
        id: `sch-${Date.now()}`,
        day,
        timePlaceholder,
        batchId,
        batchName,
        coachName,
        programTitle,
        groundZone,
      };
      setSchedules((prev) => [...prev, next]);
      showToast('Schedule Added (Preview)', `New ${day} placeholder slot created.`);
    }
    setFormOpen(false);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Schedule Management"
        description="Manage weekly training slot placeholders, batch assignments, coaches, and ground zones."
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

      <AdminDemoNotice text="All days, times, and ground zones shown below are structured placeholder slots until official academy batch timings are published." />

      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {SCHEDULE_DAYS.map((dayName) => {
            const items = schedules.filter((s) => s.day === dayName);
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
                  <p className="py-6 text-center text-xs text-[#64748B]">No slots configured</p>
                ) : (
                  <div className="space-y-2.5">
                    {items.map((slot) => (
                      <div
                        key={slot.id}
                        className="rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] p-3 space-y-1.5 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-[#071A36]">{slot.programTitle}</span>
                          <button
                            type="button"
                            onClick={() => openEdit(slot)}
                            aria-label={`Edit ${slot.day} ${slot.programTitle}`}
                            className="text-[#64748B] hover:text-[#071A36] cursor-pointer"
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
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
                  <th className="px-4 py-3 font-semibold text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {schedules.map((slot) => (
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
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(slot)}
                      >
                        Edit
                      </Button>
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
              label="Training Time Placeholder"
              value={timePlaceholder}
              onChange={(e) => setTimePlaceholder(e.target.value)}
              placeholder="[Time Slot Placeholder]"
              required
            />
            <Select
              label="Assign Batch"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              options={INITIAL_ADMIN_BATCHES.map((b) => ({ value: b.id, label: b.name }))}
            />
            <Select
              label="Assign Coach"
              value={coachName}
              onChange={(e) => setCoachName(e.target.value)}
              options={INITIAL_ADMIN_COACHES.map((c) => ({ value: c.fullName, label: c.fullName }))}
            />
          </div>
          <Input
            label="Ground / Training Zone"
            value={groundZone}
            onChange={(e) => setGroundZone(e.target.value)}
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
    </div>
  );
}
