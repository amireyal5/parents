import React, { FC, ReactNode } from 'react';
import type { Patient } from '../../types';

interface FormFieldProps {
    label: string;
    children?: ReactNode;
    value?: string | number | null;
    className?: string;
}

export const FormField: FC<FormFieldProps> = ({ label, children, value, className }) => {
    return (
        <div className={`form-field ${className || ''}`}>
            <label>{label}</label>
            {children ? <div className="form-field-value">{children}</div> : <span>{value || '--'}</span>}
        </div>
    );
};
