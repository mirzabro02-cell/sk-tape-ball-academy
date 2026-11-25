import { useMemo, useState, type FormEvent } from 'react';
import { CalendarClock, CheckCircle2, XCircle } from 'lucide-react';
import { INITIAL_ADMIN_TRIALS } from '@/src/data/adminMockData';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminTrialBooking, TrialBookingStatus } from '@/src/types/admin';
import {
  AdminConfirmDialog,
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
import { Textarea } from '@/src/components/ui/Textarea';

const TRIAL_BADGE: Record<TrialBookingStatus, 'warning' | 'success' | 'navy' | 'danger'> = {
  'Requested (Unconfirmed)': 'warning',
  Confirmed: 'success',
  Rescheduled: 'navy',
  Rejected: 'danger',
};

export function AdminTrialBookingsPage() {
  useDocumentTitle('Trial Booking Management');
  const { showToast } = useAdminToast();

  const [trials, setTrials] = useState<AdminTrialBooking[]>(INITIAL_ADMIN_TRIALS);
  const [statusFilter, setStatusFilter] = useState<'All' | TrialBookingStatus>('All');

  const [rescheduleTarget, setRescheduleTarget] = useState<AdminTrialBooking | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [staffNote, setStaffNote] = useState('');

  const [confirmTarget, setConfirmTarget] = useState<AdminTrialBooking | null>(null);
  const [rejectTarget, setRejectTarget] = useState<AdminTrialBooking | null>(null);

  const filtered = useMemo(() => {
    if (statusFilter === 'All') return trials;
    return trials.filter((t) => t.status === statusFilter);
  }, [trials, statusFilter]);

  function openReschedule(trial: AdminTrialBooking) {
    setRescheduleTarget(trial);
    setNewDate(trial.preferredDate);
    setNewTimeSlot(trial.preferredTimeSlot);
    setStaffNote(trial.staffNote);
  }

  function handleSaveReschedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rescheduleTarget || !newDate) return;

    setTrials((prev) =>
      prev.map((t) =>
        t.id === rescheduleTarget.id
          ? {
              ...t,
              preferredDate: newDate,
              preferredTimeSlot: newTimeSlot,
              staffNote,
              status: 'Rescheduled',
            }
          : t,
      ),
    );
    showToast(
      'Trial Rescheduled (Preview)',
      `${rescheduleTarget.playerName} moved to ${newDate} (${newTimeSlot}).`,
      'info',
    );
    setRescheduleTarget(null);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Trial Booking Management"
        description="Review incoming free trial session requests. Incoming requests remain unconfirmed until manually approved by staff."
      />

      <AdminDemoNotice text="Important policy rule: A submitted trial request is never treated as a confirmed booking automatically—staff must explicitly Confirm, Reschedule, or Reject each request." />

      <div className="flex flex-wrap gap-2">
        {(
          [
            'All',
            'Requested (Unconfirmed)',
            'Confirmed',
            'Rescheduled',
            'Rejected',
          ] as const
        ).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-[10px] border px-3 py-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap ${
              statusFilter === status
                ? 'border-[#071A36] bg-[#071A36] text-white'
                : 'border-[#E2E8F0] bg-white text-[#071A36] hover:bg-[#F5F7FA]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <Card padding="sm" className="overflow-hidden">
        {filtered.length === 0 ? (
          <AdminEmptyState
            title="No trial bookings in this status"
            description="Select All to view all demonstration trial session requests."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-[#64748B]">
                <tr className="border-b border-[#E2E8F0]">
                  <th className="px-4 py-3 font-semibold">Request</th>
                  <th className="px-4 py-3 font-semibold">Player &amp; Program</th>
                  <th className="px-4 py-3 font-semibold">Preferred Date &amp; Time</th>
                  <th className="px-4 py-3 font-semibold">Booking Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filtered.map((trial) => (
                  <tr key={trial.id} className="hover:bg-[#F5F7FA]/60">
                    <td className="px-4 py-3 font-mono font-semibold text-[#071A36] whitespace-nowrap">
                      {trial.requestCode}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-[#071A36]">{trial.playerName}</p>
                      <p className="text-[11px] text-[#64748B]">
                        {trial.ageGroup} · {trial.requestedProgram}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-mono font-semibold text-[#071A36] tabular-nums">
                        {trial.preferredDate}
                      </p>
                      <p className="text-[11px] text-[#64748B]">{trial.preferredTimeSlot}</p>
                    </td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge
                        label={trial.status}
                        variant={TRIAL_BADGE[trial.status]}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex flex-wrap justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => setConfirmTarget(trial)}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Confirm</span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openReschedule(trial)}
                        >
                          <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Reschedule</span>
                        </Button>
                        <Button
                          type="button"
                          variant="accent"
                          size="sm"
                          onClick={() => setRejectTarget(trial)}
                        >
                          <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Reject</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <AdminModal
        open={Boolean(rescheduleTarget)}
        onClose={() => setRescheduleTarget(null)}
        title="Reschedule Trial Session"
        subtitle={rescheduleTarget?.playerName}
        maxWidth="md"
      >
        <form onSubmit={handleSaveReschedule} className="space-y-4">
          <Input
            label="Proposed Date"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            required
          />
          <Input
            label="Proposed Time Slot"
            value={newTimeSlot}
            onChange={(e) => setNewTimeSlot(e.target.value)}
            placeholder="e.g. Evening Slot (Placeholder)"
            required
          />
          <Textarea
            label="Staff Reschedule Note"
            value={staffNote}
            onChange={(e) => setStaffNote(e.target.value)}
          />
          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRescheduleTarget(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Reschedule
            </Button>
          </div>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        open={Boolean(confirmTarget)}
        onClose={() => setConfirmTarget(null)}
        onConfirm={() => {
          if (!confirmTarget) return;
          setTrials((prev) =>
            prev.map((t) =>
              t.id === confirmTarget.id ? { ...t, status: 'Confirmed' } : t,
            ),
          );
          showToast(
            'Trial Request Confirmed (Preview)',
            `${confirmTarget.playerName} marked Confirmed in demonstration session.`,
          );
        }}
        title="Confirm Trial Booking Request"
        message={`Mark trial request for ${confirmTarget?.playerName ?? ''} on ${confirmTarget?.preferredDate ?? ''} as Confirmed?`}
        confirmLabel="Confirm Booking"
        tone="primary"
      />

      <AdminConfirmDialog
        open={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        onConfirm={() => {
          if (!rejectTarget) return;
          setTrials((prev) =>
            prev.map((t) =>
              t.id === rejectTarget.id ? { ...t, status: 'Rejected' } : t,
            ),
          );
          showToast(
            'Trial Request Rejected (Preview)',
            `${rejectTarget.playerName} marked Rejected in demonstration session.`,
            'warning',
          );
        }}
        title="Reject Trial Request"
        message={`Reject trial request ${rejectTarget?.requestCode ?? ''}? You can propose a different date via Reschedule instead.`}
        confirmLabel="Reject Request"
        tone="danger"
      />
    </div>
  );
}
