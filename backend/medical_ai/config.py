"""
Configuration settings for Leny Medical AI System
"""
import os
from typing import Dict, List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # MedGemma Model Configuration
    PRIMARY_MODEL: str = "google/medgemma-4b-it"  # MedGemma 4B-IT model
    MEDGEMMA_MODEL_PATH: str = "./models/medgemma"  # Local model cache path
    MEDGEMMA_DEVICE: str = "cuda"  # cuda or cpu
    MEDGEMMA_MAX_TOKENS: int = 1024
    MEDGEMMA_TEMPERATURE: float = 0.1
    
    # Fallback Model Configuration
    FALLBACK_MODEL: str = "gpt-4"  # OpenAI fallback for emergencies
    OPENAI_API_KEY: str = ""  # OpenAI API key for fallback
    
    # RAG Configuration (Professional Mode)
    RAG_ENABLED: bool = True  # Enable RAG for professional users
    VECTOR_DB_PATH: str = "./data/vector_db"
    LITERATURE_DB_PATH: str = "./data/medical_literature"
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    
    # Medical Literature API Keys
    UPTODATE_API_KEY: str = ""  # UpToDate license key
    PUBMED_API_KEY: str = ""  # PubMed API key
    
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    
    # Response Mode Configuration
    CONSUMER_MODE_FAST: bool = True  # Use direct MedGemma for consumers
    PROFESSIONAL_RAG_REQUIRED: bool = True  # Require RAG for professionals
    
    # Escalation Thresholds
    CONFIDENCE_THRESHOLD: float = 0.7
    RED_FLAG_ESCALATION: bool = True
    
    # Performance Configuration
    MAX_CONCURRENT_REQUESTS: int = 10
    REQUEST_TIMEOUT: int = 30
    RESPONSE_CACHE_TTL: int = 3600  # 1 hour cache for repeated queries
    
    model_config = {"env_file": ".env", "extra": "ignore"}

# Context Types for Classification
CONTEXT_TYPES = [
    "symptom",
    "diagnosis", 
    "medication",
    "test_result",
    "treatment_plan",
    "triage",
    "follow_up",
    "logistics",
    "other"
]

# Medical Specialties for Agent Routing
MEDICAL_SPECIALTIES = [
    "orthopedics",
    "cardiology", 
    "gastroenterology",
    "neurology",
    "rheumatology",
    "infectious_disease",
    "emergency_medicine",
    "internal_medicine",
    "family_medicine"
]

# Red Flag Keywords for Escalation - Comprehensive Emergency Indicators
RED_FLAG_KEYWORDS = {
    # Cardiovascular Emergencies
    "cardiovascular": [
        "chest pain", "crushing chest pain", "chest pressure", "heart attack",
        "cardiac arrest", "palpitations with chest pain", "syncope", "fainting",
        "severe shortness of breath", "pulmonary edema", "cyanosis", "blue lips"
    ],
    
    # Neurological Emergencies
    "neurological": [
        "severe headache", "worst headache of life", "thunderclap headache",
        "loss of consciousness", "unconscious", "coma", "seizure", "convulsions",
        "sudden weakness", "paralysis", "stroke symptoms", "facial drooping",
        "slurred speech", "confusion", "altered mental status", "vision loss",
        "double vision", "severe dizziness", "vertigo with neurological signs"
    ],
    
    # Respiratory Emergencies
    "respiratory": [
        "difficulty breathing", "shortness of breath", "can't breathe",
        "respiratory distress", "wheezing", "stridor", "choking",
        "pneumothorax", "collapsed lung", "severe asthma attack"
    ],
    
    # Gastrointestinal Emergencies
    "gastrointestinal": [
        "severe abdominal pain", "appendicitis", "bowel obstruction",
        "severe vomiting", "hematemesis", "vomiting blood", "melena",
        "bright red blood in stool", "severe diarrhea", "dehydration"
    ],
    
    # Infectious Disease Emergencies
    "infectious": [
        "fever with rash", "meningitis", "sepsis", "high fever",
        "fever over 104", "fever with stiff neck", "petechial rash",
        "severe infection", "cellulitis", "necrotizing fasciitis"
    ],
    
    # Trauma & Bleeding
    "trauma": [
        "severe bleeding", "hemorrhage", "major trauma", "head injury",
        "spinal injury", "fracture", "dislocation", "severe burns",
        "penetrating wound", "gunshot", "stab wound"
    ],
    
    # Obstetric Emergencies
    "obstetric": [
        "pregnancy complications", "severe bleeding in pregnancy",
        "preeclampsia", "eclampsia", "placental abruption",
        "ectopic pregnancy", "miscarriage with heavy bleeding"
    ],
    
    # Psychiatric Emergencies
    "psychiatric": [
        "suicidal thoughts", "suicide attempt", "homicidal thoughts",
        "psychosis", "severe depression", "manic episode",
        "substance overdose", "drug overdose", "alcohol poisoning"
    ],
    
    # Pediatric Emergencies
    "pediatric": [
        "infant fever", "febrile seizure", "difficulty breathing in child",
        "severe dehydration", "failure to thrive", "child abuse",
        "ingestion", "poisoning"
    ],
    
    # Endocrine Emergencies
    "endocrine": [
        "diabetic ketoacidosis", "severe hypoglycemia", "thyroid storm",
        "adrenal crisis", "severe hyperglycemia"
    ]
}

# Flatten for easy searching
ALL_RED_FLAGS = []
for category, keywords in RED_FLAG_KEYWORDS.items():
    ALL_RED_FLAGS.extend(keywords)

settings = Settings()
