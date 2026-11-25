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
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { ADMIN_BASE_PATH } from '@/src/data/adminNav';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import {
  AdminDonutBreakdown,
} from '@/src/components/admin/AdminCharts';
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminStatCard,
  AdminStatusBadge,
} from '@/src/components/admin/AdminPrimitives';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

export function AdminDashboardPage() {
  useDocumentTitle('Academy Portal Dashboard');
  const { state } = useAcademyState();

  const totalStudents = state.students.length;
  const activeStudents = state.students.filter((s) => s.status === 'Active').length;
  const trialStudents = state.students.filter((s) => s.status === 'Trial').length;
  const onHoldStudents = state.students.filter((s) => s.status === 'On Hold').length;

  const totalCoaches = state.coaches.length;
  const activePrograms = state.programs.filter((p) => p.published).length;
  const pendingAdmissions = state.applications.filter(
    (a) => a.status === 'Pending' || a.status === 'Under Review',
  ).length;
  const trialRequests = state.trials.filter(
    (t) => t.status === 'Requested (Unconfirmed)',
  ).length;
  const upcomingMatches = state.matches.filter((m) => m.status === 'Upcoming').length;
  const paidFees = state.feeRecords.filter((f) => f.status === 'Paid').length;

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Academy Overview"
        description="Live summary of registered athletes, coaching staff, training tracks, applications, trials, and schedule entries."
        actions={
          <>
            <Button to={`${ADMIN_BASE_PATH}/admissions`} variant="outline" size="sm">
              Admissions ({pendingAdmissions})
            </Button>
            <Button to={`${ADMIN_BASE_PATH}/students`} variant="primary" size="sm">
              Manage Students
            </Button>
          </>
        }
      />

      {/* 8 Live KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Students"
          value={totalStudents}
          hint={totalStudents === 0 ? 'Add students or convert approved admissions' : 'Enrolled academy athletes'}
          icon={Users}
          tone="navy"
        />
        <AdminStatCard
          label="Active Students"
          value={activeStudents}
          hint="Currently assigned to active training"
          icon={UserCheck}
          tone="gold"
        />
        <AdminStatCard
          label="Coaching Staff"
          value={totalCoaches}
          hint={totalCoaches === 0 ? 'Publish coach profiles in Coaches' : 'Verified staff profiles'}
          icon={UserCheck}
        />
        <AdminStatCard
          label="Published Programs"
          value={activePrograms}
          hint={`Out of ${state.programs.length} academy tracks`}
          icon={BookOpen}
        />
        <AdminStatCard
          label="Pending Admissions"
          value={pendingAdmissions}
          hint="Pending or Under Review"
          icon={FileCheck2}
          tone={pendingAdmissions > 0 ? 'red' : 'default'}
        />
        <AdminStatCard
          label="Trial Requests"
          value={trialRequests}
          hint="Unconfirmed requests awaiting review"
          icon={CalendarClock}
        />
        <AdminStatCard
          label="Upcoming Matches"
          value={upcomingMatches}
          hint="Scheduled academy fixtures"
          icon={Trophy}
        />
        <AdminStatCard
          label="Fee Records"
          value={state.feeRecords.length > 0 ? `${paidFees} / ${state.feeRecords.length} Paid` : '0'}
          hint={state.siteSettings.showPublicFees ? 'Public fee packages visible' : 'Fee visibility set to private'}
          icon={CreditCard}
          tone="gold"
        />
      </div>

      {/* Distribution Overview */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start">
        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#071A36]">Student Status Breakdown</h2>
              <p className="text-xs text-[#64748B]">Current roster composition across status groups</p>
            </div>
            <Link
              to={`${ADMIN_BASE_PATH}/students`}
              className="text-xs font-semibold text-[#071A36] hover:text-[#C8202B] whitespace-nowrap"
            >
              View Roster
            </Link>
          </div>
          {totalStudents === 0 ? (
            <AdminEmptyState
              title="No students enrolled yet"
              description="Approved admission applicants can be converted to students, or add a student directly."
              action={
                <Button to={`${ADMIN_BASE_PATH}/students`} variant="outline" size="sm">
                  Go to Students
                </Button>
              }
            />
          ) : (
            <AdminDonutBreakdown
              segments={[
                { label: 'Active', count: activeStudents, color: '#071A36' },
                { label: 'Trial', count: trialStudents, color: '#D9A52E' },
                { label: 'On Hold', count: onHoldStudents, color: '#C8202B' },
              ]}
            />
          )}
        </Card>

        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#071A36]">Fee Record Status</h2>
              <p className="text-xs text-[#64748B]">Overview of recorded student invoices</p>
            </div>
            <Link
              to={`${ADMIN_BASE_PATH}/fees`}
              className="text-xs font-semibold text-[#071A36] hover:text-[#C8202B] whitespace-nowrap"
            >
              Manage Fees
            </Link>
          </div>
          {state.feeRecords.length === 0 ? (
            <AdminEmptyState
              title="No fee invoices recorded"
              description="Create fee packages and log student invoices in the Fees section when ready."
              action={
                <Button to={`${ADMIN_BASE_PATH}/fees`} variant="outline" size="sm">
                  Open Fees Manager
                </Button>
              }
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
      </div>

      {/* Bottom Operational Grids */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
        {/* Recent Applications */}
        <Card padding="md" className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
            <h2 className="text-base font-bold text-[#071A36]">Recent Admissions</h2>
            <Link
              to={`${ADMIN_BASE_PATH}/admissions`}
              className="text-xs font-semibold text-[#071A36] hover:text-[#C8202B]"
            >
              Manage All
            </Link>
          </div>

          {state.applications.length === 0 ? (
            <AdminEmptyState
              title="No incoming applications"
              description="Player registrations submitted via the public /register form appear here automatically."
            />
          ) : (
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
                  {state.applications.slice(0, 5).map((app) => (
                    <tr key={app.id} className="hover:bg-[#F5F7FA]/70">
                      <td className="py-2.5 pr-3 font-mono font-semibold text-[#071A36] whitespace-nowrap">
                        {app.referencePlaceholder}
                      </td>
                      <td className="py-2.5 pr-3 font-medium text-[#071A36]">{app.applicantName}</td>
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
          )}
        </Card>

        {/* Upcoming Matches */}
        <Card padding="md" className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
            <h2 className="text-base font-bold text-[#071A36]">Matches &amp; Events</h2>
            <Link
              to={`${ADMIN_BASE_PATH}/matches`}
              className="text-xs font-semibold text-[#071A36] hover:text-[#C8202B]"
            >
              Manage Matches
            </Link>
          </div>
          {state.matches.length === 0 ? (
            <AdminEmptyState
              title="No fixtures scheduled"
              description="Create tape ball league fixtures or single-wicket events in Matches."
            />
          ) : (
            <div className="space-y-3">
              {state.matches.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  className="rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] p-3 space-y-1"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-[#071A36]">{m.title}</p>
                    <AdminStatusBadge
                      label={m.status}
                      variant={m.status === 'Completed' ? 'success' : 'navy'}
                    />
                  </div>
                  <p className="text-[11px] text-[#64748B]">
                    {m.datePlaceholder} · {m.locationPlaceholder}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
