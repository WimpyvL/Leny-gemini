/**
 * @fileOverview Simulated Medical Knowledge Database for Leny Medical AI System
 * Contains clinical guidelines, diagnostic criteria, and treatment protocols.
 */

import { MedicalSpecialty } from "@/lib/types";

// ICD-10 Common Diagnoses by Specialty
const ICD10_DIAGNOSES: Record<string, Record<string, { name: string; severity: string }>> = {
  cardiology: {
    'I21.9': { name: 'Acute myocardial infarction', severity: 'high' },
    'I50.9': { name: 'Heart failure', severity: 'high' },
    'I48.91': { name: 'Atrial fibrillation', severity: 'medium' },
  },
  neurology: {
    'G43.909': { name: 'Migraine', severity: 'low' },
    'I63.9': { name: 'Cerebral infarction', severity: 'high' },
  },
  // ... other specialties
};

// Clinical Decision Rules
const CLINICAL_DECISION_RULES = {
  chest_pain: {
    HEART_score: {
      description: 'Risk stratification for chest pain',
      interpretation: {
        '0-3': 'Low risk (2.5% MACE at 6 weeks)',
        '4-6': 'Moderate risk (20.3% MACE at 6 weeks)',
        '7-10': 'High risk (72.7% MACE at 6 weeks)',
      },
    },
  },
  // ... other rules
};

// Drug Interactions Database
const DRUG_INTERACTIONS = {
  warfarin: {
    major_interactions: ['aspirin', 'amiodarone', 'fluconazole'],
    monitoring: 'INR every 4-6 weeks when stable',
  },
  // ... other drugs
};

// Emergency Protocols
const EMERGENCY_PROTOCOLS = {
  cardiac_arrest: {
    algorithm: 'ACLS',
    steps: ['Check responsiveness and pulse', 'Call for help and AED', 'Begin CPR (30:2 ratio)'],
  },
  stroke: {
    time_windows: {
        iv_tpa: "4.5 hours from symptom onset",
        mechanical_thrombectomy: "24 hours (selected patients)"
    },
  }
};

interface Knowledge {
    summary: string;
    sources: string[];
}

export function retrieveMedicalKnowledge(query: string, specialty: MedicalSpecialty): Knowledge {
    const queryLower = query.toLowerCase();
    let summaryParts: string[] = [];
    let sources: string[] = [];

    // Check for drug interactions
    for (const drug in DRUG_INTERACTIONS) {
        if (queryLower.includes(drug)) {
            summaryParts.push(`Interaction data for ${drug} is available.`);
            sources.push(`${drug} Drug Interactions`);
        }
    }

    // Check for clinical rules
    for (const condition in CLINICAL_DECISION_RULES) {
        if (queryLower.includes(condition.replace('_', ' '))) {
            summaryParts.push(`Clinical decision rules for ${condition} are relevant.`);
            sources.push(`${condition} Clinical Rules`);
        }
    }

    // Check for emergency protocols
     for (const condition in EMERGENCY_PROTOCOLS) {
        if (queryLower.includes(condition.replace('_', ' '))) {
            summaryParts.push(`Emergency protocols for ${condition} are available.`);
            sources.push(`${condition} Emergency Protocol`);
        }
    }

    if (summaryParts.length === 0) {
        return {
            summary: "General medical knowledge is applicable. No specific high-yield documents were retrieved for this query.",
            sources: []
        };
    }

    return {
        summary: summaryParts.join('\n'),
        sources: sources
    };
}
