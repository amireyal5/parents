import React, { FC, useState, useEffect, FormEvent } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import type { User, UserRole } from '../../types';

interface AddEditEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    userToEdit: User | null;
}

const ALL_ROLES: UserRole[] = ['Admin', 'Therapist', 'Secretary', 'Accountant'];

export const AddEditEmployeeModal: FC<AddEditEmployeeModalProps> = ({ isOpen, onClose, onSave, userToEdit }) => {
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Therapist' as UserRole, password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                name: userToEdit.name,
                email: userToEdit.email,
                role: userToEdit.role,
                password: '' // Don't pre-fill password
            });
        } else {
            setFormData({ name: '', email: '', role: 'Therapist', password: '' });
        }
        setError('');
    }, [userToEdit, isOpen]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            if (userToEdit) {
                const payload: User = { ...userToEdit, ...formData };
                // Only include password if it was changed
                if (!formData.password) {
                    delete payload.password;
                }
                await api.updateUser(payload);
            } else {
                if (!formData.password) {
                    setError('יש להזין סיסמה עבור משתמש חדש');
                    setIsLoading(false);
                    return;
                }
                await api.addUser(formData);
            }
            onSave();
        } catch (err: any) {
            setError(err.message || 'שגיאה בעת שמירת הנתונים');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={userToEdit ? 'עריכת עובד' : 'הוספת עובד חדש'}
        >
            <form onSubmit={handleSubmit}>
                <div className="form-grid single-column">
                    <div className="form-field">
                        <label htmlFor="name">שם מלא</label>
                        <input id="name" name="name" type="text" className="input" value={formData.name} onChange={handleChange} required />
                    </div>
                     <div className="form-field">
                        <label htmlFor="email">כתובת אימייל</label>
                        <input id="email" name="email" type="email" className="input" value={formData.email} onChange={handleChange} required />
                    </div>
                     <div className="form-field">
                        <label htmlFor="role">תפקיד</label>
                        <select id="role" name="role" className="select" value={formData.role} onChange={handleChange} required>
                            {ALL_ROLES.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                     <div className="form-field">
                        <label htmlFor="password">סיסמה</label>
                        <input id="password" name="password" type="password" className="input" value={formData.password} onChange={handleChange} placeholder={userToEdit ? 'השאר ריק כדי לא לשנות' : ''} />
                    </div>
                </div>
                {error && <p className="error-message" style={{textAlign: 'right'}}>{error}</p>}
                <div className="modal-footer">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? <div className="spinner" style={{width: 20, height: 20, borderWidth: 2}}></div> : 'שמירה'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>ביטול</button>
                </div>
            </form>
        </Modal>
    );
};