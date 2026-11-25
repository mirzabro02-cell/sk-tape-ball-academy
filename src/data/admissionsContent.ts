import type { SelectOption } from '@/src/types/common';
import { TRAINING_PROGRAMS_DATA } from './academyInfo';

export const ADMISSIONS_PAGE_CONTENT = {
  kicker: 'Admissions & Onboarding',
  title: 'Join SK Tape Ball Academy',
  description:
    'A clear, structured admissions pathway from initial free trial assessment to program placement. Age brackets, batch availability, and official fee details remain placeholders until confirmed.',
  steps: [
    {
      step: '01',
      title: 'Book a Free Trial or Register Interest',
      description:
        'Start by submitting a trial request or student admission inquiry with basic player and guardian contact details.',
    },
    {
      step: '02',
      title: 'Initial Assessment Session',
      description:
        'Coaches observe batting stance, bowling rhythm, catching reflexes, and movement baseline during an evaluation session.',
    },
    {
      step: '03',
      title: 'Program & Batch Recommendation',
      description:
        'Based on age group and skill readiness, the coaching team recommends the most suitable training track and batch.',
    },
    {
      step: '04',
      title: 'Enrollment & Ground Onboarding',
      description:
        'Guardians or adult applicants confirm consent policies, kit guidelines, and starting session dates with the academy desk.',
    },
  ],
  eligibilityPlaceholders: [
    {
      title: 'Age Group Brackets (Placeholder)',
      detail:
        'Junior, youth, and senior tape ball age brackets will be confirmed by academy administration prior to batch launch.',
    },
    {
      title: 'Skill Level Readiness',
      detail:
        'Open to beginners building core fundamentals as well as experienced club and tournament players.',
    },
    {
      title: 'Guardian Consent for Under-18 Applicants',
      detail:
        'Applicants under 18 years of age require verified parent or legal guardian contact details and explicit consent.',
    },
  ],
  requiredInformation: [
    'Student full name, date of birth, and city/area of residence',
    'Parent or guardian full name, relationship, phone, and WhatsApp contact (mandatory for applicants under 18)',
    'Preferred training program and summary of previous cricket experience',
    'Signed privacy policy acknowledgement and optional separate photography consent',
  ],
  admissionFaqs: [
    {
      question: 'Does submitting the online registration form immediately confirm a seat?',
      answer:
        'Sample Placeholder: No. Online forms capture applicant details for academy review; final batch placement and confirmation are completed directly by academy staff.',
    },
    {
      question: 'Do beginners need prior tournament experience to apply?',
      answer:
        'Sample Placeholder: No. Our Beginner Foundation Program is structured specifically for newcomers learning grip, stance, bowling rhythm, and safe catching.',
    },
    {
      question: 'Is a free trial available before enrolling in a full batch?',
      answer:
        'Sample Placeholder: Yes, prospective players can request a free trial assessment through the Book Free Trial page, subject to staff confirmation.',
    },
  ],
} as const;

export const PROGRAM_SELECT_OPTIONS: SelectOption[] = [
  { label: 'Select a training program', value: '' },
  ...TRAINING_PROGRAMS_DATA.map((p) => ({
    label: `${p.title} (${p.category})`,
    value: p.slug,
  })),
];

