import React, { useState, useEffect, useContext, createContext, useReducer, useCallback, useMemo, FC, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { useHashRouter } from './src/hooks/useHashRouter';

import { LoginScreen } from './src/screens/LoginScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { BillingScreen } from './src/screens/BillingScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { WaitingListScreen } from './src/screens/WaitingListScreen';

import { DashboardLayout } from './src/components/layout/DashboardLayout';
import { FullScreenSpinner } from './src/components/common/Icons';

const App: FC = () => {
    const { isAuthenticated, user } = useAuth();
    const { path, params, navigate } = useHashRouter();

    useEffect(() => {
        if (isAuthenticated && user) {
            const rolePath = user.role.toLowerCase();
            const currentBasePath = path.split('/')[1];

            if (path === '/login' || path === '/' || (rolePath !== currentBasePath)) {
                 const targetPath = `/${rolePath}/dashboard`;
                 if(path !== targetPath) navigate(targetPath);
            }
        } else {
            if (path !== '/login') {
                navigate('/login');
            }
        }
    }, [isAuthenticated, user, path, navigate]);
    
    if (!isAuthenticated && path !== '/login') {
        return <FullScreenSpinner />;
    }
    
    if (!isAuthenticated) {
        return <LoginScreen />;
    }

    const renderPage = () => {
        if (!user) return <FullScreenSpinner />;

        const role = user.role.toLowerCase();
        
        // Ensure user is on a path for their role
        if (path.split('/')[1] !== role) {
             const fallbackPath = `/${role}/dashboard`;
             if (path !== fallbackPath) navigate(fallbackPath);
             return <FullScreenSpinner />;
        }

        const screen = path.split('/')[2];

        switch (screen) {
            case 'dashboard':
                return <DashboardScreen isAdmin={user.role === 'Admin'} navigate={navigate} />;
            case 'billing':
                const patientId = params[2];
                return <BillingScreen patientId={patientId} navigate={navigate} />;
            case 'settings':
                return <SettingsScreen />;
            case 'waiting-list':
                return <WaitingListScreen navigate={navigate} />;
            default:
                 const fallbackPath = `/${role}/dashboard`;
                 if (path !== fallbackPath) navigate(fallbackPath);
                 return <FullScreenSpinner />;
        }
    };
    
    if (path === '/login') return <LoginScreen/>

    return (
        <DashboardLayout>
            {renderPage()}
        </DashboardLayout>
    );
};


// ========= APP INITIALIZATION ========= //

const container = document.getElementById('root');
if (!container) throw new Error("Root element not found");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);