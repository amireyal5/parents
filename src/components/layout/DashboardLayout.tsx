import React, { FC, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { PlusIcon } from '../common/Icons';

export const DashboardLayout: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
            <button className="floating-action-button" aria-label="הוספה">
                <PlusIcon />
            </button>
        </div>
    );
};
