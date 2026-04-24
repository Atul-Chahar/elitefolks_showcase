/**
 * CodeBlock — Syntax-highlighted code block with copy button
 * and optional explanation panel.
 */
'use client';

import React, { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface CodeBlockProps {
    language: string;
    title?: string;
    code: string;
    explanation?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, title, code, explanation }) => {
    const [copied, setCopied] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-4 rounded-xl overflow-hidden border border-white/10 bg-[#0d1117]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                        <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                    </div>
                    <span className="text-zinc-500 text-xs font-mono uppercase">
                        {title || language}
                    </span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
                >
                    {copied ? (
                        <>
                            <Check size={13} className="text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={13} />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code */}
            <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
                <code className={`language-${language} text-zinc-100 font-mono`}>
                    {code}
                </code>
            </pre>

            {/* Explanation Toggle */}
            {explanation && (
                <div className="border-t border-white/5">
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors"
                    >
                        <span>💡 Explanation</span>
                        {showExplanation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {showExplanation && (
                        <div className="px-4 pb-4 text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
                            {explanation}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CodeBlock;
