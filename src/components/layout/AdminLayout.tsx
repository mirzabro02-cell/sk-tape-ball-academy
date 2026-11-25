import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  CalendarClock,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileCheck2,
  Globe,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Trophy,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { OFFICIAL_LOGO_CONFIG } from '@/src/assets/branding';
import { useAcademyState } from '@/src/context/AcademyStateContext';
import { useAdminAuth } from '@/src/context/AdminAuthContext';
import {
  ADMIN_BASE_PATH,
  ADMIN_ROUTE_META,
  ADMIN_SIDEBAR_GROUPS,
  type AdminSidebarItem,
} from '@/src/data/adminNav';
import type { AdminNotification } from '@/src/types/admin';
import { OfficialLogo } from '@/src/components/ui/OfficialLogo';
import { AdminConfirmDialog } from '@/src/components/admin/AdminPrimitives';
import { AdminToastProvider, useAdminToast } from '@/src/components/admin/AdminToastContext';
import { cn } from '@/src/utils/cn';

const SIDEBAR_ICONS: Record<AdminSidebarItem['iconName'], typeof LayoutDashboard> = {
  LayoutDashboard,
  Users,
  UserCheck,
  BookOpen,
  Layers,
  Calendar,
  FileCheck2,
  CalendarClock,
  CreditCard,
  ClipboardList,
  Trophy,
  Award,
  Image: ImageIcon,
  MessageSquareQuote,
  Newspaper,
  Globe,
  BarChart3,
  Settings,
};

