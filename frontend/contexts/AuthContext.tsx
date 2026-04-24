'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<any>;
    signup: (name: string, email: string, password: string) => Promise<any>;
    loginWithGoogle: () => Promise<void>;
    loginWithGithub: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Mock Showcase User Profile
const MOCK_USER: User = {
    $id: 'showcase_demouser_xyz',
    name: 'Showcase Viewer',
    email: 'viewer@showcase.local',
    registration: new Date().toISOString(),
    status: true,
    passwordUpdate: new Date().toISOString(),
    emailVerification: true,
    prefs: {
        avatarId: '1',
        onboardingCompleted: true,
        xp: 4500,
        level: 8,
        role: 'user',
    },
    accessedAt: new Date().toISOString(),
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const router = useRouter();
    // Auto-authenticate as the showcase viewer
    const [user, setUser] = useState<User | null>(MOCK_USER);
    const [loading, setLoading] = useState(false);

    const login = async () => {
        setLoading(true);
        setTimeout(() => {
            setUser(MOCK_USER);
            setLoading(false);
            router.push('/dashboard');
        }, 800);
        return { success: true };
    };

    const signup = async () => {
        return login();
    };

    const loginWithGoogle = async () => {
        await login();
    };

    const loginWithGithub = async () => {
        await login();
    };

    const logout = async () => {
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, loginWithGithub, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
