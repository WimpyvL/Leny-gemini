export type User = {
  id: string;
  name: string;
  avatar: string;
  role: 'patient' | 'doctor';
};

export type Message = {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  attachment?: {
    name: string;
    url: string;
    type: 'image' | 'pdf' | 'doc';
  };
};

export type Conversation = {
  id: string;
  participants: User[];
  messages: Message[];
  patientId: string;
  doctorId: string;
};
