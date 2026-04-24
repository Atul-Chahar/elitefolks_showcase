'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Settings, ArrowLeft } from 'lucide-react';

const SettingsHeader: React.FC = () => {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between mb-10 animate-fade-in">
            <div className="flex items-center gap-4">
                {/* Back Button */}
                <button
                    onClick={() => router.push('/dashboard')}
                    className="group p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/50 text-zinc-400 hover:text-white hover:border-zinc-700/50 hover:bg-zinc-800/60 transition-all duration-300 backdrop-blur-sm"
                    title="Back to Dashboard"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>

                {/* Settings Icon & Title */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-orange-500/20 rounded-2xl blur-xl opacity-60" />
                        <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-500/20 backdrop-blur-sm">
                            <Settings size={22} className="animate-spin-slow" />
                        </div>
                    </div>
                    <div>
                        <h1 className="font-[family-name:var(--font-bebas)] text-4xl md:text-5xl tracking-wide text-white">
                            Settings
                        </h1>
                        <p className="text-zinc-500 text-sm mt-0.5">
                            Manage your profile and preferences
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsHeader;
