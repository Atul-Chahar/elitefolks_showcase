'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

// Lazy load Navbar — prevents hydration mismatches from browser extensions (e.g. Dark Reader)
const Navbar = dynamic(() => import('./Navbar'), { ssr: false });

// Lazy load Footer — always below the fold
const Footer = dynamic(() => import('./Footer'), { ssr: false });

// Lazy load Cookie Consent — non-critical, shows on first visit only
const CookieConsent = dynamic(() => import('./CookieConsent'), { ssr: false });

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const hideAll = pathname?.startsWith('/lesson') || pathname === '/onboarding' || pathname?.includes('/lessons/') || pathname?.startsWith('/training/arena');
    
    // Footer is only visible on these 5 specific pages
    const allowedFooterPaths = ['/', '/login', '/courses', '/compiler', '/profile'];
    
    const showNavbar = !hideAll;
    const showFooter = allowedFooterPaths.includes(pathname || '');

    return (
        <>
            {showNavbar && <Navbar />}
            {children}
            {showFooter && <Footer />}
            <CookieConsent />
        </>
    );
}
