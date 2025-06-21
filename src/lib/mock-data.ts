import type { User, Conversation } from './types';
import { Bot, Stethoscope, Users } from 'lucide-react';

export const mockUsers: User[] = [
  { id: 'alex', name: 'Alex', avatar: 'A', avatarColor: 'bg-orange-400', role: 'patient' },
  { id: 'mom', name: 'Mom', avatar: 'M', avatarColor: 'bg-pink-400', role: 'family' },
  { id: 'dad', name: 'Dad', avatar: 'D', avatarColor: 'bg-blue-400', role: 'family' },
  { id: 'assistant', name: 'Health Assistant', avatar: '', icon: Bot, avatarColor: 'bg-amber-500', role: 'assistant' },
  { id: 'dr_chen', name: 'Dr. Sarah Chen', avatar: '', icon: Stethoscope, avatarColor: 'bg-sky-500', role: 'doctor' },
];

const familyChatParticipants = [
  mockUsers.find(u => u.id === 'mom')!,
  mockUsers.find(u => u.id === 'dad')!,
  mockUsers.find(u => u.id === 'alex')!,
  mockUsers.find(u => u.id === 'assistant')!,
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    title: 'Family Health Chat',
    participants: familyChatParticipants,
    participantString: 'Mom, Dad, Alex + Health Assistant',
    avatar: '',
    icon: Users,
    avatarColor: 'bg-purple-500',
    timestamp: new Date(new Date().getTime() - 2 * 60000), // 2 minutes ago
    unread: 1,
    messages: [
      { 
        id: 'msg1', 
        senderId: 'alex',
        text: 'I\'ve been having some chest pain after my workout, should I be concerned?',
        timestamp: new Date('2024-07-29T14:28:00Z'),
        type: 'user',
      },
      { 
        id: 'msg2',
        senderId: 'assistant',
        type: 'assessment',
        assessment: {
          title: "Alex's Chest Pain Assessment Summary:",
          summary: [
            "Based on our conversation, Alex is experiencing stress-related chest pain with these characteristics:",
            "• Dull ache triggered by stress",
            "• No shortness of breath or radiating pain",
            "• Improves with relaxation",
          ],
          recommendations: "Recommendations: Continue stress management techniques. Monitor symptoms and contact Dr. Chen if pain changes or worsens.",
          suggestions: ["Breathing exercises", "Stress management", "Emergency signs"],
        },
        timestamp: new Date('2024-07-29T14:30:00Z'),
      },
      { 
        id: 'msg3',
        senderId: 'mom',
        text: 'Thanks for the summary! Should we schedule a follow-up with Dr. Chen?',
        timestamp: new Date('2024-07-29T14:32:00Z'),
        type: 'user',
      },
      { 
        id: 'msg4',
        senderId: 'dad',
        text: 'Good idea. Alex, how are you feeling about the breathing exercises?',
        timestamp: new Date('2024-07-29T14:33:00Z'),
        type: 'user',
      },
    ],
  },
  {
    id: 'conv2',
    title: 'Health Assistant',
    participants: [mockUsers.find(u => u.id === 'alex')!, mockUsers.find(u => u.id === 'assistant')!],
    participantString: 'Ready to help with health questions',
    avatar: '',
    icon: Bot,
    avatarColor: 'bg-amber-500',
    timestamp: new Date(new Date().getTime() - 5 * 60000), // 5 minutes ago
    messages: [
      { id: 'msg5', text: 'Ready to help with health questions...', senderId: 'assistant', timestamp: new Date('2024-07-29T14:25:00Z'), type: 'user' },
    ],
  },
  {
    id: 'conv3',
    title: 'Dr. Sarah Chen',
    participants: [mockUsers.find(u => u.id === 'alex')!, mockUsers.find(u => u.id === 'dr_chen')!],
    participantString: 'Lab results discussion...',
    avatar: '',
    icon: Stethoscope,
    avatarColor: 'bg-sky-500',
    timestamp: new Date(new Date().getTime() - 2 * 60 * 60000), // 2 hours ago
    messages: [
      { id: 'msg6', text: 'Lab results discussion...', senderId: 'dr_chen', timestamp: new Date('2024-07-29T12:30:00Z'), type: 'user' },
    ],
  },
];
