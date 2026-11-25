import heroImg from '@/src/assets/images/hero_cricket_academy_1795439223672.jpg';
import lanesImg from '@/src/assets/images/academy_training_lanes_1795439225599.jpg';

export const ABOUT_PAGE_CONTENT = {
  kicker: 'About Us',
  title: 'SK Tape Ball Academy',
  heroDescription:
    'WHERE DREAMS MEET OPPORTUNITIES. Structured fitness, batting, bowling, and fielding development in Sabzazar, Lahore.',
  overview: [
    'SK Tape Ball Academy was established from founder Sami Khan’s personal cricket journey. Through the ups and downs of his career, he experienced limited resources, fewer opportunities, and a lack of proper cricket awareness and guidance.',
    'These challenges inspired him to create a platform where young cricketers can access quality training, professional coaching, and meaningful opportunities.',
    'Launched in Faisalabad on 18 August 2024 and operating in Sabzazar, Lahore, the academy aims to help talented players develop so their dreams are not held back simply because they lack guidance or resources.',
  ],
  mission: {
    title: 'Our Mission',
    description:
      'To provide players with organized, quality tape-ball cricket training; improve their fitness and cricketing skills; build discipline, confidence, and sportsmanship; and create a pathway through which committed players can develop their potential and access cricket opportunities.',
  },
  vision: {
    title: 'Our Vision',
    description:
      'To develop SK Tape Ball Academy into a recognized, modern, and professionally managed cricket training platform; introduce structured coaching and player-development systems; identify and nurture emerging talent; and provide players with platforms to compete, improve, and progress.',
  },
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
  philosophy: [
    {
      code: '01',
      title: 'Assess the Player',
      description: 'Evaluate each player and identify technical strengths and weaknesses.',
    },
    {
      code: '02',
      title: 'Focused Practice',
      description: 'Work on specific areas across fitness, batting, bowling, and fielding.',
    },
    {
      code: '03',
      title: 'Structured Drills',
      description: 'Apply targeted drills and practice methods suited to each skill.',
    },
    {
      code: '04',
      title: 'Progressive Repetition',
      description: 'Build timing, accuracy, control, and consistency step by step.',
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
    slug: 'fitness-agility',
    code: '01',
    title: 'Athletic Fitness & Conditioning',
    category: 'Skill Track',
    focusLabel: 'Stamina · Power · Speed · Mobility · Flexibility · Elasticity',
    shortDescription:
      'Around 200 structured athletic exercises building repeat-sprint stamina, explosive power, mobility, flexibility, and joint elasticity.',
    introduction:
      'Physical readiness underpins every fast bowling spell, diving boundary save, and late-innings surge. Our conditioning module draws from ~200 structured exercises tailored specifically to tape ball cricket movement demands.',
    skillsCovered: [
      'Aerobic and anaerobic stamina for high-tempo tournament days',
      'Explosive lower-body and rotational core power for hitting and bowling',
      'Sprint acceleration, agility footwork, and change-of-direction speed',
      'Shoulder, hip, hamstring mobility, flexibility, and joint elasticity',
    ],
    trainingObjectives: [
      'Build resilient joints and reduce common overuse strains',
      'Sustain explosive pace and sharp reflexes late into matches',
      'Improve running speed between wickets and outfield coverage',
    ],
    suitablePlayers: [
      'Every academy athlete building an athletic cricket foundation',
      'Fast bowlers increasing run-up intensity and workload durability',
      'Power hitters developing stronger balance and rotational force',
    ],
    trainingApproach: [
      'Progressive warm-ups targeting elasticity and joint range of motion',
      'Sprint intervals, agility ladders, and multi-directional reaction drills',
      'Structured strength and conditioning circuits calibrated to player level',
    ],
    relatedSlugs: ['batting', 'fast-bowling', 'fielding'],
    scheduleAndFeeNote:
      'Integrated across weekly sessions in Sabzazar, Lahore. Submit a Registration Application for batch placement details.',
  },
  {
    slug: 'batting',
    code: '02',
    title: 'Tape Ball Batting',
    category: 'Skill Track',
    focusLabel: 'Strength Assessment · Shot Methods · Match Hitting',
    shortDescription:
      'Begins with individual strengths and weaknesses assessment, followed by 20–25 structured practice methods per cricket shot.',
    introduction:
      'Tape ball batting demands clean contact, sharp balance, and versatile scoring areas. We assess every batsman’s natural strengths and technical weaknesses first, then train each shot systematically through 20–25 progressive drill methods.',
    skillsCovered: [
      'Diagnostic review of grip, stance, trigger movement, and bat path',
      '20–25 structured practice methods per shot for repeatable execution',
      'Orthodox drives, pulls, cuts, and clean boundary power hitting',
      'Reading slower deliveries, cutters, and high-pace tape ball yorkers',
    ],
    trainingObjectives: [
      'Address individual technical weaknesses systematically',
      'Develop balanced shot selection across powerplay, middle, and death overs',
      'Build repeatable muscle memory under live bowling pressure',
    ],
    suitablePlayers: [
      'Batsmen refining shot range, timing, and boundary power',
      'All-rounders looking for reliable scoring consistency',
      'New academy players building sound foundational posture',
    ],
    trainingApproach: [
      'Baseline batting diagnostic to map strengths and correction priorities',
      'Step-by-step shot progression drills using structured feed variations',
      'Target-zone net sessions and single-wicket pressure scenarios',
    ],
    relatedSlugs: ['fast-bowling', 'fitness-agility', 'personal-coaching'],
    scheduleAndFeeNote:
      'Diagnostic assessment begins upon registration review in Sabzazar, Lahore. Apply online to schedule onboarding.',
  },
  {
    slug: 'fast-bowling',
    code: '03',
    title: 'Tape Ball Bowling',
    category: 'Skill Track',
    focusLabel: 'Speed · Accuracy · Line & Length · Variations',
    shortDescription:
      'Structured pace and precision coaching focused on bowling speed, target accuracy, line and length discipline, and variations.',
    introduction:
      'Winning tape ball matches depends on disciplined lines, pace control, and deceptive change-ups. This program refines run-up rhythm, wrist release, and target accuracy so bowlers execute plans confidently under pressure.',
    skillsCovered: [
      'Run-up alignment and balanced gather to unlock natural bowling speed',
      'Pinpoint accuracy at yorker, hard-length, and wide-channel targets',
      'Disciplined line and length consistency against aggressive hitters',
      'Deceptive slower balls, cutters, and bounce variations with a taped ball',
    ],
    trainingObjectives: [
      'Improve control over speed, accuracy, line, and length',
      'Build a reliable tactical toolkit for opening and death overs',
      'Maintain biomechanically clean mechanics to protect shoulder and back health',
    ],
    suitablePlayers: [
      'Fast and medium-pace tape ball bowlers aiming for higher accuracy',
      'Young bowlers developing clean, repeatable release mechanics',
      'Match bowlers preparing for competitive leagues and single-wicket events',
    ],
    trainingApproach: [
      'Alignment and wrist-snap drills for clean seam presentation',
      'Target-cone grid bowling measuring length consistency',
      'Simulated over-by-over tactical spells with set field rings',
    ],
    relatedSlugs: ['batting', 'spin-bowling', 'fitness-agility'],
    scheduleAndFeeNote:
      'Available across weekday and evening practice tracks in Sabzazar, Lahore.',
  },
  {
    slug: 'fielding',
    code: '04',
    title: 'Fielding & Catching',
    category: 'Skill Track',
    focusLabel: 'Short Catches · Fast Catches · Long Catches · Ground Fielding',
    shortDescription:
      'Dedicated practice covering short close-in catches, fast reaction catches, high boundary catches, and clean ground pickups.',
    introduction:
      'Sharp fielding turns tight tape ball fixtures. Our fielding track isolates all four critical match scenarios—short catches, fast reaction catches, long/high catches, and ground fielding—paired with accurate throwing.',
    skillsCovered: [
      'Short catches: low eye-line balance and soft hands inside the inner ring',
      'Fast catches: explosive reflex tracking against hard-struck shots',
      'Long & high catches: judging trajectory under floodlights and open sky',
      'Ground fielding: clean one-handed and two-handed pickups with flat throws',
    ],
    trainingObjectives: [
      'Increase catching reliability across all infield and boundary positions',
      'Speed up pickup-to-release time for sharper run-out execution',
      'Build confident movement and safe throwing biomechanics',
    ],
    suitablePlayers: [
      'All academy players across batting and bowling roles',
      'Athletes preparing for competitive squad standards',
      'Players developing quicker reflexes and outfield agility',
    ],
    trainingApproach: [
      'Dedicated stations for short, fast, and high-trajectory catching',
      'Pressure ground-fielding relays with target stumps',
      'Conditioning-integrated fielding circuits at match speed',
    ],
    relatedSlugs: ['wicket-keeping', 'fitness-agility', 'beginner'],
    scheduleAndFeeNote:
      'Included as a core athletic requirement across academy training cohorts.',
  },
  {
    slug: 'spin-bowling',
    code: '05',
    title: 'Spin Bowling',
    category: 'Skill Track',
    focusLabel: 'Grip · Flight · Line & Length Control',
    shortDescription:
      'Tactical finger and wrist spin instruction focused on turn, flight variation, and disciplined stump-to-stump control.',
    introduction:
      'Spin bowlers disrupt big-hitting momentum in tape ball leagues through subtle pace changes and smart field placement. Players learn consistent release points and calm tactical bowling.',
    skillsCovered: [
      'Finger and wrist spin grip mechanics suited to taped balls',
      'Varying flight and pace while maintaining consistent release rhythm',
      'Attacking stump-to-stump lines and tactical wide-channel plans',
      'Arm-ball, slider, and defensive length variations',
    ],
    trainingObjectives: [
      'Control length consistently against aggressive batting lineups',
      'Read batsman footwork early and adjust delivery angles',
      'Build tactical confidence through middle-over pressure spells',
    ],
    suitablePlayers: [
      'Finger spinners and wrist spinners seeking tighter accuracy',
      'All-rounders adding reliable slow-bowling overs to their skill set',
      'Developing players learning field-setting strategy',
    ],
    trainingApproach: [
      'Pivot and follow-through balance drills for spin energy',
      'Target-zone bowling against set left- and right-handed setups',
      'Match-situation drills restricting boundary scoring areas',
    ],
    relatedSlugs: ['fast-bowling', 'wicket-keeping', 'fielding'],
    scheduleAndFeeNote:
      'Available across core skill training batches in Sabzazar, Lahore.',
  },
  {
    slug: 'wicket-keeping',
    code: '06',
    title: 'Wicket Keeping',
    category: 'Skill Track',
    focusLabel: 'Footwork · Glovework · Stumpings',
    shortDescription:
      'Low crouch posture, soft hands against brisk tape ball bounce, lateral footwork, and rapid stumping reflexes.',
    introduction:
      'Sharp wicket keeping requires balance, late ball tracking, and quick glove transfers. This track prepares keepers to stand up to spinners and react cleanly against brisk pace bounce.',
    skillsCovered: [
      'Balanced crouch posture and controlled rise timing',
      'Soft hands when gathering sharp tape ball deflection and bounce',
      'Standing-up glovework for spinners and medium-pace deliveries',
      'Quick lateral footwork and clean stumping/run-out transfers',
    ],
    trainingObjectives: [
      'Reduce missed takes and conceded byes behind the stumps',
      'Improve foot speed across both off and leg sides',
      'Develop vocal leadership and field-angle awareness',
    ],
    suitablePlayers: [
      'Specialist wicket keepers refining reaction and footwork',
      'Top-order batsmen developing dual-role keeping value',
      'Junior players learning clean glovework habits',
    ],
    trainingApproach: [
      'Short-distance reaction and deflection glove drills',
      'Lateral agility step routines paired with ball collection',
      'Live net keeping behind academy pace and spin bowlers',
    ],
    relatedSlugs: ['fielding', 'spin-bowling', 'batting'],
    scheduleAndFeeNote:
      'Combined with fielding reflex stations and live net keeping.',
  },
  {
    slug: 'beginner',
    code: '07',
    title: 'Beginner Foundation Program',
    category: 'Level Track',
    focusLabel: 'Core Mechanics · Fitness Habits · Game Understanding',
    shortDescription:
      'Entry pathway establishing balanced batting posture, rhythmic bowling release, safe catching, and match awareness.',
    introduction:
      'Ideal for newcomers transitioning from casual play into organized coaching, the Beginner Foundation Program introduces core movement habits, proper grip and stance mechanics, and structured practice discipline.',
    skillsCovered: [
      'Balanced batting grip, stance, and clean straight-bat movement',
      'Rhythmic bowling approach and target-line alignment',
      'Safe short, fast, and ground fielding fundamentals',
      'Understanding match roles, calling runs, and team discipline',
    ],
    trainingObjectives: [
      'Establish safe, repeatable athletic and technical fundamentals',
      'Build confidence, coordination, and spatial awareness',
      'Prepare players to transition into specialized skill tracks',
    ],
    suitablePlayers: [
      'Newcomers with little or no prior structured coaching experience',
      'Young players moving from street play to organized academy sessions',
      'Athletes building core hand-eye coordination and fitness habits',
    ],
    trainingApproach: [
      'Guided coach demonstrations in manageable training groups',
      'Station rotations across batting, bowling, catching, and agility',
      'Supportive diagnostic feedback tailored to individual pace',
    ],
    relatedSlugs: ['fitness-agility', 'batting', 'fielding'],
    scheduleAndFeeNote:
      'Submit an online registration application so coaches can recommend your ideal starting group.',
  },
  {
    slug: 'advanced',
    code: '08',
    title: 'Advanced Performance Program',
    category: 'Level Track',
    focusLabel: 'Match Scenarios · League Prep · Single-Wicket Intensity',
    shortDescription:
      'High-intensity preparation for tournament play featuring pressure scenarios, death-over execution, and tactical depth.',
    introduction:
      'Built for experienced tape ball cricketers competing in leagues and knockout tournaments, this program stress-tests technique and decision-making in realistic match situations.',
    skillsCovered: [
      'High-tempo boundary options against set tournament fields',
      'Death-over bowling execution and variation sequencing',
      'Rapid situational adaptation during chases and tight defenses',
      'Mental resilience, leadership, and game-plan clarity',
    ],
    trainingObjectives: [
      'Convert net-session mechanics into tournament consistency',
      'Sharpen single-wicket and league match tactical awareness',
      'Maintain peak physical output under high competitive pressure',
    ],
    suitablePlayers: [
      'Experienced club and tournament tape ball cricketers',
      'Players graduating from foundational tracks into competitive play',
      'Dedicated athletes targeting league and single-wicket performance',
    ],
    trainingApproach: [
      'Scoreboard-pressure batting and bowling scenario drills',
      'Detailed strengths/weaknesses diagnostics and shot refinement',
      'Structured academy leagues and single-wicket competitive events',
    ],
    relatedSlugs: ['batting', 'fast-bowling', 'personal-coaching'],
    scheduleAndFeeNote:
      'Placement follows an initial skill evaluation by the coaching staff.',
  },
  {
    slug: 'personal-coaching',
    code: '09',
    title: 'Personal Coaching (1-on-1)',
    category: 'Individual Coaching',
    focusLabel: 'Individual Diagnostic · Custom Drill Methods · Direct Feedback',
    shortDescription:
      'Dedicated one-on-one coaching focused around a single athlete’s technical batting, bowling, fielding, or fitness goals.',
    introduction:
      'Personal Coaching gives players focused individual attention—identifying specific batting or bowling weaknesses and applying targeted methods from our ~200 fitness exercises and 20–25 shot drill sequences.',
    skillsCovered: [
      'Deep individual assessment of batting mechanics or bowling action',
      'Targeted correction of technical flaws using progressive drill methods',
      'Custom conditioning blocks aligned with individual fitness priorities',
      'Focused preparation for competitive tournament seasons',
    ],
    trainingObjectives: [
      'Accelerate technical corrections with uninterrupted coach guidance',
      'Clarify a player’s strongest scoring zones or wicket-taking deliveries',
      'Provide clear practice routines players can reinforce independently',
    ],
    suitablePlayers: [
      'Players looking for targeted 1-on-1 technical refinement',
      'Cricketers preparing for squad selections or key leagues',
      'Beginners or competitive players preferring personalized pacing',
    ],
    trainingApproach: [
      'Individual strengths and weaknesses baseline review',
      'High-repetition diagnostic drill blocks with immediate feedback',
      'Clear progression milestones across scheduled 1-on-1 sessions',
    ],
    relatedSlugs: ['batting', 'fast-bowling', 'advanced'],
    scheduleAndFeeNote:
      'Contact the academy or submit a registration application to arrange 1-on-1 session availability.',
  },
];

export const PROGRAM_BENEFITS = [
  {
    code: '01',
    title: 'Diagnostic Assessment First',
    description:
      'We evaluate each player’s strengths and weaknesses before assigning targeted drill progressions.',
  },
  {
    code: '02',
    title: '20–25 Methods Per Shot',
    description:
      'Systematic repetition methods replace aimless hitting so batting mechanics hold up under match pressure.',
  },
  {
    code: '03',
    title: '~200 Fitness Exercises',
    description:
      'Comprehensive stamina, power, speed, mobility, flexibility, and elasticity conditioning built into training.',
  },
  {
    code: '04',
    title: 'Leagues & Single-Wicket Play',
    description:
      'Players test their development in academy-organized tape ball leagues and single-wicket events.',
  },
] as const;

export const FACILITIES_PAGE_CONTENT = {
  kicker: 'Academy Facilities',
  title: 'Training Environment & Practice Infrastructure',
  heroDescription:
    'Operating in Sabzazar, Lahore, our training environment supports structured fitness conditioning, diagnostic batting lanes, pace and spin target bowling, and complete catching stations.',
  overview:
    'Focused cricket development depends on well-organized training lanes, clear bowling targets, structured fielding areas, and disciplined safety standards across every session.',
  trainingAreas: [
    {
      code: '01',
      title: 'Dedicated Batting & Shot Practice Lanes',
      status: 'Active Training Zone',
      description:
        'Structured net bays built for diagnostic stance assessment and 20–25 progressive practice methods per shot.',
    },
    {
      code: '02',
      title: 'Speed, Accuracy & Line Bowling Zones',
      status: 'Active Training Zone',
      description:
        'Target-marked bowling channels focused on run-up rhythm, yorker blockholes, and disciplined line and length.',
    },
    {
      code: '03',
      title: 'Catching & Ground Fielding Stations',
      status: 'Active Training Zone',
      description:
        'Dedicated space for short catches, fast reaction catches, long/high catches, and agile ground pickups.',
    },
    {
      code: '04',
      title: 'Athletic Fitness & Conditioning Area',
      status: 'Active Training Zone',
      description:
        'Equipped for ~200 structured conditioning drills covering stamina, sprint speed, power, mobility, and flexibility.',
    },
  ],
  equipmentResources: [
    {
      title: 'Match-Grade Tape Balls & Practice Targets',
      description:
        'Consistent match-ready tape balls, stumps, and length target markers for accurate bowling and batting drills.',
    },
    {
      title: 'Agility Ladders, Cones & Sprint Markers',
      description:
        'Conditioning apparatus supporting footwork speed, acceleration intervals, and change-of-direction balance.',
    },
    {
      title: 'Reaction & Catching Training Gear',
      description:
        'Specialized catching aids and drill setups for close-in reflexes, fast reactions, and high boundary tracking.',
    },
    {
      title: 'Wicket-Keeping & Safety Equipment',
      description:
        'Protective pads, keeping gloves, and organized lane separation to keep high-tempo sessions safe.',
    },
  ],
  safetyStandards: [
    'Mandatory dynamic warm-ups, mobility activation, and cooldown routines in every session.',
    'Strict net-lane entry and exit discipline to keep batsmen, bowlers, and fielders protected.',
    'Coach-supervised spacing across throwing, fast catching, and power-hitting drills.',
    'Structured hydration breaks and workload management tailored to player age and fitness readiness.',
  ],
  galleryItems: [
    {
      id: 'fac-lanes',
      title: 'Practice Lanes & Agility Setup',
      caption: 'Outdoor training lanes paired with agility ladders and boundary cones.',
      imageSrc: lanesImg,
      imageAlt: 'Cricket practice net lanes and agility ladder setup',
    },
    {
      id: 'fac-lights',
      title: 'Evening Floodlit Pitch Environment',
      caption: 'Evening practice pitch prepared for batting, bowling, and match simulations.',
      imageSrc: heroImg,
      imageAlt: 'Floodlit cricket practice pitch at twilight',
    },
  ],
} as const;
