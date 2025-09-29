# Documentación de Arquitectura: Sistema de Evaluación de Bienestar Mental con IA

## Resumen Ejecutivo

Este sistema implementa una plataforma de evaluación de bienestar mental que utiliza inteligencia artificial para analizar las respuestas de los usuarios y proporcionar predicciones sobre el riesgo de depresión. La arquitectura consta de tres componentes principales:

1. **ml_service.py** - Servicio de Machine Learning
2. **api_server.py** - Servidor API REST
3. **Evaluation.tsx** - Interfaz de usuario frontend

## Arquitectura del Sistema

```
Frontend (React/TypeScript) ←→ API REST (Flask/Python) ←→ ML Service (Scikit-learn)
```

---

## 1. Servicio de Machine Learning (`ml_service.py`)

### Propósito
Este módulo es el núcleo del sistema de inteligencia artificial. Se encarga de:
- Cargar y gestionar el modelo de machine learning preentrenado
- Validar los datos de entrada
- Realizar predicciones de riesgo de depresión
- Proporcionar metadata sobre el modelo

### Características Técnicas

#### 1.1 Modelo de Machine Learning
```python
# Modelo utilizado: Regresión Logística
_MODEL = load("logistic_regression_depression.joblib")
```

**Especificaciones del Modelo:**
- **Tipo:** Regresión Logística (Logistic Regression)
- **Formato:** Archivo .joblib serializado
- **Características de entrada:** 10 variables predictoras
- **Salida:** Probabilidad de depresión (0-1) y clasificación binaria (0/1)

#### 1.2 Variables de Entrada Requeridas

**Variables Categóricas:**
- `Gender`: Male/Female
- `Sleep Duration`: Less than 5 hours, 5-6 hours, 7-8 hours, More than 8 hours
- `Dietary Habits`: Healthy, Moderate, Unhealthy
- `Have you ever had suicidal thoughts?`: Yes/No
- `Family History of Mental Illness`: Yes/No

**Variables Numéricas:**
- `Age`: Edad en años (float)
- `Academic Pressure`: Escala 0-5
- `Work Pressure`: Escala 0-5
- `Work/Study Hours`: Horas por día
- `Financial Stress`: Escala 1-5

#### 1.3 Funciones Principales

**`predict_depression(user_data: Dict)`**
- **Entrada:** Diccionario con las 10 características del usuario
- **Proceso:**
  1. Validación de datos de entrada
  2. Conversión a DataFrame de pandas
  3. Predicción usando el modelo cargado
  4. Cálculo de probabilidades
  5. Clasificación de nivel de riesgo
- **Salida:** Diccionario con predicción completa

```python
{
    'prediction': 0 | 1,                    # Clasificación binaria
    'prediction_label': 'Depression' | 'No Depression',
    'probability': 0.0-1.0,                 # Probabilidad de depresión
    'probability_percentage': 0.0-100.0,
    'risk_level': 'Low' | 'Medium' | 'High',
    'risk_description': 'Descripción textual',
    'confidence': 'High' | 'Medium'
}
```

**Algoritmo de Clasificación de Riesgo:**
- **Alto (≥70%):** Riesgo elevado, requiere atención profesional inmediata
- **Medio (40-69%):** Riesgo moderado, monitoreo recomendado
- **Bajo (<40%):** Riesgo bajo, mantener hábitos saludables

#### 1.4 Validación de Datos

El sistema implementa validación robusta:
```python
def _validate_input(data: Dict) -> Dict:
    # 1. Verificación de campos requeridos
    # 2. Validación de valores categóricos contra lista permitida
    # 3. Conversión y validación de valores numéricos
    # 4. Manejo de errores con mensajes descriptivos
```

---

## 2. Servidor API REST (`api_server.py`)

### Propósito
Actúa como puente entre el frontend y el servicio de ML, proporcionando:
- API REST para comunicación web
- Gestión de CORS para conectividad frontend
- Endpoints para LiveKit (videoconferencia)
- Manejo centralizado de errores

### Arquitectura del API

#### 2.1 Configuración del Servidor
```python
app = Flask(__name__)
CORS(app)  # Habilita comunicación cross-origin con frontend
```

**Configuración:**
- **Puerto:** 5001
- **Host:** 0.0.0.0 (accesible desde cualquier IP)
- **Debug:** Activado en desarrollo

