import { z } from 'zod';

export type UserRole = 'user' | 'expert' | 'assistant';

export type User = {
  id: string;
  name: string;
  email?: string;
  dob?: string;
  avatar: string; // URL to an image
  role: UserRole;
  expertInfo?: {
    specialty?: string;
    title?: string;
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

<<<<<<< HEAD
export type Assessment = {
  title: string;
  summary: string[];
  recommendations: string;
  suggestions: string[];
}

export type Citation = {
  term: string;
  source: string;
};

export type StructuredResponse = {
  evidenceSummary: string;
  confidenceInEvidence: string;
  clinicalBottomLine: string;
  contraryOrUnanswered: string;
  citations?: Citation[];
};

export type QuickActionItem = {
  keyword: string;
  fullAction: string;
};

=======
>>>>>>> 4de5c1ea31c6afd7cb8b6b3e60a7b345ab82f1b4
export type Message = {
  id: string;
  text?: string;
  senderId: string;
  timestamp: Date;
<<<<<<< HEAD
  type: 'user' | 'assessment';
  assessment?: Assessment;
  quickActions?: QuickActionItem[];
  structuredResponse?: StructuredResponse;
=======
  type: 'user';
>>>>>>> 4de5c1ea31c6afd7cb8b6b3e60a7b345ab82f1b4
};

export type Conversation = {
  id: string;
  title: string;
  participantIds: string[];
  participantString: string;
  messages: Message[];
  timestamp: Date;
  unread?: number;
};

export type ForYouCardType = 
  | 'consultation' 
  | 'reminder' 
  | 'insight' 
  | 'tip' 
  | 'goal_streak';

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
  id: string;
  specialty: string;
  name: string;
  expert_prompt: string;
};

export const QueryInputSchema = z.object({
  text: z.string().describe('The query text from the user.'),
  userRole: z.custom<UserRole>().describe('The role of the user (user or expert).'),
  conversationHistory: z.array(z.string()).optional().describe('Previous messages in the conversation for context.'),
});
export type QueryInput = z.infer<typeof QueryInputSchema>;

export const FormattedResponseSchema = z.object({
  content: z.string().describe('The formatted response text for the user.'),
  metadata: z.object({
    responseMode: z.enum(['consumer', 'professional']).describe('The mode used for the response.'),
  }),
});
export type FormattedResponse = z.infer<typeof FormattedResponseSchema>;
