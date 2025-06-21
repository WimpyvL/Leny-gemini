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
