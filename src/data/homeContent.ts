import { HERO_STADIUM_VISUAL } from '@/src/assets/branding';
import lanesImg from '@/src/assets/images/academy_training_lanes_1795439225599.jpg';

export const HERO_CONTENT = {
  tagline: 'WHERE DREAMS MEET OPPORTUNITIES.',
  headlineTop: 'Where Dreams Meet',
  headlineAccent: 'Opportunities.',
  supportingText:
    'SK Tape Ball Academy in Sabzazar, Lahore focuses on structured fitness, batting, bowling, and fielding development.',
  imageSrc: HERO_STADIUM_VISUAL,
  imageAlt: 'SK Tape Ball Academy player in dark navy kit hitting a taped cricket ball under floodlights',
  primaryCta: { label: 'Register Now', to: '/register' },
  secondaryCta: { label: 'Explore Programs', to: '/programs' },
} as const;

export const ACADEMY_INTRO_CONTENT = {
  kicker: 'Training Approach',
  title: 'Structured, Skill-Based & Repetition-Focused',
  overview:
    'Founded by Sami Khan and launched on 18 August 2024 in Faisalabad (operating in Sabzazar, Lahore), the academy builds complete players through progressive practice.',
  approachTitle: 'How Every Session Works',
  approachSteps: [
    {
      code: '01',
      title: 'Assessment',
      description: 'Assess each player and identify strengths and weaknesses.',
    },
    {
      code: '02',
      title: 'Focused Practice',
      description: 'Work directly on targeted batting, bowling, fielding, and fitness areas.',
    },
    {
      code: '03',
      title: 'Drills',
      description: 'Apply structured drills and specific practice methods per skill.',
    },
    {
      code: '04',
      title: 'Repetition',
      description: 'Develop technique, timing, control, and consistency progressively.',
    },
  ],
  imageSrc: lanesImg,
  imageAlt: 'Outdoor cricket academy practice lanes with agility ladder and training cones',
  cta: { label: 'About Academy', to: '/about' },
} as const;

export interface TrainingProgramPreviewItem {
  id: string;
  programId: string;
  code: string;
  title: string;
  description: string;
}

export const TRAINING_PROGRAMS_PREVIEW: TrainingProgramPreviewItem[] = [
  {
    id: 'fitness-agility',
    programId: 'prog-fitness',
    code: '01',
    title: 'Fitness',
    description:
      'Builds stamina, power, speed, mobility, flexibility, and elasticity using approximately 200 athletic exercises.',
  },
  {
    id: 'batting',
    programId: 'prog-batting',
    code: '02',
    title: 'Tape Ball Batting',
    description:
      'Begins with assessing each player’s strengths and weaknesses, followed by roughly 20–25 practice methods per shot.',
  },
  {
    id: 'fast-bowling',
    programId: 'prog-bowling',
    code: '03',
    title: 'Tape Ball Bowling',
    description:
      'Improves bowling speed, accuracy, line, and length through specific drills and repeated practice.',
  },
  {
    id: 'fielding',
    programId: 'prog-fielding',
    code: '04',
    title: 'Fielding',
    description:
      'Covers short catches, fast catches, long/high catches, and ground-fielding drills for sharper reaction and control.',
  },
];

export const MISSION_VISION_VALUES = {
  kicker: 'Mission, Vision & Values',
  title: 'Purpose & Core Standards',
  mission: {
    title: 'Our Mission',
    summary:
      'Provide organized, quality tape-ball cricket training to improve fitness and skills, build discipline, confidence, and sportsmanship, and create a pathway to cricket opportunities.',
  },
  vision: {
    title: 'Our Vision',
    summary:
      'Develop into a recognized, modern, professionally managed cricket training platform that introduces structured coaching systems and helps emerging talent compete and progress.',
  },
  valuesTitle: 'Core Values',
  values: [
    'Discipline',
    'Hard Work',
    'Consistency',
    'Fitness',
    'Teamwork',
    'Respect',
    'Sportsmanship',
    'Commitment',
    'Equal Opportunity',
  ],
} as const;
