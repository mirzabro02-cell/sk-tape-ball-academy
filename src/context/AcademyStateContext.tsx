import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import heroImg from '@/src/assets/images/hero_cricket_academy_1795439223672.jpg';
import lanesImg from '@/src/assets/images/academy_training_lanes_1795439225599.jpg';
import battingImg from '@/src/assets/images/drill_power_batting_1795439224792.jpg';
import paceImg from '@/src/assets/images/drill_pace_bowling_1795439224452.jpg';
import fieldingImg from '@/src/assets/images/drill_fielding_agility_1795439226739.jpg';
import { OFFICIAL_LOGO_CONFIG } from '@/src/assets/branding';
import { ACADEMY_BRAND } from '@/src/data/brand';
import type {
  AdminAchievement,
  AdminApplication,
  AdminBatch,
  AdminBlogPost,
  AdminCoach,
  AdminFeePackage,
  AdminFeeRecord,
  AdminMatch,
  AdminMediaItem,
  AdminPaymentHistoryItem,
  AdminProgram,
  AdminScheduleItem,
  AdminStudent,
  AdminTestimonial,
  AdminTrialBooking,
  AdminWebsiteContentSection,
} from '@/src/types/admin';
import { createManagedMedia, type ManagedMediaValue } from '@/src/types/media';
import { sanitizeExternalUrl } from '@/src/utils/validation';

export interface AcademySocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
}

export interface AcademySiteSettings {
  academyName: string;
  shortName: string;
  tagline: string;
  footerBio: string;
  founderName: string;
  launchedNote: string;
  phone: string;
  whatsappUrlOrNumber: string;
  email: string;
  locationText: string;
  mapUrl: string;
  trainingHours: string;
  socials: AcademySocialLinks;
  logo: ManagedMediaValue;
  heroMedia: ManagedMediaValue;
  aboutMedia: ManagedMediaValue;
  showPublicFees: boolean;
  seoTitle: string;
  seoDescription: string;
  notifyApplications: boolean;
  notifyTrials: boolean;
  notifyFees: boolean;
  adminDisplayName: string;
  adminEmail: string;
}

export interface AcademyPersistedState {
  siteSettings: AcademySiteSettings;
  coaches: AdminCoach[];
  programs: AdminProgram[];
  batches: AdminBatch[];
  schedules: AdminScheduleItem[];
  matches: AdminMatch[];
  achievements: AdminAchievement[];
  gallery: AdminMediaItem[];
  testimonials: AdminTestimonial[];
  blogPosts: AdminBlogPost[];
  students: AdminStudent[];
  applications: AdminApplication[];
  trials: AdminTrialBooking[];
  feePackages: AdminFeePackage[];
  feeRecords: AdminFeeRecord[];
  paymentHistory: AdminPaymentHistoryItem[];
  websiteSections: AdminWebsiteContentSection[];
}

const STORAGE_KEY = 'sk_academy_site_state_v1';

const DEFAULT_SITE_SETTINGS: AcademySiteSettings = {
  academyName: ACADEMY_BRAND.name,
  shortName: ACADEMY_BRAND.shortName,
  tagline: ACADEMY_BRAND.tagline,
  footerBio:
    'Dedicated tape ball cricket coaching focused on athletic fitness, structured batting methods, bowling precision, and disciplined fielding in Sabzazar, Lahore.',
  founderName: ACADEMY_BRAND.founderName,
  launchedNote: ACADEMY_BRAND.launchedNote,
  phone: '',
  whatsappUrlOrNumber: '',
  email: '',
  locationText: ACADEMY_BRAND.operatingLocation,
  mapUrl: '',
  trainingHours: '',
  socials: {
    facebook: '',
    instagram: '',
    youtube: '',
    tiktok: '',
  },
  logo: createManagedMedia(OFFICIAL_LOGO_CONFIG.src, { fit: 'contain', posX: 50, posY: 50, scale: 1 }),
  heroMedia: createManagedMedia(heroImg, { fit: 'cover', posX: 50, posY: 50, scale: 1 }),
  aboutMedia: createManagedMedia(lanesImg, { fit: 'cover', posX: 50, posY: 50, scale: 1 }),
  showPublicFees: false,
  seoTitle: 'SK Tape Ball Academy — Where Dreams Meet Opportunities.',
  seoDescription:
    'SK Tape Ball Academy in Sabzazar, Lahore. Structured tape ball cricket coaching covering fitness, batting, bowling, and fielding.',
  notifyApplications: true,
  notifyTrials: true,
  notifyFees: false,
  adminDisplayName: 'Academy Administrator',
  adminEmail: '',
};