#### 2.2 Endpoints de Machine Learning

**`GET /api/ml/features`**
- **Propósito:** Obtener especificación de características del modelo
- **Respuesta:** Metadata sobre variables requeridas y valores válidos
- **Uso:** Validación en frontend, documentación automática

**`GET /api/ml/model-info`**
- **Propósito:** Información general del modelo
- **Respuesta:** Tipo de modelo, clases objetivo, número de características

**`POST /api/ml/predict`**
- **Propósito:** Realizar predicción de depresión
- **Entrada:** JSON con datos del usuario
- **Proceso:** 
  1. Extracción de datos JSON del request
  2. Llamada al servicio ML
  3. Formateo de respuesta
- **Salida:** Resultado completo de predicción en JSON

```python
@app.route('/api/ml/predict', methods=['POST'])
def ml_predict():
    try:
        data = request.get_json(force=True)    # Extrae JSON
        result = predict_depression(data)       # Llama ML service
        return jsonify(result), 200            # Respuesta JSON
    except Exception as e:
        return jsonify({'error': str(e)}), 400  # Error handling
```

#### 2.3 Endpoint de LiveKit (Videoconferencia)

**`GET /api/connection-details`**
- **Propósito:** Generar tokens de acceso para videoconferencia
- **Funcionalidad:**
  - Generación de identificadores únicos de usuario y sala
  - Creación de tokens JWT firmados
  - Configuración de permisos de sala
- **Variables de entorno requeridas:**
  - `LIVEKIT_API_KEY`
  - `LIVEKIT_API_SECRET`
  - `LIVEKIT_URL`

---

## 3. Frontend - Evaluación (`Evaluation.tsx`)

### Propósito
Interfaz de usuario que proporciona:
- Cuestionario interactivo paso a paso
- Comunicación con el backend
- Presentación de resultados con IA
- Navegación y manejo de estados

### Arquitectura del Frontend

#### 3.1 Estados de la Aplicación
```typescript
type EvaluationStep = "questionnaire" | "analyzing" | "results";

// Estados principales
const [currentStep, setCurrentStep] = useState<EvaluationStep>("questionnaire");
const [currentQuestion, setCurrentQuestion] = useState(0);
const [answers, setAnswers] = useState<Answer[]>([]);
const [depressionResult, setDepressionResult] = useState<DepressionResult | null>(null);
```

#### 3.2 Flujo de Usuario

**Paso 1: Cuestionario**
- Presentación secuencial de 10 preguntas
- Barra de progreso visual
- Validación de respuestas requeridas
- Navegación hacia adelante/atrás

**Paso 2: Análisis**
- Estado de carga con spinner animado
- Comunicación con API backend
- Manejo de errores de red/servidor

**Paso 3: Resultados**
- Presentación visual de la predicción
- Nivel de riesgo con colores codificados
- Recomendaciones personalizadas
- Opciones de acción (profesionales, nueva evaluación)

#### 3.3 Integración con Backend

**Función de Comunicación API:**
```typescript
const analyzeResponses = async (responses: Answer[]): Promise<DepressionResult> => {
    const payload = formatDataForMLModel(responses);
    const API_BASE = import.meta.env?.VITE_BACKEND_URL || "http://localhost:5001";
    const url = `${API_BASE}/api/ml/predict`;
    
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    
    // Manejo de respuesta y errores...
}
```

#### 3.4 Transformación de Datos

**Mapeo de Cuestionario a Modelo ML:**
El sistema realiza transformación automática de datos entre el formato del cuestionario (español) y el formato requerido por el modelo (inglés):

```typescript
const formatDataForMLModel = (responses: Answer[]) => {
    // Mapeos de categorías
    const mapYesNo = (v?: string) => (String(v).toLowerCase() === "si" ? "Yes" : "No");
    const mapGender = (v?: string) => String(v).startsWith("fem") ? "Female" : "Male";
    const mapSleep = (v?: string) => {
        // Transformación de rangos de sueño ES → EN
    };
    
    return {
        "Gender": mapGender(find(8)),
        "Age": Number(find(9)),
        "Academic Pressure": Number(find(5)),
        // ... más mapeos
    };
}
```

---

