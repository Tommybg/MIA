#!/usr/bin/env python3
"""
ML Service for Depression Prediction using Logistic Regression
This service handles loading the trained model and making predictions.

Based on the trained model from the Jupyter notebook:
- Student Depression Dataset 
- Features: Gender, Age, Academic Pressure, Work Pressure, Work/Study Hours, 
  Financial Stress, Sleep Duration, Dietary Habits, Have you ever had suicidal thoughts ?, 
  Family History of Mental Illness
- Target: Depression (0 = No Depression, 1 = Depression)
- Model: Logistic Regression with C=0.1, solver=liblinear
- Performance: AUROC ~0.919
"""

import pandas as pd
import numpy as np
from joblib import load
import os
from typing import Dict, Union, Tuple, Optional
import warnings
warnings.filterwarnings('ignore')

class DepressionPredictor:
    """Class to handle depression prediction using the trained logistic regression model."""
    
    def __init__(self, model_path: str = "logistic_regression_depression.joblib"):
        """
        Initialize the predictor with the trained model.
        
        Args:
            model_path: Path to the trained model file
        """
        # Use absolute path relative to this file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        self.model_path = os.path.join(current_dir, model_path)
        self.model = None
        
        # Feature names as they appear in the training data
        self.feature_names = [
            'Gender', 'Age', 'Academic Pressure', 'Work Pressure', 
            'Work/Study Hours', 'Financial Stress', 'Sleep Duration', 
            'Dietary Habits', 'Have you ever had suicidal thoughts ?', 
            'Family History of Mental Illness'
        ]
        
        # Define the expected feature types based on the notebook
        self.categorical_features = [
            'Gender', 'Sleep Duration', 'Dietary Habits', 
            'Have you ever had suicidal thoughts ?', 'Family History of Mental Illness'
        ]
        
        self.numerical_features = [
            'Age', 'Academic Pressure', 'Work Pressure', 
            'Work/Study Hours', 'Financial Stress'
        ]
        
        # Valid values for categorical features (from the training data)
        self.valid_values = {
            'Gender': ['Male', 'Female'],
            'Sleep Duration': ['Less than 5 hours', '5-6 hours', '7-8 hours', 'More than 8 hours'],
            'Dietary Habits': ['Healthy', 'Moderate', 'Unhealthy'],
            'Have you ever had suicidal thoughts ?': ['Yes', 'No'],
            'Family History of Mental Illness': ['Yes', 'No']
        }
        
        # Load the model
        self._load_model()
    
    def _load_model(self):
        """Load the trained model from file."""
        try:
            if not os.path.exists(self.model_path):
                raise FileNotFoundError(f"Model file not found at {self.model_path}")
            
            self.model = load(self.model_path)
            print(f"✅ Depression prediction model loaded successfully")
            
            # Print model information if available
            if hasattr(self.model, 'named_steps'):
                clf = self.model.named_steps.get('clf')
                if clf:
                    print(f"📊 Model type: {type(clf).__name__}")
                    if hasattr(clf, 'C'):
                        print(f"🔧 Regularization parameter C: {clf.C}")
            
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            self.model = None
            raise
    
    def validate_input(self, data: Dict) -> Dict:
        """
        Validate and prepare input data.
        
        Args:
            data: Dictionary with feature values
            
        Returns:
            Validated data dictionary
        """
        if self.model is None:
            raise RuntimeError("Model not loaded")
        
        validated_data = {}
        
        # Check for required features
        missing_features = [feature for feature in self.feature_names if feature not in data]
        if missing_features:
            raise ValueError(f"Missing required features: {missing_features}")
        
        # Validate categorical features
        for feature in self.categorical_features:
            value = data[feature]
            if feature in self.valid_values and value not in self.valid_values[feature]:
                raise ValueError(f"Invalid value for {feature}: '{value}'. Valid values: {self.valid_values[feature]}")
            validated_data[feature] = value
        
        # Validate numerical features
        for feature in self.numerical_features:
            try:
                validated_data[feature] = float(data[feature])
            except (ValueError, TypeError):
                raise ValueError(f"Invalid numerical value for {feature}: {data[feature]}")
        
        return validated_data
    
    def predict(self, data: Dict) -> Dict:
        """
        Make a prediction for a single instance.
        
        Args:
            data: Dictionary with feature values
            
        Returns:
            Dictionary with prediction results
        """
        if self.model is None:
            raise RuntimeError("Model not loaded. Cannot make predictions.")
        
        # Validate input
        validated_data = self.validate_input(data)
        
        # Create DataFrame with the correct column order
        df = pd.DataFrame([validated_data])
        df = df[self.feature_names]  # Ensure correct order
        
        # Get prediction and probability
        prediction = self.model.predict(df)[0]
        probability = self.model.predict_proba(df)[0, 1]  # Probability of depression (class 1)
        
        # Create risk assessment
        if probability >= 0.7:
            risk_level = "High"
            risk_description = "High risk of depression detected. Please consider seeking professional help."
        elif probability >= 0.4:
            risk_level = "Medium" 
            risk_description = "Moderate risk indicators present. Monitor your mental health closely."
        else:
            risk_level = "Low"
            risk_description = "Low risk indicators. Continue maintaining healthy habits."
        
        return {
            'prediction': int(prediction),
            'prediction_label': 'Depression' if prediction == 1 else 'No Depression',
            'probability': float(probability),
            'probability_percentage': float(probability * 100),
            'risk_level': risk_level,
            'risk_description': risk_description,
            'confidence': 'High' if max(probability, 1-probability) > 0.7 else 'Medium'
        }
    
    def predict_batch(self, data_list: list) -> list:
        """
        Make predictions for multiple instances.
        
        Args:
            data_list: List of dictionaries with feature values
            
        Returns:
            List of prediction result dictionaries
        """
        return [self.predict(data) for data in data_list]
    
    def get_feature_info(self) -> Dict:
        """Get information about the features expected by the model."""
        return {
            'features': self.feature_names,
            'categorical_features': {
                feature: self.valid_values[feature] 
                for feature in self.categorical_features
            },
            'numerical_features': {
                'Age': {
                    'description': 'Age in years',
                    'typical_range': '18-65',
                    'type': 'integer'
                },
                'Academic Pressure': {
                    'description': 'Academic pressure level',
                    'scale': '1-5 (1=Very Low, 2=Low, 3=Moderate, 4=High, 5=Very High)',
                    'type': 'float'
                },
                'Work Pressure': {
                    'description': 'Work pressure level (0 for students/unemployed)',
                    'scale': '0-5 (0=None/Student, 1-5=Work pressure level)',
                    'type': 'float'
                },
                'Work/Study Hours': {
                    'description': 'Hours spent working or studying per day',
                    'range': '0-24 hours',
                    'type': 'float'
                },
                'Financial Stress': {
                    'description': 'Financial stress level',
                    'scale': '1-5 (1=Very Low, 2=Low, 3=Moderate, 4=High, 5=Very High)',
                    'type': 'float'
                }
            }
        }
    
    def get_model_info(self) -> Dict:
        """Get information about the model."""
        return {
            'model_type': 'Logistic Regression',
            'performance_auroc': 0.919,
            'training_dataset': 'Student Depression Dataset',
            'target_classes': {
                0: 'No Depression',
                1: 'Depression'
            },
            'feature_count': len(self.feature_names),
            'categorical_feature_count': len(self.categorical_features),
            'numerical_feature_count': len(self.numerical_features)
        }

