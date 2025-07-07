import React, { FC, useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import type { User, UserRole } from '../../types';
import { PlusIcon, PencilIcon, TrashIcon } from '../common/Icons';
import { AddEditEmployeeModal } from './AddEditEmployeeModal';

const getRoleName = (role: UserRole) => {
    const names = {
        Admin: 'מנהל מערכת',
        Therapist: 'מטפל',
        Secretary: 'מזכירות',
        Accountant: 'הנהלת חשבונות'
    };
    return names[role] || role;
}

export const EmployeeManagement: FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const usersData = await api.getUsers();
            setUsers(usersData);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenModal = (user: User | null = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };
    
    const handleSave = async () => {
        await fetchUsers();
        handleCloseModal();
    }

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                <h3 style={{fontSize: '1.1rem', fontWeight: 600}}>רשימת עובדים</h3>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <PlusIcon />
                    הוסף עובד חדש
                </button>
            </div>
            
            <div className="table-wrapper">
                <table className="patient-table">
                    <thead>
                        <tr>
                            <th>שם מלא</th>
                            <th>אימייל</th>
                            <th>תפקיד</th>
                            <th>פעולות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr className="loading-row">
                                <td colSpan={4}><div className="spinner"></div></td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr className="loading-row">
                                <td colSpan={4}>לא נמצאו עובדים</td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{getRoleName(user.role)}</td>
                                    <td>
                                        <div className="employee-table-actions">
                                            <button className="btn btn-secondary" onClick={() => handleOpenModal(user)} title="עריכה">
                                                <PencilIcon />
                                            </button>
                                            <button className="btn btn-secondary" disabled title="מחיקה">
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <AddEditEmployeeModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                userToEdit={editingUser}
            />
        </div>
    );
};