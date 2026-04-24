/**
 * InteractiveDemo — Code playground with starter code,
 * expected output, and hint system.
 */
'use client';

import React, { useState } from 'react';
import { Play, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

interface InteractiveDemoProps {
    title?: string;
    starter_code: string;
    expected_output?: string;
    hint?: string;
    language?: string;
}

const InteractiveDemo: React.FC<InteractiveDemoProps> = ({
    title,
    starter_code,
    expected_output,
    hint,
    language = 'javascript',
}) => {
    const [showHint, setShowHint] = useState(false);
    const [code, setCode] = useState(starter_code);

    return (
        <div className="my-4 rounded-xl overflow-hidden border-2 border-orange-500/30 bg-[#0d1117]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border-b border-orange-500/20">
                <div className="flex items-center gap-2">
                    <Play size={16} className="text-orange-400" />
                    <span className="text-orange-300 font-semibold text-sm">
                        {title || 'Try It Yourself!'}
                    </span>
                </div>
                <span className="text-zinc-500 text-xs font-mono uppercase">{language}</span>
            </div>

            {/* Code Editor Area */}
            <div className="p-4">
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full min-h-[120px] bg-[#161b22] rounded-lg p-4 text-sm font-mono text-zinc-100 border border-white/10 focus:border-orange-500/50 focus:outline-none resize-y"
                    spellCheck={false}
                />
            </div>

            {/* Expected Output */}
            {expected_output && (
                <div className="px-4 pb-3">
                    <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                        <span className="text-emerald-400 text-xs font-semibold">Expected Output:</span>
                        <pre className="text-emerald-300 text-sm font-mono mt-1">{expected_output}</pre>
                    </div>
                </div>
            )}

            {/* Hint Toggle */}
            {hint && (
                <div className="border-t border-white/5">
                    <button
                        onClick={() => setShowHint(!showHint)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
                    >
                        <span className="flex items-center gap-1.5">
                            <Lightbulb size={13} />
                            Need a hint?
                        </span>
                        {showHint ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {showHint && (
                        <div className="px-4 pb-4 text-sm text-amber-300/80 leading-relaxed">
                            💡 {hint}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InteractiveDemo;
