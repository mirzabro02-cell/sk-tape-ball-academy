import { useState } from 'react';
import { Download } from 'lucide-react';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { AdminBarChart, AdminDonutBreakdown } from '@/src/components/admin/AdminCharts';
import { AdminEmptyState, AdminPageHeader } from '@/src/components/admin/AdminPrimitives';
import { useAdminToast } from '@/src/components/admin/AdminToastContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

type ReportTab = 'enrollment' | 'admissions' | 'attendance' | 'fees' | 'matches';

const REPORT_TABS: { id: ReportTab; label: string }[] = [
  { id: 'enrollment', label: 'Student Enrollment' },
  { id: 'admissions', label: 'Admissions' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'fees', label: 'Fee Records' },
  { id: 'matches', label: 'Matches & Events' },
];

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((r) => r.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function AdminReportsPage() {
  useDocumentTitle('Academy Reports');
  const { showToast } = useAdminToast();
  const { state } = useAcademyState();

  const [activeTab, setActiveTab] = useState<ReportTab>('enrollment');

  function handleExportCsv() {
    if (activeTab === 'enrollment') {
      downloadCsv('sk-academy-students.csv', [
        ['Code', 'Full Name', 'Program', 'Batch', 'Status', 'Joined'],
        ...state.students.map((s) => [
          s.studentCode,
          s.fullName,
          s.program,
          s.batchName,
          s.status,
          s.joinedLabel,
        ]),
      ]);
    } else if (activeTab === 'admissions') {
      downloadCsv('sk-academy-admissions.csv', [
        ['Reference', 'Applicant', 'Program', 'Status', 'Submitted'],
        ...state.applications.map((a) => [
          a.referencePlaceholder,
          a.applicantName,
          a.requestedProgram,
          a.status,
          a.submittedLabel,
        ]),
      ]);
    } else if (activeTab === 'fees') {
      downloadCsv('sk-academy-fees.csv', [
        ['Invoice', 'Student', 'Package', 'Amount', 'Status'],
        ...state.feeRecords.map((f) => [
          f.invoiceCode,
          f.studentName,
          f.packageName,
          f.amountPlaceholder,
          f.status,
        ]),
      ]);
    } else if (activeTab === 'matches') {
      downloadCsv('sk-academy-matches.csv', [
        ['Title', 'Type', 'Teams', 'Date', 'Status'],
        ...state.matches.map((m) => [
          m.title,
          m.matchType,
          `${m.academyTeam} vs ${m.opponentTeam}`,
          m.datePlaceholder,
          m.status,
        ]),
      ]);
    } else {
      downloadCsv('sk-academy-attendance.csv', [
        ['Code', 'Student', 'Attendance %'],
        ...state.students.map((s) => [s.studentCode, s.fullName, `${s.attendanceRate}%`]),
      ]);
    }
    showToast('CSV Downloaded', `Exported ${activeTab} report CSV.`);
  }

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Academy Analytics & Reports"
        description="Inspect live enrollment, admission, attendance, fee, and match records across your academy state."
        actions={
          <Button type="button" variant="outline" size="sm" onClick={handleExportCsv}>
            <Download className="h-4 w-4" aria-hidden="true" />
            <span>Export CSV</span>
          </Button>
        }
      />

      <Card padding="md">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Report categories">
          {REPORT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-[10px] border px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#071A36] bg-[#071A36] text-white'
                  : 'border-[#E2E8F0] bg-[#F5F7FA] text-[#071A36] hover:border-[#071A36]/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {activeTab === 'enrollment' && (
        <Card padding="md" className="space-y-4">
          <h2 className="text-base font-bold text-[#071A36]">Student Status Breakdown</h2>
          {state.students.length === 0 ? (
            <AdminEmptyState
              title="No enrolled students yet"
              description="Student enrollment metrics will populate automatically as players are enrolled."
            />
          ) : (
            <AdminDonutBreakdown
              segments={[
                {
                  label: 'Active',
                  count: state.students.filter((s) => s.status === 'Active').length,
                  color: '#071A36',
                },
                {
                  label: 'Trial',
                  count: state.students.filter((s) => s.status === 'Trial').length,
                  color: '#D9A52E',
                },
                {
                  label: 'On Hold',
                  count: state.students.filter((s) => s.status === 'On Hold').length,
                  color: '#C8202B',
                },
              ]}
            />
          )}
        </Card>
      )}

      {activeTab === 'admissions' && (
        <Card padding="md" className="space-y-4">
          <h2 className="text-base font-bold text-[#071A36]">Decision Pipeline Snapshot</h2>
          {state.applications.length === 0 ? (
            <AdminEmptyState
              title="No applications submitted yet"
              description="Admission decision statuses will appear here once registrations arrive."
            />
          ) : (
            <div className="space-y-2 text-xs">
              {state.applications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] px-3.5 py-2.5"
                >
                  <span className="font-semibold text-[#071A36]">
                    {app.referencePlaceholder} · {app.applicantName}
                  </span>
                  <span className="font-bold text-[#071A36]">{app.status}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'attendance' && (
        <Card padding="md" className="space-y-4">
          <h2 className="text-base font-bold text-[#071A36]">Student Attendance Rates</h2>
          {state.students.length === 0 ? (
            <AdminEmptyState
              title="No attendance data available"
              description="Attendance rates appear once students are enrolled and sheets are logged."
            />
          ) : (
            <AdminBarChart
              data={state.students.map((s) => ({
                label: s.studentCode,
                value: s.attendanceRate,
              }))}
              primaryLabel="Attendance %"
            />
          )}
        </Card>
      )}

      {activeTab === 'fees' && (
        <Card padding="md" className="space-y-4">
          <h2 className="text-base font-bold text-[#071A36]">Fee Record Status Report</h2>
          {state.feeRecords.length === 0 ? (
            <AdminEmptyState
              title="No fee invoices recorded"
              description="Fee summary charts will populate when fee invoices are added."
            />
          ) : (
            <AdminDonutBreakdown
              segments={[
                {
                  label: 'Paid',
                  count: state.feeRecords.filter((f) => f.status === 'Paid').length,
                  color: '#D9A52E',
                },
                {
                  label: 'Pending',
                  count: state.feeRecords.filter((f) => f.status === 'Pending').length,
                  color: '#071A36',
                },
                {
                  label: 'Overdue',
                  count: state.feeRecords.filter((f) => f.status === 'Overdue').length,
                  color: '#C8202B',
                },
              ]}
            />
          )}
        </Card>
      )}

      {activeTab === 'matches' && (
        <Card padding="md" className="space-y-4">
          <h2 className="text-base font-bold text-[#071A36]">Match &amp; Event Activity Summary</h2>
          {state.matches.length === 0 ? (
            <AdminEmptyState
              title="No matches recorded"
              description="Match reports will appear here after fixtures are created."
            />
          ) : (
            <div className="overflow-x-auto rounded-[12px] border border-[#E2E8F0]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F7FA] text-[#64748B]">
                  <tr className="border-b border-[#E2E8F0]">
                    <th className="px-4 py-3 font-semibold">Fixture</th>
                    <th className="px-4 py-3 font-semibold">Teams</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {state.matches.map((m) => (
                    <tr key={m.id}>
                      <td className="px-4 py-3 font-bold text-[#071A36]">{m.title}</td>
                      <td className="px-4 py-3 text-[#64748B]">
                        {m.academyTeam} vs {m.opponentTeam}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#071A36]">{m.status}</td>
                      <td className="px-4 py-3 text-[#64748B]">{m.resultSummary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