# Global instance
_predictor_instance: Optional[DepressionPredictor] = None

def get_predictor() -> DepressionPredictor:
    """Get or create the global predictor instance."""
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = DepressionPredictor()
    return _predictor_instance

def predict_depression(user_data: Dict) -> Dict:
    """
    Main function to predict depression risk.
    
    Args:
        user_data: Dictionary with user features
        
    Returns:
        Dictionary with prediction results
    """
    predictor = get_predictor()
    return predictor.predict(user_data)

def get_feature_requirements() -> Dict:
    """Get the feature requirements for the model."""
    predictor = get_predictor()
    return predictor.get_feature_info()

def get_model_information() -> Dict:
    """Get information about the model."""
    predictor = get_predictor()
    return predictor.get_model_info()

# Test function
def test_prediction():
    """Test the prediction with sample data."""
    print("🧠 Testing Depression Prediction Model")
    print("=" * 50)
    
    # Sample data based on the training dataset
    sample_data = {
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
    
    print("\n📋 Sample Input:")
    for key, value in sample_data.items():
        print(f"  {key}: {value}")
    
    try:
        result = predict_depression(sample_data)
        
        print(f"\n📊 Prediction Results:")
        print(f"  Prediction: {result['prediction_label']} (class {result['prediction']})")
        print(f"  Probability: {result['probability']:.3f} ({result['probability_percentage']:.1f}%)")
        print(f"  Risk Level: {result['risk_level']}")
        print(f"  Confidence: {result['confidence']}")
        print(f"  Description: {result['risk_description']}")
        
        return result
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    test_prediction()