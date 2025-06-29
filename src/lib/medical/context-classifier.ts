/**
 * @fileOverview Context Classification Module for Leny Medical AI System
 * Classifies user queries into medical context types, specialties, and detects red flags.
 */
import { ContextType, MedicalSpecialty } from '@/lib/types';

// Red Flag Keywords for Escalation - Comprehensive Emergency Indicators
const RED_FLAG_KEYWORDS = {
  // Cardiovascular Emergencies
  cardiovascular: [
    'chest pain',
    'crushing chest pain',
    'chest pressure',
    'heart attack',
    'cardiac arrest',
    'palpitations with chest pain',
    'syncope',
    'fainting',
    'severe shortness of breath',
    'pulmonary edema',
    'cyanosis',
    'blue lips',
  ],

  // Neurological Emergencies
  neurological: [
    'severe headache',
    'worst headache of life',
    'thunderclap headache',
    'loss of consciousness',
    'unconscious',
    'coma',
    'seizure',
    'convulsions',
    'sudden weakness',
    'paralysis',
    'stroke symptoms',
    'facial drooping',
    'slurred speech',
    'confusion',
    'altered mental status',
    'vision loss',
    'double vision',
    'severe dizziness',
    'vertigo with neurological signs',
  ],

  // Respiratory Emergencies
  respiratory: [
    "difficulty breathing",
    "shortness of breath",
    "can't breathe",
    'respiratory distress',
    'wheezing',
    'stridor',
    'choking',
    'pneumothorax',
    'collapsed lung',
    'severe asthma attack',
  ],

  // Gastrointestinal Emergencies
  gastrointestinal: [
    'severe abdominal pain',
    'appendicitis',
    'bowel obstruction',
    'severe vomiting',
    'hematemesis',
    'vomiting blood',
    'melena',
    'bright red blood in stool',
    'severe diarrhea',
    'dehydration',
  ],

  // Infectious Disease Emergencies
  infectious: [
    'fever with rash',
    'meningitis',
    'sepsis',
    'high fever',
    'fever over 104',
    'fever with stiff neck',
    'petechial rash',
    'severe infection',
    'cellulitis',
    'necrotizing fasciitis',
  ],

  // Trauma & Bleeding
  trauma: [
    'severe bleeding',
    'hemorrhage',
    'major trauma',
    'head injury',
    'spinal injury',
    'fracture',
    'dislocation',
    'severe burns',
    'penetrating wound',
    'gunshot',
    'stab wound',
  ],

  // Obstetric Emergencies
  obstetric: [
    'pregnancy complications',
    'severe bleeding in pregnancy',
    'preeclampsia',
    'eclampsia',
    'placental abruption',
    'ectopic pregnancy',
    'miscarriage with heavy bleeding',
  ],

  // Psychiatric Emergencies
  psychiatric: [
    'suicidal thoughts',
    'suicide attempt',
    'homicidal thoughts',
    'psychosis',
    'severe depression',
    'manic episode',
    'substance overdose',
    'drug overdose',
    'alcohol poisoning',
  ],

  // Pediatric Emergencies
  pediatric: [
    'infant fever',
    'febrile seizure',
    'difficulty breathing in child',
    'severe dehydration',
    'failure to thrive',
    'child abuse',
    'ingestion',
    'poisoning',
  ],

  // Endocrine Emergencies
  endocrine: [
    'diabetic ketoacidosis',
    'severe hypoglycemia',
    'thyroid storm',
    'adrenal crisis',
    'severe hyperglycemia',
  ],
};

const ALL_RED_FLAGS = Object.values(RED_FLAG_KEYWORDS).flat();

