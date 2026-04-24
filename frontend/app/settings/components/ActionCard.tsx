'use client';

import React, { useState } from 'react';
import { Loader2, LucideIcon } from 'lucide-react';

interface ActionCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    variant: 'warning' | 'danger';
    buttonText: string;
    confirmText?: string;
    confirmPlaceholder?: string;
    requiresTypedConfirmation?: boolean;
    onConfirm: () => Promise<void>;
}

const ActionCard: React.FC<ActionCardProps> = ({
    title,
    description,
    icon: Icon,
    variant,
    buttonText,
    confirmText = '',
    confirmPlaceholder = '',
    requiresTypedConfirmation = false,
    onConfirm,
}) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    const isWarning = variant === 'warning';
    const colorClasses = isWarning
        ? {
            bg: 'bg-yellow-500/5',
            border: 'border-yellow-500/20 hover:border-yellow-500/30',
            icon: 'text-yellow-500',
            iconBg: 'bg-yellow-500/10',
            button: 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border-yellow-500/20',
            confirmBg: 'bg-yellow-500/5 border-yellow-500/20',
            confirmButton: 'bg-yellow-500 hover:bg-yellow-600 text-black',
        }
        : {
            bg: 'bg-red-500/5',
            border: 'border-red-500/20 hover:border-red-500/30',
            icon: 'text-red-500',
            iconBg: 'bg-red-500/10',
            button: 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20',
            confirmBg: 'bg-red-500/10 border-red-500/30',
            confirmButton: 'bg-red-500 hover:bg-red-600 text-white',
        };

    const handleConfirm = async () => {
        if (requiresTypedConfirmation && inputValue !== confirmText) return;
        setLoading(true);
        try {
            await onConfirm();
            setShowConfirm(false);
            setInputValue('');
        } finally {
            setLoading(false);
        }
    };

    const canConfirm = !requiresTypedConfirmation || inputValue === confirmText;

    return (
        <div className={`p-6 ${colorClasses.bg} border ${colorClasses.border} rounded-2xl transition-all duration-300`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${colorClasses.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon size={18} className={colorClasses.icon} />
                    </div>
                    <div>
                        <h4 className="text-white font-medium">{title}</h4>
                        <p className="text-zinc-500 text-sm mt-1 leading-relaxed max-w-md">
                            {description}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setShowConfirm(true)}
                    className={`px-4 py-2.5 ${colorClasses.button} border rounded-xl text-sm font-medium transition-all whitespace-nowrap hover:scale-105 active:scale-95`}
                >
                    {buttonText}
                </button>
            </div>

            {/* Confirmation Panel */}
            <div className={`overflow-hidden transition-all duration-500 ease-out ${showConfirm ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                <div className={`p-4 ${colorClasses.confirmBg} border rounded-xl`}>
                    <p className={`${isWarning ? 'text-yellow-400' : 'text-red-400'} text-sm mb-3`}>
                        {requiresTypedConfirmation ? (
                            <>Type <span className="font-bold">{confirmText}</span> to confirm.</>
                        ) : (
                            <>Are you sure? This action cannot be undone.</>
                        )}
                    </p>

                    {requiresTypedConfirmation && (
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={confirmPlaceholder}
                            className={`w-full bg-zinc-950 border ${isWarning ? 'border-yellow-500/30 focus:border-yellow-500' : 'border-red-500/30 focus:border-red-500'} rounded-lg px-4 py-2.5 text-white outline-none transition-all mb-3`}
                        />
                    )}

                    <div className="flex gap-2">
                        <button
                            onClick={handleConfirm}
                            disabled={loading || !canConfirm}
                            className={`px-4 py-2.5 ${colorClasses.confirmButton} disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95`}
                        >
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Icon size={14} />}
                            Confirm
                        </button>
                        <button
                            onClick={() => { setShowConfirm(false); setInputValue(''); }}
                            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionCard;
