import { Phone, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Footer = () => {
  const crisisResources = [
    { country: "Colombia", number: "106", description: "LÍNEA NACIONAL DE SALUD MENTAL" },
    { country: "México", number: "800 911 2000", description: "LÍNEA DE LA VIDA" },
    { country: "Argentina", number: "135", description: "CENTRO DE ATENCIÓN AL SUICIDA" },
    { country: "Perú", number: "0800-10828", description: "INFOSALUD MINSA" },
];

  return (
    <footer className="bg-white/90 backdrop-blur-sm border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Crisis Resources */}
        <Card className="card-wellness mb-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-5 h-5 text-destructive mr-2" />
            <h3 className="text-lg font-semibold text-foreground">Líneas de Crisis y Emergencia</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {crisisResources.map((resource) => (
              <div key={resource.country} className="text-center">
                <h4 className="font-medium text-foreground">{resource.country}</h4>
                <a
                  href={`tel:${resource.number.replace(/\s/g, '')}`}
                  className="text-lg font-bold text-primary hover:text-primary/80 transition-colors flex items-center justify-center mt-1"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  {resource.number}
                </a>
                <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* University Resources */}
        <div className="mb-6">
          <h4 className="font-medium text-foreground mb-2">Recursos Universitarios Comunes:</h4>
          <p className="text-sm text-muted-foreground">
            • Centro de Bienestar Estudiantil  • Servicios de Salud Mental  • Consejería Académica  • 
            Programa de Apoyo Estudiantil  • Oficina de Vida Estudiantil
          </p>
        </div>

        {/* Disclaimers */}
        <div className="border-t border-border/50 pt-6 space-y-4">
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
            <p className="text-sm font-medium text-foreground mb-2">
              ⚠️ IMPORTANTE
            </p>
            <p className="text-xs text-muted-foreground">
              MIA no constituye un servicio médico real. En caso de crisis emocional o pensamientos suicidas, 
              contacta inmediatamente los servicios de emergencia locales o las líneas de crisis arriba mencionadas.
            </p>
          </div>
          
          <div className="text-center text-xs text-muted-foreground">
            <p>© 2025 MIA - Prototipo de Aplicación de Salud Mental</p>
            <p className="mt-1">
              No constituye diagnóstico médico profesional. Busca ayuda de profesionales licenciados para problemas de salud mental.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};