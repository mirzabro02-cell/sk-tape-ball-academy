import type { FooterLinkGroup, NavItem } from '@/src/types/navigation';

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/', group: 'primary' },
  { label: 'About', path: '/about', group: 'primary' },
  { label: 'Training', path: '/programs', group: 'primary' },
  { label: 'Coaches', path: '/coaches', group: 'primary' },
  { label: 'Schedule', path: '/schedule', group: 'primary' },
  { label: 'Achievements', path: '/achievements', group: 'primary' },
  { label: 'Gallery', path: '/gallery', group: 'primary' },
  { label: 'Contact', path: '/contact', group: 'primary' },
];

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  { label: 'Admissions', path: '/admissions', group: 'academy' },
  { label: 'Fees & Plans', path: '/fees', group: 'academy' },
  { label: 'Facilities', path: '/facilities', group: 'academy' },
  { label: 'Matches & Events', path: '/matches', group: 'academy' },
  { label: 'Blog & Updates', path: '/blog', group: 'academy' },
  { label: 'FAQs', path: '/faqs', group: 'academy' },
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
    heading: 'Quick Links',
    links: [
      { label: 'Home', path: '/' },
      { label: 'About Academy', path: '/about' },
      { label: 'Training Programs', path: '/programs' },
      { label: 'Coaches', path: '/coaches' },
      { label: 'Training Schedule', path: '/schedule' },
      { label: 'Achievements', path: '/achievements' },
    ],
  },
  {
    heading: 'Academy & Admissions',
    links: [
      { label: 'Admissions', path: '/admissions' },
      { label: 'Fee Structure', path: '/fees' },
      { label: 'Facilities', path: '/facilities' },
      { label: 'Matches & Events', path: '/matches' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Book Free Trial', path: '/book-trial' },
    ],
  },
  {
    heading: 'Support & Legal',
    links: [
      { label: 'Contact', path: '/contact' },
      { label: 'FAQs', path: '/faqs' },
      { label: 'Blog & Updates', path: '/blog' },
      { label: 'Register Now', path: '/register' },
      { label: 'Member Login', path: '/login' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Use', path: '/terms' },
    ],
  },
];
