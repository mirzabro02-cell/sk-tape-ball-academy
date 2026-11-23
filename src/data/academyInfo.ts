export const ABOUT_PAGE_CONTENT = {
  kicker: 'About SK Tape Ball Academy',
  title: 'Structured Tape Ball Cricket Coaching With Purpose',
  heroDescription:
    'Built around the academy principle — BUILD YOUR GAME. MASTER YOUR SKILLS. — our platform connects aspiring and competitive tape ball cricketers with disciplined technical coaching.',
  overview: [
    'SK Tape Ball Academy is designed to bring structure, consistency, and match-ready discipline to tape ball cricket. While tape ball cricket is widely played across streets and tournaments, players rarely receive systematic instruction on balance, bat swing, pace variations, and situational awareness.',
    'Verified founding dates, ground address details, and leadership profiles will be added here once finalized by the academy administration.',
  ],
  mission: {
    title: 'Our Mission',
    description:
      'To provide organized, high-standard tape ball cricket coaching that develops sound technique, athletic fitness, and competitive composure for players at every stage.',
  },
  vision: {
    title: 'Our Vision',
    description:
      'To establish a trusted development pathway where passionate tape ball cricketers train in a disciplined environment and elevate their match performance.',
  },
  philosophy: [
    {
      code: '01',
      title: 'Technique Before Tempo',
      description:
        'Players master grip, stance, footwork, and release alignment before accelerating into high-intensity match simulations.',
    },
    {
      code: '02',
      title: 'Situation-Based Practice',
      description:
        'Net drills replicate real tape ball match phases: powerplay aggression, middle-over strike rotation, and death-over execution.',
    },
    {
      code: '03',
      title: 'Measurable Habits',
      description:
        'Consistent attendance, purposeful warm-ups, and focused repetition replace aimless net sessions.',
    },
    {
      code: '04',
      title: 'Athlete Conditioning',
      description:
        'Speed, agility, throwing mechanics, and core stability are built directly into weekly training blocks.',
    },
  ],
  values: [
    {
      title: 'Discipline',
      description: 'Punctuality, attentive listening, and structured preparation every session.',
    },
    {
      title: 'Skill Mastery',
      description: 'Relentless focus on repeatable fundamentals under match pressure.',
    },
    {
      title: 'Fitness',
      description: 'Sustained stamina, sharp foot speed, and injury-preventive conditioning.',
    },
    {
      title: 'Teamwork',
      description: 'Clear communication, backing teammates, and collective match awareness.',
    },
    {
      title: 'Sportsmanship',
      description: 'Respect for coaches, opponents, match officials, and the spirit of cricket.',
    },
  ],
  developmentApproach: [
    {
      step: 'Stage 01',
      title: 'Baseline Assessment',
      description:
        'Initial trial evaluation covering stance, bowling action alignment, catching reflexes, and movement baseline.',
    },
    {
      step: 'Stage 02',
      title: 'Technical Foundation',
      description:
        'Targeted drill blocks to strengthen core batting, bowling, or keeping mechanics.',
    },
    {
      step: 'Stage 03',
      title: 'Tactical Execution',
      description:
        'Target-based net challenges simulating chase pressure, defending totals, and field placements.',
    },
    {
      step: 'Stage 04',
      title: 'Match Readiness',
      description:
        'Practice games, feedback reviews, and continuous progression across skill tracks.',
    },
  ],
} as const;

export type ProgramCategory = 'Skill Track' | 'Level Track' | 'Individual Coaching';

export interface TrainingProgramDetail {
  slug: string;
  code: string;
  title: string;
  category: ProgramCategory;
  focusLabel: string;
  shortDescription: string;
  introduction: string;
  skillsCovered: string[];
  trainingObjectives: string[];
  suitablePlayers: string[];
  trainingApproach: string[];
  relatedSlugs: string[];
  scheduleAndFeeNote: string;
}

