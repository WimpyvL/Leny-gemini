# MedGemma 4B-IT Integration Setup Guide

This guide covers the complete setup and deployment of the MedGemma 4B-IT medical AI system with dual-mode responses.

## 🏗️ Architecture Overview

The system implements **dual-mode responses** based on user type:

- **Consumer Mode (Patients)**: Fast MedGemma direct responses (~1.2s)
- **Professional Mode (Providers)**: MedGemma + RAG with citations (~2.5s)

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Copy MedGemma environment configuration
cp .env.medgemma .env

# Edit .env with your settings
vim .env
```

### 2. Install Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt

# For GPU support (recommended)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### 3. Download MedGemma Model

```bash
# Create model directory
mkdir -p ./models/medgemma

# Download MedGemma 4B-IT (requires Hugging Face access)
python -c "
from transformers import AutoTokenizer, AutoModelForCausalLM
model_name = 'google/medgemma-4b-it'
tokenizer = AutoTokenizer.from_pretrained(model_name, cache_dir='./models/medgemma')
model = AutoModelForCausalLM.from_pretrained(model_name, cache_dir='./models/medgemma')
print('MedGemma model downloaded successfully')
"
```

### 4. Start the API Server

```bash
# Start MedGemma medical AI server
python api.py
```

## 📋 System Requirements

### Minimum Requirements
- **RAM**: 16GB+ (32GB recommended)
- **GPU**: 8GB VRAM+ (RTX 3070 or better)
- **Storage**: 50GB free space
- **CPU**: 8+ cores recommended

### Recommended Setup
- **GPU**: RTX 4090 or A6000 (24GB VRAM)
- **RAM**: 64GB
- **Storage**: SSD with 100GB+ free space

## 🔧 Configuration Options

### Core MedGemma Settings

```bash
# .env configuration
PRIMARY_MODEL=google/medgemma-4b-it
MEDGEMMA_DEVICE=cuda  # or 'cpu' for CPU-only
MEDGEMMA_MAX_TOKENS=1024
MEDGEMMA_TEMPERATURE=0.1
```

### Response Mode Configuration

```bash
# Consumer mode (patients) - fast responses
CONSUMER_MODE_FAST=true

# Professional mode (providers) - RAG required
PROFESSIONAL_RAG_REQUIRED=true
RAG_ENABLED=true
```

### Performance Tuning

```bash
MAX_CONCURRENT_REQUESTS=10
REQUEST_TIMEOUT=30
RESPONSE_CACHE_TTL=3600
```

## 🏥 Dual-Mode Response System

### Consumer Mode (Patients)

**Features:**
- Direct MedGemma inference (no RAG overhead)
- Empathetic, conversational responses
- Simple medical language
- Fast response time (~1.2s)
- Built-in medical disclaimers

**Example Response:**
```
User: "My ankle hurts"

Response: "Sorry to hear about your ankle pain! 😔

What you can try:
• Rest and avoid putting weight on it
• Ice for 15-20 minutes every few hours
• Elevate your foot when sitting
• Over-the-counter pain relievers like ibuprofen

See a doctor if:
• You can't walk on it
• It's severely swollen or deformed
• Pain is getting worse after 2-3 days

💙 Remember to consult with a healthcare provider for proper medical advice."
```

### Professional Mode (Providers)

**Features:**
- MedGemma + RAG with medical literature
- Evidence-based clinical responses
- Journal citations and references
- Clinical terminology and protocols
- Regulatory compliance ready

**Example Response:**
```
Query: "Best treatment for acute bacterial pharyngitis?"

Response: "**Evidence-Based Management of Acute Pharyngitis:**

**Diagnostic Approach:**
• Centor criteria for bacterial pharyngitis risk stratification
• Rapid antigen detection test (RADT) if Centor score ≥3
• Throat culture if RADT negative in high-risk patients

**Treatment Recommendations:**
• First-line (Group A Strep confirmed):
  - Amoxicillin 500mg BID × 10 days (adults)
  - Amoxicillin 50mg/kg/day divided BID × 10 days (pediatric)

