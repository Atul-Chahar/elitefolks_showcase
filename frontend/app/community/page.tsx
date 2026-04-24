'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Github, MessageSquare, ArrowLeft } from 'lucide-react';

const CommunityPage = () => {
    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0D0D0D]">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                        <Users className="text-orange-500" size={24} />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-manrope font-bold text-white">Community</h1>
                </div>

                <p className="text-zinc-400 text-xl mb-12 leading-relaxed">
                    Join thousands of developers who are shaping the future of voice-driven development.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    <a href="#" className="p-8 rounded-2xl bg-[#5865F2]/5 border border-[#5865F2]/20 hover:bg-[#5865F2]/10 transition-all group">
                        <MessageSquare className="text-[#5865F2] mb-4" size={32} />
                        <h3 className="text-xl font-bold text-white mb-2">Discord Server</h3>
                        <p className="text-zinc-500 text-sm">Chat in real-time with other students and the dev team. Share your projects and get instant help.</p>
                        <div className="mt-6 text-[#5865F2] font-semibold flex items-center gap-2">
                            Join Discord <ArrowLeft className="rotate-135" size={12} />
                        </div>
                    </a>
                    <a href="#" className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 transition-all group">
                        <Github className="text-white mb-4" size={32} />
                        <h3 className="text-xl font-bold text-white mb-2">GitHub Discussions</h3>
                        <p className="text-zinc-500 text-sm">Help us build the next generation of coding tools. Report bugs, suggest features, and contribute code.</p>
                        <div className="mt-6 text-white font-semibold flex items-center gap-2">
                            View Roadmap <ArrowLeft className="rotate-135" size={12} />
                        </div>
                    </a>
                </div>

                <div className="bg-zinc-900/30 rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full"></div>
                    <h2 className="text-3xl font-manrope font-bold text-white mb-6">Weekly Developer Showcases</h2>
                    <p className="text-zinc-400 mb-8 leading-relaxed">
                        Every Friday, we showcase the most innovative projects built using EliteFolks. Winners receive exclusive credits and a permanent badge on their profile.
                    </p>
                    <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold transition-all transform hover:scale-105">
                        Submit Your Project
                    </button>
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

export default CommunityPage;