export const TRAINING_PROGRAMS_DATA: TrainingProgramDetail[] = [
  {
    slug: 'batting',
    code: '01',
    title: 'Batting',
    category: 'Skill Track',
    focusLabel: 'Timing · Power Hitting · Strike Rotation',
    shortDescription:
      'Stance balance, bat-swing path, clearing the front leg for lofted shots, and rotating strike against pace and spin.',
    introduction:
      'The Batting program focuses on building a balanced base and clean bat path suited for the bounce and pace of tape ball cricket. Players learn how to blend orthodox shot-making with controlled boundary hitting.',
    skillsCovered: [
      'Balanced stance, trigger movement, and head stillness',
      'Straight-bat drives, pulls, cuts, and lofted leg-side hits',
      'Reading slower balls, cutters, and high-pace yorkers',
      'Gap placement and quick single/double strike rotation',
    ],
    trainingObjectives: [
      'Develop a repeatable bat swing without losing balance',
      'Improve boundary options across both V-zones and square areas',
      'Build composure when chasing high required run rates',
    ],
    suitablePlayers: [
      'Batsmen seeking cleaner contact and stronger power hitting',
      'All-rounders aiming to contribute reliably in middle and death overs',
      'New academy entrants refining their core batting posture',
    ],
    trainingApproach: [
      'Underarm and sidearm feed drills isolating specific shot zones',
      'Target-cone placement challenges inside net lanes',
      'High-tempo death-over scenario hitting against varied pace',
    ],
    relatedSlugs: ['fast-bowling', 'fitness-agility', 'advanced'],
    scheduleAndFeeNote:
      'Batch timings and official fee structure are pending academy confirmation.',
  },
  {
    slug: 'fast-bowling',
    code: '02',
    title: 'Fast Bowling',
    category: 'Skill Track',
    focusLabel: 'Run-Up · Pace · Death Overs',
    shortDescription:
      'Rhythmic approach mechanics, seam release with the taped ball, hard yorker accuracy, and disguised variations.',
    introduction:
      'Tape ball fast bowling rewards rhythm, wrist snap, and pinpoint length control. This program breaks down the run-up, gather, and release to help bowlers generate pace safely and execute under pressure.',
    skillsCovered: [
      'Measured run-up rhythm and balanced gather at the crease',
      'Clean wrist position for pace, swing, and cutters with a taped ball',
      'Blockhole yorker precision and back-of-a-length control',
      'Disguising slower deliveries without telegraphing arm speed',
    ],
    trainingObjectives: [
      'Increase bowling consistency into target zones',
      'Build a reliable death-over execution toolkit',
      'Promote safe biomechanics to reduce lower-back and shoulder strain',
    ],
    suitablePlayers: [
      'Pace bowlers looking to sharpen yorker and cutter accuracy',
      'Young bowlers building a repeatable, injury-safe action',
      'Match bowlers preparing for high-scoring tournament formats',
    ],
    trainingApproach: [
      'Crease alignment and front-arm pull mechanics drills',
      'Spot-bowling grids with target cones at yorker and good lengths',
      'Simulated over-by-over pressure spells with field settings',
    ],
    relatedSlugs: ['batting', 'fitness-agility', 'advanced'],
    scheduleAndFeeNote:
      'Batch timings and official fee structure are pending academy confirmation.',
  },
  {
    slug: 'spin-bowling',
    code: '03',
    title: 'Spin Bowling',
    category: 'Skill Track',
    focusLabel: 'Flight · Grip · Tactical Control',
    shortDescription:
      'Developing revolutions, drift, length discipline, and clever pace adjustments tailored for tape ball trajectories.',
    introduction:
      'Spin bowlers play a decisive tactical role in tape ball cricket by disrupting hitter rhythm. This track emphasizes grip control, subtle flight variation, and smart lines against aggressive batsmen.',
    skillsCovered: [
      'Consistent finger/wrist spin grip with taped tennis balls',
      'Varying pace through the air while keeping release steady',
      'Bowl-to-field discipline and attacking stump-to-stump lines',
      'Subtle arm-ball, slider, and wide-yorker variations',
    ],
    trainingObjectives: [
      'Control length and line consistently against attacking batsmen',
      'Read batsman footwork early and adjust delivery pace',
      'Develop confidence bowling in powerplay and middle overs',
    ],
    suitablePlayers: [
      'Finger spinners and wrist spinners seeking tighter control',
      'All-rounders adding dependable slow-bowling overs to their game',
      'Developing cricketers learning tactical field-to-line setups',
    ],
    trainingApproach: [
      'Pivot and follow-through balance drills for spin energy',
      'Target-zone bowling against set left- and right-handed setups',
      'Match-situation drills restricting boundary scoring options',
    ],
    relatedSlugs: ['wicket-keeping', 'fielding', 'beginner'],
    scheduleAndFeeNote:
      'Batch timings and official fee structure are pending academy confirmation.',
  },
  {
    slug: 'fielding',
    code: '04',
    title: 'Fielding',
    category: 'Skill Track',
    focusLabel: 'Reflexes · Throwing · Boundary Saves',
    shortDescription:
      'Explosive first-step reactions, high-catch tracking under lights, clean pickups, and flat accurate throws.',
    introduction:
      'In fast-paced tape ball formats, saved boundaries and clean run-outs frequently decide matches. The Fielding track trains agility, catching posture, and throwing mechanics across ring and boundary positions.',
    skillsCovered: [
      'Ready-position split-step and explosive first-step reaction',
      'Low ground-fielding pickups and one-handed stops',
      'High-ball judgment and safe cup catching techniques',
      'Crow-hop balance and flat, accurate throws at the stumps',
    ],
    trainingObjectives: [
      'Improve catching consistency across close-in and outfield positions',
      'Reduce fumbles and release time during run-out opportunities',
      'Build safe shoulder strength for sustained throwing accuracy',
    ],
    suitablePlayers: [
      'All academy players across batting and bowling disciplines',
      'Players preparing for competitive squad selection standards',
      'Athletes looking to improve speed and ground coverage',
    ],
    trainingApproach: [
      'Rapid reaction catching circuits and reflex ball drills',
      'Outfield tracking and relay-throw coordination routines',
      'Conditioning-linked fielding drills under fatigue',
    ],
    relatedSlugs: ['wicket-keeping', 'fitness-agility', 'beginner'],
    scheduleAndFeeNote:
      'Batch timings and official fee structure are pending academy confirmation.',
  },
  {
    slug: 'wicket-keeping',
    code: '05',
    title: 'Wicket Keeping',
    category: 'Skill Track',
    focusLabel: 'Footwork · Glovework · Stumpings',
    shortDescription:
      'Low crouch posture, soft hands against brisk tape ball bounce, lateral movement, and quick-fire stumpings.',
    introduction:
      'Tape ball bounce can be sharp and unpredictable. Our Wicket Keeping module develops balanced crouch posture, late eye tracking, clean lateral footwork, and rapid glove-to-stump transfers.',
    skillsCovered: [
      'Comfortable crouch alignment and rise timing with the ball',
      'Soft hands when collecting brisk pace and uneven bounce',
      'Standing-up glovework for spinners and medium pacers',
      'Clean takes down the leg side and quick stumping transfers',
    ],
    trainingObjectives: [
      'Minimize byes and missed edge opportunities',
      'Strengthen footwork speed across both off and leg sides',
      'Develop vocal leadership and angle awareness behind the stumps',
    ],
    suitablePlayers: [
      'Dedicated wicket keepers refining glovework and footwork',
      'Multi-skilled batsmen adding wicket-keeping capability',
      'Junior players learning foundational keeping posture',
    ],
    trainingApproach: [
      'Close-range reaction and deflection glove drills',
      'Lateral cone-step routines paired with ball collection',
      'Live net keeping behind academy pace and spin bowlers',
    ],
    relatedSlugs: ['fielding', 'spin-bowling', 'batting'],
    scheduleAndFeeNote:
      'Batch timings and official fee structure are pending academy confirmation.',
  },
  {
    slug: 'fitness-agility',
    code: '06',
    title: 'Fitness & Agility',
    category: 'Skill Track',
    focusLabel: 'Speed · Stamina · Injury Prevention',
    shortDescription:
      'Cricket-specific sprint mechanics, ladder footwork, core stability, and shoulder conditioning for sustained output.',
    introduction:
      'Consistent cricket performance depends on athletic conditioning. This program builds sprint acceleration between the wickets, lateral change-of-direction speed, core stability, and joint resilience.',
    skillsCovered: [
      'Acceleration mechanics and turning speed between wickets',
      'Agility ladder footwork and multi-directional balance',
      'Core stability for batting power and bowling posture',
      'Rotator-cuff, hamstring, and ankle mobility routines',
    ],
    trainingObjectives: [
      'Improve repeat-sprint stamina across full match durations',
      'Enhance footwork agility for batting, keeping, and fielding',
      'Support long-term player durability with structured warm-ups',
    ],
    suitablePlayers: [
      'All cricket players wanting sharper movement and stamina',
      'Fast bowlers building bowling-load resilience',
      'Youth athletes developing coordination and body control',
    ],
    trainingApproach: [
      'Speed-ladder, cone-shuttle, and reaction-sprint blocks',
      'Bodyweight strength and core stability circuits',
      'Guided dynamic warm-ups and post-session mobility cooldowns',
    ],
    relatedSlugs: ['fast-bowling', 'fielding', 'beginner'],
    scheduleAndFeeNote:
      'Batch timings and official fee structure are pending academy confirmation.',
  },
  {
    slug: 'beginner',
    code: '07',
    title: 'Beginner Foundation Program',
    category: 'Level Track',
    focusLabel: 'Core Mechanics · Grip · Game Understanding',
    shortDescription:
      'Structured entry track teaching fundamental batting stance, bowling rhythm, safe catching, and match rules.',
    introduction:
      'The Beginner Foundation Program introduces new players to tape ball cricket in a supportive, structured setting. Emphasis is placed on clean habits, coordination, and enjoyment of the game.',
    skillsCovered: [
      'Correct bat grip, balanced stance, and basic straight-bat shots',
      'Simple, rhythmic bowling approach and safe release',
      'Two-handed catching, basic ground pickups, and throwing posture',
      'Understanding match rules, calling runs, and team communication',
    ],
    trainingObjectives: [
      'Establish safe, repeatable mechanics from day one',
      'Build coordination, confidence, and spatial awareness',
      'Prepare players smoothly for intermediate skill tracks',
    ],
    suitablePlayers: [
      'New entrants with minimal formal coaching background',
      'Young players transitioning from casual street play to structured nets',
      'Athletes building foundational hand-eye coordination',
    ],
    trainingApproach: [
      'Step-by-step coach demonstrations with small-group feedback',
      'Station-based drills rotating batting, bowling, and catching',
      'Encouraging, disciplined group sessions focused on fundamentals',
    ],
    relatedSlugs: ['batting', 'fielding', 'fitness-agility'],
    scheduleAndFeeNote:
      'Age group breakdown, batch timings, and fee details are pending academy confirmation.',
  },
  {
    slug: 'advanced',
    code: '08',
    title: 'Advanced Performance Program',
    category: 'Level Track',
    focusLabel: 'Match Scenarios · Death Execution · Tactical Depth',
    shortDescription:
      'High-tempo competitive preparation centered on pressure scenarios, bowling plans, and tactical match execution.',
    introduction:
      'Designed for experienced tape ball players competing in club and tournament cricket, the Advanced Performance Program sharpens decision-making, power-hitting matchups, and death-over bowling execution.',
    skillsCovered: [
      'Powerplay boundary options and gap manipulation against set fields',
      'High-pressure death-over bowling plans and field adjustments',
      'Reading pitch conditions and adapting shot/length selection quickly',
      'Leadership communication, game awareness, and workload management',
    ],
    trainingObjectives: [
      'Translate net skills reliably into high-stakes match situations',
      'Eliminate predictable patterns in batting and bowling plans',
      'Maintain peak physical sharpness and execution late in games',
    ],
    suitablePlayers: [
      'Experienced tape ball cricketers competing in regular tournaments',
      'Players progressing beyond core fundamentals into tactical refinement',
      'Committed athletes prepared for high-intensity net sessions',
    ],
    trainingApproach: [
      'Target-driven match simulations with scoreboard constraints',
      'Role-specific specialist drills for finishers and strike bowlers',
      'Structured coach feedback and tactical review blocks',
    ],
    relatedSlugs: ['batting', 'fast-bowling', 'personal-coaching'],
    scheduleAndFeeNote:
      'Assessment criteria, batch timings, and fee details are pending academy confirmation.',
  },
  {
    slug: 'personal-coaching',
    code: '09',
    title: 'Personal Coaching (1-on-1)',
    category: 'Individual Coaching',
    focusLabel: 'Tailored Drills · Focused Feedback · Custom Pace',
    shortDescription:
      'Individualized coaching sessions tailored to a player’s specific batting, bowling, or keeping goals.',
    introduction:
      'Personal Coaching provides dedicated one-on-one time focused entirely on an individual player’s technical priorities—whether correcting a batting trigger, refining a bowling release, or preparing for upcoming trials.',
    skillsCovered: [
      'Custom technical breakdown of stance, swing, or bowling action',
      'High-volume repetition tailored to individual weaknesses',
      'Focused preparation for specific match roles or upcoming trials',
      'Personalized conditioning and home-drill recommendations',
    ],
    trainingObjectives: [
      'Accelerate technical corrections with uninterrupted coach attention',
      'Build clarity around a player’s strongest scoring or wicket-taking plans',
      'Support focused preparation aligned with individual goals',
    ],
    suitablePlayers: [
      'Players seeking targeted technical adjustments',
      'Cricketers preparing for squad trials or competitive seasons',
      'Beginners or advanced athletes preferring individualized pacing',
    ],
    trainingApproach: [
      'Initial diagnostic check to isolate 2–3 highest-impact adjustments',
      'High-repetition sidearm, target-grid, or keeping drill blocks',
      'Clear post-session takeaways for continued practice',
    ],
    relatedSlugs: ['batting', 'fast-bowling', 'advanced'],
    scheduleAndFeeNote:
      'Session availability, duration, and personal coaching fee details are pending confirmation.',
  },
];

