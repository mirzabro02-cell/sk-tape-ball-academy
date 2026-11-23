export const HERO_CONTENT = {
  tagline: 'BUILD YOUR GAME. MASTER YOUR SKILLS.',
  headline: 'Structured Tape Ball Cricket Coaching for Competitive Match Readiness',
  supportingText:
    'SK Tape Ball Academy pairs disciplined net sessions, technical batting and bowling drills, athletic conditioning, and tactical match awareness under a focused coaching framework.',
  imageSrc: '/src/assets/images/hero_cricket_academy_1795439223672.jpg',
  imageAlt: 'Floodlit SK Tape Ball Academy practice pitch with cricket bat and taped ball at twilight',
  primaryCta: { label: 'Explore Programs', to: '/programs' },
  secondaryCta: { label: 'Book Free Trial', to: '/book-trial' },
} as const;

export const ACADEMY_INTRO_CONTENT = {
  kicker: 'Academy Introduction',
  title: 'Developing Complete Tape Ball Cricketers',
  overview:
    'Tape ball cricket demands split-second decision making, clean striking mechanics, pace variation, and sharp athletic reflexes. Our academy turns raw street and club enthusiasm into repeatable, match-ready technique.',
  philosophyTitle: 'Our Training Philosophy',
  philosophyPoints: [
    'Mechanics first: building repeatable batting footwork, seam alignment, and wrist control before high-tempo drills.',
    'Situation-based nets: simulating powerplay hitting, middle-over control, and death-over execution.',
    'Measured progression: structured player feedback focused on discipline, stamina, and team accountability.',
  ],
  imageSrc: '/src/assets/images/academy_training_lanes_1795439225599.jpg',
  imageAlt: 'Modern outdoor cricket academy practice lanes with agility ladder and training cones at golden hour',
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
    id: 'batting',
    code: '01',
    title: 'Batting',
    focusLabel: 'Timing · Power Hitting · Strike Rotation',
    description:
      'Stance balance, bat-swing path, clearing the front leg for lofted shots, and rotating strike against pace and spin.',
    drills: ['Range hitting & lofted drives', 'Yorker & slower-ball reads'],
  },
  {
    id: 'fast-bowling',
    code: '02',
    title: 'Fast Bowling',
    focusLabel: 'Run-Up · Pace · Death Overs',
    description:
      'Rhythmic approach mechanics, seam release with the taped ball, hard yorker accuracy, and disguised variations.',
    drills: ['Target yorker & bouncer grids', 'Reverse swing & pace changeups'],
  },
  {
    id: 'spin-bowling',
    code: '03',
    title: 'Spin Bowling',
    focusLabel: 'Flight · Grip · Tactical Control',
    description:
      'Developing revolutions, drift, length discipline, and clever pace adjustments tailored for tape ball trajectories.',
    drills: ['Stump-to-stump control drills', 'Arm-ball & variation execution'],
  },
  {
    id: 'fielding',
    code: '04',
    title: 'Fielding',
    focusLabel: 'Reflexes · Throwing · Boundary Saves',
    description:
      'Explosive first-step reactions, high-catch tracking under lights, clean pickups, and flat accurate throws.',
    drills: ['Slip & ring catching routines', 'Sliding stops & relay throws'],
  },
  {
    id: 'wicket-keeping',
    code: '05',
    title: 'Wicket Keeping',
    focusLabel: 'Footwork · Glovework · Stumpings',
    description:
      'Low crouch posture, soft hands against brisk tape ball bounce, lateral movement, and quick-fire stumpings.',
    drills: ['Standing-up reaction drills', 'Wide-ball & deflection takes'],
  },
  {
    id: 'fitness-agility',
    code: '06',
    title: 'Fitness & Agility',
    focusLabel: 'Speed · Stamina · Injury Prevention',
    description:
      'Cricket-specific sprint mechanics, ladder footwork, core stability, and shoulder conditioning for sustained output.',
    drills: ['Sprint & change-of-direction sets', 'Core & throwing-arm conditioning'],
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
    title: 'Structured Training',
    description:
      'Every session follows a clear warm-up, technical drill block, scenario practice, and cool-down plan rather than unorganized net hits.',
  },
  {
    code: '02',
    title: 'Skill Development',
    description:
      'Focused attention on grip, balance, release point, and tactical shot selection tailored specifically for competitive tape ball cricket.',
  },
  {
    code: '03',
    title: 'Discipline',
    description:
      'Punctuality, kit readiness, respect for coaches and teammates, and composure under match pressure form the foundation of every batch.',
  },
  {
    code: '04',
    title: 'Fitness',
    description:
      'Integrated agility ladders, sprint intervals, and mobility work help players stay sharp deep into evening tournaments.',
  },
  {
    code: '05',
    title: 'Teamwork',
    description:
      'Match-simulation drills build communication between batting partners, bowlers, and fielders so players perform as a cohesive unit.',
  },
];

