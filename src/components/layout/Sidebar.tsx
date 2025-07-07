import React, { FC } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHashRouter } from '../../hooks/useHashRouter';
import { LogoutIcon, UsersIcon, DashboardIcon, SettingsIcon, FileTextIcon } from '../common/Icons';
import type { UserRole } from '../../types';

const navLinks = {
    main: [
        { path: '/dashboard', label: 'לוח מחוונים', icon: <DashboardIcon /> },
        { path: '/patients', label: 'כל המטופלים', icon: <UsersIcon />, roles: ['Admin', 'Secretary', 'Accountant'] },
        { path: '/my-patients', label: 'המטופלים שלי', icon: <UsersIcon />, roles: ['Therapist'] },
        { path: '/waiting-list', label: 'רשימת המתנה', icon: <FileTextIcon />, roles: ['Admin', 'Secretary'] },
        { path: '/settings', label: 'הגדרות', icon: <SettingsIcon />, roles: ['Admin'] },
    ]
};

const getRoleName = (role: UserRole) => {
    const names = {
        Admin: 'מנהל מערכת',
        Therapist: 'מטפל',
        Secretary: 'מזכירות',
        Accountant: 'הנהלת חשבונות'
    };
    return names[role] || role;
}

export const Sidebar: FC = () => {
    const { user, logout } = useAuth();
    const { path, navigate } = useHashRouter();
    
    if (!user) return null;

    const userRole = user.role;
    const rolePath = userRole.toLowerCase();

    const availableLinks = navLinks.main.filter(link => 
        !link.roles || link.roles.includes(userRole)
    );

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                   <span> VA </span>
                </div>
                <h1>
                    עמר אייל טיפול
                    <span>והדרכת הורים</span>
                </h1>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-nav-section">
                     {availableLinks.map(link => {
                        const fullPath = `/${rolePath}${link.path}`;
                        return (
                            <a 
                                key={link.path} 
                                href={`#${fullPath}`}
                                className={path.startsWith(fullPath) ? 'active' : ''}
                                onClick={(e) => { e.preventDefault(); navigate(fullPath); }}
                                title={link.label}
                            >
                                {link.icon} <span>{link.label}</span>
                            </a>
                        )
                    })}
                </div>
            </nav>

            <div className="user-profile">
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