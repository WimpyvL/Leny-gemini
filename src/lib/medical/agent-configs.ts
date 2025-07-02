/**
 * @fileOverview Agent Configuration for Medical Specialties
 * Lightweight tinting rules to modify base clinical responses
 */

import type { MedicalSpecialty } from '@/lib/types';

interface AgentConfig {
  prioritize_keywords: string[];
  deprioritize_keywords: string[];
  add_tests: {
    condition: string;
    recommended_test: string;
  }[];
  emphasis_areas: string[];
}

const agentConfigs: Record<MedicalSpecialty, AgentConfig> = {
  orthopedics: {
    prioritize_keywords: [
      'fracture',
      'ligament',
      'tendon',
      'joint',
      'bone',
      'weight-bearing',
      'mechanical',
    ],
    deprioritize_keywords: ['infectious', 'metabolic', 'dermatologic'],
    add_tests: [
      {
        condition: 'trauma or inability to bear weight',
        recommended_test: 'X-ray (AP, lateral, oblique views)',
      },
      {
        condition: 'suspected ligament injury',
        recommended_test: 'MRI if symptoms persist >2 weeks',
      },
    ],
    emphasis_areas: [
      'Ottawa rules for imaging decisions',
      'Functional assessment and return to activity',
      'Physical therapy referral timing',
    ],
  },
  cardiology: {
    prioritize_keywords: [
      'chest pain',
      'palpitations',
      'dyspnea',
      'syncope',
      'hypertension',
      'arrhythmia',
    ],
    deprioritize_keywords: ['musculoskeletal', 'dermatologic'],
    add_tests: [
      {
        condition: 'chest pain or palpitations',
        recommended_test: '12-lead ECG immediately',
      },
      {
        condition: 'heart failure suspected',
        recommended_test: 'BNP or NT-proBNP, echocardiogram',
      },
    ],
    emphasis_areas: [
      'ASCVD risk assessment',
      'Hemodynamic stability evaluation',
      'Anticoagulation considerations',
    ],
  },
  gastroenterology: {
    prioritize_keywords: [
      'abdominal pain',
      'nausea',
      'vomiting',
      'diarrhea',
      'constipation',
      'GI bleeding',
    ],
    deprioritize_keywords: ['cardiac', 'pulmonary'],
    add_tests: [
      {
        condition: 'persistent abdominal pain',
        recommended_test: 'CBC, CMP, lipase, consider CT abdomen/pelvis',
      },
      {
        condition: 'GI bleeding or anemia',
        recommended_test: 'CBC, iron studies, consider endoscopy',
      },
    ],
    emphasis_areas: [
      'Red flag symptoms requiring urgent evaluation',
      'Functional vs organic disease differentiation',
      'Endoscopy indications',
    ],
  },
  neurology: {
    prioritize_keywords: [
      'headache',
      'dizziness',
      'weakness',
      'numbness',
      'seizure',
      'cognitive',
    ],
    deprioritize_keywords: ['orthopedic', 'cardiac'],
    add_tests: [
      {
        condition: 'new or severe headache',
        recommended_test: 'Consider CT head, LP if indicated',
      },
      {
        condition: 'focal neurologic deficits',
        recommended_test: 'MRI brain, consider stroke workup',
      },
    ],
    emphasis_areas: [
      'Stroke risk assessment and time-sensitive interventions',
      'Seizure vs syncope differentiation',
      'Cognitive assessment tools',
    ],
  },
  rheumatology: {
    prioritize_keywords: [
      'joint pain',
      'stiffness',
      'swelling',
      'inflammatory',
      'autoimmune',
      'systemic',
    ],
    deprioritize_keywords: ['infectious', 'traumatic'],
    add_tests: [
      {
        condition: 'joint pain with swelling',
        recommended_test: 'ESR, CRP, consider joint aspiration',
      },
      {
        condition: 'suspected autoimmune disease',
        recommended_test: 'ANA, RF, anti-CCP, complement levels',
      },
    ],
    emphasis_areas: [
      'Inflammatory vs mechanical joint disease',
      'Systemic manifestations of rheumatic disease',
      'DMARD therapy considerations',
    ],
  },
  infectious_disease: {
    prioritize_keywords: [
      'fever',
      'infection',
      'sepsis',
      'immunocompromised',
      'travel',
      'exposure',
    ],
    deprioritize_keywords: ['chronic', 'degenerative'],
    add_tests: [
      {
        condition: 'fever with systemic symptoms',
        recommended_test: 'Blood cultures, CBC with diff, lactate',
      },
      {
        condition: 'suspected meningitis',
        recommended_test: 'Lumbar puncture after imaging if indicated',
      },
    ],
    emphasis_areas: [
      'Sepsis recognition and early intervention',
      'Antibiotic stewardship',
      'Isolation precautions',
    ],
  },
  emergency_medicine: {
    prioritize_keywords: [
      'acute',
      'severe',
      'sudden onset',
      'unstable',
      'trauma',
      'overdose',
    ],
    deprioritize_keywords: ['chronic', 'stable'],
    add_tests: [
      {
        condition: 'acute severe symptoms',
        recommended_test: 'Vital signs, basic labs, imaging as indicated',
      },
      {
        condition: 'trauma',
        recommended_test: 'FAST exam, trauma series if indicated',
      },
    ],
    emphasis_areas: [
      'ABCs and hemodynamic stability',
      'Rapid triage and disposition',
      'Pain management in acute settings',
    ],
  },
  internal_medicine: {
    prioritize_keywords: [
      'chronic',
      'multiple',
      'systemic',
      'comorbidities',
      'preventive',
    ],
    deprioritize_keywords: [],
    add_tests: [
      {
        condition: 'multiple symptoms or chronic disease',
        recommended_test: 'Comprehensive metabolic panel, CBC',
      },
      {
        condition: 'preventive care',
        recommended_test: 'Age-appropriate screening tests',
      },
    ],
    emphasis_areas: [
      'Comprehensive care coordination',
      'Chronic disease management',
      'Preventive care guidelines',
    ],
  },
  family_medicine: {
    prioritize_keywords: [
      'family',
      'preventive',
      'wellness',
      'chronic',
      'behavioral',
    ],
    deprioritize_keywords: [],
    add_tests: [
      {
        condition: 'routine care',
        recommended_test: 'Age and risk-appropriate screening',
      },
      {
        condition: 'family history concerns',
        recommended_test: 'Genetic counseling consideration',
      },
    ],
    emphasis_areas: [
      'Whole-person care approach',
      'Behavioral health integration',
      'Family and social context',
    ],
  },
  // Add other specialties as needed, defaulting to internal medicine
  pediatrics: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  geriatrics: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  critical_care: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  trauma_surgery: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  general_surgery: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  neurosurgery: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  cardiothoracic_surgery: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  plastic_surgery: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  urology: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  pulmonology: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  nephrology: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  endocrinology: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  hematology_oncology: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  allergy_immunology: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  obstetrics_gynecology: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  maternal_fetal_medicine: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  psychiatry: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  psychology: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  addiction_medicine: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  radiology: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  pathology: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  nuclear_medicine: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  dermatology: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  ophthalmology: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  otolaryngology: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  anesthesiology: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  pain_management: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  palliative_care: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  sports_medicine: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
  occupational_medicine: { prioritize_keywords: [], deprioritize_keywords: [], add_tests: [], emphasis_areas: [] },
};

export function getAgentConfig(specialty: MedicalSpecialty): AgentConfig {
    return agentConfigs[specialty] || agentConfigs.internal_medicine;
}
