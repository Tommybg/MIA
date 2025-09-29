import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, ArrowRight, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  text: string;
  options: { value: string | number; label: string }[];
}

interface Answer {
  questionId: number;
  value: string | number;
}

const questions: Question[] = [
  {
    id: 1,
    text: "¿Alguna vez has tenido pensamientos suicidas?",
    options: [
      { value: "Si", label: "Sí" },
      { value: "No", label: "No" }
    ]
  },
  {
    id: 2,
    text: "¿Cuántas horas al día trabajas o estudias?",
    options: [
      { value: 0, label: "0 horas" },
      { value: 1, label: "1 hora" },
      { value: 2, label: "2 horas" },
      { value: 3, label: "3 horas" },
      { value: 4, label: "4 horas" },
      { value: 5, label: "5 horas" },
      { value: 6, label: "6 horas" },
      { value: 7, label: "7 horas" },
      { value: 8, label: "8 horas" },
      { value: 9, label: "9 horas" },
      { value: 10, label: "10 horas" },
      { value: 11, label: "11 horas" },
      { value: 12, label: "12 horas" }
    ]
  },
  {
    id: 3,
    text: "¿Qué nivel de estrés financiero experimentas?",
    options: [
      { value: 1, label: "1 = Muy bajo" },
      { value: 2, label: "2 = Bajo" },
      { value: 3, label: "3 = Moderado" },
      { value: 4, label: "4 = Alto" },
      { value: 5, label: "5 = Muy alto" }
    ]
  },
  {
    id: 4,
    text: "¿Existe un historial familiar de enfermedad mental?",
    options: [
      { value: "Si", label: "Sí" },
      { value: "No", label: "No" }
    ]
  },
  {
    id: 5,
    text: "¿Qué nivel de presión académica sientes actualmente?",
    options: [
      { value: 0, label: "0 = Ninguna" },
      { value: 1, label: "1 = Muy baja" },
      { value: 2, label: "2 = Baja" },
      { value: 3, label: "3 = Moderada" },
      { value: 4, label: "4 = Alta" },
      { value: 5, label: "5 = Muy alta" }
    ]
  },
  {
    id: 6,
    text: "¿Cuál es tu duración promedio de sueño?",
    options: [
      { value: "Menos de 5 horas", label: "Menos de 5 horas" },
      { value: "5–6 horas", label: "5–6 horas" },
      { value: "7–8 horas", label: "7–8 horas" },
      { value: "Más de 8 horas", label: "Más de 8 horas" },
      { value: "Otros", label: "Otros" }
    ]
  },
  {
    id: 7,
    text: "¿Cómo describirías tus hábitos alimenticios?",
    options: [
      { value: "Saludables", label: "Saludables" },
      { value: "Moderados", label: "Moderados" },
      { value: "Poco saludables", label: "Poco saludables" },
      { value: "Otros", label: "Otros" }
    ]
  },
  {
    id: 8,
    text: "¿Cuál es tu género?",
    options: [
      { value: "Masculino", label: "Masculino" },
      { value: "Femenino", label: "Femenino" }
    ]
  },
  {
    id: 9,
    text: "¿Cuál es tu edad?",
    options: [
      { value: 18, label: "18 años" },
      { value: 19, label: "19 años" },
      { value: 20, label: "20 años" },
      { value: 21, label: "21 años" },
      { value: 22, label: "22 años" },
      { value: 23, label: "23 años" },
      { value: 24, label: "24 años" },
      { value: 25, label: "25 años" },
      { value: 26, label: "26 años" },
      { value: 27, label: "27 años" },
      { value: 28, label: "28 años" },
      { value: 29, label: "29 años" },
      { value: 30, label: "30 años" },
      { value: 31, label: "31 años" },
      { value: 32, label: "32 años" },
      { value: 33, label: "33 años" },
      { value: 34, label: "34 años" },
      { value: 35, label: "35 años" },
      { value: 36, label: "36 años" },
      { value: 37, label: "37 años" },
      { value: 38, label: "38 años" },
      { value: 39, label: "39 años" },
      { value: 41, label: "41 años" },
      { value: 42, label: "42 años" },
      { value: 43, label: "43 años" },
      { value: 44, label: "44 años" },
      { value: 46, label: "46 años" },
      { value: 48, label: "48 años" },
      { value: 49, label: "49 años" },
      { value: 51, label: "51 años" },
      { value: 54, label: "54 años" },
      { value: 56, label: "56 años" },
      { value: 58, label: "58 años" },
      { value: 59, label: "59 años" }
    ]
  },
  {
    id: 10,
    text: "¿Qué nivel de presión laboral experimentas?",
    options: [
      { value: 0, label: "0 = Ninguna" },
      { value: 2, label: "2 = Moderada" },
      { value: 5, label: "5 = Alta" }
    ]
  }
];


type EvaluationStep = "questionnaire" | "analyzing" | "results";

