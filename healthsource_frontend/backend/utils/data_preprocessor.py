# utils/data_preprocessor.py
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
import pandas as pd
from typing import Dict, List, Any, Optional
import logging
import asyncio
from spellchecker import SpellChecker

logger = logging.getLogger(__name__)

class DataPreprocessor:
    def __init__(self):
        self.spell_checker = SpellChecker()
        self.lemmatizer = WordNetLemmatizer()
        self.medical_synonyms = {}
        self.symptom_normalizer = {}
        self._setup_medical_vocabulary()
        self._initialize_nltk_data()
    
    def _initialize_nltk_data(self):
        """Download required NLTK data"""
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt', quiet=True)
        
        try:
            nltk.data.find('corpora/stopwords')
        except LookupError:
            nltk.download('stopwords', quiet=True)
            
        try:
            nltk.data.find('corpora/wordnet')
        except LookupError:
            nltk.download('wordnet', quiet=True)
    
    def _setup_medical_vocabulary(self):
        """Setup medical terminology and synonyms"""
        self.medical_synonyms = {
            # Pain synonyms
            'ache': 'pain', 'aching': 'pain', 'sore': 'pain', 'tender': 'pain',
            'throbbing': 'pain', 'sharp': 'pain', 'dull': 'pain', 'burning': 'pain',
            
            # Breathing synonyms
            'difficulty breathing': 'shortness of breath', 'breathless': 'shortness of breath',
            'winded': 'shortness of breath', 'dyspnea': 'shortness of breath',
            
            # Digestive synonyms
            'stomach ache': 'abdominal pain', 'belly pain': 'abdominal pain',
            'tummy pain': 'abdominal pain', 'gut pain': 'abdominal pain',
            'stomach upset': 'nausea', 'queasy': 'nausea', 'sick to stomach': 'nausea',
            
            # Head synonyms
            'head pain': 'headache', 'skull pain': 'headache', 'brain pain': 'headache',
            
            # Fatigue synonyms
            'tired': 'fatigue', 'exhausted': 'fatigue', 'worn out': 'fatigue',
            'drained': 'fatigue', 'weak': 'fatigue', 'lethargic': 'fatigue',
            
            # Fever synonyms
            'temperature': 'fever', 'hot': 'fever', 'chills': 'fever',
            'feverish': 'fever', 'sweats': 'fever',
            
            # Dizziness synonyms
            'lightheaded': 'dizziness', 'vertigo': 'dizziness', 'spinning': 'dizziness',
            'unsteady': 'dizziness', 'balance problems': 'dizziness'
        }
        
        self.symptom_normalizer = {
            'chest tightness': 'chest pain',
            'chest discomfort': 'chest pain',
            'heart pain': 'chest pain',
            'stomach cramps': 'abdominal pain',
            'side pain': 'abdominal pain',
            'back pain': 'abdominal pain',
            'difficulty swallowing': 'throat pain',
            'sore throat': 'throat pain',
            'runny nose': 'nasal congestion',
            'stuffy nose': 'nasal congestion'
        }
    
    async def process_symptoms(self, symptom_input: Any) -> Dict[str, Any]:
        """Process and normalize symptom input data"""
        try:
            # Convert input to dictionary if it's a Pydantic model
            if hasattr(symptom_input, 'dict'):
                data = symptom_input.dict()
            else:
                data = dict(symptom_input)
            
            # Process primary concern
            primary_concern = await self._process_text_symptom(data.get('primary_concern', ''))
            
            # Process additional symptoms
            additional_symptoms = await self._process_symptom_list(data.get('additional_symptoms', []))
            
            # Normalize duration
            duration = self._normalize_duration(data.get('duration', ''))
            
            # Normalize pain level
            pain_level = self._normalize_pain_level(data.get('pain_level', ''))
            
            # Process medications
            medications = await self._process_medications(data.get('medications', ''))
            
            # Extract demographic info
            age = self._validate_age(data.get('age'))
            gender = self._normalize_gender(data.get('gender', ''))
            
            # Process medical history
            medical_history = await self._process_medical_history(data.get('medical_history', []))
            
            # Create processed data
            processed_data = {
                'primary_concern': primary_concern,
                'additional_symptoms': additional_symptoms,
                'duration': duration,
                'pain_level': pain_level,
                'medications': medications,
                'age': age,
                'gender': gender,
                'medical_history': medical_history,
                'processed_timestamp': pd.Timestamp.now(),
                'all_symptoms': self._combine_all_symptoms(primary_concern, additional_symptoms)
            }
            
            # Add derived features
            processed_data.update(await self._extract_derived_features(processed_data))
            
            logger.info("Successfully processed symptom data")
            return processed_data
            
        except Exception as e:
            logger.error(f"Error processing symptoms: {e}")
            return self._create_fallback_processed_data(symptom_input)
    
    async def _process_text_symptom(self, text: str) -> str:
        """Process and normalize text-based symptom descriptions"""
        if not text or not isinstance(text, str):
            return ""
        
        # Convert to lowercase
        text = text.lower().strip()
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Correct common spelling errors
        text = await self._spell_check_medical_terms(text)
        
        # Normalize medical synonyms
        text = self._apply_medical_synonyms(text)
        
        # Remove non-medical stopwords while keeping medical terms
        text = self._remove_non_medical_stopwords(text)
        
        return text.strip()
    
    async def _process_symptom_list(self, symptoms: List[str]) -> List[str]:
        """Process list of additional symptoms"""
        if not symptoms:
            return []
        
        processed_symptoms = []
        for symptom in symptoms:
            if isinstance(symptom, str) and symptom.strip():
                normalized = self._normalize_symptom_name(symptom.strip())
                if normalized and normalized not in processed_symptoms:
                    processed_symptoms.append(normalized)
        
        return processed_symptoms
    
    def _normalize_duration(self, duration: str) -> str:
        """Normalize duration strings"""
        if not duration:
            return "Unknown"
        
        duration = duration.strip()
        
        # Standard duration mappings
        duration_mappings = {
            'less than 24 hours': 'Less than 24 hours',
            'under 24 hours': 'Less than 24 hours',
            'less than a day': 'Less than 24 hours',
            '1-3 days': '1-3 days',
            'few days': '1-3 days',
            '2-3 days': '1-3 days',
            '4-7 days': '4-7 days',
            'about a week': '4-7 days',
            'one week': '4-7 days',
            '1-2 weeks': '1-2 weeks',
            'couple weeks': '1-2 weeks',
            'two weeks': '1-2 weeks',
            'more than 2 weeks': 'More than 2 weeks',
            'over 2 weeks': 'More than 2 weeks',
            'several weeks': 'More than 2 weeks',
            'months': 'More than 2 weeks'
        }
        
        duration_lower = duration.lower()
        return duration_mappings.get(duration_lower, duration)
    
    def _normalize_pain_level(self, pain_level: str) -> str:
        """Normalize pain level descriptions"""
        if not pain_level:
            return "No pain (0/10)"
        
        pain_level = pain_level.strip()
        
        # If already in standard format, return as is
        standard_formats = [
            "No pain (0/10)", "Mild pain (1-3/10)", "Moderate pain (4-6/10)",
            "Severe pain (7-8/10)", "Extreme pain (9-10/10)"
        ]
        
        if pain_level in standard_formats:
            return pain_level
        
        # Normalize common variations
        pain_lower = pain_level.lower()
        
        if any(word in pain_lower for word in ['no', 'none', '0']):
            return "No pain (0/10)"
        elif any(word in pain_lower for word in ['mild', 'slight', 'little', '1', '2', '3']):
            return "Mild pain (1-3/10)"
        elif any(word in pain_lower for word in ['moderate', 'medium', '4', '5', '6']):
            return "Moderate pain (4-6/10)"
        elif any(word in pain_lower for word in ['severe', 'bad', 'intense', '7', '8']):
            return "Severe pain (7-8/10)"
        elif any(word in pain_lower for word in ['extreme', 'unbearable', 'worst', '9', '10']):
            return "Extreme pain (9-10/10)"
        else:
            return "Moderate pain (4-6/10)"  # Default
    
    async def _process_medications(self, medications: str) -> Dict[str, Any]:
        """Process medication information"""
        if not medications or not isinstance(medications, str):
            return {'current_medications': [], 'medication_categories': []}
        
        medications = medications.lower().strip()
        
        # Common medication categories
        otc_pain_relievers = ['ibuprofen', 'acetaminophen', 'tylenol', 'advil', 'aspirin', 'naproxen', 'aleve']
        prescription_meds = ['prescription', 'prescribed', 'doctor gave', 'rx']
        home_remedies = ['home remedy', 'natural', 'herbal', 'tea', 'honey', 'rest']
        
        medication_info = {
            'current_medications': [],
            'medication_categories': []
        }
        
        if 'no medication' in medications or 'none' in medications:
            medication_info['medication_categories'].append('No medications')
        elif any(med in medications for med in otc_pain_relievers):
            medication_info['medication_categories'].append('Over-the-counter pain relievers')
        elif any(term in medications for term in prescription_meds):
            medication_info['medication_categories'].append('Prescription medications')
        elif any(remedy in medications for remedy in home_remedies):
            medication_info['medication_categories'].append('Home remedies only')
        else:
            medication_info['medication_categories'].append('Multiple medications')
        
        return medication_info
    
    def _validate_age(self, age: Any) -> Optional[int]:
        """Validate and normalize age"""
        if age is None:
            return None
        
        try:
            age_int = int(age)
            if 0 <= age_int <= 120:
                return age_int
            else:
                logger.warning(f"Invalid age value: {age}")
                return None
        except (ValueError, TypeError):
            logger.warning(f"Could not convert age to integer: {age}")
            return None
    
    def _normalize_gender(self, gender: str) -> str:
        """Normalize gender information"""
        if not gender or not isinstance(gender, str):
            return "Not specified"
        
        gender = gender.lower().strip()
        
        if gender in ['male', 'm', 'man']:
            return "Male"
        elif gender in ['female', 'f', 'woman']:
            return "Female"
        elif gender in ['other', 'non-binary', 'nb']:
            return "Other"
        else:
            return "Not specified"
    
    async def _process_medical_history(self, medical_history: List[str]) -> List[str]:
        """Process and normalize medical history"""
        if not medical_history:
            return []
        
        processed_history = []
        for condition in medical_history:
            if isinstance(condition, str) and condition.strip():
                normalized = self._normalize_medical_condition(condition.strip())
                if normalized and normalized not in processed_history:
                    processed_history.append(normalized)
        
        return processed_history
    
    def _normalize_medical_condition(self, condition: str) -> str:
        """Normalize medical condition names"""
        condition = condition.lower().strip()
        
        # Common medical condition mappings
        condition_mappings = {
            'high blood pressure': 'Hypertension',
            'diabetes': 'Diabetes Mellitus',
            'sugar': 'Diabetes Mellitus',
            'heart disease': 'Cardiovascular Disease',
            'heart problems': 'Cardiovascular Disease',
            'lung disease': 'Pulmonary Disease',
            'breathing problems': 'Pulmonary Disease',
            'kidney disease': 'Renal Disease',
            'kidney problems': 'Renal Disease',
            'liver disease': 'Hepatic Disease',
            'liver problems': 'Hepatic Disease'
        }
        
        return condition_mappings.get(condition, condition.title())
    
    async def _spell_check_medical_terms(self, text: str) -> str:
        """Spell check with focus on medical terms"""
        words = word_tokenize(text)
        corrected_words = []
        
        # Common medical term corrections
        medical_corrections = {
            'stomache': 'stomach',
            'headach': 'headache',
            'nauseus': 'nauseous',
            'dizzy': 'dizziness',
            'cough': 'cough',
            'feaver': 'fever',
            'cheast': 'chest',
            'abdomin': 'abdomen'
        }
        
        for word in words:
            if word.lower() in medical_corrections:
                corrected_words.append(medical_corrections[word.lower()])
            else:
                corrected_words.append(word)
        
        return ' '.join(corrected_words)
    
    def _apply_medical_synonyms(self, text: str) -> str:
        """Apply medical synonym mappings"""
        for synonym, standard_term in self.medical_synonyms.items():
            text = re.sub(r'\b' + re.escape(synonym) + r'\b', standard_term, text, flags=re.IGNORECASE)
        
        # Apply symptom normalizations
        for variation, normalized in self.symptom_normalizer.items():
            text = re.sub(r'\b' + re.escape(variation) + r'\b', normalized, text, flags=re.IGNORECASE)
        
        return text
    
    def _remove_non_medical_stopwords(self, text: str) -> str:
        """Remove non-medical stopwords while preserving medical context"""
        try:
            stop_words = set(stopwords.words('english'))
            # Keep medically relevant words that might be in stopwords
            medical_keep_words = {
                'no', 'not', 'very', 'more', 'most', 'much', 'can', 'cannot',
                'have', 'having', 'had', 'been', 'being', 'feel', 'feeling'
            }
            stop_words = stop_words - medical_keep_words
            
            words = word_tokenize(text)
            filtered_words = [word for word in words if word.lower() not in stop_words]
            
            return ' '.join(filtered_words)
        except Exception as e:
            logger.warning(f"Could not remove stopwords: {e}")
            return text
    
    def _normalize_symptom_name(self, symptom: str) -> str:
        """Normalize individual symptom names"""
        symptom = symptom.strip().title()
        
        # Standard symptom names mapping
        symptom_mappings = {
            'Temperature': 'Fever',
            'Hot': 'Fever',
            'Chills': 'Fever',
            'Head Pain': 'Headache',
            'Stomach Ache': 'Abdominal pain',
            'Belly Pain': 'Abdominal pain',
            'Difficulty Breathing': 'Shortness of breath',
            'Breathless': 'Shortness of breath',
            'Tired': 'Fatigue',
            'Exhausted': 'Fatigue',
            'Lightheaded': 'Dizziness',
            'Vertigo': 'Dizziness'
        }
        
        return symptom_mappings.get(symptom, symptom)
    
    def _combine_all_symptoms(self, primary_concern: str, additional_symptoms: List[str]) -> List[str]:
        """Combine and extract all symptoms from primary concern and additional symptoms"""
        all_symptoms = set(additional_symptoms)
        
        # Extract symptoms from primary concern text
        concern_lower = primary_concern.lower()
        symptom_keywords = [
            'pain', 'ache', 'fever', 'headache', 'nausea', 'dizziness',
            'fatigue', 'shortness of breath', 'chest pain', 'abdominal pain'
        ]
        
        for keyword in symptom_keywords:
            if keyword in concern_lower:
                # Map to standard symptom names
                if keyword == 'pain' and 'chest' in concern_lower:
                    all_symptoms.add('Chest pain')
                elif keyword == 'pain' and any(word in concern_lower for word in ['stomach', 'belly', 'abdomen']):
                    all_symptoms.add('Abdominal pain')
                elif keyword == 'ache' and 'head' in concern_lower:
                    all_symptoms.add('Headache')
                elif keyword in ['shortness of breath', 'breathing']:
                    all_symptoms.add('Shortness of breath')
                else:
                    all_symptoms.add(keyword.title())
        
        return list(all_symptoms)
    
    async def _extract_derived_features(self, processed_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract derived features from processed data"""
        derived_features = {}
        
        # Symptom count
        derived_features['total_symptom_count'] = len(processed_data.get('all_symptoms', []))
        
        # Severity indicators
        pain_level = processed_data.get('pain_level', '')
        derived_features['high_pain_indicator'] = 'Severe' in pain_level or 'Extreme' in pain_level
        
        # Urgency indicators
        urgent_symptoms = ['Chest pain', 'Shortness of breath', 'Severe pain']
        all_symptoms = processed_data.get('all_symptoms', [])
        derived_features['urgent_symptom_present'] = any(symptom in urgent_symptoms for symptom in all_symptoms)
        
        # Duration category
        duration = processed_data.get('duration', '')
        if 'Less than 24 hours' in duration:
            derived_features['duration_category'] = 'acute'
        elif '1-3 days' in duration or '4-7 days' in duration:
            derived_features['duration_category'] = 'subacute'
        else:
            derived_features['duration_category'] = 'chronic'
        
        # Risk category based on age
        age = processed_data.get('age')
        if age:
            if age < 18:
                derived_features['age_risk_category'] = 'pediatric'
            elif age > 65:
                derived_features['age_risk_category'] = 'geriatric'
            else:
                derived_features['age_risk_category'] = 'adult'
        else:
            derived_features['age_risk_category'] = 'unknown'
        
        # Comorbidity indicator
        medical_history = processed_data.get('medical_history', [])
        derived_features['has_comorbidities'] = len(medical_history) > 0
        derived_features['comorbidity_count'] = len(medical_history)
        
        return derived_features
    
    def _create_fallback_processed_data(self, original_input: Any) -> Dict[str, Any]:
        """Create fallback processed data when processing fails"""
        try:
            if hasattr(original_input, 'dict'):
                original_data = original_input.dict()
            else:
                original_data = dict(original_input) if original_input else {}
        except:
            original_data = {}
        
        return {
            'primary_concern': original_data.get('primary_concern', 'General health concern'),
            'additional_symptoms': original_data.get('additional_symptoms', []),
            'duration': original_data.get('duration', 'Unknown'),
            'pain_level': original_data.get('pain_level', 'No pain (0/10)'),
            'medications': {'current_medications': [], 'medication_categories': ['Unknown']},
            'age': original_data.get('age'),
            'gender': original_data.get('gender', 'Not specified'),
            'medical_history': original_data.get('medical_history', []),
            'processed_timestamp': pd.Timestamp.now(),
            'all_symptoms': original_data.get('additional_symptoms', []),
            'total_symptom_count': len(original_data.get('additional_symptoms', [])),
            'high_pain_indicator': False,
            'urgent_symptom_present': False,
            'duration_category': 'unknown',
            'age_risk_category': 'unknown',
            'has_comorbidities': False,
            'comorbidity_count': 0,
            'processing_error': True
        }