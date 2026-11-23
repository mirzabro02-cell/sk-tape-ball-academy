import {
  BookOpen,
  CalendarClock,
  CreditCard,
  FileCheck2,
  Trophy,
  UserCheck,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DEMO_DASHBOARD_CHARTS,
  INITIAL_ADMIN_APPLICATIONS,
  INITIAL_ADMIN_MATCHES,
  INITIAL_ADMIN_PROGRAMS,
  INITIAL_ADMIN_STUDENTS,
  INITIAL_ADMIN_TRIALS,
} from '@/src/data/adminMockData';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import {
  AdminBarChart,
  AdminLineChart,
} from '@/src/components/admin/AdminCharts';
import {
  AdminDemoNotice,
  AdminPageHeader,
  AdminStatCard,
  AdminStatusBadge,
} from '@/src/components/admin/AdminPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

export function AdminDashboardPage() {
  useDocumentTitle('Admin Dashboard');

  const totalStudents = INITIAL_ADMIN_STUDENTS.length;
  const activeStudents = INITIAL_ADMIN_STUDENTS.filter((s) => s.status === 'Active').length;
  const pendingAdmissions = INITIAL_ADMIN_APPLICATIONS.filter(
    (a) => a.status === 'Pending' || a.status === 'Under Review',
  ).length;
  const trialRequests = INITIAL_ADMIN_TRIALS.filter(
    (t) => t.status === 'Requested (Unconfirmed)',
  ).length;
  const upcomingMatches = INITIAL_ADMIN_MATCHES.filter((m) => m.status === 'Upcoming').length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Academy Overview Dashboard"
        description="Consolidated demonstration snapshot of academy rosters, admissions, trials, schedules, and fee tracking."
        actions={
          <>
            <Button to="/admin/admissions" variant="outline" size="sm">
              Review Applications
            </Button>
            <Button to="/admin/students" variant="primary" size="sm">
              Manage Students
            </Button>
          </>
        }
      />

      <AdminDemoNotice text="All counts, charts, and timelines below use clearly labelled demonstration sample records—never real academy statistics or live financials." />

      {/* 8 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Students (Demo)"
          value={totalStudents}
          hint="Sample demonstration roster"
          icon={Users}
          tone="navy"
        />
        <AdminStatCard
          label="Active Students (Demo)"
          value={activeStudents}
          hint="Currently assigned to batches"
          icon={UserCheck}
          tone="gold"
        />
        <AdminStatCard
          label="Total Coaches (Demo)"
          value={3}
          hint="Profile placeholders ready"
          icon={UserCheck}
        />
        <AdminStatCard
          label="Training Programs"
          value={INITIAL_ADMIN_PROGRAMS.length}
          hint="Active & draft curriculum tracks"
          icon={BookOpen}
        />
        <AdminStatCard
          label="Pending Admissions (Demo)"
          value={pendingAdmissions}
          hint="Pending or Under Review"
          icon={FileCheck2}
          tone="red"
        />
        <AdminStatCard
          label="Trial Requests (Demo)"
          value={trialRequests}
          hint="Unconfirmed requests awaiting action"
          icon={CalendarClock}
        />
        <AdminStatCard
          label="Upcoming Matches (Demo)"
          value={upcomingMatches}
          hint="Scheduled fixture placeholders"
          icon={Trophy}
        />
        <AdminStatCard
          label="Fee Overview (Demo)"
          value="1 / 3 Paid"
          hint="Amounts pending official policy"
          icon={CreditCard}
          tone="gold"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#071A36]">
                Admission Activity (Demonstration)
              </h2>
              <p className="text-xs text-[#64748B]">
                Sample weekly inquiries compared against reviewed applications
              </p>
            </div>
            <Link
              to="/admin/reports"
              className="text-xs font-semibold text-[#071A36] hover:text-[#C8202B] whitespace-nowrap"
            >
              Open Reports
            </Link>
          </div>
          <AdminBarChart
            data={DEMO_DASHBOARD_CHARTS.admissionActivity}
            primaryLabel="Applications Received"
            secondaryLabel="Reviewed"
          />
        </Card>

        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#071A36]">
                Student Enrollment Trend (Demonstration)
              </h2>
              <p className="text-xs text-[#64748B]">
                Sample progression illustration across six placeholder periods
              </p>
            </div>
            <Link
              to="/admin/students"
              className="text-xs font-semibold text-[#071A36] hover:text-[#C8202B] whitespace-nowrap"
            >
              View Roster
            </Link>
          </div>
          <AdminLineChart
            data={DEMO_DASHBOARD_CHARTS.studentEnrollment}
            seriesLabel="Sample Enrolled Count"
          />
        </Card>
      </div>

      {/* Bottom Operational Grids */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Recent Applications */}
        <Card padding="md" className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
            <h2 className="text-base font-bold text-[#071A36]">
              Recent Applications (Demo)
            </h2>
            <Link
              to="/admin/admissions"
              className="text-xs font-semibold text-[#071A36] hover:text-[#C8202B]"
            >
              Manage All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B]">
                  <th className="py-2.5 pr-3 font-semibold">Reference</th>
                  <th className="py-2.5 pr-3 font-semibold">Applicant</th>
                  <th className="py-2.5 pr-3 font-semibold">Program</th>
                  <th className="py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {INITIAL_ADMIN_APPLICATIONS.slice(0, 4).map((app) => (
                  <tr key={app.id} className="hover:bg-[#F5F7FA]/70">
                    <td className="py-2.5 pr-3 font-mono font-semibold text-[#071A36] whitespace-nowrap">
                      {app.referencePlaceholder}
                    </td>
                    <td className="py-2.5 pr-3 font-medium text-[#071A36]">
                      {app.applicantName}
                    </td>
                    <td className="py-2.5 pr-3 text-[#64748B]">{app.requestedProgram}</td>
                    <td className="py-2.5">
                      <AdminStatusBadge
                        label={app.status}
                        variant={
                          app.status === 'Approved'
                            ? 'success'
                            : app.status === 'Rejected'
                              ? 'danger'
                              : app.status === 'Under Review'
                                ? 'navy'
                                : 'warning'
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card padding="md" className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
            <h2 className="text-base font-bold text-[#071A36]">Upcoming Events</h2>
            <Link
              to="/admin/matches"
              className="text-xs font-semibold text-[#071A36] hover:text-[#C8202B]"
            >
              Matches
            </Link>
          </div>
          <div className="space-y-3">
            {INITIAL_ADMIN_MATCHES.map((m) => (
              <div
                key={m.id}
                className="rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] p-3 space-y-1"
              >
                <p className="text-xs font-bold text-[#071A36]">{m.title}</p>
                <p className="text-[11px] text-[#64748B]">
                  {m.datePlaceholder} · {m.locationPlaceholder}
                </p>
                <div className="pt-1">
                  <AdminStatusBadge
                    label={m.status}
                    variant={m.status === 'Completed' ? 'success' : 'navy'}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity Timeline */}
        <Card padding="md" className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
            <h2 className="text-base font-bold text-[#071A36]">Activity Timeline</h2>
          </div>
          <ol className="space-y-3">
            {DEMO_DASHBOARD_CHARTS.recentTimeline.map((entry) => (
              <li key={entry.id} className="space-y-0.5 border-b border-[#E2E8F0] pb-2.5 last:border-b-0 last:pb-0">
                <p className="text-xs font-bold text-[#071A36]">{entry.title}</p>
                <p className="text-[11px] leading-relaxed text-[#64748B]">{entry.detail}</p>
                <p className="text-[10px] font-semibold text-[#64748B]">{entry.timeLabel}</p>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