export interface CoachPlaceholderItem {
  id: string;
  slug: string;
  namePlaceholder: string;
  rolePlaceholder: string;
  specialtyPlaceholder: string;
  bioPlaceholder: string;
}

export const COACHES_PREVIEW_PLACEHOLDERS: CoachPlaceholderItem[] = [
  {
    id: 'coach-1',
    slug: 'head-coach-placeholder',
    namePlaceholder: 'Coach Name Placeholder',
    rolePlaceholder: 'Head Coach · Role Placeholder',
    specialtyPlaceholder: 'Overall Batting & Match Strategy (Placeholder)',
    bioPlaceholder:
      'Official coach biography, coaching credentials, and playing background will be added once verified.',
  },
  {
    id: 'coach-2',
    slug: 'fast-bowling-coach-placeholder',
    namePlaceholder: 'Coach Name Placeholder',
    rolePlaceholder: 'Bowling Specialist · Role Placeholder',
    specialtyPlaceholder: 'Tape Ball Pace & Death-Over Mechanics (Placeholder)',
    bioPlaceholder:
      'Official coach biography, coaching credentials, and specialist drills will be added once verified.',
  },
  {
    id: 'coach-3',
    slug: 'fielding-fitness-coach-placeholder',
    namePlaceholder: 'Coach Name Placeholder',
    rolePlaceholder: 'Fielding & Fitness Lead · Role Placeholder',
    specialtyPlaceholder: 'Agility, Keeping & Conditioning (Placeholder)',
    bioPlaceholder:
      'Official coach biography, coaching credentials, and conditioning focus will be added once verified.',
  },
];

export interface ScheduleSlotPlaceholder {
  id: string;
  sessionLabel: string;
  daysPlaceholder: string;
  timingPlaceholder: string;
  focusPlaceholder: string;
}

export const SCHEDULE_PREVIEW_PLACEHOLDERS: ScheduleSlotPlaceholder[] = [
  {
    id: 'slot-morning',
    sessionLabel: 'Morning Session',
    daysPlaceholder: 'Training Days — Pending Confirmation',
    timingPlaceholder: 'Timing Placeholder (TBD)',
    focusPlaceholder: 'Technical Drills & Conditioning',
  },
  {
    id: 'slot-afternoon',
    sessionLabel: 'Afternoon / Youth Session',
    daysPlaceholder: 'Training Days — Pending Confirmation',
    timingPlaceholder: 'Timing Placeholder (TBD)',
    focusPlaceholder: 'Fundamentals & Skill Building',
  },
  {
    id: 'slot-evening',
    sessionLabel: 'Evening / Floodlight Session',
    daysPlaceholder: 'Training Days — Pending Confirmation',
    timingPlaceholder: 'Timing Placeholder (TBD)',
    focusPlaceholder: 'High-Tempo Nets & Power Hitting',
  },
  {
    id: 'slot-weekend',
    sessionLabel: 'Weekend Match Practice',
    daysPlaceholder: 'Weekend Slot — Pending Confirmation',
    timingPlaceholder: 'Timing Placeholder (TBD)',
    focusPlaceholder: 'Scenario Games & Squad Evaluation',
  },
];

export interface AchievementPlaceholderItem {
  id: string;
  categoryLabel: string;
  titlePlaceholder: string;
  playerPlaceholder: string;
  summaryPlaceholder: string;
}

export const ACHIEVEMENTS_PREVIEW_PLACEHOLDERS: AchievementPlaceholderItem[] = [
  {
    id: 'ach-1',
    categoryLabel: 'Tournament Honor · Placeholder',
    titlePlaceholder: 'Academy Achievement Title Placeholder',
    playerPlaceholder: 'Squad / Player Profile Placeholder',
    summaryPlaceholder:
      'Verified tournament titles, cup finishes, and official academy honors will be published here.',
  },
  {
    id: 'ach-2',
    categoryLabel: 'Player Milestone · Placeholder',
    titlePlaceholder: 'Player Selection Milestone Placeholder',
    playerPlaceholder: 'Player Name Placeholder',
    summaryPlaceholder:
      'Individual player call-ups, standout performances, and verified statistics will appear here.',
  },
  {
    id: 'ach-3',
    categoryLabel: 'Season Recognition · Placeholder',
    titlePlaceholder: 'Seasonal Performance Award Placeholder',
    playerPlaceholder: 'Player Name Placeholder',
    summaryPlaceholder:
      'Official seasonal records and academy recognition summaries remain pending verification.',
  },
];

export interface MatchEventPlaceholderItem {
  id: string;
  statusLabel: string;
  titlePlaceholder: string;
  datePlaceholder: string;
  venuePlaceholder: string;
  notesPlaceholder: string;
}

