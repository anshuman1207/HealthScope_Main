from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
import uvicorn
import numpy as np
import pandas as pd
from datetime import datetime
import logging
from contextlib import asynccontextmanager

# Import our custom modules
from models.symptom_analyzer import SymptomAnalyzer
from models.risk_calculator import RiskCalculator
from utils.data_preprocessor import DataPreprocessor
from database.db_manager import DatabaseManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables for models
symptom_analyzer = None
risk_calculator = None
data_preprocessor = None
db_manager = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global symptom_analyzer, risk_calculator, data_preprocessor, db_manager
    logger.info("Loading ML models and initializing services...")
    
    try:
        # Initialize database
        db_manager = DatabaseManager()
        await db_manager.initialize()
        
        # Initialize data preprocessor
        data_preprocessor = DataPreprocessor()
        
        # Load ML models
        symptom_analyzer = SymptomAnalyzer()
        await symptom_analyzer.load_models()
        
        risk_calculator = RiskCalculator()
        await risk_calculator.initialize()
        
        logger.info("All services initialized successfully")
        yield
    except Exception as e:
        logger.error(f"Failed to initialize services: {e}")
        raise
    finally:
        # Cleanup
        if db_manager:
            await db_manager.close()

app = FastAPI(
    title="MediCare Symptom Checker API",
    description="AI-powered symptom analysis and risk assessment",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class SymptomInput(BaseModel):
    primary_concern: str = Field(..., description="Main symptom description")
    duration: str = Field(..., description="How long symptoms have been present")
    pain_level: Optional[str] = Field(None, description="Pain level if applicable")
    additional_symptoms: List[str] = Field(default=[], description="Additional symptoms")
    medications: Optional[str] = Field(None, description="Current medications")
    patient_id: Optional[str] = Field(None, description="Patient identifier")
    age: Optional[int] = Field(None, ge=0, le=120)
    gender: Optional[str] = Field(None, description="Patient gender")
    medical_history: Optional[List[str]] = Field(default=[], description="Previous medical conditions")

class ContributorFactor(BaseModel):
    factor: str
    impact: float = Field(..., ge=0, le=1)

class Recommendation(BaseModel):
    text: str
    priority: str = Field(..., regex="^(high|medium|low)$")
    category: str

class AnalysisResult(BaseModel):
    condition: str
    risk_score: int = Field(..., ge=0, le=100)
    confidence: float = Field(..., ge=0, le=1)
    contributors: List[ContributorFactor]
    recommendations: List[Recommendation]
    urgency_level: str = Field(..., regex="^(emergency|urgent|routine|monitoring)$")
    follow_up_days: Optional[int] = Field(None, ge=0)
    analysis_id: str
    timestamp: datetime

class HealthMetrics(BaseModel):
    total_analyses: int
    common_conditions: List[Dict[str, Any]]
    average_risk_score: float
    urgency_distribution: Dict[str, int]

# Dependency to get services
async def get_symptom_analyzer():
    if symptom_analyzer is None:
        raise HTTPException(status_code=503, detail="Symptom analyzer not initialized")
    return symptom_analyzer

async def get_risk_calculator():
    if risk_calculator is None:
        raise HTTPException(status_code=503, detail="Risk calculator not initialized")
    return risk_calculator

async def get_data_preprocessor():
    if data_preprocessor is None:
        raise HTTPException(status_code=503, detail="Data preprocessor not initialized")
    return data_preprocessor

async def get_db_manager():
    if db_manager is None:
        raise HTTPException(status_code=503, detail="Database manager not initialized")
    return db_manager

@app.get("/")
async def root():
    return {"message": "MediCare Symptom Checker API", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now(),
        "services": {
            "symptom_analyzer": symptom_analyzer is not None,
            "risk_calculator": risk_calculator is not None,
            "database": db_manager is not None
        }
    }

@app.post("/analyze-symptoms", response_model=AnalysisResult)
async def analyze_symptoms(
    symptoms: SymptomInput,
    analyzer: SymptomAnalyzer = Depends(get_symptom_analyzer),
    risk_calc: RiskCalculator = Depends(get_risk_calculator),
    preprocessor: DataPreprocessor = Depends(get_data_preprocessor),
    db: DatabaseManager = Depends(get_db_manager)
):
    """
    Analyze symptoms and provide risk assessment with recommendations
    """
    try:
        logger.info(f"Analyzing symptoms for patient: {symptoms.patient_id}")
        
        # Preprocess input data
        processed_data = await preprocessor.process_symptoms(symptoms)
        
        # Perform symptom analysis
        analysis = await analyzer.analyze(processed_data)
        
        # Calculate risk score
        risk_data = await risk_calc.calculate_risk(analysis, processed_data)
        
        # Generate recommendations
        recommendations = await analyzer.generate_recommendations(analysis, risk_data)
        
        # Create result
        result = AnalysisResult(
            condition=analysis['primary_condition'],
            risk_score=risk_data['risk_score'],
            confidence=analysis['confidence'],
            contributors=analysis['contributors'],
            recommendations=recommendations,
            urgency_level=risk_data['urgency_level'],
            follow_up_days=risk_data.get('follow_up_days'),
            analysis_id=analysis['analysis_id'],
            timestamp=datetime.now()
        )
        
        # Store analysis in database
        await db.store_analysis(symptoms, result)
        
        logger.info(f"Analysis completed successfully: {result.analysis_id}")
        return result
        
    except Exception as e:
        logger.error(f"Error analyzing symptoms: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/symptoms/history/{patient_id}")
async def get_symptom_history(
    patient_id: str,
    limit: int = 10,
    db: DatabaseManager = Depends(get_db_manager)
):
    """
    Get patient's symptom analysis history
    """
    try:
        history = await db.get_patient_history(patient_id, limit)
        return {"patient_id": patient_id, "history": history}
    except Exception as e:
        logger.error(f"Error fetching history for patient {patient_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch history")

@app.get("/analytics/dashboard", response_model=HealthMetrics)
async def get_dashboard_analytics(
    days: int = 30,
    db: DatabaseManager = Depends(get_db_manager)
):
    """
    Get analytics data for dashboard
    """
    try:
        metrics = await db.get_analytics(days)
        return HealthMetrics(**metrics)
    except Exception as e:
        logger.error(f"Error fetching analytics: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch analytics")

@app.get("/conditions/similar/{condition_name}")
async def get_similar_conditions(
    condition_name: str,
    analyzer: SymptomAnalyzer = Depends(get_symptom_analyzer)
):
    """
    Get conditions similar to the given condition
    """
    try:
        similar = await analyzer.get_similar_conditions(condition_name)
        return {"condition": condition_name, "similar_conditions": similar}
    except Exception as e:
        logger.error(f"Error finding similar conditions: {e}")
        raise HTTPException(status_code=500, detail="Failed to find similar conditions")

@app.post("/feedback")
async def submit_feedback(
    analysis_id: str,
    feedback: Dict[str, Any],
    db: DatabaseManager = Depends(get_db_manager)
):
    """
    Submit feedback for analysis improvement
    """
    try:
        await db.store_feedback(analysis_id, feedback)
        return {"message": "Feedback submitted successfully"}
    except Exception as e:
        logger.error(f"Error storing feedback: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit feedback")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )