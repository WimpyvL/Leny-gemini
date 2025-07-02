"""
MedGemma 4B-IT Integration Module
Handles both consumer (direct) and professional (RAG) modes
"""
import os
import asyncio
from typing import Dict, Any, List, Optional
from enum import Enum
from dataclasses import dataclass
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import logging

from models import UserType, QueryInput, FormattedResponse, MedicalSpecialty
from config import settings

class ResponseMode(str, Enum):
    CONSUMER = "consumer"  # Fast, direct MedGemma responses
    PROFESSIONAL = "professional"  # MedGemma + RAG with citations

@dataclass
class MedGemmaConfig:
    model_name: str = "google/medgemma-4b-it"
    model_path: Optional[str] = None
    device: str = "cuda" if torch.cuda.is_available() else "cpu"
    max_tokens: int = 1024
    temperature: float = 0.1
    top_p: float = 0.95

class MedGemmaModel:
    """MedGemma 4B-IT model wrapper with optimized inference"""
    
    def __init__(self, config: MedGemmaConfig):
        self.config = config
        self.model = None
        self.tokenizer = None
        self.is_loaded = False
        self.logger = logging.getLogger(__name__)
        
    async def load_model(self):
        """Load MedGemma model asynchronously"""
        try:
            self.logger.info("Loading MedGemma 4B-IT model...")
            
            # Load tokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.config.model_name,
                cache_dir=self.config.model_path
            )
            
            # Load model
            self.model = AutoModelForCausalLM.from_pretrained(
                self.config.model_name,
                cache_dir=self.config.model_path,
                torch_dtype=torch.float16 if self.config.device == "cuda" else torch.float32,
                device_map="auto" if self.config.device == "cuda" else None,
                low_cpu_mem_usage=True
            )
            
            if self.config.device == "cuda":
                self.model = self.model.cuda()
            
            self.is_loaded = True
            self.logger.info("MedGemma model loaded successfully")
            
        except Exception as e:
            self.logger.error(f"Failed to load MedGemma model: {e}")
            self.is_loaded = False
            raise
    
    async def generate_response(self, prompt: str) -> str:
        """Generate response using MedGemma"""
        if not self.is_loaded:
            await self.load_model()
        
        try:
            # Tokenize input
            inputs = self.tokenizer(
                prompt,
                return_tensors="pt",
                truncation=True,
                max_length=2048
            )
            
            if self.config.device == "cuda":
                inputs = {k: v.cuda() for k, v in inputs.items()}
            
            # Generate response
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=self.config.max_tokens,
                    temperature=self.config.temperature,
                    top_p=self.config.top_p,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id
                )
            
            # Decode response
            response = self.tokenizer.decode(
                outputs[0][inputs['input_ids'].shape[1]:],
                skip_special_tokens=True
            )
            
            return response.strip()
            
        except Exception as e:
            self.logger.error(f"Error generating MedGemma response: {e}")
            raise

class MedGemmaConsumerMode:
    """Fast consumer responses using MedGemma alone"""
    
    def __init__(self, medgemma_model: MedGemmaModel):
        self.model = medgemma_model
        self.consumer_prompts = {
            "general": """You are a helpful medical assistant. Provide compassionate, easy-to-understand health information. Always remind users to consult healthcare providers for medical decisions.

User question: {query}

Provide a caring, conversational response:""",
            
            "symptom": """You are a caring medical assistant helping someone with symptoms. Be empathetic and provide practical advice while encouraging professional care when needed.

User says: {query}

Respond with empathy and practical guidance:""",
            
            "pain": """You are a compassionate medical assistant. Someone is experiencing pain. Provide comfort and practical suggestions while emphasizing when to seek care.

User reports: {query}

Provide a supportive response:"""
        }
    
    def _select_prompt_template(self, query: str) -> str:
        """Select appropriate prompt based on query content"""
        query_lower = query.lower()
        
        if any(word in query_lower for word in ["hurt", "pain", "ache", "sore"]):
            return "pain"
        elif any(word in query_lower for word in ["feel", "symptom", "sick", "unwell"]):
            return "symptom"
        else:
            return "general"
    
    async def respond(self, query: str) -> str:
        """Generate fast consumer response"""
        template_type = self._select_prompt_template(query)
        prompt = self.consumer_prompts[template_type].format(query=query)
        
        response = await self.model.generate_response(prompt)
        
        # Add standard disclaimer
        if "consult" not in response.lower():
            response += "\n\n💙 Remember to consult with a healthcare provider for proper medical advice."
        
        return response

