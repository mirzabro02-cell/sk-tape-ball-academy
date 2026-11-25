import { useMemo, useState, type FormEvent } from 'react';
import { CreditCard, Plus } from 'lucide-react';
import {
  INITIAL_FEE_PACKAGES,
  INITIAL_FEE_RECORDS,
  INITIAL_PAYMENT_HISTORY,
} from '@/src/data/adminMockData';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type {
  AdminFeeRecord,
  AdminPaymentHistoryItem,
  FeePaymentStatus,
} from '@/src/types/admin';
import { AdminDonutBreakdown } from '@/src/components/admin/AdminCharts';
import {
  AdminDemoNotice,
  AdminModal,
  AdminPageHeader,
  AdminStatCard,
  AdminStatusBadge,
} from '@/src/components/admin/AdminPrimitives';
import { useAdminToast } from '@/src/components/admin/AdminToastContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { Textarea } from '@/src/components/ui/Textarea';

const FEE_BADGE: Record<FeePaymentStatus, 'success' | 'warning' | 'danger'> = {
  Paid: 'success',
  Pending: 'warning',
  Overdue: 'danger',
};

export function AdminFeesPage() {
  useDocumentTitle('Fees Management');
  const { showToast } = useAdminToast();

  const [records, setRecords] = useState<AdminFeeRecord[]>(INITIAL_FEE_RECORDS);
  const [history, setHistory] = useState<AdminPaymentHistoryItem[]>(INITIAL_PAYMENT_HISTORY);
  const [statusFilter, setStatusFilter] = useState<'All' | FeePaymentStatus>('All');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const [selectedRecordId, setSelectedRecordId] = useState(INITIAL_FEE_RECORDS[1].id);
  const [amountNote, setAmountNote] = useState('[Amount Placeholder]');
  const [methodNote, setMethodNote] = useState('Bank Transfer / Desk (Demo)');
  const [paymentNotes, setPaymentNotes] = useState('');

  const counts = useMemo(() => {
    return {
      paid: records.filter((r) => r.status === 'Paid').length,
      pending: records.filter((r) => r.status === 'Pending').length,
      overdue: records.filter((r) => r.status === 'Overdue').length,
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    if (statusFilter === 'All') return records;
    return records.filter((r) => r.status === statusFilter);
  }, [records, statusFilter]);

  function handleRecordPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = records.find((r) => r.id === selectedRecordId);
    if (!target) return;

    setRecords((prev) =>
      prev.map((r) =>
        r.id === target.id
          ? {
              ...r,
              status: 'Paid',
              lastPaymentNote: paymentNotes.trim() || 'Marked Paid in session preview.',
            }
          : r,
      ),
    );

    const newHist: AdminPaymentHistoryItem = {
      id: `pay-${Date.now()}`,
      invoiceCode: target.invoiceCode,
      studentName: target.studentName,
      amountPlaceholder: amountNote,
      methodPlaceholder: methodNote,
      recordedLabel: 'Session Demo Entry',
      notes: paymentNotes.trim() || 'Frontend-only payment demonstration.',
    };
    setHistory((prev) => [newHist, ...prev]);

    showToast(
      'Payment Logged (Demonstration)',
      `${target.invoiceCode} marked Paid in local session state only.`,
    );
    setPaymentModalOpen(false);
    setPaymentNotes('');
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Fees & Payments Management"
        description="Manage fee package placeholders, student fee statuses, and demonstration payment logs."
        actions={
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setPaymentModalOpen(true)}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>Add Payment Entry</span>
          </Button>
        }
      />

      <AdminDemoNotice text="No actual fee amounts or real financial transactions exist here. Official fee structures and payment gateways will be added after academy approval." />

      {/* Overview & Summary Chart */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard
          label="Paid Records (Demo)"
          value={counts.paid}
          hint="Sample invoices settled"
          icon={CreditCard}
          tone="gold"
        />
        <AdminStatCard
          label="Pending Records (Demo)"
          value={counts.pending}
          hint="Awaiting confirmation"
          icon={CreditCard}
        />
        <AdminStatCard
          label="Overdue Records (Demo)"
          value={counts.overdue}
          hint="Needs staff follow-up"
          icon={CreditCard}
          tone="red"
        />
      </div>

      <Card padding="md" className="space-y-4">
        <h2 className="text-base font-bold text-[#071A36]">
          Fee Status Distribution (Demonstration)
        </h2>
        <AdminDonutBreakdown
          segments={[
            { label: 'Paid', count: counts.paid, color: '#D9A52E' },
            { label: 'Pending', count: counts.pending, color: '#071A36' },
            { label: 'Overdue', count: counts.overdue, color: '#C8202B' },
          ]}
        />
      </Card>

      {/* Fee Packages */}
      <Card padding="md" className="space-y-4">
        <h2 className="text-base font-bold text-[#071A36]">
          Fee Package Templates (Placeholders)
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {INITIAL_FEE_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 space-y-2 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold text-[#071A36]">{pkg.name}</p>
                <AdminStatusBadge
                  label={pkg.status}
                  variant={pkg.status === 'Active' ? 'success' : 'neutral'}
                />
              </div>
              <p className="text-[#64748B]">{pkg.programScope}</p>
              <p className="font-semibold text-[#071A36]">{pkg.billingCycle}</p>
              <p className="font-mono text-[11px] font-bold text-[#C8202B]">
                {pkg.amountPlaceholder}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Student Fee Records */}
      <Card padding="md" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-[#071A36]">Student Fee Records (Demo)</h2>
          <div className="flex flex-wrap gap-2">
            {(['All', 'Paid', 'Pending', 'Overdue'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-[10px] border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                  statusFilter === st
                    ? 'border-[#071A36] bg-[#071A36] text-white'
                    : 'border-[#E2E8F0] bg-[#F5F7FA] text-[#071A36]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-[12px] border border-[#E2E8F0]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FA] text-[#64748B]">
              <tr className="border-b border-[#E2E8F0]">
                <th className="px-4 py-3 font-semibold">Invoice</th>
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Package</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] bg-white">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#F5F7FA]/60">
                  <td className="px-4 py-3 font-mono font-semibold text-[#071A36] whitespace-nowrap">
                    {rec.invoiceCode}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-bold text-[#071A36]">{rec.studentName}</p>
                    <p className="text-[11px] text-[#64748B]">{rec.program}</p>
                  </td>
                  <td className="px-4 py-3 text-[#64748B]">{rec.packageName}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[#071A36]">
                    {rec.amountPlaceholder}
                  </td>
                  <td className="px-4 py-3">
                    <AdminStatusBadge label={rec.status} variant={FEE_BADGE[rec.status]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payment History */}
      <Card padding="md" className="space-y-4">
        <h2 className="text-base font-bold text-[#071A36]">Payment History Log (Demo)</h2>
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] px-4 py-3 text-xs"
            >
              <div>
                <p className="font-bold text-[#071A36]">
                  {item.invoiceCode} · {item.studentName}
                </p>
                <p className="text-[#64748B]">
                  {item.methodPlaceholder} — {item.notes}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono font-semibold text-[#071A36]">{item.amountPlaceholder}</p>
                <p className="text-[11px] text-[#64748B]">{item.recordedLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <AdminModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Add Payment Entry (Demonstration)"
        maxWidth="md"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <Select
            label="Select Student Fee Record"
            value={selectedRecordId}
            onChange={(e) => setSelectedRecordId(e.target.value)}
            options={records.map((r) => ({
              value: r.id,
              label: `${r.invoiceCode} — ${r.studentName} (${r.status})`,
            }))}
          />
          <Input
            label="Amount Label / Placeholder"
            value={amountNote}
            onChange={(e) => setAmountNote(e.target.value)}
            required
          />
          <Input
            label="Payment Channel Placeholder"
            value={methodNote}
            onChange={(e) => setMethodNote(e.target.value)}
            required
          />
          <Textarea
            label="Notes"
            value={paymentNotes}
            onChange={(e) => setPaymentNotes(e.target.value)}
            placeholder="Receipt or administrative reference note..."
          />
          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPaymentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Record Demo Payment
            </Button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
