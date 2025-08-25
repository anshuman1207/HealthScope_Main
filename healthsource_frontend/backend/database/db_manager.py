# database/db_manager.py
import asyncio
import asyncpg
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import os
from contextlib import asynccontextmanager
import pandas as pd

logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self):
        self.pool = None
        self.database_url = os.getenv(
            'DATABASE_URL', 
            'postgresql://user:password@localhost:5432/medicare_symptom_checker'
        )
    
    async def initialize(self):
        """Initialize database connection pool and create tables"""
        try:
            # Create connection pool
            self.pool = await asyncpg.create_pool(
                self.database_url,
                min_size=1,
                max_size=10,
                command_timeout=60
            )
            
            # Create tables
            await self._create_tables()
            logger.info("Database initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize database: {e}")
            # Fallback to in-memory storage
            self.pool = None
            logger.warning("Using in-memory storage as fallback")
    
    async def _create_tables(self):
        """Create necessary database tables"""
        if not self.pool:
            return
        
        async with self.pool.acquire() as conn:
            # Symptom analyses table
            await conn.execute('''
                CREATE TABLE IF NOT EXISTS symptom_analyses (
                    id SERIAL PRIMARY KEY,
                    analysis_id VARCHAR(255) UNIQUE NOT NULL,
                    patient_id VARCHAR(255),
                    primary_concern TEXT,
                    duration VARCHAR(100),
                    pain_level VARCHAR(100),
                    additional_symptoms JSONB,
                    medications JSONB,
                    age INTEGER,
                    gender VARCHAR(50),
                    medical_history JSONB,
                    condition_prediction VARCHAR(255),
                    risk_score INTEGER,
                    confidence FLOAT,
                    urgency_level VARCHAR(50),
                    contributors JSONB,
                    recommendations JSONB,
                    follow_up_days INTEGER,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Patient feedback table
            await conn.execute('''
                CREATE TABLE IF NOT EXISTS patient_feedback (
                    id SERIAL PRIMARY KEY,
                    analysis_id VARCHAR(255) REFERENCES symptom_analyses(analysis_id),
                    feedback_type VARCHAR(50),
                    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                    comments TEXT,
                    was_helpful BOOLEAN,
                    actual_diagnosis VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Analytics aggregation table
            await conn.execute('''
                CREATE TABLE IF NOT EXISTS analytics_summary (
                    id SERIAL PRIMARY KEY,
                    date DATE UNIQUE NOT NULL,
                    total_analyses INTEGER DEFAULT 0,
                    average_risk_score FLOAT DEFAULT 0,
                    common_conditions JSONB,
                    urgency_distribution JSONB,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            
            # Create indexes for better performance
            await conn.execute('''
                CREATE INDEX IF NOT EXISTS idx_patient_id ON symptom_analyses(patient_id);
                CREATE INDEX IF NOT EXISTS idx_created_at ON symptom_analyses(created_at);
                CREATE INDEX IF NOT EXISTS idx_condition ON symptom_analyses(condition_prediction);
                CREATE INDEX IF NOT EXISTS idx_urgency ON symptom_analyses(urgency_level);
            ''')
    
    async def store_analysis(self, symptom_input: Any, result: Any) -> bool:
        """Store symptom analysis result"""
        if not self.pool:
            # In-memory storage fallback
            return self._store_analysis_memory(symptom_input, result)
        
        try:
            async with self.pool.acquire() as conn:
                await conn.execute('''
                    INSERT INTO symptom_analyses (
                        analysis_id, patient_id, primary_concern, duration, pain_level,
                        additional_symptoms, medications, age, gender, medical_history,
                        condition_prediction, risk_score, confidence, urgency_level,
                        contributors, recommendations, follow_up_days
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                ''', 
                    result.analysis_id,
                    getattr(symptom_input, 'patient_id', None),
                    getattr(symptom_input, 'primary_concern', ''),
                    getattr(symptom_input, 'duration', ''),
                    getattr(symptom_input, 'pain_level', ''),
                    json.dumps(getattr(symptom_input, 'additional_symptoms', [])),
                    json.dumps(getattr(symptom_input, 'medications', '')),
                    getattr(symptom_input, 'age', None),
                    getattr(symptom_input, 'gender', None),
                    json.dumps(getattr(symptom_input, 'medical_history', [])),
                    result.condition,
                    result.risk_score,
                    result.confidence,
                    result.urgency_level,
                    json.dumps([c.dict() if hasattr(c, 'dict') else c for c in result.contributors]),
                    json.dumps([r.dict() if hasattr(r, 'dict') else r for r in result.recommendations]),
                    result.follow_up_days
                )
            
            # Update daily analytics
            await self._update_daily_analytics(result)
            return True
            
        except Exception as e:
            logger.error(f"Error storing analysis: {e}")
            return False
    
    async def get_patient_history(self, patient_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get patient's analysis history"""
        if not self.pool:
            return self._get_patient_history_memory(patient_id, limit)
        
        try:
            async with self.pool.acquire() as conn:
                rows = await conn.fetch('''
                    SELECT analysis_id, primary_concern, condition_prediction, risk_score,
                           urgency_level, created_at, follow_up_days
                    FROM symptom_analyses
                    WHERE patient_id = $1
                    ORDER BY created_at DESC
                    LIMIT $2
                ''', patient_id, limit)
                
                return [dict(row) for row in rows]
                
        except Exception as e:
            logger.error(f"Error fetching patient history: {e}")
            return []
    
    async def get_analytics(self, days: int = 30) -> Dict[str, Any]:
        """Get analytics data for dashboard"""
        if not self.pool:
            return self._get_analytics_memory(days)
        
        try:
            async with self.pool.acquire() as conn:
                end_date = datetime.now().date()
                start_date = end_date - timedelta(days=days)
                
                # Total analyses
                total_analyses = await conn.fetchval('''
                    SELECT COUNT(*) FROM symptom_analyses
                    WHERE created_at >= $1
                ''', start_date)
                
                # Average risk score
                avg_risk = await conn.fetchval('''
                    SELECT AVG(risk_score) FROM symptom_analyses
                    WHERE created_at >= $1
                ''', start_date)
                
                # Common conditions
                condition_data = await conn.fetch('''
                    SELECT condition_prediction, COUNT(*) as count
                    FROM symptom_analyses
                    WHERE created_at >= $1
                    GROUP BY condition_prediction
                    ORDER BY count DESC
                    LIMIT 10
                ''', start_date)
                
                common_conditions = [
                    {"condition": row["condition_prediction"], "count": row["count"]}
                    for row in condition_data
                ]
                
                # Urgency distribution
                urgency_data = await conn.fetch('''
                    SELECT urgency_level, COUNT(*) as count
                    FROM symptom_analyses
                    WHERE created_at >= $1
                    GROUP BY urgency_level
                ''', start_date)
                
                urgency_distribution = {
                    row["urgency_level"]: row["count"]
                    for row in urgency_data
                }
                
                return {
                    "total_analyses": total_analyses or 0,
                    "average_risk_score": float(avg_risk) if avg_risk else 0.0,
                    "common_conditions": common_conditions,
                    "urgency_distribution": urgency_distribution
                }
                
        except Exception as e:
            logger.error(f"Error fetching analytics: {e}")
            return {
                "total_analyses": 0,
                "average_risk_score": 0.0,
                "common_conditions": [],
                "urgency_distribution": {}
            }
    
    async def store_feedback(self, analysis_id: str, feedback: Dict[str, Any]) -> bool:
        """Store patient feedback"""
        if not self.pool:
            return self._store_feedback_memory(analysis_id, feedback)
        
        try:
            async with self.pool.acquire() as conn:
                await conn.execute('''
                    INSERT INTO patient_feedback (
                        analysis_id, feedback_type, rating, comments,
                        was_helpful, actual_diagnosis
                    ) VALUES ($1, $2, $3, $4, $5, $6)
                ''',
                    analysis_id,
                    feedback.get('type', 'general'),
                    feedback.get('rating'),
                    feedback.get('comments', ''),
                    feedback.get('was_helpful'),
                    feedback.get('actual_diagnosis')
                )
            return True
            
        except Exception as e:
            logger.error(f"Error storing feedback: {e}")
            return False
    
    async def _update_daily_analytics(self, result: Any):
        """Update daily analytics summary"""
        if not self.pool:
            return
        
        try:
            today = datetime.now().date()
            
            async with self.pool.acquire() as conn:
                # Check if record exists for today
                existing = await conn.fetchrow('''
                    SELECT * FROM analytics_summary WHERE date = $1
                ''', today)
                
                if existing:
                    # Update existing record
                    await conn.execute('''
                        UPDATE analytics_summary SET
                            total_analyses = total_analyses + 1,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE date = $1
                    ''', today)
                else:
                    # Create new record
                    await conn.execute('''
                        INSERT INTO analytics_summary (date, total_analyses)
                        VALUES ($1, 1)
                    ''', today)
                    
        except Exception as e:
            logger.error(f"Error updating daily analytics: {e}")
    
    async def close(self):
        """Close database connection pool"""
        if self.pool:
            await self.pool.close()
    
    # In-memory storage fallback methods
    def __init_memory_storage(self):
        """Initialize in-memory storage"""
        if not hasattr(self, '_memory_storage'):
            self._memory_storage = {
                'analyses': [],
                'feedback': [],
                'patient_history': {}
            }
    
    def _store_analysis_memory(self, symptom_input: Any, result: Any) -> bool:
        """Store analysis in memory"""
        self.__init_memory_storage()
        
        try:
            analysis_data = {
                'analysis_id': result.analysis_id,
                'patient_id': getattr(symptom_input, 'patient_id', None),
                'primary_concern': getattr(symptom_input, 'primary_concern', ''),
                'condition': result.condition,
                'risk_score': result.risk_score,
                'urgency_level': result.urgency_level,
                'created_at': datetime.now(),
                'contributors': result.contributors,
                'recommendations': result.recommendations
            }
            
            self._memory_storage['analyses'].append(analysis_data)
            
            # Store in patient history
            patient_id = analysis_data['patient_id']
            if patient_id:
                if patient_id not in self._memory_storage['patient_history']:
                    self._memory_storage['patient_history'][patient_id] = []
                self._memory_storage['patient_history'][patient_id].append(analysis_data)
            
            return True
            
        except Exception as e:
            logger.error(f"Error storing analysis in memory: {e}")
            return False
    
    def _get_patient_history_memory(self, patient_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get patient history from memory"""
        self.__init_memory_storage()
        
        history = self._memory_storage['patient_history'].get(patient_id, [])
        # Sort by created_at descending and limit
        history.sort(key=lambda x: x['created_at'], reverse=True)
        
        return history[:limit]
    
    def _get_analytics_memory(self, days: int = 30) -> Dict[str, Any]:
        """Get analytics from memory"""
        self.__init_memory_storage()
        
        analyses = self._memory_storage['analyses']
        
        if not analyses:
            return {
                "total_analyses": 0,
                "average_risk_score": 0.0,
                "common_conditions": [],
                "urgency_distribution": {}
            }
        
        # Filter by date range
        cutoff_date = datetime.now() - timedelta(days=days)
        recent_analyses = [a for a in analyses if a['created_at'] >= cutoff_date]
        
        # Calculate metrics
        total_analyses = len(recent_analyses)
        avg_risk = sum(a['risk_score'] for a in recent_analyses) / total_analyses if total_analyses > 0 else 0
        
        # Common conditions
        condition_counts = {}
        urgency_counts = {}
        
        for analysis in recent_analyses:
            condition = analysis['condition']
            urgency = analysis['urgency_level']
            
            condition_counts[condition] = condition_counts.get(condition, 0) + 1
            urgency_counts[urgency] = urgency_counts.get(urgency, 0) + 1
        
        common_conditions = [
            {"condition": condition, "count": count}
            for condition, count in sorted(condition_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        ]
        
        return {
            "total_analyses": total_analyses,
            "average_risk_score": round(avg_risk, 2),
            "common_conditions": common_conditions,
            "urgency_distribution": urgency_counts
        }
    
    def _store_feedback_memory(self, analysis_id: str, feedback: Dict[str, Any]) -> bool:
        """Store feedback in memory"""
        self.__init_memory_storage()
        
        try:
            feedback_data = {
                'analysis_id': analysis_id,
                'feedback': feedback,
                'created_at': datetime.now()
            }
            
            self._memory_storage['feedback'].append(feedback_data)
            return True
            
        except Exception as e:
            logger.error(f"Error storing feedback in memory: {e}")
            return False