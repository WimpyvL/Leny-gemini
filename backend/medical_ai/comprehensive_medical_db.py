"""
Comprehensive Medical Literature and Specialty Database
Covers ALL medical specialties, subspecialties, and clinical literature
"""

# COMPLETE MEDICAL SPECIALTY COVERAGE
ALL_MEDICAL_SPECIALTIES = {
    # PRIMARY CARE & GENERAL MEDICINE
    "family_medicine": {"board": "ABFM", "training_years": 3},
    "internal_medicine": {"board": "ABIM", "training_years": 3},
    "pediatrics": {"board": "ABP", "training_years": 3},
    "geriatrics": {"board": "ABFM/ABIM", "training_years": 1},
    "adolescent_medicine": {"board": "ABP", "training_years": 1},
    "preventive_medicine": {"board": "ABPM", "training_years": 2},
    
    # EMERGENCY & CRITICAL CARE
    "emergency_medicine": {"board": "ABEM", "training_years": 4},
    "critical_care": {"board": "ABIM/ABA", "training_years": 1},
    "trauma_surgery": {"board": "ABS", "training_years": 1},
    "emergency_medical_services": {"board": "ABEM", "training_years": 1},
    "disaster_medicine": {"board": "ABEM", "training_years": 1},
    "toxicology": {"board": "ABEM/ABIM", "training_years": 2},
    
    # SURGICAL SPECIALTIES
    "general_surgery": {"board": "ABS", "training_years": 5},
    "orthopedic_surgery": {"board": "ABOS", "training_years": 5},
    "neurosurgery": {"board": "ABNS", "training_years": 7},
    "cardiothoracic_surgery": {"board": "ABTS", "training_years": 3},
    "plastic_surgery": {"board": "ABPS", "training_years": 6},
    "urology": {"board": "ABU", "training_years": 5},
    "otolaryngology": {"board": "ABOTO", "training_years": 5},
    "ophthalmology": {"board": "ABO", "training_years": 4},
    "oral_maxillofacial_surgery": {"board": "ABOMS", "training_years": 6},
    "vascular_surgery": {"board": "ABVS", "training_years": 5},
    "pediatric_surgery": {"board": "ABS", "training_years": 2},
    "transplant_surgery": {"board": "ABS", "training_years": 1},
    "hand_surgery": {"board": "ABHS", "training_years": 1},
    "spine_surgery": {"board": "ABOS/ABNS", "training_years": 1},
    
    # MEDICAL SPECIALTIES
    "cardiology": {"board": "ABIM", "training_years": 3},
    "gastroenterology": {"board": "ABIM", "training_years": 3},
    "neurology": {"board": "ABPN", "training_years": 4},
    "pulmonology": {"board": "ABIM", "training_years": 3},
    "nephrology": {"board": "ABIM", "training_years": 2},
    "endocrinology": {"board": "ABIM", "training_years": 2},
    "hematology_oncology": {"board": "ABIM", "training_years": 3},
    "rheumatology": {"board": "ABIM", "training_years": 2},
    "infectious_disease": {"board": "ABIM", "training_years": 2},
    "allergy_immunology": {"board": "ABAI", "training_years": 2},
    "dermatology": {"board": "ABD", "training_years": 4},
    "physical_medicine_rehabilitation": {"board": "ABPMR", "training_years": 4},
    
    # SUBSPECIALTIES - CARDIOLOGY
    "interventional_cardiology": {"board": "ABIM", "training_years": 1},
    "electrophysiology": {"board": "ABIM", "training_years": 1},
    "heart_failure": {"board": "ABIM", "training_years": 1},
    "nuclear_cardiology": {"board": "ABIM", "training_years": 1},
    "echocardiography": {"board": "ABIM", "training_years": 1},
    "cardiac_imaging": {"board": "ABIM", "training_years": 1},
    
    # SUBSPECIALTIES - GASTROENTEROLOGY
    "hepatology": {"board": "ABIM", "training_years": 1},
    "inflammatory_bowel_disease": {"board": "ABIM", "training_years": 1},
    "advanced_endoscopy": {"board": "ABIM", "training_years": 1},
    "transplant_hepatology": {"board": "ABIM", "training_years": 1},
    
    # SUBSPECIALTIES - NEUROLOGY
    "stroke_neurology": {"board": "ABPN", "training_years": 1},
    "epilepsy": {"board": "ABPN", "training_years": 1},
    "movement_disorders": {"board": "ABPN", "training_years": 1},
    "neuromuscular_medicine": {"board": "ABPN", "training_years": 1},
    "neurointensive_care": {"board": "ABPN", "training_years": 1},
    "headache_medicine": {"board": "ABPN", "training_years": 1},
    "behavioral_neurology": {"board": "ABPN", "training_years": 1},
    "neuro_oncology": {"board": "ABPN", "training_years": 1},
    
    # WOMEN'S HEALTH
    "obstetrics_gynecology": {"board": "ABOG", "training_years": 4},
    "maternal_fetal_medicine": {"board": "ABOG", "training_years": 3},
    "reproductive_endocrinology": {"board": "ABOG", "training_years": 3},
    "gynecologic_oncology": {"board": "ABOG", "training_years": 4},
    "urogynecology": {"board": "ABOG", "training_years": 3},
    "pediatric_gynecology": {"board": "ABOG", "training_years": 1},
    
    # MENTAL HEALTH & BEHAVIORAL
    "psychiatry": {"board": "ABPN", "training_years": 4},
    "child_psychiatry": {"board": "ABPN", "training_years": 2},
    "addiction_psychiatry": {"board": "ABPN", "training_years": 1},
    "forensic_psychiatry": {"board": "ABPN", "training_years": 1},
    "geriatric_psychiatry": {"board": "ABPN", "training_years": 1},
    "consultation_liaison_psychiatry": {"board": "ABPN", "training_years": 1},
    "psychology": {"board": "APA", "training_years": 4},
    "neuropsychology": {"board": "ABPP", "training_years": 2},
    
    # PEDIATRIC SUBSPECIALTIES
    "pediatric_cardiology": {"board": "ABP", "training_years": 3},
    "pediatric_critical_care": {"board": "ABP", "training_years": 3},
    "pediatric_emergency_medicine": {"board": "ABP", "training_years": 3},
    "pediatric_endocrinology": {"board": "ABP", "training_years": 3},
    "pediatric_gastroenterology": {"board": "ABP", "training_years": 3},
    "pediatric_hematology_oncology": {"board": "ABP", "training_years": 3},
    "pediatric_infectious_disease": {"board": "ABP", "training_years": 3},
    "pediatric_nephrology": {"board": "ABP", "training_years": 3},
    "pediatric_neurology": {"board": "ABP", "training_years": 3},
    "pediatric_pulmonology": {"board": "ABP", "training_years": 3},
    "pediatric_rheumatology": {"board": "ABP", "training_years": 3},
    "neonatology": {"board": "ABP", "training_years": 3},
    "developmental_pediatrics": {"board": "ABP", "training_years": 3},
    
    # DIAGNOSTIC & IMAGING
    "radiology": {"board": "ABR", "training_years": 4},
    "diagnostic_radiology": {"board": "ABR", "training_years": 4},
    "interventional_radiology": {"board": "ABR", "training_years": 2},
    "neuroradiology": {"board": "ABR", "training_years": 1},
    "musculoskeletal_radiology": {"board": "ABR", "training_years": 1},
    "breast_imaging": {"board": "ABR", "training_years": 1},
    "nuclear_medicine": {"board": "ABNM", "training_years": 2},
    "radiation_oncology": {"board": "ABR", "training_years": 5},
    "pathology": {"board": "ABPath", "training_years": 4},
    "anatomic_pathology": {"board": "ABPath", "training_years": 4},
    "clinical_pathology": {"board": "ABPath", "training_years": 4},
    "forensic_pathology": {"board": "ABPath", "training_years": 1},
    "neuropathology": {"board": "ABPath", "training_years": 1},
    "dermatopathology": {"board": "ABPath", "training_years": 1},
    "cytopathology": {"board": "ABPath", "training_years": 1},
    "molecular_pathology": {"board": "ABPath", "training_years": 1},
    
    # ANESTHESIOLOGY & PERIOPERATIVE
    "anesthesiology": {"board": "ABA", "training_years": 4},
    "cardiac_anesthesiology": {"board": "ABA", "training_years": 1},
    "pediatric_anesthesiology": {"board": "ABA", "training_years": 1},
    "neuroanesthesiology": {"board": "ABA", "training_years": 1},
    "obstetric_anesthesiology": {"board": "ABA", "training_years": 1},
    "pain_management": {"board": "ABA", "training_years": 1},
    "regional_anesthesiology": {"board": "ABA", "training_years": 1},
    
    # SPECIALIZED CARE
    "palliative_care": {"board": "ABIM/ABFM", "training_years": 1},
    "hospice_care": {"board": "ABIM/ABFM", "training_years": 1},
    "sports_medicine": {"board": "ABFM/ABIM", "training_years": 1},
    "occupational_medicine": {"board": "ABPM", "training_years": 2},
    "aerospace_medicine": {"board": "ABPM", "training_years": 2},
    "undersea_medicine": {"board": "ABEM", "training_years": 1},
    "wilderness_medicine": {"board": "ABEM", "training_years": 1},
    "travel_medicine": {"board": "ISTM", "training_years": 1},
    "sleep_medicine": {"board": "ABSM", "training_years": 1},
    "wound_care": {"board": "ABFM", "training_years": 1},
    "hyperbaric_medicine": {"board": "UHMS", "training_years": 1},
    
    # LABORATORY & GENETICS
    "clinical_genetics": {"board": "ABMGG", "training_years": 2},
    "medical_genetics": {"board": "ABMGG", "training_years": 2},
    "genetic_counseling": {"board": "ABGC", "training_years": 2},
    "laboratory_medicine": {"board": "ABPath", "training_years": 1},
    "transfusion_medicine": {"board": "ABPath", "training_years": 1},
    "clinical_informatics": {"board": "ABCI", "training_years": 2},
    
    # PUBLIC HEALTH & ADMINISTRATION
    "public_health": {"board": "NBPHE", "training_years": 2},
    "epidemiology": {"board": "NBPHE", "training_years": 2},
    "biostatistics": {"board": "ASA", "training_years": 4},
    "health_policy": {"board": "ACHE", "training_years": 2},
    "quality_improvement": {"board": "ABQAURP", "training_years": 1},
    "patient_safety": {"board": "ABQAURP", "training_years": 1},
}

