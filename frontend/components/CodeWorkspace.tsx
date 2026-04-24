import React, { useState, useEffect, useRef } from 'react';
import EditorPanel from './EditorPanel';
import ConsolePanel from './ConsolePanel';
import { ConsoleOutput, Exercise, TestResult } from '../types';
import { Play, RotateCcw, ChevronUp, ChevronDown, Terminal, History, Maximize2, Braces, Bookmark, Settings, Code as CodeIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/dbService';
import { serverProxiedDbService } from '../services/serverProxiedDbService';
import TestcasePanel from './TestcasePanel';

interface CodeWorkspaceProps {
    code: string;
    onCodeChange: (code: string | undefined) => void;
    output: ConsoleOutput[];
    exercises: Exercise[];
    onRunTests: () => TestResult[];
    onRunCode: () => void;
    onResetCode: () => void;
    lessonId?: string; // Optional lesson ID for history
    language?: string;
    testResults?: TestResult[]; // Added for structured results
    theme?: 'default' | 'theme_retro' | 'theme_cyber';
}

const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({
    code,
    onCodeChange,
    output,
    exercises,
    onRunTests,
    onRunCode,
    onResetCode,
    lessonId,
    language: initialLanguage = 'javascript',
    testResults: initialTestResults = [],
    theme = 'default'
}) => {
    const { user } = useAuth();
    const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);

    // Sync internal state with prop
    useEffect(() => {
        if (initialLanguage) {
            setSelectedLanguage(initialLanguage);
        }
    }, [initialLanguage]);

    const [isAutoDetectEnabled, setIsAutoDetectEnabled] = useState(true);
    const [isConsoleOpen, setIsConsoleOpen] = useState(false);
    const [footerTab, setFooterTab] = useState<'testcase' | 'result'>('result');
    const [activeCaseIndex, setActiveCaseIndex] = useState(0);
    const [testResults, setTestResults] = useState<TestResult[]>(initialTestResults);

    const [consoleHeight, setConsoleHeight] = useState(250); // Slightly taller by default for test cases
    const [isDragging, setIsDragging] = useState(false);
    const [isRetrieving, setIsRetrieving] = useState(false);
    const dragStartY = useRef(0);
    const dragStartHeight = useRef(0);

    const [showSolutionModal, setShowSolutionModal] = useState(false);
    const [isSolutionUnlocked, setIsSolutionUnlocked] = useState(false);
    const [solutionCode, setSolutionCode] = useState('');
    const SOLUTION_COST = 200;

    // Check if solution is unlocked for the current lesson/exercise
    useEffect(() => {
        const checkUnlockStatus = async () => {
            if (!user || !lessonId) return;
            // Assuming one main exercise per lesson for now, or use specific exercise ID if available
            // For simplicity in this iteration, we track unlock by lessonId
            const itemId = `solution_${lessonId}`;
            try {
                const inventory = await serverProxiedDbService.getInventory(user.id);
                const hasUnlocked = inventory.some(item => item.itemId === itemId);
                if (hasUnlocked) {
                    setIsSolutionUnlocked(true);
                    return;
                }
            } catch (error) {
                console.error("Failed to check unlock status:", error);
            }

            // Fallback check
            if (localStorage.getItem(itemId) === 'true') {
                setIsSolutionUnlocked(true);
            }
        };

        checkUnlockStatus();
        // Reset unlock state when lesson changes
        setShowSolutionModal(false);
    }, [user, lessonId]);

    const handleViewSolution = async () => {
        if (!user || !lessonId) return;

        // If already unlocked, just show it
        if (isSolutionUnlocked) {
            // Find the solution from exercises
            /* 
               NOTE: The solution is currently checked from the first exercise.
               In a real multi-exercise scenario, we'd need to know WHICH exercise.
               For now, we default to the first exercise's solution.
            */
            const exercise = exercises[0];
            if (exercise?.solution) {
                setSolutionCode(exercise.solution);
                setShowSolutionModal(true);
            } else {
                alert("No solution available for this exercise.");
            }
            return;
        }

        // Logic to purchase unlock
        if (confirm(`Unlock the solution for ${SOLUTION_COST} XP?`)) {
            try {
                const success = await serverProxiedDbService.unlockContent(user.id, lessonId || '', SOLUTION_COST, 'solution');
                if (success) {
                    setIsSolutionUnlocked(true);
                    const exercise = exercises[0];
                    if (exercise?.solution) {
                        setSolutionCode(exercise.solution);
                        setShowSolutionModal(true);
                    }
                    // Refresh user stats context if possible, or let the UI update naturally
                    // (Context refresh might be needed to show updated XP immediately)
                } else {
                    throw new Error("Failed to unlock solution.");
                }
            } catch (error: any) {
                console.error("Unlock error:", error);
                // Fallback to local storage if DB fails (e.g. constraints)
                const itemId = `solution_${lessonId}`;
                localStorage.setItem(itemId, 'true');
                setIsSolutionUnlocked(true);

                const exercise = exercises[0];
                if (exercise?.solution) {
                    setSolutionCode(exercise.solution);
                    setShowSolutionModal(true);
                }

                // Optional: Notify user of local fallback
                // alert("Network issue: Solution unlocked locally!"); 
            }
        }
    };


    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const langDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
                setIsLangDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const languages = [
        { id: 'javascript', name: 'JavaScript' },
        { id: 'typescript', name: 'TypeScript' },
        { id: 'python', name: 'Python' },
        { id: 'go', name: 'Go' },
        { id: 'cpp', name: 'C++' },
        { id: 'c', name: 'C' },
        { id: 'java', name: 'Java' }
    ];

    const handleLanguageSelect = (langId: string) => {
        setSelectedLanguage(langId);
        setIsLangDropdownOpen(false);
    };

    const currentLanguageName = languages.find(l => l.id === selectedLanguage)?.name || selectedLanguage;

    const handleRunCode = () => {
        onRunCode();
        setIsConsoleOpen(true);
        // If there are exercises, run tests too and switch to result tab
        if (exercises.length > 0) {
            const results = onRunTests();
            setTestResults(results);
            setFooterTab('result');
        }
    };

    const handleRetrieveLast = async () => {
        if (!user || !lessonId) return;
        setIsRetrieving(true);
        try {
            const lastSub = await dbService.getLastSubmission(user.id, lessonId);
            if (lastSub) {
                onCodeChange(lastSub.code);
                setSelectedLanguage(lastSub.language);
            } else {
                alert("No previous submission found for this lesson.");
            }
        } catch (error) {
            console.error("Retrieval failed", error);
        } finally {
            setIsRetrieving(false);
        }
    };

    const startResizing = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragStartY.current = e.clientY;
        dragStartHeight.current = consoleHeight;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'row-resize';
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const deltaY = dragStartY.current - e.clientY;
            // Clamp height between 100 and 600
            const newHeight = Math.max(100, Math.min(600, dragStartHeight.current + deltaY));
            setConsoleHeight(newHeight);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // Language Detection Heuristics
    const detectLanguage = (code: string): string | null => {
        const lines = code.split('\n').slice(0, 10); // Check first 10 lines
        const text = lines.join('\n');

        if (text.includes('#include <iostream>') || text.includes('using namespace std') || text.includes('std::cout')) return 'cpp';
        if (text.includes('#include <stdio.h>') || text.includes('printf(')) return 'c';
        if (text.includes('public class ') || text.includes('System.out.println') || text.includes('public static void main')) return 'java';
        if (text.includes('def ') || text.includes('print(') || (text.includes('import ') && !text.includes('{'))) return 'python';
        if (text.includes('function ') || text.includes('console.log') || text.includes('const ') || text.includes('let ') || text.includes('=>')) {
            // Simple diff between JS/TS could be type annotations, easier to default to 'javascript' or keep current if it's one of them
            if (text.includes('interface ') || text.includes('type ') || text.includes(': string') || text.includes(': number')) return 'typescript';
            return 'javascript';
        }
        return null;
    };

    const handleCodeChange = (newCode: string | undefined) => {
        onCodeChange(newCode);

        if (isAutoDetectEnabled && newCode) {
            const detected = detectLanguage(newCode);
            if (detected && detected !== selectedLanguage) {
                setSelectedLanguage(detected);
            }
        }
    };
    return (
        <div className="flex flex-col h-full relative">
            {/* Editor Header - Transparent / Glassmorphism - Moved outside overflow-hidden */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-zinc-950/40 backdrop-blur-md shrink-0 z-10 relative">
                <div className="flex items-center gap-4">
                    {/* Custom Language Selector */}
                    <div ref={langDropdownRef} className="relative">
                        <button
                            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                            className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-xs font-bold px-2 py-1.5 rounded-lg hover:bg-white/5"
                        >
                            <span>{currentLanguageName}</span>
                            <ChevronDown size={12} className={`text-zinc-500 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isLangDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 w-40 bg-[#0D0D0D] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 py-1">
                                {languages.map(lang => (
                                    <button
                                        key={lang.id}
                                        onClick={() => handleLanguageSelect(lang.id)}
                                        className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors flex items-center justify-between group ${selectedLanguage === lang.id
                                            ? 'bg-orange-500/10 text-orange-400'
                                            : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {lang.name}
                                        {selectedLanguage === lang.id && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="h-4 w-px bg-white/10" />

                    <button
                        onClick={() => setIsAutoDetectEnabled(!isAutoDetectEnabled)}
                        className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 transition-colors ${isAutoDetectEnabled ? 'opacity-100' : 'opacity-50'}`}
                        title={isAutoDetectEnabled ? "Auto-detection: ON" : "Auto-detection: OFF"}
                    >
                        <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)] transition-colors ${isAutoDetectEnabled ? 'bg-green-500' : 'bg-zinc-600 shadow-none'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isAutoDetectEnabled ? 'text-zinc-400' : 'text-zinc-600'}`}>Auto</span>
                    </button>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={handleRetrieveLast}
                        disabled={isRetrieving || !lessonId}
                        className="p-2 rounded-lg text-zinc-500 hover:text-orange-500 hover:bg-orange-500/10 transition-all group relative"
                        title="Retrieve Last Submission"
                    >
                        <History size={16} className={isRetrieving ? 'animate-spin' : ''} />
                        {!lessonId && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-zinc-950" />}
                    </button>

                    <button
                        className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                        title="Format Code"
                    >
                        <Braces size={16} />
                    </button>

                    <button
                        className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                        title="Bookmarks"
                    >
                        <Bookmark size={16} />
                    </button>

                    <button
                        onClick={onResetCode}
                        className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        title="Reset Code"
                    >
                        <RotateCcw size={16} />
                    </button>

                    <div className="w-px h-4 bg-white/10 mx-1" />

                    <button
                        onClick={handleRunCode}
                        className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg shadow-orange-600/20 flex items-center gap-2 active:scale-95 ml-1"
                    >
                        <Play size={14} fill="currentColor" />
                        <span>Run</span>
                    </button>

                    <button
                        onClick={handleViewSolution}
                        className={`p-2 rounded-lg transition-all ${isSolutionUnlocked ? 'text-green-500 hover:bg-green-500/10' : 'text-zinc-500 hover:text-yellow-500 hover:bg-yellow-500/10'}`}
                        title={isSolutionUnlocked ? "View Solution" : `Unlock Solution (${SOLUTION_COST} XP)`}
                    >
                        {isSolutionUnlocked ? <CodeIcon size={16} /> : <div className="flex items-center gap-1 font-bold text-[10px]"><span className="text-yellow-500">🔓</span> <span>200</span></div>}
                    </button>

                    <button
                        onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                        className={`p-2 rounded-lg transition-all ${isConsoleOpen ? 'text-orange-500 bg-orange-500/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                        title={isConsoleOpen ? "Collapse Console" : "Maximize / Open Console"}
                    >
                        <Maximize2 size={16} />
                    </button>
                </div>
            </div>

            {/* Code Editor - Takes remaining height */}
            <div className="flex-1 min-h-0 bg-transparent overflow-hidden flex flex-col relative">
                {/* Editor Content */}
                <div className="flex-grow relative">
                    <EditorPanel
                        code={code}
                        onCodeChange={handleCodeChange}
                        language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
                    />
                </div>
            </div>

            {/* Resize Handle */}
            {isConsoleOpen && (
                <div
                    onMouseDown={startResizing}
                    className="h-1 lg:h-1.5 bg-white/5 hover:bg-orange-500/50 cursor-row-resize transition-colors z-20 flex items-center justify-center group"
                >
                    <div className="w-12 h-px bg-white/10 group-hover:bg-orange-500/50 transition-colors" />
                </div>
            )}

            {/* Workspace Footer (Testcase & Console) */}
            {isConsoleOpen ? (
                /* Expanded Footer */
                <div
                    style={{ height: consoleHeight }}
                    className="min-h-0 flex flex-col bg-zinc-950/40 backdrop-blur-md overflow-hidden border-t border-white/5 animate-slide-up shrink-0"
                >
                    {/* Tabs Header */}
                    <div className="flex items-center justify-between px-4 border-b border-white/5 bg-zinc-950/60 shrink-0">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => setFooterTab('result')}
                                className={`py-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${footerTab === 'result' ? 'border-orange-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                <CodeIcon size={14} className={footerTab === 'result' ? 'text-orange-500' : ''} />
                                Test Result
                            </button>
                            <button
                                onClick={() => setFooterTab('testcase')}
                                className={`py-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${footerTab === 'testcase' ? 'border-green-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                <Terminal size={14} className={footerTab === 'testcase' ? 'text-green-500' : ''} />
                                Testcase
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                className="p-2 rounded-lg text-zinc-500 hover:text-white"
                                title="Maximize"
                            >
                                <Maximize2 size={14} />
                            </button>
                            <button
                                onClick={() => setIsConsoleOpen(false)}
                                className="p-2 rounded-lg text-zinc-500 hover:text-white transition-colors"
                            >
                                <ChevronDown size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-grow relative overflow-hidden">
                        {footerTab === 'testcase' ? (
                            <TestcasePanel
                                testCases={exercises[0]?.testCases || []}
                                activeCaseIndex={activeCaseIndex}
                                onCaseSelect={setActiveCaseIndex}
                            />
                        ) : (
                            <div className="h-full flex flex-col font-jetbrains text-sm">
                                <ConsolePanel output={output} theme={theme} />
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* Collapsed Footer Bar */
                <button
                    onClick={() => setIsConsoleOpen(true)}
                    className="flex items-center justify-between px-4 py-2.5 bg-zinc-950/60 backdrop-blur-md border-t border-white/5 hover:bg-zinc-900/60 transition-colors cursor-pointer group shrink-0"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Terminal size={14} className="text-zinc-600 group-hover:text-green-500 transition-colors" />
                            <span className="text-xs font-semibold text-zinc-500 group-hover:text-zinc-300 transition-colors font-jetbrains">
                                Testcase
                            </span>
                        </div>
                        <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                            <CodeIcon size={14} className="text-zinc-600 group-hover:text-orange-500 transition-colors" />
                            <span className="text-xs font-semibold text-zinc-500 group-hover:text-zinc-300 transition-colors font-jetbrains">
                                Console
                            </span>
                        </div>
                    </div>
                    <ChevronUp size={16} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </button>
            )}
            {/* Solution Modal */}
            {showSolutionModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setShowSolutionModal(false)} />
                    <div className="relative bg-[#0D0D0D] border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-bounce-in">
                        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-zinc-900/50">
                            <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
                                <span className="text-green-500">✓</span> Solution Code
                            </h3>
                            <button onClick={() => setShowSolutionModal(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <RotateCcw className="rotate-45" size={20} /> {/* Close icon visual hack or use X */}
                            </button>
                        </div>
                        <div className="flex-grow overflow-auto p-0 relative min-h-[400px]">
                            <EditorPanel
                                code={solutionCode}
                                onCodeChange={() => { }} // Read-only
                                readOnly={true}
                            />
                        </div>
                        <div className="p-4 border-t border-white/5 bg-zinc-900/50 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    onCodeChange(solutionCode);
                                    setShowSolutionModal(false);
                                }}
                                className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors"
                            >
                                Replace My Code
                            </button>
                            <button
                                onClick={() => setShowSolutionModal(false)}
                                className="px-4 py-2 bg-white/5 text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodeWorkspace;
