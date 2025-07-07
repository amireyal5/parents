import React, { FC, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHashRouter } from '../../hooks/useHashRouter';
import { AELogoIcon, LogoutIcon, UsersIcon, HomeIcon, SettingsIcon, CalendarIcon, WalletIcon, ChecklistIcon, SearchIcon, PlusIcon } from '../common/Icons';
import { PatientAvatar } from '../common/PatientAvatar';
import type { UserRole, Patient } from '../../types';
import { api } from '../../services/api';

const navLinks = [
    { path: '/dashboard', label: 'לוח מחוונים', icon: <HomeIcon /> },
    { path: '/patients', label: 'כל המטופלים', icon: <UsersIcon />, roles: ['Admin', 'Secretary', 'Accountant', 'Therapist'] },
    { path: '/schedule', label: 'יומן פגישות', icon: <CalendarIcon />, roles: ['Admin', 'Secretary', 'Therapist'] },
    { path: '/waiting-list', label: 'רשימת המתנה', icon: <ChecklistIcon />, roles: ['Admin', 'Secretary'] },
    { path: '/finance', label: 'כספים', icon: <WalletIcon />, roles: ['Admin', 'Accountant'] },
    { path: '/tasks', label: 'משימות', icon: <ChecklistIcon />, roles: ['Admin', 'Secretary', 'Therapist'] },
    { path: '/settings', label: 'הגדרות', icon: <SettingsIcon />, roles: ['Admin'] },
];

const getRoleName = (role: UserRole) => {
    const names = {
        Admin: 'מנהל מערכת',
        Therapist: 'מטפל מוסמך',
        Secretary: 'מזכירות',
        Accountant: 'הנהלת חשבונות'
    };
    return names[role] || role;
}

export const Sidebar: FC = () => {
    const { user, logout } = useAuth();
    const { path, navigate } = useHashRouter();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    useEffect(() => {
        const fetchPatients = async () => {
            if (user) {
                const patientData = await api.getPatients(user);
                setPatients(patientData);
            }
        };
        fetchPatients();
    }, [user]);
    
    if (!user) return null;

    const userRole = user.role;
    const rolePath = userRole.toLowerCase();

    const availableLinks = navLinks.filter(link => 
        !link.roles || link.roles.includes(userRole)
    );
    
    const filteredPatients = patients.filter(p => 
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                   <AELogoIcon />
                </div>
                <h1>
                    עמיר אייל טיפול
                    <span>והדרכת הורים</span>
                </h1>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-nav-section">
                    <div className="sidebar-nav-section-header">
                        <h2 className="sidebar-nav-section-title">ניווט ראשי</h2>
                    </div>
                     {availableLinks.map(link => {
                        const fullPath = `/${rolePath}${link.path}`;
                        const isActive = link.path === '/dashboard' ? path === fullPath : path.startsWith(fullPath);
                        return (
                            <a 
                                key={link.path} 
                                href={`#${fullPath}`}
                                className={isActive ? 'active' : ''}
                                onClick={(e) => { e.preventDefault(); navigate(fullPath); }}
                                title={link.label}
                            >
                                {link.icon} <span>{link.label}</span>
                            </a>
                        )
                    })}
                </div>
                
                <div className="sidebar-nav-section">
                     <div className="sidebar-nav-section-header">
                        <h2 className="sidebar-nav-section-title">מטופלים</h2>
                        <button className="btn"><PlusIcon/></button>
                    </div>
                    <div className="sidebar-patient-search">
                        <SearchIcon/>
                        <input 
                            type="text" 
                            placeholder="חיפוש מטופל..." 
                            className="input"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="sidebar-patient-list">
                        {filteredPatients.map(p => (
                            <a key={p.id} href={`#/${rolePath}/patient/${p.id}`} className="sidebar-patient-item" onClick={(e) => {e.preventDefault(); navigate(`/${rolePath}/patient/${p.id}`)}}>
                                <PatientAvatar name={`${p.firstName} ${p.lastName}`} size={32} />
                                <span className="patient-name">{`${p.firstName} ${p.lastName}`}</span>
                                {p.paymentStatus === 'באיחור' && <div className="notification-badge">!</div>}
                            </a>
                        ))}
                    </div>
                </div>
            </nav>

            <div className="user-profile">
                <PatientAvatar name={user.name} />
                <div className="user-info">
                    <span className="name">{user.name}</span>
                    <span className="role">{getRoleName(user.role)}</span>
                </div>
                <button onClick={logout} className="btn btn-logout" title="התנתקות">
                    <LogoutIcon />
                </button>
            </div>
        </aside>
    );
};