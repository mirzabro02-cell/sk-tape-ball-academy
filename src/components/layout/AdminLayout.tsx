import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
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
import { ADMIN_ROUTE_META, ADMIN_SIDEBAR_GROUPS, type AdminSidebarItem } from '@/src/data/adminNav';
import { INITIAL_ADMIN_NOTIFICATIONS } from '@/src/data/adminMockData';
import { ACADEMY_BRAND } from '@/src/data/brand';
import type { AdminNotification } from '@/src/types/admin';
import { OfficialLogo } from '@/src/components/ui/OfficialLogo';
import {
  AdminConfirmDialog,
} from '@/src/components/admin/AdminPrimitives';
import {
  AdminToastProvider,
  useAdminToast,
} from '@/src/components/admin/AdminToastContext';
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
  const { showToast } = useAdminToast();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>(
    INITIAL_ADMIN_NOTIFICATIONS,
  );

  useEffect(() => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  const routeMeta = ADMIN_ROUTE_META[location.pathname] ?? {
    title: 'Admin Portal',
    group: 'Overview',
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  function markAllNotificationsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('Notifications cleared', 'All demonstration alerts marked as read.', 'info');
  }

  return (
    <div className="min-h-screen flex bg-[#F5F7FA] text-[#071A36]">
      {/* Desktop Collapsible Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col shrink-0 border-r border-white/10 bg-[#050D1B] text-white transition-[width] duration-200',
          sidebarCollapsed ? 'w-[78px]' : 'w-[264px]',
        )}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-4">
          {!sidebarCollapsed ? (
            <OfficialLogo tone="dark" to="/admin" />
          ) : (
            <Link
              to="/admin"
              aria-label="SK Tape Ball Academy Admin"
              className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#D9A52E]/50 bg-[#071A36] text-xs font-extrabold text-[#D9A52E]"
            >
              SK
            </Link>
          )}
        </div>

        <nav
          aria-label="Admin Sidebar Navigation"
          className="flex-1 overflow-y-auto px-3 py-4 space-y-5"
        >
          {ADMIN_SIDEBAR_GROUPS.map((group) => (
            <div key={group.heading} className="space-y-1.5">
              {!sidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                  {group.heading}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = SIDEBAR_ICONS[item.iconName];
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/admin'}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors',
                          sidebarCollapsed && 'justify-center px-2',
                          isActive
                            ? 'bg-[#D9A52E] text-[#050D1B] font-semibold'
                            : 'text-white/75 hover:bg-white/10 hover:text-white',
                        )
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3 space-y-2">
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
            <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-4">
              <OfficialLogo tone="dark" to="/admin" onClick={() => setMobileMenuOpen(false)} />
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
                <div key={group.heading} className="space-y-1.5">
                  <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                    {group.heading}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = SIDEBAR_ICONS[item.iconName];
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          end={item.path === '/admin'}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-colors',
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

            <div className="border-t border-white/10 p-3 space-y-2">
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
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-4 border-b border-[#E2E8F0] bg-white px-4 sm:px-6">
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
                <Link to="/admin" className="hover:text-[#071A36] whitespace-nowrap">
                  Admin
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
                    <p className="text-xs font-bold text-[#071A36]">
                      Admin Notifications (Demo)
                    </p>
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-semibold text-[#C8202B] hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((item) => (
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
                        <p className="mt-1 text-[10px] font-semibold text-[#64748B]">
                          {item.timeLabel}
                        </p>
                      </Link>
                    ))}
                  </div>
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
                  AD
                </span>
                <span className="hidden md:block leading-tight">
                  <span className="block text-xs font-bold text-[#071A36]">
                    Admin Placeholder
                  </span>
                  <span className="block text-[10px] text-[#64748B]">Frontend Preview</span>
                </span>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-[14px] border border-[#E2E8F0] bg-white p-2 shadow-xl z-40 space-y-1">
                  <div className="border-b border-[#E2E8F0] px-3 py-2">
                    <p className="text-xs font-bold text-[#071A36]">Academy Administrator</p>
                    <p className="text-[11px] text-[#64748B]">
                      Role placeholder · Auth pending backend
                    </p>
                  </div>
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-2 rounded-[8px] px-3 py-2 text-xs font-medium text-[#071A36] hover:bg-[#F5F7FA]"
                  >
                    <Settings className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>System Settings</span>
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 rounded-[8px] px-3 py-2 text-xs font-medium text-[#071A36] hover:bg-[#F5F7FA]"
                  >
                    <Users className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Member Login Screen</span>
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
                    <span>Logout (Preview)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>

        <footer className="border-t border-[#E2E8F0] bg-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
          <span>
            {ACADEMY_BRAND.name} · Admin Dashboard UI (Frontend Demonstration Only)
          </span>
          <span>No live database writes · Backend integration pending next phase</span>
        </footer>
      </div>

      <AdminConfirmDialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={() => {
          showToast(
            'Logout Preview Triggered',
            'No active session exists yet. Real sign-out will connect with authentication in a later phase.',
            'info',
          );
        }}
        title="Admin Logout (Frontend Placeholder)"
        message="Authentication is not active yet in Part 7. Confirming displays a logout demonstration notice without clearing real credentials."
        confirmLabel="Simulate Logout"
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