const DEFAULT_PROGRAMS: AdminProgram[] = [
  {
    id: 'prog-fitness',
    code: '01',
    title: 'Athletic Fitness & Conditioning',
    category: 'Skill Track',
    description:
      'Around 200 structured exercises building stamina, explosive power, sprint speed, mobility, flexibility, and joint elasticity.',
    imagePath: lanesImg,
    published: true,
    enrolledDemoCount: 0,
  },
  {
    id: 'prog-batting',
    code: '02',
    title: 'Tape Ball Batting',
    category: 'Skill Track',
    description:
      'Individual strengths and weaknesses assessment paired with 20–25 structured practice methods per cricket shot.',
    imagePath: battingImg,
    published: true,
    enrolledDemoCount: 0,
  },
  {
    id: 'prog-bowling',
    code: '03',
    title: 'Tape Ball Bowling',
    category: 'Skill Track',
    description:
      'Targeted drills to build raw pace, target accuracy, disciplined line and length, and variation control.',
    imagePath: paceImg,
    published: true,
    enrolledDemoCount: 0,
  },
  {
    id: 'prog-fielding',
    code: '04',
    title: 'Fielding & Catching',
    category: 'Skill Track',
    description:
      'Complete fielding routines covering short catches, fast reaction catches, long and high boundary catches, and clean ground pickups.',
    imagePath: fieldingImg,
    published: true,
    enrolledDemoCount: 0,
  },
  {
    id: 'prog-keeping',
    code: '05',
    title: 'Wicket Keeping',
    category: 'Skill Track',
    description:
      'Low crouch alignment, soft hands against sharp tape ball bounce, lateral footwork, and rapid stumping reflexes.',
    imagePath: fieldingImg,
    published: true,
    enrolledDemoCount: 0,
  },
  {
    id: 'prog-spin',
    code: '06',
    title: 'Spin Bowling',
    category: 'Skill Track',
    description:
      'Grip control, flight variation, and tactical stump-to-stump discipline for middle-over tape ball control.',
    imagePath: lanesImg,
    published: true,
    enrolledDemoCount: 0,
  },
  {
    id: 'prog-beginner',
    code: '07',
    title: 'Beginner Foundation Program',
    category: 'Level Track',
    description:
      'Structured entry coaching establishing stance balance, bowling rhythm, safe catching, and match awareness.',
    imagePath: lanesImg,
    published: true,
    enrolledDemoCount: 0,
  },
  {
    id: 'prog-advanced',
    code: '08',
    title: 'Advanced Performance Program',
    category: 'Level Track',
    description:
      'High-tempo scenario sessions focused on league match execution, death-over plans, and pressure decision-making.',
    imagePath: heroImg,
    published: true,
    enrolledDemoCount: 0,
  },
  {
    id: 'prog-personal',
    code: '09',
    title: 'Personal Coaching (1-on-1)',
    category: 'Individual Coaching',
    description:
      'Individual diagnostic sessions tailored around a single player’s technical batting, bowling, or keeping goals.',
    imagePath: battingImg,
    published: true,
    enrolledDemoCount: 0,
  },
];

const DEFAULT_GALLERY: AdminMediaItem[] = [
  {
    id: 'med-hero',
    mediaType: 'image',
    title: 'Twilight Practice Pitch',
    category: 'Campus & Ground',
    caption: 'Evening floodlit tape ball practice environment.',
    assetPath: heroImg,
    published: true,
    uploadedLabel: 'Academy Visual',
  },
  {
    id: 'med-lanes',
    mediaType: 'image',
    title: 'Practice Lanes & Agility Setup',
    category: 'Training Drills',
    caption: 'Structured training lanes with agility ladder and boundary cones.',
    assetPath: lanesImg,
    published: true,
    uploadedLabel: 'Academy Visual',
  },
  {
    id: 'med-batting',
    mediaType: 'image',
    title: 'Power Batting Timing Drill',
    category: 'Training Drills',
    caption: 'Focused shot execution and balance drills under floodlights.',
    assetPath: battingImg,
    published: true,
    uploadedLabel: 'Academy Visual',
  },
  {
    id: 'med-bowling',
    mediaType: 'image',
    title: 'Pace & Line Accuracy Session',
    category: 'Bowling Clinic',
    caption: 'Release discipline and target-zone bowling practice.',
    assetPath: paceImg,
    published: true,
    uploadedLabel: 'Academy Visual',
  },
  {
    id: 'med-fielding',
    mediaType: 'image',
    title: 'Catching & Reflex Circuit',
    category: 'Training Drills',
    caption: 'Close catching, ground pickups, and wicket-keeping reactions.',
    assetPath: fieldingImg,
    published: true,
    uploadedLabel: 'Academy Visual',
  },
];

