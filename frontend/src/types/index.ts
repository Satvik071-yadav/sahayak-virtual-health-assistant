export interface UserOut {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  role: "patient" | "doctor" | "admin";
  preferred_language: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user: UserOut;
}

export interface ChatMessage {
  id: number;
  sender: "user" | "bot";
  content: string;
  language: string;
  created_at: string;
}

export interface ChatResponse {
  reply: string;
  escalate_to_emergency: boolean;
  history: ChatMessage[];
}

export interface Doctor {
  id: number;
  full_name: string;
  specialization: string;
  hospital_name?: string | null;
  phone?: string | null;
  email?: string | null;
  years_experience: number;
  rating: number;
  available: boolean;
  consultation_fee: number;
  bio?: string | null;
}

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  scheduled_at: string;
  reason?: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
}

export interface HealthArticle {
  id: number;
  title: string;
  category: string;
  content: string;
  summary?: string | null;
  image_url?: string | null;
  language: string;
  created_at: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  language: string;
}

export interface EmergencyContact {
  id: number;
  label: string;
  phone_number: string;
  region: string;
  description?: string | null;
}

export interface MedicineReminder {
  id: number;
  user_id: number;
  medicine_name: string;
  dosage?: string | null;
  time_of_day: string;
  notes?: string | null;
  active: boolean;
  created_at: string;
}

export interface Analytics {
  total_users: number;
  total_doctors: number;
  total_appointments: number;
  total_chat_messages: number;
  appointments_by_status: Record<string, number>;
}