export const PROGRAM_BENEFITS = [
  {
    code: '01',
    title: 'Clear Progression Path',
    description:
      'Move naturally from foundational mechanics to specialized skill tracks and tactical match scenarios.',
  },
  {
    code: '02',
    title: 'Purposeful Net Volume',
    description:
      'Focused drills with clear targets replace unstructured waiting and casual hitting.',
  },
  {
    code: '03',
    title: 'Role Versatility',
    description:
      'Train primary strengths while developing complementary fielding, running, and tactical awareness.',
  },
  {
    code: '04',
    title: 'Trial Evaluation First',
    description:
      'Prospective players can book a free trial assessment to find the most suitable track.',
  },
] as const;

export interface CoachProfileData {
  slug: string;
  imagePlaceholderLabel: string;
  namePlaceholder: string;
  rolePlaceholder: string;
  experiencePlaceholder: string;
  specialties: string[];
  biographyPlaceholder: string;
  relatedProgramSlugs: string[];
}

export const COACHES_DATA: CoachProfileData[] = [
  {
    slug: 'head-coach-placeholder',
    imagePlaceholderLabel: 'Coach Portrait Placeholder #01',
    namePlaceholder: 'Coach Name Placeholder',
    rolePlaceholder: 'Head Coach · Role Placeholder',
    experiencePlaceholder: 'Coaching Experience & Certifications — Pending Official Verification',
    specialties: [
      'Batting Technique & Shot Selection',
      'Match Strategy & Squad Development',
      'Player Assessment & Progression Planning',
    ],
    biographyPlaceholder:
      'Placeholder Biography: Official background, coaching certifications, and competitive playing history for the Head Coach will be published here once confirmed by SK Tape Ball Academy.',
    relatedProgramSlugs: ['batting', 'advanced', 'personal-coaching'],
  },
  {
    slug: 'fast-bowling-coach-placeholder',
    imagePlaceholderLabel: 'Coach Portrait Placeholder #02',
    namePlaceholder: 'Coach Name Placeholder',
    rolePlaceholder: 'Bowling Specialist · Role Placeholder',
    experiencePlaceholder: 'Bowling Coaching Experience — Pending Official Verification',
    specialties: [
      'Fast Bowling Run-Up & Crease Alignment',
      'Death-Over Yorkers & Pace Variations',
      'Tape Ball Seam & Cutter Mechanics',
    ],
    biographyPlaceholder:
      'Placeholder Biography: Official coaching profile, specialist bowling background, and verified credentials will be added here once supplied by the academy.',
    relatedProgramSlugs: ['fast-bowling', 'spin-bowling', 'advanced'],
  },
  {
    slug: 'fielding-fitness-coach-placeholder',
    imagePlaceholderLabel: 'Coach Portrait Placeholder #03',
    namePlaceholder: 'Coach Name Placeholder',
    rolePlaceholder: 'Fielding & Fitness Lead · Role Placeholder',
    experiencePlaceholder: 'Conditioning & Fielding Credentials — Pending Official Verification',
    specialties: [
      'Reflex Catching & Outfield Throwing',
      'Wicket-Keeping Footwork & Glovework',
      'Cricket Agility, Sprint & Mobility Training',
    ],
    biographyPlaceholder:
      'Placeholder Biography: Verified qualifications in athletic conditioning, fielding drills, and wicket-keeping instruction will appear here once finalized.',
    relatedProgramSlugs: ['fielding', 'wicket-keeping', 'fitness-agility'],
  },
  {
    slug: 'foundation-coach-placeholder',
    imagePlaceholderLabel: 'Coach Portrait Placeholder #04',
    namePlaceholder: 'Coach Name Placeholder',
    rolePlaceholder: 'Foundation Batch Coach · Role Placeholder',
    experiencePlaceholder: 'Youth & Foundation Coaching Background — Pending Verification',
    specialties: [
      'Beginner Stance & Grip Fundamentals',
      'Coordination & Ball-Tracking Drills',
      'Discipline & Team Communication Habits',
    ],
    biographyPlaceholder:
      'Placeholder Biography: Official profile details for foundation-level coaching staff will be published here when confirmed.',
    relatedProgramSlugs: ['beginner', 'batting', 'fielding'],
  },
];

