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
  { label: 'FAQs', path: '/faqs', group: 'academy' },
];

export const ACTION_NAV_ITEMS: NavItem[] = [
  { label: 'Book Free Trial', path: '/book-trial', group: 'actions' },
  { label: 'Register Now', path: '/register', group: 'actions' },
  { label: 'Track Application', path: '/application-status', group: 'actions' },
  { label: 'Member Login', path: '/login', group: 'actions' },
];

export const ALL_PUBLIC_ROUTES: NavItem[] = [
  ...PRIMARY_NAV_ITEMS,
  ...SECONDARY_NAV_ITEMS,
  ...ACTION_NAV_ITEMS,
];

export const FOOTER_PRIMARY_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About Academy', path: '/about' },
  { label: 'Training Programs', path: '/programs' },
  { label: 'Coaches', path: '/coaches' },
  { label: 'Facilities', path: '/facilities' },
  { label: 'Matches & Events', path: '/matches' },
  { label: 'Gallery', path: '/gallery' },
] as const;

export const FOOTER_ADMISSIONS_LINKS = [
  { label: 'Admissions Guide', path: '/admissions' },
  { label: 'Book Free Trial', path: '/book-trial' },
  { label: 'Register Now', path: '/register' },
  { label: 'Track Application', path: '/application-status' },
  { label: 'Training Schedule', path: '/schedule' },
  { label: 'Fees & Plans', path: '/fees' },
  { label: 'FAQs & Contact', path: '/faqs' },
] as const;

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    heading: 'Academy',
    links: [...FOOTER_PRIMARY_LINKS],
  },
  {
    heading: 'Admissions & Explore',
    links: [...FOOTER_ADMISSIONS_LINKS],
  },
];
