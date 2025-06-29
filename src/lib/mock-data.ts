import type { User, Conversation, ForYouCardData, QuickAction, AiExpert } from './types';

// Use a fixed date for all timestamps to prevent hydration errors
const now = new Date('2024-08-01T10:00:00Z');

export const mockUsers: User[] = [
  { 
    id: 'assistant', 
    name: 'S.A.N.I.', 
    avatar: '🤖', 
    role: 'assistant' 
  },
  { 
    id: 'user1', 
    name: 'Alex Rivera', 
    avatar: 'https://placehold.co/100x100/7E57C2/FFFFFF.png', 
    role: 'user',
    email: 'alex.rivera@example.com',
    settings: {
        theme: 'dark',
        notifications: {
            email: true,
            push: false,
        }
    }
  },
  { 
    id: 'expert1', 
    name: 'Dr. Evelyn Reed', 
    avatar: 'https://placehold.co/100x100/42A5F5/FFFFFF.png', 
    role: 'expert', 
    email: 'evelyn.reed@example.com',
    expertInfo: {
      specialty: 'Venture Capital & Startups',
      title: 'Managing Partner at Innovate Capital',
      practiceName: 'Innovate Capital',
      practiceAddress: '123 Tech Hub, Silicon Valley, CA 94025',
      officeHours: 'By Appointment',
      bio: 'Dr. Evelyn Reed is a seasoned venture capitalist with a passion for disruptive technologies. With over 20 years of experience, she has a knack for identifying and nurturing early-stage startups into market leaders.'
    },
    settings: {
        theme: 'dark',
        notifications: {
            email: true,
            push: true,
        }
    }
  },
  { 
    id: 'user2', 
    name: 'Casey Lee', 
    avatar: 'https://placehold.co/100x100/66BB6A/FFFFFF.png', 
    role: 'user', 
    email: 'casey.lee@example.com' 
  },
  { 
    id: 'expert2', 
    name: 'Marcus Thorne', 
    avatar: 'https://placehold.co/100x100/AB47BC/FFFFFF.png', 
    role: 'expert', 
    email: 'marcus.thorne@example.com',
    expertInfo: {
      specialty: 'Marketing & Branding',
      practiceName: 'Thorne Consulting',
      practiceAddress: '456 Madison Ave, New York, NY 10017',
    }
  },
  { 
    id: 'user3', 
    name: 'Jordan Garcia', 
    avatar: 'https://placehold.co/100x100/26A69A/FFFFFF.png', 
    role: 'user', 
    email: 'jordan.garcia@example.com' 
  },
];


export const mockConversations: Conversation[] = [
  {
    id: 'conv_sani_user1',
    title: 'S.A.N.I.',
    participantIds: ['user1', 'assistant'],
    participantString: 'Your AI Companion',
    timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
    messages: [
      {
        id: 'msg_sani_1',
        senderId: 'assistant',
        text: "Hello Alex! I'm S.A.N.I., your personal AI companion. How can I help you unlock your potential today?",
        timestamp: new Date(now.getTime() - 5 * 60 * 1000),
        type: 'user',
      }
    ],
  },
  {
    id: 'conv_expert1_user1',
    title: 'Dr. Evelyn Reed',
    participantIds: ['user1', 'expert1'],
    participantString: 'Startup funding advice',
    timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
    messages: [
       {
        id: 'msg_expert1_1',
        senderId: 'expert1',
        text: "Alex, thanks for reaching out. Let's discuss your pitch deck. I have some initial thoughts on the market analysis section.",
        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000),
        type: 'user',
      }
    ],
  },
   {
    id: 'conv_group_chat',
    title: 'Project Phoenix Team',
    participantIds: ['user1', 'user2', 'user3', 'expert2'],
    participantString: 'Casey, Jordan, Marcus...',
    timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
    messages: [
       {
        id: 'msg_group_1',
        senderId: 'expert2',
        text: "Team, let's sync on the marketing campaign deliverables for Q3. The new AI-powered analytics tools are ready for us to test.",
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        type: 'user',
      }
    ],
    unread: 3,
  },
  {
    id: 'conv_expert1_user2',
    title: 'Casey Lee',
    participantIds: ['expert1', 'user2'],
    participantString: 'Initial project screening',
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    messages: [
       {
        id: 'msg_expert1_user2_1',
        senderId: 'user2',
        text: "Dr. Reed, I've sent over the documents for 'Project Chimera'. Looking forward to your feedback.",
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        type: 'user',
      }
    ],
  },
];


