import React, { FC } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FormField } from '../forms/FormField';
import type { UserRole } from '../../types';

const getRoleName = (role: UserRole) => {
    const names = {
        Admin: 'מנהל מערכת',
        Therapist: 'מטפל',
        Secretary: 'מזכירות',
        Accountant: 'הנהלת חשבונות'
    };
    return names[role] || role;
}

export const UserSettings: FC = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div>
            <h3 style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem'}}>הפרטים שלי</h3>
            <div className="form-grid single-column">
                <FormField label="שם מלא" value={user.name} />
                <FormField label="כתובת אימייל" value={user.email} />
                <FormField label="תפקיד במערכת" value={getRoleName(user.role)} />
            </div>
        </div>
    );
};