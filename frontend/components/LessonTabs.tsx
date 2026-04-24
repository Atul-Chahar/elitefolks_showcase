import React, { useState } from 'react';
import { BookOpen, Sparkles, Edit3, Code } from 'lucide-react';

interface LessonTabsProps {
    children: (activeTab: 'learn' | 'ai' | 'notes' | 'exercises') => React.ReactNode;
}

const LessonTabs: React.FC<LessonTabsProps> = ({ children }) => {
    const [activeTab, setActiveTab] = useState<'learn' | 'ai' | 'notes' | 'exercises'>('learn');

    const tabs = [
        { id: 'learn', label: 'Learn', icon: BookOpen },
        { id: 'ai', label: 'AI Tutor', icon: Sparkles },
        { id: 'notes', label: 'Notes', icon: Edit3 },
        { id: 'exercises', label: 'Quiz & Practice', icon: Code },
    ] as const;

    return (
        <div className="flex flex-col h-full bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
            {/* Tabs Header */}
            <div className="flex items-center border-b border-zinc-800 p-1 bg-black/40">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all
                            ${activeTab === tab.id
                                ? 'bg-zinc-800 text-white shadow-sm'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                            }`}
                    >
                        <tab.icon size={16} className={activeTab === tab.id ? 'text-orange-500' : ''} />
                        <span className="hidden md:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-grow p-4 md:p-6 overflow-hidden relative">
                {/* Ambient Background Effect inside the panel */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none -z-10"></div>

                {children(activeTab)}
            </div>
        </div>
    );
};

export default LessonTabs;