export const mockForYouData: ForYouCardData[] = [
  {
    id: 'fy_streak_1',
    type: 'goal_streak',
    icon: '🔥',
    iconColor: 'text-orange-500',
    title: '7-Day Learning Streak',
    description: 'Keep it up! Just 3 more days to reach your goal of learning about AI.',
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
    id: 'fy_1',
    type: 'consultation',
    icon: '🗓️',
    iconColor: 'text-blue-500',
    title: 'Upcoming Consultation',
    description: 'Pitch review with Dr. Evelyn Reed.',
    timestamp: new Date('2024-08-05T14:30:00Z'),
    cta: 'View Details',
  },
  {
    id: 'fy_2',
    type: 'reminder',
    icon: '🔔',
    iconColor: 'text-orange-500',
    title: 'Task Reminder',
    description: 'Finalize Q3 budget report.',
    cta: 'Mark as Done',
  },
  {
    id: 'fy_3',
    type: 'insight',
    icon: '💡',
    iconColor: 'text-purple-500',
    title: 'New Insight Available',
    description: 'AI analysis of your recent market data is ready.',
    timestamp: new Date('2024-07-29T11:00:00Z'),
    cta: 'View Insight',
  },
];

export const mockRecentSearches: string[] = [
    'How to create a business plan?',
    'Latest trends in AI',
    'Tips for effective public speaking',
];

export const mockFavoriteActions: QuickAction[] = [
    { id: 'fav1', label: 'Log Idea', icon: '📝', isStarred: true, cardColor: 'bg-blue-100/50', iconColor: 'text-blue-600' },
    { id: 'fav2', label: 'Track Expenses', icon: '💰', isStarred: true, cardColor: 'bg-green-100/50', iconColor: 'text-green-600' },
    { id: 'fav3', label: 'Book Consultation', icon: '📅', isStarred: true, cardColor: 'bg-purple-100/50', iconColor: 'text-purple-600' },
];

export const mockAiExperts: AiExpert[] = [
    {
        "specialty": "Venture Capital",
        "name": "Dr. Evelyn Reed",
        "expert_prompt": "You are Dr. Evelyn Reed, a top-tier Venture Capitalist known for your sharp insights and strategic funding advice. You speak with authority and clarity, providing expert-level analysis on startups, market trends, and investment strategies.",
    },
    {
        "specialty": "Marketing & Branding",
        "name": "Marcus Thorne",
        "expert_prompt": "You are Marcus Thorne, a world-renowned marketing guru obsessed with brand storytelling and consumer psychology. You provide charismatic, data-driven advice on building memorable brands and effective campaigns.",
    },
    {
        "specialty": "Artificial Intelligence",
        "name": "Dr. Kenji Tanaka",
        "expert_prompt": "You are Dr. Kenji Tanaka, a leading AI researcher and ethicist. You explain complex AI concepts with precision and approachability, focusing on practical applications and ethical considerations.",
    },
    {
        "specialty": "Finance & Investing",
        "name": "Anya Sharma",
        "expert_prompt": "You are Anya Sharma, a seasoned financial analyst and investment strategist. You are known for your calm, detail-oriented approach to wealth management, market analysis, and personal finance.",
    },
    {
        "specialty": "Leadership & Management",
        "name": "David Chen",
        "expert_prompt": "You are David Chen, a leadership coach and former Fortune 500 CEO. You provide strategic and composed advice on team building, organizational psychology, and effective management.",
    },
    {
        "specialty": "Education & Learning",
        "name": "Dr. Isabel Moreno",
        "expert_prompt": "You are Dr. Isabel Moreno, an expert in pedagogy and cognitive science. You offer meticulous and empathetic advice on learning strategies, educational technology, and curriculum development.",
    },
    {
        "specialty": "Relationships & Communication",
        "name": "Dr. Leo Maxwell",
        "expert_prompt": "You are Dr. Leo Maxwell, a psychologist specializing in relationships and communication. You are compassionate and analytical, providing guidance on interpersonal dynamics and conflict resolution.",
    }
];
