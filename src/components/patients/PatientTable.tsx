import React, { FC, useState } from 'react';
import type { Patient, Therapist } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface PatientTableProps {
    patients: Patient[];
    therapists: Therapist[];
    isAdmin: boolean;
    onUpdateTherapist: (patientId: number, therapistId: number | null) => Promise<void>;
    isLoading: boolean;
    onRowClick: (patientId: number) => void;
}

export const PatientTable: FC<PatientTableProps> = ({ patients, therapists, isAdmin, onUpdateTherapist, isLoading, onRowClick }) => {
    const [updatingPatientId, setUpdatingPatientId] = useState<number|null>(null);

    const handleTherapistChange = async (patientId: number, e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTherapistId = e.target.value ? Number(e.target.value) : null;
        setUpdatingPatientId(patientId);
        try {
            await onUpdateTherapist(patientId, newTherapistId);
        } catch (error) {
            console.error("Failed to update therapist", error);
        } finally {
            setUpdatingPatientId(null);
        }
    };
    
    const handleRowClick = (e: React.MouseEvent, patientId: number) => {
        // Prevent navigation when clicking on the select dropdown
        if ((e.target as HTMLElement).tagName.toLowerCase() === 'select') {
            return;
        }
        onRowClick(patientId);
    }

    return (
        <div className="table-wrapper">
            <table className="patient-table">
                <thead>
                    <tr>
                        <th>שם מלא</th>
                        <th>טלפון</th>
                        <th>סטטוס טיפול</th>
                        <th>סטטוס תשלום</th>
                        <th>תאריך התחלה</th>
                        {isAdmin && <th>מטפל/ת</th>}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr className="loading-row">
                            <td colSpan={isAdmin ? 6 : 5}><div className="spinner"></div></td>
                        </tr>
                    ) : patients.length === 0 ? (
                        <tr className="loading-row">
                            <td colSpan={isAdmin ? 6 : 5}>לא נמצאו מטופלים</td>
                        </tr>
                    ) : (
                        patients.map(patient => (
                            <tr key={patient.id} onClick={(e) => handleRowClick(e, patient.id)}>
                                <td>{`${patient.firstName} ${patient.lastName}`}</td>
                                <td>{patient.phone}</td>
                                <td><StatusBadge status={patient.treatmentStatus} /></td>
                                <td><StatusBadge status={patient.paymentStatus} /></td>
                                <td>{patient.startDate || 'טרם נקבע'}</td>
                                {isAdmin && (
                                    <td>
                                        {updatingPatientId === patient.id ? <div className="spinner" style={{width: 20, height: 20, borderWidth: 2}}></div> : (
                                            <select
                                                className="select"
                                                value={patient.therapistId || ''}
                                                onChange={(e) => handleTherapistChange(patient.id, e)}
                                            >
                                                <option value="">לא משובץ</option>
                                                {therapists.map(t => (
                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};