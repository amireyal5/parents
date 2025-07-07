import React, { FC, useState, useEffect, useCallback } from 'react';
import type { Patient, Therapist } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { PatientTable } from '../components/patients/PatientTable';
import { PageHeader } from '../components/layout/PageHeader';
import { PlusIcon } from '../components/common/Icons';

export const PatientsScreen: FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const { user } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [patientData, therapistData] = await Promise.all([
                api.getPatients(user),
                api.getTherapists()
            ]);
            setPatients(patientData);
            setTherapists(therapistData);
        } catch (error) {
            console.error("Failed to fetch patients data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const handleUpdateTherapist = async (patientId: number, therapistId: number | null) => {
        await api.updatePatientTherapist(patientId, therapistId);
        // Refetch or update state locally
        fetchData();
    };

    const handleRowClick = (patientId: number) => {
        if (!user) return;
        navigate(`/${user.role.toLowerCase()}/patient/${patientId}`);
    };

    const breadcrumbs = [
        { label: 'לוח מחוונים', path: `/${user?.role.toLowerCase()}/dashboard` },
        { label: 'כל המטופלים' }
    ];
    
    return (
        <div className="patients-screen">
            <PageHeader 
                title="ניהול מטופלים"
                tags={[]}
                breadcrumbs={breadcrumbs}
                navigate={navigate}
                actions={
                    <button className="btn btn-primary">
                        <PlusIcon />
                        הוסף מטופל
                    </button>
                }
            />

            <div className="card">
                <PatientTable 
                    patients={patients}
                    therapists={therapists}
                    isAdmin={user?.role === 'Admin'}
                    onUpdateTherapist={handleUpdateTherapist}
                    isLoading={isLoading}
                    onRowClick={handleRowClick}
                />
            </div>
        </div>
    );
};