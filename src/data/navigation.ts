import type { FooterLinkGroup, NavItem } from '@/src/types/navigation';

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/', group: 'primary' },
  { label: 'Programs', path: '/programs', group: 'primary' },
  { label: 'Coaches', path: '/coaches', group: 'primary' },
  { label: 'Schedule', path: '/schedule', group: 'primary' },
  { label: 'Admissions', path: '/admissions', group: 'primary' },
];

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  { label: 'About Academy', path: '/about', group: 'academy' },
  { label: 'Fees & Plans', path: '/fees', group: 'academy' },
  { label: 'Facilities', path: '/facilities', group: 'academy' },
  { label: 'Matches', path: '/matches', group: 'academy' },
  { label: 'Achievements', path: '/achievements', group: 'academy' },
  { label: 'Gallery', path: '/gallery', group: 'academy' },
  { label: 'Blog & Updates', path: '/blog', group: 'academy' },
  { label: 'FAQs', path: '/faqs', group: 'academy' },
  { label: 'Contact', path: '/contact', group: 'academy' },
];

export const ACTION_NAV_ITEMS: NavItem[] = [
  { label: 'Book Free Trial', path: '/book-trial', group: 'actions' },
  { label: 'Register Now', path: '/register', group: 'actions' },
  { label: 'Member Login', path: '/login', group: 'actions' },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Admin Overview', path: '/admin', group: 'admin' },
  { label: 'Students', path: '/admin/students', group: 'admin' },
  { label: 'Programs', path: '/admin/programs', group: 'admin' },
  { label: 'Coaches', path: '/admin/coaches', group: 'admin' },
  { label: 'Schedule', path: '/admin/schedule', group: 'admin' },
  { label: 'Admissions', path: '/admin/admissions', group: 'admin' },
  { label: 'Trial Requests', path: '/admin/trials', group: 'admin' },
  { label: 'Settings', path: '/admin/settings', group: 'admin' },
];

export const ALL_PUBLIC_ROUTES: NavItem[] = [
  ...PRIMARY_NAV_ITEMS,
  ...SECONDARY_NAV_ITEMS,
  ...ACTION_NAV_ITEMS,
];

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    heading: 'Academy',
    links: [
      { label: 'About Us', path: '/about' },
      { label: 'Training Programs', path: '/programs' },
      { label: 'Coaching Staff', path: '/coaches' },
      { label: 'Facilities', path: '/facilities' },
      { label: 'Achievements', path: '/achievements' },
    ],
  },
  {
    heading: 'Training & Admissions',
    links: [
      { label: 'Weekly Schedule', path: '/schedule' },
      { label: 'Admissions', path: '/admissions' },
      { label: 'Fee Structure', path: '/fees' },
      { label: 'Book Free Trial', path: '/book-trial' },
      { label: 'Register Now', path: '/register' },
    ],
  },
  {
    heading: 'Community & Access',
    links: [
      { label: 'Matches & Fixtures', path: '/matches' },
      { label: 'Media Gallery', path: '/gallery' },
      { label: 'Blog & News', path: '/blog' },
      { label: 'FAQs', path: '/faqs' },
      { label: 'Contact', path: '/contact' },
      { label: 'Member Login', path: '/login' },
      { label: 'Admin Portal (Placeholder)', path: '/admin' },
    ],
  },
];
