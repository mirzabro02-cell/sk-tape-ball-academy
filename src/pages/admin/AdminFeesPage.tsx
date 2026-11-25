import { useMemo, useState, type FormEvent } from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type {
  AdminFeePackage,
  AdminFeeRecord,
  AdminPaymentHistoryItem,
  FeePaymentStatus,
} from '@/src/types/admin';
import { AdminDonutBreakdown } from '@/src/components/admin/AdminCharts';
import {
  AdminConfirmDialog,
  AdminEmptyState,
  AdminModal,
  AdminPageHeader,
  AdminStatCard,
  AdminStatusBadge,
} from '@/src/components/admin/AdminPrimitives';
import { containsUnsafeHtml } from '@/src/utils/validation';
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
  const { state, setFeePackages, setFeeRecords, setPaymentHistory } = useAcademyState();

  const [statusFilter, setStatusFilter] = useState<'All' | FeePaymentStatus>('All');
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [deletePkgTarget, setDeletePkgTarget] = useState<AdminFeePackage | null>(null);

  // Fee Package Form
  const [pkgName, setPkgName] = useState('');
  const [pkgScope, setPkgScope] = useState(state.programs[0]?.title ?? 'All Core Tracks');
  const [pkgCycle, setPkgCycle] = useState('Monthly');
  const [pkgAmount, setPkgAmount] = useState('');
  const [pkgStatus, setPkgStatus] = useState<'Active' | 'Draft'>('Active');
  const [pkgError, setPkgError] = useState<string | null>(null);

  // New Invoice Record Form
  const [invStudentName, setInvStudentName] = useState('');
  const [invProgram, setInvProgram] = useState(state.programs[0]?.title ?? 'Tape Ball Batting');
  const [invPackageName, setInvPackageName] = useState('');
  const [invAmount, setInvAmount] = useState('');
  const [invDueDate, setInvDueDate] = useState('');
  const [invError, setInvError] = useState<string | null>(null);

  // Payment Entry Form
  const [selectedRecordId, setSelectedRecordId] = useState('');
  const [amountNote, setAmountNote] = useState('');
  const [methodNote, setMethodNote] = useState('Cash / Academy Desk');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [payError, setPayError] = useState<string | null>(null);

  const counts = useMemo(() => {
    return {
      paid: state.feeRecords.filter((r) => r.status === 'Paid').length,
      pending: state.feeRecords.filter((r) => r.status === 'Pending').length,
      overdue: state.feeRecords.filter((r) => r.status === 'Overdue').length,
    };
  }, [state.feeRecords]);

  const filteredRecords = useMemo(() => {
    if (statusFilter === 'All') return state.feeRecords;
    return state.feeRecords.filter((r) => r.status === statusFilter);
  }, [state.feeRecords, statusFilter]);

  function handleSavePackage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pkgName.trim() || !pkgAmount.trim()) {
      setPkgError('Package title and fee amount are required.');
      return;
    }
    if (containsUnsafeHtml([pkgName, pkgScope, pkgCycle, pkgAmount])) {
      setPkgError('HTML tags (< or >) are not permitted.');
      return;
    }
    setPkgError(null);
    const item: AdminFeePackage = {
      id: `pkg-${Date.now()}`,
      name: pkgName.trim(),
      programScope: pkgScope.trim(),
      billingCycle: pkgCycle.trim(),
      amountPlaceholder: pkgAmount.trim(),
      status: pkgStatus,
    };
    setFeePackages((prev) => [item, ...prev]);
    showToast('Fee Package Created', `${item.name} saved.`);
    setPkgName('');
    setPkgAmount('');
    setPackageModalOpen(false);
  }

  function handleCreateInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!invStudentName.trim() || !invAmount.trim()) {
      setInvError('Student full name and invoice amount are required.');
      return;
    }
    if (containsUnsafeHtml([invStudentName, invPackageName, invAmount, invDueDate])) {
      setInvError('HTML tags (< or >) are not permitted.');
      return;
    }
    setInvError(null);
    const rec: AdminFeeRecord = {
      id: `fee-${Date.now()}`,
      invoiceCode: `INV-${String(state.feeRecords.length + 1).padStart(4, '0')}`,
      studentName: invStudentName.trim(),
      program: invProgram,
      packageName: invPackageName.trim() || 'Standard Enrollment',
      amountPlaceholder: invAmount.trim(),
      dueDateLabel: invDueDate.trim() || 'End of Month',
      status: 'Pending',
      lastPaymentNote: 'Awaiting payment.',
    };
    setFeeRecords((prev) => [rec, ...prev]);
    showToast('Invoice Created', `${rec.invoiceCode} added for ${rec.studentName}.`);
    setInvStudentName('');
    setInvAmount('');
    setInvoiceModalOpen(false);
  }

  function handleRecordPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = state.feeRecords.find((r) => r.id === selectedRecordId);
    if (!target) {
      setPayError('Please select a valid invoice record.');
      return;
    }
    if (!amountNote.trim() || !methodNote.trim()) {
      setPayError('Payment amount and method are required.');
      return;
    }
    if (containsUnsafeHtml([amountNote, methodNote, paymentNotes])) {
      setPayError('HTML tags (< or >) are not permitted.');
      return;
    }
    setPayError(null);

    setFeeRecords((prev) =>
      prev.map((r) =>
        r.id === target.id
          ? {
              ...r,
              status: 'Paid',
              lastPaymentNote: paymentNotes.trim() || 'Payment recorded.',
            }
          : r,
      ),
    );

    const newHist: AdminPaymentHistoryItem = {
      id: `pay-${Date.now()}`,
      invoiceCode: target.invoiceCode,
      studentName: target.studentName,
      amountPlaceholder: amountNote.trim() || target.amountPlaceholder,
      methodPlaceholder: methodNote.trim(),
      recordedLabel: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      notes: paymentNotes.trim() || 'Recorded by academy administrator.',
    };
    setPaymentHistory((prev) => [newHist, ...prev]);
    showToast('Payment Logged', `${target.invoiceCode} marked Paid.`);
    setPaymentModalOpen(false);
    setPaymentNotes('');
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Fees & Payments Management"
        description="Manage published academy fee packages, student fee invoices, and payment history."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setPkgError(null);
                setPackageModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Add Fee Package</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setInvError(null);
                setInvoiceModalOpen(true);
              }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>Add Invoice</span>
            </Button>
            {state.feeRecords.length > 0 && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  setPayError(null);
                  setSelectedRecordId(state.feeRecords[0]?.id ?? '');
                  setAmountNote(state.feeRecords[0]?.amountPlaceholder ?? '');
                  setPaymentModalOpen(true);
                }}
              >
                <CreditCard className="h-4 w-4" aria-hidden="true" />
                <span>Log Payment</span>
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard
          label="Paid Invoices"
          value={counts.paid}
          hint="Invoices settled"
          icon={CreditCard}
          tone="gold"
        />
        <AdminStatCard
          label="Pending Invoices"
          value={counts.pending}
          hint="Awaiting settlement"
          icon={CreditCard}
        />
        <AdminStatCard
          label="Overdue Invoices"
          value={counts.overdue}
          hint="Requires follow-up"
          icon={CreditCard}
          tone={counts.overdue > 0 ? 'red' : 'default'}
        />
      </div>

      {state.feeRecords.length > 0 && (
        <Card padding="md" className="space-y-4">
          <h2 className="text-base font-bold text-[#071A36]">Fee Status Distribution</h2>
          <AdminDonutBreakdown
            segments={[
              { label: 'Paid', count: counts.paid, color: '#D9A52E' },
              { label: 'Pending', count: counts.pending, color: '#071A36' },
              { label: 'Overdue', count: counts.overdue, color: '#C8202B' },
            ]}
          />
        </Card>
      )}

      {/* Fee Packages */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#071A36]">Fee Packages</h2>
            <p className="text-xs text-[#64748B]">
              Enable &ldquo;Display Official Fee Packages on Public Website&rdquo; in Settings once approved packages are ready.
            </p>
          </div>
        </div>
        {state.feePackages.length === 0 ? (
          <AdminEmptyState
            title="No fee packages configured"
            description="Add an official fee package once pricing and billing cycles are finalized."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 items-start">
            {state.feePackages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 break-words font-bold text-[#071A36]">{pkg.name}</p>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <AdminStatusBadge
                      label={pkg.status}
                      variant={pkg.status === 'Active' ? 'success' : 'neutral'}
                    />
                    <button
                      type="button"
                      onClick={() => setDeletePkgTarget(pkg)}
                      aria-label={`Remove ${pkg.name}`}
                      className="text-[#C8202B]/70 hover:text-[#C8202B] cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <p className="text-[#64748B]">{pkg.programScope}</p>
                <p className="font-semibold text-[#071A36]">{pkg.billingCycle}</p>
                <p className="font-mono text-xs font-bold text-[#071A36]">{pkg.amountPlaceholder}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Student Fee Records */}
      <Card padding="md" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-bold text-[#071A36]">Student Fee Records</h2>
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

        {filteredRecords.length === 0 ? (
          <AdminEmptyState
            title="No student fee records"
            description="Create a student invoice above to start tracking monthly or program fee status."
          />
        ) : (
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
        )}
      </Card>

      {/* Payment History */}
      <Card padding="md" className="space-y-4">
        <h2 className="text-base font-bold text-[#071A36]">Payment History Log</h2>
        {state.paymentHistory.length === 0 ? (
          <p className="text-xs text-[#64748B]">No payments recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {state.paymentHistory.map((item) => (
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
        )}
      </Card>

      {/* Modals */}
      <AdminModal
        open={packageModalOpen}
        onClose={() => setPackageModalOpen(false)}
        title="Add Fee Package"
        maxWidth="md"
      >
        <form onSubmit={handleSavePackage} className="space-y-4">
          <Input
            label="Package Title"
            value={pkgName}
            onChange={(e) => setPkgName(e.target.value)}
            placeholder="e.g. Monthly Foundation Training"
            required
          />
          <Input
            label="Included Track / Scope"
            value={pkgScope}
            onChange={(e) => setPkgScope(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Billing Cycle"
              value={pkgCycle}
              onChange={(e) => setPkgCycle(e.target.value)}
              placeholder="e.g. Monthly"
              required
            />
            <Input
              label="Fee Amount"
              value={pkgAmount}
              onChange={(e) => setPkgAmount(e.target.value)}
              placeholder="e.g. PKR 5,000 / month"
              required
            />
          </div>
          <Select
            label="Package Status"
            value={pkgStatus}
            onChange={(e) => setPkgStatus(e.target.value as 'Active' | 'Draft')}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Draft', label: 'Draft' },
            ]}
          />
          {pkgError && <p className="text-xs font-semibold text-[#C8202B]">{pkgError}</p>}
          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setPackageModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Package
            </Button>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        open={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        title="Create Student Invoice"
        maxWidth="md"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <Input
            label="Student Full Name"
            value={invStudentName}
            onChange={(e) => setInvStudentName(e.target.value)}
            required
          />
          <Select
            label="Program Track"
            value={invProgram}
            onChange={(e) => setInvProgram(e.target.value)}
            options={state.programs.map((p) => ({ value: p.title, label: p.title }))}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Package Label"
              value={invPackageName}
              onChange={(e) => setInvPackageName(e.target.value)}
              placeholder="e.g. Monthly Training"
            />
            <Input
              label="Amount"
              value={invAmount}
              onChange={(e) => setInvAmount(e.target.value)}
              placeholder="e.g. PKR 5,000"
              required
            />
          </div>
          <Input
            label="Due Date"
            value={invDueDate}
            onChange={(e) => setInvDueDate(e.target.value)}
            placeholder="e.g. 05 Dec 2026"
          />
          {invError && <p className="text-xs font-semibold text-[#C8202B]">{invError}</p>}
          <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setInvoiceModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Create Invoice
            </Button>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Log Fee Payment"
        maxWidth="md"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <Select
            label="Select Invoice Record"
            value={selectedRecordId}
            onChange={(e) => setSelectedRecordId(e.target.value)}
            options={state.feeRecords.map((r) => ({
              value: r.id,
              label: `${r.invoiceCode} — ${r.studentName} (${r.status})`,
            }))}
          />
          <Input
            label="Amount Received"
            value={amountNote}
            onChange={(e) => setAmountNote(e.target.value)}
            required
          />
          <Input
            label="Payment Method"
            value={methodNote}
            onChange={(e) => setMethodNote(e.target.value)}
            required
          />
          <Textarea
            label="Receipt / Notes"
            value={paymentNotes}
            onChange={(e) => setPaymentNotes(e.target.value)}
          />
          {payError && <p className="text-xs font-semibold text-[#C8202B]">{payError}</p>}
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
              Save Payment
            </Button>
          </div>
        </form>
      </AdminModal>

      <AdminConfirmDialog
        open={Boolean(deletePkgTarget)}
        onClose={() => setDeletePkgTarget(null)}
        onConfirm={() => {
          if (!deletePkgTarget) return;
          setFeePackages((prev) => prev.filter((p) => p.id !== deletePkgTarget.id));
          showToast('Fee Package Deleted', `${deletePkgTarget.name} removed.`, 'warning');
        }}
        title="Delete Fee Package"
        message={`Remove fee package "${deletePkgTarget?.name ?? ''}"? Existing student invoices will not be altered.`}
        confirmLabel="Delete Package"
        tone="danger"
      />
    </div>
  );
}
