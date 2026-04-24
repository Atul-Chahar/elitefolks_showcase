import React from 'react';
import Link from 'next/link';

export default function ArenaLobby() {
    return (
        <div className="min-h-screen pt-32 pb-24 px-6 bg-[#0D0D0D] text-white">
            <div className="max-w-4xl mx-auto text-center">
                <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                    <span className="text-4xl">⚔️</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-manrope font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500">
                    The Battle Arena
                </h1>
                
                <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Test your coding skills against the clock. Compete in real-time logic puzzles, algorithmic challenges, and raw speed typing to climb the leaderboards.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/5 hover:border-red-500/30 transition-all group">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
                        <h3 className="text-2xl font-bold mb-3 text-red-400">Quick Match</h3>
                        <p className="text-zinc-500 mb-6 text-sm">Jump into a random 1v1 battle tailored to your skill level.</p>
                        <button disabled className="w-full py-3 bg-zinc-800 text-zinc-400 rounded-lg cursor-not-allowed border border-white/5 disabled:opacity-50">
                            Searching for opponents...
                        </button>
                    </div>

                    <div className="bg-zinc-900/50 p-8 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all group">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
                        <h3 className="text-2xl font-bold mb-3 text-orange-400">Tournaments</h3>
                        <p className="text-zinc-500 mb-6 text-sm">Compete in monthly leagues for exclusive cosmetic rewards and XP.</p>
                        <button disabled className="w-full py-3 bg-zinc-800 text-zinc-400 rounded-lg cursor-not-allowed border border-white/5 disabled:opacity-50">
                            Next season begins soon
                        </button>
                    </div>
                </div>

                <Link href="/training" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                    <span>←</span> Return to Training
                </Link>
            </div>
        </div>
    );
}
