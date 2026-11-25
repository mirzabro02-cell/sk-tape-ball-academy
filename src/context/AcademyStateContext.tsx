import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import heroImg from '@/src/assets/images/hero_cricket_academy_1795439223672.jpg';
import lanesImg from '@/src/assets/images/academy_training_lanes_1795439225599.jpg';
import battingImg from '@/src/assets/images/drill_power_batting_1795439224792.jpg';
import paceImg from '@/src/assets/images/drill_pace_bowling_1795439224452.jpg';
import fieldingImg from '@/src/assets/images/drill_fielding_agility_1795439226739.jpg';
import { HERO_STADIUM_VISUAL, OFFICIAL_LOGO_CONFIG } from '@/src/assets/branding';
import { ACADEMY_BRAND } from '@/src/data/brand';
import { isSupabaseConfigured } from '@/src/services/supabaseClient';
import {
  deleteSupabaseStudent,
  fetchCoreSupabaseData,
  insertSupabaseAdmission,
  lookupSupabaseApplicationStatus,
  updateSupabaseAdmission,
  upsertSupabaseStudent,
  type RegistrationSubmitInput,
  type RepositoryActionResult,
} from '@/src/services/supabaseAcademyService';
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
  AdminWebsiteContentSection,
  AdmissionDecisionStatus,
} from '@/src/types/admin';
import { createManagedMedia, type ManagedMediaValue } from '@/src/types/media';
import { sanitizeExternalUrl } from '@/src/utils/validation';

export interface AcademySocialLinks {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
}

export interface AcademyMaintenanceSettings {
  enabled: boolean;
  heading: string;
  message: string;
  reopeningDateTime: string;
  contactPhone: string;
  contactEmail: string;
  whatsapp: string;
  backgroundMedia: ManagedMediaValue;
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
  maintenance: AcademyMaintenanceSettings;
  showPublicFees: boolean;
  seoTitle: string;
  seoDescription: string;
  notifyApplications: boolean;
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
  heroMedia: createManagedMedia(HERO_STADIUM_VISUAL, { fit: 'cover', posX: 70, posY: 35, scale: 1 }),
  aboutMedia: createManagedMedia(lanesImg, { fit: 'cover', posX: 50, posY: 50, scale: 1 }),
  maintenance: {
    enabled: false,
    heading: "We're Under Maintenance",
    message:
      'We are upgrading our academy website and training portal to deliver an improved experience. Thank you for your patience—we will be back online shortly.',
    reopeningDateTime: '',
    contactPhone: '',
    contactEmail: '',
    whatsapp: '',
    backgroundMedia: createManagedMedia(HERO_STADIUM_VISUAL, {
      fit: 'cover',
      posX: 60,
      posY: 40,
      scale: 1,
    }),
  },
  showPublicFees: false,
  seoTitle: 'SK Tape Ball Academy — Where Dreams Meet Opportunities.',
  seoDescription:
    'SK Tape Ball Academy in Sabzazar, Lahore. Structured tape ball cricket coaching covering fitness, batting, bowling, and fielding.',
  notifyApplications: true,
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
    imagePath: HERO_STADIUM_VISUAL,
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
    id: 'med-stadium',
    mediaType: 'image',
    title: 'Floodlit Tape Ball Action Session',
    category: 'Match Highlights',
    caption: 'Evening floodlit tape ball batting execution under stadium lights.',
    assetPath: HERO_STADIUM_VISUAL,
    published: true,
    uploadedLabel: 'Academy Visual',
  },
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
    caption: 'Short, fast, long/high catching, and ground-fielding drills.',
    assetPath: fieldingImg,
    published: true,
    uploadedLabel: 'Academy Visual',
  },
];

