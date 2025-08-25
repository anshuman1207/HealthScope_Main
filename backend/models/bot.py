from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

import os
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for React integration

# Infermedica API configuration
INFERMEDICA_API_URL = "https://api.infermedica.com/v3"
INFERMEDICA_APP_ID = os.getenv('INFERMEDICA_APP_ID', 'your_app_id_here')
INFERMEDICA_APP_KEY = os.getenv('INFERMEDICA_APP_KEY', 'your_app_key_here')

# Testing mode configuration
TESTING_MODE = os.getenv('TESTING_MODE', 'true').lower() == 'true'

# Headers for Infermedica API
HEADERS = {
    'App-Id': INFERMEDICA_APP_ID,
    'App-Key': INFERMEDICA_APP_KEY,
    'Content-Type': 'application/json'
}


class InfermedicaClient:
    def __init__(self):
        self.base_url = INFERMEDICA_API_URL
        self.headers = HEADERS
        self.session_data = {}  # Store session data for ongoing conversations
        self.testing_mode = TESTING_MODE

    def _is_medical_query(self, text):
        """Check if the text contains medical-related content"""
        text_lower = text.lower().strip()

        # Greetings and casual conversation
        casual_phrases = [
            'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening',
            'how are you', 'thanks', 'thank you', 'bye', 'goodbye', 'see you',
            'what are you', 'who are you', 'what can you do', 'help me',
            'what is your name', 'nice to meet you', 'how do you work'
        ]

        # Check if it's just a casual phrase
        for phrase in casual_phrases:
            if text_lower == phrase or text_lower.startswith(phrase + ' ') or text_lower.endswith(' ' + phrase):
                return False

        # Medical keywords that indicate a health query
        medical_keywords = [
            'pain', 'ache', 'hurt', 'sick', 'ill', 'fever', 'temperature',
            'cough', 'cold', 'flu', 'nausea', 'vomit', 'diarrhea', 'constipation',
            'headache', 'migraine', 'dizzy', 'fatigue', 'tired', 'weak',
            'chest', 'stomach', 'abdomen', 'throat', 'nose', 'ear',
            'symptom', 'symptoms', 'feel', 'feeling', 'experiencing',
            'doctor', 'medical', 'health', 'medicine', 'medication',
            'rash', 'swelling', 'bleeding', 'bruise', 'infection',
            'breathing', 'breath', 'shortness', 'wheeze'
        ]

        # Check if any medical keywords are present
        for keyword in medical_keywords:
            if keyword in text_lower:
                return True

        # If text is longer and descriptive, assume it might be medical
        if len(text.split()) > 5:
            return True

        return False

    def _get_mock_symptoms(self, text):
        """Generate mock symptoms based on keywords in text for testing"""
        text_lower = text.lower()
        mock_symptoms = []

        # First check if this is actually a medical query
        if not self._is_medical_query(text):
            return []  # Return empty list for non-medical queries

        # Common symptom keywords mapping
        symptom_mappings = {
            'headache': {'id': 's_1', 'name': 'Headache', 'choice_id': 'present'},
            'head pain': {'id': 's_1', 'name': 'Headache', 'choice_id': 'present'},
            'fever': {'id': 's_2', 'name': 'Fever', 'choice_id': 'present'},
            'temperature': {'id': 's_2', 'name': 'Fever', 'choice_id': 'present'},
            'cough': {'id': 's_3', 'name': 'Cough', 'choice_id': 'present'},
            'coughing': {'id': 's_3', 'name': 'Cough', 'choice_id': 'present'},
            'sore throat': {'id': 's_4', 'name': 'Sore throat', 'choice_id': 'present'},
            'throat pain': {'id': 's_4', 'name': 'Sore throat', 'choice_id': 'present'},
            'nausea': {'id': 's_5', 'name': 'Nausea', 'choice_id': 'present'},
            'nauseous': {'id': 's_5', 'name': 'Nausea', 'choice_id': 'present'},
            'fatigue': {'id': 's_6', 'name': 'Fatigue', 'choice_id': 'present'},
            'tired': {'id': 's_6', 'name': 'Fatigue', 'choice_id': 'present'},
            'weak': {'id': 's_6', 'name': 'Fatigue', 'choice_id': 'present'},
            'stomach pain': {'id': 's_7', 'name': 'Stomach pain', 'choice_id': 'present'},
            'stomach ache': {'id': 's_7', 'name': 'Stomach pain', 'choice_id': 'present'},
            'belly pain': {'id': 's_7', 'name': 'Stomach pain', 'choice_id': 'present'},
            'diarrhea': {'id': 's_8', 'name': 'Diarrhea', 'choice_id': 'present'},
            'loose stool': {'id': 's_8', 'name': 'Diarrhea', 'choice_id': 'present'},
            'chest pain': {'id': 's_9', 'name': 'Chest pain', 'choice_id': 'present'},
            'chest ache': {'id': 's_9', 'name': 'Chest pain', 'choice_id': 'present'},
            'shortness of breath': {'id': 's_10', 'name': 'Shortness of breath', 'choice_id': 'present'},
            'breathing problem': {'id': 's_10', 'name': 'Shortness of breath', 'choice_id': 'present'},
            'hard to breathe': {'id': 's_10', 'name': 'Shortness of breath', 'choice_id': 'present'},
            'dizziness': {'id': 's_11', 'name': 'Dizziness', 'choice_id': 'present'},
            'dizzy': {'id': 's_11', 'name': 'Dizziness', 'choice_id': 'present'},
            'back pain': {'id': 's_12', 'name': 'Back pain', 'choice_id': 'present'},
            'backache': {'id': 's_12', 'name': 'Back pain', 'choice_id': 'present'},
        }

        for keyword, symptom in symptom_mappings.items():
            if keyword in text_lower:
                mock_symptoms.append(symptom)

        return mock_symptoms

    def _get_mock_diagnosis(self, symptoms):
        """Generate mock diagnosis for testing"""
        conditions = []

        # Extract symptom names for analysis
        symptom_names = [s.get('name', '').lower() for s in symptoms]
        symptom_text = ' '.join(symptom_names)

        # More specific symptom-to-condition mapping
        if 'headache' in symptom_text:
            if 'fever' in symptom_text:
                conditions = [
                    {'name': 'Viral infection', 'probability': 0.70},
                    {'name': 'Flu', 'probability': 0.45},
                    {'name': 'Sinusitis', 'probability': 0.30}
                ]
            elif 'nausea' in symptom_text:
                conditions = [
                    {'name': 'Migraine', 'probability': 0.65},
                    {'name': 'Tension headache', 'probability': 0.40},
                    {'name': 'Dehydration', 'probability': 0.35}
                ]
            else:
                conditions = [
                    {'name': 'Tension headache', 'probability': 0.60},
                    {'name': 'Migraine', 'probability': 0.35},
                    {'name': 'Eye strain', 'probability': 0.25}
                ]

        elif 'fever' in symptom_text:
            if 'cough' in symptom_text:
                conditions = [
                    {'name': 'Upper respiratory infection', 'probability': 0.65},
                    {'name': 'Bronchitis', 'probability': 0.40},
                    {'name': 'Pneumonia', 'probability': 0.25}
                ]
            elif 'sore throat' in symptom_text:
                conditions = [
                    {'name': 'Strep throat', 'probability': 0.55},
                    {'name': 'Viral pharyngitis', 'probability': 0.50},
                    {'name': 'Tonsillitis', 'probability': 0.30}
                ]
            else:
                conditions = [
                    {'name': 'Viral infection', 'probability': 0.60},
                    {'name': 'Bacterial infection', 'probability': 0.35},
                    {'name': 'Flu', 'probability': 0.45}
                ]

        elif 'cough' in symptom_text:
            if 'shortness of breath' in symptom_text:
                conditions = [
                    {'name': 'Asthma', 'probability': 0.50},
                    {'name': 'Bronchitis', 'probability': 0.45},
                    {'name': 'Pneumonia', 'probability': 0.30}
                ]
            elif 'chest pain' in symptom_text:
                conditions = [
                    {'name': 'Bronchitis', 'probability': 0.55},
                    {'name': 'Upper respiratory infection', 'probability': 0.40},
                    {'name': 'Muscle strain', 'probability': 0.25}
                ]
            else:
                conditions = [
                    {'name': 'Common cold', 'probability': 0.60},
                    {'name': 'Upper respiratory infection', 'probability': 0.45},
                    {'name': 'Allergic reaction', 'probability': 0.25}
                ]

        elif 'stomach pain' in symptom_text or 'nausea' in symptom_text:
            if 'diarrhea' in symptom_text:
                conditions = [
                    {'name': 'Gastroenteritis', 'probability': 0.70},
                    {'name': 'Food poisoning', 'probability': 0.50},
                    {'name': 'Viral gastroenteritis', 'probability': 0.40}
                ]
            elif 'fever' in symptom_text:
                conditions = [
                    {'name': 'Gastroenteritis', 'probability': 0.65},
                    {'name': 'Food poisoning', 'probability': 0.45},
                    {'name': 'Stomach flu', 'probability': 0.40}
                ]
            else:
                conditions = [
                    {'name': 'Indigestion', 'probability': 0.55},
                    {'name': 'Gastritis', 'probability': 0.35},
                    {'name': 'Acid reflux', 'probability': 0.30}
                ]

        elif 'chest pain' in symptom_text:
            if 'shortness of breath' in symptom_text:
                conditions = [
                    {'name': 'Anxiety attack', 'probability': 0.45},
                    {'name': 'Asthma', 'probability': 0.35},
                    {'name': 'Muscle strain', 'probability': 0.30}
                ]
            else:
                conditions = [
                    {'name': 'Muscle strain', 'probability': 0.50},
                    {'name': 'Costochondritis', 'probability': 0.30},
                    {'name': 'Acid reflux', 'probability': 0.25}
                ]

        elif 'sore throat' in symptom_text:
            if 'cough' in symptom_text:
                conditions = [
                    {'name': 'Upper respiratory infection', 'probability': 0.60},
                    {'name': 'Common cold', 'probability': 0.50},
                    {'name': 'Laryngitis', 'probability': 0.30}
                ]
            else:
                conditions = [
                    {'name': 'Viral pharyngitis', 'probability': 0.55},
                    {'name': 'Strep throat', 'probability': 0.35},
                    {'name': 'Dry air irritation', 'probability': 0.25}
                ]

        elif 'fatigue' in symptom_text:
            if 'headache' in symptom_text:
                conditions = [
                    {'name': 'Dehydration', 'probability': 0.50},
                    {'name': 'Sleep deprivation', 'probability': 0.45},
                    {'name': 'Stress', 'probability': 0.35}
                ]
            else:
                conditions = [
                    {'name': 'Sleep deprivation', 'probability': 0.55},
                    {'name': 'Iron deficiency', 'probability': 0.35},
                    {'name': 'Stress', 'probability': 0.40}
                ]

        elif 'dizziness' in symptom_text:
            if 'nausea' in symptom_text:
                conditions = [
                    {'name': 'Vertigo', 'probability': 0.55},
                    {'name': 'Inner ear infection', 'probability': 0.40},
                    {'name': 'Dehydration', 'probability': 0.30}
                ]
            else:
                conditions = [
                    {'name': 'Low blood pressure', 'probability': 0.45},
                    {'name': 'Dehydration', 'probability': 0.40},
                    {'name': 'Inner ear problem', 'probability': 0.35}
                ]

        elif 'back pain' in symptom_text:
            conditions = [
                {'name': 'Muscle strain', 'probability': 0.60},
                {'name': 'Poor posture', 'probability': 0.45},
                {'name': 'Herniated disc', 'probability': 0.25}
            ]

        elif 'shortness of breath' in symptom_text:
            conditions = [
                {'name': 'Asthma', 'probability': 0.50},
                {'name': 'Anxiety', 'probability': 0.40},
                {'name': 'Physical exertion', 'probability': 0.35}
            ]

        elif 'diarrhea' in symptom_text:
            conditions = [
                {'name': 'Gastroenteritis', 'probability': 0.60},
                {'name': 'Food intolerance', 'probability': 0.40},
                {'name': 'Stress', 'probability': 0.25}
            ]

        # Default fallback for unrecognized or general symptoms
        else:
            conditions = [
                {'name': 'Minor viral illness', 'probability': 0.40},
                {'name': 'Stress-related symptoms', 'probability': 0.35},
                {'name': 'Lifestyle factors', 'probability': 0.30}
            ]

        return {'conditions': conditions}

    def _get_mock_triage(self, symptoms):
        """Generate mock triage for testing"""
        symptom_names = [s.get('name', '').lower() for s in symptoms]
        symptom_text = ' '.join(symptom_names)

        # Emergency symptoms - require immediate attention
        emergency_keywords = ['chest pain', 'shortness of breath', 'severe', 'difficulty breathing']
        if any(keyword in symptom_text for keyword in emergency_keywords):
            # But not if it's clearly anxiety/mild related
            if 'chest pain' in symptom_text and 'anxiety' in symptom_text.lower():
                return {'triage_level': 'consultation'}
            return {'triage_level': 'emergency'}

        # Consultation needed - should see a doctor
        consultation_keywords = [
            'fever', 'persistent', 'headache', 'stomach pain', 'diarrhea',
            'vomiting', 'sore throat', 'back pain'
        ]
        if any(keyword in symptom_text for keyword in consultation_keywords):
            return {'triage_level': 'consultation'}

        # Self care - manageable at home
        self_care_keywords = ['fatigue', 'mild', 'dizziness', 'nausea']
        if any(keyword in symptom_text for keyword in self_care_keywords):
            return {'triage_level': 'self_care'}

        # Default to consultation for safety
        return {'triage_level': 'consultation'}

    def parse_symptoms(self, text, sex="unknown", age=30):
        """Parse natural language text to extract symptoms"""
        if self.testing_mode:
            logger.info("Using mock symptom parsing (testing mode)")
            mock_symptoms = self._get_mock_symptoms(text)
            return {'mentions': mock_symptoms}

        try:
            payload = {
                "text": text,
                "sex": sex,
                "age": {"value": age},
                "include_tokens": True
            }

            response = requests.post(
                f"{self.base_url}/parse",
                headers=self.headers,
                json=payload
            )

            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Parse API error: {response.status_code} - {response.text}")
                return None

        except Exception as e:
            logger.error(f"Error parsing symptoms: {str(e)}")
            return None

    def get_diagnosis(self, symptoms, sex="unknown", age=30):
        """Get potential diagnoses based on symptoms"""
        if self.testing_mode:
            logger.info("Using mock diagnosis (testing mode)")
            return self._get_mock_diagnosis(symptoms)

        try:
            # Format evidence for diagnosis
            evidence = []
            for symptom in symptoms:
                evidence.append({
                    "id": symptom.get("id"),
                    "choice_id": symptom.get("choice_id", "present"),
                    "source": "initial"
                })

            payload = {
                "sex": sex,
                "age": {"value": age},
                "evidence": evidence,
                "extras": {
                    "disable_groups": False,
                    "include_red_flag_conditions": True
                }
            }

            response = requests.post(
                f"{self.base_url}/diagnosis",
                headers=self.headers,
                json=payload
            )

            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Diagnosis API error: {response.status_code} - {response.text}")
                return None

        except Exception as e:
            logger.error(f"Error getting diagnosis: {str(e)}")
            return None

    def get_triage(self, symptoms, sex="unknown", age=30):
        """Get triage recommendation"""
        if self.testing_mode:
            logger.info("Using mock triage (testing mode)")
            return self._get_mock_triage(symptoms)

        try:
            evidence = []
            for symptom in symptoms:
                evidence.append({
                    "id": symptom.get("id"),
                    "choice_id": symptom.get("choice_id", "present"),
                    "source": "initial"
                })

            payload = {
                "sex": sex,
                "age": {"value": age},
                "evidence": evidence
            }

            response = requests.post(
                f"{self.base_url}/triage",
                headers=self.headers,
                json=payload
            )

            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Triage API error: {response.status_code} - {response.text}")
                return None

        except Exception as e:
            logger.error(f"Error getting triage: {str(e)}")
            return None


