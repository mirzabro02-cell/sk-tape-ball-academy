import heroStadiumImg from '@/src/assets/images/hero_tape_ball_stadium_1795604835985.jpg';
import heroImg from '@/src/assets/images/hero_cricket_academy_1795439223672.jpg';
import lanesImg from '@/src/assets/images/academy_training_lanes_1795439225599.jpg';
import battingImg from '@/src/assets/images/drill_power_batting_1795439224792.jpg';
import paceImg from '@/src/assets/images/drill_pace_bowling_1795439224452.jpg';
import fieldingImg from '@/src/assets/images/drill_fielding_agility_1795439226739.jpg';

/**
 * Official Branding Asset Configuration
 *
 * Unmodified official crest supplied by SK Tape Ball Academy.
 * Do NOT recolor, distort, or recreate the official crest.
 */
export const OFFICIAL_LOGO_CONFIG = {
  src: '/assets/aistudio/SK_Tape_Ball_Academy_Crest_f75649f7.png',
  alt: 'SK Tape Ball Academy Official Crest',
} as const;

export const HERO_STADIUM_VISUAL = heroStadiumImg;

export const ADMIN_IMAGE_ASSETS = [
  { label: 'Stadium Tape Ball Action Hero', path: heroStadiumImg },
  { label: 'Academy Twilight Pitch', path: heroImg },
  { label: 'Practice Lanes & Agility Setup', path: lanesImg },
  { label: 'Power Batting Timing Drill', path: battingImg },
  { label: 'Pace & Line Bowling Session', path: paceImg },
  { label: 'Fielding & Catching Circuit', path: fieldingImg },
] as const;
