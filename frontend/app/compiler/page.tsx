import React from 'react';
import { LANGUAGES } from '@/lib/judge0';
import LanguageGrid from './components/LanguageGrid';

// Popular languages to highlight at the top
const POPULAR_SLUGS = ['python', 'javascript', 'cpp', 'java', 'go', 'rust', 'csharp', 'php', 'typescript', 'ruby', 'swift', 'kotlin'];

export const metadata = {
    title: 'Free Online Compiler & IDE - EliteFolks',
    description: 'Run code in 40+ programming languages online. Free online compiler for Python, C++, Java, JavaScript, and more.',
};

export default function CompilerLandingPage() {
    return (
        <div className="flex-1 overflow-y-auto w-full h-full relative z-0">
            {/* Environment Background */}
            <div className="grid-bg fixed inset-0 opacity-20 pointer-events-none z-0" aria-hidden="true" />
            <div className="fixed inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-0" />

            {/* Hero Section */}
            <section className="w-full min-h-[60vh] py-32 px-4 flex flex-col items-center justify-center text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md w-fit mb-8 animate-fade-in-up">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] font-mono">
                        Global Execution Environment
                    </span>
                </div>

                <h1 className="font-[family-name:var(--font-bebas)] text-6xl md:text-8xl tracking-wide mb-6 bg-gradient-to-br from-white via-white to-white/50 bg-clip-text text-transparent animate-fade-in-up delay-100">
                    Run Code Online
                </h1>

                <p className="font-mono text-sm text-zinc-400 max-w-lg mb-8 leading-relaxed tracking-wider animate-fade-in-up delay-200">
                    A powerful, free online compiler supporting 40+ programming languages. Instant execution, no setup required.
                </p>

                {/* Language Grid with Search */}
                <div className="w-full max-w-5xl animate-fade-in-up delay-300">
                    <LanguageGrid languages={LANGUAGES} popularSlugs={POPULAR_SLUGS} />
                </div>
            </section>
        </div>
    );
}
