export interface PasswordStrengthResult {
  score: number;
  label: 'Weak' | 'Fair' | 'Strong';
  checks: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  const label: PasswordStrengthResult['label'] =
    score >= 4 ? 'Strong' : score >= 2 ? 'Fair' : 'Weak';

  return { score, label, checks };
}

export type ApplicationStatusKey =
  | 'pending'
  | 'under-review'
  | 'approved'
  | 'rejected'
  | 'more-info';

export interface TimelineStepDemo {
  label: string;
  state: 'completed' | 'active' | 'upcoming' | 'attention';
  note: string;
}

export interface ApplicationStatusDemo {
  key: ApplicationStatusKey;
  statusLabel: string;
  sampleRefPlaceholder: string;
  headline: string;
  summary: string;
  instructions: string[];
  timeline: TimelineStepDemo[];
}

/**
 * Demonstration Application Status Presets (Part 6)
 * Strictly demonstration UI templates—no real student records or backend queries.
 */
export const APPLICATION_STATUS_DEMOS: Record<
  ApplicationStatusKey,
  ApplicationStatusDemo
> = {
  pending: {
    key: 'pending',
    statusLabel: 'Pending',
    sampleRefPlaceholder: 'DEMO-REF-PENDING',
    headline: 'Application Queued for Initial Verification (Demonstration)',
    summary:
      'Sample state showing an application awaiting initial administrative review by the academy team.',
    instructions: [
      'Keep your contact phone and WhatsApp reachable for staff follow-up.',
      'If the applicant is under 18, ensure guardian contact details are accurate.',
    ],
    timeline: [
      {
        label: '01. Application Received (Placeholder)',
        state: 'completed',
        note: 'Form details logged in queue.',
      },
      {
        label: '02. Initial Eligibility Check',
        state: 'active',
        note: 'Pending review by academy administration.',
      },
      {
        label: '03. Trial / Skill Placement',
        state: 'upcoming',
        note: 'Scheduled once initial review completes.',
      },
      {
        label: '04. Final Enrollment Decision',
        state: 'upcoming',
        note: 'Awaiting coaching & batch confirmation.',
      },
    ],
  },
  'under-review': {
    key: 'under-review',
    statusLabel: 'Under Review',
    sampleRefPlaceholder: 'DEMO-REF-REVIEW',
    headline: 'Application Under Coaching & Batch Review (Demonstration)',
    summary:
      'Sample state showing an application currently being evaluated for suitable program and batch placement.',
    instructions: [
      'Coaching staff review age group, experience level, and preferred batch slots.',
      'You may be invited for an on-ground assessment session prior to final placement.',
    ],
    timeline: [
      {
        label: '01. Application Received (Placeholder)',
        state: 'completed',
        note: 'Initial form logged.',
      },
      {
        label: '02. Initial Eligibility Check',
        state: 'completed',
        note: 'Contact and guardian details verified.',
      },
      {
        label: '03. Coaching & Batch Review',
        state: 'active',
        note: 'Staff evaluating batch availability and trial alignment.',
      },
      {
        label: '04. Final Enrollment Decision',
        state: 'upcoming',
        note: 'Pending review completion.',
      },
    ],
  },
  approved: {
    key: 'approved',
    statusLabel: 'Approved',
    sampleRefPlaceholder: 'DEMO-REF-APPROVED',
    headline: 'Application Approved — Onboarding Pending (Demonstration)',
    summary:
      'Sample state representing an approved applicant ready for official batch onboarding and ground reporting instructions.',
    instructions: [
      'Review reporting guidelines, sports footwear requirements, and safety policies.',
      'Await official batch timing confirmation from academy staff.',
    ],
    timeline: [
      {
        label: '01. Application Received (Placeholder)',
        state: 'completed',
        note: 'Submission verified.',
      },
      {
        label: '02. Initial Eligibility Check',
        state: 'completed',
        note: 'Applicant and guardian details confirmed.',
      },
      {
        label: '03. Coaching & Batch Review',
        state: 'completed',
        note: 'Program and batch track matched.',
      },
      {
        label: '04. Approved for Onboarding',
        state: 'completed',
        note: 'Ready for academy start instructions.',
      },
    ],
  },
  rejected: {
    key: 'rejected',
    statusLabel: 'Rejected',
    sampleRefPlaceholder: 'DEMO-REF-CLOSED',
    headline: 'Application Not Approved for Current Batch (Demonstration)',
    summary:
      'Sample state shown when a batch is at full capacity or an applicant does not meet current intake criteria.',
    instructions: [
      'Contact the academy desk if you would like feedback or wish to apply for a future intake window.',
      'Review our Draft Admission Policy for eligibility criteria.',
    ],
    timeline: [
      {
        label: '01. Application Received (Placeholder)',
        state: 'completed',
        note: 'Submission logged.',
      },
      {
        label: '02. Initial Eligibility Check',
        state: 'completed',
        note: 'Details reviewed.',
      },
      {
        label: '03. Decision Recorded',
        state: 'attention',
        note: 'Not placed in current batch cycle.',
      },
    ],
  },
  'more-info': {
    key: 'more-info',
    statusLabel: 'More Information Required',
    sampleRefPlaceholder: 'DEMO-REF-INFO',
    headline: 'Additional Details Needed to Proceed (Demonstration)',
    summary:
      'Sample state indicating academy staff require updated contact details, guardian verification, or experience notes.',
    instructions: [
      'Check your email or WhatsApp messages for the specific clarification requested by staff.',
      'Reach out through the Contact page referencing your application placeholder ID.',
    ],
    timeline: [
      {
        label: '01. Application Received (Placeholder)',
        state: 'completed',
        note: 'Submission logged.',
      },
      {
        label: '02. Staff Follow-Up Requested',
        state: 'attention',
        note: 'Awaiting updated guardian or eligibility information.',
      },
      {
        label: '03. Coaching & Batch Review',
        state: 'upcoming',
        note: 'Resumes once requested details are received.',
      },
      {
        label: '04. Final Enrollment Decision',
        state: 'upcoming',
        note: 'Pending verification.',
      },
    ],
  },
};
