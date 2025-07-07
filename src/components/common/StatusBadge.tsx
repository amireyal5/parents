import React, { FC } from 'react';
import type { PaymentStatus, TreatmentStatus } from '../../types';
import { CheckCircleIcon, XCircleIcon, ClockIcon, MinusCircleIcon } from './Icons';

interface StatusBadgeProps {
    status: PaymentStatus | TreatmentStatus;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => {
    const statusConfig = {
        'שולם': { className: 'paid', icon: <CheckCircleIcon /> },
        'בטיפול': { className: 'in-treatment', icon: <CheckCircleIcon /> },
        'בהמתנה': { className: 'pending', icon: <ClockIcon /> }, // for payment
        'באיחור': { className: 'overdue', icon: <XCircleIcon /> },
        'פטור': { className: 'exempt', icon: <MinusCircleIcon /> },
        'סיום טיפול': { className: 'completed', icon: <MinusCircleIcon /> },
    };

    // Special case for 'בהמתנה' to differentiate treatment from payment
    const isTreatmentWaiting = status === 'בהמתנה' && ["בהמתנה", "בטיפול", "סיום טיפול"].includes(status);
    const finalKey = isTreatmentWaiting ? 'waiting' : status;
    
    const config = statusConfig[finalKey as keyof typeof statusConfig] || { className: 'pending', icon: <ClockIcon /> };
     if (isTreatmentWaiting) {
        config.className = 'waiting';
    }

    return (
        <span className={`status-badge ${config.className}`}>
            {config.icon}
            {status}
        </span>
    );
};