## 4. Flujo de Datos Completo

### Secuencia de Operaciones

1. **Usuario inicia evaluación**
   - Frontend presenta primera pregunta
   - Estado: `questionnaire`

2. **Usuario responde preguntas**
   - Almacenamiento local de respuestas
   - Actualización de progreso
   - Validación de entrada requerida

3. **Usuario completa cuestionario**
   - Estado cambia a `analyzing`
   - Transformación de datos ES → EN
   - Envío de POST request a `/api/ml/predict`

4. **Backend procesa request**
   - `api_server.py` recibe datos JSON
   - Llamada a `ml_service.predict_depression()`
   - Validación de datos de entrada

5. **ML Service realiza predicción**
   - Carga del modelo preentrenado
   - Conversión a DataFrame de pandas
   - Predicción con scikit-learn
   - Cálculo de probabilidades y riesgo

6. **Respuesta al frontend**
   - JSON con predicción completa
   - Incluye probabilidad, riesgo, recomendaciones

7. **Presentación de resultados**
   - Estado cambia a `results`
   - Visualización del nivel de riesgo
   - Recomendaciones personalizadas
   - Opciones de acción

### Diagrama de Flujo

```
[Usuario] → [Cuestionario] → [Transformación] → [API Request]
                                                      ↓
[Resultados] ← [JSON Response] ← [ML Prediction] ← [Validación]
```

---

## 5. Consideraciones Técnicas

### 5.1 Seguridad y Privacidad
- **CORS habilitado** para comunicación segura frontend-backend
- **Validación rigurosa** de datos de entrada en ML service
- **No almacenamiento** de datos personales en servidor
- **Procesamiento local** de información sensible

### 5.2 Manejo de Errores
- **Validación en múltiples capas** (frontend, API, ML service)
- **Mensajes de error descriptivos** para debugging
- **Fallbacks** para casos de fallo de red o servidor
- **Estados de carga** para feedback al usuario

### 5.3 Escalabilidad
- **Modelo pre-cargado** en memoria para respuesta rápida
- **Stateless API** permite múltiples instancias
- **Separación de responsabilidades** facilita mantenimiento

### 5.4 Configuración de Ambiente
```bash
# Variables de entorno requeridas
VITE_BACKEND_URL=http://localhost:5001  # Frontend
LIVEKIT_API_KEY=your_key               # Backend
LIVEKIT_API_SECRET=your_secret         # Backend
LIVEKIT_URL=your_url                   # Backend
```

---

## 6. Resultados y Métricas

### 6.1 Interpretación de Resultados
- **Predicción binaria:** 0 (No Depresión) | 1 (Depresión)
- **Probabilidad:** Valor continuo 0.0-1.0
- **Nivel de riesgo:** Categorización en Low/Medium/High
- **Confianza:** Indicador de certeza del modelo

### 6.2 Recomendaciones Automáticas
El sistema genera recomendaciones específicas basadas en el resultado:

**Para casos de alta probabilidad:**
- Búsqueda inmediata de ayuda profesional
- Contacto con servicios de crisis
- Referencias específicas de tratamiento

**Para casos de baja probabilidad:**
- Mantenimiento de hábitos saludables
- Monitoreo preventivo
- Recursos de bienestar general

---

## 7. Consideraciones Éticas y Legales

### 7.1 Limitaciones del Sistema
- **No constituye diagnóstico médico profesional**
- **Herramienta de apoyo y screening inicial**
- **Requiere supervisión de profesionales de salud mental**

### 7.2 Transparencia
- **Modelo explicable** (Regresión Logística)
- **Características claras y comprensibles**
- **Probabilidades numéricas transparentes**

### 7.3 Responsabilidad
- **Disclaimers claros** sobre limitaciones
- **Derivación a profesionales** en casos de alto riesgo
- **Información de contacto de emergencia**

---

## Conclusión

Este sistema representa una implementación robusta de inteligencia artificial aplicada al bienestar mental, combinando:

- **Tecnología avanzada** pero accesible
- **Interfaz intuitiva** para usuarios finales
- **Arquitectura escalable** para crecimiento futuro
- **Consideraciones éticas** en el diseño

La separación clara de responsabilidades entre ML service, API, y frontend permite mantenimiento eficiente y evolución continua del sistema.