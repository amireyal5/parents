import React, { FC, useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import type { Patient, PaymentClient } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { FormField } from '../components/forms/FormField';
import { FormCard } from '../components/forms/FormCard';
import { ToggleSwitch } from '../components/forms/ToggleSwitch';
import { PaymentClientsTable } from '../components/billing/PaymentClientsTable';
import { FullScreenSpinner, LockIcon, PencilIcon, SearchIcon } from '../components/common/Icons';

interface BillingScreenProps {
    patientId: string;
    navigate: (path: string) => void;
}

export const BillingScreen: FC<BillingScreenProps> = ({ patientId, navigate }) => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [paymentClients, setPaymentClients] = useState<PaymentClient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isIdentified, setIsIdentified] = useState(false);
    
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [patientData, paymentClientsData] = await Promise.all([
                api.getPatientById(patientId),
                api.getPaymentClientsByPatientId(patientId)
            ]);
            
            if (patientData) {
                setPatient(patientData);
                setIsIdentified(patientData.isIdentified);
            } else {
                 console.error("Patient not found");
                 // Optional: navigate to a 404 page
            }
            setPaymentClients(paymentClientsData);

        } catch (error) {
            console.error("Failed to fetch billing data:", error);
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
        { label: 'מספר פניה', value: patient.caseNumber },
    ];

    const breadcrumbs = [
        { label: 'מרכז למשפחה', path: '/admin/dashboard' },
        { label: 'טופס להחייבויות' }
    ];
    
    const tabs = [
        { id: 'referral', label: 'פרטי ההפניה והטיפול' },
        { id: 'link', label: 'קישור' }
    ];

    return (
        <div className="billing-screen">
            <PageHeader 
                title={patient.caseNumber}
                tags={headerTags}
                breadcrumbs={breadcrumbs}
                tabs={tabs}
                activeTab="referral"
                navigate={navigate}
            />
            
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
            
            <div style={{height: '1.5rem'}}></div>

            <FormCard header="חישוב זכאות והקמת לקוח משלם">
                 <FormField label="הקמת לקוח משלם חדש לחץ כאן" className="form-grid">
                     <span className="chip">
                        <SearchIcon/>
                        2025-1224L2D9
                     </span>
                 </FormField>
                 <div className="form-card-header no-border">הקמת לקוח משלם</div>
                 <PaymentClientsTable clients={paymentClients} />
            </FormCard>

        </div>
    );
};
