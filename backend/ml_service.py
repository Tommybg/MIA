import os
from typing import Dict
import warnings

import pandas as pd
from joblib import load


warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")

# Ruta absoluta al modelo en este directorio
_MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "xgb_student_depression.joblib")

# Features  que espera el pipeline entrenado
FEATURE_NAMES = [
	'Gender', 'Age', 'Academic Pressure', 'Work Pressure',
	'Work/Study Hours', 'Financial Stress', 'Sleep Duration',
	'Dietary Habits', 'Have you ever had suicidal thoughts ?',
	'Family History of Mental Illness'
]

CATEGORICAL = [
	'Gender', 'Sleep Duration', 'Dietary Habits',
	'Have you ever had suicidal thoughts ?', 'Family History of Mental Illness'
]

NUMERICAL = [
	'Age', 'Academic Pressure', 'Work Pressure', 'Work/Study Hours', 'Financial Stress'
]

VALID_VALUES = {
	'Gender': ['Male', 'Female'],
	'Sleep Duration': ['Less than 5 hours', '5-6 hours', '7-8 hours', 'More than 8 hours'],
	'Dietary Habits': ['Healthy', 'Moderate', 'Unhealthy'],
	'Have you ever had suicidal thoughts ?': ['Yes', 'No'],
	'Family History of Mental Illness': ['Yes', 'No']
}

# Cargar el modelo una vez
if not os.path.exists(_MODEL_PATH):
	raise FileNotFoundError(f"Model file not found at {_MODEL_PATH}")

try:
	
	with warnings.catch_warnings():
		warnings.simplefilter("ignore")
		_MODEL = load(_MODEL_PATH)
	print(f"✅ Model loaded successfully from {_MODEL_PATH}")
except Exception as e:
	print(f"❌ Error loading model: {e}")
	raise RuntimeError(f"Failed to load ML model: {e}")

# Valida el input (hecho por el usuario)
def _validate_input(data: Dict) -> Dict:
	"""Minimal validation: required fields + categorical values + cast numerics."""
	missing = [f for f in FEATURE_NAMES if f not in data]
	if missing:
		raise ValueError(f"Missing required features: {missing}")

	validated: Dict = {}
	for f in CATEGORICAL:
		v = data[f]
		allowed = VALID_VALUES.get(f)
		if allowed is not None and v not in allowed:
			raise ValueError(f"Invalid value for {f}: '{v}'. Valid values: {allowed}")
		validated[f] = v

	for f in NUMERICAL:
		try:
			validated[f] = float(data[f])
		except Exception:
			raise ValueError(f"Invalid numerical value for {f}: {data[f]}")

	return validated

# Función para predecir la depre
def predict_depression(user_data: Dict) -> Dict:
	"""Return prediction, probability and simple risk assessment."""
	try:
		validated = _validate_input(user_data)
		df = pd.DataFrame([validated])[FEATURE_NAMES]

		# Suppress sklearn warnings during prediction
		with warnings.catch_warnings():
			warnings.simplefilter("ignore")
			pred = _MODEL.predict(df)[0]
			proba = float(_MODEL.predict_proba(df)[0, 1])

		if proba >= 0.7:
			risk_level = "Alto"
			risk_description = "Riesgo Alto detectado. Por favor considere acudir a ayuda profesional de inmediato."
		elif proba >= 0.4:
			risk_level = "Medio"
			risk_description = "Riesgo Moderado detectado. Te recomendamos conversar con MIA para obtener apoyo."
		else:
			risk_level = "Bajo"
			risk_description = "Riesgo Bajo detectado. Continúa con tus hábitos saludables, MIA esta aqui para escucharte cuando lo desees."

		return {
			'prediction': int(pred),
			'prediction_label': 'Depression' if pred == 1 else 'No Depression',
			'probability': proba,
			'probability_percentage': proba * 100.0,
			'risk_level': risk_level,
			'risk_description': risk_description,
			'confidence': 'High' if max(proba, 1 - proba) > 0.7 else 'Medium',
		}
	except Exception as e:
		print(f"❌ Error during prediction: {e}")
		raise RuntimeError(f"Prediction failed: {str(e)}")


def get_feature_requirements() -> Dict:
	
	return {
		'features': FEATURE_NAMES,
		'categorical_features': VALID_VALUES,
		'numerical_features': {k: 'float' for k in NUMERICAL},
	}


def get_model_information() -> Dict:
	
	return {
		'model_type': 'XGBoost Classifier',
		'target_classes': {0: 'No Depression', 1: 'Depression'},
		'feature_count': len(FEATURE_NAMES),
	}

# Lo llama el test que creamos para ver si carga y funciona el modelo. 
def test_prediction():
	sample = {
		'Gender': 'Female',
		'Age': 24.0,
		'Academic Pressure': 2.0,
		'Work Pressure': 0.0,
		'Work/Study Hours': 3.0,
		'Financial Stress': 2.0,
		'Sleep Duration': '5-6 hours',
		'Dietary Habits': 'Moderate',
		'Have you ever had suicidal thoughts ?': 'No',
		'Family History of Mental Illness': 'Yes'
	}
	return predict_depression(sample)


if __name__ == "__main__":
	print(test_prediction())