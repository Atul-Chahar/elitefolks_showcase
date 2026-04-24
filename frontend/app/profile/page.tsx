'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import { UserStats, ActivityLog, UserAchievement } from '../../types';
import ActivityHeatmap from '../../components/ActivityHeatmap';
import SkillRadarChart from '../../components/SkillRadarChart';
import XPGrowthChart from '../../components/XPGrowthChart';
import AchievementsGrid from '../../components/AchievementsGrid';
import CourseHistoryGrid from '../../components/CourseHistoryGrid';
import { MapPin, Link as LinkIcon, Github, Linkedin, Calendar, Trophy, Zap, Clock, History, Flame, Loader2 } from 'lucide-react';
import { UserAvatar } from '../../components/UserAvatar';
import UnifiedActivityHistory from '../../components/UnifiedActivityHistory';


const ProfilePage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
    const [granularActivities, setGranularActivities] = useState<any[]>([]);
    const [achievements, setAchievements] = useState<UserAchievement[]>([]);
    const [allProgress, setAllProgress] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (user) {
                try {
                    const res = await fetch('/api/data/profile');
                    if (!res.ok) throw new Error('Failed to load profile data');
                    const data = await res.json();

                    setStats(data.stats);
                    setActivityLog(data.activityLog || []);
                    setGranularActivities(data.granularActivities || []);
                    setAchievements(data.achievements || []);
                    setAllProgress(data.allProgress || []);
                    setCourses(data.courses || []);
                } catch (error) {
                    console.error("Failed to load profile data", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadData();
    }, [user]);

    if (loading) {
        return (
            <div className="pt-24 min-h-screen bg-black px-4 md:px-8 max-w-7xl mx-auto space-y-8 animate-pulse">
                {/* Header Skeleton */}
                <div className="w-full h-48 md:h-64 rounded-[2.5rem] bg-zinc-900/50 border border-white/5" />
                {/* Mid Section Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="h-64 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 lg:col-span-1" />
                    <div className="h-64 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 lg:col-span-3" />
                </div>
            </div>
        );
    }
    if (!user || !stats) return <div className="min-h-screen pt-24 text-center text-zinc-500">User not found</div>;

    return (
        <div className="pt-24 min-h-screen bg-black text-white selection:bg-orange-500/30 overflow-x-hidden font-sans">
            {/* Background Atmosphere - Enhanced for Liquid Glass Refraction */}
            <div className="grid-bg fixed inset-0 opacity-20 pointer-events-none z-0" aria-hidden="true" />

            {/* Ambient Refraction Orbs */}
            <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen animate-pulse duration-[10000ms]" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-neutral-600/20 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen animate-pulse duration-[15000ms] delay-1000" />
            <div className="fixed top-[40%] left-[20%] w-[30vw] h-[30vh] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen animate-pulse duration-[12000ms] delay-500" />

            <div className="fixed inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 relative z-10">

                {/* header */}
                <div className="animate-fade-in-up">
                    <div className="w-full rounded-[2.5rem] p-[1px] bg-gradient-to-b from-white/10 to-transparent relative group shadow-2xl overflow-hidden">
                        <div className="bg-black/60 backdrop-blur-xl border-b border-white/5 rounded-[2.4rem] p-8 md:p-10 relative shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">

                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                                {/* Avatar Section */}
                                <div className="relative group">
                                    <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-br from-orange-500 to-red-600 shadow-[0_0_50px_rgba(249,115,22,0.2)] group-hover:scale-105 transition-transform duration-500">
                                        <div className="w-full h-full rounded-full border-[4px] border-black overflow-hidden relative bg-zinc-900">
                                            <UserAvatar 
                                                src={user.avatar} 
                                                fallbackName={user.name} 
                                                size={160}
                                                className="w-full h-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg z-20 flex items-center gap-2 font-mono">
                                        <Zap size={12} fill="currentColor" className="animate-pulse" /> LVL_{stats.level.toString().padStart(2, '0')}
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="flex-1 space-y-6">
                                    <div>
                                        <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-bebas)] tracking-wider text-white mb-2 leading-tight uppercase italic pr-4">
                                            {user.name.split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 font-black pr-2">{user.name.split(' ').slice(1).join(' ') || 'ELITE'}</span>
                                        </h1>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                                            <span className="flex items-center gap-2 text-orange-500/80">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                                                IDENT_@{stats.githubHandle || user.email?.split('@')[0]}
                                            </span>
                                            <span className="hidden md:inline text-white/10">•</span>
                                            <span className="flex items-center gap-2">
                                                <MapPin size={12} className="text-zinc-600" /> {stats.location || 'GLOBAL_NODE'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                        <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400">
                                            {stats.tagline || 'SYSTEM_OPERATOR'}
                                        </span>
                                        <div className="flex gap-2">
                                            <a href={`https://github.com/${stats.githubHandle || ''}`} className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-500 hover:border-orange-500/50 hover:text-orange-500 transition-all duration-300"><Github size={18} /></a>
                                            <a href={`https://linkedin.com/in/${stats.linkedinHandle || ''}`} className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-500 hover:border-orange-500/50 hover:text-orange-500 transition-all duration-300"><Linkedin size={18} /></a>
                                        </div>
                                    </div>
                                </div>

                                {/* Key Stats Pills - Restored Streak & Rank */}
                                <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[400px]">
                                    <div className="flex-1 bg-black/60 backdrop-blur-md rounded-3xl p-5 flex items-center justify-end gap-3 group/stat hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-default border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                                        <div className="text-right">
                                            <div className="text-2xl md:text-3xl font-[family-name:var(--font-mono)] font-bold text-white group-hover:text-orange-400 transition-colors leading-none">{stats.lessonsCompleted.toString().padStart(3, '0')}</div>
                                            <div className="text-[8px] md:text-[10px] uppercase tracking-widest text-zinc-500 font-black mt-1">SOLVED_UNITS</div>
                                        </div>
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20 shrink-0">
                                            <Trophy size={16} className="md:w-[18px] md:h-[18px]" />
                                        </div>
                                    </div>

                                    <div className="flex-1 bg-black/60 backdrop-blur-md rounded-3xl p-5 flex items-center justify-end gap-3 group/stat hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-default border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                                        <div className="text-right">
                                            <div className="text-2xl md:text-3xl font-[family-name:var(--font-mono)] font-bold text-white group-hover:text-amber-400 transition-colors leading-none">{stats.currentStreak || 1}D</div>
                                            <div className="text-[8px] md:text-[10px] uppercase tracking-widest text-zinc-500 font-black mt-1">CURR_STREAK</div>
                                        </div>
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0">
                                            <Flame size={18} className="fill-current drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                                        </div>
                                    </div>

                                    <div className="flex-1 bg-black/60 backdrop-blur-md rounded-3xl p-5 flex items-center justify-end gap-3 group/stat hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-default border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                                        <div className="text-right">
                                            <div className="text-2xl md:text-3xl font-[family-name:var(--font-mono)] font-bold text-white group-hover:text-purple-400 transition-colors leading-none">{stats.xp.toLocaleString()}</div>
                                            <div className="text-[8px] md:text-[10px] uppercase tracking-widest text-zinc-500 font-black mt-1">EXPERIENCE</div>
                                        </div>
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20 shrink-0">
                                            <Zap size={16} fill="currentColor" className="md:w-[18px] md:h-[18px]" />
                                        </div>
                                    </div>

                                    <div className="flex-1 bg-black/60 backdrop-blur-md rounded-3xl p-5 flex items-center justify-end gap-3 group/stat hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-default border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                                        <div className="text-right">
                                            <div className="text-2xl md:text-3xl font-[family-name:var(--font-mono)] font-bold text-white group-hover:text-blue-400 transition-colors leading-none">#{stats.globalRank || '---'}</div>
                                            <div className="text-[8px] md:text-[10px] uppercase tracking-widest text-zinc-500 font-black mt-1">GLOBAL_RANK</div>
                                        </div>
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shrink-0">
                                            <MapPin size={16} className="md:w-[18px] md:h-[18px]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MIDDLE SECTION: Bio & Heatmap */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in-up delay-100">
                    {/* Bio */}
                    <div className="lg:col-span-1 p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] relative group overflow-hidden">
                        <div className="bg-black/60 backdrop-blur-xl border border-white/5 rounded-[2.4rem] p-6 h-full flex flex-col shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                            <h3 className="text-xs font-black text-white/90 uppercase tracking-[0.2em] mb-8 flex items-center gap-3 group/header">
                                <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.1)] group-hover/header:border-orange-500/50 transition-all duration-300">
                                    <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)] animate-pulse" suppressHydrationWarning></div>
                                </div>
                                <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">SYSTEM_BIO</span>
                            </h3>
                            <p className="text-zinc-400 text-xs leading-relaxed font-mono">
                                {stats.bio || "> NO DATA RECORDED IN SYSTEM_LOG. PLEASE INITIALIZE BIOMETRICS."}
                            </p>
                            <div className="mt-auto pt-8 text-[9px] text-zinc-600 font-black uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={12} className="text-zinc-700" /> CREATED_AT: {new Date(stats.joinedAt).toLocaleDateString().replace(/\//g, '.')}
                            </div>
                        </div>
                    </div>

                    {/* Heatmap */}
                    <div className="lg:col-span-3 p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] relative group overflow-hidden">
                        <div className="bg-black/60 backdrop-blur-xl border border-white/5 rounded-[2.4rem] p-6 md:p-8 h-full shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                            <ActivityHeatmap activityLog={activityLog} />
                        </div>
                    </div>
                </div>

                {/* ADVANCED ANALYTICS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up delay-200">
                    <div className="p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] relative group overflow-hidden">
                        <div className="bg-black/60 backdrop-blur-xl border border-white/5 rounded-[2.4rem] p-6 md:p-8 h-[450px] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                            <SkillRadarChart stats={stats} />
                        </div>
                    </div>
                    <div className="p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] relative group overflow-hidden">
                        <div className="bg-black/60 backdrop-blur-xl border border-white/5 rounded-[2.4rem] p-6 md:p-8 h-[450px] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                            <XPGrowthChart activityLog={activityLog} />
                        </div>
                    </div>
                </div>
                {/* ACHIEVEMENTS & HISTORY */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up delay-300 pb-20">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] relative group overflow-hidden">
                            <div className="bg-black/60 backdrop-blur-xl border border-white/5 rounded-[2.4rem] p-6 md:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                                <AchievementsGrid achievements={achievements} />
                            </div>
                        </div>

                        <div className="p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] relative group overflow-hidden">
                            <div className="bg-black/60 backdrop-blur-xl border border-white/5 rounded-[2.4rem] p-6 md:p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                                <CourseHistoryGrid
                                    allProgress={allProgress}
                                    courses={courses}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="p-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] relative group overflow-hidden h-full">
                            <div className="bg-black/60 backdrop-blur-xl border border-white/5 rounded-[2.4rem] p-6 md:p-8 h-full shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                                <h3 className="text-xs font-black text-white/90 uppercase tracking-[0.2em] mb-8 flex items-center gap-3 group/header">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.1)] group-hover/header:border-orange-500/50 transition-all duration-300">
                                        <History size={20} className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                                    </div>
                                    <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">RECENT_ACTIVITY</span>
                                </h3>
                                <UnifiedActivityHistory 
                                    activities={granularActivities} 
                                    loading={loading}
                                />
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default ProfilePage;
