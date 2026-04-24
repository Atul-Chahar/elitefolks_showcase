'use client';

import React from 'react';
import Link from 'next/link';
import { Book, Mic, Code, Zap, ArrowLeft } from 'lucide-react';

const DocumentationPage = () => {
    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0D0D0D]">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                        <Book className="text-orange-500" size={24} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-manrope font-bold text-white">Documentation</h1>
                </div>

                <p className="text-zinc-400 text-xl mb-12 leading-relaxed">
                    Welcome to the EliteFolks survival guide. Everything you need to know about coding with your voice and mastering the platform.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/30 transition-all">
                        <Mic className="text-orange-500 mb-4" size={32} />
                        <h3 className="text-xl font-bold text-white mb-2">Voice Commands</h3>
                        <p className="text-zinc-500 text-sm">Learn the core vocabulary for generating code, refactoring, and navigating the editor hands-free.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/30 transition-all">
                        <Code className="text-orange-500 mb-4" size={32} />
                        <h3 className="text-xl font-bold text-white mb-2">Editor Guide</h3>
                        <p className="text-zinc-500 text-sm">Deep dive into the integrated development environment, keyboard shortcuts, and layout customization.</p>
                    </div>
                </div>

                <div className="space-y-12 text-zinc-300 font-sans leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">Getting Started</h2>
                        <p className="mb-4">
                            EliteFolks is designed to be intuitive. To start your first lesson, navigate to the Dashboard and click "Resume Learning". If you're new, we highly recommend the "Introduction to Voice Coding" course.
                        </p>
                        <div className="bg-zinc-900/80 rounded-xl p-6 border border-zinc-800 font-mono text-sm text-zinc-400">
                            <p className="text-orange-500 mb-2">// Pro Tip</p>
                            <p>Say <span className="text-white">"Elite, explain this"</span> while hovering over any code block to get a personalized breakdown from the AI tutor.</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-manrope font-semibold text-white mb-6">Course Roadmap</h2>
                        <p>
                            Our curriculum is structured into levels. Each level unlocks new features and more complex coding challenges.
                        </p>
                        <ul className="list-disc pl-6 space-y-3 mt-4 text-zinc-400">
                            <li><strong>Level 1-5:</strong> Basics of JavaScript & Control Flow</li>
                            <li><strong>Level 6-12:</strong> Data Structures & Async Programming</li>
                            <li><strong>Level 13+:</strong> Advanced Frameworks (React, Node.js)</li>
                        </ul>
                    </section>
                </div>

                <div className="mt-20 pt-10 border-t border-white/5">
                    <Link
                        href="/"
                        className="text-orange-500 hover:underline flex items-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DocumentationPage;
