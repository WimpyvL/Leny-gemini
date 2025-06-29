import type { LucideIcon } from "lucide-react";

export type User = {
  id: string;
  name: string;
  email?: string;
  dob?: string;
  avatar: string;
  avatarColor: string;
  icon?: string;
  role: 'patient' | 'doctor' | 'family' | 'assistant';
  healthInfo?: {
    height?: string;
    weight?: string;
    bloodType?: string;
    allergies?: string[];
    conditions?: string[];
    medications?: { name: string; dosage: string }[];
  };
  doctorInfo?: {
    specialty?: string;
    licenseNumber?: string;
    practiceName?: string;
    practiceAddress?: string;
    officeHours?: string;
    bio?: string;
  };
  settings?: {
    theme?: 'light' | 'dark' | 'system';
    notifications?: {
      email?: boolean;
      push?: boolean;
    }
  }
};

export type Assessment = {
  title: string;
  summary: string[];
  recommendations: string;
  suggestions: string[];
}

export type Message = {
  id: string;
  text?: string;
  senderId: string;
  timestamp: Date;
  type: 'user' | 'assessment';
  assessment?: Assessment;
};

export type Conversation = {
  id: string;
  title: string;
  participants: User[];
  participantIds: string[];
  participantString: string;
  messages: Message[];
  timestamp: Date;
  unread?: number;
  avatar: string;
  avatarColor: string;
  icon?: string;
  patientId?: string;
  doctorId?: string;
};

export type ForYouCardType = 
  | 'appointment' 
  | 'reminder' 
  | 'lab_result' 
  | 'health_tip' 
  | 'health_streak'
  | 'research_update'
  | 'industry_news'
  | 'cme_course';

export interface ForYouCardData {
    id: string;
    type: ForYouCardType;
    icon: string;
    iconColor: string;
    title: string;
    description: string;
    timestamp?: Date;
    cta: string;
    currentStreak?: number;
    goal?: number;
    progressData?: { date: string; value: number }[];
}

export interface QuickAction {
  id:string;
  label: string;
  icon: string;
  isStarred?: boolean;
  iconColor?: string;
  cardColor?: string;
}

export type AiExpert = {
  specialty: string;
  name: string;
  gender: string;
  personality: string;
  expert_prompt: string;
  avatarColor: string;
};

export enum ContextType {
    SYMPTOM = "symptom",
    DIAGNOSIS = "diagnosis",
    MEDICATION = "medication",
    TEST_RESULT = "test_result",
    TREATMENT_PLAN = "treatment_plan",
    TRIAGE = "triage",
    FOLLOW_UP = "follow_up",
    LOGISTICS = "logistics",
    OTHER = "other",
}

export enum UserType {
    PATIENT = "patient",
    PROVIDER = "provider",
}

export enum MedicalSpecialty {
    // Primary Care
    FAMILY_MEDICINE = "family_medicine",
    INTERNAL_MEDICINE = "internal_medicine",
    PEDIATRICS = "pediatrics",
    GERIATRICS = "geriatrics",
    
    // Emergency & Critical Care
    EMERGENCY_MEDICINE = "emergency_medicine",
    CRITICAL_CARE = "critical_care",
    TRAUMA_SURGERY = "trauma_surgery",
    
    // Surgical Specialties
    GENERAL_SURGERY = "general_surgery",
    ORTHOPEDICS = "orthopedics",
    NEUROSURGERY = "neurosurgery",
    CARDIOTHORACIC_SURGERY = "cardiothoracic_surgery",
    PLASTIC_SURGERY = "plastic_surgery",
    UROLOGY = "urology",
    
    // Medical Specialties
    CARDIOLOGY = "cardiology",
    GASTROENTEROLOGY = "gastroenterology",
    NEUROLOGY = "neurology",
    PULMONOLOGY = "pulmonology",
    NEPHROLOGY = "nephrology",
    ENDOCRINOLOGY = "endocrinology",
    HEMATOLOGY_ONCOLOGY = "hematology_oncology",
    RHEUMATOLOGY = "rheumatology",
    INFECTIOUS_DISEASE = "infectious_disease",
    ALLERGY_IMMUNOLOGY = "allergy_immunology",
    
    // Women's Health
    OBSTETRICS_GYNECOLOGY = "obstetrics_gynecology",
    MATERNAL_FETAL_MEDICINE = "maternal_fetal_medicine",
    
    // Mental Health
    PSYCHIATRY = "psychiatry",
    PSYCHOLOGY = "psychology",
    ADDICTION_MEDICINE = "addiction_medicine",
    
    // Diagnostic & Imaging
    RADIOLOGY = "radiology",
    PATHOLOGY = "pathology",
    NUCLEAR_MEDICINE = "nuclear_medicine",
    
    // Specialized Care
    DERMATOLOGY = "dermatology",
    OPHTHALMOLOGY = "ophthalmology",
    OTOLARYNGOLOGY = "otolaryngology",
    ANESTHESIOLOGY = "anesthesiology",
    PAIN_MANAGEMENT = "pain_management",
    PALLIATIVE_CARE = "palliative_care",
    SPORTS_MEDICINE = "sports_medicine",
    OCCUPATIONAL_MEDICINE = "occupational_medicine",
}
