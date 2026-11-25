export type ScheduleDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type ScheduleCategory =
  | 'Fitness & Agility'
  | 'Batting'
  | 'Fast Bowling'
  | 'Spin Bowling'
  | 'Fielding'
  | 'Wicket Keeping'
  | 'Match Simulation';

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
  'Fitness & Agility',
  'Batting',
  'Fast Bowling',
  'Spin Bowling',
  'Fielding',
  'Wicket Keeping',
  'Match Simulation',
];

export const SCHEDULE_INFO_GUIDELINES = [
  {
    title: 'Batch Placement After Assessment',
    description:
      'New applicants complete a trial evaluation so coaches can assign an appropriate group and training schedule.',
  },
  {
    title: 'Reporting & Warm-Up Protocol',
    description:
      'Athletes arrive in proper athletic kit ahead of their assigned slot for structured mobility and activation warm-ups.',
  },
  {
    title: 'Conditioning & Skill Balance',
    description:
      'Weekly blocks integrate fitness exercises alongside batting drill methods, bowling targets, and catching stations.',
  },
  {
    title: 'Schedule Updates',
    description:
      'Any seasonal timing updates or league event adjustments are published here directly by academy administration.',
  },
] as const;

export type AchievementCategory =
  | 'Tournament Honors'
  | 'Player Milestones'
  | 'Academy Recognition';

export const ACHIEVEMENT_CATEGORIES: Array<'All' | AchievementCategory> = [
  'All',
  'Tournament Honors',
  'Player Milestones',
  'Academy Recognition',
];

export type GalleryCategory = 'Training Drills' | 'Match Highlights' | 'Bowling Clinic' | 'Campus & Ground';

export const GALLERY_CATEGORIES: Array<'All' | GalleryCategory> = [
  'All',
  'Training Drills',
  'Match Highlights',
  'Bowling Clinic',
  'Campus & Ground',
];