# COMPREHENSIVE MEDICAL LITERATURE DATABASES
MEDICAL_LITERATURE_SOURCES = {
    "clinical_guidelines": {
        "american_college_cardiology": "ACC/AHA Guidelines",
        "american_heart_association": "AHA Scientific Statements",
        "infectious_diseases_society": "IDSA Guidelines",
        "american_diabetes_association": "ADA Standards of Care",
        "american_cancer_society": "ACS Screening Guidelines",
        "uspstf": "US Preventive Services Task Force",
        "cdc": "CDC Clinical Guidelines",
        "who": "World Health Organization Guidelines",
        "nice": "NICE Clinical Guidelines (UK)",
        "cochrane": "Cochrane Systematic Reviews",
    },
    
    "medical_journals": {
        "nejm": "New England Journal of Medicine",
        "jama": "Journal of the American Medical Association",
        "lancet": "The Lancet",
        "bmj": "British Medical Journal",
        "annals_internal_medicine": "Annals of Internal Medicine",
        "circulation": "Circulation (Cardiology)",
        "nature_medicine": "Nature Medicine",
        "cell": "Cell (Molecular Medicine)",
        "science": "Science",
        "plos_medicine": "PLOS Medicine",
    },
    
    "specialty_journals": {
        # Cardiology
        "jacc": "Journal of the American College of Cardiology",
        "european_heart_journal": "European Heart Journal",
        "circulation_research": "Circulation Research",
        
        # Neurology
        "neurology": "Neurology",
        "brain": "Brain",
        "stroke": "Stroke",
        "epilepsia": "Epilepsia",
        
        # Oncology
        "journal_clinical_oncology": "Journal of Clinical Oncology",
        "cancer_cell": "Cancer Cell",
        "nature_cancer": "Nature Cancer",
        
        # Infectious Disease
        "clinical_infectious_diseases": "Clinical Infectious Diseases",
        "journal_infectious_diseases": "Journal of Infectious Diseases",
        "antimicrobial_agents": "Antimicrobial Agents and Chemotherapy",
        
        # Surgery
        "annals_surgery": "Annals of Surgery",
        "journal_trauma": "Journal of Trauma",
        "plastic_reconstructive_surgery": "Plastic and Reconstructive Surgery",
    },
    
    "evidence_databases": {
        "pubmed": "PubMed/MEDLINE",
        "embase": "Embase",
        "cochrane_library": "Cochrane Library",
        "uptodate": "UpToDate",
        "dynamed": "DynaMed",
        "clinical_key": "ClinicalKey",
        "bmj_best_practice": "BMJ Best Practice",
        "lexicomp": "Lexicomp Drug Information",
        "micromedex": "Micromedex",
    }
}