class MedGemmaProfessionalMode:
    """Professional responses using MedGemma + RAG with citations"""
    
    def __init__(self, medgemma_model: MedGemmaModel, rag_system):
        self.model = medgemma_model
        self.rag = rag_system
        self.professional_prompts = {
            "clinical_query": """You are a clinical AI assistant providing evidence-based medical information to healthcare professionals. Use the provided medical literature context to formulate your response.

Clinical Query: {query}

Medical Literature Context:
{rag_context}

Provide a structured clinical response with:
1. Clinical assessment
2. Evidence-based recommendations
3. Key considerations
4. References to provided literature

Response:""",
            
            "diagnostic": """You are providing diagnostic support to a healthcare professional. Use the medical literature provided to give evidence-based guidance.

Diagnostic Question: {query}

Relevant Medical Evidence:
{rag_context}

Provide structured diagnostic guidance:""",
            
            "treatment": """You are assisting with treatment planning. Use the provided clinical evidence to support recommendations.

Treatment Query: {query}

Clinical Evidence:
{rag_context}

Provide evidence-based treatment guidance:"""
        }
    
    def _select_professional_template(self, query: str) -> str:
        """Select professional prompt based on query type"""
        query_lower = query.lower()
        
        if any(word in query_lower for word in ["diagnos", "differential", "rule out"]):
            return "diagnostic"
        elif any(word in query_lower for word in ["treat", "manage", "therapy", "medication"]):
            return "treatment"
        else:
            return "clinical_query"
    
    async def respond(self, query: str, specialty: MedicalSpecialty) -> Dict[str, Any]:
        """Generate professional response with RAG"""
        # Get RAG context
        rag_context = await self.rag.get_clinical_context(query, specialty)
        
        # Select prompt template
        template_type = self._select_professional_template(query)
        prompt = self.professional_prompts[template_type].format(
            query=query,
            rag_context=rag_context["content"]
        )
        
        # Generate response
        response = await self.model.generate_response(prompt)
        
        return {
            "content": response,
            "citations": rag_context["citations"],
            "evidence_level": rag_context["evidence_level"],
            "specialty": specialty.value
        }

class MedGemmaIntegration:
    """Main MedGemma integration with dual-mode support"""
    
    def __init__(self):
        self.config = MedGemmaConfig()
        self.model = MedGemmaModel(self.config)
        self.consumer_mode = None
        self.professional_mode = None
        self.rag_system = None
        self.logger = logging.getLogger(__name__)
    
    async def initialize(self):
        """Initialize MedGemma and all components"""
        try:
            # Load MedGemma model
            await self.model.load_model()
            
            # Initialize consumer mode
            self.consumer_mode = MedGemmaConsumerMode(self.model)
            
            # Initialize RAG system for professional mode
            from medical_rag_system import MedicalRAGSystem
            self.rag_system = MedicalRAGSystem()
            await self.rag_system.initialize()
            
            # Initialize professional mode
            self.professional_mode = MedGemmaProfessionalMode(self.model, self.rag_system)
            
            self.logger.info("MedGemma integration initialized successfully")
            
        except Exception as e:
            self.logger.error(f"Failed to initialize MedGemma integration: {e}")
            raise
    
    async def respond(self, query_input: QueryInput) -> FormattedResponse:
        """Main response method with mode selection"""
        try:
            # Determine response mode based on user type
            if query_input.user_type == UserType.PROVIDER:
                return await self._professional_response(query_input)
            else:
                return await self._consumer_response(query_input)
                
        except Exception as e:
            self.logger.error(f"Error in MedGemma response: {e}")
            return self._fallback_response(query_input, str(e))
    
    async def _consumer_response(self, query_input: QueryInput) -> FormattedResponse:
        """Fast consumer response using MedGemma alone"""
        response_content = await self.consumer_mode.respond(query_input.text)
        
        return FormattedResponse(
            original_query=query_input.text,
            user_type=query_input.user_type,
            specialty=MedicalSpecialty.FAMILY_MEDICINE,
            content=response_content,
            metadata={
                "response_mode": "consumer",
                "model": "medgemma-4b-it",
                "rag_used": False,
                "response_time": "fast",
                "citations_included": False
            },
            escalation_triggered=False
        )
    
    async def _professional_response(self, query_input: QueryInput) -> FormattedResponse:
        """Professional response with MedGemma + RAG"""
        from context_classifier import ContextClassifier
        classifier = ContextClassifier()
        
        # Classify query for specialty routing
        context_type, specialty = classifier.classify_query(query_input.text)
        
        # Check for red flags
        has_red_flags = classifier.has_red_flags(query_input.text)
        
        # Generate professional response
        response_data = await self.professional_mode.respond(query_input.text, specialty)
        
        return FormattedResponse(
            original_query=query_input.text,
            user_type=query_input.user_type,
            specialty=specialty,
            content=response_data["content"],
            metadata={
                "response_mode": "professional",
                "model": "medgemma-4b-it",
                "rag_used": True,
                "context_type": context_type.value,
                "evidence_level": response_data["evidence_level"],
                "citations_included": True,
                "red_flags": has_red_flags
            },
            escalation_triggered=has_red_flags,
            sources=response_data["citations"]
        )
    
    def _fallback_response(self, query_input: QueryInput, error: str) -> FormattedResponse:
        """Fallback response when MedGemma fails"""
        return FormattedResponse(
            original_query=query_input.text,
            user_type=query_input.user_type,
            specialty=MedicalSpecialty.INTERNAL_MEDICINE,
            content="I apologize, but I'm experiencing technical difficulties. Please consult with a healthcare provider for medical advice.",
            metadata={
                "error": error,
                "fallback": True,
                "model": "none"
            },
            escalation_triggered=True
        )

# Factory function for easy integration
async def get_medgemma_ai():
    """Factory function to get initialized MedGemma AI"""
    medgemma_ai = MedGemmaIntegration()
    await medgemma_ai.initialize()
    return medgemma_ai