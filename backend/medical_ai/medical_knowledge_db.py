"""
Comprehensive Medical Knowledge Database for Leny Medical AI System
Contains clinical guidelines, diagnostic criteria, and treatment protocols
"""

# ICD-10 Common Diagnoses by Specialty
ICD10_DIAGNOSES = {
    "cardiology": {
        "I21.9": {"name": "Acute myocardial infarction", "severity": "high"},
        "I50.9": {"name": "Heart failure", "severity": "high"},
        "I48.91": {"name": "Atrial fibrillation", "severity": "medium"},
        "I25.10": {"name": "Coronary artery disease", "severity": "medium"},
        "I10": {"name": "Essential hypertension", "severity": "low"},
        "I20.9": {"name": "Angina pectoris", "severity": "medium"}
    },
    
    "neurology": {
        "G43.909": {"name": "Migraine", "severity": "low"},
        "G40.909": {"name": "Epilepsy", "severity": "high"},
        "I63.9": {"name": "Cerebral infarction", "severity": "high"},
        "G35": {"name": "Multiple sclerosis", "severity": "medium"},
        "G20": {"name": "Parkinson's disease", "severity": "medium"},
        "G93.1": {"name": "Anoxic brain damage", "severity": "high"}
    },
    
    "orthopedics": {
        "M25.511": {"name": "Pain in right shoulder", "severity": "low"},
        "M79.3": {"name": "Panniculitis", "severity": "low"},
        "S72.001A": {"name": "Fracture of femur", "severity": "high"},
        "M17.9": {"name": "Osteoarthritis of knee", "severity": "medium"},
        "M54.5": {"name": "Low back pain", "severity": "low"},
        "M75.30": {"name": "Rotator cuff tear", "severity": "medium"}
    },
    
    "gastroenterology": {
        "K21.9": {"name": "Gastroesophageal reflux disease", "severity": "low"},
        "K57.90": {"name": "Diverticulosis", "severity": "medium"},
        "K25.9": {"name": "Peptic ulcer", "severity": "medium"},
        "K50.90": {"name": "Crohn's disease", "severity": "high"},
        "K92.2": {"name": "Gastrointestinal hemorrhage", "severity": "high"},
        "K35.9": {"name": "Acute appendicitis", "severity": "high"}
    },
    
    "pulmonology": {
        "J44.1": {"name": "COPD with exacerbation", "severity": "high"},
        "J45.9": {"name": "Asthma", "severity": "medium"},
        "J18.9": {"name": "Pneumonia", "severity": "high"},
        "J94.8": {"name": "Pleural effusion", "severity": "medium"},
        "J93.9": {"name": "Pneumothorax", "severity": "high"},
        "J06.9": {"name": "Upper respiratory infection", "severity": "low"}
    },
    
    "endocrinology": {
        "E11.9": {"name": "Type 2 diabetes mellitus", "severity": "medium"},
        "E10.9": {"name": "Type 1 diabetes mellitus", "severity": "medium"},
        "E03.9": {"name": "Hypothyroidism", "severity": "low"},
        "E05.90": {"name": "Hyperthyroidism", "severity": "medium"},
        "E10.10": {"name": "Diabetic ketoacidosis", "severity": "high"},
        "E16.2": {"name": "Hypoglycemia", "severity": "high"}
    },
    
    "psychiatry": {
        "F32.9": {"name": "Major depressive disorder", "severity": "medium"},
        "F41.9": {"name": "Anxiety disorder", "severity": "low"},
        "F20.9": {"name": "Schizophrenia", "severity": "high"},
        "F31.9": {"name": "Bipolar disorder", "severity": "medium"},
        "F43.10": {"name": "PTSD", "severity": "medium"},
        "F10.20": {"name": "Alcohol use disorder", "severity": "medium"}
    }
}

# Clinical Decision Rules
CLINICAL_DECISION_RULES = {
    "chest_pain": {
        "HEART_score": {
            "description": "Risk stratification for chest pain",
            "criteria": [
                "History (slightly suspicious=0, moderately suspicious=1, highly suspicious=2)",
                "ECG (normal=0, non-specific repolarization=1, significant ST deviation=2)",
                "Age (<45=0, 45-64=1, ≥65=2)",
                "Risk factors (no known risk factors=0, 1-2 risk factors=1, ≥3 risk factors=2)",
                "Troponin (≤normal limit=0, 1-3x normal=1, >3x normal=2)"
            ],
            "interpretation": {
                "0-3": "Low risk (2.5% MACE at 6 weeks)",
                "4-6": "Moderate risk (20.3% MACE at 6 weeks)",
                "7-10": "High risk (72.7% MACE at 6 weeks)"
            }
        }
    },
    
    "stroke": {
        "NIHSS": {
            "description": "National Institutes of Health Stroke Scale",
            "criteria": [
                "Level of consciousness",
                "LOC questions",
                "LOC commands",
                "Best gaze",
                "Visual fields",
                "Facial palsy",
                "Motor arm",
                "Motor leg",
                "Limb ataxia",
                "Sensory",
                "Best language",
                "Dysarthria",
                "Extinction and inattention"
            ]
        },
        "FAST": {
            "description": "Face Arms Speech Time - Stroke recognition",
            "criteria": [
                "Face: Facial drooping",
                "Arms: Arm weakness",
                "Speech: Speech difficulties",
                "Time: Time to call emergency services"
            ]
        }
    },
    
    "pulmonary_embolism": {
        "Wells_score": {
            "description": "Clinical probability of pulmonary embolism",
            "criteria": [
                "Clinical signs of DVT (3 points)",
                "PE more likely than alternative diagnosis (3 points)",
                "Heart rate >100 (1.5 points)",
                "Immobilization/surgery in previous 4 weeks (1.5 points)",
                "Previous PE/DVT (1.5 points)",
                "Hemoptysis (1 point)",
                "Malignancy (1 point)"
            ],
            "interpretation": {
                "≤4": "Low probability",
                "4.5-6": "Moderate probability",
                ">6": "High probability"
            }
        }
    }
}