export const MATCHES_EVENTS_PLACEHOLDERS: MatchEventPlaceholderItem[] = [
  {
    id: 'evt-1',
    statusLabel: 'Upcoming Event · Placeholder',
    titlePlaceholder: 'Practice Match / Fixture Placeholder',
    datePlaceholder: 'Date & Time Pending',
    venuePlaceholder: 'Academy Ground Placeholder',
    notesPlaceholder:
      'Official fixture schedule and participating squad details will be published once confirmed.',
  },
  {
    id: 'evt-2',
    statusLabel: 'Trial Camp · Placeholder',
    titlePlaceholder: 'Open Assessment & Trial Session Placeholder',
    datePlaceholder: 'Date & Time Pending',
    venuePlaceholder: 'Academy Ground Placeholder',
    notesPlaceholder:
      'Prospective players can register interest via the Book Free Trial route while dates are finalized.',
  },
  {
    id: 'evt-3',
    statusLabel: 'Recent Event · Placeholder',
    titlePlaceholder: 'Match Summary / Event Recap Placeholder',
    datePlaceholder: 'Date Pending',
    venuePlaceholder: 'Ground Details Pending',
    notesPlaceholder:
      'Verified match recaps and event outcomes will be added here—no synthetic scores are displayed.',
  },
];

export interface GalleryPreviewItem {
  id: string;
  title: string;
  category: 'Drills' | 'Facility' | 'Placeholder';
  caption: string;
  imageSrc: string | null;
  imageAlt: string;
  isPlaceholderSlot?: boolean;
}

export const GALLERY_PREVIEW_ITEMS: GalleryPreviewItem[] = [
  {
    id: 'gal-batting',
    title: 'Floodlit Batting Practice',
    category: 'Drills',
    caption: 'Illustrative cricket net batting session under evening lights.',
    imageSrc: '/src/assets/images/drill_power_batting_1795439224792.jpg',
    imageAlt: 'Batsman executing a lofted drive in a floodlit cricket training net',
  },
  {
    id: 'gal-bowling',
    title: 'Pace Bowling Crease Drill',
    category: 'Drills',
    caption: 'Illustrative fast bowling release and target cone work.',
    imageSrc: '/src/assets/images/drill_pace_bowling_1795439224452.jpg',
    imageAlt: 'Fast bowler releasing the ball near wooden stumps and training cones',
  },
  {
    id: 'gal-fielding',
    title: 'Wicket-Keeping & Reflexes',
    category: 'Drills',
    caption: 'Illustrative keeping and close-catching agility station.',
    imageSrc: '/src/assets/images/drill_fielding_agility_1795439226739.jpg',
    imageAlt: 'Wicket-keeper and fielders practicing reflex catches with cones and stumps',
  },
  {
    id: 'gal-facility',
    title: 'Practice Lanes & Agility Zone',
    category: 'Facility',
    caption: 'Illustrative academy training lanes, cones, and agility ladders.',
    imageSrc: '/src/assets/images/academy_training_lanes_1795439225599.jpg',
    imageAlt: 'Outdoor cricket net lanes and agility ladder setup at golden hour',
  },
  {
    id: 'gal-placeholder-1',
    title: 'Official Ground Photo Slot',
    category: 'Placeholder',
    caption: 'Reserved for verified SK Tape Ball Academy ground photography.',
    imageSrc: null,
    imageAlt: 'Placeholder slot for official academy ground photo',
    isPlaceholderSlot: true,
  },
  {
    id: 'gal-placeholder-2',
    title: 'Squad Match-Day Photo Slot',
    category: 'Placeholder',
    caption: 'Reserved for official academy squad and tournament photography.',
    imageSrc: null,
    imageAlt: 'Placeholder slot for official squad match-day photo',
    isPlaceholderSlot: true,
  },
];

export interface TestimonialSampleItem {
  id: string;
  quote: string;
  authorLabel: string;
  roleLabel: string;
}

export const TESTIMONIALS_SAMPLES: TestimonialSampleItem[] = [
  {
    id: 'test-1',
    quote:
      'Sample Testimonial Placeholder: Organized drills and clear coaching feedback on footwork and shot selection make every practice session purposeful.',
    authorLabel: 'Sample Player Feedback #01',
    roleLabel: 'Placeholder Profile · Verified Testimonials Pending',
  },
  {
    id: 'test-2',
    quote:
      'Sample Testimonial Placeholder: Emphasis on punctuality, fitness, and respectful team culture helps young players build strong habits on and off the pitch.',
    authorLabel: 'Sample Parent Feedback #02',
    roleLabel: 'Placeholder Profile · Verified Testimonials Pending',
  },
  {
    id: 'test-3',
    quote:
      'Sample Testimonial Placeholder: Practicing death-over yorkers and powerplay matchups with structured targets directly translates to weekend match confidence.',
    authorLabel: 'Sample Squad Feedback #03',
    roleLabel: 'Placeholder Profile · Verified Testimonials Pending',
  },
];
