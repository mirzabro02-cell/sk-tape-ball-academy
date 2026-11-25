import { useMemo, useState, type FormEvent } from 'react';
import { Eye, Search, UserPlus } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminApplication, AdmissionDecisionStatus } from '@/src/types/admin';
import {
  AdminEmptyState,
  AdminModal,
  AdminPageHeader,
  AdminStatusBadge,
} from '@/src/components/admin/AdminPrimitives';
import { useAdminToast } from '@/src/components/admin/AdminToastContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Select } from '@/src/components/ui/Select';
import { Textarea } from '@/src/components/ui/Textarea';

const STATUS_FILTERS: ('All' | AdmissionDecisionStatus)[] = [
  'All',
  'Pending',
  'Under Review',
  'Approved',
  'Rejected',
  'More Information Required',
];

const ADMISSION_BADGE: Record<
  AdmissionDecisionStatus,
  'warning' | 'navy' | 'success' | 'danger' | 'neutral'
> = {
  Pending: 'warning',
  'Under Review': 'navy',
  Approved: 'success',
  Rejected: 'danger',
  'More Information Required': 'neutral',
};

export function AdminAdmissionsPage() {
  useDocumentTitle('Admission Management');
  const { showToast } = useAdminToast();
  const { state, reviewAdmission, convertAdmissionToStudent } = useAcademyState();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | AdmissionDecisionStatus>('All');

  const [reviewingApp, setReviewingApp] = useState<AdminApplication | null>(null);
  const [decisionStatus, setDecisionStatus] = useState<AdmissionDecisionStatus>('Under Review');
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [convertApp, setConvertApp] = useState<AdminApplication | null>(null);
  const [targetBatchId, setTargetBatchId] = useState(state.batches[0]?.id ?? '');

  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return state.applications.filter((app) => {
      const matchesQ =
        !q ||
        app.applicantName.toLowerCase().includes(q) ||
        app.referencePlaceholder.toLowerCase().includes(q) ||
        app.requestedProgram.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      return matchesQ && matchesStatus;
    });
  }, [state.applications, searchQuery, statusFilter]);

  function openReview(app: AdminApplication) {
    setReviewingApp(app);
    setDecisionStatus(app.status);
    setReviewerNotes(app.reviewerNotes);
  }

  async function handleSaveDecision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reviewingApp) return;

    setIsSaving(true);
    try {
      const res = await reviewAdmission(reviewingApp.id, decisionStatus, reviewerNotes);
      if (!res.ok) {
        showToast('Update Failed', res.error ?? 'Could not save admission decision.', 'warning');
        return;
      }
      showToast(
        'Application Updated',
        `${reviewingApp.applicantName} set to "${decisionStatus}".`,
      );
      setReviewingApp(null);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleConvertToStudent() {
    if (!convertApp) return;
    const batch = state.batches.find((b) => b.id === targetBatchId) ?? null;

    setIsSaving(true);
    try {
      const res = await convertAdmissionToStudent(convertApp, batch);
      if (!res.ok || !res.data) {
        showToast(
          'Enrollment Failed',
          res.error ?? 'Could not enroll applicant into Student Roster.',
          'warning',
        );
        return;
      }

      showToast(
        'Applicant Enrolled as Student',
        `${convertApp.applicantName} added to the Student Roster (${res.data.studentCode}).`,
      );
      setConvertApp(null);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Admission Applications"
        description="Review incoming student registrations, record admission decisions, and enroll approved applicants into the roster."
      />

      <Card padding="md" className="space-y-4">
        <div className="space-y-3">
          <div className="relative max-w-md">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#8499B8]"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search by applicant name, reference, or program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-[10px] border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm text-[#07152C] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#D5A52B]/60 dark:border-white/15 dark:bg-[#07152C] dark:text-white dark:placeholder:text-[#8499B8]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-[10px] border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'border-[#07152C] bg-[#07152C] text-white dark:border-[#D5A52B] dark:bg-[#D5A52B] dark:text-[#050D1B]'
                    : 'border-[#E2E8F0] bg-[#F5F7FA] text-[#07152C] hover:border-[#07152C]/40 dark:border-white/15 dark:bg-[#162B4D] dark:text-[#E2E8F0]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[12px] border border-[#E2E8F0] dark:border-white/10">
          {filteredApps.length === 0 ? (
            <AdminEmptyState
              title={
                state.applications.length === 0
                  ? 'No admission applications received yet'
                  : 'No applications match your filter'
              }
              description={
                state.applications.length === 0
                  ? 'Registrations submitted on the public /register page will appear here for review.'
                  : 'Try clearing the status filter or search query.'
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F7FA] text-[#64748B] dark:bg-[#07152C] dark:text-[#A3B4CC]">
                  <tr className="border-b border-[#E2E8F0] dark:border-white/10">
                    <th className="px-4 py-3 font-semibold">Reference</th>
                    <th className="px-4 py-3 font-semibold">Applicant</th>
                    <th className="px-4 py-3 font-semibold">Program</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white dark:divide-white/10 dark:bg-[#0F213B]">
                  {filteredApps.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-[#F5F7FA]/60 dark:hover:bg-[#162B4D]/60"
                    >
                      <td className="px-4 py-3 font-mono font-semibold text-[#07152C] dark:text-[#D5A52B] whitespace-nowrap">
                        {app.referencePlaceholder}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-[#07152C] dark:text-white">
                          {app.applicantName}
                        </p>
                        <p className="text-[11px] text-[#64748B] dark:text-[#A3B4CC]">
                          Age {app.age} {app.isMinor ? '(Minor · Guardian Listed)' : '(Adult)'}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-[#07152C] dark:text-[#E2E8F0]">
                        {app.requestedProgram}
                      </td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge
                          label={app.convertedToStudent ? 'Enrolled as Student' : app.status}
                          variant={app.convertedToStudent ? 'navy' : ADMISSION_BADGE[app.status]}
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openReview(app)}
                          >
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Review</span>
                          </Button>
                          {app.status === 'Approved' && !app.convertedToStudent && (
                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setTargetBatchId(state.batches[0]?.id ?? '');
                                setConvertApp(app);
                              }}
                            >
                              <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Convert</span>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      <AdminModal
        open={Boolean(reviewingApp)}
        onClose={() => setReviewingApp(null)}
        title={`Application Review — ${reviewingApp?.applicantName ?? ''}`}
        subtitle={reviewingApp?.referencePlaceholder}
      >
        {reviewingApp && (
          <form onSubmit={handleSaveDecision} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 text-xs dark:border-white/10 dark:bg-[#07152C]">
              <div>
                <p className="text-[#64748B] dark:text-[#A3B4CC]">Applicant Age</p>
                <p className="font-bold text-[#07152C] dark:text-white tabular-nums">
                  {reviewingApp.age} years ({reviewingApp.isMinor ? 'Minor' : 'Adult'})
                </p>
              </div>
              <div>
                <p className="text-[#64748B] dark:text-[#A3B4CC]">Guardian / Emergency Contact</p>
                <p className="font-bold text-[#07152C] dark:text-white">
                  {reviewingApp.guardianName}
                </p>
              </div>
              <div>
                <p className="text-[#64748B] dark:text-[#A3B4CC]">Contact Details</p>
                <p className="font-bold text-[#07152C] dark:text-white">
                  {reviewingApp.contactPlaceholder}
                </p>
              </div>
              <div>
                <p className="text-[#64748B] dark:text-[#A3B4CC]">Requested Program</p>
                <p className="font-bold text-[#07152C] dark:text-white">
                  {reviewingApp.requestedProgram}
                </p>
              </div>
            </div>

            <Select
              label="Admission Decision Status"
              value={decisionStatus}
              onChange={(e) => setDecisionStatus(e.target.value as AdmissionDecisionStatus)}
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'Under Review', label: 'Under Review' },
                { value: 'Approved', label: 'Approved' },
                { value: 'More Information Required', label: 'More Information Required' },
                { value: 'Rejected', label: 'Rejected' },
              ]}
            />

            <Textarea
              label="Reviewer Notes"
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
              placeholder="Document evaluation feedback, missing guardian details, or batch note..."
            />

            <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4 dark:border-white/10">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setReviewingApp(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Decision'}
              </Button>
            </div>
          </form>
        )}
      </AdminModal>

      <AdminModal
        open={Boolean(convertApp)}
        onClose={() => setConvertApp(null)}
        title="Convert Approved Applicant to Student"
        subtitle={convertApp ? `Enrolling ${convertApp.applicantName}` : undefined}
        maxWidth="md"
      >
        {convertApp && (
          <div className="space-y-4">
            <p className="text-xs leading-relaxed text-[#64748B] dark:text-[#A3B4CC]">
              Select the initial batch for{' '}
              <strong className="text-[#07152C] dark:text-white">{convertApp.applicantName}</strong>{' '}
              ({convertApp.requestedProgram}).
            </p>
            <Select
              label="Assign Initial Batch"
              value={targetBatchId}
              onChange={(e) => setTargetBatchId(e.target.value)}
              options={[
                { value: '', label: 'Unassigned (Assign Later)' },
                ...state.batches.map((b) => ({ value: b.id, label: b.name })),
              ]}
            />
            <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4 dark:border-white/10">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setConvertApp(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={isSaving}
                onClick={() => void handleConvertToStudent()}
              >
                {isSaving ? 'Enrolling...' : 'Confirm Student Enrollment'}
              </Button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
