'use client';

import React, { useState, useEffect } from 'react';
import { User, Github } from 'lucide-react';

interface UserAvatarProps {
    src?: string | null;
    alt?: string;
    size?: number;
    className?: string;
    fallbackName?: string;
}

/**
 * UserAvatar Component
 * 
 * Elegant, robust avatar handling.
 * Fallback Path: Actual Image -> Provider Logo -> Initials -> Silhouette.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({ 
    src, 
    alt = 'User Avatar', 
    size = 40, 
    className = '', 
    fallbackName = 'Anonymous' 
}) => {
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setError(false);
        setIsLoading(true);
    }, [src]);

    const getProvider = (url?: string | null) => {
        if (!url) return null;
        if (url.includes('googleusercontent.com')) return 'google';
        if (url.includes('githubusercontent.com') || url.includes('avatars.githubusercontent.com')) return 'github';
        return null;
    };

    const provider = getProvider(src);
    const effectiveSrc = (src && src.trim() !== '' && !src.includes('ui-avatars.com')) ? src : null;

    const initials = fallbackName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // Fallback UI Logic
    const renderFallback = () => {
        // 1. Social Provider Logos
        if (provider === 'google') {
            return (
                <div className="w-full h-full flex items-center justify-center bg-white p-[25%] transition-all duration-500">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                </div>
            );
        }
        if (provider === 'github') {
            return (
                <div className="w-full h-full flex items-center justify-center bg-[#24292e] p-[20%] text-white transition-all duration-500">
                    <Github className="w-full h-full" />
                </div>
            );
        }

        // 2. Name Initials (with subtle style)
        if (initials && initials.length > 0) {
            return (
                <div 
                    className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-400 font-bold uppercase tracking-tighter"
                    style={{ fontSize: size * 0.35 }}
                >
                    {initials}
                </div>
            );
        }

        // 3. Final Silhouette Fallback
        return (
            <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-700">
                <User size={size * 0.6} />
            </div>
        );
    };

    return (
        <div 
            className={`relative rounded-full overflow-hidden bg-zinc-950 border border-white/10 ring-1 ring-white/5 shadow-inner transition-transform duration-500 hover:scale-105 ${className}`} 
            style={{ width: size, height: size }}
        >
            {effectiveSrc && !error ? (
                <>
                    {isLoading && <div className="absolute inset-0 bg-zinc-900 animate-pulse" />}
                    <img
                        src={effectiveSrc}
                        alt={alt}
                        onError={() => setError(true)}
                        onLoad={() => setIsLoading(false)}
                        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    />
                </>
            ) : renderFallback()}
        </div>
    );
};
