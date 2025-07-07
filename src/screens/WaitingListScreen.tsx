import React, { FC, useState, useEffect, useMemo, useCallback } from 'react';
import type { Patient } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { PatientTable } from '../components/patients/PatientTable';
import { UsersIcon, ClockIcon } from '../components/common/Icons';

const SummaryWidget: FC<{title: string, value: string | number, subtitle: string, icon: React.ReactNode}> = ({ title, value, subtitle, icon }) => (
    <div className="widget">
        <div className="widget-header">
            <span className="widget-title">{title}</span>
            <div className="widget-icon">{icon}</div>
        </div>
        <div className="widget-value">{value}</div>
        <div className="widget-subtitle">{subtitle}</div>
    </div>
);

const calculateAverageWaitTime = (patients: Patient[]): string => {
    if (patients.length === 0) return '0 ימים';

    const totalDays = patients.reduce((acc, patient) => {
        if (!patient.waitingSince) return acc;
        const waitDate = new Date(patient.waitingSince);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - waitDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return acc + diffDays;
    }, 0);

    const avgDays = Math.round(totalDays / patients.length);
    return `${avgDays} ימים`;
};


export const WaitingListScreen: FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const { user } = useAuth();
    const [allPatients, setAllPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const patientData = await api.getPatients(user);
            setAllPatients(patientData);
        } catch (error) {
            console.error("Failed to fetch patients:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const handleRowClick = (patientId: number) => {
        const basePath = user?.role?.toLowerCase();
        if (basePath) {
            navigate(`/${basePath}/patient/${patientId}`);
        }
    };

    const waitingPatients = useMemo(() => {
        return allPatients.filter(p => p.treatmentStatus === 'בהמתנה');
    }, [allPatients]);
    
    const waitingListReasons = useMemo(() => {
        const reasons = new Map<string, number>();
        waitingPatients.forEach(p => {
            const reason = p.waitingReason || 'לא צוין';
            reasons.set(reason, (reasons.get(reason) || 0) + 1);
        });
        return Array.from(reasons.entries()).map(([reason, count]) => ({ reason, count }));
    }, [waitingPatients]);

    const summaryData = useMemo(() => ({
        totalWaiting: waitingPatients.length,
        avgWaitTime: calculateAverageWaitTime(waitingPatients),
    }), [waitingPatients]);

    return (
        <div className="waiting-list-container">
            <h1 style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem'}}>רשימת המתנה</h1>
            
            <div className="summary-widgets">
                <SummaryWidget title="סה״כ ממתינים" value={summaryData.totalWaiting} subtitle="מטופלים ברשימה" icon={<UsersIcon />} />
                <SummaryWidget title="זמן המתנה ממוצע" value={summaryData.avgWaitTime} subtitle="לימים מאז פתיחת הפניה" icon={<ClockIcon />} />
                <div className="widget">
                     <div className="widget-header">
                        <span className="widget-title">סיבות המתנה</span>
                    </div>
                    {waitingListReasons.length > 0 ? (
                        waitingListReasons.map(item => (
                             <div key={item.reason} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                                <span>{item.reason}</span>
                                <strong style={{fontWeight: 600}}>{item.count}</strong>
                             </div>
                        ))
                    ) : <p className="text-secondary" style={{fontSize: '0.9rem'}}>אין נתונים</p>}
                </div>
            </div>

            <div className="card">
                <div className="table-wrapper">
                    <table className="patient-table">
                        <thead>
                            <tr>
                                <th>שם מלא</th>
                                <th>טלפון</th>
                                <th>ממתין מתאריך</th>
                                <th>סיבת המתנה</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr className="loading-row">
                                    <td colSpan={4}><div className="spinner"></div></td>
                                </tr>
                            ) : waitingPatients.length === 0 ? (
                                <tr className="loading-row">
                                    <td colSpan={4}>אין מטופלים ברשימת ההמתנה</td>
                                </tr>
                            ) : (
                                waitingPatients.map(patient => (
                                    <tr key={patient.id} onClick={() => handleRowClick(patient.id)}>
                                        <td>{`${patient.firstName} ${patient.lastName}`}</td>
                                        <td>{patient.phone}</td>
                                        <td>{patient.waitingSince ? new Date(patient.waitingSince).toLocaleDateString('he-IL') : 'לא זמין'}</td>
                                        <td>{patient.waitingReason || 'לא צוין'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};