"""
Core Clinical Reasoning Engine for Leny Medical AI System
Handles the main processing pipeline with MedGemma integration
"""
import json
import yaml
import asyncio
from typing import Dict, Any, Optional
import os
import logging

from models import (
    QueryInput, ClinicalResponse, FormattedResponse,
    ContextType, UserType, MedicalSpecialty
)
from context_classifier import ContextClassifier
from prompt_templates import PromptTemplates
from config import settings
from comprehensive_medical_db import (
    get_all_specialties, get_literature_sources, get_clinical_tools,
    get_drug_database, get_lab_database, search_specialty
)
from medical_knowledge_db import (
    get_diagnosis_info, get_clinical_rule, check_drug_interactions,
    get_lab_reference, get_emergency_protocol
)
from medgemma_integration import get_medgemma_ai

class ClinicalReasoningEngine:
    def __init__(self):
        self.classifier = ContextClassifier()
        self.templates = PromptTemplates()
        self.agent_configs = self._load_agent_configs()
        self.logger = logging.getLogger(__name__)
        
        # Initialize MedGemma AI system
        self.medgemma_ai = None
        self.is_initialized = False
        
        # Fallback OpenAI system for emergencies
        self.fallback_llm = self._init_fallback_llm()
        
        # Legacy components for compatibility
        self.vector_store = None
        self.retriever = None

    def _load_agent_configs(self) -> Dict[str, Any]:
        """Load agent configuration from YAML file"""
        try:
            with open('agent_configs.yaml', 'r') as file:
                return yaml.safe_load(file)
        except FileNotFoundError:
            print("Warning: agent_configs.yaml not found, using default configs")
            return {}

    async def initialize(self):
        """Initialize MedGemma AI system"""
        try:
            if not self.is_initialized:
                self.logger.info("Initializing MedGemma AI system...")
                self.medgemma_ai = await get_medgemma_ai()
                self.is_initialized = True
                self.logger.info("MedGemma AI system initialized successfully")
        except Exception as e:
            self.logger.error(f"Failed to initialize MedGemma: {e}")
            self.is_initialized = False

    def _init_fallback_llm(self):
        """Initialize fallback OpenAI LLM for emergency situations"""
        try:
            from openai import OpenAI
            api_key = os.getenv('OPENAI_API_KEY')
            if api_key and api_key != 'sk-placeholder-key-for-testing':
                return OpenAI(api_key=api_key)
            else:
                self.logger.warning("No OpenAI API key available for fallback")
                return None
        except ImportError:
            self.logger.warning("OpenAI package not available for fallback")
            return None

    def _retrieve_context(self, query: str) -> str:
        """Retrieve relevant context using medical knowledge database"""
        context_parts = []
        
        # Search for relevant clinical decision tools
        clinical_tools = get_clinical_tools()
        for category, tools in clinical_tools.items():
            for tool_name, description in tools.items():
                if any(keyword in query.lower() for keyword in tool_name.split('_')):
                    context_parts.append(f"Clinical Tool: {tool_name} - {description}")
        
        # Search for drug interactions if medication mentioned
        drug_db = get_drug_database()
        for drug_class, drugs in drug_db["drug_classes"].items():
            for drug in drugs:
                if drug.lower() in query.lower():
                    interactions = check_drug_interactions(drug)
                    if interactions:
                        context_parts.append(f"Drug Info: {drug} - {interactions}")
        
        # Search for lab reference ranges if lab values mentioned
        lab_keywords = ["lab", "blood", "test", "level", "result"]
        if any(keyword in query.lower() for keyword in lab_keywords):
            lab_db = get_lab_database()
            for category, tests in lab_db.items():
                if isinstance(tests, dict):
                    for test_name, ranges in tests.items():
                        if test_name.replace('_', ' ') in query.lower():
                            context_parts.append(f"Lab Reference: {test_name} - {ranges}")
        
        # Search for emergency protocols if red flags detected
        if self.classifier.has_red_flags(query):
            emergency_keywords = ["cardiac", "stroke", "anaphylaxis"]
            for keyword in emergency_keywords:
                if keyword in query.lower():
                    protocol = get_emergency_protocol(keyword.replace("cardiac", "cardiac_arrest"))
                    if protocol:
                        context_parts.append(f"Emergency Protocol: {protocol}")
        
        return "\n".join(context_parts[:5])  # Limit to top 5 most relevant

    def _should_escalate(self, query: str, context_type: ContextType) -> bool:
        """Determine if query should be escalated to premium model"""
        # Check for red flags
        if self.classifier.has_red_flags(query):
            return True
        
        # Escalate triage questions
        if context_type == ContextType.TRIAGE:
            return True
        
        return False

    def _apply_agent_tinting(self, response: Dict[str, Any], specialty: MedicalSpecialty) -> Dict[str, Any]:
        """Apply specialty-specific modifications to base response"""
        specialty_key = specialty.value
        
        if specialty_key not in self.agent_configs:
            return response
        
        config = self.agent_configs[specialty_key]
        
        # Add specialty-specific tests
        if "add_tests" in config and "diagnostic_strategy" in response:
            for test_config in config["add_tests"]:
                response["diagnostic_strategy"].append({
                    "condition": test_config["condition"],
                    "recommended_test": test_config["recommended_test"]
                })
        
        return response

    def _format_for_audience(self, response: Dict[str, Any], user_type: UserType, specialty: MedicalSpecialty) -> str:
        """Format response based on audience (patient vs provider)"""
        if user_type == UserType.PROVIDER:
            return self._format_provider_response(response, specialty)
        else:
            return self._format_patient_response(response, specialty)

    def _format_provider_response(self, response: Dict[str, Any], specialty: MedicalSpecialty) -> str:
        """Format response for healthcare providers"""
        formatted = f"**Clinical Assessment - {specialty.value.title().replace('_', ' ')}**\n\n"
        
        # Most likely diagnoses
        if "most_likely_diagnoses" in response:
            formatted += "**Most Likely Diagnoses:**\n"
            for dx in response["most_likely_diagnoses"]:
                if isinstance(dx, dict):
                    formatted += f"- **{dx.get('name', 'Unknown')}**: {dx.get('description', '')}\n"
                else:
                    formatted += f"- {dx}\n"
        
        # Red flags
        if "red_flag_diagnoses" in response:
            formatted += "\n**Must Not Miss:**\n"
            for dx in response["red_flag_diagnoses"]:
                if isinstance(dx, dict):
                    formatted += f"- **{dx.get('name', 'Unknown')}**: {dx.get('description', '')}\n"
                else:
                    formatted += f"- {dx}\n"
        
        # History and exam
        if "key_history_questions" in response:
            formatted += "\n**Key History:**\n"
            for question in response["key_history_questions"]:
                formatted += f"- {question}\n"
        
        if "physical_exam_focus" in response:
            formatted += "\n**Physical Exam Focus:**\n"
            for exam in response["physical_exam_focus"]:
                formatted += f"- {exam}\n"
        
        # Diagnostic strategy
        if "diagnostic_strategy" in response:
            formatted += "\n**Diagnostic Approach:**\n"
            for strategy in response["diagnostic_strategy"]:
                if isinstance(strategy, dict):
                    formatted += f"- If {strategy.get('condition', '')} → {strategy.get('recommended_test', '')}\n"
                else:
                    formatted += f"- {strategy}\n"
        
        # Management
        if "initial_management" in response:
            formatted += "\n**Initial Management:**\n"
            for mgmt in response["initial_management"]:
                formatted += f"- {mgmt}\n"
        
        return formatted

    def _format_patient_response(self, response: Dict[str, Any], specialty: MedicalSpecialty) -> str:
        """Format response for patients"""
        formatted = "Based on your symptoms, here's what we're considering:\n\n"
        
        # Most likely causes (simplified)
        if "most_likely_diagnoses" in response:
            formatted += "**Most Likely Causes:**\n"
            for dx in response["most_likely_diagnoses"]:
                if isinstance(dx, dict):
                    name = dx.get('name', 'Unknown condition')
                    desc = dx.get('description', '').replace("typically presents with", "usually causes")
                    formatted += f"- **{name}**: {desc}\n"
                else:
                    formatted += f"- {dx}\n"
        
        # When to seek immediate care
        if response.get("red_flag_diagnoses"):
            formatted += "\n**When to Seek Immediate Care:**\n"
            formatted += "You should get medical attention right away if you experience:\n"
            for dx in response["red_flag_diagnoses"]:
                if isinstance(dx, dict):
                    name = dx.get('name', 'serious condition')
                    desc = dx.get('description', '')
                    formatted += f"- Signs of {name.lower()}: {desc}\n"
                else:
                    formatted += f"- {dx}\n"
        
        # What to expect
        if response.get("key_history_questions"):
            formatted += "\n**What to Expect:**\n"
            formatted += "Your healthcare provider may ask about:\n"
            for question in response["key_history_questions"][:3]:  # Limit to top 3
                formatted += f"- {question}\n"
        
        # Self-care measures
        if response.get("initial_management"):
            formatted += "\n**What You Can Do:**\n"
            for mgmt in response["initial_management"]:
                if not any(word in mgmt.lower() for word in ["refer", "consult", "specialist"]):
                    formatted += f"- {mgmt}\n"
        
        return formatted

    def _generate_knowledge_based_response(self, query: str, context_type: ContextType, specialty: MedicalSpecialty) -> Dict[str, Any]:
        """Generate response using medical knowledge database when LLM is not available"""
        
        # Get specialty-specific diagnoses
        specialty_diagnoses = get_diagnosis_info(specialty.value)
        
        # Build response based on context type and available knowledge
        response = {
            "most_likely_diagnoses": [],
            "red_flag_diagnoses": [],
            "key_history_questions": [],
            "physical_exam_focus": [],
            "diagnostic_strategy": [],
            "initial_management": []
        }
        
        # Add specialty-specific common diagnoses
        if specialty_diagnoses:
            for icd_code, diagnosis in list(specialty_diagnoses.items())[:3]:  # Top 3
                response["most_likely_diagnoses"].append({
                    "name": diagnosis["name"],
                    "description": f"Common {specialty.value.replace('_', ' ')} condition",
                    "rationale": f"Frequently seen in {specialty.value.replace('_', ' ')} practice"
                })
        
        # Add red flag conditions based on specialty
        red_flag_conditions = {
            "cardiology": ["Acute myocardial infarction", "Unstable angina", "Aortic dissection"],
            "neurology": ["Stroke", "Meningitis", "Increased intracranial pressure"],
            "emergency_medicine": ["Sepsis", "Cardiac arrest", "Respiratory failure"],
            "gastroenterology": ["GI bleeding", "Bowel obstruction", "Acute abdomen"],
            "orthopedics": ["Compartment syndrome", "Open fracture", "Spinal cord injury"]
        }
        
        if specialty.value in red_flag_conditions:
            for condition in red_flag_conditions[specialty.value]:
                response["red_flag_diagnoses"].append({
                    "name": condition,
                    "description": f"Serious {specialty.value.replace('_', ' ')} emergency",
                    "rationale": "Requires immediate evaluation and treatment"
                })
        
        # Add context-specific history questions
        history_questions = {
            ContextType.SYMPTOM: [
                "When did the symptoms start?",
                "What makes the symptoms better or worse?",
                "Have you experienced this before?",
                "Any associated symptoms?"
            ],
            ContextType.MEDICATION: [
                "What medications are you currently taking?",
                "Any new medications recently started?",
                "Any known drug allergies?",
                "Are you taking medications as prescribed?"
            ],
            ContextType.TEST_RESULT: [
                "When was the test performed?",
                "What were the specific values?",
                "Any previous similar tests for comparison?",
                "Are you experiencing any symptoms?"
            ]
        }
        
        response["key_history_questions"] = history_questions.get(context_type, history_questions[ContextType.SYMPTOM])
        
        # Add specialty-specific physical exam focus
        exam_focus = {
            "cardiology": ["Cardiovascular examination", "Blood pressure", "Heart sounds", "Peripheral pulses"],
            "neurology": ["Neurological examination", "Mental status", "Cranial nerves", "Motor/sensory function"],
            "orthopedics": ["Musculoskeletal examination", "Range of motion", "Strength testing", "Joint stability"],
            "gastroenterology": ["Abdominal examination", "Bowel sounds", "Palpation", "Rectal examination"]
        }
        
        response["physical_exam_focus"] = exam_focus.get(specialty.value, ["Focused physical examination", "Vital signs"])
        
        # Add diagnostic strategy based on context
        if context_type == ContextType.SYMPTOM:
            response["diagnostic_strategy"].append({
                "condition": "Initial evaluation",
                "recommended_test": "History and physical examination"
            })
        elif context_type == ContextType.TEST_RESULT:
            response["diagnostic_strategy"].append({
                "condition": "Abnormal test results",
                "recommended_test": "Correlation with clinical presentation"
            })
        
        # Add initial management
        response["initial_management"] = [
            "Comprehensive history and physical examination",
            "Consider appropriate diagnostic testing",
            "Monitor for red flag symptoms",
            "Follow up as clinically indicated",
            "Seek immediate care if symptoms worsen"
        ]
        
        return response

    def process_query(self, query_input: QueryInput) -> FormattedResponse:
        """Main processing pipeline with MedGemma integration"""
        try:
            # Use MedGemma AI system
            return asyncio.run(self._process_with_medgemma(query_input))
            
        except Exception as e:
            # Error handling - fallback to legacy system
            self.logger.error(f"MedGemma processing error: {e}, falling back to legacy system")
            return self._legacy_process_query(query_input)
    
    async def _process_with_medgemma(self, query_input: QueryInput) -> FormattedResponse:
        """Process query using MedGemma AI system"""
        # Ensure MedGemma is initialized
        if not self.is_initialized:
            await self.initialize()
        
        if self.medgemma_ai:
            return await self.medgemma_ai.respond(query_input)
        else:
            raise Exception("MedGemma AI not available")
    
    def _legacy_process_query(self, query_input: QueryInput) -> FormattedResponse:
        """Legacy processing pipeline as fallback"""
        try:
            # Step 1: Classify context and specialty
            context_type, specialty = self.classifier.classify_query(query_input.text)
            
            # Use hints if provided
            if query_input.context_hint:
                context_type = query_input.context_hint
            if query_input.specialty_hint:
                specialty = query_input.specialty_hint
            
            # Step 2: Retrieve relevant context
            rag_context = self._retrieve_context(query_input.text)
            
            # Step 3: Choose LLM based on escalation criteria
            should_escalate = self._should_escalate(query_input.text, context_type)
            llm = self.fallback_llm if should_escalate else self.primary_llm
            
            # Step 4: Generate base clinical response
            if llm is None:
                # Use knowledge-based response when LLM is not available
                clinical_data = self._generate_knowledge_based_response(query_input.text, context_type, specialty)
            else:
                try:
                    prompt = self.templates.format_template(context_type, query_input.text, rag_context)
                    
                    response = llm.chat.completions.create(
                        model="gpt-3.5-turbo",
                        messages=[{"role": "user", "content": prompt}],
                        temperature=0.1,
                        max_tokens=2000
                    )
                    
                    raw_response = response.choices[0].message.content
                    
                    # Parse JSON response
                    try:
                        clinical_data = json.loads(raw_response)
                    except json.JSONDecodeError:
                        # Fallback if JSON parsing fails
                        clinical_data = self._generate_knowledge_based_response(query_input.text, context_type, specialty)
                        
                except Exception as e:
                    print(f"LLM error: {e}")
                    clinical_data = self._generate_knowledge_based_response(query_input.text, context_type, specialty)
            
            # Step 5: Apply agent tinting
            tinted_response = self._apply_agent_tinting(clinical_data, specialty)
            
            # Step 6: Format for audience
            formatted_content = self._format_for_audience(
                tinted_response, query_input.user_type, specialty
            )
            
            # Step 7: Create final response
            return FormattedResponse(
                original_query=query_input.text,
                user_type=query_input.user_type,
                specialty=specialty,
                content=formatted_content,
                metadata={
                    "context_type": context_type.value,
                    "escalated": should_escalate,
                    "rag_used": bool(rag_context),
                    "system": "legacy"
                },
                escalation_triggered=should_escalate
            )
            
        except Exception as e:
            # Error handling
            return FormattedResponse(
                original_query=query_input.text,
                user_type=query_input.user_type,
                specialty=MedicalSpecialty.INTERNAL_MEDICINE,
                content=f"I apologize, but I encountered an error processing your query. Please consult with a healthcare provider for medical advice. Error: {str(e)}",
                metadata={"error": str(e)},
                escalation_triggered=True
            )
