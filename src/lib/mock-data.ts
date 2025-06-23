import type { User, Conversation, ForYouCardData, QuickAction } from './types';
import { Bot, Stethoscope, Users, Calendar, Bell, FlaskConical, Lightbulb, Flame, Dumbbell, Pill, BarChart3, Package, Siren, HeartPulse, Zap } from 'lucide-react';

export const mockUsers: User[] = [
  { id: 'assistant', name: 'Leny', avatar: '', icon: Bot, avatarColor: 'bg-primary', role: 'assistant' },
  { id: 'doctor1', name: 'Dr. Sarah Chen', avatar: 'SC', avatarColor: 'bg-sky-500', role: 'doctor', icon: Stethoscope, email: 'drchen@example.com' },
  { 
    id: 'patient1', 
    name: 'Alex', 
    avatar: 'A', 
    avatarColor: 'bg-blue-500', 
    role: 'patient',
    email: 'alex@example.com',
    dob: '1990-05-15',
    healthInfo: {
      height: '5\'10"',
      weight: '160 lbs',
      bloodType: 'O+',
      allergies: ['Peanuts', 'Pollen'],
      conditions: ['Asthma'],
      medications: [
        { name: 'Albuterol', dosage: 'As needed' },
        { name: 'Singulair', dosage: '10mg daily' },
      ],
    },
    settings: {
      theme: 'light',
      notifications: {
        email: true,
        push: false,
      }
    }
  },
  { id: 'patient2', name: 'Casey', avatar: 'C', avatarColor: 'bg-green-400', role: 'patient', email: 'casey@example.com' },
];

const assistantUser = mockUsers.find(u => u.id === 'assistant')!;
const patient1User = mockUsers.find(u => u.id === 'patient1')!;

const lenyConversation: Conversation = {
  id: 'conv_leny_patient1',
  title: 'Leny',
  participants: [patient1User, assistantUser],
  participantString: 'Your AI Health Companion',
  avatar: '',
  icon: Bot,
  avatarColor: 'bg-primary',
  timestamp: new Date(), // most recent
  patientId: 'patient1',
  messages: [
    {
      id: 'msg_leny_1',
      senderId: 'assistant',
      text: 'Hi Alex! I\'m Leny, your personal health companion. I\'m here to help answer questions, track your goals, or just chat. What\'s on your mind today?',
      timestamp: new Date(),
      type: 'user',
    },
  ],
};


export const mockConversations: Conversation[] = [
  lenyConversation,
];


export const mockForYouData: ForYouCardData[] = [
  {
    id: 'fy_streak_1',
    type: 'health_streak',
    icon: Flame,
    iconColor: 'text-orange-500',
    title: '7-Day Meditation Streak',
    description: 'Keep it up! Just 3 more days to reach your goal.',
    currentStreak: 4,
    goal: 7,
    cta: 'Continue Streak',
    progressData: [
      { date: 'Day 1', value: 1 },
      { date: 'Day 2', value: 1 },
      { date: 'Day 3', value: 1 },
      { date: 'Day 4', value: 1 },
      { date: 'Day 5', value: 0 },
      { date: 'Day 6', value: 0 },
      { date: 'Day 7', value: 0 },
    ],
  },
  {
    id: 'fy_streak_2',
    type: 'health_streak',
    icon: Dumbbell,
    iconColor: 'text-blue-500',
    title: 'Monthly Workout Goal',
    description: 'You\'ve completed 10 workouts this month.',
    currentStreak: 10,
    goal: 15,
    cta: 'Log Workout',
     progressData: [
      { date: 'Week 1', value: 3 },
      { date: 'Week 2', value: 4 },
      { date: 'Week 3', value: 3 },
      { date: 'Week 4', value: 0 },
    ],
  },
  {
    id: 'fy_1',
    type: 'appointment',
    icon: Calendar,
    iconColor: 'text-blue-500',
    title: 'Upcoming Appointment',
    description: 'Cardiology check-up with Dr. Sarah Chen.',
    timestamp: new Date('2024-08-05T14:30:00Z'),
    cta: 'View Details',
  },
  {
    id: 'fy_2',
    type: 'reminder',
    icon: Bell,
    iconColor: 'text-orange-500',
    title: 'Medication Reminder',
    description: 'Take your daily multivitamin.',
    cta: 'Mark as Done',
  },
  {
    id: 'fy_3',
    type: 'lab_result',
    icon: FlaskConical,
    iconColor: 'text-purple-500',
    title: 'New Lab Results',
    description: 'Your recent blood test results are available.',
    timestamp: new Date('2024-07-29T11:00:00Z'),
    cta: 'View Results',
  },
    {
    id: 'fy_4',
    type: 'health_tip',
    icon: Lightbulb,
    iconColor: 'text-green-500',
    title: 'Health Tip of the Day',
    description: 'Stay hydrated! Aim for 8 glasses of water.',
    cta: 'Learn More',
  },
];


export const mockRecentSearches: string[] = [
    'Drug interactions warfarin amoxicillin',
    'Chest pain workup 45 year old male',
    'CURB-65 pneumonia severity',
];

export const mockFavoriteActions: QuickAction[] = [
    { id: 'fav1', label: 'Drug Interactions', icon: Pill, isStarred: true, cardColor: 'bg-yellow-100/50', iconColor: 'text-yellow-600' },
    { id: 'fav2', label: 'CURB-65', icon: BarChart3, isStarred: true, cardColor: 'bg-blue-100/50', iconColor: 'text-blue-600' },
    { id: 'fav3', label: 'Sepsis Bundle', icon: Package, isStarred: true, cardColor: 'bg-red-100/50', iconColor: 'text-red-600' },
];

export const mockEmergencyProtocols: QuickAction[] = [
    { id: 'em1', label: 'Code Blue', icon: Siren, isStarred: true, cardColor: 'bg-red-100/50', iconColor: 'text-red-600' },
    { id: 'em2', label: 'Sepsis Bundle', icon: Zap, isStarred: true, cardColor: 'bg-orange-100/50', iconColor: 'text-orange-600' },
    { id: 'em3', label: 'STEMI Protocol', icon: HeartPulse, isStarred: false, cardColor: 'bg-pink-100/50', iconColor: 'text-pink-600' },
];
