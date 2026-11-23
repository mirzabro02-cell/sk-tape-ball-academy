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
    path: '/about',
    title: 'About SK Tape Ball Academy',
    sectionLabel: 'Academy Profile',
    description:
      'Placeholder route for the official academy mission, leadership overview, and tape ball cricket development philosophy.',
    plannedModules: [
      'Academy Mission & Vision Statement',
      'Tape Ball Cricket Methodology',
      'Leadership & Coaching Standards',
    ],
  },
  {
    path: '/programs',
    title: 'Training Programs',
    sectionLabel: 'Curriculum',
    description:
      'Placeholder route for age-group batches, specialized pace/spin clinics, and power-hitting programs.',
    plannedModules: [
      'Age & Skill Group Tracks',
      'Bowling, Batting & Fielding Modules',
      'Program Comparison & Enrollment Links',
    ],
  },
  {
    path: '/coaches',
    title: 'Coaching Staff',
    sectionLabel: 'Mentorship',
    description:
      'Placeholder route reserved for verified coach profiles, credentials, and specialized tape ball coaching roles.',
    plannedModules: [
      'Head Coach & Technical Leads',
      'Specialist Pace & Power-Hitting Coaches',
      'Strength & Conditioning Staff',
    ],
  },
  {
    path: '/schedule',
    title: 'Training Schedule',
    sectionLabel: 'Timetable',
    description:
      'Placeholder route for weekly practice slots, batch timings, and seasonal ground schedules.',
    plannedModules: [
      'Weekday & Weekend Batch Timings',
      'Net Session Rotation Schedule',
      'Match Practice & Conditioning Days',
    ],
  },
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
    path: '/achievements',
    title: 'Academy Achievements',
    sectionLabel: 'Honors',
    description:
      'Placeholder route highlighting tournament titles, player milestones, and competitive honors.',
    plannedModules: [
      'Tournament Honors & Trophies',
      'Player Selection Milestones',
      'Season Highlights Archive',
    ],
  },
  {
    path: '/matches',
    title: 'Matches & Fixtures',
    sectionLabel: 'Competition',
    description:
      'Placeholder route for upcoming academy fixtures, practice match schedules, and match summaries.',
    plannedModules: [
      'Upcoming Fixtures Calendar',
      'Recent Practice Match Results',
      'Squad Announcements',
    ],
  },
  {
    path: '/gallery',
    title: 'Media Gallery',
    sectionLabel: 'Media',
    description:
      'Placeholder route reserved for verified training photos, match-day photography, and highlight clips.',
    plannedModules: [
      'Training Session Photography',
      'Tournament & Match-Day Albums',
      'Facility Showcase Media',
    ],
  },
  {
    path: '/facilities',
    title: 'Academy Facilities',
    sectionLabel: 'Infrastructure',
    description:
      'Placeholder route detailing practice pitches, floodlight setups, turf/cement surfaces, and player amenities.',
    plannedModules: [
      'Tape Ball Practice Pitches & Nets',
      'Night Training & Floodlight Setup',
      'Fitness & Recovery Area',
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
