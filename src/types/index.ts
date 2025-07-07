export type TreatmentStatus = "בהמתנה" | "בטיפול" | "סיום טיפול";
export type PaymentStatus = "שולם" | "בהמתנה" | "באיחור" | "פטור";
export type ReferralStatus = "בטיפול" | "בהמתנה" | "סגור" | "פעיל";


export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  idNumber: string;
  phone: string;
  email: string;
  treatmentStatus: TreatmentStatus;
  paymentStatus: PaymentStatus;
  startDate: string | null;
  endDate: string | null;
  therapistId: number | null;

  caseNumber: string;
  status: ReferralStatus;
  treatmentType: string;
  parentsInvolvement: string;
  isIdentified: boolean;
  waitingSince: string | null;
  waitingReason: string | null;
}

export interface Therapist {
  id: number;
  name: string;
  email: string;
}

export type UserRole = 'Admin' | 'Therapist' | 'Secretary' | 'Accountant';

export interface User {
  id: number;
  email: string;
  name: string; 
  role: UserRole;
  therapistId?: number;
  password?: string;
}

export interface PaymentClient {
  id: string;
  paymentYear: number;
  fullName: string;
  rank: number;
  newTariffDate: string;
  treatmentType: string;
  status: "פעיל" | "לא פעיל";
}

export interface Appointment {
    id: number;
    patientId: number;
    patientFirstName: string;
    patientLastName:string;
    date: string; // ISO string
    type: string;
}
