'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Code2, Swords, Trophy, Flame, Target, ChevronRight, Activity, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { dbService } from '../../services/dbService';
import { serverProxiedDbService } from '../../services/serverProxiedDbService';
import { UserStats } from '../../types';

const GAMIFIED_SECTIONS = [
    {
        id: 'logic',
        title: 'Logic Building',
        description: 'Master the core concepts before diving into raw syntax. Perfect to build strong algorithmic foundations.',
        icon: <Brain size={48} className="text-purple-400" />,
        color: 'from-purple-600 to-indigo-600',
        glow: 'shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)]',
        accentText: 'text-purple-400',
        borderHover: 'group-hover:border-purple-500/50',
        stats: '150+ Concepts',
        href: '/training/logic'
    },
    {
        id: 'dsa',
        title: 'DSA Library',
        description: 'Crush the classic data structures and algorithms. Solve raw problems and optimize for execution time.',
        icon: <Code2 size={48} className="text-orange-400" />,
        color: 'from-orange-500 to-red-600',
        glow: 'shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_50px_rgba(249,115,22,0.6)]',
        accentText: 'text-orange-400',
        borderHover: 'group-hover:border-orange-500/50',
        stats: '400+ Problems',
        href: '/training/dsa'
    },
    {
        id: 'competitive',
        title: '1v1 Battles',
        description: 'Real-time competitive programming. Same problem, limited time, rank points on the line. Prove your speed.',
        icon: <Swords size={48} className="text-emerald-400" />,
        color: 'from-emerald-500 to-teal-600',
        glow: 'shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)]',
        accentText: 'text-emerald-400',
        borderHover: 'group-hover:border-emerald-500/50',
        stats: 'Global Ladder',
        href: '/training/competitive'
    }
];

