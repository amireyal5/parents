import React, { FC, useState, useEffect, useMemo, useCallback } from 'react';
import type { Patient, Therapist, TreatmentStatus, PaymentStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { PatientTable } from '../components/patients/PatientTable';
import { SearchIcon, CalendarIcon, CreditCardIcon, UsersIcon } from '../components/common/Icons';

const treatmentStatuses: TreatmentStatus[] = ["בהמתנה", "בטיפול", "סיום טיפול"];
const paymentStatuses: PaymentStatus[] = ["שולם", "בהמתנה", "באיחור", "פטור"];

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


export const DashboardScreen: FC<{ isAdmin: boolean, navigate: (path: string) => void }> = ({ isAdmin, navigate }) => {
    const { user } = useAuth();
    const [allPatients, setAllPatients] = useState<Patient[]>([]);
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [treatmentFilter, setTreatmentFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('');
    
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    
    const [activeTab, setActiveTab] = useState('patients');

    const fetchAllData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [patientData, therapistData] = await Promise.all([
                api.getPatients(user),
                isAdmin ? api.getTherapists() : Promise.resolve([])
            ]);
            setAllPatients(patientData);
            setTherapists(therapistData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user, isAdmin]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const handleUpdateTherapist = async (patientId: number, therapistId: number | null) => {
        await api.updatePatientTherapist(patientId, therapistId);
        fetchAllData(); // Refetch to get the latest state
    };
    
    const handleRowClick = (patientId: number) => {
        const basePath = user?.role?.toLowerCase();
        navigate(`/${basePath}/billing/${patientId}`);
    };

    const filteredPatients = useMemo(() => {
        return allPatients
            .filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(p => treatmentFilter ? p.treatmentStatus === treatmentFilter : true)
            .filter(p => paymentFilter ? p.paymentStatus === paymentFilter : true);
    }, [allPatients, searchTerm, treatmentFilter, paymentFilter]);

    const paginatedPatients = useMemo(() => {
        const startIndex = (page - 1) * rowsPerPage;
        return filteredPatients.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredPatients, page, rowsPerPage]);

    const totalPages = Math.ceil(filteredPatients.length / rowsPerPage);

    const summaryData = useMemo(() => ({
        nextAppointment: "03/07/25",
        pendingPayments: allPatients.filter(p => p.paymentStatus === 'בהמתנה' || p.paymentStatus === 'באיחור').length,
        activePatients: allPatients.filter(p => p.treatmentStatus === 'בטיפול').length,
    }), [allPatients]);

    return (
        <div className="dashboard-container">
            <div className="summary-widgets">
                <SummaryWidget title="פגישה קרובה" value={summaryData.nextAppointment} subtitle="16:00, אצל עמית" icon={<CalendarIcon />} />
                <SummaryWidget title="תשלומים בהמתנה" value={summaryData.pendingPayments} subtitle="מתוך כלל המטופלים" icon={<CreditCardIcon />} />
                <SummaryWidget title="מטופלים פעילים" value={summaryData.activePatients} subtitle="בטיפול כרגע" icon={<UsersIcon />} />
            </div>

            <div className="dashboard-main-content card">
                 <div className="tabs-header">
                    <button 
                        className={`tab-button ${activeTab === 'patients' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('patients')}
                    >
                        רשימת מטופלים
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'history' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('history')}
                    >
                        היסטוריית פגישות
                    </button>
                 </div>

                 <div className="tab-content">
                    {activeTab === 'patients' && (
                        <>
                            <div className="table-controls">
                                <div className="filters-container">
                                    <div className="search-input-wrapper">
                                        <SearchIcon/>
                                        <input 
                                            type="text" 
                                            placeholder="חיפוש מטופל..." 
                                            className="input" 
                                            value={searchTerm}
                                            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                                        />
                                    </div>
                                    <div className="filter-group">
                                        <select className="select" value={treatmentFilter} onChange={e => { setTreatmentFilter(e.target.value); setPage(1); }}>
                                            <option value="">כל סטטוסי טיפול</option>
                                            {treatmentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <select className="select" value={paymentFilter} onChange={e => { setPaymentFilter(e.target.value); setPage(1); }}>
                                            <option value="">כל סטטוסי תשלום</option>
                                            {paymentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                 <button className="btn btn-secondary" onClick={() => {
                                    setSearchTerm(''); setTreatmentFilter(''); setPaymentFilter(''); setPage(1);
                                 }}>איפוס פילטרים</button>
                            </div>
                            <PatientTable 
                                patients={paginatedPatients}
                                therapists={therapists}
                                isAdmin={isAdmin}
                                onUpdateTherapist={isAdmin ? handleUpdateTherapist : async () => {}}
                                isLoading={isLoading}
                                onRowClick={handleRowClick}
                            />
                            <div className="pagination">
                                <span className="pagination-info">
                                    מציג {paginatedPatients.length} מתוך {filteredPatients.length}
                                </span>
                                {totalPages > 1 && (
                                    <div className="buttons">
                                        <button className="btn btn-secondary" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>הקודם</button>
                                        <span>עמוד {page} מתוך {totalPages}</span>
                                        <button className="btn btn-secondary" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>הבא</button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                    {activeTab === 'history' && <p>הצגת היסטוריית פגישות תהיה זמינה כאן.</p>}
                 </div>
            </div>
        </div>
    );
};