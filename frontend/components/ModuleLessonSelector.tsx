import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Module } from '../types';
import SpeakerButton from './SpeakerButton';

interface ModuleLessonSelectorProps {
    modules: Module[];
    currentModuleId: string;
    currentLessonId: string;
    completedLessonIds: string[];
    onLessonSelect: (lessonId: string) => void;
}

const ModuleLessonSelector: React.FC<ModuleLessonSelectorProps> = ({
    modules,
    currentModuleId,
    currentLessonId,
    completedLessonIds,
    onLessonSelect
}) => {
    const [isModuleOpen, setIsModuleOpen] = useState(false);
    const [isLessonOpen, setIsLessonOpen] = useState(false);
    const moduleRef = useRef<HTMLDivElement>(null);
    const lessonRef = useRef<HTMLDivElement>(null);

    // Find current module and lesson objects
    const currentModule = modules.find(m => m.id === currentModuleId) || modules[0];
    const currentLesson = currentModule?.lessons.find(l => l.id === currentLessonId) || currentModule?.lessons[0];

    // Get module index for display
    const moduleIndex = modules.findIndex(m => m.id === currentModule?.id) + 1;
    const lessonIndex = currentModule?.lessons.findIndex(l => l.id === currentLesson?.id) + 1;

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (moduleRef.current && !moduleRef.current.contains(event.target as Node)) {
                setIsModuleOpen(false);
            }
            if (lessonRef.current && !lessonRef.current.contains(event.target as Node)) {
                setIsLessonOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleModuleSelect = (moduleId: string) => {
        const module = modules.find(m => m.id === moduleId);
        if (module && module.lessons.length > 0) {
            onLessonSelect(module.lessons[0].id);
        }
        setIsModuleOpen(false);
    };

    const handleLessonSelect = (lessonId: string) => {
        onLessonSelect(lessonId);
        setIsLessonOpen(false);
    };

    return (
        <div className="flex items-center gap-2">
            {/* Module Selector */}
            <div ref={moduleRef} className="relative flex items-center bg-zinc-900 border border-white/10 rounded-lg transition-all hover:border-white/20">
                <button
                    onClick={() => {
                        setIsModuleOpen(!isModuleOpen);
                        setIsLessonOpen(false);
                    }}
                    className="flex-1 pl-3 pr-1 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 rounded-lg transition-all flex items-center gap-2 min-w-[120px] justify-between"
                    title="Change Module"
                >
                    <span className="truncate flex-1 text-left">
                        CH{moduleIndex}: {currentModule?.title || 'Select'}
                    </span>
                    <ChevronDown
                        size={14}
                        className={`transition-transform flex-shrink-0 ${isModuleOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Module Dropdown */}
                {isModuleOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden dropdown-menu">
                        {modules.map((module, idx) => {
                            const isActive = module.id === currentModule?.id;
                            const completedCount = module.lessons.filter(l =>
                                completedLessonIds.includes(l.id)
                            ).length;
                            const totalCount = module.lessons.length;

                            return (
                                <button
                                    key={module.id}
                                    onClick={() => handleModuleSelect(module.id)}
                                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${isActive
                                        ? 'bg-orange-500/10 text-orange-400'
                                        : 'text-zinc-300 hover:bg-white/5'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${completedCount === totalCount
                                        ? 'bg-green-500 text-white'
                                        : isActive
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-zinc-800 text-zinc-400'
                                        }`}>
                                        {completedCount === totalCount ? <Check size={12} /> : idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm truncate">{module.title}</div>
                                        <div className="text-[10px] text-zinc-500">
                                            {completedCount}/{totalCount} lessons
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Lesson Selector */}
            <div ref={lessonRef} className="relative flex items-center bg-zinc-900 border border-white/10 rounded-lg transition-all hover:border-white/20 shadow-sm shadow-black/30">
                <button
                    onClick={() => {
                        setIsLessonOpen(!isLessonOpen);
                        setIsModuleOpen(false);
                    }}
                    className="flex-1 pl-3 pr-1 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 rounded-lg transition-all flex items-center gap-2 min-w-[140px] justify-between"
                    title="Change Lesson"
                >
                    <span className="truncate flex-1 text-left">
                        L{lessonIndex}: {currentLesson?.title || 'Select'}
                    </span>
                    <ChevronDown
                        size={14}
                        className={`transition-transform flex-shrink-0 ${isLessonOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Lesson Dropdown */}
                {isLessonOpen && currentModule && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden dropdown-menu">
                        {currentModule.lessons.map((lesson, idx) => {
                            const isActive = lesson.id === currentLesson?.id;
                            const isCompleted = completedLessonIds.includes(lesson.id);

                            return (
                                <button
                                    key={lesson.id}
                                    onClick={() => handleLessonSelect(lesson.id)}
                                    className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${isActive
                                        ? 'bg-orange-500/10 text-orange-400'
                                        : 'text-zinc-300 hover:bg-white/5'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${isCompleted
                                        ? 'bg-green-500 text-white'
                                        : isActive
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-zinc-800 text-zinc-400'
                                        }`}>
                                        {isCompleted ? <Check size={12} /> : idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm truncate">{lesson.title}</div>
                                        <div className="text-[10px] text-zinc-500">
                                            ~{lesson.timeEstimateMin || 5} min
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModuleLessonSelector;
