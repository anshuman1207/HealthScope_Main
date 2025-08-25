from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
from sklearn.neural_network import MLPClassifier
import warnings

warnings.filterwarnings('ignore')

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Simplified imports for core functionality
try:
    from sklearn.feature_extraction.text import TfidfVectorizer

    print("TF-IDF vectorizer loaded successfully")
except ImportError:
    print("Warning: TF-IDF not available, using simple text processing")


class UMLSKnowledgeBase:
    """Integration with medical knowledge bases"""

    def __init__(self):
        # Medical condition mappings based on UMLS/SNOMED CT concepts
        self.icd10_mappings = {
            'chest_pain': ['R06.02', 'R07.89'],
            'abdominal_pain': ['R10.9', 'R10.4'],
            'headache': ['G44.1', 'R51'],
            'back_pain': ['M54.9', 'M54.5'],
            'joint_pain': ['M25.50', 'M79.3'],
            'breathing_difficulty': ['R06.00', 'J44.1'],
            'dizziness': ['R42', 'H81.1'],
            'nausea': ['R11', 'K59.0'],
            'fatigue': ['R53', 'F48.0'],
            'fever': ['R50.9', 'R50.0']
        }

        # Symptom severity mappings based on medical literature
        self.severity_mappings = {
            'chest_pain': {'risk_multiplier': 1.8, 'urgency': 'high'},
            'breathing_difficulty': {'risk_multiplier': 1.7, 'urgency': 'high'},
            'severe_headache': {'risk_multiplier': 1.5, 'urgency': 'moderate'},
            'abdominal_pain': {'risk_multiplier': 1.3, 'urgency': 'moderate'},
            'fever': {'risk_multiplier': 1.2, 'urgency': 'moderate'}
        }

        # Drug interaction database (simplified)
        self.drug_interactions = {
            'blood_thinners': ['chest_pain', 'abdominal_pain'],
            'nsaids': ['stomach_pain', 'kidney_issues'],
            'opioids': ['respiratory_depression', 'constipation']
        }


