import { MessageCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center space-y-8">
            {/* Logo and Title */}
            <div className="space-y-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg mx-auto">
                <MessageCircle className="w-10 h-10 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  ¡Bienvenido a MIA!
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Tu asistente inteligente de salud mental está aquí para acompañarte
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-6 pt-4">
              {/* New User - Evaluation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Primera vez aquí?
                </h3>
                <Link to="/evaluation" className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-base border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Comenzar Evaluación
                  </Button>
                </Link>
              </div>

              {/* Returning User - Chat */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Ya completé la evaluación
                </h3>
                <Link to="/chat" className="w-full">
                  <Button 
                    variant="outline" 
                    className="w-full h-12 text-base border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Hablar con MIA
                  </Button>
                </Link>
              </div>
            </div>

            {/* Additional Info */}
            <div className="pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                💡 <strong>Recuerda:</strong> MIA está aquí para apoyarte, pero no reemplaza la ayuda profesional. 
                Si necesitas atención urgente, no dudes en contactar a un profesional de la salud mental.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};