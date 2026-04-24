/**
 * StepList — Numbered step-by-step instructions
 * with visual step indicators.
 */
'use client';

import React from 'react';

interface StepItem {
    step?: number | string;
    title?: string;
    content: string;
}

interface StepListProps {
    title?: string;
    steps: (string | StepItem)[];
}

const StepList: React.FC<StepListProps> = ({ title, steps }) => {
    return (
        <div className="my-4 rounded-xl border border-white/10 bg-[#0f0f1a] p-5">
            {title && (
                <h4 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                    <span className="text-lg">📋</span> {title}
                </h4>
            )}
            <div className="space-y-4">
                {steps.map((step, i) => {
                    const isObject = typeof step === 'object' && step !== null;
                    const content = isObject ? (step as StepItem).content : step;
                    const stepTitle = isObject ? (step as StepItem).title : null;

                    return (
                        <div key={i} className="flex items-start gap-4 group">
                            {/* Step Number */}
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 group-hover:border-orange-500/50 flex items-center justify-center text-zinc-400 group-hover:text-orange-400 text-sm font-bold shadow-lg transition-colors">
                                {i + 1}
                            </div>

                            {/* Step Content */}
                            <div className="pt-1 space-y-1">
                                {stepTitle && (
                                    <h5 className="text-orange-400 font-bold text-sm tracking-tight">{stepTitle}</h5>
                                )}
                                <p className="text-zinc-300 text-sm leading-relaxed">{String(content)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StepList;