class MedicalRecommendationEngine:
    """Generate contextual medical recommendations"""

    def __init__(self):
        # Comprehensive recommendation database
        self.condition_recommendations = {
            'Acute Myocardial Infarction': {
                'immediate': [
                    'Call emergency services (911) immediately',
                    'Take aspirin if not allergic (chew 325mg)',
                    'Remain calm and rest in a comfortable position'
                ],
                'monitoring': [
                    'Monitor vital signs closely',
                    'Watch for worsening chest pain or shortness of breath'
                ],
                'followup': [
                    'Urgent cardiology evaluation required',
                    'Hospital admission likely necessary'
                ]
            },
            'Acute Appendicitis': {
                'immediate': [
                    'Seek emergency medical care immediately',
                    'Avoid eating or drinking until medical evaluation',
                    'Do not take pain medications that may mask symptoms'
                ],
                'monitoring': [
                    'Monitor for worsening abdominal pain',
                    'Watch for fever or vomiting'
                ],
                'followup': [
                    'Surgical evaluation may be required',
                    'Consider CT scan if symptoms persist'
                ]
            },
            'Pneumonia': {
                'immediate': [
                    'Rest and avoid strenuous activities',
                    'Stay well-hydrated with clear fluids',
                    'Use a humidifier or breathe steam from hot shower'
                ],
                'monitoring': [
                    'Monitor temperature regularly',
                    'Watch for worsening breathing difficulty'
                ],
                'followup': [
                    'See healthcare provider within 24-48 hours',
                    'Consider chest X-ray if symptoms worsen'
                ]
            },
            'Migraine': {
                'immediate': [
                    'Rest in a quiet, dark room',
                    'Apply cold or warm compress to head/neck',
                    'Stay hydrated and avoid triggers'
                ],
                'monitoring': [
                    'Track headache patterns and triggers',
                    'Monitor for neurological symptoms'
                ],
                'followup': [
                    'Consider neurologist consultation if frequent',
                    'Discuss preventive medications with doctor'
                ]
            },
            'Gastroenteritis': {
                'immediate': [
                    'Stay hydrated with clear fluids and electrolytes',
                    'Eat bland foods (BRAT diet) when tolerated',
                    'Rest and avoid dairy products temporarily'
                ],
                'monitoring': [
                    'Monitor for dehydration signs',
                    'Track frequency of symptoms'
                ],
                'followup': [
                    'See doctor if symptoms persist >3 days',
                    'Consider stool testing if severe'
                ]
            },
            'Tension Headache': {
                'immediate': [
                    'Apply gentle pressure or massage to temples',
                    'Use over-the-counter pain relievers as directed',
                    'Practice relaxation techniques'
                ],
                'monitoring': [
                    'Identify and avoid stress triggers',
                    'Maintain regular sleep schedule'
                ],
                'followup': [
                    'See doctor if headaches become frequent',
                    'Consider stress management counseling'
                ]
            }
        }

        # General recommendations based on risk level
        self.risk_based_recommendations = {
            'critical': [
                'Seek emergency medical attention immediately',
                'Call 911 or go to nearest emergency room',
                'Do not drive yourself - have someone drive you'
            ],
            'high': [
                'Contact healthcare provider today',
                'Monitor symptoms closely',
                'Prepare to seek urgent care if worsening'
            ],
            'moderate': [
                'Schedule appointment with healthcare provider within 1-2 days',
                'Monitor symptoms and keep a symptom diary',
                'Follow home care measures'
            ],
            'low': [
                'Monitor symptoms over next few days',
                'Consider routine follow-up with primary care',
                'Practice self-care measures'
            ]
        }

        # Symptom-specific recommendations
        self.symptom_recommendations = {
            'chest_pain': [
                'Avoid physical exertion until evaluated',
                'Monitor for radiation to arm, jaw, or back',
                'Keep nitroglycerin available if prescribed'
            ],
            'breathing_difficulty': [
                'Sit upright to ease breathing',
                'Use pursed-lip breathing techniques',
                'Avoid respiratory irritants'
            ],
            'fever': [
                'Stay hydrated with plenty of fluids',
                'Rest and avoid overexertion',
                'Use fever-reducing medications as appropriate'
            ],
            'pain': [
                'Use appropriate pain management techniques',
                'Apply heat/cold as appropriate',
                'Avoid activities that worsen pain'
            ]
        }

    def generate_recommendations(self, predicted_disorder, risk_score, primary_concern, additional_symptoms,
                                 pain_level):
        """Generate 4-5 contextual medical recommendations"""
        recommendations = []

        # Get condition-specific recommendations
        if predicted_disorder in self.condition_recommendations:
            condition_recs = self.condition_recommendations[predicted_disorder]

            # Add immediate recommendations
            recommendations.extend(condition_recs.get('immediate', [])[:2])

            # Add monitoring recommendations
            recommendations.extend(condition_recs.get('monitoring', [])[:1])

            # Add follow-up recommendations
            recommendations.extend(condition_recs.get('followup', [])[:1])

        # Add risk-based recommendations
        if risk_score >= 80:
            risk_level = 'critical'
        elif risk_score >= 60:
            risk_level = 'high'
        elif risk_score >= 40:
            risk_level = 'moderate'
        else:
            risk_level = 'low'

        risk_recs = self.risk_based_recommendations.get(risk_level, [])
        if not any(rec in recommendations for rec in risk_recs):
            recommendations.extend(risk_recs[:1])

        # Add symptom-specific recommendations
        concern_lower = primary_concern.lower()
        for symptom, symptom_recs in self.symptom_recommendations.items():
            if symptom.replace('_', ' ') in concern_lower or symptom in concern_lower:
                recommendations.extend([rec for rec in symptom_recs[:1] if rec not in recommendations])
                break

        # Add general wellness recommendations if we don't have enough
        general_recs = [
            'Maintain regular sleep schedule and adequate rest',
            'Stay well-hydrated throughout the day',
            'Avoid alcohol and smoking during recovery',
            'Keep a symptom diary to track changes',
            'Follow up with healthcare provider as recommended'
        ]

        for rec in general_recs:
            if len(recommendations) >= 5:
                break
            if rec not in recommendations:
                recommendations.append(rec)

        # Ensure we have exactly 4-5 recommendations
        return recommendations[:5]


