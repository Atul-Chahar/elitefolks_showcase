'use client';

import React from 'react';

interface ToggleSwitchProps {
    enabled: boolean;
    onToggle: () => void;
    label?: string;
    description?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onToggle, label, description }) => {
    return (
        <div className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl backdrop-blur-sm hover:border-zinc-700/50 transition-all duration-300 group">
            {(label || description) && (
                <div className="space-y-0.5">
                    {label && (
                        <p className="text-white text-sm font-medium group-hover:text-orange-50 transition-colors">
                            {label}
                        </p>
                    )}
                    {description && (
                        <p className="text-zinc-500 text-xs leading-relaxed">{description}</p>
                    )}
                </div>
            )}
            <button
                onClick={onToggle}
                role="switch"
                aria-checked={enabled}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 ease-out ${enabled
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25'
                        : 'bg-zinc-800'
                    }`}
            >
                {/* Track glow effect when enabled */}
                {enabled && (
                    <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-md animate-pulse" />
                )}
                {/* Thumb */}
                <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ease-out transform ${enabled ? 'right-1 scale-110' : 'left-1 scale-100'
                        }`}
                >
                    {/* Inner shine */}
                    <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white to-zinc-100" />
                </div>
            </button>
        </div>
    );
};

export default ToggleSwitch;
