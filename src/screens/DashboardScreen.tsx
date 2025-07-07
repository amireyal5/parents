import React, { FC, useState, useEffect, useMemo, useCallback } from 'react';
import type { Patient, Appointment } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UsersIcon, CalendarIcon, WalletIcon, AlertTriangleIcon, UserPlusIcon, CalendarPlusIcon, ChecklistPlusIcon, EyeIcon } from '../components/common/Icons';
import { PatientAvatar } from '../components/common/PatientAvatar';

// --- Dashboard Components ---

const SummaryWidget: FC<{title: string, value: string | number, icon: React.ReactNode, iconClass: string}> = ({ title, value, icon, iconClass }) => (
    <div className="widget">
        <div className={`widget-icon ${iconClass}`}>{icon}</div>
        <div className="widget-info">
            <div className="widget-value">{value}</div>
            <div className="widget-title">{title}</div>
        </div>
    </div>
);

const UpcomingAppointments: FC<{appointments: Appointment[]}> = ({ appointments }) => (
    <div className="card upcoming-appointments-card">
        <div className="card-header">
            <h3>פגישות קרובות</h3>
            <a href="#/therapist/schedule">הצג הכל</a>
        </div>
        <div className="appointment-list">
            {appointments.length > 0 ? appointments.map(app => {
                const appDate = new Date(app.date);
                const day = appDate.toLocaleDateString('he-IL', { weekday: 'long' });
                const dateNum = appDate.getDate();
                const time = appDate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
                const patientName = `${app.patientFirstName} ${app.patientLastName}`;
                
                return (
                    <div key={app.id} className="appointment-list-item">
                        <div className="appointment-date">
                            <span className="day">{day.replace('יום ', '')}</span>
                            <span className="date-num">{dateNum}</span>
                        </div>
                        <div className="appointment-details">
                            <div className="appointment-patient">
                                <PatientAvatar name={patientName} size={40} />
                                <div>
                                    <div className="name">{patientName}</div>
                                    <div className="type">{app.type}</div>
                                </div>
                            </div>
                            <div className="appointment-time">{time}</div>
                        </div>
                    </div>
                );
            }) : <p>אין פגישות קרובות.</p>}
        </div>
    </div>
);

const QuickActions: FC = () => (
    <div className="card quick-actions-card">
        <div className="card-header">
            <h3>פעולות מהירות</h3>
        </div>
        <div className="action-buttons">
            <button className="btn"><UserPlusIcon /> הוסף מטופל</button>
            <button className="btn"><CalendarPlusIcon /> קבע פגישה</button>
            <button className="btn"><ChecklistPlusIcon /> הוסף משימה</button>
        </div>
    </div>
);

const CalendarTeaser: FC = () => (
     <div className="card calendar-teaser-card">
        <div className="card-header">
            <h3>מעבר ליומן המלא</h3>
        </div>
        <ul>
            <li><EyeIcon /> פגישות להיום</li>
            <li><EyeIcon /> פגישות השבוע</li>
            <li><EyeIcon /> כל הפגישות</li>
        </ul>
    </div>
)

const PendingPayments: FC<{patients: Patient[]}> = ({ patients }) => {
    const pending = patients.filter(p => p.paymentStatus === 'באיחור' || p.paymentStatus === 'בהמתנה');
    if (pending.length === 0) return null;

    return (
        <div className="card pending-payments-card">
            <div className="card-header">
                <div className="icon"><AlertTriangleIcon /></div>
                <div className="header-text">
                    <h3>תשלומים ממתינים</h3>
                    <p>נמצאו {pending.length} פגישות שעבר זמנן ולא שולמו</p>
                </div>
            </div>
            <div className="pending-payments-list">
                {pending.slice(0, 2).map(p => (
                     <div key={p.id} className="pending-payment-item">
                        <div>
                            <div className="name">{`${p.firstName} ${p.lastName}`}</div>
                            <div className="details">פגישה מ- {new Date(p.startDate!).toLocaleDateString('he-IL')}</div>
                        </div>
                        <a href="#/" className="btn-link">צפה בתיק</a>
                    </div>
                ))}
            </div>
        </div>
    )
}

// --- Main Dashboard Screen ---

export const DashboardScreen: FC<{ isAdmin: boolean, navigate: (path: string) => void }> = ({ isAdmin, navigate }) => {
    const { user } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const [patientData, appointmentData] = await Promise.all([
                api.getPatients(user),
                api.getUpcomingAppointments(),
            ]);
            setPatients(patientData);
            setAppointments(appointmentData);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const summaryData = useMemo(() => ({
        activePatients: patients.filter(p => p.treatmentStatus === 'בטיפול').length,
        appointmentsToday: 0, // Placeholder
        monthlyIncome: '0', // Placeholder
    }), [patients]);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>לוח מחוונים</h1>
                <p>סקירה כללית ופעולות מהירות לניהול הקליניקה שלך.</p>
            </header>
            
            <div className="summary-widgets">
                <SummaryWidget title="מטופלים פעילים" value={summaryData.activePatients} icon={<UsersIcon />} iconClass="purple" />
                <SummaryWidget title="פגישות היום" value={summaryData.appointmentsToday} icon={<CalendarIcon />} iconClass="teal"/>
                <SummaryWidget title="הכנסה חודשית" value={`₪${summaryData.monthlyIncome}`} icon={<WalletIcon />} iconClass="green" />
            </div>

            <div className="dashboard-grid">
                <UpcomingAppointments appointments={appointments} />

                <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                    <QuickActions />
                    <CalendarTeaser />
                    <PendingPayments patients={patients} />
                </div>
            </div>
        </div>
    );
};