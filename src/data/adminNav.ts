export interface AdminSidebarItem {
  label: string;
  path: string;
  iconName:
    | 'LayoutDashboard'
    | 'Users'
    | 'UserCheck'
    | 'BookOpen'
    | 'Layers'
    | 'Calendar'
    | 'FileCheck2'
    | 'CalendarClock'
    | 'CreditCard'
    | 'ClipboardList'
    | 'Trophy'
    | 'Award'
    | 'Image'
    | 'MessageSquareQuote'
    | 'Newspaper'
    | 'Globe'
    | 'BarChart3'
    | 'Settings';
}

export interface AdminSidebarGroup {
  heading: string;
  items: AdminSidebarItem[];
}

export const ADMIN_SIDEBAR_GROUPS: AdminSidebarGroup[] = [
  {
    heading: 'OVERVIEW',
    items: [{ label: 'Dashboard', path: '/admin', iconName: 'LayoutDashboard' }],
  },
  {
    heading: 'ACADEMY MANAGEMENT',
    items: [
      { label: 'Students', path: '/admin/students', iconName: 'Users' },
      { label: 'Coaches', path: '/admin/coaches', iconName: 'UserCheck' },
      { label: 'Programs', path: '/admin/programs', iconName: 'BookOpen' },
      { label: 'Batches', path: '/admin/batches', iconName: 'Layers' },
      { label: 'Schedules', path: '/admin/schedules', iconName: 'Calendar' },
    ],
  },
  {
    heading: 'ADMISSIONS',
    items: [
      { label: 'Applications', path: '/admin/admissions', iconName: 'FileCheck2' },
      { label: 'Trial Bookings', path: '/admin/trial-bookings', iconName: 'CalendarClock' },
    ],
  },
  {
    heading: 'OPERATIONS',
    items: [
      { label: 'Fees', path: '/admin/fees', iconName: 'CreditCard' },
      { label: 'Attendance', path: '/admin/attendance', iconName: 'ClipboardList' },
      { label: 'Matches', path: '/admin/matches', iconName: 'Trophy' },
    ],
  },
  {
    heading: 'CONTENT MANAGEMENT',
    items: [
      { label: 'Achievements', path: '/admin/achievements', iconName: 'Award' },
      { label: 'Gallery', path: '/admin/gallery', iconName: 'Image' },
      { label: 'Testimonials', path: '/admin/testimonials', iconName: 'MessageSquareQuote' },
      { label: 'Blog', path: '/admin/blog', iconName: 'Newspaper' },
      { label: 'Website Content', path: '/admin/website-content', iconName: 'Globe' },
    ],
  },
  {
    heading: 'ANALYTICS',
    items: [{ label: 'Reports', path: '/admin/reports', iconName: 'BarChart3' }],
  },
  {
    heading: 'SYSTEM',
    items: [{ label: 'Settings', path: '/admin/settings', iconName: 'Settings' }],
  },
];

export interface AdminRouteMeta {
  title: string;
  group: string;
}

export const ADMIN_ROUTE_META: Record<string, AdminRouteMeta> = {
  '/admin': { title: 'Admin Dashboard', group: 'Overview' },
  '/admin/students': { title: 'Student Management', group: 'Academy Management' },
  '/admin/coaches': { title: 'Coach Management', group: 'Academy Management' },
  '/admin/programs': { title: 'Program Management', group: 'Academy Management' },
  '/admin/batches': { title: 'Batch Management', group: 'Academy Management' },
  '/admin/schedules': { title: 'Schedule Management', group: 'Academy Management' },
  '/admin/admissions': { title: 'Admission Management', group: 'Admissions' },
  '/admin/trial-bookings': { title: 'Trial Booking Management', group: 'Admissions' },
  '/admin/fees': { title: 'Fees Management', group: 'Operations' },
  '/admin/attendance': { title: 'Attendance Management', group: 'Operations' },
  '/admin/matches': { title: 'Matches & Events Management', group: 'Operations' },
  '/admin/achievements': { title: 'Achievements Management', group: 'Content Management' },
  '/admin/gallery': { title: 'Gallery Management', group: 'Content Management' },
  '/admin/testimonials': { title: 'Testimonials Management', group: 'Content Management' },
  '/admin/blog': { title: 'Blog Management', group: 'Content Management' },
  '/admin/website-content': { title: 'Website Content Management', group: 'Content Management' },
  '/admin/reports': { title: 'Academy Reports', group: 'Analytics' },
  '/admin/settings': { title: 'System Settings', group: 'System' },
};