# Initialize Infermedica client
infermedica_client = InfermedicaClient()


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'Medical Chatbot API'
    })


@app.route('/api/medical-query', methods=['POST'])
def medical_query():
    """Main endpoint for processing medical queries"""
    try:
        # Get request data
        data = request.get_json()

        if not data or 'query' not in data:
            return jsonify({
                'error': 'Missing required field: query'
            }), 400

        query_text = data['query'].strip()
        user_sex = data.get('sex', 'unknown')  # male, female, or unknown
        user_age = data.get('age', 30)
        session_id = data.get('session_id', 'default')

        if not query_text:
            return jsonify({
                'error': 'Query text cannot be empty'
            }), 400

        logger.info(f"Processing medical query: {query_text}")

        # Step 1: Parse the symptoms from natural language
        parsed_data = infermedica_client.parse_symptoms(
            text=query_text,
            sex=user_sex,
            age=user_age
        )

        if not parsed_data:
            return jsonify({
                'error': 'Failed to parse symptoms from query',
                'response': 'I apologize, but I encountered an error while processing your medical query. Please try rephrasing your question or contact support.'
            }), 500

        # Extract mentions (symptoms/conditions identified)
        mentions = parsed_data.get('mentions', [])

        # Handle non-medical queries with appropriate responses
        if not mentions:
            query_lower = query_text.lower().strip()

            # Greeting responses
            if any(greeting in query_lower for greeting in ['hi', 'hello', 'hey']):
                return jsonify({
                    'response': 'Hello! I\'m your medical assistant. I\'m here to help you understand symptoms and provide general health guidance. You can describe any symptoms you\'re experiencing, ask health-related questions, or let me know how you\'re feeling. How can I help you today?',
                    'session_id': session_id,
                    'type': 'greeting'
                })

            elif any(phrase in query_lower for phrase in ['how are you', 'how do you do']):
                return jsonify({
                    'response': 'I\'m doing well, thank you for asking! I\'m here and ready to help you with any health concerns or questions you might have. How are you feeling today?',
                    'session_id': session_id,
                    'type': 'greeting'
                })

            elif any(phrase in query_lower for phrase in ['what are you', 'who are you', 'what can you do']):
                return jsonify({
                    'response': 'I\'m an AI medical assistant designed to help you understand symptoms and provide general health guidance. I can:\n\n• Analyze symptoms you describe\n• Provide information about possible conditions\n• Give general health advice\n• Help you understand when to seek medical care\n\nPlease remember that I\'m not a replacement for professional medical advice. How can I help you with your health today?',
                    'session_id': session_id,
                    'type': 'introduction'
                })

            elif any(phrase in query_lower for phrase in ['thank', 'thanks']):
                return jsonify({
                    'response': 'You\'re welcome! I\'m glad I could help. If you have any other health questions or concerns, feel free to ask. Stay healthy!',
                    'session_id': session_id,
                    'type': 'acknowledgment'
                })

            elif any(phrase in query_lower for phrase in ['bye', 'goodbye', 'see you']):
                return jsonify({
                    'response': 'Goodbye! Take care of yourself, and don\'t hesitate to come back if you have any health questions or concerns. Stay well!',
                    'session_id': session_id,
                    'type': 'farewell'
                })

            else:
                # General non-medical query
                return jsonify({
                    'response': 'I\'m a medical assistant, so I\'m here to help with health-related questions and concerns. If you have any symptoms you\'d like to discuss or health questions, please let me know! For example, you could tell me about any pain, discomfort, or changes you\'ve noticed in how you feel.',
                    'session_id': session_id,
                    'suggestions': [
                        'Describe specific symptoms (e.g., "I have a headache and fever")',
                        'Ask about a health condition',
                        'Inquire about when to see a doctor'
                    ]
                })

        # Step 2: Get potential diagnoses
        diagnosis_data = infermedica_client.get_diagnosis(
            symptoms=mentions,
            sex=user_sex,
            age=user_age
        )

        # Step 3: Get triage recommendation
        triage_data = infermedica_client.get_triage(
            symptoms=mentions,
            sex=user_sex,
            age=user_age
        )

        # Step 4: Format response
        response_text = format_medical_response(mentions, diagnosis_data, triage_data)

        return jsonify({
            'response': response_text,
            'session_id': session_id,
            'parsed_symptoms': [mention.get('name', 'Unknown') for mention in mentions],
            'triage_level': triage_data.get('triage_level') if triage_data else None,
            'timestamp': datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f"Error processing medical query: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'response': 'I apologize, but I encountered an unexpected error. Please try again later or consult with a healthcare professional.'
        }), 500


