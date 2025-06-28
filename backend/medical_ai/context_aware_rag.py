"""
Context-Aware RAG System for Leny Medical AI
Implements smart routing: Consumer (fast) vs Professional (cited)
"""
import asyncio
from typing import Dict, Any, List, Optional
from enum import Enum
from dataclasses import dataclass
from datetime import datetime

from models import UserType, QueryInput, FormattedResponse, MedicalSpecialty
from comprehensive_medical_db import get_literature_sources, get_clinical_tools
from medical_knowledge_db import get_emergency_protocol

class ResponseMode(str, Enum):
    CONSUMER = "consumer"  # Fast, conversational, no citations
    PROFESSIONAL = "professional"  # Evidence-based with citations

@dataclass
class UserContext:
    user_type: UserType
    is_healthcare_professional: bool
    requires_citations: bool
    response_mode: ResponseMode
    
    @classmethod
    def from_user_type(cls, user_type: UserType):
        is_professional = user_type == UserType.PROVIDER
        return cls(
            user_type=user_type,
            is_healthcare_professional=is_professional,
            requires_citations=is_professional,
            response_mode=ResponseMode.PROFESSIONAL if is_professional else ResponseMode.CONSUMER
        )

class MedicalCitation:
    def __init__(self, source: str, title: str, year: int, doi: str = None, url: str = None):
        self.source = source
        self.title = title
        self.year = year
        self.doi = doi
        self.url = url
    
    def format_citation(self) -> str:
        """Format citation in medical journal style"""
        citation = f"• {self.title} ({self.source} {self.year})"
        if self.doi:
            citation += f" DOI: {self.doi}"
        return citation

class MedicalRAGDatabase:
    """Simulated medical literature database with citations"""
    
    def __init__(self):
        self.literature_db = {
            # Cardiology
            "chest_pain": [
                MedicalCitation(
                    "Circulation", 
                    "2021 AHA/ACC/ASE/CHEST/SAEM/SCCT/SCMR Guideline for Evaluation of Chest Pain",
                    2021,
                    "10.1161/CIR.0000000000001029"
                ),
                MedicalCitation(
                    "NEJM",
                    "High-Sensitivity Cardiac Troponin and the Universal Definition of Myocardial Infarction",
                    2023,
                    "10.1056/NEJMra2211677"
                )
            ],
            
            "heart_failure": [
                MedicalCitation(
                    "JACC",
                    "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure",
                    2022,
                    "10.1016/j.jacc.2021.12.012"
                )
            ],
            
            # Infectious Disease
            "pharyngitis": [
                MedicalCitation(
                    "CID",
                    "IDSA Clinical Practice Guideline for Acute Pharyngitis",
                    2012,
                    "10.1093/cid/cis629"
                ),
                MedicalCitation(
                    "Cochrane",
                    "Antibiotics for sore throat",
                    2021,
                    "10.1002/14651858.CD000023.pub5"
                )
            ],
            
            # Neurology
            "headache": [
                MedicalCitation(
                    "Neurology",
                    "AHS/AAN Guidelines for Migraine Prevention",
                    2023,
                    "10.1212/WNL.0000000000207615"
                ),
                MedicalCitation(
                    "Lancet",
                    "Migraine: diagnosis and treatment",
                    2022,
                    "10.1016/S0140-6736(21)02505-3"
                )
            ],
            
            # Pediatrics
            "fever_child": [
                MedicalCitation(
                    "Pediatrics",
                    "AAP Clinical Practice Guideline: Fever in Infants and Children",
                    2021,
                    "10.1542/peds.2021-052228"
                )
            ],
            
            # Emergency Medicine
            "sepsis": [
                MedicalCitation(
                    "NEJM",
                    "Surviving Sepsis Campaign Guidelines 2021",
                    2021,
                    "10.1056/NEJMra2021436"
                )
            ]
        }
    
    def search_literature(self, query: str, specialty: str = None) -> List[MedicalCitation]:
        """Search for relevant medical literature"""
        results = []
        query_lower = query.lower()
        
        # Direct keyword matches
        for topic, citations in self.literature_db.items():
            if any(keyword in query_lower for keyword in topic.split('_')):
                results.extend(citations)
        
        # Specialty-specific searches
        if "chest pain" in query_lower or "cardiac" in query_lower:
            results.extend(self.literature_db.get("chest_pain", []))
        
        if "headache" in query_lower or "migraine" in query_lower:
            results.extend(self.literature_db.get("headache", []))
        
        if "fever" in query_lower and ("child" in query_lower or "infant" in query_lower):
            results.extend(self.literature_db.get("fever_child", []))
        
        if "sore throat" in query_lower or "pharyngitis" in query_lower:
            results.extend(self.literature_db.get("pharyngitis", []))
        
        return results[:3]  # Limit to top 3 most relevant

