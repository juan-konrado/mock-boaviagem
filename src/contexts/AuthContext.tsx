import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

export const AuthContext = createContext({} as any);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState({ name: 'Admin Mock', role: 'ADMIN' });

    async function signIn() {
        setUser({ name: 'Admin Mock', role: 'ADMIN' });
    }

    function signOut() {
        setUser({ name: '', role: '' });
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user.name, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}