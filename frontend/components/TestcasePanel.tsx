import React, { useState } from 'react';
import { TestCase } from '../types';
import { ChevronRight, Plus, Terminal } from 'lucide-react';

interface TestcasePanelProps {
    testCases: TestCase[];
    activeCaseIndex: number;
    onCaseSelect: (index: number) => void;
}

const TestcasePanel: React.FC<TestcasePanelProps> = ({
    testCases = [],
    activeCaseIndex,
    onCaseSelect
}) => {
    const activeCase = testCases[activeCaseIndex];

    if (testCases.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-8 text-center bg-zinc-950/20 backdrop-blur-sm">
                <Terminal size={32} className="mb-4 opacity-20" />
                <p className="text-sm">No structured test cases available for this exercise.</p>
                <p className="text-[10px] mt-2 uppercase tracking-widest opacity-50 font-bold">Defaulting to standard console output</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-transparent overflow-hidden">
            {/* Case Tabs */}
            <div className="flex items-center gap-2 px-4 py-3 shrink-0">
                {testCases.map((tc, idx) => (
                    <button
                        key={tc.id || idx}
                        onClick={() => onCaseSelect(idx)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCaseIndex === idx
                                ? 'bg-white/10 text-white border border-white/10 shadow-lg px-6'
                                : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                    >
                        Case {idx + 1}
                    </button>
                ))}
                <button className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-400 hover:bg-white/5 transition-all">
                    <Plus size={14} />
                </button>
            </div>

            {/* Input Display */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 animate-fade-in">
                {activeCase && (
                    <div className="space-y-4">
                        {Object.entries(activeCase.inputs).map(([name, value]) => (
                            <div key={name} className="space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1.5">
                                    {name} <ChevronRight size={8} />
                                </label>
                                <div className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 font-jetbrains text-sm text-zinc-200">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestcasePanel;
