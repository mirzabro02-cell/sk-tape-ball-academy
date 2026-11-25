import type { SelectOption } from '@/src/types/common';
import { TRAINING_PROGRAMS_DATA } from './academyInfo';

export const ADMISSIONS_PAGE_CONTENT = {
  kicker: 'Admissions & Onboarding',
  title: 'Join SK Tape Ball Academy',
  description:
    'From online admission application to structured batch placement in Sabzazar, Lahore — follow a straightforward four-step pathway designed for dedicated players.',
  steps: [
    {
      step: '01',
      title: 'Submit Admission Registration',
      description:
        'Complete the online registration form with player details, guardian contact information, and preferred training track.',
    },
    {
      step: '02',
      title: 'Diagnostic Assessment Session',
      description:
        'Coaches observe your batting strengths and weaknesses, bowling control, catching reflexes, and conditioning baseline.',
    },
    {
      step: '03',
      title: 'Program & Batch Recommendation',
      description:
        'Based on your assessment and goals, coaches recommend the right skill track or foundation/performance batch.',
    },
    {
      step: '04',
      title: 'Onboarding & Ground Start',
      description:
        'Players or guardians confirm safety and privacy guidelines, training kit standards, and starting session times.',
    },
  ],
  eligibilityStandards: [
    {
      title: 'Open to Dedicated Learners',
      detail:
        'Suitable for newcomers learning core mechanics as well as tournament-level tape ball players sharpening match execution.',
    },
    {
      title: 'Skill Diagnostic Placement',
      detail:
        'Every applicant is placed according to skill readiness and physical conditioning rather than guesswork.',
    },
    {
      title: 'Guardian Consent for Under-18 Applicants',
      detail:
        'Applicants under 18 years of age must include verified parent or legal guardian details and explicit guardian consent.',
    },
  ],
  requiredInformation: [
    'Player full name, date of birth, and city or residential area',
    'Parent or guardian name, relationship, and reachable phone/WhatsApp details (required for under-18 players)',
    'Preferred training program and brief summary of prior playing background',
    'Privacy acknowledgement and optional separate photography consent',
  ],
  admissionFaqs: [
    {
      question: 'Does submitting the online registration form immediately confirm a seat?',
      answer:
        'No. Online registrations initiate your admission review and diagnostic evaluation. Final batch confirmation is provided directly by academy staff.',
    },
    {
      question: 'Do beginners need prior tournament experience to apply?',
      answer:
        'No. Our Beginner Foundation Program is built specifically for newcomers developing batting stance, bowling rhythm, and catching confidence from scratch.',
    },
    {
      question: 'How can I check my submitted registration status?',
      answer:
        'Save your Application Reference ID after submitting the registration form and check progress anytime on the Track Application page.',
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
  { label: 'Prefer not to specify (Optional)', value: '' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
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
  { label: 'Select preferred training window', value: '' },
  { label: 'Morning Session', value: 'morning' },
  { label: 'Afternoon / Youth Session', value: 'afternoon' },
  { label: 'Evening / Floodlight Session', value: 'evening' },
  { label: 'Weekend Schedule', value: 'weekend' },
];

export const FEES_PAGE_CONTENT = {
  kicker: 'Membership & Fee Information',
  title: 'Training Packages & Onboarding Consultation',
  description:
    'Fee plans are aligned with your recommended training track, session frequency, and personal coaching goals in Sabzazar, Lahore.',
  consultationPoints: [
    {
      title: 'Diagnostic Placement First',
      detail:
        'Submit an admission application so coaches can review your batting, bowling, fielding, and fitness readiness before recommending a program.',
    },
    {
      title: 'Transparent Program Placement',
      detail:
        'Fee details for group tracks, advanced competitive squads, and 1-on-1 personal coaching are shared clearly by academy administration upon review.',
    },
    {
      title: 'Refund & Schedule Terms',
      detail:
        'Clear guidelines covering attendance, weather adjustments, and transfer policies are detailed in our published Refund and Admission policies.',
    },
  ],
  faqs: [
    {
      question: 'How do I receive exact fee details for a program?',
      answer:
        'Submit an online registration application or contact the academy desk directly so staff can share the fee plan matching your selected track.',
    },
    {
      question: 'Are fee details finalized before batch assignment?',
      answer:
        'Yes. Academy staff confirm batch schedule availability and exact fee terms with the player or guardian prior to active enrollment.',
    },
  ],
} as const;

export type FaqCategory =
  | 'Admission FAQs'
  | 'Training FAQs'
  | 'Membership FAQs';

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
];

export const FAQS_DATA: FaqEntry[] = [
  {
    id: 'adm-1',
    category: 'Admission FAQs',
    question: 'How do I apply for admission to SK Tape Ball Academy?',
    answer:
      'Complete the online registration form on the Register page. Our staff will review your details and follow up with diagnostic assessment and batch placement options.',
  },
  {
    id: 'adm-2',
    category: 'Admission FAQs',
    question: 'Do players under 18 require parent or guardian consent?',
    answer:
      'Yes. Any applicant under 18 years old must provide verified parent or legal guardian details along with explicit guardian consent.',
  },
  {
    id: 'adm-3',
    category: 'Admission FAQs',
    question: 'Where is SK Tape Ball Academy currently located?',
    answer:
      'Following our launch on 18 August 2024 in Faisalabad, SK Tape Ball Academy operates in Sabzazar, Lahore, Pakistan.',
  },
  {
    id: 'adm-4',
    category: 'Admission FAQs',
    question: 'What happens during the initial player assessment?',
    answer:
      'Coaches review your batting stance, shot tendencies, bowling speed and line control, catching reflexes, and fitness readiness to recommend the best starting program.',
  },
  {
    id: 'trn-1',
    category: 'Training FAQs',
    question: 'What training areas are covered at the academy?',
    answer:
      'Training covers Athletic Fitness (~200 exercises), Tape Ball Batting (strengths/weaknesses assessment plus 20–25 drill methods per shot), Tape Ball Bowling (speed, accuracy, line & length), Fielding (short, fast, long/high catches, ground fielding), Wicket Keeping, Spin Bowling, and 1-on-1 Personal Coaching.',
  },
  {
    id: 'trn-2',
    category: 'Training FAQs',
    question: 'Does the academy organize competitive matches or tournaments?',
    answer:
      'Yes. SK Tape Ball Academy organizes tape-ball leagues and single-wicket events so athletes gain real match-pressure experience.',
  },
  {
    id: 'trn-3',
    category: 'Training FAQs',
    question: 'What gear should players bring to practice sessions?',
    answer:
      'Bring breathable athletic sportswear, supportive turf/running shoes, a water bottle, and your personal tape ball bat if you have one.',
  },
  {
    id: 'mem-1',
    category: 'Membership FAQs',
    question: 'How are program fees shared?',
    answer:
      'Program packages and coaching fee details are shared directly by academy administration during admission review, or when published in our official Fees overview.',
  },
];
