'use client';

import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { Analytics } from '@vercel/analytics/react';
import { analytics } from '../services/analytics';
import { client } from '../lib/appwrite';

export function Providers({ children }: { children: React.ReactNode }) {
    React.useEffect(() => {
        analytics.init();

        // Appwrite ping removed to prevent "Failed to fetch" errors

    }, []);

    return (
        <AuthProvider>
            {children}
            <Analytics />
        </AuthProvider>
    );
}
