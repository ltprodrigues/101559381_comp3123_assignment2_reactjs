import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        () => localStorage.getItem('token')
    );

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === 'token' || event.key === null) {
                setToken(localStorage.getItem('token'));
            }
        };

        const handleSessionExpired = () => {
            setToken(null);
        };

        window.addEventListener('storage', handleStorage);
        window.addEventListener('session-expired', handleSessionExpired);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener(
                'session-expired',
                handleSessionExpired
            );
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated: Boolean(token),
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}