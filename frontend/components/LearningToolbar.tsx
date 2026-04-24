import React from 'react';
import { Gem, Flame, Heart, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import ModuleLessonSelector from './ModuleLessonSelector';
import { Module } from '../types';

interface LearningToolbarProps {
    // Game stats
    gems?: number;
    streak?: number;
    lives?: number;
    // Progress
    totalQuestions: number;
    completedQuestions: number;
    currentQuestionIndex?: number;
    // Module/Lesson navigation
    modules: Module[];
    currentModuleId: string;
    currentLessonId: string;
    completedLessonIds: string[];
    onLessonSelect: (lessonId: string) => void;
    // Navigation
    onPrevious?: () => void;
    onNext?: () => void;
    canGoPrevious?: boolean;
    canGoNext?: boolean;
    // Shop
    onShopClick?: () => void;
    // Boosts
    xpBoostUntil?: string;
    streakFrozenUntil?: string;
}

const LearningToolbar: React.FC<LearningToolbarProps> = ({
    gems = 0,
    streak = 0,
    lives = 5,
    totalQuestions = 10,
    completedQuestions = 3,
    currentQuestionIndex = 0,
    modules,
    currentModuleId,
    currentLessonId,
    completedLessonIds,
    onLessonSelect,
    onPrevious,
    onNext,
    canGoPrevious = true,
    canGoNext = true,
    onShopClick,
    xpBoostUntil,
    streakFrozenUntil
}) => {
    const isXpBoostActive = xpBoostUntil && new Date(xpBoostUntil) > new Date();
    const isStreakFrozen = streakFrozenUntil && new Date(streakFrozenUntil) > new Date();
    return (
        <div className="h-14 bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-white/5 flex items-center justify-between px-4 lg:px-6">
            {/* Left: Game Stats */}
            <div className="flex items-center gap-4 lg:gap-6">
                {/* Shop Button */}
                <button
                    onClick={onShopClick}
                    className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 hover:scale-105 transition-all cursor-pointer"
                    title="Shop"
                >
                    <ShoppingBag size={16} />
                </button>

                <div className="w-px h-5 bg-white/10 hidden sm:block" />

                <div
                    className="flex items-center gap-1.5 text-yellow-400 hover:scale-105 transition-transform cursor-help group relative"
                    title={isXpBoostActive ? "XP Boost Active (2x)" : "Gems"}
                >
                    <Gem size={16} fill="currentColor" className={isXpBoostActive ? 'animate-pulse text-yellow-300' : ''} />
                    <span className="text-sm font-bold font-outfit">{gems.toLocaleString()}</span>
                    {isXpBoostActive && (
                        <div className="absolute -top-1 -right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
                    )}
                </div>

                {/* Streak */}
                <div
                    className="flex items-center gap-1.5 text-orange-500 hover:scale-105 transition-transform cursor-help group relative"
                    title={isStreakFrozen ? "Streak Protection Active" : "Day Streak"}
                >
                    <Flame size={16} fill="currentColor" className={isStreakFrozen ? 'text-blue-400' : ''} />
                    <span className={`text-sm font-bold font-outfit ${isStreakFrozen ? 'text-blue-400' : ''}`}>{streak}</span>
                    {isStreakFrozen && (
                        <div className="absolute -top-1 -right-1">
                            <i className="fas fa-snowflake text-[8px] text-blue-300 animate-spin-slow"></i>
                        </div>
                    )}
                </div>

                {/* Lives */}
                <div
                    className="flex items-center gap-1.5 text-red-500 hover:scale-105 transition-transform cursor-help"
                    title="Lives"
                >
                    <Heart size={16} fill="currentColor" />
                    <span className="text-sm font-bold font-outfit">{lives}</span>
                </div>
            </div>

            {/* Center: Progress Bubbles */}
            <div className="hidden md:flex flex-1 items-center justify-center px-4 lg:px-8 max-w-xl">
                <div className="relative w-full">
                    {/* Progress Track Background */}
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-zinc-800 rounded-full" />

                    {/* Progress Bubbles */}
                    <div className="relative flex items-center justify-between">
                        {Array.from({ length: Math.min(totalQuestions, 12) }).map((_, i) => {
                            const isCompleted = i < completedQuestions;
                            const isCurrent = i === currentQuestionIndex;

                            return (
                                <div
                                    key={i}
                                    className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${isCompleted
                                        ? 'bg-green-500 border-green-500 shadow-[0_0_6px_rgba(34,197,94,0.4)]'
                                        : isCurrent
                                            ? 'bg-orange-500 border-orange-500 scale-125 shadow-[0_0_8px_orange] animate-pulse'
                                            : 'bg-[#0D0D0D] border-zinc-700'
                                        }`}
                                    title={`Lesson ${i + 1}`}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right: Module/Lesson Selectors + Navigation */}
            <div className="flex items-center gap-2 lg:gap-3">
                {/* Module/Lesson Dropdowns */}
                <div className="hidden lg:block">
                    <ModuleLessonSelector
                        modules={modules}
                        currentModuleId={currentModuleId}
                        currentLessonId={currentLessonId}
                        completedLessonIds={completedLessonIds}
                        onLessonSelect={onLessonSelect}
                    />
                </div>

                <div className="w-px h-5 bg-white/10 hidden lg:block" />

                {/* Previous Button */}
                <button
                    onClick={onPrevious}
                    disabled={!canGoPrevious}
                    className={`p-2 rounded-lg transition-all ${canGoPrevious
                        ? 'text-zinc-400 hover:text-white hover:bg-white/5'
                        : 'text-zinc-700 cursor-not-allowed'
                        }`}
                    title="Previous Lesson"
                >
                    <ChevronLeft size={18} />
                </button>

                {/* Next Button */}
                <button
                    onClick={canGoNext ? onNext : undefined}
                    className={`group flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-full transition-all shadow-lg active:scale-95 ${canGoNext
                        ? 'bg-white text-black hover:bg-zinc-200 shadow-white/5'
                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none'
                        }`}
                    title={!canGoNext ? "Complete the current exercises or quiz to advance" : "Next Lesson"}
                >
                    <span>Next</span>
                    <ChevronRight
                        size={14}
                        className={canGoNext ? 'group-hover:translate-x-0.5 transition-transform' : ''}
                    />
                </button>
            </div>
        </div>
    );
};

export default LearningToolbar;