# Drug Interactions Database
DRUG_INTERACTIONS = {
    "warfarin": {
        "major_interactions": [
            "aspirin", "clopidogrel", "heparin", "rivaroxaban",
            "amiodarone", "fluconazole", "metronidazole"
        ],
        "monitoring": "INR every 4-6 weeks when stable"
    },
    
    "metformin": {
        "contraindications": [
            "severe kidney disease (eGFR <30)",
            "acute heart failure",
            "severe liver disease"
        ],
        "monitoring": "Kidney function every 6-12 months"
    },
    
    "digoxin": {
        "major_interactions": [
            "amiodarone", "verapamil", "quinidine", "clarithromycin"
        ],
        "monitoring": "Digoxin level, kidney function, electrolytes"
    }
}

# Laboratory Reference Ranges
LAB_REFERENCE_RANGES = {
    "complete_blood_count": {
        "hemoglobin": {"male": "13.8-17.2 g/dL", "female": "12.1-15.1 g/dL"},
        "hematocrit": {"male": "40.7-50.3%", "female": "36.1-44.3%"},
        "white_blood_cells": "4.8-10.8 x10³/μL",
        "platelets": "150-450 x10³/μL"
    },
    
    "basic_metabolic_panel": {
        "sodium": "136-145 mmol/L",
        "potassium": "3.5-5.1 mmol/L",
        "chloride": "98-107 mmol/L",
        "co2": "22-28 mmol/L",
        "bun": "7-20 mg/dL",
        "creatinine": {"male": "0.74-1.35 mg/dL", "female": "0.59-1.04 mg/dL"},
        "glucose": "70-99 mg/dL (fasting)"
    },
    
    "lipid_panel": {
        "total_cholesterol": "<200 mg/dL (desirable)",
        "ldl_cholesterol": "<100 mg/dL (optimal)",
        "hdl_cholesterol": {"male": ">40 mg/dL", "female": ">50 mg/dL"},
        "triglycerides": "<150 mg/dL"
    },
    
    "liver_function": {
        "alt": "7-56 U/L",
        "ast": "10-40 U/L",
        "alkaline_phosphatase": "44-147 U/L",
        "total_bilirubin": "0.3-1.2 mg/dL",
        "albumin": "3.5-5.0 g/dL"
    }
}

# Emergency Protocols
EMERGENCY_PROTOCOLS = {
    "cardiac_arrest": {
        "algorithm": "ACLS",
        "steps": [
            "Check responsiveness and pulse",
            "Call for help and AED",
            "Begin CPR (30:2 ratio)",
            "Analyze rhythm when AED arrives",
            "Follow ACLS algorithm"
        ],
        "medications": ["epinephrine", "amiodarone", "atropine"]
    },
    
    "anaphylaxis": {
        "first_line": "Epinephrine 0.3-0.5mg IM",
        "supportive_care": [
            "IV fluids for hypotension",
            "Albuterol for bronchospasm",
            "H1 and H2 antihistamines",
            "Corticosteroids"
        ],
        "monitoring": "Biphasic reaction possible 4-12 hours later"
    },
    
    "stroke": {
        "time_windows": {
            "iv_tpa": "4.5 hours from symptom onset",
            "mechanical_thrombectomy": "24 hours (selected patients)"
        },
        "contraindications_tpa": [
            "Recent surgery",
            "Active bleeding",
            "Severe hypertension (>185/110)"
        ]
    }
}

# Preventive Care Guidelines
PREVENTIVE_CARE = {
    "cancer_screening": {
        "breast": {
            "mammography": "Age 50-74 every 2 years (USPSTF)",
            "high_risk": "Consider starting at age 40"
        },
        "cervical": {
            "pap_smear": "Age 21-65 every 3 years",
            "hpv_testing": "Age 30-65 every 5 years (with Pap)"
        },
        "colorectal": {
            "colonoscopy": "Age 45-75 every 10 years",
            "fit_test": "Annual if colonoscopy declined"
        },
        "prostate": {
            "psa": "Discuss with men age 55-69"
        }
    },
    
    "vaccinations": {
        "influenza": "Annual for all ≥6 months",
        "covid19": "Per current CDC recommendations",
        "pneumococcal": "Age ≥65 or high-risk conditions",
        "shingles": "Age ≥50 (Shingrix preferred)",
        "tdap": "Every 10 years"
    }
}

def get_diagnosis_info(specialty: str, icd_code: str = None):
    """Get diagnosis information by specialty and ICD code"""
    if specialty in ICD10_DIAGNOSES:
        if icd_code and icd_code in ICD10_DIAGNOSES[specialty]:
            return ICD10_DIAGNOSES[specialty][icd_code]
        return ICD10_DIAGNOSES[specialty]
    return None

def get_clinical_rule(condition: str):
    """Get clinical decision rule for a condition"""
    return CLINICAL_DECISION_RULES.get(condition)

def check_drug_interactions(drug: str):
    """Check for drug interactions"""
    return DRUG_INTERACTIONS.get(drug.lower())

def get_lab_reference(test: str):
    """Get laboratory reference ranges"""
    return LAB_REFERENCE_RANGES.get(test)

def get_emergency_protocol(condition: str):
    """Get emergency protocol for a condition"""
    return EMERGENCY_PROTOCOLS.get(condition)

def get_preventive_care_guidelines(category: str):
    """Get preventive care guidelines"""
    return PREVENTIVE_CARE.get(category)
