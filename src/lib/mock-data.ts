import type { User, Conversation, ForYouCardData, QuickAction } from './types';

export const mockUsers: User[] = [
  { id: 'assistant', name: 'Leny', avatar: '', icon: 'Bot', avatarColor: 'bg-primary', role: 'assistant' },
  { 
    id: 'doctor1', 
    name: 'Dr. Sarah Chen', 
    avatar: 'SC', 
    avatarColor: 'bg-sky-500', 
    role: 'doctor', 
    icon: 'Stethoscope', 
    email: 'drchen@example.com',
    doctorInfo: {
      specialty: 'Cardiology',
      licenseNumber: 'MD-12345678',
      practiceName: 'Heartwell Clinic',
      practiceAddress: '123 Health St, Medville, MD 12345',
      officeHours: 'Mon-Fri, 9:00 AM - 5:00 PM',
      bio: 'Dr. Sarah Chen is a board-certified cardiologist with over 15 years of experience in treating a wide range of cardiovascular conditions. She is dedicated to providing compassionate and comprehensive care to her patients.'
    },
    settings: {
        theme: 'light',
        notifications: {
            email: true,
            push: true,
        }
    }
  },
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
  { id: 'patient3', name: 'Jordan', avatar: 'J', avatarColor: 'bg-teal-500', role: 'patient', email: 'jordan@example.com' },
];

const assistantUser = mockUsers.find(u => u.id === 'assistant')!;
const patient1User = mockUsers.find(u => u.id === 'patient1')!;
const drChenUser = mockUsers.find(u => u.id === 'doctor1')!;

const lenyConversation: Conversation = {
  id: 'conv_leny_patient1',
  title: 'Leny',
  participants: [patient1User, assistantUser],
  participantString: 'Your AI Health Companion',
  avatar: '',
  icon: 'Bot',
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
     {
      id: 'msg_leny_2',
      senderId: 'patient1',
      text: 'Hi Leny, I\'ve been having some trouble sleeping lately. Any tips?',
      timestamp: new Date(),
      type: 'user',
    },
    {
      id: 'msg_leny_3',
      senderId: 'assistant',
      text: 'I\'m sorry to hear that, Alex. Trouble sleeping can be really frustrating. Some people find that creating a relaxing bedtime routine, like reading or listening to calm music, can be helpful. It\'s also often recommended to avoid screens for an hour before bed. Have you tried anything like that?',
      timestamp: new Date(),
      type: 'user',
    },
  ],
};


export const mockConversations: Conversation[] = [
  lenyConversation
];


export const mockForYouData: ForYouCardData[] = [
  {
    id: 'fy_streak_1',
    type: 'health_streak',
    icon: 'Flame',
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
    icon: 'Dumbbell',
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
    icon: 'Calendar',
    iconColor: 'text-blue-500',
    title: 'Upcoming Appointment',
    description: 'Cardiology check-up with Dr. Sarah Chen.',
    timestamp: new Date('2024-08-05T14:30:00Z'),
    cta: 'View Details',
  },
  {
    id: 'fy_2',
    type: 'reminder',
    icon: 'Bell',
    iconColor: 'text-orange-500',
    title: 'Medication Reminder',
    description: 'Take your daily multivitamin.',
    cta: 'Mark as Done',
  },
  {
    id: 'fy_3',
    type: 'lab_result',
    icon: 'FlaskConical',
    iconColor: 'text-purple-500',
    title: 'New Lab Results',
    description: 'Your recent blood test results are available.',
    timestamp: new Date('2024-07-29T11:00:00Z'),
    cta: 'View Results',
  },
    {
    id: 'fy_4',
    type: 'health_tip',
    icon: 'Lightbulb',
    iconColor: 'text-green-500',
    title: 'Health Tip of the Day',
    description: 'Stay hydrated! Aim for 8 glasses of water.',
    cta: 'Learn More',
  },
];

export const mockDoctorForYouData: ForYouCardData[] = [
  {
    id: 'doc_fy_1',
    type: 'research_update',
    icon: 'ClipboardPenLine',
    iconColor: 'text-blue-600',
    title: 'New Study on Beta-Blockers in Post-MI Patients',
    description: 'A recent trial published in NEJM challenges long-standing practices for stable post-MI patients without heart failure.',
    timestamp: new Date('2024-07-28T09:00:00Z'),
    cta: 'Read Summary',
  },
  {
    id: 'doc_fy_2',
    type: 'industry_news',
    icon: 'Newspaper',
    iconColor: 'text-green-600',
    title: 'FDA Approves New SGLT2 Inhibitor for Heart Failure',
    description: 'The FDA has expanded the indication for a new SGLT2 inhibitor to include patients with heart failure with preserved ejection fraction (HFpEF).',
    timestamp: new Date('2024-07-27T14:00:00Z'),
    cta: 'Review Data',
  },
  {
    id: 'doc_fy_3',
    type: 'cme_course',
    icon: 'BookOpenCheck',
    iconColor: 'text-purple-600',
    title: 'Upcoming CME: Advanced Cardiac Imaging',
    description: 'Earn 5 CME credits with this online course covering the latest in cardiac MRI and CT angiography.',
    timestamp: new Date('2024-08-15T00:00:00Z'),
    cta: 'Enroll Now',
  },
  {
    id: 'doc_fy_4',
    type: 'research_update',
    icon: 'ClipboardPenLine',
    iconColor: 'text-blue-600',
    title: 'AI in ECG Interpretation Shows Promise',
    description: 'A new algorithm demonstrates higher accuracy in detecting atrial fibrillation from standard 12-lead ECGs compared to traditional methods.',
    timestamp: new Date('2024-07-26T11:30:00Z'),
    cta: 'Explore the Research',
  },
];


export const mockRecentSearches: string[] = [
    'How to manage seasonal allergies?',
    'Is intermittent fasting safe?',
    'Stretches for lower back pain',
];

export const mockFavoriteActions: QuickAction[] = [
    { id: 'fav1', label: 'Log Symptoms', icon: 'NotepadText', isStarred: true, cardColor: 'bg-blue-100/50', iconColor: 'text-blue-600' },
    { id: 'fav2', label: 'Track Medication', icon: 'Pill', isStarred: true, cardColor: 'bg-green-100/50', iconColor: 'text-green-600' },
    { id: 'fav3', label: 'Book Appointment', icon: 'CalendarPlus', isStarred: true, cardColor: 'bg-purple-100/50', iconColor: 'text-purple-600' },
];

export const mockEmergencyProtocols: QuickAction[] = [
    { id: 'em1', label: 'Call 911', icon: 'Siren', isStarred: false, cardColor: 'bg-red-100/50', iconColor: 'text-red-600' },
    { id: 'em2', label: 'Poison Control', icon: 'PhoneCall', isStarred: false, cardColor: 'bg-red-100/50', iconColor: 'text-red-600' },
    { id: 'em3', label: 'Find Urgent Care', icon: 'MapPin', isStarred: false, cardColor: 'bg-red-100/50', iconColor: 'text-red-600' },
];
