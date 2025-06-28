"""
Context Classification Module for Leny Medical AI System
Classifies user queries into medical context types
"""
import re
from typing import Tuple
from models import ContextType, MedicalSpecialty

class ContextClassifier:
    def __init__(self):
        # Regex patterns for context classification
        self.patterns = {
            ContextType.SYMPTOM: [
                r'\b(pain|hurt|ache|sore)\b',
                r'\b(feel|feeling)\s+(dizzy|nauseous|tired|weak)\b',
                r'\b(have|having)\s+(headache|fever|cough|rash)\b',
                r'\b(my|i)\s+\w+\s+(hurts?|aches?|pains?)\b'
            ],
            ContextType.DIAGNOSIS: [
                r'\b(diagnosed with|have|told i have)\b',
                r'\b(condition|disease|disorder)\b',
                r'\b(diabetes|hypertension|arthritis|asthma)\b'
            ],
            ContextType.MEDICATION: [
                r'\b(taking|prescribed|medication|drug|pill)\b',
                r'\b(side effects?|adverse)\b',
                r'\b(metformin|lisinopril|ibuprofen|aspirin)\b'
            ],
            ContextType.TEST_RESULT: [
                r'\b(test|lab|blood work|mri|ct|x-ray|ultrasound)\b',
                r'\b(results?|showed|found)\b',
                r'\b(elevated|high|low|abnormal|normal)\b'
            ],
            ContextType.TRIAGE: [
                r'\b(should i|do i need to)\s+(go to|see|visit)\b',
                r'\b(emergency|urgent|er|hospital)\b',
                r'\b(serious|worried|concerned)\b'
            ],
            ContextType.TREATMENT_PLAN: [
                r'\b(how to treat|treatment|therapy)\b',
                r'\b(what should i do|next steps)\b',
                r'\b(manage|management)\b'
            ]
        }
        
        # Specialty routing patterns
        self.specialty_patterns = {
            MedicalSpecialty.ORTHOPEDICS: [
                r'\b(knee|ankle|shoulder|hip|back|joint|bone|fracture)\b',
                r'\b(sprain|strain|torn|injury)\b'
            ],
            MedicalSpecialty.CARDIOLOGY: [
                r'\b(chest pain|heart|palpitation|blood pressure)\b',
                r'\b(cardiac|cardiovascular)\b'
            ],
            MedicalSpecialty.GASTROENTEROLOGY: [
                r'\b(stomach|abdominal|nausea|vomit|diarrhea|constipation)\b',
                r'\b(digestive|bowel|gi)\b'
            ],
            MedicalSpecialty.NEUROLOGY: [
                r'\b(headache|migraine|dizzy|seizure|numbness|weakness)\b',
                r'\b(neurologic|brain|nerve)\b'
            ]
        }

    def classify_context(self, text: str) -> ContextType:
        """Classify the context type of a medical query"""
        text_lower = text.lower()
        
        # Score each context type
        scores = {}
        for context_type, patterns in self.patterns.items():
            score = 0
            for pattern in patterns:
                matches = len(re.findall(pattern, text_lower))
                score += matches
            scores[context_type] = score
        
        # Return highest scoring context type, default to symptom
        if max(scores.values()) == 0:
            return ContextType.SYMPTOM
        
        return max(scores, key=scores.get)

    def classify_specialty(self, text: str) -> MedicalSpecialty:
        """Classify the medical specialty most relevant to the query"""
        text_lower = text.lower()
        
        # Score each specialty
        scores = {}
        for specialty, patterns in self.specialty_patterns.items():
            score = 0
            for pattern in patterns:
                matches = len(re.findall(pattern, text_lower))
                score += matches
            scores[specialty] = score
        
        # Return highest scoring specialty, default to internal medicine
        if max(scores.values()) == 0:
            return MedicalSpecialty.INTERNAL_MEDICINE
        
        return max(scores, key=scores.get)

    def classify_query(self, text: str) -> Tuple[ContextType, MedicalSpecialty]:
        """Classify both context and specialty for a query"""
        context = self.classify_context(text)
        specialty = self.classify_specialty(text)
        return context, specialty

    def has_red_flags(self, text: str) -> bool:
        """Check if query contains red flag keywords requiring escalation"""
        from config import ALL_RED_FLAGS
        
        text_lower = text.lower()
        for red_flag in ALL_RED_FLAGS:
            if red_flag.lower() in text_lower:
                return True
        return False
