# models/risk_calculator.py
import numpy as np
import pandas as pd
from typing import Dict, List, Any, Optional
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

class RiskCalculator:
    def __init__(self):
        self.risk_factors = {}
        self.urgency_thresholds = {
            'emergency': 85,
            'urgent': 70,
            'routine': 40,
            'monitoring': 0
        }
        self.condition_risk_profiles = {}
        self._initialize_risk_profiles()
    
    async def initialize(self):
        """Initialize risk calculation parameters"""
        self._setup_condition_risk_profiles()
        self._setup_symptom_risk_weights()
        logger.info("Risk calculator initialized successfully")
    
    def _initialize_risk_profiles(self):
        """Initialize risk profiles for different conditions"""
        self.condition_risk_profiles = {
            'Upper Respiratory Infection': {
                'base_risk': 25,
                'age_multiplier': 0.5,
                'duration_multiplier': 0.3,
                'severity_multiplier': 0.8,
                'comorbidity_multiplier': 1.2
            },
            'Acute Chest Pain Syndrome': {
                'base_risk': 75,
                'age_multiplier': 1.5,
                'duration_multiplier': 1.0,
                'severity_multiplier': 1.5,
                'comorbidity_multiplier': 1.8
            },
            'Gastroenteritis': {
                'base_risk': 35,
                'age_multiplier': 0.8,
                'duration_multiplier': 0.5,
                'severity_multiplier': 1.0,
                'comorbidity_multiplier': 1.3
            },
            'Migraine': {
                'base_risk': 30,
                'age_multiplier': 0.3,
                'duration_multiplier': 0.4,
                'severity_multiplier': 1.2,
                'comorbidity_multiplier': 1.1
            },
            'Angina': {
                'base_risk': 65,
                'age_multiplier': 1.3,
                'duration_multiplier': 0.8,
                'severity_multiplier': 1.4,
                'comorbidity_multiplier': 1.7
            },
            'Viral Syndrome': {
                'base_risk': 20,
                'age_multiplier': 0.6,
                'duration_multiplier': 0.3,
                'severity_multiplier': 0.9,
                'comorbidity_multiplier': 1.2
            },
            'Arthritis': {
                'base_risk': 15,
                'age_multiplier': 0.4,
                'duration_multiplier': 0.2,
                'severity_multiplier': 0.7,
                'comorbidity_multiplier': 1.1
            },
            'Asthma Exacerbation': {
                'base_risk': 55,
                'age_multiplier': 0.9,
                'duration_multiplier': 0.7,
                'severity_multiplier': 1.3,
                'comorbidity_multiplier': 1.5
            },
            'Irritable Bowel Syndrome': {
                'base_risk': 20,
                'age_multiplier': 0.2,
                'duration_multiplier': 0.1,
                'severity_multiplier': 0.6,
                'comorbidity_multiplier': 1.0
            },
            'Acute Headache Syndrome': {
                'base_risk': 60,
                'age_multiplier': 0.7,
                'duration_multiplier': 1.2,
                'severity_multiplier': 1.4,
                'comorbidity_multiplier': 1.3
            }
        }
    
    def _setup_condition_risk_profiles(self):
        """Setup detailed condition risk profiles"""
        # Add more detailed risk factors for each condition
        pass
    
    def _setup_symptom_risk_weights(self):
        """Setup risk weights for different symptoms"""
        self.symptom_risk_weights = {
            'Chest pain': 15,
            'Shortness of breath': 12,
            'Severe pain': 10,
            'Extreme pain': 20,
            'Fever': 8,
            'Dizziness': 6,
            'Nausea': 4,
            'Headache': 5,
            'Abdominal pain': 7,
            'Fatigue': 3
        }
    
    async def calculate_risk(self, analysis: Dict[str, Any], processed_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate comprehensive risk score and urgency level"""
        try:
            condition = analysis['primary_condition']
            confidence = analysis['confidence']
            
            # Get base risk for condition
            risk_profile = self.condition_risk_profiles.get(condition, {
                'base_risk': 40,
                'age_multiplier': 0.5,
                'duration_multiplier': 0.5,
                'severity_multiplier': 1.0,
                'comorbidity_multiplier': 1.2
            })
            
            base_risk = risk_profile['base_risk']
            
            # Calculate risk modifiers
            age_modifier = self._calculate_age_modifier(processed_data, risk_profile)
            duration_modifier = self._calculate_duration_modifier(processed_data, risk_profile)
            severity_modifier = self._calculate_severity_modifier(processed_data, risk_profile)
            symptom_modifier = self._calculate_symptom_modifier(processed_data)
            comorbidity_modifier = self._calculate_comorbidity_modifier(processed_data, risk_profile)
            confidence_modifier = self._calculate_confidence_modifier(confidence)
            
            # Calculate final risk score
            risk_score = base_risk * (
                1 + age_modifier + duration_modifier + severity_modifier + 
                symptom_modifier + comorbidity_modifier + confidence_modifier
            )
            
            # Ensure risk score is within bounds
            risk_score = max(0, min(100, int(risk_score)))
            
            # Determine urgency level
            urgency_level = self._determine_urgency_level(risk_score, condition, processed_data)
            
            # Calculate follow-up timeline
            follow_up_days = self._calculate_follow_up_days(urgency_level, risk_score)
            
            # Generate risk breakdown
            risk_breakdown = self._generate_risk_breakdown(
                base_risk, age_modifier, duration_modifier, severity_modifier,
                symptom_modifier, comorbidity_modifier, confidence_modifier
            )
            
            return {
                'risk_score': risk_score,
                'urgency_level': urgency_level,
                'follow_up_days': follow_up_days,
                'risk_breakdown': risk_breakdown,
                'risk_factors': self._identify_primary_risk_factors(processed_data, condition)
            }
            
        except Exception as e:
            logger.error(f"Error calculating risk: {e}")
            return {
                'risk_score': 50,
                'urgency_level': 'routine',
                'follow_up_days': 7,
                'risk_breakdown': {},
                'risk_factors': ['Unable to calculate detailed risk factors']
            }
    
    def _calculate_age_modifier(self, processed_data: Dict[str, Any], risk_profile: Dict[str, Any]) -> float:
        """Calculate age-based risk modifier"""
        age = processed_data.get('age')
        if not age:
            return 0.0
        
        age_multiplier = risk_profile.get('age_multiplier', 0.5)
        
        if age < 2:
            return 0.3 * age_multiplier  # Infants
        elif age < 18:
            return 0.1 * age_multiplier  # Children
        elif age < 65:
            return 0.0 * age_multiplier  # Adults
        elif age < 75:
            return 0.2 * age_multiplier  # Seniors
        else:
            return 0.4 * age_multiplier  # Elderly
    
    def _calculate_duration_modifier(self, processed_data: Dict[str, Any], risk_profile: Dict[str, Any]) -> float:
        """Calculate duration-based risk modifier"""
        duration = processed_data.get('duration', '')
        duration_multiplier = risk_profile.get('duration_multiplier', 0.5)
        
        duration_modifiers = {
            'Less than 24 hours': 0.2,
            '1-3 days': 0.1,
            '4-7 days': 0.0,
            '1-2 weeks': -0.1,
            'More than 2 weeks': -0.2
        }
        
        return duration_modifiers.get(duration, 0.0) * duration_multiplier
    
    def _calculate_severity_modifier(self, processed_data: Dict[str, Any], risk_profile: Dict[str, Any]) -> float:
        """Calculate severity-based risk modifier"""
        pain_level = processed_data.get('pain_level', 'No pain (0/10)')
        severity_multiplier = risk_profile.get('severity_multiplier', 1.0)
        
        severity_modifiers = {
            'No pain (0/10)': 0.0,
            'Mild pain (1-3/10)': 0.1,
            'Moderate pain (4-6/10)': 0.2,
            'Severe pain (7-8/10)': 0.4,
            'Extreme pain (9-10/10)': 0.6
        }
        
        return severity_modifiers.get(pain_level, 0.0) * severity_multiplier
    
    def _calculate_symptom_modifier(self, processed_data: Dict[str, Any]) -> float:
        """Calculate symptom-based risk modifier"""
        additional_symptoms = processed_data.get('additional_symptoms', [])
        
        if not additional_symptoms:
            return 0.0
        
        total_symptom_risk = 0
        for symptom in additional_symptoms:
            risk_weight = self.symptom_risk_weights.get(symptom, 2)
            total_symptom_risk += risk_weight
        
        # Normalize by dividing by 100 (max expected symptom risk)
        return min(0.3, total_symptom_risk / 100.0)
    
    def _calculate_comorbidity_modifier(self, processed_data: Dict[str, Any], risk_profile: Dict[str, Any]) -> float:
        """Calculate comorbidity-based risk modifier"""
        medical_history = processed_data.get('medical_history', [])
        comorbidity_multiplier = risk_profile.get('comorbidity_multiplier', 1.2)
        
        if not medical_history:
            return 0.0
        
        # High-risk conditions
        high_risk_conditions = [
            'diabetes', 'heart disease', 'hypertension', 'copd', 
            'asthma', 'cancer', 'kidney disease', 'liver disease'
        ]
        
        risk_count = 0
        for condition in medical_history:
            if any(high_risk in condition.lower() for high_risk in high_risk_conditions):
                risk_count += 1
        
        return min(0.4, risk_count * 0.1) * (comorbidity_multiplier - 1.0)
    
    def _calculate_confidence_modifier(self, confidence: float) -> float:
        """Calculate confidence-based risk modifier"""
        if confidence < 0.5:
            return 0.1  # Lower confidence increases risk slightly
        elif confidence > 0.8:
            return -0.05  # High confidence decreases risk slightly
        return 0.0
    
    def _determine_urgency_level(self, risk_score: int, condition: str, processed_data: Dict[str, Any]) -> str:
        """Determine urgency level based on risk score and specific indicators"""
        
        # Emergency conditions override risk score
        emergency_conditions = ['Acute Chest Pain Syndrome', 'Acute Headache Syndrome']
        emergency_symptoms = ['Chest pain', 'Extreme pain (9-10/10)', 'Shortness of breath']
        
        if condition in emergency_conditions:
            return 'emergency'
        
        additional_symptoms = processed_data.get('additional_symptoms', [])
        pain_level = processed_data.get('pain_level', '')
        
        if any(symptom in emergency_symptoms for symptom in additional_symptoms + [pain_level]):
            return 'emergency'
        
        # Standard risk score thresholds
        if risk_score >= self.urgency_thresholds['emergency']:
            return 'emergency'
        elif risk_score >= self.urgency_thresholds['urgent']:
            return 'urgent'
        elif risk_score >= self.urgency_thresholds['routine']:
            return 'routine'
        else:
            return 'monitoring'
    
    def _calculate_follow_up_days(self, urgency_level: str, risk_score: int) -> Optional[int]:
        """Calculate recommended follow-up timeline"""
        follow_up_map = {
            'emergency': None,  # Immediate care
            'urgent': 1,
            'routine': 7 if risk_score > 50 else 14,
            'monitoring': 14
        }
        
        return follow_up_map.get(urgency_level, 7)
    
    def _generate_risk_breakdown(self, base_risk: float, age_mod: float, duration_mod: float, 
                               severity_mod: float, symptom_mod: float, comorbidity_mod: float, 
                               confidence_mod: float) -> Dict[str, float]:
        """Generate detailed risk breakdown"""
        return {
            'base_risk': round(base_risk, 2),
            'age_adjustment': round(age_mod * 100, 1),
            'duration_adjustment': round(duration_mod * 100, 1),
            'severity_adjustment': round(severity_mod * 100, 1),
            'symptom_adjustment': round(symptom_mod * 100, 1),
            'comorbidity_adjustment': round(comorbidity_mod * 100, 1),
            'confidence_adjustment': round(confidence_mod * 100, 1)
        }
    
    def _identify_primary_risk_factors(self, processed_data: Dict[str, Any], condition: str) -> List[str]:
        """Identify primary risk factors for the patient"""
        risk_factors = []
        
        # Age-related risks
        age = processed_data.get('age')
        if age:
            if age < 2:
                risk_factors.append("Very young age (infant)")
            elif age > 75:
                risk_factors.append("Advanced age (>75 years)")
            elif age > 65:
                risk_factors.append("Senior age (65-75 years)")
        
        # Symptom-related risks
        pain_level = processed_data.get('pain_level', '')
        if 'Severe' in pain_level or 'Extreme' in pain_level:
            risk_factors.append("High pain severity")
        
        additional_symptoms = processed_data.get('additional_symptoms', [])
        high_risk_symptoms = ['Chest pain', 'Shortness of breath', 'Severe pain']
        for symptom in additional_symptoms:
            if symptom in high_risk_symptoms:
                risk_factors.append(f"Presence of {symptom.lower()}")
        
        # Duration risks
        duration = processed_data.get('duration', '')
        if duration == 'Less than 24 hours' and condition in ['Acute Chest Pain Syndrome', 'Acute Headache Syndrome']:
            risk_factors.append("Acute onset of serious symptoms")
        
        # Medical history risks
        medical_history = processed_data.get('medical_history', [])
        if medical_history:
            risk_factors.append("Pre-existing medical conditions")
        
        return risk_factors[:5]  # Return top 5 risk factors