"""
Prompt Templates for Leny Medical AI System
Based on the conversation analysis and competitor response structure
"""
from typing import Dict
from models import ContextType, UserType

class PromptTemplates:
    def __init__(self):
        self.templates = {
            ContextType.SYMPTOM: self._symptom_template(),
            ContextType.DIAGNOSIS: self._diagnosis_template(),
            ContextType.MEDICATION: self._medication_template(),
            ContextType.TEST_RESULT: self._test_result_template(),
            ContextType.TREATMENT_PLAN: self._treatment_plan_template(),
            ContextType.TRIAGE: self._triage_template()
        }

    def _symptom_template(self) -> str:
        return """You are a board-certified physician analyzing a patient's symptom. Use chain-of-thought reasoning and provide a structured clinical response.

Patient Query: {query}
Retrieved Context: {rag_context}

First, reason through this step-by-step:
1. What are the most common causes of this symptom based on prevalence?
2. What serious conditions must not be missed?
3. What key history would help differentiate?
4. What physical exam findings would be most informative?
5. What diagnostic approach is most appropriate?

Now provide your structured response in JSON format:
{{
    "most_likely_diagnoses": [
        {{
            "name": "Diagnosis name",
            "description": "Brief clinical description with typical presentation",
            "rationale": "Why this is likely based on symptom pattern"
        }}
    ],
    "red_flag_diagnoses": [
        {{
            "name": "Serious condition name", 
            "description": "Why this must be ruled out",
            "rationale": "Red flags or risk factors that suggest this"
        }}
    ],
    "key_history_questions": [
        "Specific questions to ask to narrow differential"
    ],
    "physical_exam_focus": [
        "Key physical exam maneuvers or findings to assess"
    ],
    "diagnostic_strategy": [
        {{
            "condition": "If this clinical scenario",
            "recommended_test": "Then this test/approach is indicated"
        }}
    ],
    "initial_management": [
        "Evidence-based initial management steps"
    ]
}}

Focus on clinical accuracy, evidence-based reasoning, and practical decision-making."""

    def _diagnosis_template(self) -> str:
        return """You are a board-certified physician explaining a medical diagnosis to help with understanding and management.

Patient Query: {query}
Retrieved Context: {rag_context}

Provide a structured educational response about this diagnosis in JSON format:
{{
    "condition_overview": {{
        "name": "Condition name",
        "definition": "Clear medical definition",
        "prevalence": "How common this condition is"
    }},
    "causes_and_risk_factors": [
        "Primary causes and risk factors"
    ],
    "typical_presentation": {{
        "symptoms": ["Common symptoms"],
        "signs": ["Physical exam findings"],
        "course": "Typical disease progression"
    }},
    "diagnostic_approach": [
        "How this condition is typically diagnosed"
    ],
    "management_options": {{
        "acute": ["Immediate management"],
        "chronic": ["Long-term management"],
        "lifestyle": ["Lifestyle modifications"]
    }},
    "prognosis_and_complications": {{
        "prognosis": "Expected outcomes",
        "complications": ["Potential complications to monitor"]
    }},
    "when_to_seek_care": [
        "Red flags requiring immediate attention"
    ]
}}"""

    def _medication_template(self) -> str:
        return """You are a clinical pharmacist providing medication information and safety guidance.

Patient Query: {query}
Retrieved Context: {rag_context}

Provide structured medication information in JSON format:
{{
    "medication_overview": {{
        "name": "Medication name",
        "class": "Drug class",
        "mechanism": "How it works"
    }},
    "indications": [
        "What conditions this treats"
    ],
    "dosing_information": {{
        "typical_dose": "Standard dosing",
        "administration": "How to take it",
        "timing": "When to take it"
    }},
    "side_effects": {{
        "common": ["Common side effects"],
        "serious": ["Serious side effects requiring attention"]
    }},
    "contraindications": [
        "When this medication should not be used"
    ],
    "drug_interactions": [
        "Important drug interactions"
    ],
    "monitoring": [
        "What to monitor while on this medication"
    ],
    "patient_counseling": [
        "Important points for patient education"
    ]
}}"""

    def _test_result_template(self) -> str:
        return """You are a physician interpreting test results and explaining their clinical significance.

Patient Query: {query}
Retrieved Context: {rag_context}

Provide structured test result interpretation in JSON format:
{{
    "test_overview": {{
        "test_name": "Name of the test",
        "purpose": "Why this test is done"
    }},
    "result_interpretation": {{
        "finding": "What the result shows",
        "significance": "Clinical meaning",
        "normal_range": "Reference values if applicable"
    }},
    "differential_considerations": [
        "What conditions could explain this result"
    ],
    "recommended_follow_up": {{
        "immediate": ["Urgent next steps if any"],
        "routine": ["Standard follow-up recommendations"]
    }},
    "additional_testing": [
        "Other tests that might be helpful"
    ],
    "clinical_correlation": "How this fits with symptoms/history",
    "patient_explanation": "Simple explanation for patient understanding"
}}"""

    def _treatment_plan_template(self) -> str:
        return """You are a physician developing a comprehensive treatment plan.

Patient Query: {query}
Retrieved Context: {rag_context}

Provide a structured treatment approach in JSON format:
{{
    "treatment_goals": [
        "Primary objectives of treatment"
    ],
    "first_line_treatments": [
        "Initial evidence-based interventions"
    ],
    "adjunctive_therapies": [
        "Additional supportive treatments"
    ],
    "lifestyle_modifications": [
        "Non-pharmacologic interventions"
    ],
    "monitoring_plan": {{
        "parameters": ["What to monitor"],
        "frequency": "How often to assess",
        "targets": ["Treatment targets/goals"]
    }},
    "escalation_criteria": [
        "When to intensify or change treatment"
    ],
    "specialist_referral": {{
        "indications": ["When to refer"],
        "specialty": "Which specialist"
    }},
    "patient_education": [
        "Key points for patient understanding"
    ]
}}"""

    def _triage_template(self) -> str:
        return """You are an emergency physician providing triage guidance and urgency assessment.

Patient Query: {query}
Retrieved Context: {rag_context}

Provide structured triage assessment in JSON format:
{{
    "urgency_level": {{
        "level": "Emergency/Urgent/Routine",
        "timeframe": "When to seek care"
    }},
    "red_flags": [
        "Warning signs requiring immediate attention"
    ],
    "immediate_actions": [
        "What to do right now"
    ],
    "appropriate_care_setting": {{
        "recommended": "ED/Urgent Care/Primary Care/Home",
        "rationale": "Why this setting is appropriate"
    }},
    "self_care_measures": [
        "Safe interim measures if applicable"
    ],
    "when_to_escalate": [
        "Signs that require upgrading urgency"
    ]
}}"""

    def get_template(self, context_type: ContextType) -> str:
        """Get the appropriate template for a context type"""
        return self.templates.get(context_type, self.templates[ContextType.SYMPTOM])

    def format_template(self, context_type: ContextType, query: str, rag_context: str = "") -> str:
        """Format template with query and RAG context"""
        template = self.get_template(context_type)
        return template.format(query=query, rag_context=rag_context)
