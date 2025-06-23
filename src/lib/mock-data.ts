import type { User, Conversation, ForYouCardData } from './types';
import { Bot, Stethoscope, Users, Calendar, Bell, FlaskConical, Lightbulb, Flame, Dumbbell } from 'lucide-react';

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
const doctor1User = mockUsers.find(u => u.id === 'doctor1')!;

const groupChatParticipants = [
  patient1User,
  assistantUser,
  doctor1User,
];

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
  {
    id: 'conv_group_1',
    title: 'AI Assisted Chat',
    participants: groupChatParticipants,
    participantString: 'You, Leny, Dr. Chen',
    avatar: '',
    icon: Users,
    avatarColor: 'bg-purple-500',
    timestamp: new Date('2024-07-30T10:00:00Z'),
    unread: 2,
    patientId: 'patient1',
    doctorId: 'doctor1',
    messages: [
      {
        id: 'msg_grp_1',
        senderId: 'patient1',
        text: 'I\'ve been having a persistent headache for 3 days.',
        timestamp: new Date('2024-07-30T09:55:00Z'),
        type: 'user',
      },
      {
        id: 'msg_grp_2',
        senderId: 'assistant',
        type: 'assessment',
        assessment: {
          title: "Headache Analysis:",
          summary: [
            "Symptom: Persistent headache (3 days).",
            "To better assist, please provide more details:",
            "• Location of the pain (e.g., temples, forehead)",
            "• Type of pain (e.g., throbbing, sharp, dull)",
            "• Any other symptoms? (e.g., nausea, sensitivity to light)",
          ],
          recommendations: "You can share this information here. I can also invite Dr. Chen to this chat if you'd like a professional opinion.",
          suggestions: ["Describe the pain", "Note other symptoms", "Invite Dr. Chen"],
        },
        timestamp: new Date('2024-07-30T09:56:00Z'),
      },
       {
        id: 'msg_grp_3',
        senderId: 'patient1',
        text: 'Yes, please invite Dr. Chen.',
        timestamp: new Date('2024-07-30T09:58:00Z'),
        type: 'user',
      },
       {
        id: 'msg_grp_4',
        senderId: 'doctor1',
        text: 'Hi, I\'m Dr. Chen. Thanks for inviting me. Could you please describe the headache in more detail?',
        timestamp: new Date('2024-07-30T10:00:00Z'),
        type: 'user',
      },
    ],
  },
  {
    id: 'conv_alex_chen',
    title: 'Dr. Sarah Chen',
    participants: [patient1User, doctor1User],
    participantString: 'Follow-up on your results.',
    avatar: '',
    icon: Stethoscope,
    avatarColor: 'bg-sky-500',
    timestamp: new Date('2024-07-29T12:40:00Z'),
    patientId: 'patient1',
    doctorId: 'doctor1',
    messages: [
      { id: 'msg_ac_1', text: 'Hi Alex, I have your lab results. Let\'s discuss them when you have a moment.', senderId: 'doctor1', timestamp: new Date('2024-07-29T12:30:00Z'), type: 'user' },
      { id: 'msg_ac_2', text: 'Thanks Dr. Chen, I am free now.', senderId: 'patient1', timestamp: new Date('2024-07-29T12:40:00Z'), type: 'user' },
    ],
  },
    {
    id: 'conv_casey_chen',
    title: 'Dr. Sarah Chen',
    participants: [mockUsers.find(u => u.id === 'patient2')!, doctor1User],
    participantString: 'I have a weird rash on my arm.',
    avatar: '',
    icon: Stethoscope,
    avatarColor: 'bg-sky-500',
    timestamp: new Date('2024-07-30T15:10:00Z'),
    patientId: 'patient2',
    doctorId: 'doctor1',
    messages: [
      { id: 'msg_cc_1', text: 'Hi Dr. Chen, I have a weird rash on my arm. It doesn\'t itch, but it looks strange. Can I send a picture?', senderId: 'patient2', timestamp: new Date('2024-07-30T15:10:00Z'), type: 'user' },
    ],
  },
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