def format_medical_response(symptoms, diagnosis_data, triage_data):
    """Format the medical response in a conversational manner"""

    response_parts = []

    # Acknowledge symptoms
    if symptoms:
        symptom_names = [s.get('name', 'symptom') for s in symptoms]
        if len(symptom_names) == 1:
            response_parts.append(f"I understand you're experiencing {symptom_names[0]}.")
        else:
            response_parts.append(
                f"I understand you're experiencing {', '.join(symptom_names[:-1])} and {symptom_names[-1]}.")

    # Add triage information
    if triage_data:
        triage_level = triage_data.get('triage_level')
        if triage_level == 'emergency':
            response_parts.append(
                "⚠️ Based on your symptoms, this may require immediate medical attention. Please seek emergency care or call emergency services.")
        elif triage_level == 'consultation':
            response_parts.append(
                "I recommend scheduling an appointment with a healthcare provider to discuss these symptoms.")
        elif triage_level == 'self_care':
            response_parts.append("These symptoms may be manageable with self-care, but monitor them closely.")

    # Add potential conditions
    if diagnosis_data and diagnosis_data.get('conditions'):
        conditions = diagnosis_data['conditions'][:3]  # Top 3 conditions
        if conditions:
            response_parts.append(
                "\nBased on the symptoms you've described, some possible conditions to consider include:")
            for i, condition in enumerate(conditions, 1):
                name = condition.get('name', 'Unknown condition')
                probability = condition.get('probability', 0)
                response_parts.append(f"{i}. {name} (likelihood: {probability:.1%})")

    # Add disclaimer
    response_parts.append(
        "\n⚠️ Important: This is not a medical diagnosis. Please consult with a qualified healthcare professional for proper evaluation and treatment. If you're experiencing severe symptoms or this is an emergency, seek immediate medical care.")

    return "\n".join(response_parts)


