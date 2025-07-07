import React, { FC, useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import type { Patient, PaymentClient } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { FormField } from '../components/forms/FormField';
import { FormCard } from '../components/forms/FormCard';
import { ToggleSwitch } from '../components/forms/ToggleSwitch';
import { PaymentClientsTable } from '../components/billing/PaymentClientsTable';
import { FullScreenSpinner, LockIcon, PencilIcon, SearchIcon } from '../components/common/Icons';

interface PatientProfileScreenProps {
    patientId: string;
    navigate: (path: string) => void;
}

const ReferralDetails: FC<{ patient: Patient, paymentClients: PaymentClient[] }> = ({ patient, paymentClients }) => {
    const [isIdentified, setIsIdentified] = useState(patient.isIdentified);
    return (
        <>
            <FormCard header="פרטי המטופל">
                <div className="form-grid">
                    <FormField label="שם המטופל">
                        <span className="chip">
                            <PencilIcon />
                            {`${patient.firstName} ${patient.lastName}`}
                        </span>
                    </FormField>
                    <FormField label="סוג הטיפול">
                        <span className="form-field-value">{patient.treatmentType} <LockIcon /></span>
                    </FormField>
                    <div className="form-field-horizontal">
                        <label>בוצעה הזדהות?</label>
                        <ToggleSwitch checked={isIdentified} onChange={setIsIdentified} />
                    </div>
                </div>
            </FormCard>

            <div style={{ height: '1.5rem' }}></div>

            <FormCard header="חישוב זכאות והקמת לקוח משלם">
                <FormField label="הקמת לקוח משלם חדש לחץ כאן" className="form-grid">
                    <span className="chip">
                        <SearchIcon />
                        2025-1224L2D9
                    </span>
                </FormField>
                <div className="form-card-header no-border">הקמת לקוח משלם</div>
                <PaymentClientsTable clients={paymentClients} />
            </FormCard>
        </>
    )
}


export const PatientProfileScreen: FC<PatientProfileScreenProps> = ({ patientId, navigate }) => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [paymentClients, setPaymentClients] = useState<PaymentClient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('referral');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [patientData, paymentClientsData] = await Promise.all([
                api.getPatientById(patientId),
                api.getPaymentClientsByPatientId(patientId)
            ]);

            if (patientData) {
                setPatient(patientData);
            } else {
                console.error("Patient not found");
            }
            setPaymentClients(paymentClientsData);

        } catch (error) {
            console.error("Failed to fetch patient profile data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [patientId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) {
        return <FullScreenSpinner />;
    }

    if (!patient) {
        return <div className="main-content">מטופל לא נמצא.</div>;
    }

    const headerTags = [
        { label: 'מצב', value: patient.status },
        { label: 'שם המטופל', value: `${patient.firstName} ${patient.lastName}` },
        { label: 'מספר תיק', value: patient.caseNumber },
    ];

    const breadcrumbs = [
        { label: 'מטופלים', path: '/therapist/patients' },
        { label: 'תיק מטופל' }
    ];

    const tabs = [
        { id: 'referral', label: 'פרטי הפניה וטיפול' },
        { id: 'records', label: 'רשומות קליניות' },
        { id: 'billing', label: 'חיובים ותשלומים' },
        { id: 'documents', label: 'מסמכים' }
    ];

    return (
        <div className="patient-profile-screen">
            <PageHeader
                title={`${patient.firstName} ${patient.lastName}`}
                tags={headerTags}
                breadcrumbs={breadcrumbs}
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                navigate={navigate}
            />

            <div className="page-content">
                {activeTab === 'referral' && <ReferralDetails patient={patient} paymentClients={paymentClients} />}
                {activeTab === 'records' && <div className="card"><p>כאן יוצגו רשומות קליניות של המטופל.</p></div>}
                {activeTab === 'billing' && <div className="card"><p>כאן יוצגו כל החיובים והתשלומים של המטופל.</p></div>}
                {activeTab === 'documents' && <div className="card"><p>כאן יוצגו כל המסמכים המצורפים לתיק המטופל.</p></div>}
            </div>
        </div>
    );
};