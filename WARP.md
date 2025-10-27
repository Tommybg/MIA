# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

MIA (Mental Intelligence Assistant) is a mental wellness platform for university students that combines:
- **AI-powered voice assistant** (LiveKit + OpenAI) for empathetic psychological support conversations
- **ML-based depression screening** (XGBoost classifier) using a 10-question questionnaire
- **React/TypeScript frontend** with Vite, shadcn-ui, and Tailwind CSS
- **Flask REST API backend** serving ML predictions and LiveKit integration

## Architecture

The system has three main layers:

1. **Frontend** (`frontend/`): React SPA with voice chat UI and mental health evaluation questionnaire
2. **Backend API** (`backend/api_server.py`): Flask server exposing ML prediction endpoints and LiveKit connection details
3. **ML Service** (`backend/ml_service.py`): Depression prediction using trained XGBoost model
4. **Voice Agent** (`backend/agent.py`): LiveKit agent with OpenAI integration for empathetic voice conversations

**Data Flow**: Frontend questionnaire (Spanish) → API endpoint → ML Service validates/transforms to English feature names → XGBoost model prediction → Risk classification → Frontend displays results with recommendations

## Development Commands

### Backend Setup & Development

```bash
cd backend

# Create virtual environment (first time only)
python3 -m venv mia_env
source mia_env/bin/activate  # On Windows: mia_env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Test ML service independently
python test_ml.py

# Run Flask API server (port 5001)
python api_server.py

# Run LiveKit voice agent
python agent.py start
```

