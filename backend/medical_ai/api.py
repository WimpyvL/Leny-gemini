"""
FastAPI interface for Leny Medical AI System
Provides REST API endpoints for clinical reasoning
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from typing import Optional

from models import QueryInput, FormattedResponse, UserType, ContextType, MedicalSpecialty
from core_engine import ClinicalReasoningEngine
from config import settings

# Initialize FastAPI app
app = FastAPI(
    title="Leny Medical AI System",
    description="Clinical reasoning engine with RAG, CoT, and agent specialization",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the clinical reasoning engine
engine = ClinicalReasoningEngine()

# Initialize MedGemma on startup
@app.on_event("startup")
async def startup_event():
    """Initialize MedGemma AI system on startup"""
    try:
        await engine.initialize()
        print("✅ MedGemma AI system initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize MedGemma: {e}")
        print("⚠️  Falling back to legacy OpenAI system")

# API Models
class QueryRequest(BaseModel):
    text: str
    user_type: UserType = UserType.PATIENT
    context_hint: Optional[ContextType] = None
    specialty_hint: Optional[MedicalSpecialty] = None

class QueryResponse(BaseModel):
    content: str
    metadata: dict
    escalation_triggered: bool
    specialty: str
    user_type: str

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Leny Medical AI System is running"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "ai_system": "MedGemma 4B-IT",
        "components": {
            "medgemma_model": "initialized" if engine.is_initialized else "not_initialized",
            "consumer_mode": "enabled" if engine.is_initialized else "disabled",
            "professional_rag": "enabled" if engine.is_initialized else "disabled",
            "classifier": "operational",
            "templates": "loaded",
            "agent_configs": "loaded" if engine.agent_configs else "default",
            "fallback_llm": "available" if engine.fallback_llm else "not_available"
        },
        "response_modes": {
            "consumer": "MedGemma direct inference (~1.2s)",
            "professional": "MedGemma + RAG with citations (~2.5s)"
        }
    }

@app.post("/query", response_model=QueryResponse)
async def process_medical_query(request: QueryRequest):
    """
    Process a medical query through the MedGemma clinical reasoning engine
    
    Dual-mode processing:
    - Consumer (Patient): Fast MedGemma direct responses
    - Professional (Provider): MedGemma + RAG with citations
    
    Args:
        request: QueryRequest containing the medical question and context
        
    Returns:
        QueryResponse with formatted clinical response
    """
    try:
        # Create query input
        query_input = QueryInput(
            text=request.text,
            user_type=request.user_type,
            context_hint=request.context_hint,
            specialty_hint=request.specialty_hint
        )
        
        # Process through MedGemma engine
        response = engine.process_query(query_input)
        
        # Return formatted response
        return QueryResponse(
            content=response.content,
            metadata=response.metadata,
            escalation_triggered=response.escalation_triggered,
            specialty=response.specialty.value,
            user_type=response.user_type.value
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MedGemma processing error: {str(e)}")

@app.post("/classify")
async def classify_query(text: str):
    """
    Classify a medical query without full processing
    
    Args:
        text: The medical query text
        
    Returns:
        Classification results
    """
    try:
        context_type, specialty = engine.classifier.classify_query(text)
        has_red_flags = engine.classifier.has_red_flags(text)
        
        return {
            "text": text,
            "context_type": context_type.value,
            "specialty": specialty.value,
            "has_red_flags": has_red_flags
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification error: {str(e)}")

@app.get("/specialties")
async def get_specialties():
    """Get list of available medical specialties"""
    return {
        "specialties": [specialty.value for specialty in MedicalSpecialty]
    }

@app.get("/context-types")
async def get_context_types():
    """Get list of available context types"""
    return {
        "context_types": [context.value for context in ContextType]
    }

@app.post("/search/medical-knowledge")
async def search_medical_knowledge(request: dict):
    """
    Search through comprehensive medical knowledge database
    
    Args:
        request: Dictionary containing the search query
        
    Returns:
        Relevant medical information from knowledge database
    """
    try:
        from comprehensive_medical_db import (
            search_specialty, get_clinical_tools, get_drug_database, 
            get_lab_database, get_specialty_count, get_literature_count
        )
        from medical_knowledge_db import (
            check_drug_interactions, get_lab_reference, get_emergency_protocol
        )
        
        # Extract query from request
        query = request.get("query", "") if isinstance(request, dict) else str(request)
        
        results = {
            "query": query,
            "results": [],
            "total_specialties": get_specialty_count(),
            "total_literature_sources": get_literature_count()
        }
        
        # Search specialties
        specialty_matches = search_specialty(query)
        if specialty_matches:
            results["results"].append({
                "category": "Medical Specialties",
                "matches": specialty_matches
            })
        
        # Search clinical tools
        clinical_tools = get_clinical_tools()
        tool_matches = []
        for category, tools in clinical_tools.items():
            for tool_name, description in tools.items():
                if query.lower() in tool_name.lower() or query.lower() in description.lower():
                    tool_matches.append({
                        "tool": tool_name,
                        "description": description,
                        "category": category
                    })
        
        if tool_matches:
            results["results"].append({
                "category": "Clinical Decision Tools",
                "matches": tool_matches[:10]  # Limit to top 10
            })
        
        # Search drug database
        drug_db = get_drug_database()
        drug_matches = []
        for drug_class, drugs in drug_db["drug_classes"].items():
            for drug in drugs:
                if query.lower() in drug.lower():
                    interactions = check_drug_interactions(drug)
                    drug_matches.append({
                        "drug": drug,
                        "class": drug_class,
                        "interactions": interactions
                    })
        
        if drug_matches:
            results["results"].append({
                "category": "Medications",
                "matches": drug_matches[:10]  # Limit to top 10
            })
        
        # Search lab values
        lab_db = get_lab_database()
        lab_matches = []
        for category, tests in lab_db.items():
            if isinstance(tests, dict):
                for test_name, ranges in tests.items():
                    if query.lower() in test_name.lower():
                        lab_matches.append({
                            "test": test_name,
                            "category": category,
                            "reference_ranges": ranges
                        })
        
        if lab_matches:
            results["results"].append({
                "category": "Laboratory Tests",
                "matches": lab_matches[:10]  # Limit to top 10
            })
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

@app.get("/search/drug-interactions/{drug_name}")
async def get_drug_interactions(drug_name: str):
    """
    Get drug interactions for a specific medication
    
    Args:
        drug_name: Name of the medication
        
    Returns:
        Drug interaction information
    """
    try:
        from medical_knowledge_db import check_drug_interactions
        
        interactions = check_drug_interactions(drug_name)
        
        if interactions:
            return {
                "drug": drug_name,
                "interactions": interactions
            }
        else:
            return {
                "drug": drug_name,
                "message": "No specific interaction data found in database"
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Drug interaction search error: {str(e)}")

@app.get("/search/lab-reference/{test_name}")
async def get_lab_reference_ranges(test_name: str):
    """
    Get reference ranges for a specific lab test
    
    Args:
        test_name: Name of the laboratory test
        
    Returns:
        Reference range information
    """
    try:
        from medical_knowledge_db import get_lab_reference
        
        reference = get_lab_reference(test_name)
        
        if reference:
            return {
                "test": test_name,
                "reference_ranges": reference
            }
        else:
            return {
                "test": test_name,
                "message": "No reference range data found in database"
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lab reference search error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "api:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True
    )
