# Mia Wellness Companion - Backend

This backend provides API endpoints for the Mia Wellness Companion application, including machine learning-based depression prediction capabilities.

## Features

- **LiveKit Integration**: Real-time voice/video communication
- **Depression Prediction**: ML-based mental health assessment using logistic regression
- **REST API**: JSON-based endpoints for frontend integration

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env.local` file with your LiveKit credentials:

```env
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret  
LIVEKIT_URL=wss://your-livekit-url
```

### 3. Verify ML Model

Test the machine learning service:

```bash
python test_ml.py
```

### 4. Run the Server

```bash
python api_server.py
```

The server will start on `http://localhost:5001`

## API Endpoints

### LiveKit Connection

- **GET** `/api/connection-details` - Get LiveKit connection details and access token

### Machine Learning

- **GET** `/api/ml/model-info` - Get information about the depression prediction model
- **GET** `/api/ml/features` - Get feature requirements and descriptions
- **POST** `/api/ml/predict` - Predict depression risk based on user data

## Depression Prediction Model

### Model Details

- **Type**: Logistic Regression
- **Performance**: AUROC ~0.919 
- **Dataset**: Student Depression Dataset
- **Features**: 10 features (5 categorical, 5 numerical)

### Input Features

#### Numerical Features (scale as specified):
- `Age`: Age in years (18-65)
- `Academic Pressure`: Scale 1-5 (1=Very Low, 5=Very High)
- `Work Pressure`: Scale 0-5 (0=None/Student, 1-5=Work pressure level)
- `Work/Study Hours`: Hours per day (0-24)
- `Financial Stress`: Scale 1-5 (1=Very Low, 5=Very High)

#### Categorical Features:
- `Gender`: "Male" or "Female"
- `Sleep Duration`: "Less than 5 hours", "5-6 hours", "7-8 hours", "More than 8 hours"
- `Dietary Habits`: "Healthy", "Moderate", "Unhealthy"
- `Have you ever had suicidal thoughts ?`: "Yes" or "No"
- `Family History of Mental Illness`: "Yes" or "No"

### Example API Usage

#### Get Feature Info
```bash
curl http://localhost:5001/api/ml/features
```

#### Make Prediction
```bash
curl -X POST http://localhost:5001/api/ml/predict \
  -H "Content-Type: application/json" \
  -d '{
    "Gender": "Female",
    "Age": 24.0,
    "Academic Pressure": 2.0,
    "Work Pressure": 0.0,
    "Work/Study Hours": 3.0,
    "Financial Stress": 2.0,
    "Sleep Duration": "5-6 hours",
    "Dietary Habits": "Moderate",
    "Have you ever had suicidal thoughts ?": "No",
    "Family History of Mental Illness": "Yes"
  }'
```

#### Example Response
```json
{
  "prediction": 0,
  "prediction_label": "No Depression",
  "probability": 0.234,
  "probability_percentage": 23.4,
  "risk_level": "Low",
  "risk_description": "Low risk indicators. Continue maintaining healthy habits.",
  "confidence": "High"
}
```

### Risk Levels

- **Low** (< 40%): Low risk indicators
- **Medium** (40-70%): Moderate risk indicators present  
- **High** (≥ 70%): High risk of depression detected

## File Structure

```
backend/
├── api_server.py          # Flask API server
├── ml_service.py          # Depression prediction service
├── test_ml.py            # ML service testing script
├── agent.py              # Voice agent integration
├── requirements.txt      # Python dependencies
├── logistic_regression_depression.joblib  # Trained ML model
└── README.md             # This file
```

## Development

### Testing the ML Service

```bash
# Test ML service independently
python test_ml.py

# Test API endpoints
python api_server.py
# Then use curl or Postman to test endpoints
```

### Model Updates

To update the depression prediction model:

1. Train a new model using the same feature structure
2. Save as `logistic_regression_depression.joblib`
3. Update `ml_service.py` if feature names or structure change
4. Test with `python test_ml.py`

## Important Notes

⚠️ **Medical Disclaimer**: This depression prediction model is for educational and screening purposes only. It should not replace professional medical diagnosis or treatment. Users showing high-risk indicators should be encouraged to seek professional mental health support.

🔒 **Privacy**: Ensure user data is handled securely and in compliance with privacy regulations (HIPAA, GDPR, etc.).