const DEFAULT_WEBSITE_SECTIONS: AdminWebsiteContentSection[] = [
  {
    id: 'hero',
    label: 'Hero Section',
    headline: 'Where Dreams Meet Opportunities.',
    subheadline: ACADEMY_BRAND.name,
    ctaLabel: 'Register Now',
    bodyNotes:
      'SK Tape Ball Academy in Sabzazar, Lahore focuses on structured fitness, batting, bowling, and fielding development.',
    lastUpdatedLabel: 'Published',
    visible: true,
    published: true,
  },
  {
    id: 'about',
    label: 'About Section',
    headline: 'Structured, Skill-Based & Repetition-Focused',
    subheadline: 'Founded by Sami Khan · Launched 18 August 2024 in Faisalabad · Sabzazar, Lahore',
    ctaLabel: 'About Academy',
    bodyNotes:
      'Founded by Sami Khan and launched on 18 August 2024 in Faisalabad (operating in Sabzazar, Lahore), the academy builds complete players through progressive practice.',
    lastUpdatedLabel: 'Published',
    visible: true,
    published: true,
  },
  {
    id: 'programs',
    label: 'Training Programs',
    headline: 'Core Training Areas',
    subheadline: 'Fitness, Tape Ball Batting, Tape Ball Bowling & Fielding',
    ctaLabel: 'View All Programs',
    bodyNotes: 'Displays the four confirmed training areas on the homepage and full tracks on /programs.',
    lastUpdatedLabel: 'Published',
    visible: true,
    published: true,
  },
  {
    id: 'coaches',
    label: 'Coaches Directory',
    headline: 'Coaching Staff Directory',
    subheadline: 'Official coaching profiles managed directly in the Coach Management portal',
    ctaLabel: 'Meet Coaches',
    bodyNotes: 'Public /coaches page shows only verified, published coach records.',
    lastUpdatedLabel: 'Published',
    visible: true,
    published: true,
  },
  {
    id: 'matches',
    label: 'Matches & Results',
    headline: 'Tape Ball Leagues & Single-Wicket Events',
    subheadline: 'Scheduled academy fixtures, match results, and tournament events',
    ctaLabel: 'Matches & Events',
    bodyNotes: 'Controls fixtures and match result cards on the homepage and /matches.',
    lastUpdatedLabel: 'Published',
    visible: true,
    published: true,
  },
  {
    id: 'achievements',
    label: 'Achievements',
    headline: 'Player Milestones & Academy Honors',
    subheadline: 'Verified tournament and squad milestones appear automatically once published',
    ctaLabel: 'View Achievements',
    bodyNotes: 'Controls public milestones on /achievements.',
    lastUpdatedLabel: 'Published',
    visible: true,
    published: true,
  },
  {
    id: 'gallery',
    label: 'Gallery',
    headline: 'Training Ground & Session Gallery',
    subheadline: 'Manage published photos and video clips with custom crop and positioning',
    ctaLabel: 'Open Gallery',
    bodyNotes: 'Controls public photo and video cards on /gallery.',
    lastUpdatedLabel: 'Published',
    visible: true,
    published: true,
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    headline: 'Parent & Player Feedback',
    subheadline: 'Approved testimonials appear cleanly when published',
    ctaLabel: 'Submit Inquiry',
    bodyNotes: 'Shown on homepage automatically once verified reviews are published.',
    lastUpdatedLabel: 'Published',
    visible: true,
    published: true,
  },
  {
    id: 'blog',
    label: 'News & Updates',
    headline: 'Academy Announcements & Updates',
    subheadline: 'Official training notices and match updates published by the academy',
    ctaLabel: 'All Updates',
    bodyNotes: 'Synced with published posts on /updates.',
    lastUpdatedLabel: 'Published',
    visible: true,
    published: true,
  },
  {
    id: 'contact',
    label: 'Contact Section',
    headline: 'Questions or Admissions Inquiry?',
    subheadline: 'Sabzazar, Lahore · Full contact details and inquiry form on the Contact page',
    ctaLabel: 'Contact Us',
    bodyNotes: 'Links cleanly from the homepage to the dedicated /contact page.',
    lastUpdatedLabel: 'Published',
    visible: true,
    published: true,
  },
  {
    id: 'footer',
    label: 'Footer & Legal',
    headline: 'SK Tape Ball Academy',
    subheadline: 'Where Dreams Meet Opportunities.',
    ctaLabel: 'Register Now',
    bodyNotes: 'Controls academy footer identity alongside verified social and contact channels.',
    lastUpdatedLabel: 'Published',
    visible: true,
    published: true,
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
      heroMedia: raw.siteSettings?.heroMedia?.src
        ? raw.siteSettings.heroMedia
        : DEFAULT_SITE_SETTINGS.heroMedia,
      aboutMedia: raw.siteSettings?.aboutMedia ?? DEFAULT_SITE_SETTINGS.aboutMedia,
      maintenance: {
        ...DEFAULT_SITE_SETTINGS.maintenance,
        ...(raw.siteSettings?.maintenance ?? {}),
        backgroundMedia: raw.siteSettings?.maintenance?.backgroundMedia?.src
          ? raw.siteSettings.maintenance.backgroundMedia
          : DEFAULT_SITE_SETTINGS.maintenance.backgroundMedia,
      },
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
    feePackages: Array.isArray(raw.feePackages) ? raw.feePackages : DEFAULT_STATE.feePackages,
    feeRecords: Array.isArray(raw.feeRecords) ? raw.feeRecords : DEFAULT_STATE.feeRecords,
    paymentHistory: Array.isArray(raw.paymentHistory) ? raw.paymentHistory : DEFAULT_STATE.paymentHistory,
    websiteSections:
      Array.isArray(raw.websiteSections) && raw.websiteSections.length > 0
        ? [
            ...raw.websiteSections.map((sec) => ({
              visible: true,
              published: true,
              ...sec,
            })),
            ...DEFAULT_WEBSITE_SECTIONS.filter(
              (def) => !raw.websiteSections!.some((sec) => sec.id === def.id),
            ),
          ]
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
  isBackendConnected: boolean;
  isSyncing: boolean;
  dbError: string | null;
  storageError: string | null;
  lastSyncedAt: string | null;
  clearDbError: () => void;
  syncCoreRecords: () => Promise<RepositoryActionResult>;
  submitAdmission: (
    input: RegistrationSubmitInput,
  ) => Promise<RepositoryActionResult<{ application: AdminApplication }>>;
  lookupApplication: (
    referenceCode: string,
    contactDigits: string,
  ) => Promise<RepositoryActionResult<AdminApplication | null>>;
  saveStudent: (
    input: Omit<AdminStudent, 'id' | 'joinedLabel'>,
    existingId?: string,
  ) => Promise<RepositoryActionResult<AdminStudent>>;
  removeStudent: (id: string) => Promise<RepositoryActionResult>;
  reviewAdmission: (
    id: string,
    status: AdmissionDecisionStatus,
    reviewerNotes: string,
  ) => Promise<RepositoryActionResult<AdminApplication>>;
  convertAdmissionToStudent: (
    app: AdminApplication,
    batch?: AdminBatch | null,
  ) => Promise<RepositoryActionResult<AdminStudent>>;
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (storageError) setStorageError(null);
    } catch {
      setStorageError(
        'Browser local storage quota exceeded. Remove or downsize large uploaded preview images, or configure Supabase Storage.',
      );
    }
  }, [state, storageError]);

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

  const syncCoreRecords = useCallback(async (): Promise<RepositoryActionResult> => {
    if (!isSupabaseConfigured) {
      return { ok: true };
    }
    setIsSyncing(true);
    setDbError(null);
    try {
      const res = await fetchCoreSupabaseData();
      if (!res.ok || !res.data) {
        const msg = res.error ?? 'Failed to load database records from Supabase.';
        setDbError(msg);
        return { ok: false, error: msg, schemaMissingHint: res.schemaMissingHint };
      }
      setState((prev) => ({
        ...prev,
        students: res.data!.students,
        applications: res.data!.applications,
      }));
      setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      return { ok: true };
    } finally {
      setIsSyncing(false);
    }
  }, []);

  async function submitAdmission(
    input: RegistrationSubmitInput,
  ): Promise<RepositoryActionResult<{ application: AdminApplication }>> {
    if (isSupabaseConfigured) {
      const res = await insertSupabaseAdmission(input);
      if (!res.ok || !res.data) {
        setDbError(res.error ?? 'Admission submission failed.');
        return res;
      }
      setState((prev) => ({
        ...prev,
        applications: [res.data!.application, ...prev.applications],
      }));
      return res;
    }

    const localRef = `LOCAL-APP-${Math.floor(100000 + Math.random() * 900000)}`;
    const localApp: AdminApplication = {
      id: `app-${Date.now()}`,
      referencePlaceholder: localRef,
      applicantName: input.studentName,
      age: input.age,
      isMinor: input.isMinor,
      guardianName: input.guardianName,
      contactPlaceholder: input.whatsappNumber || input.guardianPhone,
      requestedProgram: input.requestedProgram,
      experienceLevel: input.previousExperience,
      submittedLabel: new Date().toLocaleDateString('en-PK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Pending',
      reviewerNotes: input.additionalMessage
        ? `Applicant note: ${input.additionalMessage} (Window: ${input.preferredBatch})`
        : `Preferred window: ${input.preferredBatch} · City/Area: ${input.cityArea}`,
      convertedToStudent: false,
    };
    setState((prev) => ({ ...prev, applications: [localApp, ...prev.applications] }));
    return { ok: true, data: { application: localApp } };
  }

  async function lookupApplication(
    referenceCode: string,
    contactDigits: string,
  ): Promise<RepositoryActionResult<AdminApplication | null>> {
    if (isSupabaseConfigured) {
      return lookupSupabaseApplicationStatus(referenceCode, contactDigits);
    }

    const targetRef = referenceCode.trim().toLowerCase();
    const found = state.applications.find((app) => {
      const refMatch = app.referencePlaceholder.trim().toLowerCase() === targetRef;
      if (!refMatch) return false;
      if (!contactDigits) return true;
      const storedDigits = app.contactPlaceholder.replace(/\D/g, '');
      return !storedDigits || storedDigits.endsWith(contactDigits.slice(-7));
    });
    return { ok: true, data: found ?? null };
  }

  async function saveStudent(
    input: Omit<AdminStudent, 'id' | 'joinedLabel'>,
    existingId?: string,
  ): Promise<RepositoryActionResult<AdminStudent>> {
    if (isSupabaseConfigured) {
      const res = await upsertSupabaseStudent(input, existingId);
      if (!res.ok || !res.data) {
        setDbError(res.error ?? 'Failed to save student.');
        return res;
      }
      const saved = res.data;
      setState((prev) => ({
        ...prev,
        students: existingId
          ? prev.students.map((s) => (s.id === existingId ? saved : s))
          : [saved, ...prev.students],
      }));
      return res;
    }

    if (existingId) {
      let updatedRecord: AdminStudent | undefined;
      setState((prev) => ({
        ...prev,
        students: prev.students.map((item) => {
          if (item.id === existingId) {
            updatedRecord = { ...item, ...input };
            return updatedRecord;
          }
          return item;
        }),
      }));
      return { ok: true, data: updatedRecord };
    }

    const localStudent: AdminStudent = {
      id: `stu-${Date.now()}`,
      joinedLabel: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      ...input,
    };
    setState((prev) => ({ ...prev, students: [localStudent, ...prev.students] }));
    return { ok: true, data: localStudent };
  }

  async function removeStudent(id: string): Promise<RepositoryActionResult> {
    if (isSupabaseConfigured) {
      const res = await deleteSupabaseStudent(id);
      if (!res.ok) {
        setDbError(res.error ?? 'Failed to remove student.');
        return res;
      }
    }
    setState((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== id),
    }));
    return { ok: true };
  }

  async function reviewAdmission(
    id: string,
    status: AdmissionDecisionStatus,
    reviewerNotes: string,
  ): Promise<RepositoryActionResult<AdminApplication>> {
    if (isSupabaseConfigured) {
      const res = await updateSupabaseAdmission(id, { status, reviewerNotes });
      if (!res.ok || !res.data) {
        setDbError(res.error ?? 'Failed to update admission status.');
        return res;
      }
      setState((prev) => ({
        ...prev,
        applications: prev.applications.map((a) => (a.id === id ? res.data! : a)),
      }));
      return res;
    }

    let updated: AdminApplication | undefined;
    setState((prev) => ({
      ...prev,
      applications: prev.applications.map((a) => {
        if (a.id === id) {
          updated = { ...a, status, reviewerNotes };
          return updated;
        }
        return a;
      }),
    }));
    return { ok: true, data: updated };
  }

  async function convertAdmissionToStudent(
    app: AdminApplication,
    batch?: AdminBatch | null,
  ): Promise<RepositoryActionResult<AdminStudent>> {
    const nextCode = `SK-${String(state.students.length + 1).padStart(4, '0')}`;
    const studentPayload: Omit<AdminStudent, 'id' | 'joinedLabel'> = {
      studentCode: nextCode,
      fullName: app.applicantName,
      ageGroup: app.isMinor ? `Age ${app.age} (Minor)` : `Age ${app.age}`,
      contactPlaceholder: app.contactPlaceholder,
      guardianName: app.guardianName,
      program: app.requestedProgram,
      batchId: batch?.id ?? '',
      batchName: batch?.name ?? 'Unassigned',
      status: 'Active',
      attendanceRate: 100,
      notes: app.reviewerNotes || `Converted from application ${app.referencePlaceholder}.`,
    };

    const studentRes = await saveStudent(studentPayload);
    if (!studentRes.ok || !studentRes.data) {
      return studentRes;
    }

    if (isSupabaseConfigured) {
      const admRes = await updateSupabaseAdmission(app.id, { convertedToStudent: true });
      if (admRes.ok && admRes.data) {
        setState((prev) => ({
          ...prev,
          applications: prev.applications.map((a) => (a.id === app.id ? admRes.data! : a)),
        }));
      }
    } else {
      setState((prev) => ({
        ...prev,
        applications: prev.applications.map((a) =>
          a.id === app.id ? { ...a, convertedToStudent: true } : a,
        ),
      }));
    }

    return studentRes;
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
        isBackendConnected: isSupabaseConfigured,
        isSyncing,
        dbError,
        storageError,
        lastSyncedAt,
        clearDbError: () => setDbError(null),
        syncCoreRecords,
        submitAdmission,
        lookupApplication,
        saveStudent,
        removeStudent,
        reviewAdmission,
        convertAdmissionToStudent,
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
