import React, { FC, useState } from 'react';
import { UserSettings } from '../components/settings/UserSettings';
import { EmployeeManagement } from '../components/settings/EmployeeManagement';

type ActiveTab = 'user' | 'employees';

export const SettingsScreen: FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('employees');

    return (
        <div className="settings-screen">
            <h1 style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem'}}>הגדרות מערכת</h1>
            
            <div className="card">
                <div className="settings-tabs">
                     <button 
                        className={`tab-button ${activeTab === 'user' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('user')}
                    >
                        הגדרות משתמש
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'employees' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('employees')}
                    >
                        ניהול עובדים
                    </button>
                </div>
                <div className="settings-tab-content">
                    {activeTab === 'user' && <UserSettings />}
                    {activeTab === 'employees' && <EmployeeManagement />}
                </div>
            </div>
        </div>
    );
};