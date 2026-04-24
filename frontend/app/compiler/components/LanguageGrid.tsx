'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Zap, Code2 } from 'lucide-react';
import { LanguageConfig } from '@/lib/judge0';

interface LanguageGridProps {
    languages: LanguageConfig[];
    popularSlugs: string[];
}

export default function LanguageGrid({ languages, popularSlugs }: LanguageGridProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLanguages = useMemo(() => {
        if (!searchQuery.trim()) return languages;
        const query = searchQuery.toLowerCase();
        return languages.filter(l =>
            l.name.toLowerCase().includes(query) ||
            l.slug.toLowerCase().includes(query)
        );
    }, [languages, searchQuery]);

    const popularLanguages = useMemo(() => {
        return languages.filter(l => popularSlugs.includes(l.slug));
    }, [languages, popularSlugs]);

    const sortedLanguages = useMemo(() => {
        return [...filteredLanguages].sort((a, b) => a.name.localeCompare(b.name));
    }, [filteredLanguages]);

    const isSearching = searchQuery.trim().length > 0;

    return (
        <div className="w-full flex flex-col items-center">
            {/* Search Section */}
            <div className="relative group w-full max-w-md mb-16">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-[#0D0D0D] border border-white/10 rounded-xl p-4 flex items-center gap-3 shadow-2xl">
                    <Search className="text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search languages (e.g. Python, C++)..."
                        className="bg-transparent border-none outline-none text-white placeholder-zinc-600 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="w-full max-w-7xl px-4 pb-20">
                {/* Popular Languages (Hide if searching) */}
                {!isSearching && (
                    <>
                        <div className="mb-8 flex items-center gap-3">
                            <Zap className="text-yellow-500" size={20} />
                            <h2 className="text-xl font-bold font-outfit text-white">Popular Languages</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {popularLanguages.map(lang => (
                                <Link
                                    key={lang.id}
                                    href={`/compiler/${lang.slug}`}
                                    className="group p-5 bg-white/5 border border-white/5 hover:border-blue-500/50 hover:bg-white/10 rounded-2xl transition-all flex items-center justify-between"
                                >
                                    <span className="font-medium text-lg text-zinc-200 group-hover:text-white transition-colors">{lang.name.split(' ')[0]}</span>
                                    <ArrowRight size={18} className="text-zinc-600 group-hover:text-blue-400 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </>
                )}

                {/* All / Filtered Languages List */}
                <div className="mb-8 flex items-center gap-3">
                    <Code2 className="text-blue-500" size={20} />
                    <h2 className="text-xl font-bold font-outfit text-white">
                        {isSearching ? `Search Results (${sortedLanguages.length})` : 'All Supported Languages'}
                    </h2>
                </div>

                {sortedLanguages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {sortedLanguages.map((lang, idx) => (
                            <Link
                                key={lang.id}
                                href={`/compiler/${lang.slug}`}
                                className="text-zinc-400 hover:text-white text-sm py-2 px-3 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 animate-in fade-in fill-mode-both"
                                style={{ animationDelay: `${idx * 10}ms` }}
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                                {lang.name}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-zinc-500">
                        <p>No languages found matching "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}
