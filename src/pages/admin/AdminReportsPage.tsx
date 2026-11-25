import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import {
  DEMO_DASHBOARD_CHARTS,
  INITIAL_ADMIN_APPLICATIONS,
  INITIAL_ADMIN_MATCHES,
  INITIAL_ADMIN_STUDENTS,
  INITIAL_FEE_RECORDS,
} from '@/src/data/adminMockData';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import {
  AdminBarChart,
  AdminDonutBreakdown,
  AdminLineChart,
} from '@/src/components/admin/AdminCharts';
import {
  AdminDemoNotice,
  AdminPageHeader,
} from '@/src/components/admin/AdminPrimitives';
import { useAdminToast } from '@/src/components/admin/AdminToastContext';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';

type ReportTab = 'enrollment' | 'admissions' | 'attendance' | 'fees' | 'matches';

const REPORT_TABS: { id: ReportTab; label: string }[] = [
  { id: 'enrollment', label: 'Student Enrollment' },
  { id: 'admissions', label: 'Admissions' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'fees', label: 'Fee Records' },
  { id: 'matches', label: 'Matches & Events' },
];

export function AdminReportsPage() {
  useDocumentTitle('Academy Reports');
  const { showToast } = useAdminToast();

  const [activeTab, setActiveTab] = useState<ReportTab>('enrollment');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-11-30');

  function handleExportPlaceholder(format: 'CSV' | 'PDF') {
    showToast(
      `${format} Export Placeholder Triggered`,
      `Prepared demonstration "${activeTab}" report (${startDate} to ${endDate}). Live exports connect after backend reporting is integrated.`,
      'info',
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Academy Analytics & Reports"
        description="Inspect demonstration enrollment, admission, attendance, fee, and match activity reports."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleExportPlaceholder('CSV')}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>Export CSV (Placeholder)</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handleExportPlaceholder('PDF')}
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span>Export Summary (Placeholder)</span>
            </Button>
          </div>
        }
      />

      <AdminDemoNotice text="All charts, percentages, and breakdown figures on this page are clearly labelled demonstration metrics until live academy records exist." />

      {/* Controls */}
      <Card padding="md" className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="From Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="To Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Active Report Content */}
      {activeTab === 'enrollment' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card padding="md" className="space-y-4">
            <h2 className="text-base font-bold text-[#071A36]">
              Enrollment Progression ({startDate} to {endDate})
            </h2>
            <AdminLineChart
              data={DEMO_DASHBOARD_CHARTS.studentEnrollment}
              seriesLabel="Sample Enrolled Trajectory"
            />
          </Card>

          <Card padding="md" className="space-y-4">
            <h2 className="text-base font-bold text-[#071A36]">
              Program Track Breakdown (Demo Roster)
            </h2>
            <AdminDonutBreakdown
              segments={[
                {
                  label: 'Active',
                  count: INITIAL_ADMIN_STUDENTS.filter((s) => s.status === 'Active').length,
                  color: '#071A36',
                },
                {
                  label: 'Trial',
                  count: INITIAL_ADMIN_STUDENTS.filter((s) => s.status === 'Trial').length,
                  color: '#D9A52E',
                },
                {
                  label: 'On Hold',
                  count: INITIAL_ADMIN_STUDENTS.filter((s) => s.status === 'On Hold').length,
                  color: '#C8202B',
                },
              ]}
            />
          </Card>
        </div>
      )}

      {activeTab === 'admissions' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card padding="md" className="space-y-4">
            <h2 className="text-base font-bold text-[#071A36]">
              Weekly Application Funnel (Demo)
            </h2>
            <AdminBarChart
              data={DEMO_DASHBOARD_CHARTS.admissionActivity}
              primaryLabel="Received"
              secondaryLabel="Reviewed"
            />
          </Card>
          <Card padding="md" className="space-y-4">
            <h2 className="text-base font-bold text-[#071A36]">
              Decision Pipeline Snapshot
            </h2>
            <div className="space-y-2 text-xs">
              {INITIAL_ADMIN_APPLICATIONS.map((app) => (
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
          </Card>
        </div>
      )}

      {activeTab === 'attendance' && (
        <Card padding="md" className="space-y-4">
          <h2 className="text-base font-bold text-[#071A36]">
            Sample Student Attendance Rates (Demo)
          </h2>
          <AdminBarChart
            data={INITIAL_ADMIN_STUDENTS.map((s) => ({
              label: s.studentCode.replace('DEMO-', ''),
              value: s.attendanceRate,
            }))}
            primaryLabel="Attendance % (Demo)"
          />
        </Card>
      )}

      {activeTab === 'fees' && (
        <Card padding="md" className="space-y-4">
          <h2 className="text-base font-bold text-[#071A36]">
            Fee Record Status Report (Placeholders Only)
          </h2>
          <AdminDonutBreakdown
            segments={[
              {
                label: 'Paid',
                count: INITIAL_FEE_RECORDS.filter((f) => f.status === 'Paid').length,
                color: '#D9A52E',
              },
              {
                label: 'Pending',
                count: INITIAL_FEE_RECORDS.filter((f) => f.status === 'Pending').length,
                color: '#071A36',
              },
              {
                label: 'Overdue',
                count: INITIAL_FEE_RECORDS.filter((f) => f.status === 'Overdue').length,
                color: '#C8202B',
              },
            ]}
          />
        </Card>
      )}

      {activeTab === 'matches' && (
        <Card padding="md" className="space-y-4">
          <h2 className="text-base font-bold text-[#071A36]">
            Match &amp; Event Activity Summary (Demo)
          </h2>
          <div className="overflow-x-auto rounded-[12px] border border-[#E2E8F0]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FA] text-[#64748B]">
                <tr className="border-b border-[#E2E8F0]">
                  <th className="px-4 py-3 font-semibold">Fixture</th>
                  <th className="px-4 py-3 font-semibold">Teams</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Result Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {INITIAL_ADMIN_MATCHES.map((m) => (
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
        </Card>
      )}
    </div>
  );
}