const DEFAULT_WEBSITE_SECTIONS: AdminWebsiteContentSection[] = [
  {
    id: 'hero',
    label: 'Homepage Hero Content',
    headline: 'Structured Tape Ball Cricket Coaching for Competitive Match Readiness',
    subheadline: ACADEMY_BRAND.tagline,
    ctaLabel: 'Explore Programs',
    bodyNotes:
      'SK Tape Ball Academy in Sabzazar, Lahore pairs disciplined athletic conditioning (~200 exercises), structured batting and bowling practice methods, and focused fielding drills.',
    lastUpdatedLabel: 'Active',
  },
  {
    id: 'about',
    label: 'About Section',
    headline: 'Developing Complete Tape Ball Cricketers',
    subheadline: 'Founded by Sami Khan · Launched 18 August 2024 in Faisalabad · Operating in Sabzazar, Lahore',
    ctaLabel: 'About Academy',
    bodyNotes:
      'Built on passion, sportsmanship, leadership, integrity, teamwork, discipline, excellence, resilience, and continuous improvement.',
    lastUpdatedLabel: 'Active',
  },
  {
    id: 'programs',
    label: 'Training Programs Content',
    headline: 'Core Coaching Tracks & Individual Pathways',
    subheadline: 'Fitness, Batting, Bowling, Fielding, Wicket Keeping & Level Tracks',
    ctaLabel: 'View Programs',
    bodyNotes: 'Controls curriculum copy and program cards across /programs.',
    lastUpdatedLabel: 'Active',
  },
  {
    id: 'coaches',
    label: 'Coach Profiles Content',
    headline: 'Coaching Staff Directory',
    subheadline: 'Official coaching profiles managed directly in the Coach Management portal',
    ctaLabel: 'Meet Coaches',
    bodyNotes: 'Public /coaches page shows only verified, published coach records.',
    lastUpdatedLabel: 'Active',
  },
  {
    id: 'achievements',
    label: 'Achievements Section',
    headline: 'Player Milestones & Academy Honors',
    subheadline: 'Verified tournament and squad milestones appear automatically once published',
    ctaLabel: 'View Achievements',
    bodyNotes: 'Controls public milestones on /achievements.',
    lastUpdatedLabel: 'Active',
  },
  {
    id: 'gallery',
    label: 'Gallery Content',
    headline: 'Training Ground & Session Gallery',
    subheadline: 'Manage published photos and video clips with custom crop and positioning',
    ctaLabel: 'Open Gallery',
    bodyNotes: 'Controls public photo and video cards on /gallery.',
    lastUpdatedLabel: 'Active',
  },
  {
    id: 'testimonials',
    label: 'Testimonials Section',
    headline: 'Parent & Player Feedback',
    subheadline: 'Approved testimonials appear cleanly when published',
    ctaLabel: 'Submit Inquiry',
    bodyNotes: 'Hidden automatically on homepage until verified reviews are published.',
    lastUpdatedLabel: 'Active',
  },
  {
    id: 'contact',
    label: 'Contact Information',
    headline: 'Sabzazar, Lahore, Pakistan',
    subheadline: 'Configure official phone, WhatsApp, email, hours, and ground map link in Settings',
    ctaLabel: 'Contact Academy',
    bodyNotes: 'Synced with public /contact page and global footer.',
    lastUpdatedLabel: 'Active',
  },
];

