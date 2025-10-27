import { MessageCircle, AlertTriangle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleEmergencyCall = () => {
    window.open("tel:988", "_self");
  };

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Evaluación", href: "/evaluation" },
    { name: "Habla con MIA", href: "/chat" },
    { name: "Profesionales", href: "/professionals" },
  ];

  const isActive = (href: string) => location.pathname === href;

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={`${mobile ? "flex flex-col space-y-4" : "hidden md:flex space-x-8"}`}>
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          onClick={() => mobile && setIsOpen(false)}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            isActive(item.href) 
              ? "text-primary border-b-2 border-primary pb-1" 
              : "text-muted-foreground"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-gentle">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MIA</h1>
              <p className="text-xs text-muted-foreground">Tu psicólogo personal</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavLinks />

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Emergency Button */}
            <Button
              onClick={handleEmergencyCall}
              className="btn-emergency text-xs px-4 py-2"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Emergencia
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[300px]">
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">MIA</h2>
                      <p className="text-xs text-muted-foreground">Tu psicólogo personal</p>
                    </div>
                  </div>
                  <NavLinks mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};