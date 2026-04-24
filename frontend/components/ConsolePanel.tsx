import React, { useRef, useEffect } from 'react';
import { ConsoleOutput } from '../types';
import { AlertCircle, AlertTriangle, Info, ChevronRight } from 'lucide-react';

interface ConsolePanelProps {
    output: ConsoleOutput[];
    theme?: 'default' | 'theme_retro' | 'theme_cyber';
}

const ConsolePanel: React.FC<ConsolePanelProps> = ({ output, theme = 'default' }) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [output]);

    // Theme configurations
    const isRetro = theme === 'theme_retro';
    const isCyber = theme === 'theme_cyber';

    const getThemeClasses = () => {
        if (isRetro) {
            return {
                bg: 'bg-black',
                text: 'text-green-500',
                font: 'font-mono',
                emptyText: 'text-green-800',
                cursor: 'text-green-400',
            };
        }
        if (isCyber) {
            return {
                bg: 'bg-[#050510]',
                text: 'text-cyan-400',
                font: 'font-jetbrains',
                emptyText: 'text-cyan-900',
                cursor: 'text-cyan-400',
            };
        }
        return {
            bg: 'bg-[#0a0a0a]',
            text: 'text-zinc-300',
            font: 'font-jetbrains',
            emptyText: 'text-zinc-600',
            cursor: 'text-zinc-600',
        };
    };

    const getIconAndColor = (type: ConsoleOutput['type']) => {
        if (isRetro) {
            // Retro theme: All green monochrome
            switch (type) {
                case 'error':
                    return { icon: AlertCircle, color: 'text-green-300', bg: 'bg-green-950/30' };
                case 'warn':
                    return { icon: AlertTriangle, color: 'text-green-400', bg: 'bg-green-950/20' };
                case 'info':
                    return { icon: Info, color: 'text-green-500', bg: 'bg-green-950/10' };
                default:
                    return { icon: ChevronRight, color: 'text-green-400', bg: 'bg-transparent' };
            }
        }
        if (isCyber) {
            // Cyber theme: Neon colors
            switch (type) {
                case 'error':
                    return { icon: AlertCircle, color: 'text-pink-400', bg: 'bg-pink-500/5' };
                case 'warn':
                    return { icon: AlertTriangle, color: 'text-yellow-300', bg: 'bg-yellow-500/5' };
                case 'info':
                    return { icon: Info, color: 'text-cyan-300', bg: 'bg-cyan-500/5' };
                default:
                    return { icon: ChevronRight, color: 'text-cyan-400', bg: 'bg-transparent' };
            }
        }
        // Default theme
        switch (type) {
            case 'error':
                return { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/5' };
            case 'warn':
                return { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/5' };
            case 'info':
                return { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/5' };
            default:
                return { icon: ChevronRight, color: 'text-green-400', bg: 'bg-transparent' };
        }
    };

    const themeClasses = getThemeClasses();

    return (
        <div className={`h-full flex flex-col ${themeClasses.bg} relative overflow-hidden`}>
            {/* Retro CRT Scanlines Effect */}
            {isRetro && (
                <>
                    {/* Scanlines overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 255, 0, 0.03) 1px, rgba(0, 255, 0, 0.03) 2px)',
                            backgroundSize: '100% 2px',
                        }}
                    />
                    {/* CRT glow effect */}
                    <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_60px_rgba(0,255,0,0.05)]" />
                    {/* Subtle flicker animation */}
                    <div className="absolute inset-0 pointer-events-none z-10 animate-crt-flicker" />
                </>
            )}

            {/* Cyber glow effect */}
            {isCyber && (
                <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_40px_rgba(0,255,255,0.03)]" />
            )}

            <div className={`flex-grow p-4 overflow-y-auto ${themeClasses.font} text-sm custom-scrollbar relative z-20`}>
                {output.length === 0 ? (
                    <div className={`flex items-center justify-center h-full ${themeClasses.emptyText}`}>
                        <div className="text-center">
                            <div className={`text-2xl mb-2 ${isRetro ? 'animate-pulse' : ''}`}>
                                {isRetro ? '█_' : '>_'}
                            </div>
                            <div className="text-xs">
                                {isRetro ? 'AWAITING INPUT...' : 'Run your code to see output'}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {output.map((line, index) => {
                            const { icon: Icon, color, bg } = getIconAndColor(line.type);
                            return (
                                <div
                                    key={index}
                                    className={`flex items-start gap-2 py-1 px-2 rounded ${bg} ${color} group ${isRetro ? 'animate-type-in' : ''}`}
                                    style={isRetro ? { animationDelay: `${index * 30}ms` } : undefined}
                                >
                                    <Icon size={14} className="mt-0.5 opacity-70 flex-shrink-0" />
                                    <span className="flex-1 whitespace-pre-wrap break-all leading-relaxed">
                                        {isRetro ? `> ${line.message}` : line.message}
                                    </span>
                                    <span className={`text-[10px] ${isRetro ? 'text-green-900' : 'text-zinc-700'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                        #{index + 1}
                                    </span>
                                </div>
                            );
                        })}
                        <div ref={endOfMessagesRef} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsolePanel;

