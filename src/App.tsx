/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  HeartPulse,
  Baby,
  Stethoscope,
  Sparkles,
  FlaskConical,
  ShieldAlert,
  HeartHandshake,
  Award,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  ArrowRight,
  CheckCircle2,
  Building2,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart
} from "lucide-react";

import { doctorsData, hospitalServices, hospitalValues, patientTestimonials, faqsData } from "./data";
import { Doctor, Service, HospitalValue } from "./types";

export default function App() {
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search/Filter state for Doctors
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("Todos");

  // Selected Service for detailed view modal/collapse
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  // Testimonials Carousel cycle state
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [testimonialAutoplay, setTestimonialAutoplay] = useState(true);

  // FAQ Accordion state
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-1");

  // Booking Appointment form state
  const [bookingForm, setBookingForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    especialidad: "",
    medico: "",
    fecha: "",
    hora: "09:00",
    observaciones: ""
  });

  const [formStatus, setFormStatus] = useState<{
    type: "idle" | "submitting" | "success" | "error";
    message: string;
    ticketNum?: string;
  }>({ type: "idle", message: "" });

  const appointmentSectionRef = useRef<HTMLDivElement>(null);

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  // Testimonials slide rotation timer
  useEffect(() => {
    if (!testimonialAutoplay) return;
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % patientTestimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonialAutoplay]);

  // Handler for booking form updates
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
      // Reset doctor Selection if specialty changes
      ...(name === "especialidad" ? { medico: "" } : {})
    }));
  };

  // Book from doctor card action
  const handleBookWithDoctor = (doctor: Doctor) => {
    setBookingForm((prev) => ({
      ...prev,
      especialidad: doctor.specialty,
      medico: doctor.name
    }));
    // Smooth scroll to form
    const formSection = document.getElementById("citas");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Submission validation and execution
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Reset status
    setFormStatus({ type: "submitting", message: "Procesando su solicitud de cita médica..." });

    // Client-side validations
    const { nombre, correo, telefono, especialidad, medico, fecha } = bookingForm;

    if (!nombre || !correo || !telefono || !especialidad || !medico || !fecha) {
      setFormStatus({
        type: "error",
        message: "Por favor complete todos los datos requeridos."
      });
      return;
    }

    // Email regex check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(correo)) {
      setFormStatus({
        type: "error",
        message: "El formato de correo electrónico ingresado no es válido."
      });
      return;
    }

    // Telephone pattern check (numbers only, standard length)
    const telPattern = /^[+]?[0-9\s-]{7,15}$/;
    if (!telPattern.test(telefono)) {
      setFormStatus({
        type: "error",
        message: "Por favor introduzca un número de teléfono válido (mínimo 7 dígitos)."
      });
      return;
    }

    // Date in future check
    const selectedDate = new Date(fecha + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setFormStatus({
        type: "error",
        message: "La fecha seleccionada no puede ser anterior al día de hoy."
      });
      return;
    }

    // Success simulation
    setTimeout(() => {
      const ticketId = "VS-" + Math.floor(100000 + Math.random() * 900000);
      setFormStatus({
        type: "success",
        message: `¡Solicitud exitosa! Su cita ha sido registrada con el boleto de seguimiento nacional.`,
        ticketNum: ticketId
      });
    }, 1500);
  };

  // Helper function to map string to Lucide icon
  const getIcon = (name: string, className: string = "w-6 h-6") => {
    switch (name) {
      case "Stethoscope":
        return <Stethoscope className={className} />;
      case "Baby":
        return <Baby className={className} />;
      case "HeartPulse":
        return <HeartPulse className={className} />;
      case "Sparkles":
        return <Sparkles className={className} />;
      case "FlaskConical":
        return <FlaskConical className={className} />;
      case "ShieldAlert":
        return <ShieldAlert className={className} />;
      case "HeartHandshake":
        return <HeartHandshake className={className} />;
      case "Award":
        return <Award className={className} />;
      case "User":
        return <User className={className} />;
      default:
        return <Heart className={className} />;
    }
  };

  // Filter doctors list
  const filteredDoctors = selectedSpecialty === "Todos"
    ? doctorsData
    : doctorsData.filter((doc) => doc.specialty === selectedSpecialty);

  // Get active doctors listed according to chosen specialty in the form
  const getSubspecialistList = () => {
    if (!bookingForm.especialidad) return [];
    return doctorsData.filter(d => d.specialty === bookingForm.especialidad);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 antialiased selection:bg-teal-500 selection:text-white">
      
      {/* 1. Header (Encabezado) */}
      <header className="sticky top-0 z-50 glass-effect border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div 
              id="header-logo"
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => scrollToSection("inicio")}
            >
              <div className="w-11 h-11 bg-teal-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-teal-200 group-hover:bg-blue-600 transition-colors duration-300">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-blue-900 block leading-tight">
                  Hospital <span className="text-teal-600">Vida Sana</span>
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">
                  Excelencia Médica 24H
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {["inicio", "nosotros", "servicios", "medicos", "citas", "contacto"].map((section) => (
                <button
                  key={section}
                  id={`nav-btn-${section}`}
                  onClick={() => scrollToSection(section)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-900 hover:bg-slate-100/60 rounded-lg capitalize transition-all duration-200 cursor-pointer"
                >
                  {section === "medicos" ? "médicos" : section}
                </button>
              ))}
              <button
                id="nav-btn-action"
                onClick={() => scrollToSection("citas")}
                className="ml-4 px-5 py-2.5 bg-teal-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-blue-900 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                Agendar Cita
              </button>
            </nav>

            {/* Hamburger Button */}
            <button
              id="hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100 shadow-inner px-4 pt-3 pb-6 space-y-2 overflow-hidden"
            >
              {["inicio", "nosotros", "servicios", "medicos", "citas", "contacto"].map((section) => (
                <button
                  key={section}
                  id={`mobile-nav-btn-${section}`}
                  onClick={() => scrollToSection(section)}
                  className="block w-full text-left px-4 py-2.5 text-base font-medium text-slate-600 hover:text-blue-900 hover:bg-slate-50 rounded-lg capitalize transition-colors"
                >
                  {section === "medicos" ? "médicos" : section}
                </button>
              ))}
              <div className="pt-3 px-4">
                <button
                  id="mobile-nav-action"
                  onClick={() => scrollToSection("citas")}
                  className="w-full text-center px-5 py-3 bg-teal-500 text-white text-base font-semibold rounded-lg shadow-sm hover:bg-blue-900 transition-colors"
                >
                  Agendar Cita
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Hero Section (Sección Principal) */}
      <section id="inicio" className="relative overflow-hidden pt-6 pb-20 md:py-32 bg-white">
        <div className="absolute inset-0 bg-gradient-to-tr from-teal-50/40 via-white to-blue-50/50 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Column content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left space-y-6"
            >
              <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full text-teal-700 text-xs font-semibold tracking-wider uppercase">
                <Building2 className="w-3.5 h-3.5" />
                <span>Salud y Bienestar Garantizados</span>
              </div>
              
              <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-950 tracking-tight leading-[1.1]">
                Hospital <br />
                <span className="text-teal-500 bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">Vida Sana</span>
              </h1>
              
              <p id="hero-subtitle" className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Cuidamos tu salud y bienestar las 24 horas con tecnología de vanguardia, los especialistas más calificados del país y una profunda calidez humana.
              </p>

              <div id="hero-ctas" className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  id="hero-btn-book"
                  onClick={() => scrollToSection("citas")}
                  className="px-8 py-4 bg-teal-500 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 hover:bg-blue-950 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-center cursor-pointer"
                >
                  Agendar Cita Médica
                </button>
                <button
                  id="hero-btn-services"
                  onClick={() => scrollToSection("servicios")}
                  className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl hover:-translate-y-0.5 transition-all duration-200 text-center cursor-pointer"
                >
                  Conocer Servicios
                </button>
              </div>

              {/* Status indicators */}
              <div id="hero-stats" className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-100">
                <div>
                  <span className="block text-3xl font-extrabold text-blue-900">20+</span>
                  <span className="text-xs text-slate-500 font-medium">Años de Servicio</span>
                </div>
                <div>
                  <span className="block text-3xl font-extrabold text-blue-900">50+</span>
                  <span className="text-xs text-slate-500 font-medium">Médicos Especialistas</span>
                </div>
                <div>
                  <span className="block text-3xl font-extrabold text-blue-900">24/7</span>
                  <span className="text-xs text-slate-500 font-medium font-medium text-emerald-600 inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Atención Urgencias
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Column photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:ml-auto"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] max-w-lg lg:max-w-none mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000"
                  alt="Doctor at Hospital Vida Sana"
                  className="w-full h-full object-cover"
                />
                
                {/* Visual Glass overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/30 via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 p-4 glass-effect rounded-2xl border border-white/20 shadow-lg flex items-center space-x-4">
                  <div className="bg-emerald-50 rounded-xl p-2.5 text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-blue-950">Acreditación Nacional</h4>
                    <p className="text-xs text-slate-500">Certificado por el Ministerio de Salud Pública</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative background spheres */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob -z-10" />
              <div className="absolute -bottom-10 -left-6 w-36 h-36 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob delay-2000 -z-10" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. Sección Nosotros */}
      <section id="nosotros" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
              Sobre Nosotros
            </h2>
            <div className="w-16 h-1 bg-teal-500 mx-auto rounded-full" />
            <p className="text-base text-slate-600 leading-relaxed">
              Trabajamos todos los días inspirados en sanar y servir a nuestra comunidad con la máxima honestidad académica y calidez asistencial.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Story Card */}
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-100 space-y-6">
              <h3 className="text-2xl font-bold text-blue-900">
                Nuestra Historia y Misión
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Con más de 20 años de trayectoria impecable, el <strong>Hospital Vida Sana</strong> nació con una firme promesa social: democratizar el acceso real a servicios de salud de alta complejidad médica.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Nuestra misión consolidada es brindar servicios médicos integrales y hospitalarios con elevados índices internacionales de bio-seguridad, asertividad diagnóstica y permanente ética profesional.
              </p>
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">Atención Personalizada</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">Infraestructura Moderna</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">Urgencias Certificadas</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">Especialistas Líderes</span>
                </div>
              </div>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {hospitalValues.map((value) => (
                <div
                  key={value.id}
                  id={`value-card-${value.id}`}
                  className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-500/20 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                    {getIcon(value.iconName, "w-6 h-6")}
                  </div>
                  <h4 className="text-lg font-bold text-blue-900 mb-2">
                    {value.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 4. Sección Servicios */}
      <section id="servicios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
              Nuestros Servicios Médicos
            </h2>
            <div className="w-16 h-1 bg-teal-500 mx-auto rounded-full" />
            <p className="text-base text-slate-600 leading-relaxed">
              Ofrecemos una atención por niveles de complejidad amparada en instrumental de última generación para acompañarte en cada una de tus etapas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hospitalServices.map((service) => {
              const isDetailsOpen = activeServiceId === service.id;
              return (
                <div
                  key={service.id}
                  id={`service-card-${service.id}`}
                  className="bg-slate-50 rounded-2xl p-6 border border-slate-100 transition-all duration-300 flex flex-col hover:bg-white hover:shadow-xl hover:border-teal-500/20 group"
                >
                  {/* Service Card Top */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white text-teal-600 rounded-xl flex items-center justify-center p-2 shadow-sm group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                      {getIcon(service.iconName, "w-6 h-6")}
                    </div>
                    {service.id === "emergencias" && (
                      <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-rose-50 text-rose-600 border border-rose-100 rounded-full animate-pulse">
                        Urgencias 24h
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-blue-900 group-hover:text-teal-600 transition-colors mb-2">
                    {service.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 flex-grow">
                    {service.description}
                  </p>

                  {/* Interactive Accordion panel inside Card */}
                  <div className="border-t border-slate-100/80 pt-4 mt-auto">
                    <button
                      id={`service-toggle-${service.id}`}
                      onClick={() => setActiveServiceId(isDetailsOpen ? null : service.id)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 hover:text-teal-600 transition-colors"
                    >
                      <span>{isDetailsOpen ? "Ocultar Prestaciones" : "Ver Prestaciones Básicas"}</span>
                      <ChevronDown className={`w-4 h-4 transform transition-transform duration-300 ${isDetailsOpen ? "rotate-180 text-teal-600" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {isDetailsOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden mt-3"
                        >
                          <ul className="space-y-2 text-xs text-slate-500 pl-1">
                            {service.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-teal-500 shrink-0 mt-0.5">•</span>
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                          
                          {/* Inner Action click */}
                          <div className="pt-4">
                            <button
                              id={`service-book-action-${service.id}`}
                              onClick={() => {
                                setBookingForm(prev => ({ ...prev, especialidad: service.title }));
                                scrollToSection("citas");
                              }}
                              className="inline-flex items-center text-[11px] uppercase font-bold text-teal-600 hover:text-blue-900 tracking-wider gap-1"
                            >
                              <span>Reservar Especialidad</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Sección Médicos */}
      <section id="medicos" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
              Nuestros Especialistas Médicos
            </h2>
            <div className="w-16 h-1 bg-teal-500 mx-auto rounded-full" />
            <p className="text-base text-slate-600 leading-relaxed">
              Contamos con un equipo médico altamente calificado formado en academias líderes internacionales, dedicados por entero a tu diagnóstico.
            </p>
          </div>

          {/* Specialty Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {["Todos", "Medicina General", "Pediatría", "Cardiología", "Ginecología"].map((tab) => (
              <button
                key={tab}
                id={`filter-tab-${tab.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSelectedSpecialty(tab)}
                className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                  selectedSpecialty === tab
                    ? "bg-teal-500 text-white shadow-md shadow-teal-500/10"
                    : "bg-white text-slate-600 hover:text-blue-900 hover:bg-slate-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Doctors Grid with filter animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredDoctors.map((doctor) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={doctor.id}
                  id={`doctor-card-${doctor.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-teal-500/15 border border-slate-100 transition-all duration-300 flex flex-col group"
                >
                  {/* Photo area */}
                  <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden shrink-0">
                    <img
                      src={doctor.imageUrl}
                      alt={doctor.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-teal-50/90 text-teal-700 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md glass-effect border border-white/40 shadow-sm">
                      {doctor.specialty}
                    </div>
                  </div>

                  {/* Description area */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-blue-950 mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-xs text-slate-400 capitalize mb-3">
                      {doctor.experience}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                      {doctor.bio}
                    </p>
                    
                    {/* Available Days sub-badge */}
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <span className="block text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">
                        Días Disponibles:
                      </span>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {doctor.availableDays.map((day) => (
                          <span key={day} className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {day}
                          </span>
                        ))}
                      </div>

                      {/* Primary Link Interaction */}
                      <button
                        id={`doctor-book-${doctor.id}`}
                        onClick={() => handleBookWithDoctor(doctor)}
                        className="w-full text-center py-2 bg-slate-50 text-teal-600 hover:bg-teal-500 hover:text-white rounded-lg text-xs font-bold tracking-wide transition-colors duration-200 cursor-pointer"
                      >
                        Agendar con Especialista
                      </button>
                    </div>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 6. Formulario de Citas (Agenda tu Cita) */}
      <section id="citas" className="py-20 bg-white" ref={appointmentSectionRef}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
              Agenda tu Cita Médica
            </h2>
            <div className="w-16 h-1 bg-teal-500 mx-auto rounded-full" />
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Completa el siguiente formulario nacional de pre-registro. Un asesor de salud de nuestro hospital se contactará contigo para confirmar el pago y asignación de consultorios.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-100 shadow-xl overflow-hidden p-6 sm:p-10">
            <AnimatePresence mode="wait">
              {formStatus.type === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 space-y-6"
                >
                  <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-blue-950">¡Solicitud Procesada Exitosamente!</h3>
                    <p className="text-sm text-slate-600 max-w-lg mx-auto">
                      Hola <strong className="text-teal-600">{bookingForm.nombre}</strong>, hemos registrado tu solicitud de cita médica preliminar para la especialidad de <strong>{bookingForm.especialidad}</strong> con el especialista <strong>{bookingForm.medico || "Médico de Guardia"}</strong>.
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200/60 rounded-xl p-6 text-left max-w-md mx-auto space-y-3 shadow-inner">
                    <div className="flex justify-between border-b border-slate-100 pb-2.5">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Código de Turno:</span>
                      <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">{formStatus.ticketNum}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2.5">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fecha Asignada:</span>
                      <span className="text-xs font-semibold text-slate-700">{bookingForm.fecha}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2.5">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Horario de Solicitud:</span>
                      <span className="text-xs font-semibold text-slate-700">{bookingForm.hora}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Teléfono Contacto:</span>
                      <span className="text-xs font-semibold text-slate-700">{bookingForm.telefono}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 italic">
                    Un asesor técnico te contactará por llamada o WhatsApp en los próximos 15 minutos para validar la disponibilidad horaria del profesional.
                  </p>

                  <div className="pt-4">
                    <button
                      id="reset-form-btn"
                      onClick={() => {
                        setBookingForm({
                          nombre: "",
                          correo: "",
                          telefono: "",
                          especialidad: "",
                          medico: "",
                          fecha: "",
                          hora: "09:00",
                          observaciones: ""
                        });
                        setFormStatus({ type: "idle", message: "" });
                      }}
                      className="px-6 py-2.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Agendar Otra Cita
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form id="appointment-form" onSubmit={handleFormSubmit} className="space-y-6">
                  
                  {/* Row 1: Nombre */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label htmlFor="nombre" className="block text-xs font-bold text-blue-950 uppercase tracking-wider">
                        Nombre Completo <span className="text-teal-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={bookingForm.nombre}
                        onChange={handleInputChange}
                        placeholder="Ej. Juan Pérez Soto"
                        required
                        className="w-full bg-white border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm transition-all outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="correo" className="block text-xs font-bold text-blue-950 uppercase tracking-wider">
                        Correo Electrónico <span className="text-teal-600">*</span>
                      </label>
                      <input
                        type="email"
                        id="correo"
                        name="correo"
                        value={bookingForm.correo}
                        onChange={handleInputChange}
                        placeholder="Ej. juan@correo.com"
                        required
                        className="w-full bg-white border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Row 2: Teléfono & Especialidad */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label htmlFor="telefono" className="block text-xs font-bold text-blue-950 uppercase tracking-wider">
                        Teléfono Móvil <span className="text-teal-600">*</span>
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={bookingForm.telefono}
                        onChange={handleInputChange}
                        placeholder="Ej. +1 234 567890"
                        required
                        className="w-full bg-white border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm transition-all outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="especialidad" className="block text-xs font-bold text-blue-950 uppercase tracking-wider">
                        Especialidad Médica <span className="text-teal-600">*</span>
                      </label>
                      <select
                        id="especialidad"
                        name="especialidad"
                        value={bookingForm.especialidad}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm transition-all outline-none text-slate-700"
                      >
                        <option value="">Seleccione Especialidad</option>
                        <option value="Medicina General">Medicina General</option>
                        <option value="Pediatría">Pediatría</option>
                        <option value="Cardiología">Cardiología</option>
                        <option value="Ginecología">Ginecología & Obstetricia</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Especialista (autocompleta según especialidad) & Fecha */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1 md:col-span-1">
                      <label htmlFor="medico" className="block text-xs font-bold text-blue-950 uppercase tracking-wider">
                        Médico Especialista <span className="text-teal-600">*</span>
                      </label>
                      <select
                        id="medico"
                        name="medico"
                        value={bookingForm.medico}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm transition-all outline-none text-slate-700"
                      >
                        <option value="">Seleccionar Especialista</option>
                        {bookingForm.especialidad ? (
                          getSubspecialistList().map((d) => (
                            <option key={d.id} value={d.name}>
                              {d.name}
                            </option>
                          ))
                        ) : (
                          <option value="Cualquiera">Cualquiera disponible</option>
                        )}
                      </select>
                    </div>

                    <div className="space-y-1 md:col-span-1">
                      <label htmlFor="fecha" className="block text-xs font-bold text-blue-950 uppercase tracking-wider">
                        Fecha <span className="text-teal-600">*</span>
                      </label>
                      <input
                        type="date"
                        id="fecha"
                        name="fecha"
                        value={bookingForm.fecha}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm transition-all outline-none text-slate-700"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-1">
                      <label htmlFor="hora" className="block text-xs font-bold text-blue-950 uppercase tracking-wider">
                        Hora de Preferencia
                      </label>
                      <select
                        id="hora"
                        name="hora"
                        value={bookingForm.hora}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm transition-all outline-none text-slate-700"
                      >
                        <option value="08:00">08:00 AM</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="15:00">03:00 PM</option>
                        <option value="16:00">04:00 PM</option>
                        <option value="17:00">05:00 PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Observaciones */}
                  <div className="space-y-1">
                    <label htmlFor="observaciones" className="block text-xs font-bold text-blue-950 uppercase tracking-wider">
                      Motivo de consulta u observaciones
                    </label>
                    <textarea
                      id="observaciones"
                      name="observaciones"
                      rows={3}
                      value={bookingForm.observaciones}
                      onChange={handleInputChange}
                      placeholder="Describa brevemente sus síntomas o si es un chequeo preventivo de rutina..."
                      className="w-full bg-white border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl px-4 py-3 text-sm transition-all outline-none resize-none"
                    />
                  </div>

                  {/* Validation Alerts */}
                  {formStatus.message && formStatus.type !== "success" && (
                    <div
                      id="form-feedback-alert"
                      className={`p-4 rounded-xl text-xs font-medium ${
                        formStatus.type === "error"
                          ? "bg-rose-50 border border-rose-100 text-rose-700"
                          : "bg-teal-50 border border-teal-100 text-teal-700 animate-pulse"
                      }`}
                    >
                      {formStatus.message}
                    </div>
                  )}

                  {/* Primary button */}
                  <button
                    type="submit"
                    id="submit-appointment-btn"
                    disabled={formStatus.type === "submitting"}
                    className="w-full py-4 bg-teal-500 hover:bg-blue-950 font-bold text-white rounded-xl text-sm tracking-wide shadow-md hover:shadow-lg disabled:opacity-50 transition-all duration-200 cursor-pointer"
                  >
                    {formStatus.type === "submitting" ? "Enviando Solicitud..." : "Solicitar Cita de Salud"}
                  </button>

                  <p className="text-center text-[11px] text-slate-400">
                    Al enviar este formulario acepta el uso lícito de sus datos personales bajo nuestra política de confidencialidad clínico-médica.
                  </p>

                </form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 7. Sección Testimonios */}
      <section className="py-20 bg-slate-100/50 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-50/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight">
              Lo que opinan nuestros pacientes
            </h2>
            <div className="w-16 h-1 bg-teal-500 mx-auto rounded-full" />
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              La mayor recompensa a nuestra labor diaria es la opinión de quienes han depositado su confianza en nuestras manos éticas.
            </p>
          </div>

          {/* Carousel container with slide transitions with play controls */}
          <div
            id="testimonial-carousel-container"
            onMouseEnter={() => setTestimonialAutoplay(false)}
            onMouseLeave={() => setTestimonialAutoplay(true)}
            className="bg-white rounded-2xl border border-slate-100 shadow-xl p-8 sm:p-12 relative text-center"
          >
            {/* Quote Icon Background */}
            <div className="absolute top-6 left-8 text-slate-100 font-serif text-[120px] select-none leading-none -z-0">“</div>

            <div className="relative z-10 min-h-[160px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonialIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Rating Stars */}
                  <div className="flex items-center justify-center gap-1">
                    {[...Array(patientTestimonials[currentTestimonialIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Paragraph text */}
                  <p className="text-base sm:text-lg italic text-slate-700 font-medium leading-relaxed max-w-2xl mx-auto">
                    "{patientTestimonials[currentTestimonialIndex].text}"
                  </p>

                  {/* Patient Info */}
                  <div>
                    <h4 className="text-base font-bold text-blue-950 font-sans">
                      - {patientTestimonials[currentTestimonialIndex].name}
                    </h4>
                    <span className="text-xs text-slate-400 font-medium font-mono uppercase tracking-wider block mt-1">
                      {patientTestimonials[currentTestimonialIndex].role}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:-left-6">
              <button
                id="carousel-prev-btn"
                onClick={() => {
                  setTestimonialAutoplay(false);
                  setCurrentTestimonialIndex((prev) => (prev - 1 + patientTestimonials.length) % patientTestimonials.length);
                }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white hover:bg-slate-50 text-slate-600 rounded-full flex items-center justify-center border border-slate-100 shadow-md transition-colors focus:outline-none cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:-right-6">
              <button
                id="carousel-next-btn"
                onClick={() => {
                  setTestimonialAutoplay(false);
                  setCurrentTestimonialIndex((prev) => (prev + 1) % patientTestimonials.length);
                }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-white hover:bg-slate-50 text-slate-600 rounded-full flex items-center justify-center border border-slate-100 shadow-md transition-colors focus:outline-none cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Active Slides indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {patientTestimonials.map((_, idx) => (
                <button
                  key={idx}
                  id={`carousel-indicator-${idx}`}
                  onClick={() => {
                    setTestimonialAutoplay(false);
                    setCurrentTestimonialIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentTestimonialIndex === idx ? "w-6 bg-teal-500" : "bg-slate-200"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 8. Sección Contacto & FAQ */}
      <section id="contacto" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Quick Contact & Details */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-extrabold text-blue-950 tracking-tight">
                  Contáctanos
                </h2>
                <div className="w-16 h-1 bg-teal-500 rounded-full" />
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Estamos disponibles para atenderte ante cualquier consulta técnica, cotización o reserva administrativa. Visítanos en nuestra sede corporativa.
                </p>
              </div>

              {/* Specific Items */}
              <div className="space-y-4">
                <a
                  href="https://maps.google.com/?q=Av.+Principal+456,+Ciudad+Salud"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  id="contact-item-map"
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-blue-950">Dirección Sede Principal</h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">Av. Principal #456, Ciudad Salud</p>
                    <span className="text-[10px] font-semibold text-teal-600 mt-1 inline-flex items-center gap-1">
                      Ver en Google Maps <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </a>

                <a
                  href="tel:+1800123456"
                  id="contact-item-phone"
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-blue-950">Contacto Telefónico</h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">+1 800 123 456</p>
                    <span className="text-[10px] font-semibold text-teal-600 mt-1 block">
                      Operativo para agendamiento local
                    </span>
                  </div>
                </a>

                <a
                  href="mailto:info@vidasana.com"
                  id="contact-item-email"
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-blue-950">Correo Electrónico Oficial</h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">info@vidasana.com</p>
                    <span className="text-[10px] font-semibold text-teal-600 mt-1 block">
                      Respondemos solicitudes administrativas en menos de 2 horas
                    </span>
                  </div>
                </a>
              </div>

              {/* Collapsible FAQ accordions as added value */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Preguntas Frecuentes</h3>
                <div className="space-y-2">
                  {faqsData.map((faq) => {
                    const isOpen = openFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        id={`faq-item-${faq.id}`}
                        className="bg-slate-50 border border-slate-100 rounded-xl overflow-hidden transition-all duration-200"
                      >
                        <button
                          id={`faq-btn-${faq.id}`}
                          onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                          className="w-full px-5 py-3.5 flex items-center justify-between text-left font-semibold text-xs sm:text-sm text-blue-950 hover:text-teal-600 transition-colors cursor-pointer"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transform transition-transform duration-300 ${isOpen ? "rotate-180 text-teal-600" : ""}`} />
                        </button>
                        
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="px-5 pb-4 text-xs text-slate-500 leading-relaxed"
                            >
                              {faq.answer}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Embedded interactive maps iframe element */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-blue-900 border-l-4 border-teal-500 pl-3">Ubicación Satelital</h3>
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-slate-100 bg-slate-50 text-center">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093643!2d144.9537353153166!3d-37.81720997975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1ses!2sus!4v1625682123456!5m2!1ses!2sus"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  title="Hospital Vida Sana Locación Satelital"
                  className="w-full"
                />
              </div>
              <div className="flex items-center gap-3 bg-teal-50/50 p-4 rounded-xl border border-teal-100/50">
                <Clock className="w-5 h-5 text-teal-600 shrink-0" />
                <p className="text-xs text-slate-600">
                  <strong className="text-blue-950 font-bold block">Horario de Consultorios Externos:</strong>
                  Lunes a Sábado de 07:00 AM a 08:00 PM. No requiere cita para Emergencias.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. Pie de Página (Footer) */}
      <footer className="bg-blue-950 text-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-blue-900">
            
            {/* Widget 1 logo */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-500 text-white rounded-lg flex items-center justify-center">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <span className="text-xl font-extrabold tracking-tight">
                  Vida <span className="text-teal-400">Sana</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Comprometidos firmemente con la salud, la investigación académica y la atención asistencial del paciente desde 1995.
              </p>
              
              {/* Social Medias */}
              <div className="flex items-center space-x-3 pt-2">
                <a
                  href="#"
                  aria-label="Facebook"
                  id="footer-facebook"
                  className="w-8 h-8 rounded-lg bg-blue-900 border border-blue-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-teal-500 hover:border-teal-400 transition-colors duration-200"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  id="footer-twitter"
                  className="w-8 h-8 rounded-lg bg-blue-900 border border-blue-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-teal-500 hover:border-teal-400 transition-colors duration-200"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  id="footer-instagram"
                  className="w-8 h-8 rounded-lg bg-blue-900 border border-blue-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-teal-500 hover:border-teal-400 transition-colors duration-200"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="Linkedin"
                  id="footer-linkedin"
                  className="w-8 h-8 rounded-lg bg-blue-900 border border-blue-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-teal-500 hover:border-teal-400 transition-colors duration-200"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Widget 2 Services quick indexing */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-teal-400">Nuestras Especialidades</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                {hospitalServices.slice(0, 4).map((serv) => (
                  <li key={serv.id}>
                    <button
                      id={`footer-serv-link-${serv.id}`}
                      onClick={() => scrollToSection("servicios")}
                      className="hover:text-white hover:underline transition-all text-left"
                    >
                      {serv.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Widget 3 Quick Menu */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-teal-400">Acceso Rápido</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                {["inicio", "nosotros", "servicios", "medicos", "citas", "contacto"].map((item) => (
                  <li key={item}>
                    <button
                      id={`footer-menu-link-${item}`}
                      onClick={() => scrollToSection(item)}
                      className="hover:text-white hover:underline capitalize transition-all text-left"
                    >
                      {item === "medicos" ? "médicos" : item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Widget 4: Newsletter */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-teal-400">Boletín Nutricional & Salud</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Suscríbete de forma gratuita para recibir boletines informativos clínicos y consejos preventivos creados por nuestros médicos.
              </p>
              <div className="flex gap-2 bg-blue-900 border border-blue-800 p-1 rounded-xl">
                <input
                  type="email"
                  placeholder="Tu correo"
                  id="newsletter-email-input"
                  className="bg-transparent text-xs px-3 py-2 w-full outline-none text-white placeholder-slate-400"
                />
                <button
                  id="newsletter-submit-btn"
                  onClick={() => alert("¡Suscrito con éxito a nuestro boletín informativo de salud!")}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg text-xs font-bold transition-all text-white shrink-0 cursor-pointer"
                >
                  Unirme
                </button>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
            <p id="copyright-text">
              &copy; {new Date().getFullYear()} Hospital Vida Sana. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white transition-colors">Términos de Diagnóstico</a>
              <a href="#" className="hover:text-white transition-colors">Políticas de Privacidad de Datos Pacientes</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
