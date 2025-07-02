"""
Data models for Leny Medical AI System
"""
from typing import List, Dict, Optional, Any
from pydantic import BaseModel
from enum import Enum

class ContextType(str, Enum):
    SYMPTOM = "symptom"
    DIAGNOSIS = "diagnosis"
    MEDICATION = "medication"
    TEST_RESULT = "test_result"
    TREATMENT_PLAN = "treatment_plan"
    TRIAGE = "triage"
    FOLLOW_UP = "follow_up"
    LOGISTICS = "logistics"
    OTHER = "other"

class UserType(str, Enum):
    PATIENT = "patient"
    PROVIDER = "provider"

class MedicalSpecialty(str, Enum):
    # Primary Care
    FAMILY_MEDICINE = "family_medicine"
    INTERNAL_MEDICINE = "internal_medicine"
    PEDIATRICS = "pediatrics"
    GERIATRICS = "geriatrics"
    
    # Emergency & Critical Care
    EMERGENCY_MEDICINE = "emergency_medicine"
    CRITICAL_CARE = "critical_care"
    TRAUMA_SURGERY = "trauma_surgery"
    
    # Surgical Specialties
    GENERAL_SURGERY = "general_surgery"
    ORTHOPEDICS = "orthopedics"
    NEUROSURGERY = "neurosurgery"
    CARDIOTHORACIC_SURGERY = "cardiothoracic_surgery"
    PLASTIC_SURGERY = "plastic_surgery"
    UROLOGY = "urology"
    
    # Medical Specialties
    CARDIOLOGY = "cardiology"
    GASTROENTEROLOGY = "gastroenterology"
    NEUROLOGY = "neurology"
    PULMONOLOGY = "pulmonology"
    NEPHROLOGY = "nephrology"
    ENDOCRINOLOGY = "endocrinology"
    HEMATOLOGY_ONCOLOGY = "hematology_oncology"
    RHEUMATOLOGY = "rheumatology"
    INFECTIOUS_DISEASE = "infectious_disease"
    ALLERGY_IMMUNOLOGY = "allergy_immunology"
    
    # Women's Health
    OBSTETRICS_GYNECOLOGY = "obstetrics_gynecology"
    MATERNAL_FETAL_MEDICINE = "maternal_fetal_medicine"
    
    # Mental Health
    PSYCHIATRY = "psychiatry"
    PSYCHOLOGY = "psychology"
    ADDICTION_MEDICINE = "addiction_medicine"
    
    # Diagnostic & Imaging
    RADIOLOGY = "radiology"
    PATHOLOGY = "pathology"
    NUCLEAR_MEDICINE = "nuclear_medicine"
    
    # Specialized Care
    DERMATOLOGY = "dermatology"
    OPHTHALMOLOGY = "ophthalmology"
    OTOLARYNGOLOGY = "otolaryngology"
    ANESTHESIOLOGY = "anesthesiology"
    PAIN_MANAGEMENT = "pain_management"
    PALLIATIVE_CARE = "palliative_care"
    SPORTS_MEDICINE = "sports_medicine"
    OCCUPATIONAL_MEDICINE = "occupational_medicine"

class QueryInput(BaseModel):
    text: str
    user_type: UserType = UserType.PATIENT
    context_hint: Optional[ContextType] = None
    specialty_hint: Optional[MedicalSpecialty] = None

class Diagnosis(BaseModel):
    name: str
    description: str
    rationale: str
    confidence: Optional[float] = None

class ClinicalResponse(BaseModel):
    context_type: ContextType
    specialty: MedicalSpecialty
    most_likely_diagnoses: List[Diagnosis]
    red_flag_diagnoses: List[Diagnosis]
    key_history_questions: List[str]
    physical_exam_focus: List[str]
    diagnostic_strategy: List[Dict[str, str]]
    initial_management: List[str]
    escalation_needed: bool = False
    confidence_score: Optional[float] = None

class FormattedResponse(BaseModel):
    original_query: str
    user_type: UserType
    specialty: MedicalSpecialty
    content: str
    metadata: Dict[str, Any]
    escalation_triggered: bool = False
    sources: List[str] = []

class AgentConfig(BaseModel):
    specialty: MedicalSpecialty
    prioritize_keywords: List[str]
    deprioritize_keywords: List[str]
    add_tests: List[Dict[str, str]] = []
    emphasis_areas: List[str] = []
