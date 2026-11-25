import { isSupabaseConfigured } from '@/src/services/supabaseClient';
import {
  lookupSupabaseApplicationStatus,
  type RepositoryActionResult,
} from '@/src/services/supabaseAcademyService';
import type { AdminApplication } from '@/src/types/admin';
import type { RegistrationDraft } from '@/src/types/academy';
import { isValidEmailAddress } from '@/src/utils/validation';

export interface AcademyServiceContract {
  isBackendConnected: () => boolean;
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