interface DepressionResult {
  hasDepression: boolean;
  prediction: number; // 0 = no depression, 1 = depression
  confidence?: number; // optional confidence score from ML model
  label: string;
  color: string;
  description: string;
  recommendations: string[];
}

export const Evaluation = () => {
  const [currentStep, setCurrentStep] = useState<EvaluationStep>("questionnaire");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [depressionResult, setDepressionResult] = useState<DepressionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (value: string) => {
    setCurrentAnswer(value);
  };

  const handleNext = async () => {
    if (!currentAnswer) return;

    const newAnswer: Answer = {
      questionId: questions[currentQuestion].id,
      value: currentAnswer
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setCurrentAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Start analysis
      setCurrentStep("analyzing");
      setErrorMessage("");

      try {
        const result = await analyzeResponses(updatedAnswers);
        setDepressionResult(result);
        setCurrentStep("results");
      } catch (err: any) {
        setErrorMessage(err?.message || "Ocurrió un error al predecir. Intenta nuevamente.");
        setCurrentStep("questionnaire");
      }
    }
  };

  const analyzeResponses = async (responses: Answer[]): Promise<DepressionResult> => {
    const payload = formatDataForMLModel(responses);
    const API_BASE = (import.meta as any).env?.VITE_BACKEND_URL || "http://localhost:5001";
    const url = `${API_BASE}/api/ml/predict`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errPayload = await res.json().catch(() => ({}));
      throw new Error(errPayload?.error || `Error HTTP ${res.status}`);
    }

    const data = await res.json();
    const hasDepression = Number(data?.prediction) === 1;
    const probability: number = typeof data?.probability === "number" ? data.probability : (hasDepression ? 0.75 : 0.25);
    const riskLevel: string = String(data?.risk_level || (hasDepression ? "High" : "Low"));
    const riskDescription: string = String(data?.risk_description || (hasDepression
      ? "Nuestro modelo detecta riesgo alto de depresión. Busca apoyo profesional."
      : "Bajo riesgo detectado. Mantén hábitos saludables."));

    const color = riskLevel === "High" ? "text-destructive" : (riskLevel === "Medium" ? "text-foreground" : "text-success");
    const label = hasDepression ? "Depresión Detectada" : "No se detecta Depresión";

    return {
      hasDepression,
      prediction: hasDepression ? 1 : 0,
      confidence: probability,
      label,
      color,
      description: riskDescription,
      recommendations: hasDepression
        ? [
            "Busca ayuda de un profesional de salud mental de inmediato",
            "Contacta el centro de bienestar estudiantil de tu institución",
            "Considera hablar con un psicólogo o psiquiatra",
            "Mantente en contacto cercano con tu red de apoyo",
            "Si tienes pensamientos suicidas, contacta una línea de crisis inmediatamente",
            "No ignores estos síntomas, la depresión es tratable con ayuda profesional"
          ]
        : [
            "Mantén rutinas saludables de sueño y ejercicio",
            "Continúa conectando con amigos y familia",
            "Practica técnicas de mindfulness y manejo del estrés",
            "Mantente atento a cambios en tu estado de ánimo",
            "Considera recursos preventivos de bienestar estudiantil",
            "Si notas cambios en tu bienestar, no dudes en buscar ayuda"
          ]
    };
  };

  const formatDataForMLModel = (responses: Answer[]) => {
    // Map questionnaire responses (ES) to ML model expected schema (EN)
    const find = (id: number) => responses.find(r => r.questionId === id)?.value as string | number | undefined;

    // Helpers for categorical mappings
    const mapYesNo = (v?: string | number) => (String(v).toLowerCase() === "si" ? "Yes" : "No");
    const mapGender = (v?: string | number) => {
      const s = String(v).toLowerCase();
      if (s.startsWith("fem")) return "Female";
      return "Male";
    };
    const mapSleep = (v?: string | number) => {
      const s = String(v).toLowerCase();
      if (s.includes("menos") || s.includes("<") || s.includes("<5")) return "Less than 5 hours";
      if (s.includes("5") && s.includes("6")) return "5-6 hours";
      if (s.includes("7") && s.includes("8")) return "7-8 hours";
      if (s.includes("más") || s.includes("mas") || s.includes("more")) return "More than 8 hours";
      return "7-8 hours"; // default bucket
    };
    const mapDiet = (v?: string | number) => {
      const s = String(v).toLowerCase();
      if (s.startsWith("salud")) return "Healthy";
      if (s.startsWith("moder")) return "Moderate";
      if (s.includes("poco") || s.includes("no salud")) return "Unhealthy";
      return "Moderate";
    };

    const age = Number(find(9));
    const academic = Number(find(5));
    const workPressure = Number(find(10));
    const hours = Number(find(2));
    const financial = Number(find(3));

    return {
      "Gender": mapGender(find(8)),
      "Age": isNaN(age) ? 21 : age,
      "Academic Pressure": isNaN(academic) ? 3 : academic,
      "Work Pressure": isNaN(workPressure) ? 0 : workPressure,
      "Work/Study Hours": isNaN(hours) ? 4 : hours,
      "Financial Stress": isNaN(financial) ? 3 : financial,
      "Sleep Duration": mapSleep(find(6)),
      "Dietary Habits": mapDiet(find(7)),
      "Have you ever had suicidal thoughts ?": mapYesNo(find(1)),
      "Family History of Mental Illness": mapYesNo(find(4))
    } as Record<string, string | number>;
  };

  const handleRestart = () => {
    setCurrentStep("questionnaire");
    setCurrentQuestion(0);
    setAnswers([]);
    setCurrentAnswer("");
    setDepressionResult(null);
  };

  const handleGoToProfessionals = () => {
    navigate("/professionals");
  };

  if (currentStep === "analyzing") {
    return (
      <div className="max-w-2xl mx-auto p-4 min-h-[calc(100vh-200px)] flex items-center justify-center">
        <Card className="card-wellness text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Analizando tus respuestas...</h2>
              <p className="text-muted-foreground">
                Nuestro modelo de inteligencia artificial está procesando tu evaluación para brindarte un análisis personalizado.
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 max-w-md">
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (currentStep === "results" && depressionResult) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="card-wellness mb-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Resultados de tu Evaluación</h1>
            <p className="text-muted-foreground">Basado en el análisis de IA de tus respuestas</p>
          </div>

          {/* Depression Result */}
          <div className="text-center mb-8">
            <Badge 
              variant={depressionResult.hasDepression ? "destructive" : "default"}
              className={`text-lg px-6 py-2 ${depressionResult.color}`}
            >
              {!depressionResult.hasDepression && <CheckCircle className="w-5 h-5 mr-2" />}
              {depressionResult.hasDepression && <AlertTriangle className="w-5 h-5 mr-2" />}
              {depressionResult.label}
            </Badge>
          </div>

          {/* Description */}
          <Card className="bg-white/50 border-border/30 p-6 mb-6">
            <p className="text-foreground text-center text-lg">{depressionResult.description}</p>
          </Card>

          {/* Recommendations */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Recomendaciones Personalizadas</h3>
            <div className="grid gap-3">
              {depressionResult.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/30 rounded-lg">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-medium text-primary">{index + 1}</span>
                  </div>
                  <p className="text-foreground">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {depressionResult.hasDepression && (
              <Button onClick={handleGoToProfessionals} className="btn-calm">
                <ArrowRight className="w-4 h-4 mr-2" />
                Ver Profesionales Disponibles
              </Button>
            )}
            <Button onClick={handleRestart} variant="outline" className="btn-gentle">
              <RefreshCw className="w-4 h-4 mr-2" />
              Realizar Nueva Evaluación
            </Button>
          </div>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-warning/10 border border-warning/30 p-4">
          <p className="text-sm font-medium text-foreground mb-2">
            ⚠️ Importante: Esta evaluación utiliza inteligencia artificial y no constituye un diagnóstico médico
          </p>
          <p className="text-xs text-muted-foreground">
            Los resultados se basan en un modelo de machine learning entrenado para identificar factores de riesgo. 
            Esta herramienta no reemplaza la consulta con un profesional de salud mental licenciado. 
            Si estás experimentando pensamientos suicidas o crisis emocional, busca ayuda inmediata contactando servicios de emergencia.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Evaluación de Bienestar Mental con IA</h1>
        <p className="text-muted-foreground">Responde honestamente para recibir un análisis personalizado basado en inteligencia artificial</p>
      </div>

      {/* Progress */}
      <Card className="card-wellness mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-foreground">Progreso</span>
          <span className="text-sm text-muted-foreground">
            {currentQuestion + 1} de {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </Card>

      {/* Question */}
      <Card className="card-wellness mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          {questions[currentQuestion].text}
        </h2>

        <RadioGroup value={currentAnswer} onValueChange={handleAnswerSelect}>
          {questions[currentQuestion].options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/20 transition-colors">
              <RadioGroupItem value={option.value.toString()} id={`option-${index}`} />
              <Label 
                htmlFor={`option-${index}`} 
                className="flex-1 cursor-pointer text-foreground"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            if (currentQuestion > 0) {
              setCurrentQuestion(currentQuestion - 1);
              setAnswers(answers.slice(0, -1));
            }
          }}
          disabled={currentQuestion === 0}
          className="btn-gentle"
        >
          Anterior
        </Button>

        <Button
          onClick={handleNext}
          disabled={!currentAnswer}
          className="btn-calm"
        >
          {currentQuestion === questions.length - 1 ? "Analizar con IA" : "Siguiente"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Disclaimer */}
      <Card className="bg-gentle/30 border border-border/30 mt-6 p-4">
        <p className="text-xs text-muted-foreground text-center">
          Esta evaluación utiliza un modelo de inteligencia artificial para análisis predictivo. 
          Los resultados son confidenciales y se utilizan únicamente para brindarte recomendaciones personalizadas. 
          No constituye un diagnóstico médico profesional.
        </p>
      </Card>
    </div>
  );
};