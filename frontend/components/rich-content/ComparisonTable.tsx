/**
 * ComparisonTable — Renders styled comparison tables
 * with gradient header and alternating rows.
 */
'use client';

import React from 'react';

interface ComparisonTableProps {
    title?: string;
    headers: string[];
    rows: string[][];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ title, headers, rows }) => {
    return (
        <div className="my-4 rounded-xl overflow-hidden border border-white/10">
            {title && (
                <div className="px-5 py-3 bg-gradient-to-r from-orange-500/10 to-purple-500/10 border-b border-white/5">
                    <h4 className="text-white font-semibold text-sm">{title}</h4>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-[#1a1a2e]">
                            {headers.map((header, i) => (
                                <th
                                    key={i}
                                    className="px-4 py-3 text-left text-zinc-300 font-semibold text-xs uppercase tracking-wider border-b border-white/10"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIdx) => (
                            <tr
                                key={rowIdx}
                                className={`${rowIdx % 2 === 0 ? 'bg-[#0f0f1a]' : 'bg-[#141420]'} hover:bg-white/5 transition-colors`}
                            >
                                {row.map((cell, cellIdx) => (
                                    <td
                                        key={cellIdx}
                                        className={`px-4 py-3 border-b border-white/5 ${cellIdx === 0 ? 'text-zinc-200 font-medium' : 'text-zinc-400'}`}
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComparisonTable;
