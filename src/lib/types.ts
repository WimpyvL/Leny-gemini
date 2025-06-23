import type { LucideIcon } from "lucide-react";

export type User = {
  id: string;
  name: string;
  email?: string;
  dob?: string;
  avatar: string;
  avatarColor: string;
  icon?: LucideIcon;
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
  participantString: string;
  messages: Message[];
  timestamp: Date;
  unread?: number;
  avatar: string;
  avatarColor: string;
  icon?: LucideIcon;
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
    icon: LucideIcon;
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
  icon: LucideIcon;
  isStarred?: boolean;
  iconColor?: string;
  cardColor?: string;
}
