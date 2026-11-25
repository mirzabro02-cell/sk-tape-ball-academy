import type { ImageTransformConfig } from './media';

export type StudentStatus = 'Active' | 'Inactive' | 'On Hold';
export type CoachStatus = 'Active' | 'Part-Time' | 'On Leave';
export type BatchStatus = 'Open' | 'Full' | 'Upcoming' | 'Archived';
export type AdmissionDecisionStatus =
  | 'Pending'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'More Information Required';
export type FeePaymentStatus = 'Paid' | 'Pending' | 'Overdue';
export type AttendanceMark = 'Present' | 'Absent' | 'Late';
export type MatchRecordStatus = 'Upcoming' | 'Completed' | 'Postponed';
export type ApprovalStatus = 'Approved' | 'Pending Review' | 'Archived';
export type BlogPostStatus = 'Draft' | 'Published';

export interface AdminStudent {
  id: string;
  studentCode: string;
  fullName: string;
  ageGroup: string;
  contactPlaceholder: string;
  guardianName: string;
  program: string;
  batchId: string;
  batchName: string;
  status: StudentStatus;
  joinedLabel: string;
  attendanceRate: number;
  notes: string;
}

export interface AdminCoach {
  id: string;
  slug?: string;
  fullName: string;
  roleTitle: string;
  specialties: string[];
  assignedPrograms: string[];
  status: CoachStatus;
  experienceLabel: string;
  avatarLabel: string;
  bio: string;
  imageSrc?: string | null;
  imageTransform?: ImageTransformConfig;
  published?: boolean;
}

export interface AdminProgram {
  id: string;
  code: string;
  title: string;
  category: 'Skill Track' | 'Level Track' | 'Individual Coaching';
  description: string;
  imagePath: string;
  imageTransform?: ImageTransformConfig;
  published: boolean;
  enrolledDemoCount: number;
}

export interface AdminBatch {
  id: string;
  name: string;
  programTitle: string;
  coachId: string;
  coachName: string;
  capacity: number;
  assignedStudentIds: string[];
  timingPlaceholder: string;
  status: BatchStatus;
}

export interface AdminScheduleItem {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  timePlaceholder: string;
  batchId: string;
  batchName: string;
  coachName: string;
  programTitle: string;
  groundZone: string;
}

export interface AdminApplication {
  id: string;
  referencePlaceholder: string;
  applicantName: string;
  age: number;
  isMinor: boolean;
  guardianName: string;
  contactPlaceholder: string;
  requestedProgram: string;
  experienceLevel: string;
  submittedLabel: string;
  status: AdmissionDecisionStatus;
  reviewerNotes: string;
  convertedToStudent: boolean;
}

export interface AdminFeePackage {
  id: string;
  name: string;
  programScope: string;
  billingCycle: string;
  amountPlaceholder: string;
  status: 'Active' | 'Draft';
}

export interface AdminFeeRecord {
  id: string;
  invoiceCode: string;
  studentName: string;
  program: string;
  packageName: string;
  amountPlaceholder: string;
  dueDateLabel: string;
  status: FeePaymentStatus;
  lastPaymentNote: string;
}

export interface AdminPaymentHistoryItem {
  id: string;
  invoiceCode: string;
  studentName: string;
  amountPlaceholder: string;
  methodPlaceholder: string;
  recordedLabel: string;
  notes: string;
}

export interface AdminAttendanceEntry {
  studentId: string;
  studentName: string;
  studentCode: string;
  mark: AttendanceMark;
}

export interface AdminMatch {
  id: string;
  title: string;
  matchType: 'Practice Match' | 'Inter-Batch Challenge' | 'Night Tape Ball Event';
  academyTeam: string;
  opponentTeam: string;
  datePlaceholder: string;
  locationPlaceholder: string;
  status: MatchRecordStatus;
  academyScore: string;
  opponentScore: string;
  resultSummary: string;
}

export interface AdminAchievement {
  id: string;
  title: string;
  playerName: string;
  category: string;
  datePlaceholder: string;
  description: string;
  imagePath: string;
  imageTransform?: ImageTransformConfig;
  published: boolean;
}

export interface AdminMediaItem {
  id: string;
  mediaType: 'image' | 'video';
  title: string;
  category: 'Training Drills' | 'Match Highlights' | 'Bowling Clinic' | 'Campus & Ground';
  caption: string;
  assetPath: string;
  imageTransform?: ImageTransformConfig;
  published: boolean;
  uploadedLabel: string;
}

export interface AdminTestimonial {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  approvalStatus: ApprovalStatus;
  published: boolean;
}

export interface AdminBlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  featuredImage: string;
  imageTransform?: ImageTransformConfig;
  bodyText: string;
  status: BlogPostStatus;
  seoTitle: string;
  seoDescription: string;
  updatedLabel: string;
}

export interface AdminWebsiteContentSection {
  id: string;
  label: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  bodyNotes: string;
  lastUpdatedLabel: string;
  visible?: boolean;
  published?: boolean;
}

export interface AdminNotification {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  unread: boolean;
  route: string;
}