class MedicalSymptomAnalyzer:
    def __init__(self):
        # Initialize medical knowledge base and recommendation engine
        self.umls_kb = UMLSKnowledgeBase()
        self.recommendation_engine = MedicalRecommendationEngine()

        # Define symptom mappings - Updated to match frontend
        self.additional_symptoms = {
            "Fever": 1,
            "Headache": 2,
            "Nausea": 3,
            "Fatigue": 4,
            "Dizziness": 5,
            "Shortness of breath": 6,
            "Chest pain": 7,
            "Abdominal pain": 8
        }

        self.medications = {
            "No medications": 1,
            "Over-the-counter pain relievers": 2,
            "Prescription medications": 3,
            "Home remedies only": 4,
            "Multiple medications": 5
        }

        # Duration mapping
        self.duration_mapping = {
            "Less than 24 hours": 1,
            "1-3 days": 3,
            "4-7 days": 7,
            "1-2 weeks": 14,
            "More than 2 weeks": 30
        }

        # Pain level mapping
        self.pain_mapping = {
            "No pain (0/10)": 0,
            "Mild pain (1-3/10)": 2,
            "Moderate pain (4-6/10)": 5,
            "Severe pain (7-8/10)": 8,
            "Extreme pain (9-10/10)": 10
        }

        # Initialize models
        self.models = {}
        self.scaler = StandardScaler()
        try:
            self.tfidf_vectorizer = TfidfVectorizer(max_features=150, stop_words='english')
            self.use_tfidf = True
        except:
            self.use_tfidf = False
            print("Using simple text processing instead of TF-IDF")

        # Load medical datasets
        self._load_medical_datasets()
        self._train_models()

    def _load_medical_datasets(self):
        """Load and process medical datasets"""
        print("Loading medical datasets...")

        # Generate DDXPlus-like dataset structure
        self._generate_ddxplus_like_data()

        # Generate MIMIC-like data structure
        self._generate_mimic_like_data()

        # Combine datasets
        self.medical_df = pd.concat([self.ddx_df, self.mimic_df], ignore_index=True)
        print(f"Loaded {len(self.medical_df)} medical records from simulated datasets")

    def _generate_ddxplus_like_data(self, n_samples=3000):
        """Generate data mimicking DDXPlus dataset structure"""
        np.random.seed(42)

        # DDXPlus-like symptom combinations with medical reasoning
        medical_conditions = {
            'myocardial_infarction': {
                'primary_concerns': ['chest pain', 'severe chest discomfort', 'crushing chest pain'],
                'typical_symptoms': [6, 7, 5],  # Shortness of breath, chest pain, dizziness
                'pain_range': (7, 10),
                'duration_range': (1, 3),
                'base_risk': 85
            },
            'pneumonia': {
                'primary_concerns': ['cough with fever', 'breathing difficulty', 'chest congestion'],
                'typical_symptoms': [1, 6, 4],  # Fever, shortness of breath, fatigue
                'pain_range': (4, 8),
                'duration_range': (3, 14),
                'base_risk': 65
            },
            'appendicitis': {
                'primary_concerns': ['severe abdominal pain', 'right side pain', 'stomach pain'],
                'typical_symptoms': [8, 3, 1],  # Abdominal pain, nausea, fever
                'pain_range': (6, 10),
                'duration_range': (1, 7),
                'base_risk': 75
            },
            'migraine': {
                'primary_concerns': ['severe headache', 'throbbing headache', 'headache with nausea'],
                'typical_symptoms': [2, 3, 5],  # Headache, nausea, dizziness
                'pain_range': (6, 9),
                'duration_range': (1, 5),
                'base_risk': 35
            },
            'anxiety_disorder': {
                'primary_concerns': ['panic attack', 'anxiety symptoms', 'heart racing'],
                'typical_symptoms': [5, 6, 4],  # Dizziness, shortness of breath, fatigue
                'pain_range': (3, 7),
                'duration_range': (1, 30),
                'base_risk': 25
            },
            'gastroenteritis': {
                'primary_concerns': ['stomach upset', 'nausea and vomiting', 'digestive issues'],
                'typical_symptoms': [3, 8, 4],  # Nausea, abdominal pain, fatigue
                'pain_range': (4, 7),
                'duration_range': (2, 10),
                'base_risk': 30
            }
        }

        data = []
        for condition, details in medical_conditions.items():
            samples_per_condition = n_samples // len(medical_conditions)

            for _ in range(samples_per_condition):
                primary_concern = np.random.choice(details['primary_concerns'])
                additional_symptom = np.random.choice(details['typical_symptoms'])
                pain_level = np.random.randint(details['pain_range'][0], details['pain_range'][1] + 1)
                duration = np.random.randint(details['duration_range'][0], details['duration_range'][1] + 1)
                medication = np.random.randint(1, 6)

                # Calculate risk score based on medical condition
                risk_score = details['base_risk'] + np.random.randint(-10, 11)
                risk_score = max(1, min(100, risk_score))

                # Medical confidence based on symptom clarity
                confidence = 80 + np.random.randint(-15, 16)
                if condition in ['myocardial_infarction', 'appendicitis']:
                    confidence += 10  # Higher confidence for clear patterns
                confidence = max(40, min(100, confidence))

                data.append([
                    primary_concern, duration, pain_level, additional_symptom,
                    medication, risk_score, confidence, condition
                ])

        self.ddx_df = pd.DataFrame(data, columns=[
            'primary_concern', 'duration', 'pain_level', 'additional_symptom',
            'medication', 'risk_score', 'confidence', 'condition'
        ])

    def _generate_mimic_like_data(self, n_samples=2000):
        """Generate data mimicking MIMIC-III dataset structure"""
        np.random.seed(43)

        # MIMIC-III like ICU/hospital data patterns
        icu_conditions = {
            'respiratory_failure': {
                'concerns': ['severe breathing problems', 'respiratory distress'],
                'symptoms': [6, 4, 7],
                'risk': 90,
                'medications': [3, 5]  # Usually prescribed/multiple
            },
            'heart_failure': {
                'concerns': ['heart problems', 'fluid retention', 'swelling'],
                'symptoms': [6, 4, 5],
                'risk': 85,
                'medications': [3, 5]
            },
            'sepsis': {
                'concerns': ['severe infection', 'systemic illness'],
                'symptoms': [1, 4, 6],
                'risk': 95,
                'medications': [3, 5]
            },
            'stroke': {
                'concerns': ['neurological symptoms', 'weakness', 'speech problems'],
                'symptoms': [2, 5, 4],
                'risk': 88,
                'medications': [3, 5]
            }
        }

        data = []
        samples_per_condition = n_samples // len(icu_conditions)

        for condition, details in icu_conditions.items():
            for _ in range(samples_per_condition):
                primary_concern = np.random.choice(details['concerns'])
                additional_symptom = np.random.choice(details['symptoms'])
                pain_level = np.random.randint(5, 10)  # ICU patients typically higher pain
                duration = np.random.randint(1, 30)  # Varied duration
                medication = np.random.choice(details['medications'])

                risk_score = details['risk'] + np.random.randint(-8, 9)
                risk_score = max(70, min(100, risk_score))  # ICU cases are high risk

                confidence = 85 + np.random.randint(-10, 11)
                confidence = max(70, min(100, confidence))

                data.append([
                    primary_concern, duration, pain_level, additional_symptom,
                    medication, risk_score, confidence, condition
                ])

        self.mimic_df = pd.DataFrame(data, columns=[
            'primary_concern', 'duration', 'pain_level', 'additional_symptom',
            'medication', 'risk_score', 'confidence', 'condition'
        ])

    def _extract_medical_features(self, text):
        """Extract medical features using simple keyword matching"""
        features = {}

        # High-risk medical terms
        high_risk_terms = ['severe', 'acute', 'chronic', 'emergency', 'critical', 'sudden']
        features['severity_indicators'] = sum(1 for term in high_risk_terms if term in text.lower())

        # Medical entity count (simplified)
        medical_terms = ['pain', 'ache', 'difficulty', 'problem', 'symptom', 'condition']
        features['entity_count'] = sum(1 for term in medical_terms if term in text.lower())

        return features

    def _preprocess_features_medical(self, df):
        """Enhanced preprocessing with medical feature extraction"""
        # Extract medical features from text
        medical_features_list = []
        for text in df['primary_concern']:
            med_features = self._extract_medical_features(text)
            medical_features_list.append([
                med_features.get('entity_count', 0),
                med_features.get('severity_indicators', 0)
            ])

        medical_features_array = np.array(medical_features_list)

        # Simple text features if TF-IDF not available
        if self.use_tfidf:
            try:
                concern_tfidf = self.tfidf_vectorizer.fit_transform(df['primary_concern']).toarray()
            except:
                concern_tfidf = self._simple_text_features(df['primary_concern'])
        else:
            concern_tfidf = self._simple_text_features(df['primary_concern'])

        # Numerical features
        numerical_features = df[['duration', 'pain_level', 'additional_symptom', 'medication']].values

        # UMLS-based risk factors
        umls_features = self._get_umls_features(df)

        # Combine all features
        features = np.hstack([concern_tfidf, numerical_features, medical_features_array, umls_features])

        return features

    def _simple_text_features(self, texts):
        """Simple text feature extraction without TF-IDF"""
        # Keywords for common medical conditions
        keywords = ['pain', 'ache', 'severe', 'mild', 'chronic', 'acute', 'sudden',
                    'chest', 'head', 'stomach', 'back', 'breathing', 'heart']

        features = []
        for text in texts:
            text_lower = text.lower()
            text_features = [1 if keyword in text_lower else 0 for keyword in keywords]
            features.append(text_features)

        return np.array(features)

    def _get_umls_features(self, df):
        """Extract UMLS/medical knowledge-based features"""
        umls_features = []

        for _, row in df.iterrows():
            features = [0, 0, 0]  # [high_risk_condition, severity_multiplier, drug_interaction]

            concern = row['primary_concern'].lower()

            # Check for high-risk conditions
            for condition, details in self.umls_kb.severity_mappings.items():
                if any(keyword in concern for keyword in condition.split('_')):
                    features[0] = 1
                    features[1] = details['risk_multiplier']
                    break

            # Check medication interactions
            if row['medication'] == 3:  # Prescribed medication
                features[2] = 1

            umls_features.append(features)

        return np.array(umls_features)

    def _train_models(self):
        """Train models with medical datasets"""
        print("Training medical AI models...")

        # Prepare features with medical preprocessing
        X = self._preprocess_features_medical(self.medical_df)
        y_risk = self.medical_df['risk_score'].values
        y_confidence = self.medical_df['confidence'].values

        # Scale features
        X_scaled = self.scaler.fit_transform(X)

        # Split data
        X_train, X_test, y_risk_train, y_risk_test, y_conf_train, y_conf_test = train_test_split(
            X_scaled, y_risk, y_confidence, test_size=0.2, random_state=42
        )

        # Enhanced models for medical data
        print("Training Medical Risk Assessment Models...")

        # Medical-specific Random Forest
        rf_risk = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            random_state=42
        )
        rf_risk.fit(X_train, y_risk_train)
        self.models['medical_rf_risk'] = rf_risk

        # Gradient Boosting for risk
        gb_risk = GradientBoostingClassifier(n_estimators=100, random_state=42)
        gb_risk.fit(X_train, y_risk_train)
        self.models['medical_gb_risk'] = gb_risk

        # Confidence models
        rf_conf = RandomForestClassifier(n_estimators=100, random_state=42)
        rf_conf.fit(X_train, y_conf_train)
        self.models['medical_rf_confidence'] = rf_conf

        gb_conf = GradientBoostingClassifier(n_estimators=100, random_state=42)
        gb_conf.fit(X_train, y_conf_train)
        self.models['medical_gb_confidence'] = gb_conf

        print("Medical AI models trained successfully!")

    def _predict_disease_disorder(self, primary_concern, duration, pain_level, additional_symptom, medication,
                                  risk_score, confidence):
        """Predict most likely disease/disorder based on comprehensive symptom analysis"""
        concern_lower = primary_concern.lower()

        # Comprehensive medical condition database
        disease_database = {
            'Acute Myocardial Infarction': {
                'keywords': ['chest pain', 'crushing', 'radiating', 'heart attack', 'cardiac'],
                'associated_symptoms': [6, 7, 5],
                'pain_range': (7, 10),
                'duration_range': (1, 3),
                'risk_threshold': 75,
                'category': 'Cardiovascular Emergency'
            },
            'Acute Appendicitis': {
                'keywords': ['abdominal pain', 'appendix', 'right side', 'stomach pain'],
                'associated_symptoms': [8, 3, 1],
                'pain_range': (6, 10),
                'duration_range': (1, 7),
                'risk_threshold': 70,
                'category': 'Surgical Emergency'
            },
            'Pneumonia': {
                'keywords': ['breathing', 'cough', 'lung', 'respiratory', 'chest infection'],
                'associated_symptoms': [1, 6, 4],
                'pain_range': (4, 8),
                'duration_range': (2, 21),
                'risk_threshold': 65,
                'category': 'Respiratory Infection'
            },
            'Migraine': {
                'keywords': ['headache', 'migraine', 'throbbing', 'head pain'],
                'associated_symptoms': [2, 3, 5],
                'pain_range': (6, 10),
                'duration_range': (1, 3),
                'risk_threshold': 40,
                'category': 'Neurological'
            },
            'Gastroenteritis': {
                'keywords': ['stomach', 'gastro', 'digestive', 'intestinal', 'food poisoning'],
                'associated_symptoms': [3, 8, 4],
                'pain_range': (3, 7),
                'duration_range': (1, 10),
                'risk_threshold': 35,
                'category': 'Gastrointestinal'
            },
            'Tension Headache': {
                'keywords': ['headache', 'tension', 'stress', 'mild headache'],
                'associated_symptoms': [2, 4],
                'pain_range': (2, 6),
                'duration_range': (1, 7),
                'risk_threshold': 25,
                'category': 'Neurological'
            }
        }

        # Calculate disease probabilities
        disease_probabilities = []

        for disease_name, disease_info in disease_database.items():
            probability_score = 0

            # Keyword matching (40% weight)
            keyword_matches = sum(1 for keyword in disease_info['keywords']
                                  if keyword in concern_lower)
            keyword_score = (keyword_matches / len(disease_info['keywords'])) * 40

            # Associated symptom matching (25% weight)
            symptom_match = 25 if additional_symptom in disease_info['associated_symptoms'] else 0

            # Pain level matching (20% weight)
            pain_min, pain_max = disease_info['pain_range']
            if pain_min <= pain_level <= pain_max:
                pain_score = 20
            else:
                distance = min(abs(pain_level - pain_min), abs(pain_level - pain_max))
                pain_score = max(0, 20 - distance * 3)

            # Duration matching (15% weight)
            duration_min, duration_max = disease_info['duration_range']
            if duration_min <= duration <= duration_max:
                duration_score = 15
            else:
                distance = min(abs(duration - duration_min), abs(duration - duration_max))
                duration_score = max(0, 15 - distance * 0.5)

            # Base probability
            probability_score = keyword_score + symptom_match + pain_score + duration_score

            disease_probabilities.append({
                'disease': disease_name,
                'probability': min(probability_score, 100),
                'category': disease_info['category']
            })

        # Sort by probability and return top prediction
        disease_probabilities.sort(key=lambda x: x['probability'], reverse=True)

        if disease_probabilities:
            return disease_probabilities[0]['disease']
        else:
            return 'Undifferentiated Condition'

    def analyze_symptoms(self, primary_concern, duration, pain_level, additional_symptoms, medication):
        """
        Analyze symptoms and return predicted disorder, risk score, AI confidence, and recommendations
        """
        try:
            # Convert frontend data to internal format
            duration_days = self.duration_mapping.get(duration, 7)
            pain_numeric = self.pain_mapping.get(pain_level, 5)
            medication_code = self.medications.get(medication, 1)

            # Get first additional symptom for analysis
            additional_symptom_code = 4  # Default to fatigue
            if additional_symptoms and len(additional_symptoms) > 0:
                first_symptom = additional_symptoms[0]
                additional_symptom_code = self.additional_symptoms.get(first_symptom, 4)

            # Create input dataframe
            input_data = pd.DataFrame({
                'primary_concern': [primary_concern.lower()],
                'duration': [duration_days],
                'pain_level': [pain_numeric],
                'additional_symptom': [additional_symptom_code],
                'medication': [medication_code]
            })

            # Extract medical features
            medical_features_list = []
            for text in input_data['primary_concern']:
                med_features = self._extract_medical_features(text)
                medical_features_list.append([
                    med_features.get('entity_count', 0),
                    med_features.get('severity_indicators', 0)
                ])

            medical_features_array = np.array(medical_features_list)

            # Preprocess input
            if self.use_tfidf:
                try:
                    concern_tfidf = self.tfidf_vectorizer.transform(input_data['primary_concern']).toarray()
                except:
                    concern_tfidf = self._simple_text_features(input_data['primary_concern'])
            else:
                concern_tfidf = self._simple_text_features(input_data['primary_concern'])

            numerical_features = input_data[['duration', 'pain_level', 'additional_symptom', 'medication']].values
            umls_features = self._get_umls_features(input_data)

            # Combine features
            features = np.hstack([concern_tfidf, numerical_features, medical_features_array, umls_features])
            features_scaled = self.scaler.transform(features)

            # Predict using ensemble models
            risk_predictions = []
            confidence_predictions = []

            try:
                if 'medical_rf_risk' in self.models:
                    risk_predictions.append(self.models['medical_rf_risk'].predict(features_scaled)[0])
                if 'medical_gb_risk' in self.models:
                    risk_predictions.append(self.models['medical_gb_risk'].predict(features_scaled)[0])
                if 'medical_rf_confidence' in self.models:
                    confidence_predictions.append(self.models['medical_rf_confidence'].predict(features_scaled)[0])
                if 'medical_gb_confidence' in self.models:
                    confidence_predictions.append(self.models['medical_gb_confidence'].predict(features_scaled)[0])
            except Exception as e:
                print(f"Model prediction error: {e}")

            # Calculate final predictions
            if risk_predictions and confidence_predictions:
                risk_score = int(np.mean(risk_predictions))
                ai_confidence = int(np.mean(confidence_predictions))
            else:
                # Fallback calculation
                risk_score = 50
                ai_confidence = 60

            # Predict disorder
            predicted_disorder = self._predict_disease_disorder(
                primary_concern, duration_days, pain_numeric, additional_symptom_code,
                medication_code, risk_score, ai_confidence
            )

            # Generate medical recommendations
            recommendations = self.recommendation_engine.generate_recommendations(
                predicted_disorder=predicted_disorder,
                risk_score=risk_score,
                primary_concern=primary_concern,
                additional_symptoms=additional_symptoms,
                pain_level=pain_level
            )

            return {
                'predicted_disorder': predicted_disorder,
                'risk_score': max(1, min(100, risk_score)),
                'confidence': max(1, min(100, ai_confidence)) / 100.0,  # Convert to decimal for frontend
                'recommendations': recommendations
            }

        except Exception as e:
            print(f"Error in analysis: {e}")
            # Fallback recommendations for error cases
            fallback_recommendations = [
                'Consult with a healthcare professional for proper evaluation',
                'Monitor your symptoms and seek medical attention if they worsen',
                'Keep a record of your symptoms including timing and severity',
                'Stay hydrated and get adequate rest',
                'Contact emergency services if you experience severe symptoms'
            ]
            return {
                'predicted_disorder': 'Analysis Error - Consult Healthcare Provider',
                'risk_score': 50,
                'confidence': 0.3,
                'recommendations': fallback_recommendations
            }


