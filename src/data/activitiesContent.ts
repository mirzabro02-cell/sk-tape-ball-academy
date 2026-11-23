export type ScheduleDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type ScheduleCategory =
  | 'Batting'
  | 'Fast Bowling'
  | 'Spin Bowling'
  | 'Fielding'
  | 'Wicket Keeping'
  | 'Fitness & Agility'
  | 'Match Simulation';

export interface WeeklyScheduleSlot {
  id: string;
  day: ScheduleDay;
  programCategory: ScheduleCategory;
  batchPlaceholder: string;
  timingPlaceholder: string;
  zonePlaceholder: string;
  focusSummary: string;
}

export const SCHEDULE_DAYS: ScheduleDay[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const SCHEDULE_CATEGORIES: ScheduleCategory[] = [
  'Batting',
  'Fast Bowling',
  'Spin Bowling',
  'Fielding',
  'Wicket Keeping',
  'Fitness & Agility',
  'Match Simulation',
];

/**
 * Structured Schedule Data (Part 4 Sample Placeholders)
 * Prepared to accept live database records from Supabase in a later phase.
 * No actual academy timings or batch availabilities are invented.
 */
export const WEEKLY_SCHEDULE_SLOTS: WeeklyScheduleSlot[] = [
  {
    id: 'mon-batting',
    day: 'Monday',
    programCategory: 'Batting',
    batchPlaceholder: 'Batch Group A / B (Placeholder)',
    timingPlaceholder: 'Timing Pending Confirmation',
    zonePlaceholder: 'Main Practice Nets (Placeholder)',
    focusSummary: 'Stance alignment, straight-bat timing, and power-hitting base drills.',
  },
  {
    id: 'mon-fitness',
    day: 'Monday',
    programCategory: 'Fitness & Agility',
    batchPlaceholder: 'All Enrolled Batches (Placeholder)',
    timingPlaceholder: 'Timing Pending Confirmation',
    zonePlaceholder: 'Agility & Conditioning Zone (Placeholder)',
    focusSummary: 'Dynamic mobility, ladder footwork, and sprint acceleration intervals.',
  },
  {
    id: 'tue-pace',
    day: 'Tuesday',
    programCategory: 'Fast Bowling',
    batchPlaceholder: 'Pace Clinic Batch (Placeholder)',
    timingPlaceholder: 'Timing Pending Confirmation',
    zonePlaceholder: 'Target Bowling Lanes (Placeholder)',
    focusSummary: 'Run-up rhythm, crease gather, and blockhole yorker target accuracy.',
  },
  {
    id: 'wed-spin',
    day: 'Wednesday',
    programCategory: 'Spin Bowling',
    batchPlaceholder: 'Spin & Control Batch (Placeholder)',
    timingPlaceholder: 'Timing Pending Confirmation',
    zonePlaceholder: 'Spin Lanes (Placeholder)',
    focusSummary: 'Grip consistency, drift control, and field-oriented line discipline.',
  },
  {
    id: 'wed-keeping',
    day: 'Wednesday',
    programCategory: 'Wicket Keeping',
    batchPlaceholder: 'Specialist Keeping Group (Placeholder)',
    timingPlaceholder: 'Timing Pending Confirmation',
    zonePlaceholder: 'Keeping Station (Placeholder)',
    focusSummary: 'Low crouch posture, soft-hand bounce collection, and stumping speed.',
  },
  {
    id: 'thu-fielding',
    day: 'Thursday',
    programCategory: 'Fielding',
    batchPlaceholder: 'Squad Fielding Batch (Placeholder)',
    timingPlaceholder: 'Timing Pending Confirmation',
    zonePlaceholder: 'Outfield & Ring Zone (Placeholder)',
    focusSummary: 'Close-in reflex catches, high-ball tracking, and flat stump throws.',
  },
  {
    id: 'fri-batting',
    day: 'Friday',
    programCategory: 'Batting',
    batchPlaceholder: 'Advanced Hitting Batch (Placeholder)',
    timingPlaceholder: 'Timing Pending Confirmation',
    zonePlaceholder: 'Floodlit Net Lanes (Placeholder)',
    focusSummary: 'Death-over boundary options and reading slower-ball variations.',
  },
  {
    id: 'sat-match',
    day: 'Saturday',
    programCategory: 'Match Simulation',
    batchPlaceholder: 'Combined Squad Session (Placeholder)',
    timingPlaceholder: 'Timing Pending Confirmation',
    zonePlaceholder: 'Main Academy Pitch (Placeholder)',
    focusSummary: 'Structured scenario overs simulating chase and total-defense pressure.',
  },
  {
    id: 'sun-trials',
    day: 'Sunday',
    programCategory: 'Match Simulation',
    batchPlaceholder: 'Trial & Review Slot (Placeholder)',
    timingPlaceholder: 'Timing Pending Confirmation',
    zonePlaceholder: 'Academy Ground (Placeholder)',
    focusSummary: 'Prospective player trial evaluations and coach feedback reviews.',
  },
];

export const SCHEDULE_INFO_GUIDELINES = [
  {
    title: 'Timing Confirmation Policy',
    description:
      'Exact morning, afternoon, and evening floodlight batch timings are published only after official academy confirmation.',
  },
  {
    title: 'Reporting & Warm-Up Protocol',
    description:
      'Players are expected to report ahead of their assigned slot in athletic kit for structured group warm-ups.',
  },
  {
    title: 'Batch Placement via Free Trial',
    description:
      'New entrants are assigned to an appropriate batch following an initial skill and movement evaluation.',
  },
  {
    title: 'Weather & Ground Updates',
    description:
      'Any seasonal adjustments to outdoor net slots will be communicated directly through official academy channels.',
  },
] as const;

export type MatchEventStatus = 'Upcoming Event' | 'Recent Match';

export interface MatchEventItem {
  slug: string;
  type: MatchEventStatus;
  statusBadge: string;
  titlePlaceholder: string;
  datePlaceholder: string;
  locationPlaceholder: string;
  shortDescription: string;
  fullDescription: string;
  imageSrc: string | null;
  imageAlt: string;
  participantsPlaceholder: string[];
  scorecardNote: string;
  scorecardRowsPlaceholder: Array<{
    inningLabel: string;
    teamLabel: string;
    summaryPlaceholder: string;
  }>;
  ctaType: 'trial' | 'register' | 'contact';
}

export const MATCHES_EVENTS_DATA: MatchEventItem[] = [
  {
    slug: 'practice-match-fixture-placeholder',
    type: 'Upcoming Event',
    statusBadge: 'Upcoming · Placeholder',
    titlePlaceholder: 'Academy Practice Fixture (Placeholder)',
    datePlaceholder: 'Date & Time Pending Confirmation',
    locationPlaceholder: 'Official Academy Ground (Placeholder)',
    shortDescription:
      'Structured intra-academy or invited practice match slot prepared for upcoming fixture confirmation.',
    fullDescription:
      'This event page is ready to display confirmed match fixtures, reporting instructions, participating squads, and post-match summaries once official scheduling is published by SK Tape Ball Academy.',
    imageSrc: '/src/assets/images/hero_cricket_academy_1795439223672.jpg',
    imageAlt: 'Floodlit cricket academy ground prepared for evening practice match',
    participantsPlaceholder: [
      'SK Academy Squad A (Placeholder)',
      'Opponent / Squad B (Pending Confirmation)',
    ],
    scorecardNote:
      'Match has not taken place yet. Confirmed lineups and results will be updated post-match.',
    scorecardRowsPlaceholder: [
      {
        inningLabel: '1st Innings',
        teamLabel: 'Participating Squad Placeholder',
        summaryPlaceholder: 'Scorecard Pending Match Completion',
      },
      {
        inningLabel: '2nd Innings',
        teamLabel: 'Participating Squad Placeholder',
        summaryPlaceholder: 'Scorecard Pending Match Completion',
      },
    ],
    ctaType: 'register',
  },
  {
    slug: 'open-trial-camp-placeholder',
    type: 'Upcoming Event',
    statusBadge: 'Trial Camp · Placeholder',
    titlePlaceholder: 'Open Assessment & Trial Session (Placeholder)',
    datePlaceholder: 'Upcoming Camp Date Pending',
    locationPlaceholder: 'Academy Practice Nets (Placeholder)',
    shortDescription:
      'Evaluation camp slot for new tape ball cricket applicants across batting, bowling, and keeping tracks.',
    fullDescription:
      'Prospective players undergo structured net evaluations covering batting stance, pace or spin release consistency, catching reflexes, and movement agility before batch placement.',
    imageSrc: '/src/assets/images/academy_training_lanes_1795439225599.jpg',
    imageAlt: 'Cricket practice lanes and agility cones prepared for trial camp',
    participantsPlaceholder: [
      'New Trial Applicants (Open Registration)',
      'Academy Assessment Coaches (Placeholder)',
    ],
    scorecardNote:
      'Assessment events do not produce match scorecards; player placement feedback is provided directly.',
    scorecardRowsPlaceholder: [],
    ctaType: 'trial',
  },
  {
    slug: 'inter-batch-showcase-placeholder',
    type: 'Upcoming Event',
    statusBadge: 'Upcoming · Placeholder',
    titlePlaceholder: 'Inter-Batch Scenario Challenge (Placeholder)',
    datePlaceholder: 'Date Pending Confirmation',
    locationPlaceholder: 'Main Academy Pitch (Placeholder)',
    shortDescription:
      'Scenario-driven match simulation testing death-over bowling plans and high-tempo chase execution.',
    fullDescription:
      'An internal training showcase emphasizing tactical field placements, running between wickets, and pressure bowling under floodlights.',
    imageSrc: '/src/assets/images/drill_power_batting_1795439224792.jpg',
    imageAlt: 'Batsman playing a lofted shot inside floodlit cricket nets',
    participantsPlaceholder: [
      'Batch Group Track 01 (Placeholder)',
      'Batch Group Track 02 (Placeholder)',
    ],
    scorecardNote: 'Scenario summary and performance notes will be recorded after the session.',
    scorecardRowsPlaceholder: [],
    ctaType: 'contact',
  },
  {
    slug: 'recent-match-recap-placeholder',
    type: 'Recent Match',
    statusBadge: 'Recent Match · Placeholder',
    titlePlaceholder: 'Recent Practice Match Recap (Placeholder)',
    datePlaceholder: 'Match Date Pending Official Archive',
    locationPlaceholder: 'Ground Details Pending',
    shortDescription:
      'Template for verified post-match summaries, key moments, and official scorecards without synthetic statistics.',
    fullDescription:
      'Official match recaps and verified tape ball tournament results will be archived here once supplied by SK Tape Ball Academy. No match outcomes or statistics are invented.',
    imageSrc: '/src/assets/images/drill_pace_bowling_1795439224452.jpg',
    imageAlt: 'Fast bowler releasing a cricket ball during evening match play',
    participantsPlaceholder: [
      'SK Tape Ball Academy XI (Placeholder)',
      'Opponent Name Pending Official Record',
    ],
    scorecardNote:
      'Official scorecard data is pending verification. No synthetic runs, wickets, or winners are displayed.',
    scorecardRowsPlaceholder: [
      {
        inningLabel: '1st Innings',
        teamLabel: 'Team Name Placeholder',
        summaryPlaceholder: 'Verified Score Pending',
      },
      {
        inningLabel: '2nd Innings',
        teamLabel: 'Team Name Placeholder',
        summaryPlaceholder: 'Verified Score Pending',
      },
    ],
    ctaType: 'contact',
  },
  {
    slug: 'recent-skills-clinic-placeholder',
    type: 'Recent Match',
    statusBadge: 'Academy Activity · Placeholder',
    titlePlaceholder: 'Fielding & Keeping Assessment Day (Placeholder)',
    datePlaceholder: 'Event Date Pending Archive',
    locationPlaceholder: 'Academy Fielding Zone (Placeholder)',
    shortDescription:
      'Placeholder recap slot for academy fielding workshops, reflex clinics, and squad drills.',
    fullDescription:
      'Summary slot reserved for verified academy workshops, special coaching clinics, and seasonal player activity highlights.',
    imageSrc: '/src/assets/images/drill_fielding_agility_1795439226739.jpg',
    imageAlt: 'Wicket keeper and fielders completing reflex catching drills',
    participantsPlaceholder: ['Enrolled Academy Squads (Placeholder)'],
    scorecardNote: 'Clinic recap — no match scorecard applicable.',
    scorecardRowsPlaceholder: [],
    ctaType: 'trial',
  },
];

export type AchievementCategory =
  | 'Tournament Honors'
  | 'Player Milestones'
  | 'Academy Recognition';

export interface AchievementItem {
  id: string;
  category: AchievementCategory;
  titlePlaceholder: string;
  yearOrPeriodPlaceholder: string;
  summaryPlaceholder: string;
  linkedPlayerSlug?: string;
}

export const ACHIEVEMENT_CATEGORIES: Array<'All' | AchievementCategory> = [
  'All',
  'Tournament Honors',
  'Player Milestones',
  'Academy Recognition',
];

export const ACADEMY_ACHIEVEMENTS_DATA: AchievementItem[] = [
  {
    id: 'ach-tournament-01',
    category: 'Tournament Honors',
    titlePlaceholder: 'Tournament Cup / Finalist Honor (Placeholder)',
    yearOrPeriodPlaceholder: 'Season Pending Verification',
    summaryPlaceholder:
      'Placeholder record reserved for verified tape ball tournament titles, finals appearances, and cup honors earned by SK Tape Ball Academy squads.',
    linkedPlayerSlug: 'player-spotlight-01',
  },
  {
    id: 'ach-milestone-02',
    category: 'Player Milestones',
    titlePlaceholder: 'Squad Selection Milestone (Placeholder)',
    yearOrPeriodPlaceholder: 'Period Pending Verification',
    summaryPlaceholder:
      'Placeholder record reserved for verified player call-ups to regional, club, or competitive tape ball representative squads.',
    linkedPlayerSlug: 'player-spotlight-02',
  },
  {
    id: 'ach-recognition-03',
    category: 'Academy Recognition',
    titlePlaceholder: 'Seasonal Discipline & Effort Award (Placeholder)',
    yearOrPeriodPlaceholder: 'Term Pending Verification',
    summaryPlaceholder:
      'Placeholder recognition card highlighting academy standards in attendance, fitness progression, and team leadership.',
    linkedPlayerSlug: 'player-spotlight-03',
  },
  {
    id: 'ach-milestone-04',
    category: 'Player Milestones',
    titlePlaceholder: 'High-Performance Training Benchmark (Placeholder)',
    yearOrPeriodPlaceholder: 'Season Pending Verification',
    summaryPlaceholder:
      'Reserved for verified academy player achievements in bowling target accuracy, power hitting, or wicket keeping.',
    linkedPlayerSlug: 'player-spotlight-04',
  },
];

export interface PlayerProfileData {
  slug: string;
  photoPlaceholderLabel: string;
  namePlaceholder: string;
  playingRole: string;
  battingStyle: string;
  bowlingStyle: string;
  spotlightTag: string;
  shortBioPlaceholder: string;
  achievementHistoryPlaceholders: string[];
  relatedProgramSlugs: string[];
}

export const PLAYER_PROFILES_DATA: PlayerProfileData[] = [
  {
    slug: 'player-spotlight-01',
    photoPlaceholderLabel: 'Player Photo Placeholder #01',
    namePlaceholder: 'Player Name Placeholder #01',
    playingRole: 'Top-Order Batsman (Sample Role)',
    battingStyle: 'Right-Handed Bat (Sample)',
    bowlingStyle: 'Part-Time Off-Spin (Sample)',
    spotlightTag: 'Demonstration Spotlight Profile',
    shortBioPlaceholder:
      'Demonstration Profile: This slot is prepared for verified SK Tape Ball Academy player profiles, training background, and match readiness highlights.',
    achievementHistoryPlaceholders: [
      'Achievement Entry Placeholder — Verified tournament performance pending.',
      'Milestone Entry Placeholder — Official seasonal honors pending.',
    ],
    relatedProgramSlugs: ['batting', 'advanced'],
  },
  {
    slug: 'player-spotlight-02',
    photoPlaceholderLabel: 'Player Photo Placeholder #02',
    namePlaceholder: 'Player Name Placeholder #02',
    playingRole: 'Fast Bowler (Sample Role)',
    battingStyle: 'Right-Handed Bat (Sample)',
    bowlingStyle: 'Right-Arm Fast (Sample)',
    spotlightTag: 'Demonstration Spotlight Profile',
    shortBioPlaceholder:
      'Demonstration Profile: Reserved for verified academy pace bowler details, death-over development focus, and official tournament records.',
    achievementHistoryPlaceholders: [
      'Achievement Entry Placeholder — Verified bowling milestone pending.',
      'Milestone Entry Placeholder — Representative selection record pending.',
    ],
    relatedProgramSlugs: ['fast-bowling', 'fitness-agility'],
  },
  {
    slug: 'player-spotlight-03',
    photoPlaceholderLabel: 'Player Photo Placeholder #03',
    namePlaceholder: 'Player Name Placeholder #03',
    playingRole: 'All-Rounder (Sample Role)',
    battingStyle: 'Left-Handed Bat (Sample)',
    bowlingStyle: 'Slow Left-Arm Spin (Sample)',
    spotlightTag: 'Demonstration Spotlight Profile',
    shortBioPlaceholder:
      'Demonstration Profile: Placeholder biography demonstrating how multi-discipline academy players and their progression milestones are presented.',
    achievementHistoryPlaceholders: [
      'Achievement Entry Placeholder — Verified all-round performance pending.',
      'Recognition Entry Placeholder — Academy discipline award pending.',
    ],
    relatedProgramSlugs: ['spin-bowling', 'batting'],
  },
  {
    slug: 'player-spotlight-04',
    photoPlaceholderLabel: 'Player Photo Placeholder #04',
    namePlaceholder: 'Player Name Placeholder #04',
    playingRole: 'Wicket-Keeper Batsman (Sample Role)',
    battingStyle: 'Right-Handed Bat (Sample)',
    bowlingStyle: 'N/A — Specialist Wicket Keeper',
    spotlightTag: 'Demonstration Spotlight Profile',
    shortBioPlaceholder:
      'Demonstration Profile: Prepared for verified wicket-keeping specialists within the academy, showcasing glovework and batting roles.',
    achievementHistoryPlaceholders: [
      'Achievement Entry Placeholder — Verified keeping record pending.',
      'Milestone Entry Placeholder — Squad honor pending confirmation.',
    ],
    relatedProgramSlugs: ['wicket-keeping', 'fielding'],
  },
];

export type GalleryCategory = 'Training' | 'Matches' | 'Events' | 'Facility';

export interface GalleryMediaItem {
  id: string;
  title: string;
  category: GalleryCategory;
  caption: string;
  imageSrc: string | null;
  imageAlt: string;
  isPlaceholderSlot: boolean;
}

export const GALLERY_CATEGORIES: Array<'All' | GalleryCategory> = [
  'All',
  'Training',
  'Matches',
  'Events',
  'Facility',
];

export const GALLERY_MEDIA_ITEMS: GalleryMediaItem[] = [
  {
    id: 'media-batting-nets',
    title: 'Floodlit Batting Drill (Illustrative)',
    category: 'Training',
    caption: 'Illustrative evening net session highlighting lofted bat swing mechanics.',
    imageSrc: '/src/assets/images/drill_power_batting_1795439224792.jpg',
    imageAlt: 'Batsman playing a lofted drive inside floodlit cricket nets',
    isPlaceholderSlot: false,
  },
  {
    id: 'media-pace-bowling',
    title: 'Pace Bowling Release Work (Illustrative)',
    category: 'Matches',
    caption: 'Illustrative fast bowler delivery stride near target cones and stumps.',
    imageSrc: '/src/assets/images/drill_pace_bowling_1795439224452.jpg',
    imageAlt: 'Fast bowler releasing the ball near wooden stumps',
    isPlaceholderSlot: false,
  },
  {
    id: 'media-fielding-keeping',
    title: 'Wicket-Keeping & Fielding Reflexes (Illustrative)',
    category: 'Training',
    caption: 'Illustrative close-catching and wicket-keeping agility drill.',
    imageSrc: '/src/assets/images/drill_fielding_agility_1795439226739.jpg',
    imageAlt: 'Wicket-keeper and fielders practicing reflex catches with cones',
    isPlaceholderSlot: false,
  },
  {
    id: 'media-facility-lanes',
    title: 'Practice Lanes & Agility Zone (Illustrative)',
    category: 'Facility',
    caption: 'Illustrative outdoor practice bays, agility ladders, and boundary cones.',
    imageSrc: '/src/assets/images/academy_training_lanes_1795439225599.jpg',
    imageAlt: 'Outdoor cricket practice lanes and agility ladder setup',
    isPlaceholderSlot: false,
  },
  {
    id: 'media-hero-ground',
    title: 'Twilight Floodlit Pitch (Illustrative)',
    category: 'Facility',
    caption: 'Illustrative floodlit cricket pitch prepared for evening practice.',
    imageSrc: '/src/assets/images/hero_cricket_academy_1795439223672.jpg',
    imageAlt: 'Floodlit cricket pitch with bat and taped ball at twilight',
    isPlaceholderSlot: false,
  },
  {
    id: 'media-slot-match-01',
    title: 'Official Match Photography Slot #01',
    category: 'Matches',
    caption: 'Reserved for verified SK Tape Ball Academy tournament and practice match photos.',
    imageSrc: null,
    imageAlt: 'Reserved placeholder slot for official match photograph',
    isPlaceholderSlot: true,
  },
  {
    id: 'media-slot-event-01',
    title: 'Trial Camp & Academy Event Slot #01',
    category: 'Events',
    caption: 'Reserved for verified photography from academy trial days and workshops.',
    imageSrc: null,
    imageAlt: 'Reserved placeholder slot for official trial camp photograph',
    isPlaceholderSlot: true,
  },
  {
    id: 'media-slot-event-02',
    title: 'Awards & Team Photo Slot #02',
    category: 'Events',
    caption: 'Reserved for verified team lineups, awards, and seasonal recognition events.',
    imageSrc: null,
    imageAlt: 'Reserved placeholder slot for official academy event photograph',
    isPlaceholderSlot: true,
  },
];

export interface VideoPlaceholderItem {
  id: string;
  titlePlaceholder: string;
  category: GalleryCategory;
  durationPlaceholder: string;
  descriptionPlaceholder: string;
  posterSrc: string | null;
}

export const GALLERY_VIDEOS_DATA: VideoPlaceholderItem[] = [
  {
    id: 'vid-batting-drills',
    titlePlaceholder: 'Power Hitting & Footwork Reel (Video Placeholder)',
    category: 'Training',
    durationPlaceholder: 'Duration Pending',
    descriptionPlaceholder:
      'Reserved video preview slot for official SK Tape Ball Academy batting drill footage.',
    posterSrc: '/src/assets/images/drill_power_batting_1795439224792.jpg',
  },
  {
    id: 'vid-bowling-mechanics',
    titlePlaceholder: 'Yorker & Pace Variation Breakdown (Video Placeholder)',
    category: 'Training',
    durationPlaceholder: 'Duration Pending',
    descriptionPlaceholder:
      'Reserved video preview slot for official fast bowling and death-over drill clips.',
    posterSrc: '/src/assets/images/drill_pace_bowling_1795439224452.jpg',
  },
  {
    id: 'vid-match-highlights',
    titlePlaceholder: 'Academy Match Highlights Slot (Video Placeholder)',
    category: 'Matches',
    durationPlaceholder: 'Duration Pending',
    descriptionPlaceholder:
      'Reserved video preview slot for verified match highlights and academy trial recaps.',
    posterSrc: '/src/assets/images/hero_cricket_academy_1795439223672.jpg',
  },
];
