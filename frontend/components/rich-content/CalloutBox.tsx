/**
 * CalloutBox — Renders info/warning/tip/fun-fact callout boxes
 * with distinct colors and icons for each style.
 */
'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, Lightbulb, Sparkles, Info } from 'lucide-react';

interface CalloutBoxProps {
    style: 'info' | 'warning' | 'tip' | 'fun-fact' | 'danger';
    title?: string;
    content: string;
}

const styleConfig = {
    info: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/40',
        icon: <Info size={18} className="text-blue-400" />,
        titleColor: 'text-blue-400',
        defaultTitle: 'Information',
    },
    warning: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/40',
        icon: <AlertTriangle size={18} className="text-amber-400" />,
        titleColor: 'text-amber-400',
        defaultTitle: 'Warning',
    },
    danger: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/40',
        icon: <AlertCircle size={18} className="text-red-400" />,
        titleColor: 'text-red-400',
        defaultTitle: 'Caution',
    },
    tip: {
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/40',
        icon: <Lightbulb size={18} className="text-emerald-400" />,
        titleColor: 'text-emerald-400',
        defaultTitle: 'Pro Tip',
    },
    'fun-fact': {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/40',
        icon: <Sparkles size={18} className="text-purple-400" />,
        titleColor: 'text-purple-400',
        defaultTitle: 'Fun Fact',
    },
};

const CalloutBox: React.FC<CalloutBoxProps> = ({ style, title, content }) => {
    const config = styleConfig[style] || styleConfig.info;

    return (
        <div className={`${config.bg} ${config.border} border-l-4 rounded-xl p-5 my-4`}>
            <div className="flex items-center gap-2 mb-2">
                {config.icon}
                <h4 className={`${config.titleColor} font-semibold text-sm uppercase tracking-wide`}>
                    {title || config.defaultTitle}
                </h4>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                {content}
            </p>
        </div>
    );
};

export default CalloutBox;
