'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LeaderboardEntry } from '../../types';
import { RefreshCcw, Crown, Activity, ArrowUp, Zap } from 'lucide-react';
import { UserAvatar } from '../../components/UserAvatar';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const LeaderboardPage = () => {
    const { user } = useAuth();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/data/leaderboard');
            if (!res.ok) throw new Error('Failed to load leaderboard');
            const { leaderboard: data } = await res.json();
            if (Array.isArray(data)) {
                setLeaderboard(data);

                // Seed feed from actual leaderboard users if empty
                if (data.length > 0) {
                    const seededFeed: import('../../types').FeedItem[] = data.slice(0, 5).map((user, index) => ({
                        id: `seed-${user.userId}-${index}`,
                        user: user.fullName || 'Anonymous',
                        action: index % 2 === 0 ? 'reached' : 'earned',
                        item: index % 2 === 0 ? `Level ${user.level}` : `${user.xp} XP`,
                        time: `${Math.floor(Math.random() * 30) + 2}m ago`,
                        avatarUrl: user.avatarUrl
                    }));
                    setFeed(seededFeed);
                }
            }
        } catch (error) {
            // Suppress - table may not exist yet
        } finally {
            setLoading(false);
        }
    };

    const [feed, setFeed] = useState<import('../../types').FeedItem[]>([]);

    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!containerRef.current || loading) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(".animate-header",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out" }
            );

            gsap.fromTo(".podium-card",
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power3.out" }
            );

            gsap.fromTo(".rank-item",
                { x: -30, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".rank-list",
                        start: "top 85%",
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [loading]);

    if (loading) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-t-2 border-orange-500 animate-spin"></div>
                <Zap size={24} className="absolute inset-0 m-auto text-orange-500 animate-pulse" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-500/60">Fetching Rankings...</span>
        </div>
    );

    const topThree = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    return (

        <div ref={containerRef} className="pt-24 min-h-screen bg-black text-white selection:bg-orange-500/30 overflow-x-hidden font-sans relative">
            {/* Background Atmosphere */}
            <div className="grid-bg fixed inset-0 opacity-40 pointer-events-none z-0" aria-hidden="true" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_80%)] pointer-events-none z-0" aria-hidden="true" />
            <div className="fixed inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="animate-header inline-flex items-center gap-2 px-3 py-1 w-fit rounded-full border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-md mb-2">
                            <Crown size={12} className="text-yellow-500 animate-pulse" />
                            <span className="text-[10px] font-semibold text-yellow-200 uppercase tracking-widest font-mono">Global Elite Rankings</span>
                        </div>
                        <h1 className="animate-header font-[family-name:var(--font-bebas)] text-6xl md:text-8xl tracking-wider text-white">
                            LEADER<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">BOARD</span>
                        </h1>
                        <p className="animate-header text-zinc-400 max-w-lg font-sans text-sm">See where you stack up against other developers in the global rankings.</p>
                    </div>
                    <button
                        onClick={loadLeaderboard}
                        className="animate-header bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl border border-white/5 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 backdrop-blur-sm group"
                    >
                        <RefreshCcw size={16} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Update Data</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in-up delay-100">

                    {/* Main Leaderboard Box */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. Podium Section */}
                        {topThree.length >= 3 && (
                            <div className="podium-card relative rounded-[2.5rem] p-[1px] bg-gradient-to-b from-white/10 to-transparent overflow-hidden">
                                <div className="bg-black/40 backdrop-blur-sm rounded-[2.4rem] p-8 md:p-12 relative overflow-hidden border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05)_0%,transparent_60%)] pointer-events-none"></div>

                                    <div className="grid grid-cols-3 gap-4 items-end max-w-2xl mx-auto h-72 relative z-10">
                                        {/* 2nd Place */}
                                        <div className="flex flex-col items-center group cursor-pointer transition-transform duration-500 hover:-translate-y-2">
                                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-[3px] border-zinc-400/50 overflow-hidden mb-4 relative shadow-[0_0_30px_rgba(255,255,255,0.1)] ring-4 ring-zinc-400/10">
                                                <UserAvatar 
                                                    src={topThree[1].avatarUrl} 
                                                    fallbackName={topThree[1].fullName} 
                                                    size={100}
                                                    className="w-full h-full"
                                                />
                                                <div className="absolute bottom-0 w-full bg-zinc-400 text-black text-[10px] font-black text-center py-1 font-mono">#02</div>
                                            </div>
                                            <div className="text-white font-bold text-sm md:text-base text-center truncate w-full mb-1 font-mono tracking-tighter">{topThree[1].fullName}</div>
                                            <div className="text-zinc-500 font-mono font-black text-[10px] uppercase tracking-widest">{topThree[1].xp.toLocaleString()} XP</div>
                                            <div className="w-full h-24 md:h-32 bg-gradient-to-t from-zinc-800/20 to-transparent rounded-t-2xl mt-4 border-t border-x border-white/5 relative">
                                                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-400/30 to-transparent"></div>
                                            </div>
                                        </div>

                                        {/* 1st Place */}
                                        <div className="flex flex-col items-center group scale-110 md:scale-125 z-10 origin-bottom cursor-pointer transition-transform duration-500 hover:-translate-y-2">
                                            <div className="relative mb-3">
                                                <Crown size={32} className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
                                            </div>
                                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-[3px] border-yellow-400/50 overflow-hidden mb-4 relative shadow-[0_0_40px_rgba(250,204,21,0.3)] ring-4 ring-yellow-400/10">
                                                <UserAvatar 
                                                    src={topThree[0].avatarUrl} 
                                                    fallbackName={topThree[0].fullName} 
                                                    size={100}
                                                    className="w-full h-full"
                                                />
                                                <div className="absolute bottom-0 w-full bg-yellow-400 text-black text-[10px] font-black text-center py-1 font-mono">#01</div>
                                            </div>
                                            <div className="text-white font-black text-sm md:text-base text-center truncate w-full mb-1 font-mono tracking-tighter">{topThree[0].fullName}</div>
                                            <div className="text-yellow-400 font-mono font-black text-[10px] uppercase tracking-widest">{topThree[0].xp.toLocaleString()} XP</div>
                                            <div className="w-full h-32 md:h-40 bg-gradient-to-t from-yellow-500/10 to-transparent rounded-t-2xl mt-4 border-t border-x border-yellow-500/20 relative">
                                                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
                                                <div className="absolute inset-x-0 top-0 h-2 bg-yellow-400/10 blur-md"></div>
                                            </div>
                                        </div>

                                        {/* 3rd Place */}
                                        <div className="flex flex-col items-center group cursor-pointer transition-transform duration-500 hover:-translate-y-2">
                                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-[3px] border-orange-700/50 overflow-hidden mb-4 relative shadow-[0_0_30px_rgba(194,65,12,0.1)] ring-4 ring-orange-700/10">
                                                <UserAvatar 
                                                    src={topThree[2].avatarUrl} 
                                                    fallbackName={topThree[2].fullName} 
                                                    size={100}
                                                    className="w-full h-full"
                                                />
                                                <div className="absolute bottom-0 w-full bg-orange-700 text-white text-[10px] font-black text-center py-1 font-mono">#03</div>
                                            </div>
                                            <div className="text-white font-bold text-sm md:text-base text-center truncate w-full mb-1 font-mono tracking-tighter">{topThree[2].fullName}</div>
                                            <div className="text-orange-500/80 font-mono font-black text-[10px] uppercase tracking-widest">{topThree[2].xp.toLocaleString()} XP</div>
                                            <div className="w-full h-16 md:h-24 bg-gradient-to-t from-orange-900/10 to-transparent rounded-t-2xl mt-4 border-t border-x border-white/5 relative">
                                                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-orange-700/30 to-transparent"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. Ranking List */}
                        <div className="rank-list space-y-4">
                            {/* Header Row */}
                            <div className="grid grid-cols-12 gap-4 px-8 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] border-b border-white/5">
                                <div className="col-span-2 text-center">Pos</div>
                                <div className="col-span-6">Developer Profile</div>
                                <div className="col-span-4 text-right">XP Gauge</div>
                            </div>

                            {/* List Items */}
                            <div className="space-y-4">
                                {rest.map((entry) => (
                                    <div
                                        key={entry.userId}
                                        className={`rank-item relative rounded-2xl p-[1px] group transition-all duration-300 ${entry.userId === user?.id ? 'bg-orange-500/30' : 'bg-white/5 hover:bg-white/10'}`}
                                    >
                                        <div className={`grid grid-cols-12 gap-4 items-center p-5 rounded-[0.9rem] relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${entry.userId === user?.id ? 'bg-orange-500/10' : 'bg-black/60'}`}>
                                            <div className="col-span-2 text-center relative z-10">
                                                <span className={`inline-block font-mono font-black text-xs ${entry.rank <= 10 ? 'text-white' : 'text-zinc-600'} ${entry.userId === user?.id ? 'text-orange-400' : ''}`}>#{entry.rank.toString().padStart(2, '0')}</span>
                                            </div>
                                            <div className="col-span-6 flex items-center gap-5 relative z-10">
                                                <div className="w-12 h-12 rounded-full border border-white/10 overflow-hidden bg-zinc-900 flex items-center justify-center p-[1px]">
                                                    <UserAvatar 
                                                        src={entry.avatarUrl} 
                                                        fallbackName={entry.fullName} 
                                                        size={44}
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className={`font-mono font-black text-sm uppercase tracking-tight ${entry.userId === user?.id ? 'text-orange-400' : 'text-zinc-200 group-hover:text-white transition-colors'}`}>
                                                        {entry.fullName}
                                                        {entry.userId === user?.id && <span className="ml-3 text-[8px] bg-orange-500 text-black px-2 py-0.5 rounded-sm font-black uppercase tracking-tighter">You</span>}
                                                    </span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] text-zinc-500 font-mono font-bold tracking-widest uppercase py-0.5 px-2 bg-white/5 rounded-md border border-white/5">
                                                            Lvl {entry.level}
                                                        </span>
                                                        {entry.rank <= 10 && (
                                                            <div className="flex items-center gap-1.5 text-[10px] text-yellow-500/70 font-mono font-bold uppercase tracking-wider">
                                                                <ArrowUp size={10} /> Trend
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-4 text-right relative z-10">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-white font-black font-mono text-base tracking-tighter group-hover:text-orange-400 transition-colors">
                                                        {entry.xp.toLocaleString()}
                                                        <span className="ml-1 text-[10px] text-zinc-600 font-black">XP</span>
                                                    </span>
                                                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div className="h-full bg-orange-500/50 rounded-full" style={{ width: `${Math.min(100, (entry.xp / 10000) * 100)}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {leaderboard.length === 0 && !loading && (
                                    <div className="p-20 text-center glass-card rounded-3xl">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center">
                                                <RefreshCcw size={24} className="text-zinc-600" />
                                            </div>
                                            <p className="text-zinc-500 font-sans">No active developers found yet. <br />Start practicing to claim your spot!</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Live Pulse Feed */}
                    <div className="lg:col-span-1 space-y-6 sticky top-28 animate-fade-in-right">
                        <div className="relative rounded-[2rem] p-[1px] bg-gradient-to-b from-white/5 to-transparent overflow-hidden">
                            <div className="bg-black/60 backdrop-blur-md rounded-[1.9rem] p-8 border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                                <h3 className="text-xs font-black text-white mb-10 flex items-center gap-4 font-mono uppercase tracking-[0.3em]">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                                    </span>
                                    Live Pulse
                                </h3>
                                <div className="relative pl-6 space-y-10 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-gradient-to-b before:from-orange-500/40 before:via-white/5 before:to-transparent">
                                    {feed.slice(0, 8).map((item) => (
                                        <div key={item.id} className="relative group/item">
                                            <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-black border-2 border-orange-500/50 rounded-full z-10 group-hover/item:scale-125 transition-transform shadow-[0_0_15px_rgba(249,115,22,0.2)]"></div>
                                            <div className="text-xs leading-relaxed font-mono">
                                                <span className="font-black text-white hover:text-orange-400 transition-colors cursor-pointer block mb-1 uppercase tracking-tighter">{item.user}</span>
                                                <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest leading-none">{item.action}</span>
                                                <span className="text-orange-400/80 font-black text-[11px] block mt-1 tracking-tight">{item.item}</span>
                                            </div>
                                            <div className="text-[9px] text-zinc-700 mt-2 font-mono font-black uppercase tracking-[0.2em]">
                                                {item.time.includes('ago') ? item.time : new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Mini Promo Card */}
                        <div className="rounded-[2rem] p-8 text-center bg-white/[0.02] border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6 relative z-10">Ascend the Ranks</p>
                            <button className="w-full py-4 bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-black border border-orange-500/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative z-10 shadow-lg active:scale-95">
                                Start Challenge
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
