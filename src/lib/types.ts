import { z } from 'zod';

export type UserRole = 'user' | 'expert' | 'assistant';

export type User = {
  id: string;
  name: string;
  email?: string;
  dob?: string;
  avatar: string;
  avatarColor: string;
  icon?: string;
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

export type Message = {
  id: string;
  text?: string;
  senderId: string;
  timestamp: Date;
  type: 'user';
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
  userId?: string;
  expertId?: string;
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
  specialty: string;
  name: string;
  expert_prompt: string;
  avatarColor: string;
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
