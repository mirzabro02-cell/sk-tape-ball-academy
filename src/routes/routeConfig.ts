export interface PublicPlaceholderConfig {
  path: string;
  title: string;
  sectionLabel: string;
  description: string;
  plannedModules: string[];
}

export interface AdminPlaceholderConfig {
  path: string;
  index?: boolean;
  title: string;
  description: string;
}

export const PUBLIC_PLACEHOLDER_ROUTES: PublicPlaceholderConfig[] = [
  {
    path: '/blog',
    title: 'Blog & Academy Updates',
    sectionLabel: 'Editorial',
    description:
      'Placeholder route for academy announcements, tape ball skill articles, and camp notices.',
    plannedModules: [
      'Academy Announcements Feed',
      'Skill & Technique Articles',
      'Trial & Camp Notices',
    ],
  },
];

export const ADMIN_PLACEHOLDER_ROUTES: AdminPlaceholderConfig[] = [
  {
    path: '/admin',
    index: true,
    title: 'Admin Portal Overview',
    description:
      'Entry placeholder for future SK Tape Ball Academy administration tools. Protected dashboard modules will be built in a later part.',
  },
  {
    path: '/admin/students',
    title: 'Students Management',
    description: 'Placeholder route for future enrolled player records and attendance tracking.',
  },
  {
    path: '/admin/programs',
    title: 'Programs Management',
    description: 'Placeholder route for managing training tracks, capacities, and curriculum details.',
  },
  {
    path: '/admin/coaches',
    title: 'Coaches Management',
    description: 'Placeholder route for managing coaching staff profiles and batch assignments.',
  },
  {
    path: '/admin/schedule',
    title: 'Schedule Management',
    description: 'Placeholder route for configuring ground slots and weekly training timetables.',
  },
  {
    path: '/admin/admissions',
    title: 'Admissions Review',
    description: 'Placeholder route for reviewing incoming academy registrations and fee status.',
  },
  {
    path: '/admin/trials',
    title: 'Trial Bookings',
    description: 'Placeholder route for reviewing and scheduling free trial session requests.',
  },
  {
    path: '/admin/settings',
    title: 'Academy Settings',
    description: 'Placeholder route for configuring official academy contact details, WhatsApp link, and site settings.',
  },
];
