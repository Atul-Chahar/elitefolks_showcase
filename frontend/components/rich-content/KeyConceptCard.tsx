/**
 * KeyConceptCard — Floating definition card with icon,
 * term, definition, and subtle glow effect.
 */
'use client';

import React from 'react';

interface KeyConceptCardProps {
    term: string;
    definition: string;
    icon?: string;
}

const KeyConceptCard: React.FC<KeyConceptCardProps> = ({ term, definition, icon = '💡' }) => {
    return (
        <div className="my-4 relative group">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative bg-[#1a1a2e] rounded-xl p-5 border border-white/10 hover:border-orange-500/30 transition-colors">
                <div className="flex items-start gap-4">
                    <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
                    <div>
                        <h4 className="text-orange-400 font-bold text-base mb-1.5">{term}</h4>
                        <p className="text-zinc-300 text-sm leading-relaxed">{definition}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KeyConceptCard;
