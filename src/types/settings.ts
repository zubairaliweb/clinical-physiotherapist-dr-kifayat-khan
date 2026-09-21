export interface EducationRecord {
  id: string;
  institution: string;
  degree: string;
  field: string;
  duration: string;
  grade?: string;
  activities?: string;
}

export interface ExperienceRecord {
  id: string;
  title: string;
  employmentType: string;
  locations: string[];
  notes?: string;
}

export interface SocialLinksRecord {
  facebook: string;
  tiktok: string;
  linkedin: string;
}

export interface WebsiteSettingsRecord {
  doctorName: string;
  primaryTitle: string;
  secondaryTitles: string;
  experienceYears: string;
  phone: string;
  whatsapp: string;
  clinicAddress: string;
  clinicFloorRoom: string;
  cityCountry: string;
  heroStatement: string;
  professionalStatement: string;
  profileImage: string;
  clinicImage: string;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
}
