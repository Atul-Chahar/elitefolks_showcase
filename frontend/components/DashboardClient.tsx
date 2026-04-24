'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Course } from '../types';
import { useCourseProgress } from '../hooks/useCourseProgress';
// import { useAuth } from '../contexts/AuthContext'; // Unused
import { StaticIcon } from '../utils/courseIcons';
import LinearPath from '../components/LinearPath';
import { DailyGoalsWidget } from '../components/DashboardWidgets'; // Keep this eager for now as it's above fold on desktop? No, row 1 right.

import { Play, Sparkles, Flame, Trophy, Target, ChevronRight, BookOpen, Layers, Code } from 'lucide-react';
import { useDailyQuests } from '../hooks/useDailyQuests';
import { dbService } from '../services/dbService';
import { serverProxiedDbService } from '../services/serverProxiedDbService';
import { UserStats, Progress } from '../types';

// Lazy load heavy components below the fold or not immediately critical
const ActivityHeatmap = dynamic(() => import('../components/ActivityHeatmap'), {
    loading: () => <div className="h-48 bg-zinc-900/40 animate-pulse rounded-2xl" />,
    ssr: false // Client-side only for timezone consistency
});

// We can lazy load DailyGoalsWidget too if we want to prioritize LCP of the main hero
// const DailyGoalsWidget = dynamic(() => import('../components/DashboardWidgets').then(mod => mod.DailyGoalsWidget));

interface DashboardClientProps {
    user: any; // Using any for auth user for now, strictly should be User type
    initialStats: UserStats | null;
    initialProgress: Progress;
    initialCourse: Course | null;
    activeCourseId?: string; // UUID from DB
    allCourses?: any[];
    enrolledCourses?: any[];
}