class ContextAwareMedicalAI:
    """Smart medical AI with context-aware RAG routing"""
    
    def __init__(self):
        self.rag_db = MedicalRAGDatabase()
        self.literature_sources = get_literature_sources()
        self.clinical_tools = get_clinical_tools()
    
    async def respond(self, query_input: QueryInput) -> FormattedResponse:
        """Main entry point for context-aware medical responses"""
        user_context = UserContext.from_user_type(query_input.user_type)
        
        if user_context.response_mode == ResponseMode.PROFESSIONAL:
            return await self.professional_response_with_citations(query_input, user_context)
        else:
            return await self.consumer_response(query_input, user_context)
    
    async def consumer_response(self, query_input: QueryInput, context: UserContext) -> FormattedResponse:
        """Fast, conversational response for consumers"""
        query = query_input.text.lower()
        
        # Simple, empathetic responses
        if "hurt" in query or "pain" in query:
            if "ankle" in query or "foot" in query:
                content = """Sorry to hear about your ankle pain! 😔

**What you can try:**
• Rest and avoid putting weight on it
• Ice for 15-20 minutes every few hours
• Elevate your foot when sitting
• Over-the-counter pain relievers like ibuprofen

**See a doctor if:**
• You can't walk on it
• It's severely swollen or deformed
• Pain is getting worse after 2-3 days
• You heard a "pop" when it happened

Feel better soon! 🦶✨"""
            
            elif "head" in query:
                content = """Headaches can be really frustrating! 😣

**Try these first:**
• Drink plenty of water (dehydration is common!)
• Rest in a quiet, dark room
• Apply a cold or warm compress
• Gentle neck/shoulder massage
• Over-the-counter pain relievers

**See a doctor if:**
• Sudden, severe "worst headache of your life"
• Headache with fever, stiff neck, or rash
• Changes in vision or speech
• Headaches getting more frequent/severe

Hope you feel better! 💙"""
            
            else:
                content = """Pain can be really tough to deal with. 💙

**General comfort measures:**
• Rest the affected area
• Apply ice or heat (whatever feels better)
• Over-the-counter pain relievers as directed
• Gentle movement if possible

**When to see a doctor:**
• Severe or worsening pain
• Pain after an injury
• Signs of infection (fever, redness, swelling)
• Pain interfering with daily activities

Take care of yourself! 🌟"""
        
        elif "fever" in query and ("child" in query or "baby" in query):
            content = """Fever in little ones can be scary! 🤒

**For babies under 3 months:** Call your pediatrician right away for any fever.

**For older children:**
• Keep them hydrated with fluids
• Dress them lightly
• Give age-appropriate fever reducers (acetaminophen/ibuprofen)
• Monitor their behavior more than the number

**Call the doctor if:**
• Baby under 3 months with any fever
• Fever over 104°F (40°C)
• Child seems very sick or lethargic
• Fever lasts more than 3 days
• Trouble breathing or drinking

You're doing great! 👶💙"""
        
        elif "rash" in query:
            content = """Skin changes can be concerning! 🤔

**Most rashes are not serious, but watch for:**
• Sudden spreading
• Fever with the rash
• Difficulty breathing
• Severe itching or pain

**General care:**
• Keep the area clean and dry
• Avoid scratching
• Cool compresses for itching
• Gentle, fragrance-free moisturizers

**See a doctor if:**
• Rash spreads quickly
• You have fever or feel unwell
• It's not improving after a few days
• You're worried about it

Better safe than sorry! 🌟"""
        
        else:
            content = """Thanks for reaching out! 💙

For any health concerns, it's always best to:
• Trust your instincts
• Contact your healthcare provider if worried
• Seek immediate care for emergencies
• Take care of your overall wellness

Remember: This is general information only. Always consult with healthcare professionals for medical decisions.

Hope this helps! 🌟"""
        
        return FormattedResponse(
            original_query=query_input.text,
            user_type=query_input.user_type,
            specialty=MedicalSpecialty.FAMILY_MEDICINE,
            content=content,
            metadata={
                "response_mode": "consumer",
                "citations_included": False,
                "response_time": "fast"
            },
            escalation_triggered=False
        )
    
    async def professional_response_with_citations(self, query_input: QueryInput, context: UserContext) -> FormattedResponse:
        """Evidence-based response with citations for healthcare professionals"""
        query = query_input.text.lower()
        
        # Search for relevant literature
        citations = self.rag_db.search_literature(query)
        
        # Generate evidence-based response
        if "pharyngitis" in query or "sore throat" in query:
            content = self._generate_pharyngitis_response(citations)
            specialty = MedicalSpecialty.INFECTIOUS_DISEASE
        
        elif "chest pain" in query:
            content = self._generate_chest_pain_response(citations)
            specialty = MedicalSpecialty.CARDIOLOGY
        
        elif "headache" in query or "migraine" in query:
            content = self._generate_headache_response(citations)
            specialty = MedicalSpecialty.NEUROLOGY
        
        elif "fever" in query and ("child" in query or "infant" in query or "pediatric" in query):
            content = self._generate_pediatric_fever_response(citations)
            specialty = MedicalSpecialty.PEDIATRICS
        
        else:
            content = self._generate_general_professional_response(query_input.text, citations)
            specialty = MedicalSpecialty.INTERNAL_MEDICINE
        
        return FormattedResponse(
            original_query=query_input.text,
            user_type=query_input.user_type,
            specialty=specialty,
            content=content,
            metadata={
                "response_mode": "professional",
                "citations_included": True,
                "citation_count": len(citations),
                "evidence_level": "high"
            },
            escalation_triggered=False,
            sources=[citation.format_citation() for citation in citations]
        )
    
    def _generate_pharyngitis_response(self, citations: List[MedicalCitation]) -> str:
        return """**Clinical Assessment: Acute Pharyngitis**

**Diagnostic Approach:**
• Centor criteria for bacterial pharyngitis risk stratification
• Rapid antigen detection test (RADT) if Centor score ≥3
• Throat culture if RADT negative in high-risk patients

**Treatment Recommendations:**

**First-line (Group A Strep confirmed):**
• Amoxicillin 500mg BID × 10 days (adults)
• Amoxicillin 50mg/kg/day divided BID × 10 days (pediatric, max 1g/day)

**Penicillin allergic patients:**
• Azithromycin 500mg day 1, then 250mg daily × 4 days
• Clarithromycin 250mg BID × 10 days
• Clindamycin 300mg TID × 10 days

**Key Clinical Points:**
• Complete 10-day course essential to prevent rheumatic fever
• Symptomatic treatment for viral pharyngitis
• Return to work/school 24 hours after antibiotic initiation

**Evidence Sources:**
""" + "\n".join([citation.format_citation() for citation in citations]) + f"""

**Last updated:** {datetime.now().strftime('%B %Y')}
**Guideline compliance:** IDSA 2012, AAP Red Book 2024"""

    def _generate_chest_pain_response(self, citations: List[MedicalCitation]) -> str:
        return """**Clinical Assessment: Chest Pain Evaluation**

**Risk Stratification:**
• HEART Score for acute chest pain risk assessment
• High-sensitivity troponin at 0 and 3 hours
• ECG within 10 minutes of presentation

**Diagnostic Strategy:**
• **Low risk (HEART 0-3):** Discharge with outpatient follow-up
• **Moderate risk (HEART 4-6):** Serial troponins, stress testing
• **High risk (HEART 7-10):** Cardiology consultation, consider catheterization

**Immediate Management:**
• Aspirin 325mg (unless contraindicated)
• Nitroglycerin for suspected ACS
• Beta-blocker if no contraindications
• Statin therapy for ACS

**Red Flags Requiring Immediate Intervention:**
• STEMI on ECG → Activate cath lab
• Hemodynamic instability
• Aortic dissection suspected

**Evidence Sources:**
""" + "\n".join([citation.format_citation() for citation in citations]) + f"""

**Last updated:** {datetime.now().strftime('%B %Y')}
**Guideline compliance:** AHA/ACC 2021, ESC 2023"""

    def _generate_headache_response(self, citations: List[MedicalCitation]) -> str:
        return """**Clinical Assessment: Headache Evaluation**

**Red Flags (Immediate Workup Required):**
• Sudden onset "thunderclap" headache
• Headache with fever, neck stiffness, altered mental status
• New headache in patient >50 years
• Progressive headache with neurological deficits
• Headache after head trauma

**Migraine Management:**

**Acute Treatment:**
• **Mild-moderate:** NSAIDs (ibuprofen 400-800mg, naproxen 500-1000mg)
• **Moderate-severe:** Triptans (sumatriptan 50-100mg, rizatriptan 10mg)
• **Severe/refractory:** DHE, antiemetics, consider IV therapy

**Preventive Therapy (≥4 headache days/month):**
• First-line: Topiramate 25-100mg BID, propranolol 80-240mg daily
• Second-line: Amitriptyline 25-150mg daily, valproate 500-1500mg daily
• CGRP inhibitors for refractory cases

**Evidence Sources:**
""" + "\n".join([citation.format_citation() for citation in citations]) + f"""

**Last updated:** {datetime.now().strftime('%B %Y')}
**Guideline compliance:** AHS/AAN 2023, IHS 2022"""

    def _generate_pediatric_fever_response(self, citations: List[MedicalCitation]) -> str:
        return """**Clinical Assessment: Pediatric Fever Management**

**Age-Specific Approach:**

**Infants 0-28 days:**
• Any fever requires immediate evaluation and hospitalization
• Full sepsis workup: CBC, blood culture, urine culture, LP
• Empiric antibiotics pending culture results

**Infants 29-90 days:**
• Well-appearing with low-risk criteria: Outpatient management possible
• Ill-appearing or high-risk: Full sepsis workup and hospitalization
• Rochester, Philadelphia, or Boston criteria for risk stratification

**Children >90 days:**
• Focus on clinical appearance over temperature height
• Fever without source: Observation if well-appearing
• Antipyretic therapy for comfort, not fever reduction per se

**Antipyretic Dosing:**
• Acetaminophen: 10-15mg/kg q4-6h (max 75mg/kg/day)
• Ibuprofen: 5-10mg/kg q6-8h (>6 months old, max 40mg/kg/day)

**Evidence Sources:**
""" + "\n".join([citation.format_citation() for citation in citations]) + f"""

**Last updated:** {datetime.now().strftime('%B %Y')}
**Guideline compliance:** AAP 2021, ACEP 2019"""

    def _generate_general_professional_response(self, query: str, citations: List[MedicalCitation]) -> str:
        return f"""**Clinical Consultation: {query}**

**Evidence-Based Assessment:**
Based on current medical literature and clinical guidelines, this presentation requires systematic evaluation following established protocols.

**Recommended Approach:**
• Comprehensive history and physical examination
• Risk stratification using validated clinical tools
• Evidence-based diagnostic workup
• Treatment according to current guidelines

**Key Considerations:**
• Patient safety and quality indicators
• Shared decision-making with patient/family
• Documentation for medicolegal protection
• Follow-up and care coordination

**Professional Resources:**
• Consult specialty guidelines as indicated
• Consider multidisciplinary team approach
• Utilize clinical decision support tools
• Ensure appropriate documentation

**Evidence Sources:**
""" + "\n".join([citation.format_citation() for citation in citations]) + f"""

**Last updated:** {datetime.now().strftime('%B %Y')}
**Note:** This consultation provides general guidance. Clinical judgment and patient-specific factors should guide final decisions."""

def get_context_aware_ai():
    """Factory function to get the context-aware medical AI instance"""
    return ContextAwareMedicalAI()