@app.route('/api/symptoms', methods=['GET'])
def get_symptoms():
    """Get available symptoms from Infermedica"""
    if TESTING_MODE:
        # Return mock symptoms for testing
        mock_symptoms = [
            {'id': 's_1', 'name': 'Headache', 'category': 'neurological'},
            {'id': 's_2', 'name': 'Fever', 'category': 'general'},
            {'id': 's_3', 'name': 'Cough', 'category': 'respiratory'},
            {'id': 's_4', 'name': 'Sore throat', 'category': 'respiratory'},
            {'id': 's_5', 'name': 'Nausea', 'category': 'digestive'},
            {'id': 's_6', 'name': 'Fatigue', 'category': 'general'},
            {'id': 's_7', 'name': 'Stomach pain', 'category': 'digestive'},
            {'id': 's_8', 'name': 'Diarrhea', 'category': 'digestive'},
            {'id': 's_9', 'name': 'Chest pain', 'category': 'cardiovascular'},
            {'id': 's_10', 'name': 'Shortness of breath', 'category': 'respiratory'}
        ]
        return jsonify(mock_symptoms)

    try:
        response = requests.get(
            f"{INFERMEDICA_API_URL}/symptoms",
            headers=HEADERS
        )

        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'Failed to fetch symptoms'}), 500

    except Exception as e:
        logger.error(f"Error fetching symptoms: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/api/conditions', methods=['GET'])
def get_conditions():
    """Get available conditions from Infermedica"""
    if TESTING_MODE:
        # Return mock conditions for testing
        mock_conditions = [
            {'id': 'c_1', 'name': 'Common cold', 'category': 'infectious'},
            {'id': 'c_2', 'name': 'Flu', 'category': 'infectious'},
            {'id': 'c_3', 'name': 'Migraine', 'category': 'neurological'},
            {'id': 'c_4', 'name': 'Gastroenteritis', 'category': 'digestive'},
            {'id': 'c_5', 'name': 'Anxiety', 'category': 'psychological'},
            {'id': 'c_6', 'name': 'Upper respiratory infection', 'category': 'respiratory'},
            {'id': 'c_7', 'name': 'Muscle strain', 'category': 'musculoskeletal'},
            {'id': 'c_8', 'name': 'Food poisoning', 'category': 'digestive'}
        ]
        return jsonify(mock_conditions)

    try:
        response = requests.get(
            f"{INFERMEDICA_API_URL}/conditions",
            headers=HEADERS
        )

        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({'error': 'Failed to fetch conditions'}), 500

    except Exception as e:
        logger.error(f"Error fetching conditions: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    # Display startup information
    mode_text = "🧪 TESTING MODE" if TESTING_MODE else "🔑 PRODUCTION MODE"
    print(f"🏥 Medical Chatbot API starting in {mode_text}")

    if TESTING_MODE:
        print("✅ Using mock data - no Infermedica API credentials needed")
        print("💡 To use real Infermedica API, set TESTING_MODE=false and provide credentials")
    else:
        if INFERMEDICA_APP_ID == 'your_app_id_here' or INFERMEDICA_APP_KEY == 'your_app_key_here':
            print("⚠️  Warning: Please set your Infermedica API credentials!")
            print("Set environment variables: INFERMEDICA_APP_ID and INFERMEDICA_APP_KEY")

    print("📡 API available at: http://localhost:5002")
    print("🔗 Main endpoint: POST /api/medical-query")
    print("🔍 Health check: GET /health")
    print("💬 Example usage:")
    print('   curl -X POST http://localhost:5002/api/medical-query \\')
    print('        -H "Content-Type: application/json" \\')
    print('        -d \'{"query":"I have a headache and fever"}\'')

    app.run(
        debug=True,
        host='0.0.0.0',
        port=5002
    )