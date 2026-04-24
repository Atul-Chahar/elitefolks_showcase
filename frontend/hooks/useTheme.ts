'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/dbService';

export type ThemeType = 'default' | 'theme_retro' | 'theme_cyber';

interface ThemeColors {
    // Console colors
    consoleBg: string;
    consoleText: string;
    consoleAccent: string;
    consoleBorder: string;
    consoleLogColor: string;
    consoleErrorColor: string;
    consoleWarnColor: string;
    consoleInfoColor: string;
    // Effects
    scanlines: boolean;
    glow: boolean;
    fontStyle: string;
}

const themeConfigs: Record<ThemeType, ThemeColors> = {
    default: {
        consoleBg: 'bg-[#0a0a0a]',
        consoleText: 'text-zinc-300',
        consoleAccent: 'text-orange-500',
        consoleBorder: 'border-zinc-800',
        consoleLogColor: 'text-green-400',
        consoleErrorColor: 'text-red-400',
        consoleWarnColor: 'text-yellow-400',
        consoleInfoColor: 'text-blue-400',
        scanlines: false,
        glow: false,
        fontStyle: 'font-jetbrains',
    },
    theme_retro: {
        consoleBg: 'bg-black',
        consoleText: 'text-green-500',
        consoleAccent: 'text-green-400',
        consoleBorder: 'border-green-900/50',
        consoleLogColor: 'text-green-400',
        consoleErrorColor: 'text-green-300',
        consoleWarnColor: 'text-green-300',
        consoleInfoColor: 'text-green-400',
        scanlines: true,
        glow: true,
        fontStyle: 'font-mono',
    },
    theme_cyber: {
        consoleBg: 'bg-[#050510]',
        consoleText: 'text-cyan-300',
        consoleAccent: 'text-cyan-400',
        consoleBorder: 'border-cyan-500/30',
        consoleLogColor: 'text-cyan-400',
        consoleErrorColor: 'text-pink-400',
        consoleWarnColor: 'text-yellow-300',
        consoleInfoColor: 'text-cyan-300',
        scanlines: false,
        glow: true,
        fontStyle: 'font-jetbrains',
    },
};

export function useTheme() {
    const { user } = useAuth();
    const [activeTheme, setActiveTheme] = useState<ThemeType>('default');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTheme = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                const stats = await dbService.getUserStats(user.id);
                if (stats?.activeTheme) {
                    setActiveTheme(stats.activeTheme as ThemeType);
                }
            } catch (error) {
                console.error('Failed to fetch theme:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTheme();
    }, [user?.id]);

    const theme = themeConfigs[activeTheme] || themeConfigs.default;

    return {
        themeName: activeTheme,
        theme,
        loading,
        isRetro: activeTheme === 'theme_retro',
        isCyber: activeTheme === 'theme_cyber',
    };
}

export { themeConfigs };
