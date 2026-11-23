import type {
  AcademyCoachPlaceholder,
  AcademyProgramPlaceholder,
  RegistrationDraft,
  TrialRequestDraft,
} from '@/src/types/academy';

/**
 * Academy Service Abstraction Layer (Part 1 Foundation)
 *
 * Prepared for future Supabase persistence. Currently operates strictly as
 * an in-memory/non-backend placeholder interface with no fake authentication
 * or invented academy records.
 */
export interface AcademyServiceContract {
  getProgramsPlaceholder: () => Promise<AcademyProgramPlaceholder[]>;
  getCoachesPlaceholder: () => Promise<AcademyCoachPlaceholder[]>;
  validateTrialDraft: (draft: TrialRequestDraft) => { valid: boolean; message: string };
  validateRegistrationDraft: (draft: RegistrationDraft) => { valid: boolean; message: string };
}

export const academyService: AcademyServiceContract = {
  async getProgramsPlaceholder() {
    return [];
  },
  async getCoachesPlaceholder() {
    return [];
  },
  validateTrialDraft(draft) {
    if (!draft.playerName.trim() || !draft.guardianOrContact.trim() || !draft.preferredProgram) {
      return {
        valid: false,
        message: 'Please complete the required placeholder fields before testing submission.',
      };
    }
    return {
      valid: true,
      message: 'Foundation validation passed. Backend submission will be connected in a later phase.',
    };
  },
  validateRegistrationDraft(draft) {
    if (!draft.fullName.trim() || !draft.email.trim()) {
      return {
        valid: false,
        message: 'Please enter a full name and valid email format to test form validation.',
      };
    }
    return {
      valid: true,
      message: 'Foundation form check passed. Registration persistence will be wired in a later phase.',
    };
  },
};