### Frontend Setup & Development

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start development server (typically port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Configuration

**Backend** (`.env.local` in `backend/`):
```env
LIVEKIT_API_KEY=your_key
LIVEKIT_API_SECRET=your_secret
LIVEKIT_URL=wss://your-livekit-url
OPENAI_API_KEY=your_openai_key
```

**Frontend** (`.env` or `.env.local` in `frontend/`):
```env
VITE_BACKEND_URL=http://localhost:5001
```

## Key Technical Details

### ML Model Specifications

**Model**: XGBoost Classifier (`xgb_student_depression.joblib`)
**Performance**: AUROC ~0.919
**Input**: 10 features (5 categorical, 5 numerical)
**Output**: Binary classification (0=No Depression, 1=Depression) + probability score

**Feature Names** (exact spelling matters):
- Categorical: `Gender`, `Sleep Duration`, `Dietary Habits`, `Have you ever had suicidal thoughts ?`, `Family History of Mental Illness`
- Numerical: `Age`, `Academic Pressure`, `Work Pressure`, `Work/Study Hours`, `Financial Stress`

**Valid Categorical Values**:
- Gender: "Male" | "Female"
- Sleep Duration: "Less than 5 hours" | "5-6 hours" | "7-8 hours" | "More than 8 hours"
- Dietary Habits: "Healthy" | "Moderate" | "Unhealthy"
- Suicidal thoughts / Family History: "Yes" | "No"

**Risk Classification**:
- Low: probability < 40%
- Medium: 40% ≤ probability < 70%
- High: probability ≥ 70%

### Data Transformation (Spanish → English)

The frontend collects questionnaire responses in Spanish, which are transformed to English feature names expected by the ML model. This mapping happens in `Evaluation.tsx` in the `formatDataForMLModel` function:

- Question 1 → "Have you ever had suicidal thoughts ?" (Si/No → Yes/No)
- Question 2 → "Work/Study Hours" (numeric)
- Question 3 → "Financial Stress" (1-5 scale)
- Question 4 → "Family History of Mental Illness" (Si/No → Yes/No)
- Question 5 → "Academic Pressure" (0-5 scale)
- Question 6 → "Sleep Duration" (mapped to English categories)
- Question 7 → "Dietary Habits" (Saludables/Moderados/Poco saludables → Healthy/Moderate/Unhealthy)
- Question 8 → "Gender" (Masculino/Femenino → Male/Female)
- Question 9 → "Age" (numeric)
- Question 10 → "Work Pressure" (0-5 scale)

### API Endpoints

**ML Endpoints**:
- `GET /api/ml/model-info` - Returns model type and metadata
- `GET /api/ml/features` - Returns required features and valid values for validation
- `POST /api/ml/predict` - Accepts user data JSON, returns prediction with risk assessment

**LiveKit Endpoint**:
- `GET /api/connection-details` - Generates room name, participant identity, and JWT token for voice session

### Voice Agent Persona

The LiveKit agent (`agent.py`) implements "MIA" with specific instructions:
- Empathetic psychological support for university students
- Cognitive-behavioral techniques (CBT basics)
- Strict ethical boundaries: never diagnoses, never prescribes, always derives to professionals for serious cases
- Crisis detection for suicidal ideation, self-harm, substance abuse, psychotic symptoms
- Specialized support for academic stress, anxiety, depression, social issues, university transition
- **Always communicates in Spanish**

## Common Workflows

### Adding a New ML Feature

1. Retrain model with new feature in Jupyter notebook
2. Update `FEATURE_NAMES` and validation in `ml_service.py`
3. Update questionnaire in `Evaluation.tsx`
4. Update `formatDataForMLModel` mapping function
5. Test with `python test_ml.py`

### Modifying the Questionnaire

1. Edit `questions` array in `frontend/src/pages/Evaluation.tsx`
2. Update `formatDataForMLModel` function to map new question IDs to ML feature names
3. Ensure Spanish → English category mappings are correct
4. Test end-to-end: questionnaire → API → prediction → results display

### Debugging ML Predictions

1. Check backend logs when running `api_server.py`
2. Run `python test_ml.py` with sample data
3. Verify feature names match exactly (spaces, capitalization, special characters like "?")
4. Check categorical values are in `VALID_VALUES` dict in `ml_service.py`
5. Use `GET /api/ml/features` endpoint to verify current model requirements

### Testing Voice Agent Locally

1. Ensure `.env.local` has valid LiveKit and OpenAI credentials
2. Start agent: `python agent.py start`
3. Start frontend dev server
4. Navigate to Chat page and click "Habla con MIA"
5. Check agent logs for connection issues or prompt/response debugging

## Project Structure

```
MIA/
├── backend/
│   ├── api_server.py           # Flask REST API
│   ├── ml_service.py           # XGBoost prediction service
│   ├── agent.py                # LiveKit voice agent with MIA persona
│   ├── test_ml.py              # ML service testing
│   ├── requirements.txt        # Python dependencies
│   ├── xgb_student_depression.joblib  # Trained model
│   └── .env.local              # Backend environment vars (gitignored)
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # React Router setup
│   │   ├── pages/
│   │   │   ├── Chat.tsx        # LiveKit voice chat interface
│   │   │   ├── Evaluation.tsx  # ML-powered questionnaire
│   │   │   └── Professionals.tsx  # Resource directory
│   │   └── components/         # Reusable UI components (shadcn-ui)
│   ├── package.json
│   └── vite.config.ts
└── Documentación_Arquitectura_Backend_Frontend.md  # Detailed Spanish architecture docs
```

## Important Notes

- The ML model expects **exact feature names** including spaces and punctuation (e.g., "Have you ever had suicidal thoughts ?")
- All questionnaire text is in **Spanish** but ML features are in **English** - transformation is critical
- The voice agent has **strict ethical guidelines** and must derive serious cases to professionals
- **No user data is stored** - all processing is stateless for privacy
- Frontend uses environment variable `VITE_BACKEND_URL` to configure API base URL (defaults to `http://localhost:5001`)
- Backend PORT defaults to 5001 for local development but can be overridden via environment variable for deployment

## Medical & Ethical Disclaimers

This system is for **educational and initial screening purposes only**. It does NOT:
- Replace professional medical diagnosis
- Prescribe treatments or medications
- Provide crisis intervention services

Users with high-risk indicators MUST be encouraged to seek professional mental health support immediately.