const DEFAULT_STATE: AcademyPersistedState = {
  siteSettings: DEFAULT_SITE_SETTINGS,
  coaches: [],
  programs: DEFAULT_PROGRAMS,
  batches: [],
  schedules: [],
  matches: [],
  achievements: [],
  gallery: DEFAULT_GALLERY,
  testimonials: [],
  blogPosts: [],
  students: [],
  applications: [],
  trials: [],
  feePackages: [],
  feeRecords: [],
  paymentHistory: [],
  websiteSections: DEFAULT_WEBSITE_SECTIONS,
};

function mergeLoadedState(raw: Partial<AcademyPersistedState> | null): AcademyPersistedState {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_STATE;
  }

  return {
    siteSettings: {
      ...DEFAULT_SITE_SETTINGS,
      ...(raw.siteSettings ?? {}),
      socials: {
        ...DEFAULT_SITE_SETTINGS.socials,
        ...(raw.siteSettings?.socials ?? {}),
      },
      logo: raw.siteSettings?.logo ?? DEFAULT_SITE_SETTINGS.logo,
      heroMedia: raw.siteSettings?.heroMedia ?? DEFAULT_SITE_SETTINGS.heroMedia,
      aboutMedia: raw.siteSettings?.aboutMedia ?? DEFAULT_SITE_SETTINGS.aboutMedia,
    },
    coaches: Array.isArray(raw.coaches) ? raw.coaches : DEFAULT_STATE.coaches,
    programs: Array.isArray(raw.programs) && raw.programs.length > 0 ? raw.programs : DEFAULT_STATE.programs,
    batches: Array.isArray(raw.batches) ? raw.batches : DEFAULT_STATE.batches,
    schedules: Array.isArray(raw.schedules) ? raw.schedules : DEFAULT_STATE.schedules,
    matches: Array.isArray(raw.matches) ? raw.matches : DEFAULT_STATE.matches,
    achievements: Array.isArray(raw.achievements) ? raw.achievements : DEFAULT_STATE.achievements,
    gallery: Array.isArray(raw.gallery) ? raw.gallery : DEFAULT_STATE.gallery,
    testimonials: Array.isArray(raw.testimonials) ? raw.testimonials : DEFAULT_STATE.testimonials,
    blogPosts: Array.isArray(raw.blogPosts) ? raw.blogPosts : DEFAULT_STATE.blogPosts,
    students: Array.isArray(raw.students) ? raw.students : DEFAULT_STATE.students,
    applications: Array.isArray(raw.applications) ? raw.applications : DEFAULT_STATE.applications,
    trials: Array.isArray(raw.trials) ? raw.trials : DEFAULT_STATE.trials,
    feePackages: Array.isArray(raw.feePackages) ? raw.feePackages : DEFAULT_STATE.feePackages,
    feeRecords: Array.isArray(raw.feeRecords) ? raw.feeRecords : DEFAULT_STATE.feeRecords,
    paymentHistory: Array.isArray(raw.paymentHistory) ? raw.paymentHistory : DEFAULT_STATE.paymentHistory,
    websiteSections:
      Array.isArray(raw.websiteSections) && raw.websiteSections.length > 0
        ? raw.websiteSections
        : DEFAULT_STATE.websiteSections,
  };
}

function loadInitialState(): AcademyPersistedState {
  if (typeof window === 'undefined') {
    return DEFAULT_STATE;
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_STATE;
    return mergeLoadedState(JSON.parse(saved) as Partial<AcademyPersistedState>);
  } catch {
    return DEFAULT_STATE;
  }
}

