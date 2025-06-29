'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/landing-chat-flow.ts';
import '@/ai/flows/patient-chat-flow.ts';
import '@/ai/flows/medical-query-flow.ts';
