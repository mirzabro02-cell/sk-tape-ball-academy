export interface LegalSectionBlock {
  heading: string;
  body: string[];
}

export interface LegalDocumentData {
  slug: string;
  routePath: string;
  title: string;
  shortLabel: string;
  draftNotice: string;
  summary: string;
  sections: LegalSectionBlock[];
}

export const LEGAL_DOCUMENTS: LegalDocumentData[] = [
  {
    slug: 'privacy-policy',
    routePath: '/privacy-policy',
    title: 'Privacy Policy',
    shortLabel: 'Privacy Policy',
    draftNotice:
      'Draft Placeholder Notice: This Privacy Policy is a preliminary frontend draft and has not been legally reviewed or finalized.',
    summary:
      'Outlines how SK Tape Ball Academy intends to handle player, guardian, and inquiry information once backend forms and storage are activated.',
    sections: [
      {
        heading: '01. Information Intended for Collection (Draft)',
        body: [
          'When live admissions and trial forms are activated in a future phase, the academy may collect student names, dates of birth, contact numbers, city/area, guardian details, and training preferences strictly for player onboarding and communication.',
          'At present (Part 5 Frontend Phase), forms validate inputs locally in the browser and do not transmit or store personal data on an external server.',
        ],
      },
      {
        heading: '02. Purpose of Data Use',
        body: [
          'Collected details are intended solely for reviewing free trial requests, coordinating admission onboarding, verifying guardian consent for minors, and sharing verified schedule updates.',
        ],
      },
      {
        heading: '03. Minor & Guardian Protections',
        body: [
          'Applicants under 18 years of age require explicit parent or guardian consent. Official data retention, access, and deletion procedures will be published upon legal finalization.',
        ],
      },
    ],
  },
  {
    slug: 'terms',
    routePath: '/terms',
    title: 'Terms & Conditions',
    shortLabel: 'Terms & Conditions',
    draftNotice:
      'Draft Placeholder Notice: These Terms & Conditions are draft placeholder copy and have not undergone formal legal review.',
    summary:
      'Draft terms governing use of the SK Tape Ball Academy website, inquiry forms, and ground participation expectations.',
    sections: [
      {
        heading: '01. Website & Placeholder Information',
        body: [
          'Content clearly labelled as placeholders (including sample schedules, fee structures, and demonstration player profiles) is provided for structural preview until officially confirmed by SK Tape Ball Academy.',
        ],
      },
      {
        heading: '02. Trial Requests & Registrations',
        body: [
          'Submitting an online trial booking or admission inquiry does not create an automatic confirmed slot or enrollment contract. All placements remain subject to academy review and staff confirmation.',
        ],
      },
      {
        heading: '03. Code of Conduct',
        body: [
          'Participants are expected to follow coach safety instructions, maintain respectful conduct toward teammates and staff, and wear appropriate sports footwear during training.',
        ],
      },
    ],
  },
  {
    slug: 'admission-policy',
    routePath: '/admission-policy',
    title: 'Admission Policy',
    shortLabel: 'Admission Policy',
    draftNotice:
      'Draft Placeholder Notice: This Admission Policy is a frontend draft placeholder pending official review by academy management.',
    summary:
      'Draft policy describing trial assessments, age-group eligibility verification, and batch placement criteria.',
    sections: [
      {
        heading: '01. Assessment & Batch Placement',
        body: [
          'Admissions are guided by initial skill observation, age bracket alignment, and available capacity within each training batch.',
        ],
      },
      {
        heading: '02. Guardian Consent Requirement',
        body: [
          'Every applicant under the age of 18 must submit valid parent or guardian contact details and consent prior to participating in any trial or regular net session.',
        ],
      },
      {
        heading: '03. Health & Readiness Disclosure',
        body: [
          'Applicants and guardians should disclose relevant medical considerations or injuries to coaching staff before engaging in high-intensity bowling, batting, or conditioning drills.',
        ],
      },
    ],
  },
  {
    slug: 'refund-policy',
    routePath: '/refund-policy',
    title: 'Refund Policy',
    shortLabel: 'Refund Policy',
    draftNotice:
      'Draft Placeholder Notice: This Refund Policy is a preliminary structural placeholder and has not been legally reviewed.',
    summary:
      'Draft framework for fee refunds, session adjustments, and cancellation policies once fee processing is established.',
    sections: [
      {
        heading: '01. Fee & Payment Confirmation',
        body: [
          'Official fee amounts, payment methods, and refund eligibility windows are pending final publication by SK Tape Ball Academy.',
        ],
      },
      {
        heading: '02. Weather & Facility Adjustments',
        body: [
          'In the event of weather interruptions or ground maintenance, makeup session policies will be communicated directly by academy administration.',
        ],
      },
    ],
  },
  {
    slug: 'child-safety',
    routePath: '/child-safety',
    title: 'Child Safety Policy',
    shortLabel: 'Child Safety',
    draftNotice:
      'Draft Placeholder Notice: This Child Safety Policy is a draft placeholder document and has not yet been formally reviewed.',
    summary:
      'Draft commitment to safe supervision, age-appropriate training loads, and respectful coaching practices for junior athletes.',
    sections: [
      {
        heading: '01. Safe Supervision & Practice Environment',
        body: [
          'Junior training sessions are intended to operate under active coach supervision with structured lane rules, protective equipment standards, and clear emergency contact access.',
        ],
      },
      {
        heading: '02. Age-Appropriate Training Loads',
        body: [
          'Bowling workloads, warm-ups, and conditioning intensities are adjusted appropriately to protect growing joints and prevent overuse injuries.',
        ],
      },
      {
        heading: '03. Guardian Communication',
        body: [
          'Parents and legal guardians remain primary points of contact for attendance changes, minor consent, and welfare concerns.',
        ],
      },
    ],
  },
  {
    slug: 'photography-consent',
    routePath: '/photography-consent',
    title: 'Photography & Media Consent Policy',
    shortLabel: 'Photography Consent',
    draftNotice:
      'Draft Placeholder Notice: This Photography Consent Policy is a draft placeholder and has not been legally reviewed.',
    summary:
      'Explains optional photography and video consent for training review and official academy media channels.',
    sections: [
      {
        heading: '01. Optional & Separate Consent',
        body: [
          'Photography and video consent is completely optional and collected separately from core admission and privacy agreements. Declining photography consent does not affect eligibility for training or trials.',
        ],
      },
      {
        heading: '02. Intended Use of Media',
        body: [
          'Where optional consent is granted by an adult player or a minor’s parent/guardian, training clips or ground photographs may be used for coaching technique review or official SK Tape Ball Academy gallery highlights.',
        ],
      },
      {
        heading: '03. Withdrawal of Consent',
        body: [
          'Guardians or adult members may update or withdraw media consent preferences at any time by contacting academy administration.',
        ],
      },
    ],
  },
];
