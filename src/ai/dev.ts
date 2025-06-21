'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-symptoms.ts';
import '@/ai/flows/landing-chat-flow.ts';
