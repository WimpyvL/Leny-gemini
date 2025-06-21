import type { User, Conversation } from './types';

export const mockUsers: User[] = [
  { id: 'patient1', name: 'Alice Johnson', avatar: 'https://placehold.co/100x100.png', role: 'patient' },
  { id: 'doctor1', name: 'Dr. Evelyn Reed', avatar: 'https://placehold.co/100x100.png', role: 'doctor' },
  { id: 'patient2', name: 'Bob Williams', avatar: 'https://placehold.co/100x100.png', role: 'patient' },
  { id: 'doctor2', name: 'Dr. Michael Chen', avatar: 'https://placehold.co/100x100.png', role: 'doctor' },
  { id: 'patient3', name: 'Charlie Brown', avatar: 'https://placehold.co/100x100.png', role: 'patient' },
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    patientId: 'patient1',
    doctorId: 'doctor1',
    participants: [mockUsers[0], mockUsers[1]],
    messages: [
      { id: 'msg1', text: 'Hello Dr. Reed, I have a persistent cough and a slight fever.', senderId: 'patient1', timestamp: new Date('2024-07-20T10:00:00Z') },
      { id: 'msg2', text: 'Hello Alice. How long have you had these symptoms?', senderId: 'doctor1', timestamp: new Date('2024-07-20T10:02:00Z') },
      { id: 'msg3', text: 'For about 3 days now. It gets worse at night.', senderId: 'patient1', timestamp: new Date('2024-07-20T10:05:00Z') },
      { id: 'msg4', text: 'I also feel some chest pain and shortness of breath when I walk up stairs.', senderId: 'patient1', timestamp: new Date('2024-07-20T10:15:00Z') }
    ],
  },
  {
    id: 'conv2',
    patientId: 'patient2',
    doctorId: 'doctor1',
    participants: [mockUsers[2], mockUsers[1]],
    messages: [
      { id: 'msg5', text: 'Hi Dr. Reed, I need to renew my prescription.', senderId: 'patient2', timestamp: new Date('2024-07-20T08:20:00Z') },
    ],
  },
  {
    id: 'conv3',
    patientId: 'patient3',
    doctorId: 'doctor2',
    participants: [mockUsers[4], mockUsers[3]],
    messages: [
      { id: 'msg6', text: 'Good morning Dr. Chen. I have a question about my lab results.', senderId: 'patient3', timestamp: new Date('2024-07-19T09:00:00Z') },
      { id: 'msg7', text: 'Of course, Charlie. I see them here. What is your question?', senderId: 'doctor2', timestamp: new Date('2024-07-19T10:00:00Z') }
    ],
  },
];
