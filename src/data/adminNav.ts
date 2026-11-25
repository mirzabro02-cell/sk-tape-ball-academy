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

export const ADMIN_BASE_PATH = '/sk-portal';

export const ADMIN_SIDEBAR_GROUPS: AdminSidebarGroup[] = [
  {
    heading: 'OVERVIEW',
    items: [{ label: 'Dashboard', path: '/sk-portal', iconName: 'LayoutDashboard' }],
  },
  {
    heading: 'ACADEMY MANAGEMENT',
    items: [
      { label: 'Students', path: '/sk-portal/students', iconName: 'Users' },
      { label: 'Coaches', path: '/sk-portal/coaches', iconName: 'UserCheck' },
      { label: 'Programs', path: '/sk-portal/programs', iconName: 'BookOpen' },
      { label: 'Batches', path: '/sk-portal/batches', iconName: 'Layers' },
      { label: 'Schedules', path: '/sk-portal/schedules', iconName: 'Calendar' },
    ],
  },
  {
    heading: 'ADMISSIONS',
    items: [
      { label: 'Applications', path: '/sk-portal/admissions', iconName: 'FileCheck2' },
    ],
  },
  {
    heading: 'OPERATIONS',
    items: [
      { label: 'Fees', path: '/sk-portal/fees', iconName: 'CreditCard' },
      { label: 'Attendance', path: '/sk-portal/attendance', iconName: 'ClipboardList' },
      { label: 'Matches', path: '/sk-portal/matches', iconName: 'Trophy' },
    ],
  },
  {
    heading: 'CONTENT MANAGEMENT',
    items: [
      { label: 'Achievements', path: '/sk-portal/achievements', iconName: 'Award' },
      { label: 'Gallery', path: '/sk-portal/gallery', iconName: 'Image' },
      { label: 'Testimonials', path: '/sk-portal/testimonials', iconName: 'MessageSquareQuote' },
      { label: 'Blog & Updates', path: '/sk-portal/blog', iconName: 'Newspaper' },
      { label: 'Website Content', path: '/sk-portal/website-content', iconName: 'Globe' },
    ],
  },
  {
    heading: 'ANALYTICS',
    items: [{ label: 'Reports', path: '/sk-portal/reports', iconName: 'BarChart3' }],
  },
  {
    heading: 'SYSTEM',
    items: [{ label: 'Settings', path: '/sk-portal/settings', iconName: 'Settings' }],
  },
];

export interface AdminRouteMeta {
  title: string;
  group: string;
}

export const ADMIN_ROUTE_META: Record<string, AdminRouteMeta> = {
  '/sk-portal': { title: 'Admin Dashboard', group: 'Overview' },
  '/sk-portal/students': { title: 'Student Management', group: 'Academy Management' },
  '/sk-portal/coaches': { title: 'Coach Management', group: 'Academy Management' },
  '/sk-portal/programs': { title: 'Program Management', group: 'Academy Management' },
  '/sk-portal/batches': { title: 'Batch Management', group: 'Academy Management' },
  '/sk-portal/schedules': { title: 'Schedule Management', group: 'Academy Management' },
  '/sk-portal/admissions': { title: 'Admission Management', group: 'Admissions' },
  '/sk-portal/fees': { title: 'Fees Management', group: 'Operations' },
  '/sk-portal/attendance': { title: 'Attendance Management', group: 'Operations' },
  '/sk-portal/matches': { title: 'Matches & Events Management', group: 'Operations' },
  '/sk-portal/achievements': { title: 'Achievements Management', group: 'Content Management' },
  '/sk-portal/gallery': { title: 'Gallery Management', group: 'Content Management' },
  '/sk-portal/testimonials': { title: 'Testimonials Management', group: 'Content Management' },
  '/sk-portal/blog': { title: 'Blog & Updates Management', group: 'Content Management' },
  '/sk-portal/website-content': { title: 'Website Content Management', group: 'Content Management' },
  '/sk-portal/reports': { title: 'Academy Reports', group: 'Analytics' },
  '/sk-portal/settings': { title: 'System Settings', group: 'System' },
};
