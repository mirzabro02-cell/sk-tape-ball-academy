export interface AcademyProgramPlaceholder {
  id: string;
  title: string;
  ageGroupPlaceholder: string;
  schedulePlaceholder: string;
  summaryPlaceholder: string;
}

export interface AcademyCoachPlaceholder {
  id: string;
  namePlaceholder: string;
  rolePlaceholder: string;
  specialtyPlaceholder: string;
}

export interface RegistrationDraft {
  fullName: string;
  email: string;
  phonePlaceholder: string;
  programInterest: string;
}
