import React, { FC, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LockIcon, EmailIcon } from '../components/common/Icons';

export const LoginScreen: FC = () => {
    const [email, setEmail] = useState('admin@clinic.com');
    const [password, setPassword] = useState('password');
    const { login, loading, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="login-screen-wrapper">
            <div className="login-panel-branding">
                <div className="branding-content">
                    <div className="branding-logo">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(255,255,255,0.2)"/>
                        </svg>
                    </div>
                    <h2 className="branding-title">המרכז להורות</h2>
                    <p className="branding-text">
                        ניהול קליניקה חכם ומתקדם, המאפשר לכם להתמקד במה שחשוב באמת - המטופלים שלכם.
                    </p>
                </div>
            </div>
             <div className="login-panel-form">
                <div className="login-card">
                    <h1 className="login-title">כניסה למערכת</h1>
                    <p className="login-subtitle">שלום! אנא הזן את פרטיך כדי להמשיך</p>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">כתובת אימייל</label>
                            <div className="input-wrapper">
                                <EmailIcon />
                                <input
                                    id="email"
                                    type="email"
                                    className="input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">סיסמה</label>
                             <div className="input-wrapper">
                                <LockIcon />
                                <input
                                    id="password"
                                    type="password"
                                    className="input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="********"
                                    required
                                />
                            </div>
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                            {loading ? <div className="spinner" style={{width: 20, height: 20, borderWidth: 2}}></div> : 'התחברות'}
                        </button>
                    </form>
                </div>
                 <footer className="login-footer">
                    &copy; {new Date().getFullYear()} המרכז להורות. כל הזכויות שמורות.
                </footer>
            </div>
        </div>
    );
};