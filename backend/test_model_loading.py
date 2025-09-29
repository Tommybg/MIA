import os
import warnings
from joblib import load
import sklearn
import xgboost

print(f"scikit-learn version: {sklearn.__version__}")
print(f"XGBoost version: {xgboost.__version__}")

# Try loading both models
models = ["xgb_student_depression.joblib", "logistic_regression_depression.joblib"]

for model_name in models:
    print(f"\n{'='*50}")
    print(f"Testing {model_name}")
    print(f"{'='*50}")
    
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), model_name)
    
    if not os.path.exists(model_path):
        print(f"❌ Model file not found: {model_path}")
        continue
    
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            model = load(model_path)
        print(f"✅ Model loaded successfully!")
        print(f"Model type: {type(model)}")
        
        # Test with sample data
        import pandas as pd
        
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
        
        feature_names = [
            'Gender', 'Age', 'Academic Pressure', 'Work Pressure',
            'Work/Study Hours', 'Financial Stress', 'Sleep Duration',
            'Dietary Habits', 'Have you ever had suicidal thoughts ?',
            'Family History of Mental Illness'
        ]
        
        df = pd.DataFrame([sample_data])[feature_names]
        print(f"Sample data shape: {df.shape}")
        
        # Test prediction
        pred = model.predict(df)
        proba = model.predict_proba(df)
        
        print(f"✅ Prediction works!")
        print(f"Prediction: {pred[0]}")
        print(f"Probability: {proba[0]}")
        
    except Exception as e:
        print(f"❌ Error loading {model_name}: {e}")
        print(f"Error type: {type(e).__name__}")