**Evidence Sources:**
• IDSA Clinical Practice Guideline (CID 2012;55:1279-1282)
• Cochrane Review: Antibiotics for sore throat (2021)
• AAP Red Book 2024 recommendations"
```

## 🔍 Testing the Integration

### Health Check

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "ai_system": "MedGemma 4B-IT",
  "components": {
    "medgemma_model": "initialized",
    "consumer_mode": "enabled",
    "professional_rag": "enabled"
  },
  "response_modes": {
    "consumer": "MedGemma direct inference (~1.2s)",
    "professional": "MedGemma + RAG with citations (~2.5s)"
  }
}
```

### Consumer Query Test

```bash
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "My knee hurts",
    "user_type": "patient"
  }'
```

### Professional Query Test

```bash
curl -X POST "http://localhost:8000/query" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Treatment protocol for acute chest pain",
    "user_type": "provider"
  }'
```

## 🚨 Safety & Compliance Features

### Red Flag Detection
- 125+ emergency keywords across 10 medical categories
- Automatic escalation for high-risk scenarios
- Provider alerts for critical conditions

### Professional Requirements
- **Legal Protection**: Citations for liability coverage
- **Evidence-Based**: Medical literature references
- **Regulatory Compliance**: Joint Commission, CMS ready
- **Audit Trail**: Complete metadata tracking

### Medical Disclaimers
- Automatic medical advice disclaimers
- Professional oversight recommendations
- Emergency care guidance

## 📊 Performance Monitoring

### Response Time Targets
- **Consumer Mode**: <1.5s average
- **Professional Mode**: <3.0s average
- **Health Check**: <100ms

### System Metrics
```bash
# Monitor GPU usage
nvidia-smi

# Monitor API performance
curl http://localhost:8000/health | jq '.components'
```

## 🔧 Troubleshooting

### Common Issues

**MedGemma Model Not Loading:**
```bash
# Check GPU availability
python -c "import torch; print(torch.cuda.is_available())"

# Check model cache
ls -la ./models/medgemma/
```

**Out of Memory Errors:**
```bash
# Reduce max tokens
MEDGEMMA_MAX_TOKENS=512

# Use CPU mode
MEDGEMMA_DEVICE=cpu
```

**Slow Response Times:**
```bash
# Enable response caching
RESPONSE_CACHE_TTL=3600

# Increase concurrent requests
MAX_CONCURRENT_REQUESTS=5
```

### Fallback Mode

If MedGemma fails to initialize, the system automatically falls back to:
1. OpenAI GPT models (if API key provided)
2. Knowledge-based responses (local medical database)
3. Error handling with appropriate medical disclaimers

## 🎯 Production Deployment

### Docker Setup

```dockerfile
FROM nvidia/cuda:11.8-devel-ubuntu20.04

# Install Python and dependencies
RUN apt-get update && apt-get install -y python3.9 python3-pip
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy application
COPY . /app
WORKDIR /app

# Download MedGemma model
RUN python download_model.py

# Start API server
CMD ["python", "api.py"]
```

### Environment Variables

```bash
# Production settings
MEDGEMMA_DEVICE=cuda
MAX_CONCURRENT_REQUESTS=20
REQUEST_TIMEOUT=60
LOG_LEVEL=INFO
```

### Load Balancing

For high-traffic deployment:
- Multiple MedGemma instances behind load balancer
- Separate consumer/professional endpoints
- Redis caching for repeated queries
- GPU scaling based on demand

## 💰 Cost Analysis

### Infrastructure Costs (Monthly)
- **MedGemma Hosting**: $450/month (GPU server)
- **RAG Infrastructure**: $200/month (vector database, search)
- **Medical Literature**: $150/month (UpToDate, PubMed access)
- **Total**: $800-950/month

### Cost Per Query
- **Consumer Mode**: ~$0.01 per query
- **Professional Mode**: ~$0.03 per query (includes RAG)

## 📚 Additional Resources

- [MedGemma Documentation](https://github.com/google-research/google-research/tree/master/medgemma)
- [Hugging Face Model Card](https://huggingface.co/google/medgemma-4b-it)
- [Medical AI Safety Guidelines](https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-and-machine-learning-aiml-enabled-medical-devices)

## 🆘 Support

For technical support:
1. Check logs: `tail -f logs/medgemma.log`
2. Review health check: `curl localhost:8000/health`
3. Monitor GPU usage: `nvidia-smi`
4. Check dependencies: `pip list | grep torch`

---

**⚠️ Medical Disclaimer**: This system is for educational and development purposes. All medical outputs should be reviewed by qualified healthcare professionals before clinical use.