const CONTEXT_PATTERNS: Record<ContextType, RegExp> = {
  [ContextType.SYMPTOM]: /\b(pain|hurt|ache|sore|feel|feeling|dizzy|nauseous|tired|weak|have|having|headache|fever|cough|rash)\b/i,
  [ContextType.DIAGNOSIS]: /\b(diagnosed with|have|told i have|condition|disease|disorder|diabetes|hypertension|arthritis|asthma)\b/i,
  [ContextType.MEDICATION]: /\b(taking|prescribed|medication|drug|pill|side effects?|adverse|metformin|lisinopril|ibuprofen)\b/i,
  [ContextType.TEST_RESULT]: /\b(test|lab|blood work|mri|ct|x-ray|ultrasound|results?|showed|found|elevated|high|low|abnormal)\b/i,
...
  [ContextType.TREATMENT_PLAN]: /\b(how to treat|treatment|therapy|what should i do|next steps|manage|management)\b/i,
  [ContextType.TRIAGE]: /\b(should i|do i need to|go to|see|visit|emergency|urgent|er|hospital|serious|worried|concerned)\b/i,
  [ContextType.FOLLOW_UP]: /\b(follow up|check in|next|appointment)\b/i,
  [ContextType.LOGISTICS]: /\b(appointment|schedule|insurance|cost|location)\b/i,
  [ContextType.OTHER]: /.*/,
};

const SPECIALTY_PATTERNS: Record<MedicalSpecialty, RegExp> = {
  [MedicalSpecialty.ORTHOPEDICS]: /\b(knee|ankle|shoulder|hip|back|joint|bone|fracture|sprain|strain|torn|injury)\b/i,
  [MedicalSpecialty.CARDIOLOGY]: /\b(chest pain|heart|palpitation|blood pressure|cardiac|cardiovascular)\b/i,
  [MedicalSpecialty.GASTROENTEROLOGY]: /\b(stomach|abdominal|nausea|vomit|diarrhea|constipation|digestive|bowel|gi)\b/i,
  [MedicalSpecialty.NEUROLOGY]: /\b(headache|migraine|dizzy|seizure|numbness|weakness|neurologic|brain|nerve)\b/i,
  [MedicalSpecialty.PULMONOLOGY]: /\b(lung|breath|cough|asthma|copd|pneumonia|respiratory)\b/i,
  [MedicalSpecialty.INFECTIOUS_DISEASE]: /\b(fever|infection|virus|bacteria|sepsis|flu|covid)\b/i,
  [MedicalSpecialty.ENDOCRINOLOGY]: /\b(diabetes|thyroid|hormone|metabolism|obesity|adrenal)\b/i,
  [MedicalSpecialty.DERMATOLOGY]: /\b(skin|rash|mole|acne|eczema|psoriasis)\b/i,
  [MedicalSpecialty.RHEUMATOLOGY]: /\b(arthritis|lupus|rheumatoid|joint pain|autoimmune|inflammatory)\b/i,
  [MedicalSpecialty.PSYCHIATRY]: /\b(anxiety|depression|stress|mood|bipolar|suicidal|psychosis)\b/i,
  // Fallback specialties
  [MedicalSpecialty.EMERGENCY_MEDICINE]: /.*/,
  [MedicalSpecialty.INTERNAL_MEDICINE]: /.*/,
  [MedicalSpecialty.FAMILY_MEDICINE]: /.*/,
  // Other specialties can be added here
  [MedicalSpecialty.PEDIATRICS]: /\b(child|infant|baby|pediatric|kid)\b/i,
  [MedicalSpecialty.GERIATRICS]: /\b(elderly|senior|old|geriatric)\b/i,
  [MedicalSpecialty.CRITICAL_CARE]: /\b(icu|critical|ventilator|septic shock)\b/i,
  [MedicalSpecialty.TRAUMA_SURGERY]: /\b(trauma|accident|injury)\b/i,
  [MedicalSpecialty.GENERAL_SURGERY]: /\b(surgery|operation|appendix|gallbladder)\b/i,
  [MedicalSpecialty.NEUROSURGERY]: /\b(brain surgery|spinal surgery)\b/i,
  [MedicalSpecialty.CARDIOTHORACIC_SURGERY]: /\b(heart surgery|bypass)\b/i,
  [MedicalSpecialty.PLASTIC_SURGERY]: /\b(plastic surgery|reconstruction)\b/i,
  [MedicalSpecialty.UROLOGY]: /\b(urology|kidney stone|prostate)\b/i,
  [MedicalSpecialty.NEPHROLOGY]: /\b(kidney disease|dialysis|renal)\b/i,
  [MedicalSpecialty.HEMATOLOGY_ONCOLOGY]: /\b(cancer|chemo|leukemia|lymphoma|anemia)\b/i,
  [MedicalSpecialty.ALLERGY_IMMUNOLOGY]: /\b(allergy|hive|anaphylaxis|immun)\b/i,
  [MedicalSpecialty.OBSTETRICS_GYNECOLOGY]: /\b(pregnant|pregnancy|period|menstrual|vagina)\b/i,
  [MedicalSpecialty.MATERNAL_FETAL_MEDICINE]: /\b(high risk pregnancy)\b/i,
  [MedicalSpecialty.PSYCHOLOGY]: /\b(therapy|counseling|psychologist)\b/i,
  [MedicalSpecialty.ADDICTION_MEDICINE]: /\b(addiction|overdose|substance abuse)\b/i,
  [MedicalSpecialty.RADIOLOGY]: /\b(xray|ct scan|mri|ultrasound|radiology)\b/i,
  [MedicalSpecialty.PATHOLOGY]: /\b(biopsy|pathology|specimen)\b/i,
  [MedicalSpecialty.NUCLEAR_MEDICINE]: /\b(pet scan|nuclear scan)\b/i,
  [MedicalSpecialty.OPHTHALMOLOGY]: /\b(eye|vision|glaucoma|cataract)\b/i,
  [MedicalSpecialty.OTOLARYNGOLOGY]: /\b(ent|ear|nose|throat|sinus)\b/i,
  [MedicalSpecialty.ANESTHESIOLOGY]: /\b(anesthesia|anesthesiologist)\b/i,
  [MedicalSpecialty.PAIN_MANAGEMENT]: /\b(chronic pain|pain management)\b/i,
  [MedicalSpecialty.PALLIATIVE_CARE]: /\b(palliative|hospice|end of life)\b/i,
  [MedicalSpecialty.SPORTS_MEDICINE]: /\b(sports injury|concussion)\b/i,
  [MedicalSpecialty.OCCUPATIONAL_MEDICINE]: /\b(work injury|occupational health)\b/i,
};

