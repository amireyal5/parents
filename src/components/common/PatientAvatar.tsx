import React, { FC } from 'react';

const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length > 1 && parts[parts.length - 1]) {
        return `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase();
    }
    return (name.substring(0, 2) || '').toUpperCase();
}

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6'];

const getColor = (name: string) => {
    if (!name) return COLORS[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % COLORS.length);
    return COLORS[index];
}

interface PatientAvatarProps {
    name: string;
    size?: number;
}

export const PatientAvatar: FC<PatientAvatarProps> = ({ name, size = 40 }) => {
    const initials = getInitials(name);
    const color = getColor(name);

    return (
        <div 
            className="patient-avatar" 
            style={{ 
                width: size, 
                height: size, 
                backgroundColor: color,
                fontSize: size / 2.5
            }}
        >
            {initials}
        </div>
    );
};