export interface AcademyStateContextValue {
  state: AcademyPersistedState;
  updateSiteSettings: (updater: (prev: AcademySiteSettings) => AcademySiteSettings) => void;
  setCoaches: (updater: AdminCoach[] | ((prev: AdminCoach[]) => AdminCoach[])) => void;
  setPrograms: (updater: AdminProgram[] | ((prev: AdminProgram[]) => AdminProgram[])) => void;
  setBatches: (updater: AdminBatch[] | ((prev: AdminBatch[]) => AdminBatch[])) => void;
  setSchedules: (
    updater: AdminScheduleItem[] | ((prev: AdminScheduleItem[]) => AdminScheduleItem[]),
  ) => void;
  setMatches: (updater: AdminMatch[] | ((prev: AdminMatch[]) => AdminMatch[])) => void;
  setAchievements: (
    updater: AdminAchievement[] | ((prev: AdminAchievement[]) => AdminAchievement[]),
  ) => void;
  setGallery: (updater: AdminMediaItem[] | ((prev: AdminMediaItem[]) => AdminMediaItem[])) => void;
  setTestimonials: (
    updater: AdminTestimonial[] | ((prev: AdminTestimonial[]) => AdminTestimonial[]),
  ) => void;
  setBlogPosts: (updater: AdminBlogPost[] | ((prev: AdminBlogPost[]) => AdminBlogPost[])) => void;
  setStudents: (updater: AdminStudent[] | ((prev: AdminStudent[]) => AdminStudent[])) => void;
  setApplications: (
    updater: AdminApplication[] | ((prev: AdminApplication[]) => AdminApplication[]),
  ) => void;
  setTrials: (
    updater: AdminTrialBooking[] | ((prev: AdminTrialBooking[]) => AdminTrialBooking[]),
  ) => void;
  setFeePackages: (
    updater: AdminFeePackage[] | ((prev: AdminFeePackage[]) => AdminFeePackage[]),
  ) => void;
  setFeeRecords: (
    updater: AdminFeeRecord[] | ((prev: AdminFeeRecord[]) => AdminFeeRecord[]),
  ) => void;
  setPaymentHistory: (
    updater:
      | AdminPaymentHistoryItem[]
      | ((prev: AdminPaymentHistoryItem[]) => AdminPaymentHistoryItem[]),
  ) => void;
  setWebsiteSections: (
    updater:
      | AdminWebsiteContentSection[]
      | ((prev: AdminWebsiteContentSection[]) => AdminWebsiteContentSection[]),
  ) => void;
  getSafeWhatsAppHref: () => string | null;
}

const AcademyStateContext = createContext<AcademyStateContextValue | null>(null);

export function AcademyStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AcademyPersistedState>(loadInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors cleanly without crashing UI
    }
  }, [state]);

  function updateSlice<K extends keyof AcademyPersistedState>(
    key: K,
    updater:
      | AcademyPersistedState[K]
      | ((prev: AcademyPersistedState[K]) => AcademyPersistedState[K]),
  ) {
    setState((prev) => ({
      ...prev,
      [key]: typeof updater === 'function' ? updater(prev[key]) : updater,
    }));
  }

  function getSafeWhatsAppHref(): string | null {
    const raw = state.siteSettings.whatsappUrlOrNumber.trim();
    if (!raw) return null;
    if (/^https?:\/\//i.test(raw)) {
      return sanitizeExternalUrl(raw);
    }
    const digits = raw.replace(/\D/g, '');
    if (digits.length >= 7 && digits.length <= 15) {
      return `https://wa.me/${digits}`;
    }
    return null;
  }

  return (
    <AcademyStateContext.Provider
      value={{
        state,
        updateSiteSettings: (updater) =>
          setState((prev) => ({ ...prev, siteSettings: updater(prev.siteSettings) })),
        setCoaches: (u) => updateSlice('coaches', u),
        setPrograms: (u) => updateSlice('programs', u),
        setBatches: (u) => updateSlice('batches', u),
        setSchedules: (u) => updateSlice('schedules', u),
        setMatches: (u) => updateSlice('matches', u),
        setAchievements: (u) => updateSlice('achievements', u),
        setGallery: (u) => updateSlice('gallery', u),
        setTestimonials: (u) => updateSlice('testimonials', u),
        setBlogPosts: (u) => updateSlice('blogPosts', u),
        setStudents: (u) => updateSlice('students', u),
        setApplications: (u) => updateSlice('applications', u),
        setTrials: (u) => updateSlice('trials', u),
        setFeePackages: (u) => updateSlice('feePackages', u),
        setFeeRecords: (u) => updateSlice('feeRecords', u),
        setPaymentHistory: (u) => updateSlice('paymentHistory', u),
        setWebsiteSections: (u) => updateSlice('websiteSections', u),
        getSafeWhatsAppHref,
      }}
    >
      {children}
    </AcademyStateContext.Provider>
  );
}

export function useAcademyState(): AcademyStateContextValue {
  const ctx = useContext(AcademyStateContext);
  if (!ctx) {
    throw new Error('useAcademyState must be used inside AcademyStateProvider');
  }
  return ctx;
}
