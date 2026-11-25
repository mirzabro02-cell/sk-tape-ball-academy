import {
  BookOpen,
  CreditCard,
  FileCheck2,
  Globe,
  Plus,
  Trophy,
  UserCheck,
  Users,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { ADMIN_BASE_PATH } from '@/src/data/adminNav';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { AdminDonutBreakdown, AdminLineChart } from '@/src/components/admin/AdminCharts';
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
  const onHoldStudents = state.students.filter((s) => s.status === 'On Hold').length;
  const inactiveStudents = state.students.filter((s) => s.status === 'Inactive').length;

  const totalCoaches = state.coaches.length;
  const activePrograms = state.programs.filter((p) => p.published).length;
  const pendingAdmissions = state.applications.filter(
    (a) => a.status === 'Pending' || a.status === 'Under Review',
  ).length;
  const upcomingMatches = state.matches.filter((m) => m.status === 'Upcoming').length;
  const paidFees = state.feeRecords.filter((f) => f.status === 'Paid').length;

  const programTrackChartData = state.programs.slice(0, 6).map((prog) => ({
    label: prog.title.split(' ')[0] || prog.code,
    value: state.students.filter((s) => s.program === prog.title).length,
  }));

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="Academy Overview"
        description="Live summary of registered athletes, coaching staff, training tracks, admissions, fixtures, and fee records."
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

      {/* Live KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Students"
          value={totalStudents}
          hint={
            totalStudents === 0
              ? 'Add students or convert approved admissions'
              : 'Enrolled academy athletes'
          }
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
          label="Upcoming Matches"
          value={upcomingMatches}
          hint="Scheduled academy fixtures"
          icon={Trophy}
        />
        <AdminStatCard
          label="Fee Records"
          value={state.feeRecords.length > 0 ? `${paidFees} / ${state.feeRecords.length} Paid` : '0'}
          hint={
            state.siteSettings.showPublicFees
              ? 'Public fee packages visible'
              : 'Fee visibility set to private'
          }
          icon={CreditCard}
          tone="gold"
        />
        <AdminStatCard
          label="Training Batches"
          value={state.batches.length}
          hint="Active morning, evening & weekend groups"
          icon={BookOpen}
        />
      </div>

      {/* Enrollment Trend Chart + Quick Actions */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start">
        <Card padding="md" className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#07152C] dark:text-white">
                Student Enrollment by Program
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#A3B4CC]">
                Real-time player distribution across active academy coaching tracks
              </p>
            </div>
            <Link
              to={`${ADMIN_BASE_PATH}/reports`}
              className="text-xs font-semibold text-[#07152C] hover:text-[#C8202B] dark:text-[#D5A52B] dark:hover:text-[#E2B84A] whitespace-nowrap"
            >
              Full Reports
            </Link>
          </div>
          {totalStudents === 0 ? (
            <AdminEmptyState
              title="No enrollment data recorded yet"
              description="As players register or are added to training batches, their distribution across academy tracks appears here automatically."
              action={
                <Button to={`${ADMIN_BASE_PATH}/students`} variant="outline" size="sm">
                  Add First Student
                </Button>
              }
            />
          ) : (
            <AdminLineChart data={programTrackChartData} seriesLabel="Players per Track" />
          )}
        </Card>

        <Card padding="md" className="lg:col-span-4 space-y-3.5">
          <div>
            <h2 className="text-base font-bold text-[#07152C] dark:text-white">Quick Actions</h2>
            <p className="text-xs text-[#64748B] dark:text-[#A3B4CC]">
              Jump directly to common academy tasks
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <Link
              to={`${ADMIN_BASE_PATH}/students`}
              className="flex items-center justify-between rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] px-3.5 py-2.5 text-xs font-semibold text-[#07152C] hover:border-[#D5A52B] dark:border-white/10 dark:bg-[#07152C] dark:text-white dark:hover:border-[#D5A52B]/60 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Plus className="h-3.5 w-3.5 text-[#D5A52B]" aria-hidden="true" />
                <span>Enroll / Manage Students</span>
              </span>
            </Link>
            <Link
              to={`${ADMIN_BASE_PATH}/matches`}
              className="flex items-center justify-between rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] px-3.5 py-2.5 text-xs font-semibold text-[#07152C] hover:border-[#D5A52B] dark:border-white/10 dark:bg-[#07152C] dark:text-white dark:hover:border-[#D5A52B]/60 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Trophy className="h-3.5 w-3.5 text-[#D5A52B]" aria-hidden="true" />
                <span>Schedule Match / Result</span>
              </span>
            </Link>
            <Link
              to={`${ADMIN_BASE_PATH}/website-content`}
              className="flex items-center justify-between rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] px-3.5 py-2.5 text-xs font-semibold text-[#07152C] hover:border-[#D5A52B] dark:border-white/10 dark:bg-[#07152C] dark:text-white dark:hover:border-[#D5A52B]/60 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-[#D5A52B]" aria-hidden="true" />
                <span>Edit Website Content (CMS)</span>
              </span>
            </Link>
            <Link
              to={`${ADMIN_BASE_PATH}/maintenance`}
              className="flex items-center justify-between rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] px-3.5 py-2.5 text-xs font-semibold text-[#07152C] hover:border-[#D5A52B] dark:border-white/10 dark:bg-[#07152C] dark:text-white dark:hover:border-[#D5A52B]/60 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Wrench className="h-3.5 w-3.5 text-[#D5A52B]" aria-hidden="true" />
                <span>
                  Maintenance Mode ({state.siteSettings.maintenance.enabled ? 'ON' : 'OFF'})
                </span>
              </span>
            </Link>
          </div>
        </Card>
      </div>

      {/* Distribution Overview */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start">
        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#07152C] dark:text-white">
                Student Status Breakdown
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#A3B4CC]">
                Current roster composition across status groups
              </p>
            </div>
            <Link
              to={`${ADMIN_BASE_PATH}/students`}
              className="text-xs font-semibold text-[#07152C] hover:text-[#C8202B] dark:text-[#D5A52B] dark:hover:text-[#E2B84A] whitespace-nowrap"
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
                { label: 'Active', count: activeStudents, color: '#D5A52B' },
                { label: 'On Hold', count: onHoldStudents, color: '#60A5FA' },
                { label: 'Inactive', count: inactiveStudents, color: '#C8202B' },
              ]}
            />
          )}
        </Card>

        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-[#07152C] dark:text-white">
                Fee Record Status
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#A3B4CC]">
                Overview of recorded student invoices
              </p>
            </div>
            <Link
              to={`${ADMIN_BASE_PATH}/fees`}
              className="text-xs font-semibold text-[#07152C] hover:text-[#C8202B] dark:text-[#D5A52B] dark:hover:text-[#E2B84A] whitespace-nowrap"
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
                  color: '#D5A52B',
                },
                {
                  label: 'Pending',
                  count: state.feeRecords.filter((f) => f.status === 'Pending').length,
                  color: '#60A5FA',
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
          <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3 dark:border-white/10">
            <h2 className="text-base font-bold text-[#07152C] dark:text-white">
              Recent Admissions
            </h2>
            <Link
              to={`${ADMIN_BASE_PATH}/admissions`}
              className="text-xs font-semibold text-[#07152C] hover:text-[#C8202B] dark:text-[#D5A52B] dark:hover:text-[#E2B84A]"
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
                  <tr className="border-b border-[#E2E8F0] text-[#64748B] dark:border-white/10 dark:text-[#A3B4CC]">
                    <th className="py-2.5 pr-3 font-semibold">Reference</th>
                    <th className="py-2.5 pr-3 font-semibold">Applicant</th>
                    <th className="py-2.5 pr-3 font-semibold">Program</th>
                    <th className="py-2.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] dark:divide-white/10">
                  {state.applications.slice(0, 5).map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-[#F5F7FA]/70 dark:hover:bg-[#162B4D]/60"
                    >
                      <td className="py-2.5 pr-3 font-mono font-semibold text-[#07152C] dark:text-[#D5A52B] whitespace-nowrap">
                        {app.referencePlaceholder}
                      </td>
                      <td className="py-2.5 pr-3 font-medium text-[#07152C] dark:text-white">
                        {app.applicantName}
                      </td>
                      <td className="py-2.5 pr-3 text-[#64748B] dark:text-[#A3B4CC]">
                        {app.requestedProgram}
                      </td>
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
          <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3 dark:border-white/10">
            <h2 className="text-base font-bold text-[#07152C] dark:text-white">
              Matches &amp; Events
            </h2>
            <Link
              to={`${ADMIN_BASE_PATH}/matches`}
              className="text-xs font-semibold text-[#07152C] hover:text-[#C8202B] dark:text-[#D5A52B] dark:hover:text-[#E2B84A]"
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
                  className="rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] p-3 space-y-1 dark:border-white/10 dark:bg-[#07152C]/80"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-[#07152C] dark:text-white">{m.title}</p>
                    <AdminStatusBadge
                      label={m.status}
                      variant={m.status === 'Completed' ? 'success' : 'navy'}
                    />
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#A3B4CC]">
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
