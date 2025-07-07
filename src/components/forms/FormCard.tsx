import React, { FC, ReactNode } from 'react';

interface FormCardProps {
    header: string;
    children: ReactNode;
    className?: string;
}

export const FormCard: FC<FormCardProps> = ({ header, children, className }) => {
    return (
        <div className={`card form-card ${className || ''}`}>
            <h2 className="form-card-header">{header}</h2>
            <div className="form-card-content">
                {children}
            </div>
        </div>
    );
};
