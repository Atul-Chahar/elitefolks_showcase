import React from 'react';
import { Lesson } from '../types';
import { Terminal, Play, Zap, ChevronRight, Clock, Target, Info, Lightbulb, HelpCircle, Book, Volume2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SpeakerButton from './SpeakerButton';
import { RichLessonRenderer } from './rich-content';

import { StaticIcon } from '../utils/courseIcons';

interface LessonContentPanelProps {
    lesson: Lesson;
    courseId?: string;
    courseTitle?: string;
    courseIcon?: string;
    language?: string;
}

const getCourseIcon = (courseId: string = '', courseTitle: string = '', courseIcon: string = '', language: string = '') => {
    const id = courseId.toLowerCase();
    const title = courseTitle.toLowerCase();
    const icon = courseIcon?.toLowerCase() || '';
    const lang = language.toLowerCase();

    if (icon === 'c++' || title.includes('c++') || id.includes('cpp') || lang === 'cpp' || lang === 'c++') {
        return { icon: 'logos:c-plusplus', color: 'bg-blue-900/20', shadow: 'shadow-blue-500/10', textColor: 'text-blue-400', borderColor: 'border-blue-500/20', label: 'C++' };
    }
    if (icon === 'python' || title.includes('python') || id.includes('python') || lang === 'python') {
        return { icon: 'logos:python', color: 'bg-yellow-900/20', shadow: 'shadow-yellow-500/10', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/20', label: 'Python' };
    }
    if (icon === 'go' || title.includes('go') || id.includes('go') || lang === 'go') {
        return { icon: 'logos:go', color: 'bg-cyan-900/20', shadow: 'shadow-cyan-500/10', textColor: 'text-cyan-400', borderColor: 'border-cyan-500/20', label: 'Go' };
    }
    if (icon === 'rust' || title.includes('rust') || id.includes('rust') || lang === 'rust') {
        return { icon: 'logos:rust', color: 'bg-orange-900/20', shadow: 'shadow-orange-500/10', textColor: 'text-orange-400', borderColor: 'border-orange-500/20', label: 'Rust' };
    }
    if (icon === 'java' || (title.includes('java') && !title.includes('script')) || (id.includes('java') && !id.includes('script')) || lang === 'java') {
        return { icon: 'logos:java', color: 'bg-red-900/20', shadow: 'shadow-red-500/10', textColor: 'text-red-400', borderColor: 'border-red-500/20', label: 'Java' };
    }

    // Default to JavaScript
    return { icon: 'logos:javascript', color: 'bg-yellow-500/10', shadow: 'shadow-yellow-500/10', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/20', label: 'JavaScript' };
};

const LessonContentPanel: React.FC<LessonContentPanelProps> = ({ lesson, courseId, courseTitle, courseIcon, language }) => {
    const iconStyle = getCourseIcon(courseId, courseTitle, courseIcon, language);

    // Aggregate lesson text for dictation
    const lessonText = React.useMemo(() => {
        let fullText = `${lesson.title}. `;

        if (lesson.objectives?.length) {
            fullText += "Learning Objectives: " + lesson.objectives.join(". ") + ". ";
        }

        if (lesson.content.explanations?.length) {
            lesson.content.explanations.forEach(item => {
                const content = typeof item === 'string' ? item : (item as any).content || '';
                const title = typeof item === 'object' ? (item as any).title : null;
                const term = typeof item === 'object' ? (item as any).term : null;
                const definition = typeof item === 'object' ? (item as any).definition : null;

                if (title) fullText += `${title}. `;
                if (term) fullText += `${term}: ${definition}. `;
                if (content) fullText += `${content}. `;
            });
        }

        fullText += "Assignment Steps. Step 1: Press the run button. Step 2: Press the submit button.";

        return fullText;
    }, [lesson]);


    // Helper to safely render text that might be an object
    const safeRender = (text: any) => {
        if (typeof text === 'string') return text;
        if (typeof text === 'number') return String(text);
        if (!text) return '';
        if (typeof text === 'object') {
            if ('text' in text) return (text as any).text;
            return JSON.stringify(text); // Fallback for debugging
        }
        return String(text);
    };

    return (
        <div className="h-full overflow-y-auto custom-scrollbar bg-[#0a0a0a]">
            <div className="px-6 py-8 space-y-8">
                {/* Main Title - Serif Style like onboarding */}
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-3xl md:text-4xl font-serif font-normal text-white leading-tight tracking-tight">
                        {safeRender(lesson.title)}
                    </h1>
                    <SpeakerButton text={lessonText} className="flex-shrink-0" size={20} />
                </div>

                {/* Feature Card - Dynamic branding */}
                <div className={`rounded-xl p-5 border flex items-center gap-4 ${iconStyle.color} ${iconStyle.borderColor} transition-colors duration-300`}>
                    <div className={`w-14 h-14 bg-[#0D0D0D] rounded-xl flex items-center justify-center shadow-lg border border-white/5`}>
                        <StaticIcon icon={iconStyle.icon} className="text-3xl" />
                    </div>
                    <div>
                        <h3 className={`${iconStyle.textColor} font-semibold text-lg`}>Learn by doing</h3>
                        <p className="text-zinc-500 text-sm">Write real {iconStyle.label} code to solve problems</p>
                    </div>
                </div>

                {/* Objectives Section */}
                {lesson.objectives && lesson.objectives.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Target size={18} className="text-orange-500" />
                            Learning Objectives
                        </h2>
                        <ul className="space-y-2">
                            {lesson.objectives.map((objective, i) => (
                                <li key={i} className="flex items-start gap-3 text-zinc-400 text-sm">
                                    <ChevronRight size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                                    <span>{safeRender(objective)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Main Content / Explanations */}
                {lesson.content.explanations && lesson.content.explanations.length > 0 && (
                    <div className="space-y-4">
                        {/* Detect rich content (typed section objects) vs legacy HTML strings */}
                        {lesson.content.explanations && lesson.content.explanations.length > 0 &&
                            typeof lesson.content.explanations[0] === 'object' &&
                            lesson.content.explanations[0] !== null &&
                            'type' in (lesson.content.explanations[0] as any) ? (
                            /* Rich Content Mode — new JSON pipeline */
                            <RichLessonRenderer sections={lesson.content.explanations as any[]} />
                        ) : (
                            /* Legacy Mode — old HTML string pipeline / markdown pipeline */
                            <div className="space-y-6">
                                {lesson.content.explanations && lesson.content.explanations.map((item, i) => {
                                    const type = typeof item === 'string' ? 'text' : (item as any).type || 'text';
                                    let content = typeof item === 'string' ? item : (item as any).content || '';

                                    // Defensive check for content being an object
                                    if (typeof content === 'object') {
                                        content = JSON.stringify(content);
                                    }

                                    if (type === 'text') {
                                        return (
                                            <div key={i} className="prose prose-invert max-w-none text-zinc-300 text-[15px] leading-relaxed">
                                                <ReactMarkdown
                                                    components={{
                                                        img: ({ node, ...props }) => {
                                                            if (!props.src) return null;
                                                            return <img {...props} />;
                                                        }
                                                    }}
                                                >
                                                    {content}
                                                </ReactMarkdown>
                                            </div>
                                        );
                                    }

                                    // Return null for other types as they are handled by RichLessonRenderer if we are in Rich Mode
                                    // But here we are in Legacy Mode, so we might want to handle Callouts etc. if they are present but renderer is not chosen
                                    // For now, let's keep the existing logic from HEAD as fallback
                                    if (type === 'callout') {
                                        const style = (item as any).style || 'info';
                                        const title = (item as any).title;
                                        return (
                                            <div key={i} className={`p-5 rounded-2xl border ${style === 'tip' ? 'bg-orange-500/5 border-orange-500/20' : 'bg-blue-500/5 border-blue-500/20'} flex gap-4`}>
                                                <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${style === 'tip' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                    {style === 'tip' ? <Lightbulb size={18} /> : <Info size={18} />}
                                                </div>
                                                <div className="space-y-1">
                                                    {title && <h4 className={`font-bold text-sm ${style === 'tip' ? 'text-orange-400' : 'text-blue-400'}`}>{title}</h4>}
                                                    <div className="text-zinc-400 text-sm leading-relaxed prose prose-invert max-w-none">
                                                        <ReactMarkdown
                                                            components={{
                                                                img: ({ node, ...props }) => {
                                                                    if (!props.src) return null;
                                                                    return <img {...props} />;
                                                                }
                                                            }}
                                                        >
                                                            {content}
                                                        </ReactMarkdown>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }

                                    if (type === 'key_concept') {
                                        const term = (item as any).term;
                                        const definition = (item as any).definition;
                                        const icon = (item as any).icon;

                                        return (
                                            <div key={i} className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xl">
                                                        {icon || <Book size={20} className="text-orange-500" />}
                                                    </div>
                                                    <h4 className="text-lg font-bold text-white tracking-tight">{term}</h4>
                                                </div>
                                                <p className="text-zinc-400 text-sm leading-relaxed">{definition}</p>
                                            </div>
                                        );
                                    }

                                    if (type === 'visual_aid') {
                                        const description = (item as any).description;
                                        const altText = (item as any).alt_text;
                                        return (
                                            <div key={i} className="space-y-3">
                                                <div className="aspect-video w-full rounded-2xl bg-zinc-900/80 border border-white/10 flex flex-col items-center justify-center p-8 text-center gap-4">
                                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                                        <Zap className="text-orange-500" size={32} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Visual Aid: Interactive Component</p>
                                                        <p className="text-zinc-300 text-sm italic">"{altText || 'Content Visualization'}"</p>
                                                    </div>
                                                </div>
                                                {description && <p className="text-xs text-zinc-500 italic text-center px-4">{description}</p>}
                                            </div>
                                        );
                                    }

                                    return null;
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Assignment Section - Like onboarding style */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                    <h2 className="text-xl font-bold text-white">Assignment</h2>

                    <div className="space-y-3">
                        {/* Step 1 */}
                        <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-zinc-400 flex-shrink-0">
                                1
                            </span>
                            <p className="text-zinc-400 text-sm">
                                Press the{' '}
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-800 rounded text-zinc-200 text-xs font-medium border border-zinc-700">
                                    <Play size={10} fill="currentColor" />
                                    Run
                                </span>
                                {' '}button to run the code I wrote for you.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-zinc-400 flex-shrink-0">
                                2
                            </span>
                            <p className="text-zinc-400 text-sm">
                                Press the{' '}
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-500 rounded text-white text-xs font-medium">
                                    <Play size={10} fill="currentColor" />
                                    Submit
                                </span>
                                {' '}button to run and submit the code.
                            </p>
                        </div>

                        {/* Navigation hint */}
                        <p className="text-zinc-600 text-xs mt-4">
                            Press the <span className="text-zinc-400">→</span> right arrow at the top-right of the screen to go to the next lesson.
                        </p>
                    </div>
                </div>

                {/* Time Estimate */}
                {lesson.timeEstimateMin && (
                    <div className="flex items-center gap-2 text-zinc-600 text-sm pt-4">
                        <Clock size={14} />
                        <span>Estimated time: {lesson.timeEstimateMin} min</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LessonContentPanel;
