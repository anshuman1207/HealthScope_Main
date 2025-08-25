from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import cv2
import base64
import io
from PIL import Image
import pytesseract
import re
import os
from datetime import datetime
import warnings
import json

warnings.filterwarnings('ignore')

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration


# Configure Tesseract path (adjust based on your system)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'  # Windows
# For Linux/Mac, usually no need to set this if installed via package manager


class MedicalImageAnalyzer:
    """Advanced Medical Image Analysis System"""

    def __init__(self):
        # Medical terminology database for text extraction
        self.medical_keywords = {
            'laboratory_values': [
                'glucose', 'cholesterol', 'hdl', 'ldl', 'triglycerides', 'creatinine',
                'bun', 'hemoglobin', 'hematocrit', 'wbc', 'rbc', 'platelets',
                'sodium', 'potassium', 'chloride', 'co2', 'calcium', 'magnesium',
                'phosphorus', 'albumin', 'protein', 'bilirubin', 'ast', 'alt',
                'alkaline phosphatase', 'ggt', 'ldh', 'ck', 'troponin', 'bnp',
                'prothrombin', 'inr', 'ptt', 'fibrinogen', 'hba1c', 'psa',
                'thyroid', 'tsh', 'free t4', 't3', 'cortisol', 'vitamin d'
            ],
            'imaging_terms': [
                'opacity', 'consolidation', 'infiltrate', 'effusion', 'pneumothorax',
                'cardiomegaly', 'atelectasis', 'nodule', 'mass', 'lesion',
                'fracture', 'dislocation', 'edema', 'hemorrhage', 'infarct',
                'stenosis', 'occlusion', 'aneurysm', 'thrombosis', 'embolism'
            ],
            'anatomical_terms': [
                'heart', 'lung', 'liver', 'kidney', 'brain', 'spine', 'chest',
                'abdomen', 'pelvis', 'extremities', 'aorta', 'ventricle', 'atrium',
                'coronary', 'pulmonary', 'hepatic', 'renal', 'cerebral', 'vertebral'
            ],
            'clinical_findings': [
                'normal', 'abnormal', 'elevated', 'decreased', 'high', 'low',
                'positive', 'negative', 'acute', 'chronic', 'mild', 'moderate',
                'severe', 'stable', 'progressive', 'resolved', 'improved', 'worsened'
            ]
        }

        # Disease pattern database for medical images
        self.disease_patterns = {
            'Pneumonia': {
                'keywords': ['opacity', 'consolidation', 'infiltrate', 'lung', 'chest', 'respiratory'],
                'lab_indicators': ['elevated wbc', 'high temperature', 'increased crp'],
                'risk_factors': ['fever', 'cough', 'shortness of breath'],
                'base_risk': 65,
                'confidence_boost': 0.85
            },
            'Myocardial Infarction': {
                'keywords': ['troponin', 'elevated', 'cardiac', 'heart', 'ck-mb', 'ecg'],
                'lab_indicators': ['troponin i', 'troponin t', 'ck-mb', 'ldh'],
                'risk_factors': ['chest pain', 'elevated cardiac enzymes'],
                'base_risk': 85,
                'confidence_boost': 0.90
            },
            'Diabetes Mellitus': {
                'keywords': ['glucose', 'hba1c', 'diabetes', 'elevated', 'high'],
                'lab_indicators': ['glucose >126', 'hba1c >7', 'random glucose >200'],
                'risk_factors': ['polyuria', 'polydipsia', 'weight loss'],
                'base_risk': 70,
                'confidence_boost': 0.88
            },
            'Kidney Disease': {
                'keywords': ['creatinine', 'bun', 'kidney', 'renal', 'elevated', 'decreased gfr'],
                'lab_indicators': ['elevated creatinine', 'elevated bun', 'proteinuria'],
                'risk_factors': ['hypertension', 'diabetes', 'family history'],
                'base_risk': 60,
                'confidence_boost': 0.82
            },
            'Liver Disease': {
                'keywords': ['alt', 'ast', 'bilirubin', 'liver', 'hepatic', 'elevated'],
                'lab_indicators': ['elevated alt', 'elevated ast', 'elevated bilirubin'],
                'risk_factors': ['alcohol use', 'hepatitis', 'medication toxicity'],
                'base_risk': 55,
                'confidence_boost': 0.80
            },
            'Anemia': {
                'keywords': ['hemoglobin', 'hematocrit', 'low', 'decreased', 'rbc'],
                'lab_indicators': ['low hemoglobin', 'low hematocrit', 'decreased rbc'],
                'risk_factors': ['fatigue', 'weakness', 'pallor'],
                'base_risk': 40,
                'confidence_boost': 0.75
            },
            'Hyperlipidemia': {
                'keywords': ['cholesterol', 'ldl', 'triglycerides', 'elevated', 'high'],
                'lab_indicators': ['total cholesterol >200', 'ldl >100', 'triglycerides >150'],
                'risk_factors': ['family history', 'diet', 'sedentary lifestyle'],
                'base_risk': 45,
                'confidence_boost': 0.78
            },
            'Thyroid Dysfunction': {
                'keywords': ['tsh', 'thyroid', 't4', 't3', 'elevated', 'decreased'],
                'lab_indicators': ['abnormal tsh', 'abnormal free t4'],
                'risk_factors': ['fatigue', 'weight changes', 'mood changes'],
                'base_risk': 50,
                'confidence_boost': 0.83
            }
        }

        # Medical reference ranges for lab values
        self.reference_ranges = {
            'glucose': {'normal': (70, 100), 'unit': 'mg/dL', 'critical': 126},
            'cholesterol': {'normal': (0, 200), 'unit': 'mg/dL', 'critical': 240},
            'hdl': {'normal': (40, 100), 'unit': 'mg/dL', 'critical_low': 40},
            'ldl': {'normal': (0, 100), 'unit': 'mg/dL', 'critical': 160},
            'triglycerides': {'normal': (0, 150), 'unit': 'mg/dL', 'critical': 200},
            'hemoglobin': {'normal': (12, 16), 'unit': 'g/dL', 'critical_low': 10},
            'hematocrit': {'normal': (36, 46), 'unit': '%', 'critical_low': 30},
            'wbc': {'normal': (4500, 11000), 'unit': '/μL', 'critical': 15000},
            'creatinine': {'normal': (0.6, 1.2), 'unit': 'mg/dL', 'critical': 2.0},
            'bun': {'normal': (7, 20), 'unit': 'mg/dL', 'critical': 50},
            'hba1c': {'normal': (0, 5.7), 'unit': '%', 'critical': 7.0}
        }

    def preprocess_image(self, image_data, image_format='base64'):
        """Preprocess image for better OCR results - optimized for medical documents"""
        try:
            if image_format == 'base64':
                if isinstance(image_data, str):
                    # Remove data URL prefix if present
                    if image_data.startswith('data:'):
                        base64_data = image_data.split(',')[1] if ',' in image_data else image_data
                    else:
                        base64_data = image_data

                    try:
                        # Decode base64 image
                        image_bytes = base64.b64decode(base64_data)

                        if len(image_bytes) < 100:
                            raise ValueError("Image data too small")

                        image = Image.open(io.BytesIO(image_bytes))

                    except (base64.binascii.Error, ValueError) as e:
                        print(f"Base64 decode error: {e}")
                        return None, None

                else:
                    print(f"Expected string for base64 image data, got {type(image_data)}")
                    return None, None

            else:
                # Load image from file path
                if not os.path.exists(image_data):
                    print(f"Image file not found: {image_data}")
                    return None, None
                image = Image.open(image_data)

            # Validate image
            if image is None:
                print("Failed to load image")
                return None, None

            print(f"Original image: {image.size}, mode: {image.mode}")

            # Convert to RGB if necessary
            if image.mode != 'RGB':
                print(f"Converting image from {image.mode} to RGB")
                image = image.convert('RGB')

            # Convert PIL to OpenCV format
            opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

            # Create multiple versions for better OCR
            processed_images = []

            # Version 1: Original grayscale
            gray = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2GRAY)
            processed_images.append(("original_gray", gray))

            # Version 2: Enhanced contrast
            clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
            enhanced = clahe.apply(gray)
            processed_images.append(("enhanced", enhanced))

            # Version 3: Gaussian blur + threshold (good for noisy images)
            blurred = cv2.GaussianBlur(gray, (1, 1), 0)
            thresh_gaussian = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                                    cv2.THRESH_BINARY, 11, 2)
            processed_images.append(("gaussian_thresh", thresh_gaussian))

            # Version 4: Mean threshold (good for uniform lighting)
            thresh_mean = cv2.adaptiveThreshold(enhanced, 255, cv2.ADAPTIVE_THRESH_MEAN_C,
                                                cv2.THRESH_BINARY, 15, 10)
            processed_images.append(("mean_thresh", thresh_mean))

            # Version 5: Otsu's thresholding (good for bimodal images)
            _, thresh_otsu = cv2.threshold(enhanced, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            processed_images.append(("otsu_thresh", thresh_otsu))

            # Try OCR on each version and return the best result
            best_text = ""
            best_confidence = 0
            best_image = gray

            for name, img in processed_images:
                try:
                    # Test OCR confidence
                    data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
                    confidences = [int(conf) for conf in data['conf'] if int(conf) > 0]
                    avg_confidence = sum(confidences) / len(confidences) if confidences else 0

                    # Quick text extraction test
                    test_text = pytesseract.image_to_string(img, config='--psm 6 --oem 3')

                    print(f"{name}: confidence={avg_confidence:.1f}, text_length={len(test_text)}")

                    # Choose best version based on confidence and text length
                    score = avg_confidence + (len(test_text) * 0.1)  # Favor longer text slightly

                    if score > best_confidence:
                        best_confidence = score
                        best_text = test_text
                        best_image = img

                except Exception as e:
                    print(f"OCR test failed for {name}: {e}")
                    continue

            print(f"Best preprocessing method found with confidence: {best_confidence:.1f}")
            print(f"Best text preview: {best_text[:100]}...")

            return best_image, opencv_image

        except Exception as e:
            print(f"Image preprocessing error: {e}")
            return None, None

    def extract_text_from_image(self, processed_image):
        """Extract text using multiple OCR strategies for better results"""
        try:
            all_text = ""
            best_text = ""
            max_length = 0

            # Strategy 1: General document analysis
            config1 = r'--oem 3 --psm 6'
            try:
                text1 = pytesseract.image_to_string(processed_image, config=config1)
                all_text += f"\n=== METHOD 1 ===\n{text1}"
                if len(text1) > max_length:
                    max_length = len(text1)
                    best_text = text1
            except Exception as e:
                print(f"OCR Method 1 failed: {e}")

            # Strategy 2: Single text block
            config2 = r'--oem 3 --psm 8'
            try:
                text2 = pytesseract.image_to_string(processed_image, config=config2)
                all_text += f"\n=== METHOD 2 ===\n{text2}"
                if len(text2) > max_length:
                    max_length = len(text2)
                    best_text = text2
            except Exception as e:
                print(f"OCR Method 2 failed: {e}")

            # Strategy 3: Assume single column of text of variable sizes
            config3 = r'--oem 3 --psm 4'
            try:
                text3 = pytesseract.image_to_string(processed_image, config=config3)
                all_text += f"\n=== METHOD 3 ===\n{text3}"
                if len(text3) > max_length:
                    max_length = len(text3)
                    best_text = text3
            except Exception as e:
                print(f"OCR Method 3 failed: {e}")

            # Strategy 4: Medical-specific character set (more permissive)
            config4 = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,():/-+=\%<>[]{}| '
            try:
                text4 = pytesseract.image_to_string(processed_image, config=config4)
                all_text += f"\n=== METHOD 4 (Medical) ===\n{text4}"
                if len(text4) > max_length:
                    max_length = len(text4)
                    best_text = text4
            except Exception as e:
                print(f"OCR Method 4 failed: {e}")

            # Strategy 5: Treat image as a single word (for short labels)
            config5 = r'--oem 3 --psm 7'
            try:
                text5 = pytesseract.image_to_string(processed_image, config=config5)
                all_text += f"\n=== METHOD 5 (Single Word) ===\n{text5}"
                if len(text5) > max_length:
                    max_length = len(text5)
                    best_text = text5
            except Exception as e:
                print(f"OCR Method 5 failed: {e}")

            # Get detailed OCR data from best method
            data = {}
            if best_text:
                try:
                    data = pytesseract.image_to_data(processed_image, output_type=pytesseract.Output.DICT)
                except:
                    data = {}

            # Clean the best text
            cleaned_text = self.clean_extracted_text(best_text) if best_text else ""

            print(f"\nOCR Results Summary:")
            print(f"Best text length: {len(cleaned_text)}")
            print(f"Best text preview: {cleaned_text[:200]}...")

            # Return both best text and all attempts for debugging
            debug_info = {
                'all_methods_text': all_text,
                'best_method_length': len(cleaned_text),
                'ocr_data': data
            }

            return cleaned_text, debug_info

        except Exception as e:
            print(f"OCR extraction error: {e}")
            return "", {}

    def clean_extracted_text(self, raw_text):
        """Enhanced text cleaning for medical documents"""
        if not raw_text:
            return ""

        # Remove excessive whitespace and clean up
        cleaned_lines = []

        for line in raw_text.split('\n'):
            line = line.strip()

            # Skip very short lines that are likely OCR noise
            if len(line) < 2:
                continue

            # Skip lines with too many special characters (likely OCR errors)
            special_char_ratio = sum(1 for c in line if not c.isalnum() and c not in ' .,:-+()[]{}') / len(line)
            if special_char_ratio > 0.5:
                continue

            # Clean up common OCR errors
            line = line.replace('|', 'I')  # Common OCR error
            line = line.replace('0', 'O')  # In medical context, often O not 0
            line = re.sub(r'\s+', ' ', line)  # Multiple spaces to single space

            cleaned_lines.append(line)

        result = '\n'.join(cleaned_lines)

        # Additional cleaning
        result = re.sub(r'\n\s*\n', '\n', result)  # Remove empty lines
        result = result.strip()

        return result

    def extract_text_from_image(self, processed_image):
        """Extract text using OCR with medical-specific configuration"""
        try:
            # OCR configuration optimized for medical documents
            custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,():/-+=%<> '

            # Extract text
            extracted_text = pytesseract.image_to_string(processed_image, config=custom_config)

            # Also get detailed information about text regions
            data = pytesseract.image_to_data(processed_image, output_type=pytesseract.Output.DICT)

            # Clean and organize extracted text
            cleaned_text = self.clean_extracted_text(extracted_text)

            return cleaned_text, data

        except Exception as e:
            print(f"OCR extraction error: {e}")
            return "", {}

    def clean_extracted_text(self, raw_text):
        """Clean and structure extracted text"""
        if not raw_text:
            return ""

        # Remove excessive whitespace and clean up
        cleaned_lines = []
        for line in raw_text.split('\n'):
            line = line.strip()
            if line and len(line) > 2:  # Keep only meaningful lines
                cleaned_lines.append(line)

        return '\n'.join(cleaned_lines)

    def extract_medical_entities(self, text):
        """Extract medical entities and values from text"""
        medical_entities = {
            'laboratory_values': [],
            'measurements': [],
            'diagnoses': [],
            'medications': [],
            'anatomical_references': [],
            'clinical_findings': []
        }

        text_lower = text.lower()

        # Extract laboratory values with numbers
        lab_pattern = r'([a-zA-Z\s]+)[\s:=]+([0-9]+\.?[0-9]*)\s*([a-zA-Z/%μ]*)'
        lab_matches = re.findall(lab_pattern, text)

        for match in lab_matches:
            lab_name, value, unit = match
            lab_name = lab_name.strip()

            # Check if this is a known lab value
            for keyword in self.medical_keywords['laboratory_values']:
                if keyword in lab_name.lower():
                    medical_entities['laboratory_values'].append({
                        'name': lab_name,
                        'value': float(value) if value else None,
                        'unit': unit.strip() if unit else '',
                        'keyword_match': keyword
                    })
                    break

        # Extract other medical terms
        for category, keywords in self.medical_keywords.items():
            if category != 'laboratory_values':  # Already processed
                for keyword in keywords:
                    if keyword in text_lower:
                        medical_entities[category if category != 'clinical_findings' else 'clinical_findings'].append(
                            keyword)

        return medical_entities

    def analyze_lab_values(self, lab_values):
        """Analyze laboratory values against reference ranges"""
        findings = []
        risk_indicators = []

        for lab in lab_values:
            name = lab['name'].lower()
            value = lab['value']

            if not value:
                continue

            # Find matching reference range
            ref_range = None
            for ref_key, ref_data in self.reference_ranges.items():
                if ref_key in name or any(keyword in name for keyword in [ref_key.replace('_', ' ')]):
                    ref_range = ref_data
                    break

            if ref_range:
                normal_min, normal_max = ref_range['normal']

                if value < normal_min:
                    severity = 'CRITICAL' if 'critical_low' in ref_range and value < ref_range[
                        'critical_low'] else 'LOW'
                    findings.append(f"{lab['name']}: {value} {lab['unit']} (LOW - Normal: {normal_min}-{normal_max})")
                    if severity == 'CRITICAL':
                        risk_indicators.append(f"Critically low {lab['name']}")

                elif value > normal_max:
                    severity = 'CRITICAL' if 'critical' in ref_range and value > ref_range['critical'] else 'HIGH'
                    findings.append(f"{lab['name']}: {value} {lab['unit']} (HIGH - Normal: {normal_min}-{normal_max})")
                    if severity == 'CRITICAL':
                        risk_indicators.append(f"Critically elevated {lab['name']}")
                else:
                    findings.append(f"{lab['name']}: {value} {lab['unit']} (Normal)")

        return findings, risk_indicators

    def predict_disease_from_image(self, medical_entities, risk_indicators):
        """Predict most likely disease based on extracted medical information"""
        disease_scores = {}

        # Calculate scores for each disease
        for disease, pattern in self.disease_patterns.items():
            score = 0
            matched_indicators = []

            # Check keywords in extracted text
            all_extracted_text = []
            for category, items in medical_entities.items():
                if isinstance(items, list):
                    all_extracted_text.extend([str(item) for item in items])

            combined_text = ' '.join(all_extracted_text).lower()

            # Score based on keyword matches
            for keyword in pattern['keywords']:
                if keyword in combined_text:
                    score += 15
                    matched_indicators.append(f"Keyword match: {keyword}")

            # Score based on lab indicators
            for indicator in pattern['lab_indicators']:
                if any(indicator.lower() in ri.lower() for ri in risk_indicators):
                    score += 25
                    matched_indicators.append(f"Lab indicator: {indicator}")

            # Bonus for specific lab values
            lab_values = medical_entities.get('laboratory_values', [])
            for lab in lab_values:
                lab_name = lab.get('keyword_match', '').lower()
                for keyword in pattern['keywords']:
                    if keyword in lab_name:
                        score += 10
                        break

            disease_scores[disease] = {
                'score': score,
                'matched_indicators': matched_indicators,
                'base_risk': pattern['base_risk'],
                'confidence_boost': pattern['confidence_boost']
            }

        # Find best match
        if disease_scores:
            best_disease = max(disease_scores.keys(), key=lambda k: disease_scores[k]['score'])

            if disease_scores[best_disease]['score'] > 20:  # Minimum threshold
                return best_disease, disease_scores[best_disease]

        return 'Undetermined Condition', {'score': 0, 'matched_indicators': [], 'base_risk': 30,
                                          'confidence_boost': 0.5}

    def calculate_risk_score(self, predicted_disease, disease_data, risk_indicators):
        """Calculate comprehensive risk score"""
        base_risk = disease_data['base_risk']

        # Adjust risk based on indicators
        risk_adjustment = 0

        # Critical indicators increase risk significantly
        critical_terms = ['critical', 'severe', 'acute', 'emergency', 'high', 'elevated']
        for indicator in risk_indicators:
            for term in critical_terms:
                if term in indicator.lower():
                    risk_adjustment += 10
                    break

        # Multiple risk indicators compound the risk
        if len(risk_indicators) > 2:
            risk_adjustment += len(risk_indicators) * 5

        final_risk = min(100, base_risk + risk_adjustment)
        return max(1, final_risk)

    def generate_key_findings(self, medical_entities, lab_findings, risk_indicators):
        """Generate key medical findings"""
        findings = []

        # Add significant lab findings
        significant_labs = [f for f in lab_findings if 'HIGH' in f or 'LOW' in f or 'CRITICAL' in f]
        findings.extend(significant_labs[:3])  # Top 3 abnormal labs

        # Add imaging findings if present
        imaging_terms = medical_entities.get('imaging_terms', [])
        if imaging_terms:
            findings.append(f"Imaging findings: {', '.join(imaging_terms[:2])}")

        # Add clinical findings
        clinical_findings = medical_entities.get('clinical_findings', [])
        significant_clinical = [f for f in clinical_findings if
                                f in ['abnormal', 'elevated', 'decreased', 'severe', 'acute']]
        if significant_clinical:
            findings.append(f"Clinical findings: {', '.join(significant_clinical[:2])}")

        # Add risk indicators
        if risk_indicators:
            findings.extend(risk_indicators[:2])

        # Ensure we have at least some findings
        if not findings:
            findings = [
                "Medical document processed successfully",
                "Refer to extracted text for detailed information",
                "Consult healthcare provider for interpretation"
            ]

        return findings[:5]  # Return top 5 findings

    def generate_recommendations(self, predicted_disease, risk_score):
        """Generate medical recommendations based on analysis"""
        recommendations = []

        # Disease-specific recommendations
        if predicted_disease == 'Myocardial Infarction':
            recommendations = [
                "Seek immediate emergency medical attention",
                "Call 911 or go to nearest emergency room",
                "Take aspirin if not allergic (chew 325mg)",
                "Avoid physical exertion",
                "Monitor for worsening chest pain or shortness of breath"
            ]
        elif predicted_disease == 'Pneumonia':
            recommendations = [
                "Consult healthcare provider immediately",
                "Rest and avoid strenuous activities",
                "Stay well-hydrated with clear fluids",
                "Monitor temperature and breathing",
                "Consider chest X-ray for confirmation"
            ]
        elif predicted_disease == 'Diabetes Mellitus':
            recommendations = [
                "Schedule appointment with healthcare provider soon",
                "Monitor blood glucose levels regularly",
                "Follow diabetic diet guidelines",
                "Increase physical activity as tolerated",
                "Consider diabetes education classes"
            ]
        elif predicted_disease == 'Kidney Disease':
            recommendations = [
                "Consult nephrologist or primary care provider",
                "Monitor blood pressure regularly",
                "Limit sodium and protein intake",
                "Stay well-hydrated unless restricted",
                "Regular kidney function monitoring needed"
            ]
        else:
            # General recommendations based on risk score
            if risk_score >= 80:
                recommendations = [
                    "Seek immediate medical attention",
                    "Contact healthcare provider today",
                    "Monitor symptoms closely",
                    "Do not ignore these findings",
                    "Prepare list of current medications"
                ]
            elif risk_score >= 60:
                recommendations = [
                    "Schedule appointment with healthcare provider within 1-2 days",
                    "Monitor symptoms and keep symptom diary",
                    "Follow any existing treatment plans",
                    "Stay hydrated and rest as needed",
                    "Contact doctor if symptoms worsen"
                ]
            else:
                recommendations = [
                    "Follow up with healthcare provider routinely",
                    "Monitor these findings over time",
                    "Maintain healthy lifestyle habits",
                    "Keep records of these results",
                    "Discuss findings at next medical appointment"
                ]

        return recommendations[:5]

    def filter_relevant_text(self, extracted_text, medical_entities):
        """Filter and return only medically relevant text"""
        if not extracted_text:
            return "No text could be extracted from the image"

        lines = extracted_text.split('\n')
        relevant_lines = []

        # Keywords that indicate medical relevance
        medical_relevance_keywords = set()
        for category, keywords in self.medical_keywords.items():
            medical_relevance_keywords.update(keywords)

        # Additional relevance indicators
        medical_relevance_keywords.update([
            'patient', 'result', 'test', 'normal', 'abnormal', 'high', 'low',
            'positive', 'negative', 'date', 'report', 'laboratory', 'radiology',
            'diagnosis', 'impression', 'findings', 'recommendation'
        ])

        for line in lines:
            line = line.strip()
            if not line or len(line) < 3:
                continue

            line_lower = line.lower()

            # Check if line contains medical keywords
            if any(keyword in line_lower for keyword in medical_relevance_keywords):
                relevant_lines.append(line)
            # Check if line contains numbers (likely lab values)
            elif re.search(r'\d+', line) and len(line.split()) <= 10:
                relevant_lines.append(line)

        if relevant_lines:
            return '\n'.join(relevant_lines)
        else:
            # If no specific relevance found, return first portion of text
            return '\n'.join(lines[:10]) if lines else "Unable to extract relevant medical information"


# Initialize the analyzer
print("Initializing Medical Image Analyzer...")
analyzer = MedicalImageAnalyzer()
print("Medical Image Analysis System Ready!")


@app.route('/api/analyze-image', methods=['POST'])
def analyze_image():
    """API endpoint for medical image analysis"""
    try:
        # Handle different content types
        if request.content_type and 'multipart/form-data' in request.content_type:
            # Handle file upload
            if 'image' not in request.files:
                return jsonify({
                    'success': False,
                    'error': 'No image file provided'
                }), 400

            file = request.files['image']
            if file.filename == '':
                return jsonify({
                    'success': False,
                    'error': 'No file selected'
                }), 400

            # Save temporarily and process
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp_file:
                file.save(tmp_file.name)
                image_data = tmp_file.name
                image_format = 'path'
        else:
            # Handle JSON with base64 data
            data = request.get_json()
            if not data:
                return jsonify({
                    'success': False,
                    'error': 'No JSON data provided'
                }), 400

            image_data = data.get('image_data')
            image_format = data.get('format', 'base64')

        if not image_data:
            return jsonify({
                'success': False,
                'error': 'No image data provided'
            }), 400

        print("Starting image analysis...")
        print(f"Image format: {image_format}")
        if image_format == 'base64':
            print(f"Base64 data length: {len(image_data) if isinstance(image_data, str) else 'Not string'}")

        # Step 1: Preprocess image
        processed_image, original_image = analyzer.preprocess_image(image_data, image_format)

        if processed_image is None:
            return jsonify({
                'success': False,
                'error': 'Failed to process image. Please ensure the image is valid and in supported format (JPEG, PNG, etc.)',
                'predicted_disease': 'Image Processing Failed',
                'ai_confidence': 0.1,
                'risk_score': 0,
                'extracted_text': 'Unable to process image',
                'key_findings': [
                    'Image could not be processed',
                    'Check image format and quality',
                    'Ensure image contains readable text'
                ],
                'recommendations': [
                    'Verify image is in supported format (JPEG, PNG, PDF)',
                    'Ensure image is clear and readable',
                    'Try uploading a different image',
                    'Contact technical support if issues persist'
                ]
            }), 400

        # Step 2: Extract text using OCR
        print("Extracting text from image...")
        try:
            extracted_text, ocr_data = analyzer.extract_text_from_image(processed_image)
            print(f"Extracted text length: {len(extracted_text)}")
            print(f"Extracted text preview: {extracted_text[:200]}...")
        except Exception as ocr_error:
            print(f"OCR Error: {ocr_error}")
            extracted_text = ""
            ocr_data = {}

        # Step 3: Extract medical entities
        print("Analyzing medical entities...")
        try:
            medical_entities = analyzer.extract_medical_entities(extracted_text)
            print(f"Medical entities found: {len(medical_entities.get('laboratory_values', []))}")
        except Exception as entity_error:
            print(f"Entity extraction error: {entity_error}")
            medical_entities = {'laboratory_values': []}

        # Step 4: Analyze laboratory values
        try:
            lab_findings, risk_indicators = analyzer.analyze_lab_values(
                medical_entities.get('laboratory_values', [])
            )
            print(f"Lab findings: {len(lab_findings)}, Risk indicators: {len(risk_indicators)}")
        except Exception as lab_error:
            print(f"Lab analysis error: {lab_error}")
            lab_findings, risk_indicators = [], []

        # Step 5: Predict disease/condition
        print("Predicting medical condition...")
        try:
            predicted_disease, disease_data = analyzer.predict_disease_from_image(
                medical_entities, risk_indicators
            )
            print(f"Predicted disease: {predicted_disease}")
        except Exception as prediction_error:
            print(f"Disease prediction error: {prediction_error}")
            predicted_disease = "Analysis Inconclusive"
            disease_data = {'score': 0, 'matched_indicators': [], 'base_risk': 30, 'confidence_boost': 0.3}

        # Step 6: Calculate risk score
        try:
            risk_score = analyzer.calculate_risk_score(predicted_disease, disease_data, risk_indicators)
        except Exception as risk_error:
            print(f"Risk calculation error: {risk_error}")
            risk_score = 30

        # Step 7: Calculate AI confidence
        try:
            base_confidence = disease_data.get('confidence_boost', 0.5)
            text_quality_score = min(1.0, len(extracted_text) / 500) if extracted_text else 0.1
            entity_score = min(1.0, len(medical_entities.get('laboratory_values', [])) / 5)

            ai_confidence = (base_confidence * 0.6 + text_quality_score * 0.2 + entity_score * 0.2)
            ai_confidence = max(0.1, min(1.0, ai_confidence))
        except Exception as confidence_error:
            print(f"Confidence calculation error: {confidence_error}")
            ai_confidence = 0.3

        # Step 8: Generate key findings
        try:
            key_findings = analyzer.generate_key_findings(medical_entities, lab_findings, risk_indicators)
        except Exception as findings_error:
            print(f"Key findings error: {findings_error}")
            key_findings = [
                "Text extracted from medical image",
                "Analysis completed with limited data",
                "Consult healthcare provider for interpretation"
            ]

        # Step 9: Generate recommendations
        try:
            recommendations = analyzer.generate_recommendations(predicted_disease, risk_score)
        except Exception as rec_error:
            print(f"Recommendations error: {rec_error}")
            recommendations = [
                "Consult with healthcare professional",
                "Review findings with medical provider",
                "Follow standard medical protocols",
                "Maintain regular health monitoring"
            ]

        # Step 10: Filter relevant text
        try:
            relevant_text = analyzer.filter_relevant_text(extracted_text, medical_entities)
        except Exception as filter_error:
            print(f"Text filtering error: {filter_error}")
            relevant_text = extracted_text[:500] if extracted_text else "No text could be extracted"

        # Clean up temporary file if created
        if image_format == 'path' and 'tmp' in str(image_data):
            try:
                os.unlink(image_data)
            except:
                pass

        # Format response
        response = {
            'success': True,
            'predicted_disease': predicted_disease,
            'ai_confidence': round(ai_confidence, 2),
            'risk_score': risk_score,
            'extracted_text': relevant_text,
            'key_findings': key_findings,
            'recommendations': recommendations,
            'analysis_metadata': {
                'total_text_length': len(extracted_text),
                'medical_entities_found': len(medical_entities.get('laboratory_values', [])),
                'risk_indicators_count': len(risk_indicators),
                'processing_timestamp': datetime.now().isoformat(),
                'ocr_confidence': 'processed' if extracted_text else 'failed'
            }
        }

        print(f"Analysis complete: {predicted_disease} with {risk_score}% risk")
        return jsonify(response)

    except Exception as e:
        print(f"API Error: {e}")
        import traceback
        traceback.print_exc()

        return jsonify({
            'success': False,
            'error': f'Analysis failed: {str(e)}',
            'predicted_disease': 'Analysis Error - Consult Healthcare Provider',
            'ai_confidence': 0.1,
            'risk_score': 0,
            'extracted_text': 'Unable to process request',
            'key_findings': [
                'System error occurred during analysis',
                'Image processing failed',
                'Manual review recommended'
            ],
            'recommendations': [
                'Consult with healthcare professional immediately',
                'Manual review of medical documents recommended',
                'Ensure image quality is adequate for analysis',
                'Try uploading a different format',
                'Contact technical support if issues persist'
            ],
            'analysis_metadata': {
                'error_details': str(e),
                'processing_timestamp': datetime.now().isoformat()
            }
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Medical Image Analysis API is running',
        'version': '1.0.0',
        'features': [
            'image_preprocessing',
            'ocr_text_extraction',
            'medical_entity_recognition',
            'disease_prediction',
            'risk_assessment',
            'medical_recommendations'
        ],
        'supported_formats': ['base64', 'file_path'],
        'supported_image_types': ['jpg', 'jpeg', 'png', 'pdf', 'tiff']
    })


@app.route('/api/supported-conditions', methods=['GET'])
def get_supported_conditions():
    """Get list of medical conditions that can be detected"""
    return jsonify({
        'success': True,
        'supported_conditions': list(analyzer.disease_patterns.keys()),
        'total_count': len(analyzer.disease_patterns),
        'medical_categories': [
            'Cardiovascular', 'Respiratory', 'Metabolic',
            'Renal', 'Hepatic', 'Hematologic', 'Endocrine'
        ]
    })


if __name__ == '__main__':
    print("Starting Medical Image Analysis API Server...")
    print("Make sure Tesseract OCR is installed on your system:")
    print("- Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki")
    print("- Ubuntu/Debian: sudo apt install tesseract-ocr")
    print("- macOS: brew install tesseract")

    app.run(debug=True, host='0.0.0.0', port=5001)