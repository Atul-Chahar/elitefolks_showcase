import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, User } from 'lucide-react';
import LearningToolbar from './LearningToolbar';
import { Module } from '../types';

interface LearningHeaderProps {
    // Course/Lesson info
    courseTitle: string;
    modules: Module[];
    currentModuleId: string;
    currentLessonId: string;
    completedLessonIds: string[];
    // Navigation handlers
    onLessonSelect: (lessonId: string) => void;
    onPrevious: () => void;
    onNext: () => void;
    canGoPrevious: boolean;
    canGoNext: boolean;
    // Stats (optional, will use defaults if not provided)
    gems?: number;
    streak?: number;
    lives?: number;
    totalQuestions?: number;
    completedQuestions?: number;
    currentQuestionIndex?: number;
    // Shop
    onShopClick?: () => void;
    // Boosts
    xpBoostUntil?: string;
    streakFrozenUntil?: string;
}

import { useAuth } from '../contexts/AuthContext';

const LearningHeader: React.FC<LearningHeaderProps> = ({
    courseTitle,
    modules,
    currentModuleId,
    currentLessonId,
    completedLessonIds,
    onLessonSelect,
    onPrevious,
    onNext,
    canGoPrevious,
    canGoNext,
    gems = 0,
    streak = 0,
    lives = 5,
    totalQuestions = 10,
    completedQuestions = 3,
    currentQuestionIndex = 0,
    onShopClick,
    xpBoostUntil,
    streakFrozenUntil
}) => {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <div className="flex flex-col z-[110] shrink-0">
            {/* Row 1: Global Navigation (Boot.dev Style) */}
            <header className="h-14 bg-[#0D0D0D] border-b border-white/5 flex items-center justify-between px-4 lg:px-6 text-sm">
                {/* Left: Logo */}
                <div
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => router.push('/')}
                >
                    <img
                        src="/voicecode-logo.png"
                        alt="EliteFolks Logo"
                        className="h-8 w-auto"
                    />
                    <span className="text-lg font-bold tracking-tight text-white font-outfit">
                        EliteFolks
                    </span>
                </div>

                {/* Center: Nav Actions */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-zinc-400">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="hover:text-white transition-colors font-outfit"
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => router.push('/courses')}
                        className="hover:text-white transition-colors font-outfit"
                    >
                        Courses
                    </button>
                    <button
                        onClick={() => router.push('/training')}
                        className="hover:text-white transition-colors font-outfit"
                    >
                        Training
                    </button>
                    <button
                        onClick={() => router.push('/pricing')}
                        className="hover:text-white transition-colors font-outfit"
                    >
                        Pricing
                    </button>
                    <button
                        onClick={() => router.push('/community')}
                        className="hover:text-white transition-colors font-outfit"
                    >
                        Community
                    </button>
                    <button
                        onClick={() => router.push('/leaderboard')}
                        className="hover:text-white transition-colors font-outfit"
                    >
                        Leaderboard
                    </button>
                </nav>

                {/* Right: User Actions */}
                <div className="flex items-center gap-3 lg:gap-4">
                    {/* Notifications */}
                    <button className="relative text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                        <Bell size={18} />
                    </button>

                    {/* User Avatar */}
                    <button
                        onClick={() => router.push('/profile')}
                        className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 text-zinc-400 hover:border-white/30 transition-all hover:scale-105 overflow-hidden"
                    >
                        {user?.avatar ? (
                            <img 
                                src={user.avatar} 
                                alt={user.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${user.name}&background=18181b&color=a1a1aa`;
                                }}
                            />
                        ) : (
                            <User size={20} />
                        )}
                    </button>
                </div>
            </header>

            {/* Row 2: Learning Toolbar */}
            <LearningToolbar
                gems={gems}
                streak={streak}
                lives={lives}
                totalQuestions={totalQuestions}
                completedQuestions={completedQuestions}
                currentQuestionIndex={currentQuestionIndex}
                modules={modules}
                currentModuleId={currentModuleId}
                currentLessonId={currentLessonId}
                completedLessonIds={completedLessonIds}
                onLessonSelect={onLessonSelect}
                onPrevious={onPrevious}
                onNext={onNext}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
                onShopClick={onShopClick}
                xpBoostUntil={xpBoostUntil}
                streakFrozenUntil={streakFrozenUntil}
            />
        </div>
    );
};

export default LearningHeader;