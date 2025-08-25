# models/symptom_analyzer.py
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sentence_transformers import SentenceTransformer
import pickle
import joblib
import json
import uuid
from typing import Dict, List, Any
import logging
import asyncio
from pathlib import Path

logger = logging.getLogger(__name__)

class SymptomAnalyzer:
    def __init__(self):
        self.primary_model = None
        self.text_vectorizer = None
        self.symptom_encoder = None
        self.scaler = None
        self.sentence_model = None
        self.condition_mappings = {}
        self.symptom_database = {}
        self.model_path = Path("models/trained_models")
        self.model_path.mkdir(parents=True, exist_ok=True)
        
    async def load_models(self):
        """Load pre-trained models or train new ones if not available"""
        try:
            # Try to load existing models
            if self._models_exist():
                await self._load_existing_models()
                logger.info("Loaded existing models")
            else:
                # Train new models with sample data
                await self._create_and_train_models()
                logger.info("Created and trained new models")
                
        except Exception as e:
            logger.error(f"Error loading models: {e}")
            # Fallback to creating new models
            await self._create_and_train_models()
    
    def _models_exist(self) -> bool:
        """Check if trained models exist"""
        required_files = [
            "primary_model.pkl",
            "vectorizer.pkl",
            "encoder.pkl",
            "scaler.pkl",
            "condition_mappings.json"
        ]
        return all((self.model_path / file).exists() for file in required_files)
    
    async def _load_existing_models(self):
        """Load existing trained models"""
        self.primary_model = joblib.load(self.model_path / "primary_model.pkl")
        self.text_vectorizer = joblib.load(self.model_path / "vectorizer.pkl")
        self.symptom_encoder = joblib.load(self.model_path / "encoder.pkl")
        self.scaler = joblib.load(self.model_path / "scaler.pkl")
        
        with open(self.model_path / "condition_mappings.json", 'r') as f:
            self.condition_mappings = json.load(f)
            
        # Load sentence transformer for semantic similarity
        try:
            self.sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            logger.warning(f"Could not load sentence transformer: {e}")
    
    async def _create_and_train_models(self):
        """Create and train models with comprehensive medical data"""
        logger.info("Creating training dataset...")
        
        # Create comprehensive training data
        training_data = self._create_comprehensive_training_data()
        
        # Prepare features and targets
        X, y = self._prepare_training_data(training_data)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Train models
        logger.info("Training models...")
        self.primary_model = GradientBoostingClassifier(
            n_estimators=200,
            learning_rate=0.1,
            max_depth=6,
            random_state=42
        )
        self.primary_model.fit(X_train, y_train)
        
        # Evaluate model
        y_pred = self.primary_model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        logger.info(f"Model accuracy: {accuracy:.3f}")
        
        # Save models
        await self._save_models()
        
        # Load sentence transformer
        try:
            self.sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            logger.warning(f"Could not load sentence transformer: {e}")
    
    def _create_comprehensive_training_data(self) -> pd.DataFrame:
        """Create comprehensive training data with medical conditions and symptoms"""
        
        # Comprehensive medical conditions with symptoms
        medical_data = [
            # Respiratory conditions
            {
                'primary_concern': 'persistent cough with fever',
                'duration': '1-3 days',
                'pain_level': 'Mild pain (1-3/10)',
                'additional_symptoms': ['Fever', 'Fatigue', 'Headache'],
                'condition': 'Upper Respiratory Infection',
                'severity': 'moderate'
            },
            {
                'primary_concern': 'severe chest pain and shortness of breath',
                'duration': 'Less than 24 hours',
                'pain_level': 'Severe pain (7-8/10)',
                'additional_symptoms': ['Chest pain', 'Shortness of breath', 'Dizziness'],
                'condition': 'Acute Chest Pain Syndrome',
                'severity': 'high'
            },
            
            # Gastrointestinal conditions
            {
                'primary_concern': 'severe stomach pain and nausea',
                'duration': '4-7 days',
                'pain_level': 'Severe pain (7-8/10)',
                'additional_symptoms': ['Nausea', 'Abdominal pain', 'Fever'],
                'condition': 'Gastroenteritis',
                'severity': 'moderate'
            },
            {
                'primary_concern': 'chronic abdominal discomfort',
                'duration': 'More than 2 weeks',
                'pain_level': 'Moderate pain (4-6/10)',
                'additional_symptoms': ['Abdominal pain', 'Fatigue'],
                'condition': 'Irritable Bowel Syndrome',
                'severity': 'low'
            },
            
            # Neurological conditions
            {
                'primary_concern': 'severe headache with sensitivity to light',
                'duration': '1-2 weeks',
                'pain_level': 'Severe pain (7-8/10)',
                'additional_symptoms': ['Headache', 'Nausea', 'Dizziness'],
                'condition': 'Migraine',
                'severity': 'moderate'
            },
            {
                'primary_concern': 'sudden severe headache',
                'duration': 'Less than 24 hours',
                'pain_level': 'Extreme pain (9-10/10)',
                'additional_symptoms': ['Headache', 'Nausea', 'Dizziness'],
                'condition': 'Acute Headache Syndrome',
                'severity': 'high'
            },
            
            # Cardiovascular conditions
            {
                'primary_concern': 'chest tightness with exercise',
                'duration': '1-2 weeks',
                'pain_level': 'Moderate pain (4-6/10)',
                'additional_symptoms': ['Chest pain', 'Shortness of breath', 'Fatigue'],
                'condition': 'Angina',
                'severity': 'moderate'
            },
            
            # Infectious diseases
            {
                'primary_concern': 'high fever with body aches',
                'duration': '1-3 days',
                'pain_level': 'Moderate pain (4-6/10)',
                'additional_symptoms': ['Fever', 'Headache', 'Fatigue'],
                'condition': 'Viral Syndrome',
                'severity': 'moderate'
            },
            
            # Musculoskeletal conditions
            {
                'primary_concern': 'joint pain and stiffness',
                'duration': 'More than 2 weeks',
                'pain_level': 'Moderate pain (4-6/10)',
                'additional_symptoms': ['Fatigue'],
                'condition': 'Arthritis',
                'severity': 'low'
            },
            
            # Add more variations and conditions
            {
                'primary_concern': 'difficulty breathing at night',
                'duration': '4-7 days',
                'pain_level': 'Mild pain (1-3/10)',
                'additional_symptoms': ['Shortness of breath', 'Fatigue'],
                'condition': 'Asthma Exacerbation',
                'severity': 'moderate'
            }
        ]
        
        # Generate more variations
        base_conditions = len(medical_data)
        for i in range(base_conditions):
            original = medical_data[i].copy()
            
            # Create variations with different symptom combinations
            variations = [
                {**original, 'duration': '1-2 weeks', 'additional_symptoms': original['additional_symptoms'][:2]},
                {**original, 'pain_level': 'Mild pain (1-3/10)', 'additional_symptoms': original['additional_symptoms'] + ['Dizziness']},
                {**original, 'duration': 'More than 2 weeks', 'severity': 'low' if original['severity'] != 'low' else 'moderate'}
            ]
            medical_data.extend(variations)
        
        return pd.DataFrame(medical_data)
    
    def _prepare_training_data(self, data: pd.DataFrame) -> tuple:
        """Prepare features and targets for training"""
        
        # Initialize encoders and vectorizers
        self.text_vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
        self.symptom_encoder = LabelEncoder()
        self.scaler = StandardScaler()
        
        # Text features
        text_features = self.text_vectorizer.fit_transform(data['primary_concern']).toarray()
        
        # Duration encoding
        duration_map = {
            'Less than 24 hours': 0, '1-3 days': 1, '4-7 days': 2, 
            '1-2 weeks': 3, 'More than 2 weeks': 4
        }
        duration_features = data['duration'].map(duration_map).values.reshape(-1, 1)
        
        # Pain level encoding
        pain_map = {
            'No pain (0/10)': 0, 'Mild pain (1-3/10)': 2, 'Moderate pain (4-6/10)': 5,
            'Severe pain (7-8/10)': 7.5, 'Extreme pain (9-10/10)': 9.5
        }
        pain_features = data['pain_level'].fillna('No pain (0/10)').map(pain_map).values.reshape(-1, 1)
        
        # Additional symptoms count
        symptom_count = data['additional_symptoms'].apply(len).values.reshape(-1, 1)
        
        # Combine features
        numerical_features = np.hstack([duration_features, pain_features, symptom_count])
        numerical_features = self.scaler.fit_transform(numerical_features)
        
        X = np.hstack([text_features, numerical_features])
        
        # Prepare targets
        self.condition_mappings = {condition: idx for idx, condition in enumerate(data['condition'].unique())}
        y = data['condition'].map(self.condition_mappings)
        
        return X, y
    
    async def _save_models(self):
        """Save trained models to disk"""
        joblib.dump(self.primary_model, self.model_path / "primary_model.pkl")
        joblib.dump(self.text_vectorizer, self.model_path / "vectorizer.pkl")
        joblib.dump(self.symptom_encoder, self.model_path / "encoder.pkl")
        joblib.dump(self.scaler, self.model_path / "scaler.pkl")
        
        with open(self.model_path / "condition_mappings.json", 'w') as f:
            json.dump(self.condition_mappings, f)
    
    async def analyze(self, processed_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze symptoms and predict condition"""
        try:
            # Extract features
            features = self._extract_features(processed_data)
            
            # Get predictions
            probabilities = self.primary_model.predict_proba(features)[0]
            predicted_class = self.primary_model.predict(features)[0]
            
            # Get condition name
            reverse_mappings = {v: k for k, v in self.condition_mappings.items()}
            primary_condition = reverse_mappings.get(predicted_class, "Unknown Condition")
            
            # Calculate confidence
            confidence = float(np.max(probabilities))
            
            # Generate contributors
            contributors = self._generate_contributors(processed_data, probabilities)
            
            analysis_id = str(uuid.uuid4())
            
            return {
                'primary_condition': primary_condition,
                'confidence': confidence,
                'contributors': contributors,
                'analysis_id': analysis_id,
                'probabilities': probabilities.tolist(),
                'all_conditions': [reverse_mappings.get(i, f"Condition_{i}") for i in range(len(probabilities))]
            }
            
        except Exception as e:
            logger.error(f"Error in analysis: {e}")
            # Return fallback analysis
            return {
                'primary_condition': self._get_fallback_condition(processed_data),
                'confidence': 0.5,
                'contributors': self._generate_fallback_contributors(processed_data),
                'analysis_id': str(uuid.uuid4()),
                'probabilities': [],
                'all_conditions': []
            }
    
    def _extract_features(self, processed_data: Dict[str, Any]) -> np.ndarray:
        """Extract features from processed data"""
        # Text features
        text_features = self.text_vectorizer.transform([processed_data['primary_concern']]).toarray()
        
        # Duration features
        duration_map = {
            'Less than 24 hours': 0, '1-3 days': 1, '4-7 days': 2,
            '1-2 weeks': 3, 'More than 2 weeks': 4
        }
        duration_val = duration_map.get(processed_data['duration'], 2)
        
        # Pain features
        pain_map = {
            'No pain (0/10)': 0, 'Mild pain (1-3/10)': 2, 'Moderate pain (4-6/10)': 5,
            'Severe pain (7-8/10)': 7.5, 'Extreme pain (9-10/10)': 9.5
        }
        pain_val = pain_map.get(processed_data.get('pain_level', 'No pain (0/10)'), 0)
        
        # Symptom count
        symptom_count = len(processed_data.get('additional_symptoms', []))
        
        # Numerical features
        numerical_features = np.array([[duration_val, pain_val, symptom_count]])
        numerical_features = self.scaler.transform(numerical_features)
        
        # Combine features
        return np.hstack([text_features, numerical_features])
    
    def _generate_contributors(self, processed_data: Dict[str, Any], probabilities: np.ndarray) -> List[Dict[str, Any]]:
        """Generate contributor factors based on input data"""
        contributors = []
        
        # Primary concern contribution
        if processed_data.get('primary_concern'):
            contributors.append({
                'factor': f"Primary symptom: {processed_data['primary_concern'][:50]}...",
                'impact': min(0.4, np.max(probabilities))
            })
        
        # Duration contribution
        duration_impacts = {
            'Less than 24 hours': 0.3, '1-3 days': 0.25, '4-7 days': 0.2,
            '1-2 weeks': 0.15, 'More than 2 weeks': 0.1
        }
        duration = processed_data.get('duration', '')
        if duration:
            contributors.append({
                'factor': f"Symptom duration: {duration}",
                'impact': duration_impacts.get(duration, 0.1)
            })
        
        # Pain level contribution
        pain_level = processed_data.get('pain_level', '')
        if pain_level and 'No pain' not in pain_level:
            pain_impacts = {
                'Mild pain (1-3/10)': 0.1, 'Moderate pain (4-6/10)': 0.2,
                'Severe pain (7-8/10)': 0.3, 'Extreme pain (9-10/10)': 0.4
            }
            contributors.append({
                'factor': f"Pain level: {pain_level}",
                'impact': pain_impacts.get(pain_level, 0.1)
            })
        
        # Additional symptoms
        additional_symptoms = processed_data.get('additional_symptoms', [])
        if additional_symptoms:
            impact_per_symptom = min(0.3 / len(additional_symptoms), 0.1)
            for symptom in additional_symptoms[:3]:  # Top 3 symptoms
                contributors.append({
                    'factor': f"Additional symptom: {symptom}",
                    'impact': impact_per_symptom
                })
        
        # Normalize impacts
        total_impact = sum(c['impact'] for c in contributors)
        if total_impact > 1.0:
            for contributor in contributors:
                contributor['impact'] = contributor['impact'] / total_impact
        
        return contributors[:5]  # Return top 5 contributors
    
    def _get_fallback_condition(self, processed_data: Dict[str, Any]) -> str:
        """Get fallback condition based on symptoms"""
        concern = processed_data.get('primary_concern', '').lower()
        additional = processed_data.get('additional_symptoms', [])
        
        # Simple keyword-based fallback
        if any(word in concern for word in ['cough', 'cold', 'fever']):
            return "Upper Respiratory Infection"
        elif any(word in concern for word in ['stomach', 'nausea', 'abdominal']):
            return "Gastrointestinal Issue"
        elif any(word in concern for word in ['headache', 'head pain']):
            return "Headache Syndrome"
        elif any(word in concern for word in ['chest', 'heart', 'breathing']):
            return "Chest Pain Syndrome"
        else:
            return "General Health Concern"
    
    def _generate_fallback_contributors(self, processed_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate fallback contributors"""
        return [
            {'factor': 'Primary concern', 'impact': 0.4},
            {'factor': f"Duration: {processed_data.get('duration', 'Unknown')}", 'impact': 0.3},
            {'factor': 'Symptom pattern', 'impact': 0.2},
            {'factor': 'Patient history', 'impact': 0.1}
        ]
    
    async def generate_recommendations(self, analysis: Dict[str, Any], risk_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate recommendations based on analysis and risk"""
        recommendations = []
        
        condition = analysis['primary_condition']
        urgency = risk_data.get('urgency_level', 'routine')
        risk_score = risk_data.get('risk_score', 50)
        
        # Base recommendations by condition type
        condition_recommendations = {
            'Upper Respiratory Infection': [
                {'text': 'Rest and stay hydrated', 'priority': 'high', 'category': 'self-care'},
                {'text': 'Use throat lozenges for comfort', 'priority': 'medium', 'category': 'symptom-relief'},
                {'text': 'Monitor symptoms for 48-72 hours', 'priority': 'high', 'category': 'monitoring'},
                {'text': 'Avoid smoking and irritants', 'priority': 'medium', 'category': 'prevention'}
            ],
            'Gastroenteritis': [
                {'text': 'Stay hydrated with clear fluids', 'priority': 'high', 'category': 'self-care'},
                {'text': 'Follow BRAT diet (Bananas, Rice, Applesauce, Toast)', 'priority': 'high', 'category': 'dietary'},
                {'text': 'Rest and avoid solid foods initially', 'priority': 'medium', 'category': 'self-care'},
                {'text': 'Monitor for dehydration signs', 'priority': 'high', 'category': 'monitoring'}
            ],
            'Migraine': [
                {'text': 'Rest in a dark, quiet room', 'priority': 'high', 'category': 'self-care'},
                {'text': 'Apply cold compress to head', 'priority': 'medium', 'category': 'symptom-relief'},
                {'text': 'Stay hydrated and avoid triggers', 'priority': 'high', 'category': 'prevention'},
                {'text': 'Consider over-the-counter pain relief', 'priority': 'medium', 'category': 'medication'}
            ],
            'Chest Pain Syndrome': [
                {'text': 'Seek immediate medical attention', 'priority': 'high', 'category': 'emergency'},
                {'text': 'Avoid physical exertion', 'priority': 'high', 'category': 'activity'},
                {'text': 'Monitor vital signs', 'priority': 'high', 'category': 'monitoring'},
                {'text': 'Have someone stay with you', 'priority': 'medium', 'category': 'safety'}
            ]
        }
        
        # Get condition-specific recommendations
        base_recommendations = condition_recommendations.get(condition, [
            {'text': 'Monitor symptoms closely', 'priority': 'high', 'category': 'monitoring'},
            {'text': 'Rest and stay hydrated', 'priority': 'medium', 'category': 'self-care'},
            {'text': 'Consult healthcare provider if symptoms worsen', 'priority': 'medium', 'category': 'medical'}
        ])
        
        recommendations.extend(base_recommendations)
        
        # Add urgency-based recommendations
        if urgency == 'emergency':
            recommendations.insert(0, {
                'text': 'Seek immediate emergency medical care', 
                'priority': 'high', 
                'category': 'emergency'
            })
        elif urgency == 'urgent':
            recommendations.append({
                'text': 'Schedule urgent medical consultation within 24 hours', 
                'priority': 'high', 
                'category': 'medical'
            })
        elif risk_score > 70:
            recommendations.append({
                'text': 'Consider medical evaluation within 2-3 days', 
                'priority': 'medium', 
                'category': 'medical'
            })
        
        # Add general recommendations
        recommendations.extend([
            {'text': 'Keep a symptom diary', 'priority': 'low', 'category': 'tracking'},
            {'text': 'Maintain good hygiene', 'priority': 'low', 'category': 'prevention'}
        ])
        
        return recommendations[:6]  # Return top 6 recommendations
    
    async def get_similar_conditions(self, condition_name: str) -> List[Dict[str, Any]]:
        """Get conditions similar to the given condition"""
        try:
            if not self.sentence_model:
                return []
            
            # Get embedding for input condition
            condition_embedding = self.sentence_model.encode([condition_name])
            
            # Get embeddings for all known conditions
            all_conditions = list(self.condition_mappings.keys())
            condition_embeddings = self.sentence_model.encode(all_conditions)
            
            # Calculate similarities
            from sklearn.metrics.pairwise import cosine_similarity
            similarities = cosine_similarity(condition_embedding, condition_embeddings)[0]
            
            # Get top similar conditions
            similar_indices = np.argsort(similarities)[::-1][1:6]  # Exclude self
            
            similar_conditions = []
            for idx in similar_indices:
                if similarities[idx] > 0.3:  # Threshold for similarity
                    similar_conditions.append({
                        'condition': all_conditions[idx],
                        'similarity': float(similarities[idx])
                    })
            
            return similar_conditions
            
        except Exception as e:
            logger.error(f"Error finding similar conditions: {e}")
            return []