export const GENDER_OPTIONAL_OPTIONS: SelectOption[] = [
  { label: 'Prefer not to specify / Optional', value: '' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export const RELATIONSHIP_OPTIONS: SelectOption[] = [
  { label: 'Select relationship', value: '' },
  { label: 'Father', value: 'father' },
  { label: 'Mother', value: 'mother' },
  { label: 'Legal Guardian', value: 'legal-guardian' },
  { label: 'Sibling / Family Member', value: 'family-member' },
  { label: 'Self (Adult Applicant 18+)', value: 'self' },
];

export const EXPERIENCE_OPTIONS: SelectOption[] = [
  { label: 'Select cricket experience level', value: '' },
  { label: 'Beginner (Casual / Street Cricket)', value: 'beginner' },
  { label: 'Intermediate (School / Local Tape Ball)', value: 'intermediate' },
  { label: 'Competitive (Club / Night Tournaments)', value: 'competitive' },
  { label: 'Advanced / Specialist Role', value: 'advanced' },
];

export const PREFERRED_BATCH_OPTIONS: SelectOption[] = [
  { label: 'Select preferred batch (Placeholder)', value: '' },
  { label: 'Morning Batch Slot — Timing Pending', value: 'morning-placeholder' },
  { label: 'Afternoon / Youth Slot — Timing Pending', value: 'afternoon-placeholder' },
  { label: 'Evening / Floodlight Slot — Timing Pending', value: 'evening-placeholder' },
  { label: 'Weekend Only Slot — Timing Pending', value: 'weekend-placeholder' },
];

export const PREFERRED_TRIAL_TIME_OPTIONS: SelectOption[] = [
  { label: 'Select preferred time window (Placeholder)', value: '' },
  { label: 'Morning Assessment Window (Timing Pending)', value: 'morning-window' },
  { label: 'Afternoon Assessment Window (Timing Pending)', value: 'afternoon-window' },
  { label: 'Evening Floodlight Window (Timing Pending)', value: 'evening-window' },
  { label: 'Weekend Trial Window (Timing Pending)', value: 'weekend-window' },
];

export interface MembershipPlanPlaceholder {
  id: string;
  title: string;
  tierLabel: string;
  pricePlaceholder: string;
  billingPlaceholder: string;
  summary: string;
  includedBenefits: string[];
  highlighted?: boolean;
}

export const FEES_PAGE_CONTENT = {
  kicker: 'Fees & Membership (Placeholder Structure)',
  title: 'Training Plans & Membership Overview',
  description:
    'Transparent membership structure prepared for SK Tape Ball Academy. Official prices, registration charges, and payment schedules are clearly marked as placeholders—no sample fees are invented.',
  plans: [
    {
      id: 'foundation-plan',
      title: 'Foundation Batch Plan',
      tierLabel: 'Beginner & Youth Track · Placeholder',
      pricePlaceholder: 'Pricing Pending Official Release',
      billingPlaceholder: 'Monthly / Term Options (TBD)',
      summary:
        'Designed for newcomers building core batting, bowling, and fielding fundamentals.',
      includedBenefits: [
        'Structured weekly group net sessions (frequency TBD)',
        'Fundamental batting & bowling mechanics drills',
        'Agility warm-ups and fielding coordination',
        'Periodic coach progress observations',
      ],
    },
    {
      id: 'performance-plan',
      title: 'Performance & Skill Track Plan',
      tierLabel: 'Most Comprehensive · Placeholder',
      pricePlaceholder: 'Pricing Pending Official Release',
      billingPlaceholder: 'Monthly / Quarterly Options (TBD)',
      summary:
        'Structured for players advancing across batting power-hitting, pace/spin clinics, and match scenarios.',
      includedBenefits: [
        'Access to specialized discipline modules',
        'Target-zone bowling and death-over batting scenarios',
        'Conditioning & sprint agility integration',
        'Match-simulation practice sessions',
      ],
      highlighted: true,
    },
    {
      id: 'personal-coaching-plan',
      title: '1-on-1 Personal Coaching Package',
      tierLabel: 'Individual Sessions · Placeholder',
      pricePlaceholder: 'Package Rate Pending Release',
      billingPlaceholder: 'Per-Session / Block Options (TBD)',
      summary:
        'Focused one-on-one coaching sessions tailored to specific technical adjustments or trial prep.',
      includedBenefits: [
        'Dedicated individual coach attention',
        'Diagnostic stance, swing, or action breakdown',
        'Custom drill blocks targeting specific priorities',
        'Flexible scheduling upon staff confirmation',
      ],
    },
  ] as MembershipPlanPlaceholder[],
  paymentPlaceholders: [
    {
      title: 'Payment Methods (Placeholder)',
      detail:
        'Accepted payment channels (bank transfer, academy desk, or digital options) will be published once confirmed.',
    },
    {
      title: 'Registration & Kit Policy (Placeholder)',
      detail:
        'Details regarding one-time admission fees or training kit requirements remain pending official confirmation.',
    },
    {
      title: 'Refund & Transfer Policy',
      detail:
        'Draft refund guidelines are outlined on the Refund Policy page and remain subject to official academy review.',
    },
  ],
  faqs: [
    {
      question: 'Why are exact prices not listed yet?',
      answer:
        'Placeholder Answer: Official fee amounts are only published after formal confirmation by SK Tape Ball Academy so no inaccurate pricing is shown.',
    },
    {
      question: 'Can I attend a trial before selecting a membership plan?',
      answer:
        'Placeholder Answer: Yes, prospective players are encouraged to request a free trial session first so coaches can advise on the right track.',
    },
  ],
} as const;

export type FaqCategory =
  | 'Admission FAQs'
  | 'Training FAQs'
  | 'Membership FAQs'
  | 'Trial Session FAQs';

export interface FaqEntry {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}

export const FAQ_CATEGORIES: Array<'All' | FaqCategory> = [
  'All',
  'Admission FAQs',
  'Training FAQs',
  'Membership FAQs',
  'Trial Session FAQs',
];

export const FAQS_DATA: FaqEntry[] = [
  {
    id: 'adm-1',
    category: 'Admission FAQs',
    question: 'How do I apply for admission to SK Tape Ball Academy?',
    answer:
      'Placeholder Answer: Complete the registration inquiry form on the Register page or book a free trial first. Academy staff will review your submission and follow up regarding batch placement.',
  },
  {
    id: 'adm-2',
    category: 'Admission FAQs',
    question: 'Do players under 18 require parent or guardian consent?',
    answer:
      'Placeholder Answer: Yes. Any applicant under 18 years old must provide parent or legal guardian details along with explicit guardian consent.',
  },
  {
    id: 'adm-3',
    category: 'Admission FAQs',
    question: 'What documents or information are needed at registration?',
    answer:
      'Placeholder Answer: Basic student identification details (full name, date of birth, city/area), guardian contact information, and acknowledgement of academy privacy and safety policies.',
  },
  {
    id: 'trn-1',
    category: 'Training FAQs',
    question: 'Which cricket disciplines are covered in academy training?',
    answer:
      'Placeholder Answer: Programs cover Batting, Fast Bowling, Spin Bowling, Fielding, Wicket Keeping, and Fitness & Agility across Beginner, Advanced, and Personal Coaching tracks.',
  },
  {
    id: 'trn-2',
    category: 'Training FAQs',
    question: 'What are the official weekly training timings?',
    answer:
      'Placeholder Answer: Exact morning, afternoon, and evening floodlight timings are pending final confirmation and will be published on the Schedule page.',
  },
  {
    id: 'trn-3',
    category: 'Training FAQs',
    question: 'What gear should players bring to practice sessions?',
    answer:
      'Placeholder Answer: Standard athletic sportswear, cricket/turf shoes, personal bat if owned, and water bottle. Specific kit guidelines will be shared upon onboarding.',
  },
  {
    id: 'mem-1',
    category: 'Membership FAQs',
    question: 'Where can I view official monthly or quarterly fee amounts?',
    answer:
      'Placeholder Answer: Official fee figures are currently pending confirmation and will be listed on the Fees & Membership page once released.',
  },
  {
    id: 'mem-2',
    category: 'Membership FAQs',
    question: 'Are family discounts or seasonal packages available?',
    answer:
      'Placeholder Answer: Any multi-month packages or sibling concessions will be announced officially once fee structures are finalized.',
  },
  {
    id: 'trl-1',
    category: 'Trial Session FAQs',
    question: 'Is my free trial confirmed immediately when I submit the form?',
    answer:
      'Placeholder Answer: No. Submitting the trial form creates a trial request only. Your booking is confirmed only after academy staff review and confirm your slot.',
  },
  {
    id: 'trl-2',
    category: 'Trial Session FAQs',
    question: 'What happens during the free trial assessment?',
    answer:
      'Placeholder Answer: Coaches observe your batting stance, bowling control, catching reflexes, and movement agility to recommend the right beginner, specialist, or advanced track.',
  },
];
