/**
 * Types & Interfaces for Hospital Vida Sana
 */

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  imageUrl: string;
  availableDays: string[];
  bio: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon name matching
  details: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export interface HospitalValue {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}
