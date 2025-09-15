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
}

interface Answer {
  questionId: number;
  score: number;
}

const questions: Question[] = [
  { id: 1, text: "¿Con qué frecuencia te sientes triste o desanimado?" },
  { id: 2, text: "¿Qué tan difícil te resulta concentrarte en tus estudios?" },
  { id: 3, text: "¿Cómo calificarías tu nivel de energía durante el día?" },
  { id: 4, text: "¿Qué tan bien has dormido en las últimas dos semanas?" },
  { id: 5, text: "¿Cómo ves tu futuro académico y profesional?" },
  { id: 6, text: "¿Con qué frecuencia sientes que las cosas no tienen solución?" },
  { id: 7, text: "¿Qué tan motivado te sientes para realizar actividades que antes disfrutabas?" },
  { id: 8, text: "¿Con qué frecuencia te sientes aislado o solo?" }, 
  { id: 9, text: "¿Qué tan bien has dormido en las últimas dos semanas?" },
  { id: 10, text: "¿Cómo ves tu futuro académico y profesional?" },
];

const scaleLabels = [
  "Nunca / Excelente",      // 1 punto
  "Raramente / Bueno",      // 2 puntos  
  "A veces / Regular",      // 3 puntos
  "Frecuentemente / Malo",  // 4 puntos
  "Siempre / Muy malo"      // 5 puntos
];

type EvaluationStep = "questionnaire" | "analyzing" | "results";

interface RiskLevel {
  level: "low" | "moderate" | "high";
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
  const [riskAssessment, setRiskAssessment] = useState<RiskLevel | null>(null);
  const navigate = useNavigate();

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerSelect = (value: string) => {
    setCurrentAnswer(value);
  };

  const handleNext = () => {
    if (!currentAnswer) return;

    const newAnswer: Answer = {
      questionId: questions[currentQuestion].id,
      score: parseInt(currentAnswer)
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setCurrentAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Start analysis
      setCurrentStep("analyzing");
      
      // Simulate AI analysis
      setTimeout(() => {
        const assessment = analyzeResponses(updatedAnswers);
        setRiskAssessment(assessment);
        setCurrentStep("results");
      }, 3000);
    }
  };

  const analyzeResponses = (responses: Answer[]): RiskLevel => {
    const totalScore = responses.reduce((sum, answer) => sum + answer.score, 0);
    const maxScore = questions.length * 5;
    const percentage = (totalScore / maxScore) * 100;

    if (percentage <= 40) {
      return {
        level: "low",
        label: "Riesgo Bajo",
        color: "text-success",
        description: "Tus respuestas indican un bienestar mental relativamente bueno. Continúa cuidando tu salud mental.",
        recommendations: [
          "Mantén rutinas saludables de sueño y ejercicio",
          "Continúa conectando con amigos y familia",
          "Practica técnicas de mindfulness regularmente",
          "Considera recursos preventivos de bienestar estudiantil"
        ]
      };
    } else if (percentage <= 70) {
      return {
        level: "moderate",
        label: "Riesgo Moderado",
        color: "text-warning",
        description: "Tus respuestas sugieren algunos desafíos en tu bienestar mental que podrían beneficiarse de apoyo adicional.",
        recommendations: [
          "Considera hablar con un consejero estudiantil",
          "Explora grupos de apoyo en tu universidad",
          "Establece rutinas de autocuidado más estructuradas",
          "Busca conexiones sociales y actividades que disfrutes"
        ]
      };
    } else {
      return {
        level: "high",
        label: "Riesgo Alto",
        color: "text-destructive",
        description: "Tus respuestas indican que podrías estar experimentando desafíos significativos. Te recomendamos buscar apoyo profesional.",
        recommendations: [
          "Busca ayuda de un profesional de salud mental",
          "Contacta el centro de bienestar estudiantil inmediatamente",
          "Considera hablar con un médico de atención primaria",
          "Mantente conectado con sistema de apoyo de confianza"
        ]
      };
    }
  };

  const handleRestart = () => {
    setCurrentStep("questionnaire");
    setCurrentQuestion(0);
    setAnswers([]);
    setCurrentAnswer("");
    setRiskAssessment(null);
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
                Nuestro sistema está procesando tu evaluación para brindarte recomendaciones personalizadas.
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 max-w-md">
              <p className="text-sm text-muted-foreground">
                📊 Procesando {questions.length} respuestas<br/>
                🧠 Aplicando algoritmos de bienestar mental<br/>
                ⚖️ Generando recomendaciones personalizadas
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (currentStep === "results" && riskAssessment) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card className="card-wellness mb-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Resultados de tu Evaluación</h1>
            <p className="text-muted-foreground">Basado en tus respuestas, aquí está tu evaluación de bienestar mental</p>
          </div>

          {/* Risk Level */}
          <div className="text-center mb-8">
            <Badge 
              variant={riskAssessment.level === "low" ? "default" : "destructive"}
              className={`text-lg px-6 py-2 ${riskAssessment.color}`}
            >
              {riskAssessment.level === "low" && <CheckCircle className="w-5 h-5 mr-2" />}
              {riskAssessment.level === "moderate" && <Clock className="w-5 h-5 mr-2" />}
              {riskAssessment.level === "high" && <AlertTriangle className="w-5 h-5 mr-2" />}
              {riskAssessment.label}
            </Badge>
          </div>

          {/* Description */}
          <Card className="bg-white/50 border-border/30 p-6 mb-6">
            <p className="text-foreground text-center text-lg">{riskAssessment.description}</p>
          </Card>

          {/* Recommendations */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Recomendaciones Personalizadas</h3>
            <div className="grid gap-3">
              {riskAssessment.recommendations.map((rec, index) => (
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
            {(riskAssessment.level === "moderate" || riskAssessment.level === "high") && (
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
            ⚠️ Importante: Esta evaluación no constituye un diagnóstico médico
          </p>
          <p className="text-xs text-muted-foreground">
            Los resultados de esta evaluación son indicativos y no reemplazan la consulta con un profesional 
            de salud mental licenciado. Si estás experimentando pensamientos suicidas o crisis emocional, 
            busca ayuda inmediata contactando servicios de emergencia.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Evaluación de Bienestar Mental</h1>
        <p className="text-muted-foreground">Responde honestamente para recibir recomendaciones personalizadas</p>
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
          {scaleLabels.map((label, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/20 transition-colors">
              <RadioGroupItem value={(index + 1).toString()} id={`option-${index}`} />
              <Label 
                htmlFor={`option-${index}`} 
                className="flex-1 cursor-pointer text-foreground"
              >
                {label}
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
          {currentQuestion === questions.length - 1 ? "Finalizar Evaluación" : "Siguiente"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Disclaimer */}
      <Card className="bg-gentle/30 border border-border/30 mt-6 p-4">
        <p className="text-xs text-muted-foreground text-center">
          Esta evaluación es confidencial y los resultados se utilizan únicamente para brindarte 
          recomendaciones personalizadas. No constituye un diagnóstico médico profesional.
        </p>
      </Card>
    </div>
  );
};