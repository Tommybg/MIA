import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, MapPin, Calendar, Clock, Phone, AlertTriangle, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Professional {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  rating: number;
  location: string;
  availability: string;
  description: string;
  experience: string;
  profilePicture: string;
}

const mockProfessionals: Professional[] = [
  {
    id: "1",
    name: "Dra. María González",
    title: "Psicóloga Clínica",
    specialties: ["Depresión", "Ansiedad", "Estrés Académico"],
    rating: 4.9,
    location: "Buenos Aires",
    availability: "Disponible hoy",
    description: "Especialista en terapia cognitivo-conductual con enfoque en estudiantes universitarios.",
    experience: "8 años de experiencia",
    profilePicture: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "2",
    name: "Dr. Carlos Ruiz",
    title: "Psiquiatra",
    specialties: ["Trastornos del Ánimo", "Ansiedad", "TDAH"],
    rating: 4.8,
    location: "Mexico City",
    availability: "Disponible mañana",
    description: "Psiquiatra especializado en trastornos del ánimo y ansiedad en población joven adulta.",
    experience: "12 años de experiencia",
    profilePicture: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "3",
    name: "Dra. Ana Martínez",
    title: "Psicóloga Educativa",
    specialties: ["Estrés Académico", "Procrastinación", "Orientación Vocacional"],
    rating: 4.7,
    location: "Bogotá",
    availability: "Disponible esta semana",
    description: "Especialista en psicología educativa con enfoque en rendimiento académico y bienestar estudiantil.",
    experience: "6 años de experiencia",
    profilePicture: "https://images.unsplash.com/photo-1594824388852-8cedcc7bbe4b?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "4",
    name: "Dr. Luis Torres",
    title: "Psicoterapeuta",
    specialties: ["Terapia de Pareja", "Habilidades Sociales", "Autoestima"],
    rating: 4.6,
    location: "Cusco",
    availability: "Disponible próxima semana",
    description: "Psicoterapeuta especializado en relaciones interpersonales y desarrollo personal.",
    experience: "10 años de experiencia",
    profilePicture: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face"
  }
];

export const Professionals = () => {
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [appointmentForm, setAppointmentForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    reason: ""
  });
  const { toast } = useToast();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? "fill-warning text-warning" : "text-muted-foreground"
        }`}
      />
    ));
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Solicitud enviada",
      description: `Tu solicitud de cita con ${selectedProfessional?.name} ha sido enviada. Te contactaremos pronto.`,
    });

    // Reset form
    setAppointmentForm({
      name: "",
      email: "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      reason: ""
    });
    setSelectedProfessional(null);
  };

  const handleFormChange = (field: string, value: string) => {
    setAppointmentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profesionales de Salud Mental</h1>
        <p className="text-muted-foreground">Conecta con psicólogos y psiquiatras especializados en bienestar estudiantil</p>
      </div>

      {/* Emergency Notice */}
      <Card className="bg-destructive/10 border border-destructive/30 mb-6 p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground mb-1">🚨 En caso de emergencia emocional</p>
            <p className="text-sm text-muted-foreground">
              Si estás experimentando pensamientos suicidas o crisis emocional, no esperes una cita. 
              Contacta inmediatamente el <strong>911</strong> o las líneas de crisis en el pie de página.
            </p>
          </div>
        </div>
      </Card>

      {/* Professionals Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {mockProfessionals.map((professional) => (
          <Card key={professional.id} className="card-wellness">
            {/* Professional Photo */}
            <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden border-2 border-primary/20">
              <img
                src={professional.profilePicture}
                alt={`Foto de ${professional.name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center" style={{ display: 'none' }}>
                <User className="w-10 h-10 text-primary" />
              </div>
            </div>

            {/* Basic Info */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">{professional.name}</h3>
              <p className="text-sm text-muted-foreground">{professional.title}</p>
              <p className="text-xs text-muted-foreground">{professional.experience}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center space-x-1 mb-3">
              {renderStars(professional.rating)}
              <span className="text-sm font-medium text-foreground ml-2">{professional.rating}</span>
            </div>

            {/* Location & Availability */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                {professional.location}
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2 text-success" />
                <span className="text-success font-medium">{professional.availability}</span>
              </div>
            </div>

            {/* Specialties */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1 justify-center">
                {professional.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground text-center mb-4 line-clamp-2">
              {professional.description}
            </p>

            {/* Action Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="btn-calm w-full"
                  onClick={() => setSelectedProfessional(professional)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Solicitar Cita
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Solicitar Cita con {professional.name}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input
                        id="name"
                        value={appointmentForm.name}
                        onChange={(e) => handleFormChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={appointmentForm.email}
                        onChange={(e) => handleFormChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={appointmentForm.phone}
                      onChange={(e) => handleFormChange("phone", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Fecha preferida</Label>
                      <Input
                        id="date"
                        type="date"
                        value={appointmentForm.preferredDate}
                        onChange={(e) => handleFormChange("preferredDate", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Hora preferida</Label>
                      <Select 
                        value={appointmentForm.preferredTime} 
                        onValueChange={(value) => handleFormChange("preferredTime", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona hora" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">9:00 AM</SelectItem>
                          <SelectItem value="10:00">10:00 AM</SelectItem>
                          <SelectItem value="11:00">11:00 AM</SelectItem>
                          <SelectItem value="14:00">2:00 PM</SelectItem>
                          <SelectItem value="15:00">3:00 PM</SelectItem>
                          <SelectItem value="16:00">4:00 PM</SelectItem>
                          <SelectItem value="17:00">5:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reason">Motivo de consulta (opcional)</Label>
                    <Textarea
                      id="reason"
                      value={appointmentForm.reason}
                      onChange={(e) => handleFormChange("reason", e.target.value)}
                      placeholder="Describe brevemente el motivo de tu consulta..."
                      rows={3}
                    />
                  </div>

                  <div className="bg-gentle/30 border border-border/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">
                      📞 Te contactaremos en las próximas 24 horas para confirmar tu cita. 
                      Las consultas pueden ser presenciales o virtuales según disponibilidad.
                    </p>
                  </div>

                  <Button type="submit" className="btn-calm w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Enviar Solicitud
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </Card>
        ))}
      </div>

      {/* Disclaimer */}
      <Card className="bg-warning/10 border border-warning/30 p-4">
        <p className="text-sm font-medium text-foreground mb-2">
          ⚠️ Importante: Contenido simulado para prototipo
        </p>
        <p className="text-xs text-muted-foreground">
          Los profesionales mostrados son ejemplos para demostración. En una aplicación real, 
          esta sección mostraría profesionales licenciados verificados. Siempre verifica las 
          credenciales de cualquier profesional de salud mental antes de programar una consulta.
        </p>
      </Card>
    </div>
  );
};