'use client';

import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, BarChart3, Target, X } from 'lucide-react';

// Cookie categories the user can toggle
interface CookiePreferences {
    necessary: boolean;   // Always true — cannot be toggled
    analytics: boolean;   // PostHog, Vercel Analytics
    functional: boolean;  // Themes, preferences, session
    advertising: boolean; // Google AdSense
}

const STORAGE_KEY = 'ef_cookie_consent';
const CONSENT_VERSION = '1.0'; // Bump this to re-show the banner after policy changes

const defaultPreferences: CookiePreferences = {
    necessary: true,
    analytics: false,
    functional: false,
    advertising: false,
};

interface StoredConsent {
    version: string;
    preferences: CookiePreferences;
    timestamp: string;
}

const CookieConsent: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed: StoredConsent = JSON.parse(stored);
                if (parsed.version === CONSENT_VERSION) {
                    // Already consented with current version
                    return;
                }
            }
        } catch {
            // Invalid stored data, show banner
        }

        // Show banner after a short delay for better UX
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    const saveConsent = (prefs: CookiePreferences) => {
        const consent: StoredConsent = {
            version: CONSENT_VERSION,
            preferences: prefs,
            timestamp: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    };

    const handleAcceptAll = () => {
        const allAccepted: CookiePreferences = {
            necessary: true,
            analytics: true,
            functional: true,
            advertising: true,
        };
        saveConsent(allAccepted);
        dismissBanner();
    };

    const handleRejectAll = () => {
        const onlyNecessary: CookiePreferences = {
            necessary: true,
            analytics: false,
            functional: false,
            advertising: false,
        };
        saveConsent(onlyNecessary);
        dismissBanner();
    };

    const handleSavePreferences = () => {
        saveConsent(preferences);
        dismissBanner();
    };

    const dismissBanner = () => {
        setIsAnimatingOut(true);
        setTimeout(() => setVisible(false), 400);
    };

    const togglePreference = (key: keyof CookiePreferences) => {
        if (key === 'necessary') return; // Cannot toggle necessary cookies
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!visible) return null;

    const categories = [
        {
            key: 'necessary' as const,
            label: 'Essential',
            description: 'Authentication, security, and core site functionality. These are always active.',
            icon: ShieldCheck,
            locked: true,
            color: 'emerald',
        },
        {
            key: 'functional' as const,
            label: 'Functional',
            description: 'Theme preferences, editor settings, and personalization features.',
            icon: Cookie,
            locked: false,
            color: 'blue',
        },
        {
            key: 'analytics' as const,
            label: 'Analytics',
            description: 'Help us understand how you use EliteFolks to improve your experience.',
            icon: BarChart3,
            locked: false,
            color: 'purple',
        },
        {
            key: 'advertising' as const,
            label: 'Advertising',
            description: 'Personalized ads to support free-tier access. Pro users see no ads.',
            icon: Target,
            locked: false,
            color: 'orange',
        },
    ];

    const colorMap: Record<string, { dot: string; border: string; bg: string; text: string; toggle: string }> = {
        emerald: { dot: 'bg-emerald-500', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', text: 'text-emerald-400', toggle: 'bg-emerald-500' },
        blue: { dot: 'bg-blue-500', border: 'border-blue-500/20', bg: 'bg-blue-500/5', text: 'text-blue-400', toggle: 'bg-blue-500' },
        purple: { dot: 'bg-purple-500', border: 'border-purple-500/20', bg: 'bg-purple-500/5', text: 'text-purple-400', toggle: 'bg-purple-500' },
        orange: { dot: 'bg-orange-500', border: 'border-orange-500/20', bg: 'bg-orange-500/5', text: 'text-orange-400', toggle: 'bg-orange-500' },
    };

    return (
        <div>
            {/* Backdrop overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[9998] transition-opacity duration-500 ${isAnimatingOut ? 'opacity-0' : 'opacity-100'
                    }`}
                onClick={handleRejectAll}
            />

            {/* Cookie Banner */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6 transition-all duration-500 ease-out ${isAnimatingOut
                    ? 'translate-y-full opacity-0'
                    : 'translate-y-0 opacity-100 animate-[slideUp_0.6s_cubic-bezier(0.16,1,0.3,1)]'
                    }`}
            >
                <div className="max-w-4xl mx-auto">
                    {/* Main Card */}
                    <div className="relative rounded-[2rem] p-[1px] bg-gradient-to-b from-white/15 to-white/[0.02] overflow-hidden">
                        {/* Glow effects */}
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-600/5 rounded-full blur-[60px] pointer-events-none" />

                        <div className="bg-[#0A0A0A]/95 backdrop-blur-xl rounded-[1.95rem] p-6 md:p-8 relative overflow-hidden border border-white/[0.02] shadow-[0_-10px_60px_-10px_rgba(0,0,0,0.8)]">
                            {/* Top shimmer line */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                            {/* Header Row */}
                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-orange-500/20 rounded-2xl blur-xl animate-pulse" />
                                        <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                                            <Cookie size={22} className="text-orange-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-[family-name:var(--font-bebas)] text-2xl md:text-3xl tracking-wider text-white uppercase">
                                            Cookie <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Preferences</span>
                                        </h3>
                                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5">
                                            Your privacy, your choice
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleRejectAll}
                                    className="text-zinc-600 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5"
                                    aria-label="Dismiss"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Description */}
                            <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-2xl">
                                We use cookies to power your coding experience — from saving your editor preferences to tracking your streak.
                                Choose what you're comfortable with.
                            </p>

                            {/* Expandable Details */}
                            {showDetails && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 animate-[fadeIn_0.3s_ease-out]">
                                    {categories.map((cat) => {
                                        const colors = colorMap[cat.color];
                                        const isEnabled = preferences[cat.key];
                                        const Icon = cat.icon;

                                        return (
                                            <div
                                                key={cat.key}
                                                className={`p-4 rounded-xl border transition-all duration-300 ${isEnabled
                                                    ? `${colors.bg} ${colors.border}`
                                                    : 'bg-zinc-900/40 border-zinc-800/50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2.5">
                                                        <Icon size={14} className={isEnabled ? colors.text : 'text-zinc-600'} />
                                                        <span className={`text-xs font-bold uppercase tracking-wider ${isEnabled ? 'text-white' : 'text-zinc-500'}`}>
                                                            {cat.label}
                                                        </span>
                                                        {cat.locked && (
                                                            <span className="text-[8px] font-black text-emerald-500/70 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                                                                Required
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Toggle */}
                                                    <button
                                                        onClick={() => togglePreference(cat.key)}
                                                        disabled={cat.locked}
                                                        className={`relative w-10 h-5.5 rounded-full transition-all duration-300 ${cat.locked
                                                            ? `${colors.toggle} cursor-not-allowed opacity-60`
                                                            : isEnabled
                                                                ? `${colors.toggle} shadow-[0_0_12px_rgba(249,115,22,0.3)]`
                                                                : 'bg-zinc-700 hover:bg-zinc-600'
                                                            }`}
                                                        style={{ width: '40px', height: '22px' }}
                                                    >
                                                        <div
                                                            className={`absolute top-[3px] w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${isEnabled ? 'left-[21px]' : 'left-[3px]'
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                                <p className="text-zinc-500 text-[11px] leading-relaxed">
                                                    {cat.description}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Action Bar */}
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                {/* Customize toggle */}
                                <button
                                    onClick={() => setShowDetails(!showDetails)}
                                    className="order-3 sm:order-1 text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-[0.2em] transition-colors px-4 py-2.5 rounded-xl hover:bg-white/5 whitespace-nowrap"
                                >
                                    {showDetails ? '← Hide Details' : 'Customize ↓'}
                                </button>

                                <div className="flex items-center gap-3 w-full sm:w-auto sm:ml-auto order-1 sm:order-2">
                                    {/* Reject All */}
                                    <button
                                        onClick={handleRejectAll}
                                        className="flex-1 sm:flex-initial px-6 py-3 bg-zinc-900 border border-zinc-700/50 hover:border-zinc-600 text-zinc-300 hover:text-white rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Reject All
                                    </button>

                                    {/* Accept All or Save Preferences */}
                                    {showDetails ? (
                                        <button
                                            onClick={handleSavePreferences}
                                            className="flex-1 sm:flex-initial px-8 py-3 bg-orange-600 hover:bg-orange-500 text-black rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            Save Preferences
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleAcceptAll}
                                            className="flex-1 sm:flex-initial px-8 py-3 bg-orange-600 hover:bg-orange-500 text-black rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            Accept All
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