# COMPREHENSIVE CLINICAL DECISION TOOLS
CLINICAL_DECISION_TOOLS = {
    "cardiovascular": {
        "framingham_risk": "10-year cardiovascular risk",
        "ascvd_risk": "Atherosclerotic cardiovascular disease risk",
        "heart_score": "Chest pain risk stratification",
        "timi_risk": "TIMI risk score for ACS",
        "grace_score": "Global Registry of Acute Coronary Events",
        "cha2ds2_vasc": "Stroke risk in atrial fibrillation",
        "hasbled": "Bleeding risk on anticoagulation",
        "wells_dvt": "Deep vein thrombosis probability",
        "wells_pe": "Pulmonary embolism probability",
        "geneva_score": "Pulmonary embolism probability",
    },
    
    "neurology": {
        "nihss": "National Institutes of Health Stroke Scale",
        "glasgow_coma": "Glasgow Coma Scale",
        "hunt_hess": "Subarachnoid hemorrhage severity",
        "fisher_scale": "Subarachnoid hemorrhage grading",
        "rankin_scale": "Modified Rankin Scale",
        "mmse": "Mini-Mental State Examination",
        "moca": "Montreal Cognitive Assessment",
        "abcd2": "Stroke risk after TIA",
    },
    
    "emergency_medicine": {
        "apache_ii": "Acute Physiology and Chronic Health Evaluation",
        "sofa": "Sequential Organ Failure Assessment",
        "qsofa": "Quick SOFA",
        "sirs": "Systemic Inflammatory Response Syndrome",
        "sepsis_3": "Sepsis-3 Criteria",
        "curb65": "Pneumonia severity",
        "psi": "Pneumonia Severity Index",
        "ottawa_ankle": "Ankle fracture rules",
        "ottawa_knee": "Knee fracture rules",
        "canadian_c_spine": "Cervical spine imaging",
        "nexus": "National Emergency X-Radiography Utilization Study",
    },
    
    "gastroenterology": {
        "child_pugh": "Liver disease severity",
        "meld": "Model for End-Stage Liver Disease",
        "glasgow_blatchford": "Upper GI bleeding risk",
        "rockall_score": "Upper GI bleeding mortality",
        "ranson_criteria": "Pancreatitis severity",
        "atlanta_classification": "Pancreatitis severity",
        "rome_iv": "Functional GI disorders",
    },
    
    "pulmonology": {
        "gold_copd": "COPD severity classification",
        "bode_index": "COPD prognosis",
        "asthma_control": "Asthma Control Test",
        "light_criteria": "Pleural effusion classification",
        "pesi": "Pulmonary Embolism Severity Index",
    },
    
    "nephrology": {
        "ckd_epi": "Chronic Kidney Disease Epidemiology",
        "mdrd": "Modification of Diet in Renal Disease",
        "rifle": "Risk, Injury, Failure, Loss, End-stage",
        "akin": "Acute Kidney Injury Network",
        "kdigo": "Kidney Disease: Improving Global Outcomes",
    },
    
    "oncology": {
        "tnm_staging": "Tumor, Node, Metastasis staging",
        "ecog_performance": "Eastern Cooperative Oncology Group",
        "karnofsky": "Karnofsky Performance Status",
        "breslow_thickness": "Melanoma staging",
        "gleason_score": "Prostate cancer grading",
    }
}

