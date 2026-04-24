/**
 * AsciiDiagram — Renders monospace ASCII art diagrams
 * with optional title and dark background.
 */
'use client';

import React from 'react';

interface AsciiDiagramProps {
    title?: string;
    diagram: string;
}

const AsciiDiagram: React.FC<AsciiDiagramProps> = ({ title, diagram }) => {
    return (
        <div className="my-4 rounded-xl overflow-hidden border border-white/10 bg-[#0d1117]">
            {title && (
                <div className="px-4 py-2.5 bg-[#161b22] border-b border-white/5">
                    <span className="text-zinc-400 text-xs font-mono">📊 {title}</span>
                </div>
            )}
            <pre className="p-5 overflow-x-auto text-sm leading-relaxed font-mono text-cyan-300 whitespace-pre">
                {diagram}
            </pre>
        </div>
    );
};

export default AsciiDiagram;
