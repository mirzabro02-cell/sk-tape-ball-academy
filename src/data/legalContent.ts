export interface LegalSectionBlock {
  heading: string;
  body: string[];
}

export interface LegalDocumentData {
  slug: string;
  routePath: string;
  title: string;
  shortLabel: string;
  summary: string;
  sections: LegalSectionBlock[];
}

export const LEGAL_DOCUMENTS: LegalDocumentData[] = [
  {
    slug: 'privacy-policy',
    routePath: '/privacy-policy',
    title: 'Privacy Policy',
    shortLabel: 'Privacy Policy',
    summary:
      'Explains how SK Tape Ball Academy collects, uses, and safeguards player, guardian, and inquiry information.',
    sections: [
      {
        heading: '01. Information Collected',
        body: [
          'When you submit an admission registration or contact inquiry, SK Tape Ball Academy collects only the details needed to coordinate player evaluation and academy communication, such as player name, date of birth, area of residence, guardian contact information, and training preferences.',
        ],
      },
      {
        heading: '02. Purpose of Data Use',
        body: [
          'Information is used strictly for reviewing admission registrations, coordinating player assessments, verifying guardian consent for minor athletes, and sharing official schedule or event updates.',
        ],
      },
      {
        heading: '03. Minor & Guardian Protections',
        body: [
          'Applicants under 18 years of age require verified parent or legal guardian contact information and explicit guardian consent prior to participating in training or onboarding assessments.',
        ],
      },
    ],
  },
  {
    slug: 'terms',
    routePath: '/terms',
    title: 'Terms & Conditions',
    shortLabel: 'Terms & Conditions',
    summary:
      'Terms governing use of the SK Tape Ball Academy website, registration forms, and ground participation standards.',
    sections: [
      {
        heading: '01. Academy Website Usage',
        body: [
          'Information published on this website describes official coaching tracks, academy events, and contact channels for SK Tape Ball Academy in Sabzazar, Lahore.',
        ],
      },
      {
        heading: '02. Admissions & Batch Placement',
        body: [
          'Submitting an online admission registration initiates a review by academy staff and does not automatically confirm a training slot until staff confirm placement.',
        ],
      },
      {
        heading: '03. Player Code of Conduct',
        body: [
          'All participants are expected to uphold sportsmanship, discipline, punctuality, respect for coaches and teammates, and full adherence to ground safety instructions.',
        ],
      },
    ],
  },
  {
    slug: 'admission-policy',
    routePath: '/admission-policy',
    title: 'Admission Policy',
    shortLabel: 'Admission Policy',
    summary:
      'Guidelines governing initial player assessment, guardian consent, and batch placement at SK Tape Ball Academy.',
    sections: [
      {
        heading: '01. Assessment & Batch Placement',
        body: [
          'Admissions are guided by initial skill observation, physical readiness, and available cohort capacity across group and 1-on-1 training tracks.',
        ],
      },
      {
        heading: '02. Guardian Consent Requirement',
        body: [
          'Every applicant under the age of 18 must provide valid parent or legal guardian details and consent prior to joining any practice or assessment session.',
        ],
      },
      {
        heading: '03. Health & Readiness Disclosure',
        body: [
          'Players and guardians should inform coaching staff of any medical conditions or recent injuries prior to participating in conditioning, bowling, or batting drills.',
        ],
      },
    ],
  },
  {
    slug: 'refund-policy',
    routePath: '/refund-policy',
    title: 'Refund Policy',
    shortLabel: 'Refund Policy',
    summary:
      'Principles covering fee schedules, batch transfers, and weather-related session adjustments.',
    sections: [
      {
        heading: '01. Fee Confirmation & Transfers',
        body: [
          'Approved program fee terms, billing intervals, and adjustment options are confirmed clearly with players and guardians at the time of admission.',
        ],
      },
      {
        heading: '02. Weather & Ground Adjustments',
        body: [
          'In the event of weather interruptions or ground maintenance, makeup session arrangements are communicated directly by academy administration.',
        ],
      },
    ],
  },
  {
    slug: 'child-safety',
    routePath: '/child-safety',
    title: 'Child Safety Policy',
    shortLabel: 'Child Safety',
    summary:
      'Our commitment to supervised training, age-appropriate conditioning loads, and respectful youth coaching.',
    sections: [
      {
        heading: '01. Supervised Practice Environment',
        body: [
          'Junior sessions operate under active coach supervision with structured lane rules, protective keeping gear, and accessible guardian emergency contacts.',
        ],
      },
      {
        heading: '02. Age-Appropriate Training Loads',
        body: [
          'Conditioning exercises, sprint intervals, and bowling workloads are scaled thoughtfully to support growing athletes safely.',
        ],
      },
      {
        heading: '03. Guardian Communication',
        body: [
          'Parents and guardians remain primary points of contact for attendance updates, consent records, and player welfare matters.',
        ],
      },
    ],
  },
  {
    slug: 'photography-consent',
    routePath: '/photography-consent',
    title: 'Photography & Media Consent Policy',
    shortLabel: 'Photography Consent',
    summary:
      'Details optional and separate consent for training photography and video clips at SK Tape Ball Academy.',
    sections: [
      {
        heading: '01. Optional & Separate Consent',
        body: [
          'Photography and video consent is completely optional and collected separately from admission agreements. Declining media consent never affects eligibility for training or admission.',
        ],
      },
      {
        heading: '02. Intended Use of Media',
        body: [
          'Where optional consent is granted by an adult athlete or a minor’s parent/guardian, training clips or ground photographs may be used for technique feedback or official academy gallery highlights.',
        ],
      },
      {
        heading: '03. Withdrawal of Consent',
        body: [
          'Athletes or guardians may update or withdraw photography consent at any time by contacting academy administration.',
        ],
      },
    ],
  },
];
