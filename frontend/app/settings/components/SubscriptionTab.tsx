'use client';

import React from 'react';
import { Icon } from '@iconify/react';

interface SubscriptionTabProps {
    tier: string;
    plan?: string;
}

const TIER_CONFIG: Record<string, { label: string; icon: string; color: string; border: string; bg: string }> = {
    free: {
        label: 'Free',
        icon: 'lucide:user',
        color: 'text-zinc-400',
        border: 'border-zinc-700',
        bg: 'bg-zinc-800/30',
    },
    pro: {
        label: 'Pro',
        icon: 'lucide:star',
        color: 'text-white',
        border: 'border-white/20',
        bg: 'bg-white/5',
    },
    elite: {
        label: 'Elite',
        icon: 'lucide:zap',
        color: 'text-orange-400',
        border: 'border-orange-500/30',
        bg: 'bg-orange-500/5',
    },
};

const SubscriptionTab: React.FC<SubscriptionTabProps> = ({ tier, plan }) => {
    const config = TIER_CONFIG[tier] || TIER_CONFIG.free;
    const isPaid = tier === 'pro' || tier === 'elite';

    // Parse plan key for display (e.g. "pro_annual" → "Annual")
    const billingLabel = plan?.includes('annual') ? 'Annual' : plan?.includes('quarterly') ? 'Quarterly' : 'Monthly';

    return (
        <div className="animate-fade-in">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl flex items-center justify-center">
                    <Icon icon="lucide:crown" className="text-orange-500 text-lg" />
                </div>
                <div>
                    <h2 className="font-[family-name:var(--font-bebas)] text-3xl tracking-wide text-white">Subscription</h2>
                    <p className="text-zinc-500 text-xs">Manage your plan</p>
                </div>
            </div>

            {/* Current Plan Card */}
            <div className={`${config.bg} ${config.border} border rounded-2xl p-6 mb-6`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Icon icon={config.icon} className={`${config.color} text-2xl`} />
                        <div>
                            <h3 className={`text-xl font-bold ${config.color}`}>{config.label} Plan</h3>
                            {isPaid && plan && (
                                <p className="text-zinc-500 text-xs mt-0.5">Billed {billingLabel.toLowerCase()}</p>
                            )}
                        </div>
                    </div>
                    {isPaid && (
                        <span className={`text-[10px] font-bold tracking-wider px-3 py-1 rounded-full border ${
                            tier === 'elite'
                                ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                                : 'bg-white/10 text-white/80 border-white/20'
                        }`}>
                            ACTIVE
                        </span>
                    )}
                </div>

                {isPaid ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Icon icon="lucide:check-circle" className="text-orange-500" />
                            <span>Ads removed</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Icon icon="lucide:check-circle" className="text-orange-500" />
                            <span>Premium features unlocked</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Icon icon="lucide:check-circle" className="text-orange-500" />
                            <span>Priority support enabled</span>
                        </div>

                        <div className="pt-4 border-t border-zinc-800/50">
                            <p className="text-xs text-zinc-500 mb-3">
                                To manage billing, change plans, or cancel — visit your Razorpay dashboard.
                            </p>
                            <a
                                href="https://dashboard.razorpay.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all"
                            >
                                <Icon icon="lucide:external-link" className="text-sm" />
                                Manage in Razorpay
                            </a>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-zinc-400 mb-4">
                            You're on the free plan. Upgrade to unlock all courses, unlimited AI tutoring, 
                            and premium features.
                        </p>
                        <a
                            href="/pricing"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-400 hover:to-orange-500 transition-all shadow-lg shadow-orange-500/20"
                        >
                            <Icon icon="lucide:sparkles" className="text-sm" />
                            Upgrade Now
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionTab;
