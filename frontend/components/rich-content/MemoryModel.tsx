/**
 * MemoryModel — Visual representation of how data
 * is stored in memory, with boxes and arrows.
 */
'use client';

import React from 'react';

interface MemoryModelProps {
    title?: string;
    description?: string;
    diagram?: string;
    variables?: Array<{
        name: string;
        value: string;
        type?: string;
    }>;
}

const MemoryModel: React.FC<MemoryModelProps> = ({ title, description, diagram, variables }) => {
    return (
        <div className="my-4 rounded-xl overflow-hidden border border-indigo-500/30 bg-gradient-to-br from-[#1a1a2e] to-[#0f0f20]">
            <div className="px-5 py-3 bg-indigo-500/10 border-b border-indigo-500/20 flex items-center gap-2">
                <span className="text-lg">🧠</span>
                <h4 className="text-indigo-300 font-semibold text-sm">{title || 'Memory Model'}</h4>
            </div>
            <div className="p-5 space-y-4">
                {description && (
                    <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{description}</p>
                )}

                {/* ASCII Memory Diagram */}
                {diagram && (
                    <pre className="bg-[#0d1117] rounded-lg p-4 text-sm font-mono text-indigo-300 overflow-x-auto whitespace-pre">
                        {diagram}
                    </pre>
                )}

                {/* Variable Table */}
                {variables && variables.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-indigo-500/20">
                                    <th className="text-left px-3 py-2 text-indigo-400 font-medium text-xs uppercase">Variable</th>
                                    <th className="text-left px-3 py-2 text-indigo-400 font-medium text-xs uppercase">Value</th>
                                    {variables.some(v => v.type) && (
                                        <th className="text-left px-3 py-2 text-indigo-400 font-medium text-xs uppercase">Type</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {variables.map((v, i) => (
                                    <tr key={i} className="border-b border-white/5">
                                        <td className="px-3 py-2 font-mono text-yellow-300">{v.name}</td>
                                        <td className="px-3 py-2 font-mono text-emerald-300">{v.value}</td>
                                        {variables.some(vv => vv.type) && (
                                            <td className="px-3 py-2 text-zinc-500 text-xs">{v.type || '-'}</td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemoryModel;