# COMPREHENSIVE DRUG DATABASE
COMPREHENSIVE_DRUG_DATABASE = {
    "drug_classes": {
        "ace_inhibitors": ["lisinopril", "enalapril", "captopril", "ramipril"],
        "arbs": ["losartan", "valsartan", "irbesartan", "olmesartan"],
        "beta_blockers": ["metoprolol", "atenolol", "propranolol", "carvedilol"],
        "calcium_channel_blockers": ["amlodipine", "nifedipine", "diltiazem", "verapamil"],
        "diuretics": ["hydrochlorothiazide", "furosemide", "spironolactone", "chlorthalidone"],
        "statins": ["atorvastatin", "simvastatin", "rosuvastatin", "pravastatin"],
        "anticoagulants": ["warfarin", "rivaroxaban", "apixaban", "dabigatran"],
        "antiplatelets": ["aspirin", "clopidogrel", "prasugrel", "ticagrelor"],
        "antibiotics": ["amoxicillin", "azithromycin", "ciprofloxacin", "doxycycline"],
        "antidiabetics": ["metformin", "insulin", "glipizide", "sitagliptin"],
        "antidepressants": ["sertraline", "fluoxetine", "escitalopram", "bupropion"],
        "antipsychotics": ["risperidone", "quetiapine", "olanzapine", "aripiprazole"],
        "anticonvulsants": ["phenytoin", "carbamazepine", "valproic acid", "levetiracetam"],
        "opioids": ["morphine", "oxycodone", "fentanyl", "tramadol"],
        "nsaids": ["ibuprofen", "naproxen", "celecoxib", "diclofenac"],
    },
    
    "drug_interactions": {
        "major_interactions": {
            "warfarin": ["aspirin", "amiodarone", "fluconazole", "metronidazole"],
            "digoxin": ["amiodarone", "verapamil", "quinidine", "clarithromycin"],
            "phenytoin": ["warfarin", "carbamazepine", "valproic acid", "isoniazid"],
            "lithium": ["ace_inhibitors", "nsaids", "thiazides", "metronidazole"],
        },
        
        "contraindications": {
            "metformin": ["severe_kidney_disease", "acute_heart_failure", "severe_liver_disease"],
            "ace_inhibitors": ["pregnancy", "bilateral_renal_artery_stenosis", "hyperkalemia"],
            "beta_blockers": ["severe_asthma", "heart_block", "severe_bradycardia"],
            "nsaids": ["severe_kidney_disease", "heart_failure", "peptic_ulcer_disease"],
        }
    }
}