export const FACILITIES_PAGE_CONTENT = {
  kicker: 'Academy Facilities',
  title: 'Training Grounds & Practice Infrastructure',
  heroDescription:
    'Designed to support structured tape ball batting, bowling, fielding, and conditioning drills. Exact ground measurements and verified facility photographs remain placeholders until official assets are supplied.',
  overview:
    'A disciplined training environment relies on reliable practice lanes, clear target zones, well-maintained training equipment, and strict safety protocols. Below is the structured overview of SK Tape Ball Academy facility slots.',
  trainingAreas: [
    {
      code: '01',
      title: 'Training Ground & Pitch Area (Placeholder)',
      status: 'Ground Specifications Pending',
      description:
        'Reserved for verified ground dimensions, surface type details, and boundary setup specifications.',
    },
    {
      code: '02',
      title: 'Dedicated Practice Net Lanes (Placeholder)',
      status: 'Lane Count Pending',
      description:
        'Structured net bays supporting simultaneous batting, fast bowling, and spin bowling drill rotations.',
    },
    {
      code: '03',
      title: 'Evening Floodlight Setup (Placeholder)',
      status: 'Lighting Specs Pending',
      description:
        'Placeholder slot for evening training visibility details and night-session readiness.',
    },
    {
      code: '04',
      title: 'Fielding & Agility Zone (Placeholder)',
      status: 'Zone Details Pending',
      description:
        'Open turf/ground area reserved for agility ladders, sprint lanes, throwing drills, and wicket-keeping stations.',
    },
  ],
  equipmentResources: [
    {
      title: 'Tape Balls & Match-Spec Practice Kits',
      description:
        'Standardized practice balls, target stumps, and drill markers prepared for consistent skill repetition.',
    },
    {
      title: 'Target Cones & Precision Grids',
      description:
        'Length markers and boundary cones used in fast bowling yorker drills and batting gap-placement challenges.',
    },
    {
      title: 'Agility Ladders & Conditioning Gear',
      description:
        'Speed ladders, reaction balls, and warm-up resistance gear supporting cricket-specific mobility and speed.',
    },
    {
      title: 'Wicket-Keeping & Safety Equipment',
      description:
        'Protective pads, gloves, and drill screens supporting safe high-tempo net and keeping sessions.',
    },
  ],
  safetyStandards: [
    'Mandatory dynamic warm-up and joint activation before bowling or high-speed sprinting.',
    'Clear net-lane entry and exit rules to prevent cross-lane ball hazards.',
    'Coach-supervised drill spacing during throwing, catching, and power-hitting stations.',
    'Hydration breaks and workload monitoring aligned with player age and fitness level.',
  ],
  galleryItems: [
    {
      id: 'fac-lanes',
      title: 'Practice Net Lanes (Illustrative)',
      caption: 'Illustrative outdoor training lanes and agility setup.',
      imageSrc: '/src/assets/images/academy_training_lanes_1795439225599.jpg',
      imageAlt: 'Cricket practice net lanes and agility ladder setup at golden hour',
      isPlaceholder: false,
    },
    {
      id: 'fac-lights',
      title: 'Floodlit Pitch Visual (Illustrative)',
      caption: 'Illustrative evening practice environment under floodlights.',
      imageSrc: '/src/assets/images/hero_cricket_academy_1795439223672.jpg',
      imageAlt: 'Floodlit cricket practice pitch at twilight',
      isPlaceholder: false,
    },
    {
      id: 'fac-slot-1',
      title: 'Official Ground Photo Slot #01',
      caption: 'Reserved for verified photography of SK Tape Ball Academy pitch & nets.',
      imageSrc: null,
      imageAlt: 'Placeholder slot for official academy pitch photo',
      isPlaceholder: true,
    },
    {
      id: 'fac-slot-2',
      title: 'Official Equipment & Lounge Slot #02',
      caption: 'Reserved for verified equipment and player facility photography.',
      imageSrc: null,
      imageAlt: 'Placeholder slot for official equipment area photo',
      isPlaceholder: true,
    },
  ],
} as const;
