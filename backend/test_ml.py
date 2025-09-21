#!/usr/bin/env python3
"""
Test script to verify ML service works in the backend environment.
This script tests the depression prediction model without running the full Flask server.
"""

import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(__file__))

def main():
    print("🧪 Testing ML Service in Backend Environment")
    print("=" * 60)
    
    try:
        # Import and test ML service
        from ml_service import test_prediction, get_feature_requirements, get_model_information
        
        print("✅ Successfully imported ML service")
        
        # Test model information
        print("\n📊 Model Information:")
        model_info = get_model_information()
        for key, value in model_info.items():
            print(f"  {key}: {value}")
        
        # Test feature requirements
        print("\n📋 Feature Requirements:")
        features = get_feature_requirements()
        print(f"  Total features: {len(features['features'])}")
        print(f"  Categorical: {len(features['categorical_features'])}")
        print(f"  Numerical: {len(features['numerical_features'])}")
        
        # Run prediction test
        print("\n" + "="*60)
        test_prediction()
        
        print("\n✅ All tests passed! The ML service is ready for production.")
        
    except ImportError as e:
        print(f"❌ Import Error: {e}")
        print("💡 Make sure you're in a Python environment with the required packages:")
        print("   pip install pandas scikit-learn joblib numpy")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("💡 Check that the model file exists and the environment is set up correctly.")

if __name__ == "__main__":
    main()