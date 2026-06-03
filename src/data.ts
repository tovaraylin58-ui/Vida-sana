import { Doctor, Service, Testimonial, HospitalValue, FAQ } from "./types";

export const hospitalValues: HospitalValue[] = [
  {
    id: "compromiso",
    title: "Compromiso",
    description: "Dedicamos toda nuestra energía y recursos a velar por la salud y recuperación íntegra de cada uno de nuestros pacientes.",
    iconName: "HeartHandshake"
  },
  {
    id: "calidad",
    title: "Calidad",
    description: "Aplicamos rigurosos estándares médicos internacionales y procesos de mejora continua para garantizar una atención segura y eficaz.",
    iconName: "Award"
  },
  {
    id: "innovacion",
    title: "Innovación",
    description: "Incorporamos tecnología médica de vanguardia y actualizamos de manera permanente nuestros métodos de diagnóstico y tratamiento.",
    iconName: "Activity"
  },
  {
    id: "humanidad",
    title: "Humanidad",
    description: "Tratamos con empatía, calidez y máximo respeto a pacientes y familias, entendiendo la salud como un derecho fundamental.",
    iconName: "User"
  }
];

export const hospitalServices: Service[] = [
  {
    id: "general",
    title: "Medicina General",
    description: "Consulta integral primaria enfocada en prevención, diagnóstico temprano y derivación especializada oportuna.",
    iconName: "Stethoscope",
    details: [
      "Chequeos médicos preventivos mensuales",
      "Control y seguimiento de enfermedades crónicas",
      "Atención de patologías agudas no complejas",
      "Certificados médicos oficiales"
    ]
  },
  {
    id: "pediatria",
    title: "Pediatría",
    description: "Acompañamiento especializado en el sano crecimiento físico, emocional y cognitivo desde recién nacidos hasta adolescentes.",
    iconName: "Baby",
    details: [
      "Control de niño sano y vacunas",
      "Nutrición y desarrollo infantil",
      "Atención de emergencias pediátricas",
      "Monitoreo del crecimiento ponderal"
    ]
  },
  {
    id: "cardiologia",
    title: "Cardiología",
    description: "Evaluación cardíaca de última generación encaminada en la prevención de riesgos y recuperación de la salud cardiovascular.",
    iconName: "HeartPulse",
    details: [
      "Electrocardiogramas de alta resolución",
      "Prueba de esfuerzo física y química (Ergometría)",
      "Monitoreo Holter de arritmias y presión arterial",
      "Tratamiento de hipertensión arterial severa"
    ]
  },
  {
    id: "ginecologia",
    title: "Ginecología & Obstetricia",
    description: "Garantizamos el cuidado óptimo de la salud reproductiva de la mujer y un control prenatal seguro con la mayor empatía.",
    iconName: "Sparkles",
    details: [
      "Control integral del embarazo y parto humanizado",
      "Detección oportuna de cáncer ginecológico (Papanicolaou)",
      "Menopausia y climaterio saludable",
      "Planificación familiar y anticoncepción certificada"
    ]
  },
  {
    id: "laboratorio",
    title: "Laboratorio Clínico",
    description: "Análisis exactos procesados con equipos automatizados de última generación y entrega online ágil de resultados.",
    iconName: "FlaskConical",
    details: [
      "Exámenes de bioquímica hematológica completa",
      "Pruebas de perfil hormonal e inmunológicas",
      "Cultivos microbiológicos complejos",
      "Control de calidad clínico internacional"
    ]
  },
  {
    id: "emergencias",
    title: "Emergencias 24/7",
    description: "Unidad crítica operativa las 24 horas del día con médicos emergenciólogos listos para responder ante emergencias de vida.",
    iconName: "ShieldAlert",
    details: [
      "Triage médico automatizado de urgencias",
      "Terapia intensiva de respuesta rápida",
      "Flota de ambulancias equipadas de alta tecnología",
      "Unidad de trauma-shock de última generación"
    ]
  }
];

export const doctorsData: Doctor[] = [
  {
    id: "dr-ricardo-soto",
    name: "Dr. Ricardo Soto",
    specialty: "Medicina General",
    experience: "12 años de experiencia profesional",
    imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    availableDays: ["Lunes", "Martes", "Miércoles", "Jueves"],
    bio: "Especialista en medicina interna y cuidados generales de la familia, graduado con honores en la Escuela de Medicina Nacional."
  },
  {
    id: "dra-elena-mendez",
    name: "Dra. Elena Méndez",
    specialty: "Pediatría",
    experience: "10 años de experiencia profesional",
    imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80",
    availableDays: ["Lunes", "Miércoles", "Viernes"],
    bio: "Apasionada por la pediatría preventiva, el neurodesarrollo temprano y la estimulación oportuna en recién nacidos."
  },
  {
    id: "dr-juan-ruiz",
    name: "Dr. Juan Carlos Ruíz",
    specialty: "Cardiología",
    experience: "15 años de experiencia profesional",
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    availableDays: ["Martes", "Jueves", "Viernes"],
    bio: "Ex-presidente de la Sociedad de Electrofisiología, experto en intervencionismo cardiovascular no invasivo y cardiopatías."
  },
  {
    id: "dra-sofia-vergara",
    name: "Dra. Sofía Vergara",
    specialty: "Ginecología",
    experience: "8 años de experiencia profesional",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71f1e3c77e?auto=format&fit=crop&w=400&q=80",
    availableDays: ["Lunes", "Martes", "Jueves"],
    bio: "Dedicada enteramente al cuidado de la mujer, ginecología oncológica preventiva y fertilidad asistida."
  }
];

export const patientTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "María López",
    role: "Madre de familia",
    text: "La atención en pediatría con la Dra. Elena fue espectacular. Mi hijo se sintió tranquilo y seguro. Las instalaciones del hospital Vida Sana son impecables y el trato fue sumamente cálido.",
    rating: 5
  },
  {
    id: "test-2",
    name: "Carlos Ruiz",
    role: "Paciente recuperado",
    text: "Gracias a la rápida reacción del equipo de emergencias del hospital Vida Sana y a los cuidados oportunos en cardiología, hoy puedo disfrutar de mi vida con total salud. Eternamente agradecido.",
    rating: 5
  },
  {
    id: "test-3",
    name: "Andrea Espinoza",
    role: "Emprendedora",
    text: "Me realicé un chequeo general completo y todo fue súper rápido. Los resultados de laboratorio me llegaron directamente al correo el mismo día. Sumamente tecnológico y eficiente.",
    rating: 5
  }
];

export const faqsData: FAQ[] = [
  {
    id: "faq-1",
    question: "¿Cuál es el horario de atención para emergencias?",
    answer: "Nuestra unidad de emergencias está completamente operativa las 24 horas del día, los 365 días del año, contando de manera ininterrumpida con médicos especialistas calificados."
  },
  {
    id: "faq-2",
    question: "¿Cómo puedo reagendar o cancelar mi cita médica?",
    answer: "Puedes realizar modificaciones escribiendo a nuestro WhatsApp de atención (+1 800 123 456) o llamándonos directamente con al menos 12 horas de anticipación."
  },
  {
    id: "faq-3",
    question: "¿Con qué compañías de seguros médicos tienen convenios?",
    answer: "Convenimos activamente con las aseguradoras líderes nacionales e internacionales más importantes. Te recomendamos llamar previamente a nuestro número de contacto para validar el nivel de cobertura de tu plan específico."
  }
];
