import React from 'react';
import { BookOpen, Sparkles, Edit3, Code, HelpCircle, Zap } from 'lucide-react';

interface LearningNavigationProps {
    activeTab: 'learn' | 'ai' | 'notes' | 'practice';
    setActiveTab: (tab: 'learn' | 'ai' | 'notes' | 'practice') => void;
    onHintClick?: () => void;
    onBoostClick?: () => void;
}

const LearningNavigation: React.FC<LearningNavigationProps> = ({
    activeTab,
    setActiveTab,
    onHintClick,
    onBoostClick
}) => {
    const mainNavItems = [
        { id: 'learn', label: 'Learn', icon: BookOpen, description: 'Lesson content' },
        { id: 'practice', label: 'Practice', icon: Code, description: 'Exercises & quizzes' },
        { id: 'ai', label: 'AI Tutor', icon: Sparkles, description: 'Get AI help' },
        { id: 'notes', label: 'Notes', icon: Edit3, description: 'Your notes' },
    ] as const;

    const utilityItems = [
        { id: 'boost', label: 'Boost', icon: Zap, onClick: onBoostClick },
        { id: 'hint', label: 'Hint', icon: HelpCircle, onClick: onHintClick },
    ];

    return (
        <nav className="w-14 lg:w-16 h-full bg-zinc-950/80 backdrop-blur-sm border-r border-white/5 flex flex-col py-4 z-30">
            {/* Main Navigation Items */}
            <div className="flex flex-col items-center gap-1.5">
                {mainNavItems.map((item) => (
                    <div key={item.id} className="tooltip-container">
                        <button
                            onClick={() => setActiveTab(item.id)}
                            className={`relative flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 rounded-xl transition-all duration-200 ${activeTab === item.id
                                ? 'bg-zinc-800 text-orange-500 shadow-lg shadow-orange-500/10'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                                }`}
                            title={item.label}
                        >
                            <item.icon
                                size={20}
                                strokeWidth={activeTab === item.id ? 2.5 : 2}
                            />

                            {/* Active Indicator Bar */}
                            {activeTab === item.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-orange-500 rounded-r-full shadow-lg shadow-orange-500/50" />
                            )}
                        </button>

                        {/* Tooltip */}
                        <div className="tooltip left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-zinc-800 border border-white/10 rounded-lg shadow-xl whitespace-nowrap">
                            <div className="text-xs font-semibold text-white">{item.label}</div>
                            <div className="text-[10px] text-zinc-500">{item.description}</div>
                            {/* Arrow */}
                            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-zinc-800" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Spacer */}
            <div className="flex-grow" />

            {/* Divider */}
            <div className="w-8 h-px bg-white/10 mx-auto mb-4" />

            {/* Utility Items */}
            <div className="flex flex-col items-center gap-1.5">
                {utilityItems.map((item) => (
                    <div key={item.id} className="tooltip-container">
                        <button
                            onClick={item.onClick}
                            className="relative flex items-center justify-center w-10 h-10 lg:w-11 lg:h-11 rounded-xl text-zinc-600 hover:text-zinc-400 hover:bg-white/5 transition-all duration-200"
                            title={item.label}
                        >
                            <item.icon size={18} strokeWidth={2} />
                        </button>

                        {/* Tooltip */}
                        <div className="tooltip left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-zinc-800 border border-white/10 rounded-lg shadow-xl whitespace-nowrap">
                            <div className="text-xs font-medium text-white">{item.label}</div>
                            {/* Arrow */}
                            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-zinc-800" />
                        </div>
                    </div>
                ))}
            </div>
        </nav>
    );
};

export default LearningNavigation;
