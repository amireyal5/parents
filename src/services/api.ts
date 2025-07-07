import type { Patient, Therapist, User, PaymentClient, UserRole } from '../types';

const mockTherapists: Therapist[] = [
  { id: 1, name: 'עמית אייל', email: 'amit@clinic.com' },
  { id: 2, name: 'ד"ר משה כהן', email: 'moshe@clinic.com' },
  { id: 3, name: 'גב\' אביגיל לוי', email: 'avigail@clinic.com' },
];

let mockPatients: Patient[] = [
  { 
    id: 1, firstName: 'אברהם', lastName: 'יוסף', idNumber: '123456789', phone: '050-1234567', email: 'avi@email.com', 
    treatmentStatus: 'בטיפול', paymentStatus: 'שולם', startDate: '2023-01-15', endDate: null, therapistId: 1,
    caseNumber: '0121', status: 'פעיל', treatmentType: 'הדרכת הורים', parentsInvolvement: 'השתתפות עצמית טיפול', isIdentified: true,
    waitingSince: null, waitingReason: null,
  },
  { 
    id: 2, firstName: 'שרה', lastName: 'כהן', idNumber: '234567890', phone: '052-2345678', email: 'sara.c@email.com', 
    treatmentStatus: 'בטיפול', paymentStatus: 'בהמתנה', startDate: '2023-02-20', endDate: null, therapistId: 1,
    caseNumber: '0122', status: 'בטיפול', treatmentType: 'טיפול זוגי', parentsInvolvement: 'השתתפות עצמית אבחון', isIdentified: false,
    waitingSince: null, waitingReason: null,
  },
  { 
    id: 3, firstName: 'משה', lastName: 'לוי', idNumber: '345678901', phone: '053-3456789', email: 'moshe.l@email.com', 
    treatmentStatus: 'בהמתנה', paymentStatus: 'פטור', startDate: null, endDate: null, therapistId: 2,
    caseNumber: '0123', status: 'בהמתנה', treatmentType: 'טיפול פרטני', parentsInvolvement: 'ללא', isIdentified: true,
    waitingSince: '2024-05-10', waitingReason: 'אין מטפל זמין',
  },
  { 
    id: 4, firstName: 'רבקה', lastName: 'ישראל', idNumber: '456789012', phone: '054-4567890', email: 'rivka@email.com', 
    treatmentStatus: 'סיום טיפול', paymentStatus: 'שולם', startDate: '2022-11-01', endDate: '2023-11-01', therapistId: 3,
    caseNumber: '0124', status: 'סגור', treatmentType: 'הדרכת הורים', parentsInvolvement: 'השתתפות עצמית טיפול', isIdentified: true,
    waitingSince: null, waitingReason: null,
  },
   { 
    id: 5, firstName: 'דניאל', lastName: 'ביטון', idNumber: '567890123', phone: '058-1234567', email: 'daniel@email.com', 
    treatmentStatus: 'בהמתנה', paymentStatus: 'פטור', startDate: null, endDate: null, therapistId: null,
    caseNumber: '0125', status: 'בהמתנה', treatmentType: 'טיפול משפחתי', parentsInvolvement: 'ללא', isIdentified: false,
    waitingSince: '2024-06-22', waitingReason: 'בדיקת זכאות',
  },
];

let mockUsers: User[] = [
    { id: 101, email: 'admin@clinic.com', name: 'מנהל ראשי', role: 'Admin' },
    { id: 102, email: 'secretary@clinic.com', name: 'מזכירה ראשית', role: 'Secretary' },
    { id: 103, email: 'accountant@clinic.com', name: 'רואה חשבון', role: 'Accountant' },
    { id: 1, email: 'amit@clinic.com', name: 'עמית אייל', role: 'Therapist', therapistId: 1 },
    { id: 2, email: 'moshe@clinic.com', name: 'ד"ר משה כהן', role: 'Therapist', therapistId: 2 },
    { id: 3, email: 'avigail@clinic.com', name: 'גב\' אביגיל לוי', role: 'Therapist', therapistId: 3 },
];

const mockPaymentClients: PaymentClient[] = [
    { id: '2025-1224L2D9', paymentYear: 2025, fullName: 'בלוך, מור', rank: 1, newTariffDate: '53.00', treatmentType: 'מרכז לטיפול במשפחה', status: 'פעיל' }
];

// MOCK API
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
    async login(email: string, pass: string): Promise<User> {
        await delay(500);
        const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user && pass === 'password') { // Simplified password check
            return user;
        }
        throw new Error('אימייל או סיסמה שגויים');
    },

    async getUsers(): Promise<User[]> {
        await delay(600);
        return mockUsers;
    },
    
    async addUser(user: Omit<User, 'id'>): Promise<User> {
        await delay(400);
        const newUser: User = { ...user, id: Date.now() };
        mockUsers.push(newUser);
        return newUser;
    },

    async updateUser(updatedUser: User): Promise<User> {
        await delay(400);
        const userIndex = mockUsers.findIndex(u => u.id === updatedUser.id);
        if (userIndex > -1) {
            mockUsers[userIndex] = { ...mockUsers[userIndex], ...updatedUser };
            return mockUsers[userIndex];
        }
        throw new Error('User not found');
    },

    async getPatients(user: User | null): Promise<Patient[]> {
        await delay(800);
        if (!user) return [];
        if (user.role === 'Admin' || user.role === 'Secretary' || user.role === 'Accountant') {
            return mockPatients;
        }
        if (user.role === 'Therapist') {
            return mockPatients.filter(p => p.therapistId === user.therapistId);
        }
        return [];
    },
    
    async getPatientById(patientId: string): Promise<Patient | undefined> {
        await delay(300);
        return mockPatients.find(p => p.id === parseInt(patientId));
    },

    async getTherapists(): Promise<Therapist[]> {
        await delay(200);
        return mockTherapists;
    },

    async updatePatientTherapist(patientId: number, therapistId: number | null): Promise<Patient> {
        await delay(400);
        const patientIndex = mockPatients.findIndex(p => p.id === patientId);
        if (patientIndex !== -1) {
            mockPatients[patientIndex].therapistId = therapistId;
            return mockPatients[patientIndex];
        }
        throw new Error('Patient not found');
    },
    
    async getPaymentClientsByPatientId(patientId: string): Promise<PaymentClient[]> {
        await delay(600);
        // In a real app, you'd filter by patientId. Here we return the same mock data for any patient.
        return mockPaymentClients;
    }
};