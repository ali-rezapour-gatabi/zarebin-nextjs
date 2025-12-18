export type DocumentValue = File | string;

export type ExpertFormValues = {
  domains: string;
  subdomains: string[];
  skills: string[];
  province: string;
  city: string;
  location: string;
  yearsOfExperience: ExperienceLevel;
  sampleJob: string[];
  contactLinks: string[];
  contactNumbers: string[];
  pricingModel: 'per_session' | 'per_hour';
  availability: string;
  description: string;
  documents: DocumentValue[];
};
