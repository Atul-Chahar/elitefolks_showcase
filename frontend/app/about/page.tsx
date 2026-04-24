import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Target, Cpu, Zap, Trophy, Users, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About EliteFolks - The Future of Engineering',
    description: 'EliteFolks is an advanced AI-driven platform for mastering software engineering through immersive voice-coding and interactive logic environments.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0D0D0D]">
            <div className="max-w-5xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-orange-500 transition-colors mb-12 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                </Link>
                
                <header className="mb-20">
                    <h1 className="text-6xl md:text-8xl font-manrope font-black tracking-tighter text-white mb-6 uppercase italic">
                        Elite<span className="text-orange-600">Folks</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 font-light max-w-2xl leading-relaxed">
                        Forging the next generation of elite engineers through immersive, AI-driven technical training.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
                        <Zap className="text-orange-500 mb-6" size={32} />
                        <h3 className="text-xl font-bold text-white mb-4">Voice-First Coding</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Break the typing bottleneck. Our proprietary VoiceCode engine allows you to dictate complex logic and commands, unlocking new paradigms of productivity.
                        </p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
                        <Cpu className="text-blue-500 mb-6" size={32} />
                        <h3 className="text-xl font-bold text-white mb-4">Adaptive AI Modules</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            No two learning paths are the same. Our AI engine analyzes your progress in real-time, adjusting difficulty and generating custom challenges.
                        </p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
                        <Trophy className="text-yellow-500 mb-6" size={32} />
                        <h3 className="text-xl font-bold text-white mb-4">Arena & Economy</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Earn coins, unlock premium themes, and compete in Arena contests. Gamification isn't just a layer—it's how we ensure mastery through repetition.
                        </p>
                    </div>
                </div>

                <div className="space-y-20">
                    <section className="flex flex-col md:flex-row gap-12 items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-orange-500 text-xs font-bold uppercase tracking-widest mb-4">
                                <Target size={14} /> Our Mission
                            </div>
                            <h2 className="text-3xl font-manrope font-bold text-white mb-6">The Fast-Track to Mastery</h2>
                            <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                                We believe the traditional way of learning to code is too slow. Passive video consumption doesn't build muscle memory. EliteFolks was built to change that.
                            </p>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                Our platform integrates real-time code execution, interactive logic environment, and voice commands to provide an immersive training ground where you learn by <span className="text-white font-semibold italic">doing</span> and <span className="text-white font-semibold italic">saying</span>.
                            </p>
                        </div>
                        <div className="w-full md:w-1/3 bg-orange-600/10 border border-orange-600/20 p-8 rounded-3xl">
                            <ShieldCheck className="text-orange-500 mb-4" size={40} />
                            <h4 className="text-white font-bold mb-2">Built for Performance</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                Operating on a modern Edge-native stack with minimal latency. Your progress is synced instantly across our globally distributed infrastructure.
                            </p>
                        </div>
                    </section>

                    <section className="bg-zinc-950 border border-zinc-900 rounded-[40px] p-12 text-center">
                        <Users className="mx-auto text-zinc-700 mb-6" size={48} />
                        <h2 className="text-3xl font-manrope font-bold text-white mb-4">Join the Elite</h2>
                        <p className="text-zinc-500 max-w-2xl mx-auto mb-10">
                            Whether you are a complete beginner or a seasoned pro looking to optimize your workflow, there is a place for you in the Folks community.
                        </p>
                        <Link href="/auth" className="inline-block px-10 py-4 bg-white text-black font-black rounded-full hover:bg-orange-600 hover:text-white transition-all transform hover:scale-105">
                            Start Learning Now
                        </Link>
                    </section>
                </div>

                <footer className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-zinc-600 text-sm">
                        &copy; 2026 EliteFolks Platform. All rights reserved.
                    </div>
                    <div className="flex gap-8 text-sm text-zinc-500">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </footer>
            </div>
        </div>
    );
}
