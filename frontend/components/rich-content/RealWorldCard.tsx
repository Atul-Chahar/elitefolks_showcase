/**
 * RealWorldCard — Case study card for real-world examples
 * with company/project context.
 */
'use client';

import React from 'react';
import { Globe } from 'lucide-react';

interface RealWorldCardProps {
    title?: string;
    company?: string;
    description: string;
    takeaway?: string;
}

const RealWorldCard: React.FC<RealWorldCardProps> = ({ title, company, description, takeaway }) => {
    return (
        <div className="my-4 rounded-xl border border-white/10 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] p-5">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Globe size={20} className="text-emerald-400" />
                </div>
                <div>
                    <h4 className="text-emerald-400 font-semibold text-sm">{title || 'Real-World Example'}</h4>
                    {company && (
                        <span className="text-zinc-500 text-xs">{company}</span>
                    )}
                </div>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed mb-3 whitespace-pre-wrap">{description}</p>
            {takeaway && (
                <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                    <p className="text-emerald-300 text-xs font-medium">
                        💡 Takeaway: {takeaway}
                    </p>
                </div>
            )}
        </div>
    );
};

export default RealWorldCard;