export default function TrainingArenaPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [trainingSolvedCount, setTrainingSolvedCount] = useState<number | null>(null);
    const [dailyChallenge, setDailyChallenge] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const loadData = async () => {
            if (user) {
                try {
                    const [statsData, solvedData, challengeData] = await Promise.all([
                        serverProxiedDbService.getUserStats(user.id),
                        serverProxiedDbService.getTrainingSolvedCount(user.id),
                        dbService.getDailyChallenge()
                    ]);
                    if (isMounted) {
                        setStats(statsData);
                        setTrainingSolvedCount(solvedData);
                        setDailyChallenge(challengeData);

                    }
                } catch (error) {
                    console.error("Failed to load training arena data", error);
                } finally {
                    if (isMounted) setLoading(false);
                }
            } else {
                // Also fetch daily challenge for guests
                try {
                    const challengeData = await dbService.getDailyChallenge();
                    if (isMounted) {
                        setDailyChallenge(challengeData);
                        setLoading(false);
                    }
                } catch (error) {
                    console.error("Failed to load daily challenge", error);
                    if (isMounted) setLoading(false);
                }
            }
        };
        loadData();
        return () => { isMounted = false; };
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex justify-center items-center bg-[#050505] text-white">
                <Activity className="text-orange-500 animate-pulse" size={32} />
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans">
            {/* Ambient Background Engine */}
            <div className="grid-bg fixed inset-0 opacity-20 pointer-events-none z-0" aria-hidden="true" />
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Dynamic colored glow based on hover state */}
                <div
                    className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[150px] rounded-[100%] transition-colors duration-1000 opacity-20"
                    style={{
                        backgroundColor: hoveredSection === 'logic' ? '#a855f7' :
                            hoveredSection === 'dsa' ? '#f97316' :
                                hoveredSection === 'competitive' ? '#10b981' : '#f97316'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/90" />
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 pb-24">

                {/* Header Profile / Stats */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 animate-fade-in-up">
                    <div className="flex flex-col gap-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md w-fit">
                            <Activity className="text-orange-500 animate-pulse" size={14} />
                            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Training Arena</span>
                        </div>
                        <h1 className="font-[family-name:var(--font-bebas)] text-6xl md:text-8xl tracking-wide flex items-center gap-4 text-white">
                            The Forge
                        </h1>
                        <p className="text-zinc-400 text-lg max-w-xl font-mono">
                            Sharpen your engineering intuition. Every problem solved adds to your global ranking.
                        </p>
                    </div>

                    {/* Gamified Stats Display */}
                    <div className="flex gap-4 p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg mt-4 md:mt-0 glass-card">
                        <div className="px-6 py-4 flex flex-col items-center justify-center border-r border-white/5">
                            <Flame size={20} className="text-orange-500 mb-1" />
                            <span className="text-2xl font-black font-mono">{stats?.currentStreak || 0}</span>
                            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Day Streak</span>
                        </div >
                        <div className="px-6 py-4 flex flex-col items-center justify-center border-r border-white/5">
                            <Target size={20} className="text-blue-500 mb-1" />
                            <span className="text-2xl font-black font-mono">{trainingSolvedCount !== null ? trainingSolvedCount : (stats?.lessonsCompleted || 0)}</span>
                            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Solved</span>
                        </div >
                        <div className="px-6 py-4 flex flex-col items-center justify-center">
                            <Trophy size={20} className="text-yellow-500 mb-1" />
                            <span className="text-2xl font-black font-mono">{stats ? stats.xp.toLocaleString() : 0}</span>
                            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Elo Rating</span>
                        </div >
                    </div >
                </div >

                {/* The 3 Main Sections */}
                < div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up delay-100" >
                    {
                        GAMIFIED_SECTIONS.map((section) => (
                            <div
                                key={section.id}
                                className={`group relative rounded-[2rem] p-1 glass-card cursor-pointer transition-all duration-500 hover:-translate-y-2`}
                                onMouseEnter={() => setHoveredSection(section.id)}
                                onMouseLeave={() => setHoveredSection(null)}
                                onClick={() => router.push(section.href)}
                            >
                                <div className={`bg-[#0A0A0A]/80 backdrop-blur-xl rounded-[1.9rem] p-8 h-[420px] flex flex-col border border-white/5 transition-colors duration-500 ${section.borderHover} relative overflow-hidden`}>

                                    {/* Background Accent element */}
                                    <div className={`absolute -right-8 -top-8 w-40 h-40 rounded-full blur-[80px] bg-gradient-to-br ${section.color} opacity-20 group-hover:opacity-40 transition-opacity duration-700`} />

                                    {/* Icon & Top label */}
                                    <div className="flex justify-between items-start w-full relative z-10 mb-8">
                                        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${section.glow} transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3`}>
                                            {section.icon}
                                        </div>
                                        <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${section.accentText}`}>
                                                {section.stats}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 flex-grow pt-4">
                                        <h2 className="text-3xl font-black text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-500 transition-all duration-300">
                                            {section.title}
                                        </h2>
                                        <p className="text-zinc-400 text-sm leading-relaxed font-light">
                                            {section.description}
                                        </p>
                                    </div>

                                    {/* Footer Action */}
                                    <div className="mt-auto relative z-10 pt-6 border-t border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                                            <span className={`text-sm font-bold uppercase tracking-wider ${section.accentText}`}>Enter Area</span>
                                            <ChevronRight size={16} className={`${section.accentText}`} />
                                        </div>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 transition-colors duration-300 group-hover:bg-gradient-to-r ${section.color}`}>
                                            <Zap size={16} className="text-white opacity-50 group-hover:opacity-100" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div >



                {/* Sub-section: Daily Challenge Callout */}
                {
                    dailyChallenge && (
                        <div className="mt-12 w-full max-w-3xl mx-auto animate-fade-in-up delay-200">
                            <div className="rounded-[2.5rem] p-1 glass-card bg-gradient-to-r from-orange-500/20 to-transparent">
                                <div className="bg-[#0A0A0A]/90 backdrop-blur-xl border border-orange-500/20 rounded-[2.4rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />

                                    <div className="flex-1 space-y-2 relative z-10">
                                        <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-widest mb-1">
                                            <Flame size={14} className="animate-bounce" /> Daily Challenge
                                        </div>
                                        <h3 className="text-2xl font-bold">{dailyChallenge.title}</h3>
                                        <p className="text-zinc-400 text-sm">
                                            [{dailyChallenge.difficulty || 'Medium'}] Solve within 15 minutes to multiply your daily XP by 2x.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/training/arena/${dailyChallenge.category.toLowerCase()}/${dailyChallenge.slug || dailyChallenge.id}`)}
                                        className="relative z-10 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] flex items-center gap-2 uppercase text-sm tracking-wider hover:scale-[1.02] active:scale-95"
                                    >
                                        Accept Challenge
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

            </div >
        </div >
    );
}
