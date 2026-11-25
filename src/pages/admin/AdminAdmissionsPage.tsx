import { useMemo, useState, type FormEvent } from 'react';
import { Eye, Search, UserPlus } from 'lucide-react';
import {
  INITIAL_ADMIN_APPLICATIONS,
  INITIAL_ADMIN_BATCHES,
} from '@/src/data/adminMockData';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import type { AdminApplication, AdmissionDecisionStatus } from '@/src/types/admin';
import {
  AdminDemoNotice,
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

  const [applications, setApplications] = useState<AdminApplication[]>(
    INITIAL_ADMIN_APPLICATIONS,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | AdmissionDecisionStatus>('All');

  const [reviewingApp, setReviewingApp] = useState<AdminApplication | null>(null);
  const [decisionStatus, setDecisionStatus] = useState<AdmissionDecisionStatus>('Under Review');
  const [reviewerNotes, setReviewerNotes] = useState('');

  const [convertApp, setConvertApp] = useState<AdminApplication | null>(null);
  const [targetBatchId, setTargetBatchId] = useState(INITIAL_ADMIN_BATCHES[0].id);

  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return applications.filter((app) => {
      const matchesQ =
        !q ||
        app.applicantName.toLowerCase().includes(q) ||
        app.referencePlaceholder.toLowerCase().includes(q) ||
        app.requestedProgram.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      return matchesQ && matchesStatus;
    });
  }, [applications, searchQuery, statusFilter]);

  function openReview(app: AdminApplication) {
    setReviewingApp(app);
    setDecisionStatus(app.status);
    setReviewerNotes(app.reviewerNotes);
  }

  function handleSaveDecision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reviewingApp) return;

    setApplications((prev) =>
      prev.map((a) =>
        a.id === reviewingApp.id
          ? { ...a, status: decisionStatus, reviewerNotes }
          : a,
      ),
    );
    showToast(
      'Application Decision Updated (Preview)',
      `${reviewingApp.applicantName} set to "${decisionStatus}" in demonstration session.`,
    );
    setReviewingApp(null);
  }

  function handleConvertToStudent() {
    if (!convertApp) return;
    const batch = INITIAL_ADMIN_BATCHES.find((b) => b.id === targetBatchId);
    setApplications((prev) =>
      prev.map((a) =>
        a.id === convertApp.id ? { ...a, convertedToStudent: true } : a,
      ),
    );
    showToast(
      'Applicant Converted to Student (Preview)',
      `${convertApp.applicantName} queued for ${batch?.name ?? 'Selected Batch'} (demonstration action).`,
    );
    setConvertApp(null);
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Admission Applications"
        description="Review incoming student registrations, record admission decisions, and convert approved applicants."
      />

      <AdminDemoNotice />

      <Card padding="md" className="space-y-4">
        <div className="space-y-3">
          <div className="relative max-w-md">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search by applicant name, reference, or program..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-[10px] border border-[#E2E8F0] bg-white pl-10 pr-4 text-sm text-[#071A36]"
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
                    ? 'border-[#071A36] bg-[#071A36] text-white'
                    : 'border-[#E2E8F0] bg-[#F5F7FA] text-[#071A36] hover:border-[#071A36]/40'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[12px] border border-[#E2E8F0]">
          {filteredApps.length === 0 ? (
            <AdminEmptyState
              title="No applications match"
              description="Try clearing the status filter or search query."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F7FA] text-[#64748B]">
                  <tr className="border-b border-[#E2E8F0]">
                    <th className="px-4 py-3 font-semibold">Reference</th>
                    <th className="px-4 py-3 font-semibold">Applicant</th>
                    <th className="px-4 py-3 font-semibold">Program</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-[#F5F7FA]/60">
                      <td className="px-4 py-3 font-mono font-semibold text-[#071A36] whitespace-nowrap">
                        {app.referencePlaceholder}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-[#071A36]">{app.applicantName}</p>
                        <p className="text-[11px] text-[#64748B]">
                          Age {app.age} {app.isMinor ? '(Minor · Guardian Listed)' : '(Adult)'}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-[#071A36]">{app.requestedProgram}</td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge
                          label={app.convertedToStudent ? 'Converted to Student' : app.status}
                          variant={
                            app.convertedToStudent ? 'navy' : ADMISSION_BADGE[app.status]
                          }
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
                              onClick={() => setConvertApp(app)}
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

      {/* Review & Decision Modal */}
      <AdminModal
        open={Boolean(reviewingApp)}
        onClose={() => setReviewingApp(null)}
        title={`Application Review — ${reviewingApp?.applicantName ?? ''}`}
        subtitle={reviewingApp?.referencePlaceholder}
      >
        {reviewingApp && (
          <form onSubmit={handleSaveDecision} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-[12px] border border-[#E2E8F0] bg-[#F5F7FA] p-4 text-xs">
              <div>
                <p className="text-[#64748B]">Applicant Age</p>
                <p className="font-bold text-[#071A36] tabular-nums">
                  {reviewingApp.age} years ({reviewingApp.isMinor ? 'Minor' : 'Adult'})
                </p>
              </div>
              <div>
                <p className="text-[#64748B]">Guardian / Emergency Contact</p>
                <p className="font-bold text-[#071A36]">{reviewingApp.guardianName}</p>
              </div>
              <div>
                <p className="text-[#64748B]">Requested Program</p>
                <p className="font-bold text-[#071A36]">{reviewingApp.requestedProgram}</p>
              </div>
              <div>
                <p className="text-[#64748B]">Previous Experience</p>
                <p className="font-bold text-[#071A36]">{reviewingApp.experienceLevel}</p>
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
              placeholder="Document trial feedback, missing guardian details, or batch note..."
            />

            <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setReviewingApp(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Decision (Preview)
              </Button>
            </div>
          </form>
        )}
      </AdminModal>

      {/* Convert Approved Applicant Modal */}
      <AdminModal
        open={Boolean(convertApp)}
        onClose={() => setConvertApp(null)}
        title="Convert Approved Applicant to Student"
        subtitle={convertApp ? `Converting ${convertApp.applicantName}` : undefined}
        maxWidth="md"
      >
        {convertApp && (
          <div className="space-y-4">
            <p className="text-xs leading-relaxed text-[#64748B]">
              Select the initial demonstration batch for <strong className="text-[#071A36]">{convertApp.applicantName}</strong> ({convertApp.requestedProgram}).
            </p>
            <Select
              label="Assign Initial Batch"
              value={targetBatchId}
              onChange={(e) => setTargetBatchId(e.target.value)}
              options={INITIAL_ADMIN_BATCHES.map((b) => ({ value: b.id, label: b.name }))}
            />
            <div className="flex justify-end gap-3 border-t border-[#E2E8F0] pt-4">
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
                onClick={handleConvertToStudent}
              >
                Confirm Student Conversion
              </Button>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
