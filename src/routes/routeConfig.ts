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
    path: '/admissions',
    title: 'Admissions Process',
    sectionLabel: 'Enrollment',
    description:
      'Placeholder route outlining trial assessments, eligibility, required documents, and onboarding steps.',
    plannedModules: [
      'Step-by-Step Admission Guide',
      'Trial Assessment Criteria',
      'Kit & Ground Guidelines',
    ],
  },
  {
    path: '/fees',
    title: 'Fee Structure & Plans',
    sectionLabel: 'Membership',
    description:
      'Placeholder route for official academy fee plans, registration charges, and billing cycles.',
    plannedModules: [
      'Monthly & Quarterly Training Plans',
      'Registration & Kit Breakdown',
      'Payment Policy & FAQ Summary',
    ],
  },
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
  {
    path: '/faqs',
    title: 'Frequently Asked Questions',
    sectionLabel: 'Support',
    description:
      'Placeholder route covering common questions on admissions, equipment, batch timings, and trial sessions.',
    plannedModules: [
      'Admissions & Trials FAQs',
      'Equipment & Dress Code Questions',
      'Fees & Attendance Policies',
    ],
  },
  {
    path: '/privacy',
    title: 'Privacy Policy',
    sectionLabel: 'Legal',
    description:
      'Placeholder route for the official SK Tape Ball Academy privacy policy covering player and guardian registration data.',
    plannedModules: [
      'Data Collection & Consent Notice',
      'Guardian & Minor Privacy Standards',
      'Contact for Privacy Inquiries',
    ],
  },
  {
    path: '/terms',
    title: 'Terms of Use',
    sectionLabel: 'Legal',
    description:
      'Placeholder route for the official SK Tape Ball Academy website terms, ground conduct rules, and enrollment policies.',
    plannedModules: [
      'Website & Portal Usage Terms',
      'Ground Safety & Code of Conduct',
      'Trial & Registration Policies',
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