export interface Classification {
    context: ContextType;
    specialty: MedicalSpecialty;
    hasRedFlags: boolean;
    reason?: string;
}

function hasRedFlags(text: string): { detected: boolean; reason?: string } {
  const textLower = text.toLowerCase();
  for (const redFlag of ALL_RED_FLAGS) {
    if (textLower.includes(redFlag)) {
      return { detected: true, reason: `Query contains the term: "${redFlag}".` };
    }
  }
  return { detected: false };
}

function classifyByPatterns<T extends string>(text: string, patterns: Record<T, RegExp>, defaultType: T): T {
  const scores: Record<string, number> = {};
  const textLower = text.toLowerCase();

  for (const type in patterns) {
    const matches = textLower.match(patterns[type as T]);
    if (matches) {
      scores[type] = (scores[type] || 0) + matches.length;
    }
  }

  const highestScoringType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b, '');

  return (highestScoringType || defaultType) as T;
}

export function classifyQuery(text: string): Classification {
  const redFlagCheck = hasRedFlags(text);
  
  const context = classifyByPatterns(text, CONTEXT_PATTERNS, ContextType.SYMPTOM);
  
  let specialty = classifyByPatterns(text, SPECIALTY_PATTERNS, MedicalSpecialty.FAMILY_MEDICINE);

  // If red flags are detected, it's likely an emergency medicine context
  if (redFlagCheck.detected) {
      specialty = MedicalSpecialty.EMERGENCY_MEDICINE;
  }

  return {
    context,
    specialty,
    hasRedFlags: redFlagCheck.detected,
    reason: redFlagCheck.reason,
  };
}