# Initialize the analyzer
print("Initializing Medical Symptom Analyzer...")
analyzer = MedicalSymptomAnalyzer()
print("Medical AI System Ready!")


@app.route('/api/analyze-symptoms', methods=['POST'])
def analyze_symptoms():
    """API endpoint for symptom analysis"""
    try:
        data = request.get_json()

        # Extract parameters from request
        primary_concern = data.get('primary_concern', '')
        duration = data.get('duration', 'Less than 24 hours')
        pain_level = data.get('pain_level', 'No pain (0/10)')
        additional_symptoms = data.get('additional_symptoms', [])
        medication = data.get('medication', 'No medications')

        # Validate input
        if not primary_concern.strip():
            return jsonify({
                'success': False,
                'error': 'Primary concern is required'
            }), 400

        # Analyze symptoms
        result = analyzer.analyze_symptoms(
            primary_concern=primary_concern,
            duration=duration,
            pain_level=pain_level,
            additional_symptoms=additional_symptoms,
            medication=medication
        )

        # Format response to match frontend expectations
        response = {
            'success': True,
            'predicted_disorder': result['predicted_disorder'],
            'risk_score': result['risk_score'],
            'confidence': result['confidence'],
            'recommendations': result['recommendations']
        }

        print(f"Analysis complete: {response}")
        return jsonify(response)

    except Exception as e:
        print(f"API Error: {e}")
        return jsonify({
            'success': False,
            'error': f'Internal server error: {str(e)}',
            'predicted_disorder': 'System Error - Seek Medical Consultation',
            'risk_score': 50,
            'confidence': 0.3,
            'recommendations': [
                'Consult with a healthcare professional immediately',
                'Our system is temporarily unavailable',
                'Seek emergency care if symptoms are severe',
                'Keep monitoring your symptoms',
                'Try again later or contact medical support'
            ]
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Medical Symptom Analyzer API is running',
        'version': '2.0.0',
        'features': ['symptom_analysis', 'risk_assessment', 'medical_recommendations']
    })


@app.route('/api/conditions', methods=['GET'])
def get_supported_conditions():
    """Get list of supported medical conditions"""
    conditions = [
        'Acute Myocardial Infarction',
        'Acute Appendicitis',
        'Pneumonia',
        'Migraine',
        'Gastroenteritis',
        'Tension Headache'
    ]

    return jsonify({
        'success': True,
        'supported_conditions': conditions,
        'total_count': len(conditions)
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)