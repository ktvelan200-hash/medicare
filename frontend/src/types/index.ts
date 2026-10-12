export type Role = 'ROLE_PATIENT' | 'ROLE_DOCTOR' | 'ROLE_ADMIN';
export type DoctorStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  enabled: boolean;
  createdAt: string;
}

export interface PatientProfile {
  id: number;
  user: User;
  gender?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
}

export interface Doctor {
  id: number;
  user: User;
  specialization: string;
  qualification: string;
  experienceYears?: number;
  consultationFee?: number;
  bio?: string;
  status: DoctorStatus;
  rejectionReason?: string;
  approvedAt?: string;
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
}

export interface DoctorAvailability {
  id?: number;
  doctorId?: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  maxPatients?: number;
  slotDurationMinutes?: number;
}

export interface Appointment {
  id: number;
  patient: PatientProfile;
  doctor: Doctor;
  appointmentDate: string;
  timeSlot: string;
  status: AppointmentStatus;
  reason?: string;
  consultationNotes?: string;
  hasReview?: boolean;
  reviewRating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  appointmentId: number;
  doctorId: number;
  doctorName: string;
  patientId: number;
  patientName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface DoctorRatingSummary {
  doctorId: number;
  doctorName: string;
  averageRating: number;
  totalReviews: number;
  starCounts: Record<number, number>;
}

export interface Prescription {
  id: number;
  appointmentId: number;
  doctor: Doctor;
  patient: PatientProfile;
  diagnosis: string;
  medicines: string;
  instructions?: string;
  issuedDate: string;
  createdAt: string;
}

export interface MedicalRecord {
  id: number;
  patient: PatientProfile;
  doctor?: Doctor;
  title: string;
  recordType: string;
  fileUrl?: string;
  notes?: string;
  recordDate: string;
  createdAt: string;
}

export interface NotificationItem {
  id: number;
  userId: number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalPatients: number;
  totalDoctors: number;
  pendingDoctorApprovals: number;
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  cancelledAppointments: number;
}

export interface JwtAuthResponse {
  accessToken: string;
  tokenType: string;
  id: number;
  email: string;
  fullName: string;
  role: Role;
  roleSpecificId?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