# COMPREHENSIVE LAB VALUES AND REFERENCE RANGES
COMPREHENSIVE_LAB_DATABASE = {
    "hematology": {
        "complete_blood_count": {
            "hemoglobin": {"male": "13.8-17.2 g/dL", "female": "12.1-15.1 g/dL"},
            "hematocrit": {"male": "40.7-50.3%", "female": "36.1-44.3%"},
            "rbc": {"male": "4.7-6.1 M/μL", "female": "4.2-5.4 M/μL"},
            "wbc": "4.8-10.8 K/μL",
            "platelets": "150-450 K/μL",
            "mcv": "80-100 fL",
            "mch": "27-31 pg",
            "mchc": "32-36 g/dL",
            "rdw": "11.5-14.5%",
        },
        
        "coagulation": {
            "pt": "11-13 seconds",
            "inr": "0.8-1.1",
            "ptt": "25-35 seconds",
            "fibrinogen": "200-400 mg/dL",
            "d_dimer": "<0.5 mg/L",
        }
    },
    
    "chemistry": {
        "basic_metabolic_panel": {
            "sodium": "136-145 mmol/L",
            "potassium": "3.5-5.1 mmol/L",
            "chloride": "98-107 mmol/L",
            "co2": "22-28 mmol/L",
            "bun": "7-20 mg/dL",
            "creatinine": {"male": "0.74-1.35 mg/dL", "female": "0.59-1.04 mg/dL"},
            "glucose": "70-99 mg/dL (fasting)",
            "calcium": "8.5-10.5 mg/dL",
        },
        
        "liver_function": {
            "alt": "7-56 U/L",
            "ast": "10-40 U/L",
            "alkaline_phosphatase": "44-147 U/L",
            "total_bilirubin": "0.3-1.2 mg/dL",
            "direct_bilirubin": "0.0-0.3 mg/dL",
            "albumin": "3.5-5.0 g/dL",
            "total_protein": "6.0-8.3 g/dL",
        },
        
        "lipid_panel": {
            "total_cholesterol": "<200 mg/dL (desirable)",
            "ldl_cholesterol": "<100 mg/dL (optimal)",
            "hdl_cholesterol": {"male": ">40 mg/dL", "female": ">50 mg/dL"},
            "triglycerides": "<150 mg/dL",
            "non_hdl_cholesterol": "<130 mg/dL",
        }
    },
    
    "endocrinology": {
        "diabetes": {
            "hba1c": "<5.7% (normal), 5.7-6.4% (prediabetes), ≥6.5% (diabetes)",
            "fasting_glucose": "70-99 mg/dL (normal)",
            "random_glucose": "<200 mg/dL (normal)",
            "ogtt_2hr": "<140 mg/dL (normal)",
            "c_peptide": "0.8-3.1 ng/mL",
        },
        
        "thyroid": {
            "tsh": "0.4-4.0 mIU/L",
            "free_t4": "0.8-1.8 ng/dL",
            "free_t3": "2.3-4.2 pg/mL",
            "total_t4": "4.5-12.0 μg/dL",
            "total_t3": "80-200 ng/dL",
            "thyroglobulin": "<55 ng/mL",
            "anti_tpo": "<35 IU/mL",
            "anti_thyroglobulin": "<40 IU/mL",
        }
    },
    
    "cardiology": {
        "cardiac_markers": {
            "troponin_i": "<0.04 ng/mL",
            "troponin_t": "<0.01 ng/mL",
            "ck_mb": "0-6.3 ng/mL",
            "bnp": "<100 pg/mL",
            "nt_probnp": {"<50 years": "<125 pg/mL", "50-75 years": "<450 pg/mL", ">75 years": "<900 pg/mL"},
            "myoglobin": "25-72 ng/mL",
        }
    },
    
    "immunology": {
        "autoimmune_markers": {
            "ana": "<1:80 (negative)",
            "anti_dsdna": "<30 IU/mL",
            "anti_sm": "<20 U/mL",
            "anti_rnp": "<20 U/mL",
            "anti_ro_ssa": "<20 U/mL",
            "anti_la_ssb": "<20 U/mL",
            "anti_scl70": "<20 U/mL",
            "anti_centromere": "<20 U/mL",
            "rheumatoid_factor": "<14 IU/mL",
            "anti_ccp": "<20 U/mL",
            "c3": "90-180 mg/dL",
            "c4": "10-40 mg/dL",
        }
    }
}

def get_all_specialties():
    """Return all medical specialties with their details"""
    return ALL_MEDICAL_SPECIALTIES

def get_literature_sources():
    """Return comprehensive medical literature sources"""
    return MEDICAL_LITERATURE_SOURCES

def get_clinical_tools():
    """Return all clinical decision tools"""
    return CLINICAL_DECISION_TOOLS

def get_drug_database():
    """Return comprehensive drug database"""
    return COMPREHENSIVE_DRUG_DATABASE

def get_lab_database():
    """Return comprehensive laboratory database"""
    return COMPREHENSIVE_LAB_DATABASE

def search_specialty(query: str):
    """Search for specialties based on query"""
    query_lower = query.lower()
    matches = []
    
    for specialty, details in ALL_MEDICAL_SPECIALTIES.items():
        if query_lower in specialty.lower():
            matches.append({
                "specialty": specialty,
                "board": details["board"],
                "training_years": details["training_years"]
            })
    
    return matches

def get_specialty_count():
    """Return total number of medical specialties covered"""
    return len(ALL_MEDICAL_SPECIALTIES)

def get_literature_count():
    """Return total number of literature sources"""
    total = 0
    for category in MEDICAL_LITERATURE_SOURCES.values():
        total += len(category)
    return total
