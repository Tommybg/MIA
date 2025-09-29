from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import random
from dotenv import load_dotenv
from livekit import api

# Importación del servicio de ML
try:
    from .ml_service import (
        get_feature_requirements,
        get_model_information,
        predict_depression,
    )
except ImportError:
    # Para ejecución directa
    from ml_service import (
        get_feature_requirements,
        get_model_information,
        predict_depression,
    )

# Cargar variables de entorno
load_dotenv(dotenv_path=".env.local")

app = Flask(__name__)
CORS(app)  # Habilitar CORS para el frontend de Vite

@app.route('/api/connection-details', methods=['GET'])
def get_connection_details():
    try:
        # Get environment variables
        API_KEY = os.getenv('LIVEKIT_API_KEY')
        API_SECRET = os.getenv('LIVEKIT_API_SECRET')
        LIVEKIT_URL = os.getenv('LIVEKIT_URL')
        
        if not all([API_KEY, API_SECRET, LIVEKIT_URL]):
            return jsonify({'error': 'Missing LiveKit environment variables'}), 500
        
        # Generate random identifiers
        participant_identity = f"mia_user_{random.randint(1000, 9999)}"
        room_name = f"mia_room_{random.randint(1000, 9999)}"
        
        # Create access token
        token = api.AccessToken(API_KEY, API_SECRET) \
            .with_identity(participant_identity) \
            .with_name(participant_identity) \
            .with_grants(api.VideoGrants(
                room_join=True,
                room=room_name,
                can_publish=True,
                can_subscribe=True,
                can_publish_data=True
            )) \
            .to_jwt()
        
        return jsonify({
            'serverUrl': LIVEKIT_URL,
            'roomName': room_name,
            'participantName': participant_identity,
            'participantToken': token
        }), 200
        
    except Exception as e:
        print(f"Error generating connection details: {e}")
        return jsonify({'error': 'Failed to generate connection details'}), 500

# --- Endpoints ML ---

@app.route('/api/ml/features', methods=['GET'])
def ml_features():
    try:
        return jsonify(get_feature_requirements()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ml/model-info', methods=['GET'])
def ml_model_info():
    try:
        return jsonify(get_model_information()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ml/predict', methods=['POST'])
def ml_predict():
    try:
        data = request.get_json(force=True)
        result = predict_depression(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001, host='0.0.0.0')
