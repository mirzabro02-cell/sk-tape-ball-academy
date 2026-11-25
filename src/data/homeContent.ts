import heroImg from '@/src/assets/images/hero_cricket_academy_1795439223672.jpg';
import lanesImg from '@/src/assets/images/academy_training_lanes_1795439225599.jpg';

export const HERO_CONTENT = {
  tagline: 'WHERE DREAMS MEET OPPORTUNITIES.',
  headline: 'Structured Tape Ball Cricket Coaching for Competitive Match Readiness',
  supportingText:
    'Operating in Sabzazar, Lahore — SK Tape Ball Academy combines ~200 athletic conditioning exercises, structured batting and bowling drill methods, and focused fielding routines under disciplined coaching.',
  imageSrc: heroImg,
  imageAlt: 'Floodlit SK Tape Ball Academy practice pitch with cricket bat and taped ball at twilight',
  primaryCta: { label: 'Explore Programs', to: '/programs' },
  secondaryCta: { label: 'Book Free Trial', to: '/book-trial' },
} as const;

export const ACADEMY_INTRO_CONTENT = {
  kicker: 'Academy Introduction',
  title: 'Developing Complete Tape Ball Cricketers',
  overview:
    'Founded by Sami Khan and launched on 18 August 2024 in Faisalabad before establishing operations in Sabzazar, Lahore, SK Tape Ball Academy transforms raw cricket passion into structured, match-winning execution.',
  philosophyTitle: 'Our Coaching Pillars',
  philosophyPoints: [
    'Fitness first: ~200 structured exercises building stamina, power, speed, mobility, flexibility, and elasticity.',
    'Batting precision: personal strengths and weaknesses assessment followed by 20–25 drill methods per shot.',
    'Bowling & fielding mastery: targeted speed, accuracy, line-and-length work paired with short, fast, high catching, and ground fielding.',
  ],
  imageSrc: lanesImg,
  imageAlt: 'Outdoor cricket academy practice lanes with agility ladder and training cones',
  cta: { label: 'Learn More About Us', to: '/about' },
} as const;

export interface TrainingProgramPreviewItem {
  id: string;
  code: string;
  title: string;
  focusLabel: string;
  description: string;
  drills: string[];
}

export const TRAINING_PROGRAMS_PREVIEW: TrainingProgramPreviewItem[] = [
  {
    id: 'fitness-agility',
    code: '01',
    title: 'Athletic Fitness & Conditioning',
    focusLabel: 'Stamina · Power · Speed · Mobility · Elasticity',
    description:
      'Around 200 structured exercises engineered to build cricket stamina, sprint speed, power, flexibility, and joint elasticity.',
    drills: ['Speed & agility conditioning blocks', 'Mobility & injury-prevention warm-ups'],
  },
  {
    id: 'batting',
    code: '02',
    title: 'Tape Ball Batting',
    focusLabel: 'Strength Assessment · 20–25 Methods Per Shot',
    description:
      'Diagnostic review of individual strengths and weaknesses followed by 20–25 structured practice methods per shot.',
    drills: ['Progressive shot mechanics drills', 'Power hitting & match chase execution'],
  },
  {
    id: 'fast-bowling',
    code: '03',
    title: 'Tape Ball Bowling',
    focusLabel: 'Speed · Accuracy · Line & Length',
    description:
      'Focused coaching on generating pace safely, hitting yorker and good-length targets, and controlling line and length.',
    drills: ['Target-cone line & length grids', 'Speed rhythm & death-over variations'],
  },
  {
    id: 'fielding',
    code: '04',
    title: 'Fielding & Catching',
    focusLabel: 'Short · Fast · Long Catches · Ground Work',
    description:
      'Complete fielding sessions covering short catches, fast reaction catches, long/high catches, and sharp ground pickups.',
    drills: ['Close & fast reflex catching circuits', 'High-ball tracking & flat throws'],
  },
  {
    id: 'wicket-keeping',
    code: '05',
    title: 'Wicket Keeping',
    focusLabel: 'Footwork · Glovework · Stumpings',
    description:
      'Low crouch balance, soft hands against sharp tape ball bounce, lateral footwork, and rapid stumping reflexes.',
    drills: ['Standing-up glove reactions', 'Lateral step & wide-ball takes'],
  },
  {
    id: 'spin-bowling',
    code: '06',
    title: 'Spin Bowling',
    focusLabel: 'Grip · Flight · Tactical Control',
    description:
      'Revolutions, subtle pace changes, and disciplined stump-to-stump control designed for competitive tape ball matches.',
    drills: ['Stump-to-stump target drills', 'Flight & arm-ball variations'],
  },
];

export interface WhyChoosePillar {
  code: string;
  title: string;
  description: string;
}

export const WHY_CHOOSE_PILLARS: WhyChoosePillar[] = [
  {
    code: '01',
    title: 'Structured Methods',
    description:
      'Systematic training featuring ~200 fitness exercises and 20–25 structured drill methods per batting shot.',
  },
  {
    code: '02',
    title: 'Diagnostic Assessment',
    description:
      'Individual evaluation of batting strengths, weaknesses, bowling control, and movement baseline before batch placement.',
  },
  {
    code: '03',
    title: 'Discipline & Resilience',
    description:
      'Built on passion, sportsmanship, leadership, integrity, teamwork, discipline, excellence, resilience, and continuous growth.',
  },
  {
    code: '04',
    title: 'Complete Conditioning',
    description:
      'Dedicated focus on stamina, power, speed, mobility, flexibility, and elasticity for full-match endurance.',
  },
  {
    code: '05',
    title: 'Competitive Exposure',
    description:
      'Academy-organized tape ball leagues and single-wicket events give players real pressure-tested experience.',
  },
];
