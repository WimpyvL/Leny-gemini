'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-symptoms.ts';
import '@/ai/flows/landing-chat-flow.ts';
import '@/ai/flows/patient-chat-flow.ts';
import '@/ai/flows/expert-chat-flow.ts';
import '@/ai/flows/expert-router-flow.ts';