const DashboardClient: React.FC<DashboardClientProps> = ({ user, initialStats, initialProgress, initialCourse, activeCourseId, allCourses = [], enrolledCourses = [] }) => {
    const router = useRouter();

    const course = initialCourse;
    // Use the passed UUID if available, otherwise fall back to course.id (which is slug)
    const effectiveCourseId = activeCourseId || (course?.id === 'javascript-complete' ? '54a3d869-eade-4158-90de-e99974941f04' : course?.id) || 'javascript-complete';

    // For routing, we prefer the slug (which is course.id in the App Course type)
    const courseId = course?.id || 'javascript-complete';

    // Pass initialProgress to the hook to redundant fetch
    const { progress, updateProgress } = useCourseProgress(effectiveCourseId, initialProgress);
    const { goals, loading: questsLoading } = useDailyQuests();
    const [stats, setStats] = useState<UserStats | null>(initialStats);
    const [accountRestored, setAccountRestored] = useState(false);

    // Check if account was just restored from pending deletion
    useEffect(() => {
        const restored = sessionStorage.getItem('account_restored');
        if (restored === 'true') {
            setAccountRestored(true);
            sessionStorage.removeItem('account_restored');
            // Auto-dismiss after 10 seconds
            setTimeout(() => setAccountRestored(false), 10000);
        }
    }, []);

    // Effect to update stats if user prop changes (unlikely in this flow)
    useEffect(() => {
        if (initialStats) setStats(initialStats);
    }, [initialStats]);

    // --- SELF-HEALING: Backfill completed lessons based on current position ---
    useEffect(() => {
        if (!course || !progress.currentLessonId) return;

        // Flatten all lessons to find order
        const allLessons = course.modules.flatMap(m => m.lessons);
        const currentIndex = allLessons.findIndex(l => l.id === progress.currentLessonId);

        if (currentIndex > 0) {
            const shouldBeCompleted = allLessons.slice(0, currentIndex).map(l => l.id);
            const missing = shouldBeCompleted.filter(id => !progress.completedLessons.includes(id));

            if (missing.length > 0) {
                const newCompleted = Array.from(new Set([...progress.completedLessons, ...missing]));
                updateProgress({ completedLessons: newCompleted });
            }
        }
    }, [course, progress.currentLessonId, progress.completedLessons, updateProgress]);


    // Calculate Progress - Memoized
    const progressPercentage = useMemo(() => {
        const totalLessons = course?.modules.reduce((acc, module) => acc + module.lessons.length, 0) || 0;
        const completedLessonsCount = progress.completedLessons.length;
        return totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;
    }, [course, progress.completedLessons.length]);

    const handleLessonSelect = useCallback((lessonId: string) => {
        if (user) {
            serverProxiedDbService.trackActivity(user.id, 'lesson', 0).catch(() => { });
        }
        router.push(`/courses/${courseId}/lessons/${lessonId}`);
    }, [user, router, courseId]);

    const handleResumeLearning = useCallback(() => {
        if (user) {
            serverProxiedDbService.trackActivity(user.id, 'lesson', 0).catch(() => { });
        }
        const nextLessonId = progress.currentLessonId || course?.modules[0]?.lessons[0]?.id;
        if (nextLessonId) {
            router.push(`/courses/${courseId}/lessons/${nextLessonId}`);
        } else {
            router.push('/courses');
        }
    }, [user, progress.currentLessonId, course, router, courseId]);

    const handleCourseSwitch = useCallback(async (targetCourseId: string) => {
        if (!user) return;
        try {
            await dbService.touchCourse(user.id, targetCourseId);
            window.location.href = '/dashboard';
        } catch (error) {
            console.error("Failed to switch course:", error);
        }
    }, [user]);

    // Theme Logic - Memoized
    const activeTheme = stats?.activeTheme || 'default';

    const theme = useMemo(() => {
        const getThemeStyles = (t: string) => {
            switch (t) {
                case 'cyberpunk-theme':
                    return {
                        pageBg: 'bg-[#050510]',
                        cardBg: 'bg-slate-900/60',
                        borderColor: 'border-cyan-500/30',
                        accentColor: 'text-cyan-400',
                        buttonBg: 'bg-cyan-600 hover:bg-cyan-500',
                        progressBar: 'bg-cyan-500',
                        glow: 'bg-cyan-500/20',
                        subText: 'text-cyan-200/60'
                    };
                case 'retro-terminal':
                    return {
                        pageBg: 'bg-black',
                        cardBg: 'bg-zinc-900/80',
                        borderColor: 'border-green-500/50',
                        accentColor: 'text-green-500',
                        buttonBg: 'bg-green-700 hover:bg-green-600',
                        progressBar: 'bg-green-500',
                        glow: 'bg-green-500/20',
                        subText: 'text-green-400/60'
                    };
                default:
                    return {
                        pageBg: 'bg-[#0D0D0D]',
                        cardBg: 'bg-zinc-900/40',
                        borderColor: 'border-zinc-800',
                        accentColor: 'text-orange-400',
                        buttonBg: 'bg-orange-500 hover:bg-orange-600',
                        progressBar: 'bg-orange-500',
                        glow: 'bg-orange-500/5',
                        subText: 'text-zinc-500'
                    };
            }
        };
        return getThemeStyles(activeTheme);
    }, [activeTheme]);

    return (
        <div className={`pt-20 md:pt-24 min-h-screen bg-black text-white transition-colors duration-500 font-sans selection:bg-orange-500/30 overflow-x-hidden relative`}>
            {/* Background Atmosphere */}
            <div className="grid-bg fixed inset-0 opacity-40 pointer-events-none z-0" aria-hidden="true" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_80%)] pointer-events-none z-0" aria-hidden="true" />
            <div className="fixed inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 relative z-10">

                {/* Account Restored Banner */}
                {accountRestored && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between animate-fade-in-up">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <p className="text-emerald-400 text-sm font-medium">
                                <span className="font-bold">Welcome back!</span> Your account deletion has been cancelled and your account has been fully restored.
                            </p>
                        </div>
                        <button
                            onClick={() => setAccountRestored(false)}
                            className="text-emerald-500/50 hover:text-emerald-400 transition-colors text-lg font-bold px-2"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* HEADER: User Overview & Stats */}
                <div className="pb-8 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 backdrop-blur-md">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                <span className="text-[10px] font-bold text-orange-200 uppercase tracking-widest font-mono">Enrolled in Elite Journey</span>
                            </div>
                            <h1 className="font-[family-name:var(--font-bebas)] text-6xl md:text-8xl tracking-wider text-white animate-fade-in-up">
                                {progress.completedLessons.length === 0 ? 'WELCOME ELITE,' : 'WELCOME BACK,'} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'EXPLORER'}
                                </span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-4 md:gap-8 animate-fade-in-up delay-100 p-6 md:p-8 rounded-[2rem] bg-black/40 border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] relative">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none rounded-[2rem]"></div>
                            <div className="flex flex-col items-center relative z-10">
                                <div className="flex items-center gap-2 text-orange-400">
                                    <Flame size={24} className="fill-current drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]" />
                                    <span className="text-2xl font-black font-mono">{stats?.currentStreak || 0}</span>
                                </div>
                                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-2">Day Streak</span>
                            </div>
                            <div className="h-10 w-px bg-white/5 relative z-10" />
                            <div className="flex flex-col items-center relative z-10">
                                <div className="flex items-center gap-2 text-white">
                                    <Trophy size={24} className="text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]" />
                                    <span className="text-2xl font-black font-mono">#{stats?.globalRank || stats?.level || 1}</span>
                                </div>
                                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-2">Global Rank</span>
                            </div>
                            <div className="h-10 w-px bg-white/5 relative z-10" />
                            <div className="flex flex-col items-center relative z-10">
                                <div className="flex items-center gap-2 text-white">
                                    <Sparkles size={24} className="text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]" />
                                    <span className="text-2xl font-black font-mono">{stats?.xp?.toLocaleString() || 0}</span>
                                </div>
                                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-2">Total XP</span>
                            </div>
                        </div>
                    </div>

                    {/* ACTIVE BOOSTS ROW */}
                    {((stats?.xpBoostUntil && new Date(stats.xpBoostUntil) > new Date()) ||
                        (stats?.streakFrozenUntil && new Date(stats.streakFrozenUntil) > new Date()) ||
                        (stats?.seerStoneUntil && new Date(stats.seerStoneUntil) > new Date())) && (
                            <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5 animate-fade-in">
                                {stats?.xpBoostUntil && new Date(stats.xpBoostUntil) > new Date() && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 animate-pulse">
                                        <StaticIcon icon="lucide:flask-conical" className="text-sm" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">XP Boost Active</span>
                                    </div>
                                )}
                                {stats?.streakFrozenUntil && new Date(stats.streakFrozenUntil) > new Date() && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                        <Flame size={14} className="fill-current" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Streak Frozen</span>
                                    </div>
                                )}
                                {stats?.seerStoneUntil && new Date(stats.seerStoneUntil) > new Date() && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                                        <StaticIcon icon="lucide:gem" className="text-sm" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Seer Vision Active</span>
                                    </div>
                                )}
                            </div>
                        )}
                </div>

                {/* MAIN CONTENT AREA: Flattened 12-Column Grid for Pixel-Perfect Alignment */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">

                    {/* HERO: Active Track (Row 1 Left) */}
                    <section className="lg:col-span-8 flex flex-col space-y-8">
                        <div className="flex items-center justify-between h-8">
                            <h3 className="text-xs font-black text-white tracking-[0.3em] flex items-center gap-3 uppercase animate-fade-in-up delay-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></span>
                                Active Track
                            </h3>

                            {/* ENHANCED COURSE SWITCHER */}
                            {enrolledCourses.length > 1 && (
                                <div className="flex items-center gap-2 bg-black/40 p-1 rounded-2xl border border-white/[0.03] shadow-2xl backdrop-blur-md animate-fade-in-up delay-300">
                                    {enrolledCourses.map((ec) => {
                                        const title = ec.title || '';
                                        const icon = ec.icon || '';
                                        const isJS = icon === 'JS' || title.includes('JavaScript');
                                        const isGo = icon === 'GO' || title.includes('Go') || title.includes('GO');
                                        const isCPP = icon === 'C++' || title.includes('C++');
                                        const isPython = icon === 'PY' || title.includes('Python');

                                        const isActive = ec.slug === courseId || ec.id === activeCourseId;

                                        let themeColor = 'orange';
                                        if (isJS) themeColor = 'yellow';
                                        else if (isGo) themeColor = 'blue';
                                        else if (isCPP) themeColor = 'indigo';
                                        else if (isPython) themeColor = 'emerald';

                                        const themeConfig = ({
                                            yellow: { text: 'text-yellow-400', border: 'border-yellow-500/20', dot: 'bg-yellow-500', ping: 'bg-yellow-400', shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.1)]' },
                                            blue: { text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-500', ping: 'bg-blue-400', shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.1)]' },
                                            indigo: { text: 'text-indigo-400', border: 'border-indigo-500/20', dot: 'bg-indigo-500', ping: 'bg-indigo-400', shadow: 'shadow-[0_0_15px_rgba(99,102,241,0.1)]' },
                                            emerald: { text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-500', ping: 'bg-emerald-400', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]' },
                                            orange: { text: 'text-orange-400', border: 'border-orange-500/20', dot: 'bg-orange-500', ping: 'bg-orange-400', shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.1)]' },
                                        }[themeColor as 'yellow' | 'blue' | 'indigo' | 'emerald' | 'orange']) || { text: 'text-orange-400', border: 'border-orange-500/20', dot: 'bg-orange-500', ping: 'bg-orange-400', shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.1)]' };

                                        return (
                                            <button
                                                key={ec.id}
                                                onClick={() => handleCourseSwitch(ec.id)}
                                                className={`group relative flex items-center gap-3 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                                    ${isActive
                                                        ? `bg-white/10 ${themeConfig.text} border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`
                                                        : 'text-zinc-600 hover:text-white hover:bg-white/5'
                                                    }
                                                `}
                                            >
                                                {isJS ? (
                                                    <StaticIcon icon="logos:javascript" className="text-xs" />
                                                ) : isGo ? (
                                                    <StaticIcon icon="logos:go" className="text-sm" />
                                                ) : isCPP ? (
                                                    <StaticIcon icon="logos:c-plusplus" className="text-xs" />
                                                ) : isPython ? (
                                                    <StaticIcon icon="logos:python" className="text-xs" />
                                                ) : (
                                                    <StaticIcon icon="lucide:code" className="text-xs" />
                                                )}
                                                <span className="hidden sm:inline">{title ? title.split(':')[0] : 'Untitled'}</span>

                                                {isActive && (
                                                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${themeConfig.ping} opacity-75`}></span>
                                                        <span className={`relative inline-flex rounded-full h-2 w-2 ${themeConfig.dot}`}></span>
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {!course ? (
                            <div className={`glass-card rounded-[2.5rem] p-8 md:p-12 transition-all duration-500 flex-1 flex flex-col justify-center items-center text-center space-y-6 animate-fade-in-up delay-300`}>
                                <div className="p-6 rounded-full bg-white/5 border border-white/5 mb-2">
                                    <Layers size={48} className="text-zinc-500" />
                                </div>
                                <h2 className="text-3xl font-bold text-white font-manrope">Start Your Journey</h2>
                                <p className="text-zinc-400 max-w-md leading-relaxed">You haven't enrolled in any courses yet. Browse our catalog to find your first challenge.</p>
                                <button
                                    onClick={() => router.push('/courses')}
                                    className={`px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-2xl transition-transform hover:scale-105 shadow-[0_10px_30px_-10px_rgba(234,88,12,0.5)] uppercase tracking-widest text-sm`}
                                >
                                    Browse Courses
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={handleResumeLearning}
                                className={`group relative overflow-visible rounded-[2.5rem] p-[1px] bg-gradient-to-b from-white/10 to-transparent cursor-pointer transition-all duration-500 hover:-translate-y-2 animate-fade-in-up delay-300`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />

                                <div className="bg-black/60 backdrop-blur-sm rounded-[2.4rem] p-8 md:p-12 h-full relative overflow-hidden flex flex-col justify-center border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] group-hover:border-orange-500/20 transition-colors">

                                    {/* Decoration */}
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity" />

                                    <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                                        {/* Progress Ring */}
                                        <div className="relative flex-none group-hover:scale-105 transition-transform duration-500">
                                            <svg className="w-32 h-32 md:w-40 md:h-40 transform -rotate-90 drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]" viewBox="0 0 100 100">
                                                <circle
                                                    cx="50" cy="50" r="45"
                                                    className="stroke-white/[0.03] fill-none"
                                                    strokeWidth="6"
                                                />
                                                <circle
                                                    cx="50" cy="50" r="45"
                                                    className={`${progressPercentage === 0 ? 'opacity-0' : 'stroke-orange-500'} transition-all duration-1000 ease-out fill-none`}
                                                    strokeWidth="6"
                                                    strokeDasharray="282.7"
                                                    strokeDashoffset={282.7 - (282.7 * progressPercentage) / 100}
                                                    strokeLinecap={progressPercentage > 0 ? "round" : "butt"}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-3xl md:text-4xl font-black text-white tracking-tighter font-mono">{Math.round(progressPercentage)}%</span>
                                                <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Complete</span>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-5 text-center md:text-left">
                                            <div className="flex items-center justify-center md:justify-start gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/10 shadow-inner backdrop-blur-md">
                                                    {course.icon === 'JS' || course.title.includes('JavaScript') ? (
                                                        <StaticIcon icon="logos:javascript" className="text-lg" />
                                                    ) : course.icon === 'GO' || course.title.includes('GO') || course.title.includes('Go') ? (
                                                        <StaticIcon icon="logos:go" className="text-xl" />
                                                    ) : course.icon === 'C++' || course.title.includes('C++') ? (
                                                        <StaticIcon icon="logos:c-plusplus" className="text-lg" />
                                                    ) : course.icon === 'PY' || course.title.includes('Python') ? (
                                                        <StaticIcon icon="logos:python" className="text-lg" />
                                                    ) : (
                                                        <StaticIcon icon="logos:code" className="text-lg" />
                                                    )}
                                                </div>
                                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Session</span>
                                            </div>

                                            <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-bebas)] tracking-wider text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-orange-600 transition-all uppercase italic">
                                                {course?.id === '54a3d869-eade-4158-90de-e99974941f04' || course?.id === 'javascript-complete' || course?.title === 'JavaScript Mastery' ? 'JavaScript Complete' : (course?.title || 'LOADING...')}
                                            </h2>

                                            <p className="text-zinc-500 text-sm md:text-base max-w-lg leading-relaxed font-light">
                                                {course?.description || 'Continue your learning journey with our data-driven curriculum.'}
                                            </p>

                                            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                                                <button className={`w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest shadow-[0_10px_40px_-10px_rgba(234,88,12,0.4)] hover:shadow-[0_20px_60px_-10px_rgba(234,88,12,0.6)] hover:scale-105 active:scale-95 group/btn`}>
                                                    <Play size={18} fill="currentColor" className="group-hover/btn:scale-110 transition-transform" /> Jump Back In
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/courses/${courseId}/lessons/logic-gates`);
                                                    }}
                                                    className="flex items-center gap-2 px-6 py-4 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all font-bold text-xs uppercase tracking-wider backdrop-blur-md"
                                                >
                                                    <Code size={16} /> Next Lesson
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* DAILY QUESTS (Row 1 Right) */}
                    <section className="lg:col-span-4 flex flex-col space-y-8 animate-fade-in-up delay-500">
                        <div className="flex items-center justify-between h-8">
                            <h3 className="text-xs font-black text-white tracking-[0.3em] flex items-center gap-3 uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></span>
                                Daily Quests
                            </h3>
                        </div>
                        <div className={`relative rounded-[2.5rem] p-[1px] bg-gradient-to-b from-white/10 to-transparent flex-1 flex flex-col hover:border-orange-500/20 transition-colors duration-500 overflow-hidden`}>
                            <div className="bg-black/60 backdrop-blur-sm rounded-[2.4rem] p-8 h-full shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                                <DailyGoalsWidget goals={goals} />
                            </div>
                        </div>
                    </section>

                    {/* ROADMAP: Detailed Path (Row 2 Left) */}
                    <section className="lg:col-span-8 flex flex-col space-y-8 animate-fade-in-up delay-700">
                        <div className="flex items-center justify-between h-8">
                            <h3 className="text-xs font-black text-white tracking-[0.3em] flex items-center gap-3 uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></span>
                                Training Roadmap
                            </h3>
                            {course && (
                                <button className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.2em] hover:tracking-[0.3em] duration-300">View Map</button>
                            )}
                        </div>

                        {!course ? (
                            <div className={`relative rounded-[2.5rem] p-[1px] bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center flex-1 min-h-[300px]`}>
                                <div className="bg-black/40 rounded-[2.4rem] w-full h-full flex flex-col items-center justify-center p-10 opacity-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                                    <Layers size={32} className="mx-auto mb-4" />
                                    <p className="text-[10px] uppercase tracking-[0.3em] font-black">No Active Roadmap</p>
                                </div>
                            </div>
                        ) : (
                            <div className={`relative rounded-[2.5rem] p-[1px] bg-gradient-to-b from-white/10 to-transparent transition-colors duration-500 relative overflow-hidden flex-1 group hover:border-orange-500/20 shadow-2xl`}>
                                <div className="bg-black/60 backdrop-blur-sm rounded-[2.4rem] p-6 md:p-10 h-full relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-orange-500/30 via-orange-500/10 to-transparent" />
                                    <LinearPath
                                        course={course}
                                        progress={progress}
                                        onLessonSelect={handleLessonSelect}
                                    />
                                </div>
                            </div>
                        )}
                    </section>

                    {/* SIDEBAR BOTTOM: Mentor & Library stacked */}
                    <div className="lg:col-span-4 flex flex-col space-y-8 animate-fade-in-up delay-1000">
                        {/* AI VOICE MENTOR (Level with Roadmap) */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between h-8">
                                <h3 className="text-xs font-black text-white tracking-[0.3em] flex items-center gap-3 uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                                    AI Mentor
                                </h3>
                            </div>
                            <div className="relative rounded-[2.5rem] p-[1px] bg-gradient-to-b from-indigo-500/20 to-transparent group">
                                <div className="bg-gradient-to-br from-indigo-950/20 to-black/80 backdrop-blur-md rounded-[2.4rem] p-8 relative overflow-hidden group border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-indigo-500/30 transition-colors">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-indigo-500/30 transition-all" />

                                    <div className="relative z-10 space-y-6">
                                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                            <Sparkles size={20} className="text-indigo-400" />
                                        </div>

                                        <div>
                                            <h3 className="text-2xl font-[family-name:var(--font-bebas)] tracking-wider text-white mb-2 italic">STUCK ON CODE?</h3>
                                            <p className="text-zinc-500 text-xs leading-relaxed font-sans">
                                                Talk to our AI mentor. It's like pair programming with a senior engineer, via voice.
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                const nextLessonId = progress.currentLessonId || course?.modules[0]?.lessons[0]?.id;
                                                if (nextLessonId) {
                                                    router.push(`/courses/${courseId}/lessons/${nextLessonId}?tab=ai`);
                                                } else {
                                                    router.push('/courses');
                                                }
                                            }}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <StaticIcon icon="lucide:mic" className="text-lg" />
                                            Start Voice Session
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* COURSE LIBRARY: Directly below AI Mentor */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between h-8">
                                <h3 className="text-xs font-black text-white tracking-[0.3em] flex items-center gap-3 uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></span>
                                    Library
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {allCourses && allCourses.length > 0 ? (
                                    allCourses.slice(0, 4).map((course, idx) => {
                                        // Dynamic Theme Logic
                                        const title = course.title || '';
                                        const icon = course.icon || '';
                                        const isJS = icon === 'JS' || title.includes('JavaScript');
                                        const isGo = icon === 'GO' || title.includes('Go') || title.includes('GO');
                                        const isCPP = icon === 'C++' || title.includes('C++');
                                        const isPython = icon === 'PY' || title.includes('Python');

                                        let themeColor = 'orange'; // Default
                                        if (isJS) themeColor = 'yellow';
                                        else if (isGo) themeColor = 'blue';
                                        else if (isCPP) themeColor = 'indigo';
                                        else if (isPython) themeColor = 'emerald';

                                        const themeClasses = ({
                                            yellow: { border: 'group-hover:border-yellow-500/20', iconBg: 'bg-yellow-500/10 border-yellow-500/20', text: 'group-hover:text-yellow-400', btn: 'group-hover:bg-yellow-500' },
                                            blue: { border: 'group-hover:border-blue-500/20', iconBg: 'bg-blue-500/10 border-blue-500/20', text: 'group-hover:text-blue-400', btn: 'group-hover:bg-blue-500' },
                                            indigo: { border: 'group-hover:border-indigo-500/20', iconBg: 'bg-indigo-500/10 border-indigo-500/20', text: 'group-hover:text-indigo-400', btn: 'group-hover:bg-indigo-500' },
                                            emerald: { border: 'group-hover:border-emerald-500/20', iconBg: 'bg-emerald-500/10 border-emerald-500/20', text: 'group-hover:text-emerald-400', btn: 'group-hover:bg-emerald-500' },
                                            orange: { border: 'group-hover:border-orange-500/20', iconBg: 'bg-orange-500/10 border-orange-500/20', text: 'group-hover:text-orange-400', btn: 'group-hover:bg-orange-500' },
                                        }[themeColor as 'yellow' | 'blue' | 'indigo' | 'emerald' | 'orange']) || { border: 'group-hover:border-orange-500/20', iconBg: 'bg-orange-500/10 border-orange-500/20', text: 'group-hover:text-orange-400', btn: 'group-hover:bg-orange-500' };

                                        return (
                                            <div
                                                key={course.id}
                                                onClick={() => router.push(`/courses/${course.slug}`)}
                                                style={{ animationDelay: `${1000 + (idx * 100)}ms` }}
                                                className="group relative rounded-[2rem] p-[1px] bg-gradient-to-b from-white/5 to-transparent hover:-translate-y-1 transition-transform duration-300 animate-fade-in-up"
                                            >
                                                <div className={`bg-black/60 backdrop-blur-sm rounded-[1.9rem] p-4 flex items-center justify-between border border-transparent ${themeClasses.border} cursor-pointer shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]`}>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border group-hover:scale-110 transition-transform text-white shadow-inner ${themeClasses.iconBg}`}>
                                                            {isJS ? (
                                                                <StaticIcon icon="logos:javascript" className="text-xl" />
                                                            ) : isGo ? (
                                                                <StaticIcon icon="logos:go" className="text-2xl" />
                                                            ) : isCPP ? (
                                                                <StaticIcon icon="logos:c-plusplus" className="text-xl" />
                                                            ) : isPython ? (
                                                                <StaticIcon icon="logos:python" className="text-xl" />
                                                            ) : (
                                                                <StaticIcon icon="lucide:code" className="text-xl text-zinc-500" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className={`text-white font-bold text-sm tracking-tight transition-colors mb-1 ${themeClasses.text}`}>{course.title}</h4>
                                                            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{course.level || 'Beginner'}</span>
                                                        </div>
                                                    </div>
                                                    <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-colors text-zinc-600 group-hover:text-white ${themeClasses.btn}`}>
                                                        <ChevronRight size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-zinc-500 text-xs italic p-4">No other courses available.</p>
                                )}
                            </div>
                        </section>
                    </div>


                </div>
            </div >
        </div >
    );
};

export default DashboardClient;
