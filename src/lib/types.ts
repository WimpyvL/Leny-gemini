import type { LucideIcon } from "lucide-react";

export type User = {
  id: string;
  name: string;
  avatar: string;
  avatarColor: string;
  icon?: LucideIcon;
  role: 'patient' | 'doctor' | 'family' | 'assistant';
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

export type ForYouCardType = 'appointment' | 'reminder' | 'lab_result' | 'health_tip' | 'health_streak';

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
