import { isSupabaseConfigured } from '@/src/services/supabaseClient';
import {
  lookupSupabaseApplicationStatus,
  type RepositoryActionResult,
} from '@/src/services/supabaseAcademyService';
import type { AdminApplication } from '@/src/types/admin';
import type { RegistrationDraft, TrialRequestDraft } from '@/src/types/academy';
import { isValidEmailAddress } from '@/src/utils/validation';

export interface AcademyServiceContract {
  isBackendConnected: () => boolean;
  validateTrialDraft: (draft: TrialRequestDraft) => { valid: boolean; message: string };
  validateRegistrationDraft: (draft: RegistrationDraft) => { valid: boolean; message: string };
  lookupApplicationStatus: (
    referenceCode: string,
    contactDigits: string,
  ) => Promise<RepositoryActionResult<AdminApplication | null>>;
}

export const academyService: AcademyServiceContract = {
  isBackendConnected() {
    return isSupabaseConfigured;
  },
  validateTrialDraft(draft) {
    if (!draft.playerName.trim() || !draft.guardianOrContact.trim() || !draft.preferredProgram) {
      return {
        valid: false,
        message: 'Please complete the required student, contact, and program fields.',
      };
    }
    return {
      valid: true,
      message: 'Validation passed.',
    };
  },
  validateRegistrationDraft(draft) {
    if (!draft.fullName.trim() || !isValidEmailAddress(draft.email)) {
      return {
        valid: false,
        message: 'Please enter a full name and valid email address.',
      };
    }
    return {
      valid: true,
      message: 'Validation passed.',
    };
  },
  lookupApplicationStatus(referenceCode, contactDigits) {
    return lookupSupabaseApplicationStatus(referenceCode, contactDigits);
  },
};