function AdminShellInner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useAdminToast();
  const { state } = useAcademyState();
  const { user, signOut } = useAdminAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  const routeMeta = ADMIN_ROUTE_META[location.pathname] ?? {
    title: 'Admin Portal',
    group: 'Overview',
  };

  // Build dynamic alerts from real submitted applications/trials in state
  const pendingApps = state.applications.filter(
    (a) => a.status === 'Pending' || a.status === 'Under Review',
  ).length;
  const pendingTrials = state.trials.filter(
    (t) => t.status === 'Requested (Unconfirmed)',
  ).length;

  const liveNotifications: AdminNotification[] = [
    ...(pendingApps > 0
      ? [
          {
            id: 'notif-apps',
            title: `${pendingApps} Admission Application${pendingApps > 1 ? 's' : ''} Pending`,
            detail: 'Review applicant details and batch assignment in Admissions.',
            timeLabel: 'Action Required',
            unread: !dismissedIds.includes('notif-apps'),
            route: `${ADMIN_BASE_PATH}/admissions`,
          },
        ]
      : []),
    ...(pendingTrials > 0
      ? [
          {
            id: 'notif-trials',
            title: `${pendingTrials} Unconfirmed Trial Request${pendingTrials > 1 ? 's' : ''}`,
            detail: 'Assign dates and confirm slots in Trial Bookings.',
            timeLabel: 'Action Required',
            unread: !dismissedIds.includes('notif-trials'),
            route: `${ADMIN_BASE_PATH}/trial-bookings`,
          },
        ]
      : []),
  ];

  const unreadCount = liveNotifications.filter((n) => n.unread).length;
  const displayName = user?.displayName || state.siteSettings.adminDisplayName || 'Administrator';
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('') || 'SK';

  function markAllNotificationsRead() {
    setDismissedIds(liveNotifications.map((n) => n.id));
    showToast('Notifications cleared', 'All notifications marked as read.', 'info');
  }

  async function handleConfirmSignOut() {
    await signOut();
    navigate(`${ADMIN_BASE_PATH}/login`, { replace: true });
  }

  const crestSrc = state.siteSettings.logo.src || OFFICIAL_LOGO_CONFIG.src;

  return (
    <div className="min-h-screen flex bg-[#F5F7FA] text-[#071A36]">
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-[10px] focus:bg-[#071A36] focus:px-4 focus:py-2.5 focus:text-xs focus:font-bold focus:text-[#D9A52E] focus:shadow-lg"
      >
        Skip to admin content
      </a>

      {/* Sticky Viewport-Height Desktop Sidebar (prevents vertical page stretching on short pages) */}
      <aside
        className={cn(
          'hidden lg:flex lg:sticky lg:top-0 lg:h-screen flex-col shrink-0 border-r border-white/10 bg-[#050D1B] text-white transition-[width] duration-200',
          sidebarCollapsed ? 'w-[78px]' : 'w-[264px]',
        )}
      >
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-4">
          {!sidebarCollapsed ? (
            <OfficialLogo tone="dark" to={ADMIN_BASE_PATH} size="sm" />
          ) : (
            <Link
              to={ADMIN_BASE_PATH}
              aria-label="SK Tape Ball Academy Management Portal"
              className="mx-auto inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-[8px]"
            >
              <img src={crestSrc} alt="SK Crest" className="h-9 w-9 object-contain" />
            </Link>
          )}
        </div>

        <nav
          aria-label="Admin Sidebar Navigation"
          className="flex-1 overflow-y-auto px-3 py-4 space-y-5"
        >
          {ADMIN_SIDEBAR_GROUPS.map((group) => (
            <div key={group.heading} className="space-y-1">
              {!sidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                  {group.heading}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = SIDEBAR_ICONS[item.iconName];
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === ADMIN_BASE_PATH}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-[10px] px-3 py-2 text-sm font-medium transition-colors',
                          sidebarCollapsed && 'justify-center px-2',
                          isActive
                            ? 'bg-[#D9A52E] text-[#050D1B] font-semibold'
                            : 'text-white/75 hover:bg-white/10 hover:text-white',
                        )
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-white/10 p-3">
          <Link
            to="/"
            title={sidebarCollapsed ? 'Public Website' : undefined}
            className={cn(
              'flex items-center gap-2.5 rounded-[10px] border border-white/15 px-3 py-2 text-xs font-semibold text-white/85 hover:bg-white/10 transition-colors',
              sidebarCollapsed && 'justify-center px-2',
            )}
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {!sidebarCollapsed && <span>Return to Public Site</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Admin Mobile Navigation"
        >
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#050D1B]/65 backdrop-blur-[2px]"
          />
          <aside className="fixed inset-y-0 left-0 flex w-72 flex-col bg-[#050D1B] text-white shadow-2xl border-r border-white/10">
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-4">
              <OfficialLogo
                tone="dark"
                to={ADMIN_BASE_PATH}
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
              />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close admin sidebar"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/15 text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
              {ADMIN_SIDEBAR_GROUPS.map((group) => (
                <div key={group.heading} className="space-y-1">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                    {group.heading}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = SIDEBAR_ICONS[item.iconName];
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          end={item.path === ADMIN_BASE_PATH}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center gap-3 rounded-[10px] px-3 py-2 text-sm font-medium transition-colors',
                              isActive
                                ? 'bg-[#D9A52E] text-[#050D1B] font-semibold'
                                : 'text-white/80 hover:bg-white/10 hover:text-white',
                            )
                          }
                        >
                          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="shrink-0 border-t border-white/10 p-3">
              <Link
                to="/"
                className="flex items-center gap-2 rounded-[10px] border border-white/15 px-3 py-2.5 text-xs font-semibold text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Return to Public Site</span>
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-[#E2E8F0] bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open admin sidebar"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#E2E8F0] text-[#071A36] hover:bg-[#F5F7FA] lg:hidden cursor-pointer"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden lg:inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#E2E8F0] text-[#071A36] hover:bg-[#F5F7FA] cursor-pointer"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
              ) : (
                <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <div className="min-w-0">
              <nav
                aria-label="Admin Breadcrumbs"
                className="flex items-center gap-1.5 text-[11px] font-medium text-[#64748B]"
              >
                <Link to={ADMIN_BASE_PATH} className="hover:text-[#071A36] whitespace-nowrap">
                  Portal
                </Link>
                <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span className="truncate">{routeMeta.group}</span>
              </nav>
              <p className="truncate text-sm font-bold text-[#071A36]">{routeMeta.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/"
              className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-[#E2E8F0] px-3 text-xs font-semibold text-[#071A36] hover:bg-[#F5F7FA] whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Public Site</span>
            </Link>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen((prev) => !prev);
                  setProfileMenuOpen(false);
                }}
                aria-label="Toggle admin notifications"
                aria-expanded={notificationsOpen}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E2E8F0] text-[#071A36] hover:bg-[#F5F7FA] cursor-pointer"
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#C8202B] px-1 text-[10px] font-bold text-white tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-[14px] border border-[#E2E8F0] bg-white p-4 shadow-xl z-40 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
                    <p className="text-xs font-bold text-[#071A36]">Notifications</p>
                    {liveNotifications.length > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="text-[11px] font-semibold text-[#C8202B] hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  {liveNotifications.length === 0 ? (
                    <p className="py-4 text-center text-xs text-[#64748B]">
                      No pending items require attention.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {liveNotifications.map((item) => (
                        <Link
                          key={item.id}
                          to={item.route}
                          onClick={() => setNotificationsOpen(false)}
                          className={cn(
                            'block rounded-[10px] border p-2.5 text-left transition-colors hover:border-[#071A36]/30',
                            item.unread
                              ? 'border-[#D9A52E]/50 bg-[#F5F7FA]'
                              : 'border-[#E2E8F0] bg-white',
                          )}
                        >
                          <p className="text-xs font-bold text-[#071A36]">{item.title}</p>
                          <p className="mt-0.5 text-[11px] text-[#64748B]">{item.detail}</p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Admin Profile Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen((prev) => !prev);
                  setNotificationsOpen(false);
                }}
                aria-expanded={profileMenuOpen}
                className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] px-2.5 text-left hover:border-[#071A36]/30 cursor-pointer"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#071A36] text-[11px] font-bold text-[#D9A52E]">
                  {initials}
                </span>
                <span className="hidden md:block leading-tight max-w-[140px]">
                  <span className="block truncate text-xs font-bold text-[#071A36]">
                    {displayName}
                  </span>
                  <span className="block truncate text-[10px] text-[#64748B]">
                    {user?.email || 'Administrator'}
                  </span>
                </span>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-[14px] border border-[#E2E8F0] bg-white p-2 shadow-xl z-40 space-y-1">
                  <div className="border-b border-[#E2E8F0] px-3 py-2">
                    <p className="text-xs font-bold text-[#071A36] truncate">{displayName}</p>
                    <p className="text-[11px] text-[#64748B] truncate">{user?.email}</p>
                  </div>
                  <Link
                    to={`${ADMIN_BASE_PATH}/settings`}
                    className="flex items-center gap-2 rounded-[8px] px-3 py-2 text-xs font-medium text-[#071A36] hover:bg-[#F5F7FA]"
                  >
                    <Settings className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>System Settings</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setLogoutConfirmOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-xs font-semibold text-[#C8202B] hover:bg-[#C8202B]/5 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area — compact natural flow without vertical spacer voids */}
        <main
          id="admin-main-content"
          className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 max-w-[1440px] w-full mx-auto"
        >
          <Outlet />
        </main>

        <footer className="shrink-0 border-t border-[#E2E8F0] bg-white px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
          <span>{state.siteSettings.academyName} · Management Portal</span>
          <span>{state.siteSettings.locationText}</span>
        </footer>
      </div>

      <AdminConfirmDialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={() => void handleConfirmSignOut()}
        title="Sign Out of Management Portal"
        message="End your current administrator session and return to the protected login screen?"
        confirmLabel="Sign Out"
        tone="primary"
      />
    </div>
  );
}

export function AdminLayout() {
  return (
    <AdminToastProvider>
      <AdminShellInner />
    </AdminToastProvider>
  );
}
