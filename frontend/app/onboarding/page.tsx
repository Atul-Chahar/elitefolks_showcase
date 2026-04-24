'use client';

import { ConsoleOutput } from '../../types';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import {
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Trophy,
    Target,
    BookOpen,
    Code,
    Zap,
    Github,
    Mail,
    CheckCircle2,
    Gift,
    Gamepad2,
    Rocket,
    AlertCircle
} from 'lucide-react';
import { Icon } from '@iconify/react';
import Editor from '@monaco-editor/react';
// import { executePythonCode, isPyodideLoaded, loadPyodide } from '../../utils/pythonExecutor';
import { useCodeExecution } from '../../hooks/useCodeExecution';
import dynamic from 'next/dynamic';

const StepMotivation = dynamic(() => import('./components/StepMotivation'));



const OnboardingPage = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [selections, setSelections] = useState({
        motivation: '',
        experience: '',
        interest: '',
        xpTarget: 0
    });
    const { user, loading: authLoading } = useAuth();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!authLoading) {
            if (user) {
                router.replace('/dashboard');
            } else {
                setIsLoaded(true);
            }
        }
    }, [user, authLoading, router]);

    const totalSteps = 6;

    const nextStep = () => {
        if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
        else router.push('/dashboard');
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
        else router.push('/');
    };

    if (!isLoaded) return null;

    return (
        <div className="h-screen flex flex-col bg-[#0A0A0B] text-white font-manrope selection:bg-orange-500/30 overflow-hidden relative">
            {/* Background Texture/Marble effect */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1)_0%,transparent_100%)]"></div>
            </div>

            {/* Premium Styling */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
                .font-premium-serif {
                    font-family: "Playfair Display", serif;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}} />

            {/* Header Navigation - Premium Glassmorphism */}
            <header className="fixed top-0 w-full px-6 py-4 flex items-center z-50 bg-[#0A0A0B]/60 backdrop-blur-xl border-b border-white/5 shadow-2xl">
                {/* Subtle glass glare effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none"></div>
                {/* Left Section (Skip) */}
                <div className="flex-1 flex justify-start">
                    <button
                        onClick={() => router.push('/signup')}
                        className="px-5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white"
                    >
                        Sign-in and skip
                    </button>
                </div>

                {/* Center Section (Progress Bar Dots) - 12 dots for 6 steps */}
                <div className="flex-none flex items-center gap-2 md:gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((dot) => {
                        const isActive = dot <= (currentStep * 2);
                        const isCurrent = dot === (currentStep * 2) || dot === (currentStep * 2 - 1);

                        return (
                            <div key={dot} className="relative flex items-center justify-center">
                                {isCurrent && (
                                    <div className="absolute w-2.5 h-2.5 bg-orange-500/40 blur-md rounded-full animate-pulse"></div>
                                )}
                                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isActive ? 'bg-orange-500 scale-125' : 'bg-zinc-800'}`}></div>
                                {dot < 12 && (
                                    <div className={`absolute left-full w-2 md:w-3 h-[1px] ${isActive ? 'bg-orange-500/50' : 'bg-zinc-800'}`}></div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Right Section (Navigation) */}
                <div className="flex-1 flex justify-end items-center gap-3">
                    <button
                        onClick={prevStep}
                        className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-zinc-400 hover:text-white"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextStep}
                        className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-zinc-400 hover:text-white"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10 px-6 pt-28 pb-12 md:pt-32 md:pb-20 flex flex-col items-center">
                <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center">
                    {currentStep === 1 && <StepMotivation onSelect={(val) => { setSelections({ ...selections, motivation: val }); setTimeout(nextStep, 100); }} />}
                    {currentStep === 2 && <StepExperience onSelect={(val) => { setSelections({ ...selections, experience: val }); setTimeout(nextStep, 100); }} />}
                    {currentStep === 3 && <StepInterests onSelect={(val) => { setSelections({ ...selections, interest: val }); setTimeout(nextStep, 100); }} />}
                    {currentStep === 4 && <StepGoals onSelect={(xp) => { setSelections({ ...selections, xpTarget: xp }); setTimeout(nextStep, 100); }} />}
                    {currentStep === 5 && <StepLesson onComplete={nextStep} />}
                    {currentStep === 6 && <StepAuth />}
                </div>
            </main>
        </div>
    );
};

// const StepMotivation = ({ onSelect }: { onSelect: (val: string) => void }) => {
//     const [selected, setSelected] = useState('');

//     const options = [
//         { id: 'career', label: 'To start a new career in tech' },
//         { id: 'upskill', label: 'To upskill for my current job' },
//         { id: 'school', label: 'I need it for school' },
//         { id: 'projects', label: 'To build my own projects' },
//         { id: 'fun', label: 'Just for fun' },
//     ];

//     const handleSelect = (id: string) => {
//         setSelected(id);
//         onSelect(id);
//     };

//     return (
//         <div className="max-w-xl w-full flex flex-col items-center">
//             <div className="flex items-center gap-4 mb-10 bg-zinc-900/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
//                 <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center relative overflow-hidden group">
//                     <div className="absolute inset-0 bg-orange-500/5 group-hover:scale-110 transition-transform duration-500" />
//                     <img src="/voicecode-logo.png" alt="VoiceCode Logo" className="w-8 h-8 object-contain relative z-10" />
//                 </div>
//                 <p className="text-zinc-300 text-sm md:text-base font-medium leading-relaxed">
//                     Great work on those lessons! Let's gather just a bit more info... <br />
//                     <span className="text-white font-bold">Why do you want to learn to code?</span>
//                 </p>
//             </div>

//             <div className="w-full space-y-4">
//                 {options.map((opt) => (
//                     <button
//                         key={opt.id}
//                         onClick={() => handleSelect(opt.id)}
//                         className={`w-full py-5 px-8 rounded-2xl border transition-all duration-500 text-center font-medium relative overflow-hidden group/opt ${selected === opt.id
//                             ? 'bg-white text-black border-white shadow-[0_0_40px_rgba(255,255,255,0.15)] scale-[1.02]'
//                             : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:border-orange-500/30 hover:bg-zinc-900/60 hover:text-white'
//                             }`}
//                     >
//                         <div className={`absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 translate-x-[-100%] group-hover/opt:translate-x-[100%] transition-transform duration-1000`} />
//                         {opt.label}
//                     </button>
//                 ))}
//             </div>
//         </div>
//     );
// };

const StepExperience = ({ onSelect }: { onSelect: (val: string) => void }) => {
    const [selected, setSelected] = useState('');

    const options = [
        { id: 'new', label: "Nope, I'm totally new!" },
        { id: 'some', label: 'Yes, just enough to be dangerous' },
        { id: 'pro', label: "Yes, I've built large projects before" },
    ];

    const handleSelect = (id: string) => {
        setSelected(id);
        onSelect(id);
    };

    return (
        <div className="max-w-xl w-full flex flex-col items-center">
            <div className="flex items-center gap-4 mb-10 bg-zinc-900/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-orange-500/5 group-hover:scale-110 transition-transform duration-500" />
                    <img src="/voicecode-logo.png" alt="EliteFolks Logo" className="w-8 h-8 object-contain relative z-10" />
                </div>
                <p className="text-zinc-300 text-sm md:text-base font-medium leading-relaxed">
                    Have you coded much before?
                </p>
            </div>

            <div className="w-full space-y-4">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => handleSelect(opt.id)}
                        className={`w-full py-5 px-8 rounded-2xl border transition-all duration-500 text-center font-medium relative overflow-hidden group/opt ${selected === opt.id
                            ? 'bg-white text-black border-white shadow-[0_0_40px_rgba(255,255,255,0.15)] scale-[1.02]'
                            : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:border-orange-500/30 hover:bg-zinc-900/60 hover:text-white'
                            }`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 translate-x-[-100%] group-hover/opt:translate-x-[100%] transition-transform duration-1000`} />
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const StepInterests = ({ onSelect }: { onSelect: (val: string) => void }) => {
    const [selected, setSelected] = useState('');
    const [promo, setPromo] = useState('');

    const options = [
        { id: 'python-go', label: 'Backend dev in Python and Go' },
        { id: 'python-ts', label: 'Backend dev in Python and TS' },
        { id: 'python-sql', label: 'Data analytics in Python and SQL' },
        { id: 'not-sure', label: "I'm not sure" },
    ];

    const handleSelect = (id: string) => {
        setSelected(id);
        onSelect(id);
    };

    return (
        <div className="max-w-xl w-full flex flex-col items-center">
            <div className="flex items-center gap-4 mb-10 bg-zinc-900/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="w-14 h-14 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-orange-500/5 group-hover:scale-110 transition-transform duration-500" />
                    <img src="/voicecode-logo.png" alt="EliteFolks Logo" className="w-8 h-8 object-contain relative z-10" />
                </div>
                <p className="text-zinc-300 text-sm md:text-base font-medium leading-relaxed">
                    Greetings, I'm EliteFolks! Let's find a learning path for you. <br />
                    <span className="text-white font-bold">What are you most interested in?</span>
                </p>
            </div>

            <div className="w-full space-y-4 mb-12">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => handleSelect(opt.id)}
                        className={`w-full py-5 px-8 rounded-2xl border transition-all duration-500 text-center font-medium relative overflow-hidden group/opt ${selected === opt.id
                            ? 'bg-white text-black border-white shadow-[0_0_40px_rgba(255,255,255,0.15)] scale-[1.02]'
                            : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:border-orange-500/30 hover:bg-zinc-900/60 hover:text-white'
                            }`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 translate-x-[-100%] group-hover/opt:translate-x-[100%] transition-transform duration-1000`} />
                        {opt.label}
                    </button>
                ))}
            </div>

            <div className="w-full max-w-xs relative group mt-8">
                <input
                    type="text"
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Have a promo code?"
                    className="w-full bg-transparent border-b border-zinc-800 py-2 px-1 text-xs text-center focus:border-orange-500 transition-colors outline-none text-zinc-400 font-medium"
                />
                {promo && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 text-orange-500">
                        <CheckCircle2 size={14} />
                    </div>
                )}
            </div>
        </div>
    );
};

const StepGoals = ({ onSelect }: { onSelect: (xp: number) => void }) => {
    const [selected, setSelected] = useState(0);

    const goals = [
        { xp: 250, label: 'Earn 250 XP within 24 hours', level: 'Easy', detail: 'unlock a common chest', icon: <Icon icon="flat-color-icons:package" width={48} height={48} /> },
        { xp: 1000, label: 'Earn 1,000 XP within 24 hours', level: 'Medium', detail: 'unlock an uncommon chest', icon: <Icon icon="flat-color-icons:safe" width={48} height={48} /> },
        { xp: 3000, label: 'Earn 3,000 XP within 24 hours', level: 'Hard', detail: 'unlock a rare chest', icon: <Icon icon="flat-color-icons:addressed-envelope" width={56} height={56} /> },
    ];

    const handleSelect = (xp: number) => {
        setSelected(xp);
        onSelect(xp);
    };

    return (
        <div className="max-w-2xl w-full flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl font-premium-serif mb-4 text-white font-medium tracking-tight">
                Set a goal for today with a quest
            </h2>
            <p className="text-zinc-500 mb-16 max-w-md">
                Complete your quest before it expires to earn bonus experience!
            </p>

            <div className="w-full space-y-8">
                {goals.map((goal) => (
                    <div key={goal.xp} className="flex items-center justify-between group">
                        <button
                            onClick={() => handleSelect(goal.xp)}
                            className={`px-8 py-2.5 rounded-full border transition-all font-bold text-xs uppercase tracking-widest ${selected === goal.xp
                                ? 'bg-white text-black border-white'
                                : 'bg-transparent border-white/20 text-white hover:bg-white/5'
                                }`}
                        >
                            Accept
                        </button>

                        <div className="flex items-center gap-6 text-left flex-1 ml-10">
                            <div className="transition-transform group-hover:scale-110 duration-500">
                                {goal.icon}
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">{goal.label}</h4>
                                <p className="text-sm text-zinc-500">
                                    <span className={`font-bold uppercase tracking-wider text-[10px] mr-2 ${goal.level === 'Easy' ? 'text-green-500' : goal.level === 'Medium' ? 'text-blue-500' : 'text-orange-500'
                                        }`}>{goal.level}:</span>
                                    {goal.detail}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StepLesson = ({ onComplete }: { onComplete: () => void }) => {
    const [code, setCode] = useState('print("Welcome to Fantasy Quest!")');
    const [consoleOutput, setConsoleOutput] = useState<ConsoleOutput[]>([]);
    const [isConsoleOpen, setIsConsoleOpen] = useState(false);

    // New Hook Usage
    const { runCode, isRunning } = useCodeExecution();
    const isLoadingPyodide = false; // Flag deprecated, keeping false
    const isPyodideReady = true; // Always true now

    // Real Python execution using Server-Side API (previously Pyodide)
    const handleRunCode = async () => {
        setConsoleOutput([]);
        setIsConsoleOpen(true);

        await runCode(code, 'python', {
            onLog: (output) => setConsoleOutput(prev => [...prev, output]),
            onComplete: () => {
                // onComplete is called when execution finishes
            }
        });
    };

    const handleResetCode = () => {
        setCode('print("Welcome to Fantasy Quest!")');
        setConsoleOutput([]);
    };

    return (
        <div className="absolute inset-0 flex flex-col h-full bg-[#0A0A0B] z-0">
            <div className="flex-1 flex overflow-hidden pt-20">
                {/* Left Panel - Lesson Content */}
                <div className="w-[45%] p-10 overflow-y-auto border-r border-white/5 space-y-8 custom-scrollbar">
                    <div>
                        <h2 className="text-3xl font-premium-serif mb-6 text-white font-medium">Welcome to Learn Python</h2>

                        {/* Python Branding Banner */}
                        <div className="w-full aspect-[21/9] rounded-2xl bg-gradient-to-br from-[#060610] to-[#121230] border border-white/5 overflow-hidden flex items-center p-8 gap-8 relative mb-8 group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(55,118,171,0.2),transparent_70%)] opacity-50"></div>
                            <div className="w-24 h-24 flex-none relative z-10 drop-shadow-[0_0_20px_rgba(55,118,171,0.4)] group-hover:scale-110 transition-transform duration-700">
                                <Icon icon="logos:python" className="w-full h-full" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-premium-serif text-white tracking-tight leading-none mb-2">The best first</h3>
                                <p className="text-zinc-400 text-lg font-medium opacity-80 leading-none">programming language</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-2xl font-premium-serif text-white font-medium">Let's Build a Game</h3>
                            <p className="text-zinc-400 leading-relaxed text-sm">
                                In this course you'll build features for a text-based RPG called <span className="text-orange-500/80 font-bold italic">"Fantasy Quest"</span>.
                            </p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <h3 className="text-xl font-premium-serif mb-6 text-white font-medium">Assignment</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-500 flex-none mt-0.5">1</div>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Press the gray <span className="bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded-md mx-1 border border-white/5 text-[11px] font-bold inline-flex items-center gap-1"><Play size={8} fill="currentColor" /> Run</span> button to run the code I wrote for you
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-[10px] font-bold text-zinc-500 flex-none mt-0.5">2</div>
                                <p className="text-zinc-400 text-sm leading-relaxed">
                                    Press the gold <span className="bg-orange-500 text-black px-2 py-0.5 rounded-md mx-1 text-[11px] font-black inline-flex items-center gap-1"><Play size={8} fill="currentColor" /> Submit</span> button to run and <span className="italic">submit</span> the code
                                </p>
                            </div>
                        </div>
                        <p className="mt-8 text-zinc-500 text-[11px] font-medium leading-relaxed">
                            Press the <span className="text-zinc-300">{"-->"}</span> right arrow at the top-right of the screen to go to the next lesson.
                        </p>
                    </div>
                </div>

                {/* Right Panel - Code Editor & Console */}
                <div className="flex-1 flex flex-col bg-[#0D0D0F] min-h-0 overflow-hidden">
                    {/* Editor Header */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-zinc-950/50 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <span className="text-xs text-zinc-500 font-mono">main.py</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {isLoadingPyodide && (
                                <span className="text-[10px] text-zinc-500 animate-pulse">Loading Python...</span>
                            )}
                            <button
                                onClick={handleResetCode}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5"
                            >
                                <Icon icon="lucide:rotate-ccw" width={14} height={14} />
                                <span className="hidden sm:inline">Reset</span>
                            </button>
                            <button
                                onClick={handleRunCode}
                                disabled={isRunning || isLoadingPyodide}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-2 ${isRunning || isLoadingPyodide
                                    ? 'bg-zinc-700 text-zinc-400 border-zinc-600 cursor-not-allowed'
                                    : 'bg-zinc-800 hover:bg-zinc-700 text-white border-white/10'
                                    }`}
                            >
                                {isRunning ? (
                                    <Icon icon="lucide:loader-2" width={14} height={14} className="animate-spin" />
                                ) : (
                                    <Zap size={14} />
                                )}
                                <span>{isRunning ? 'Running...' : 'Run'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Editor - shrinks when console is open */}
                    <div className={`relative transition-all duration-300 min-h-0 ${isConsoleOpen ? 'flex-[3]' : 'flex-1'}`}>
                        <Editor
                            height="100%"
                            defaultLanguage="python"
                            theme="vs-dark"
                            value={code}
                            onChange={(val) => setCode(val || '')}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 16,
                                fontFamily: 'JetBrains Mono, monospace',
                                lineNumbers: 'on',
                                roundedSelection: false,
                                scrollBeyondLastLine: false,
                                readOnly: false,
                                automaticLayout: true,
                                padding: { top: 20 }
                            }}
                        />
                    </div>

                    {/* Console Output - takes remaining space */}
                    {isConsoleOpen && (
                        <div className="flex-[2] min-h-[120px] flex flex-col bg-black/60 backdrop-blur-md overflow-hidden border-t border-white/5">
                            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-zinc-950/80 shrink-0">
                                <div className="flex items-center gap-2">
                                    <Icon icon="lucide:terminal" className="text-green-500" width={14} height={14} />
                                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
                                        Console Output
                                    </span>
                                    {consoleOutput.length > 0 && (
                                        <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-500">
                                            {consoleOutput.length} line{consoleOutput.length !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsConsoleOpen(false)}
                                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                                    title="Collapse Console"
                                >
                                    <Icon icon="lucide:chevron-down" width={16} height={16} />
                                </button>
                            </div>
                            <div className="flex-grow p-4 overflow-y-auto font-mono text-sm">
                                {consoleOutput.map((output, i) => (
                                    <div
                                        key={i}
                                        className={`py-1 ${output.type === 'error' ? 'text-red-400' : 'text-green-400'}`}
                                    >
                                        <span className="text-zinc-600 mr-2">{'>'}</span>
                                        {output.message}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bottom Action Bar */}
                    <div className="p-4 border-t border-white/10 flex items-center justify-between bg-zinc-900/20 shrink-0">
                        <div className="flex gap-3">
                            <button
                                onClick={async () => {
                                    await handleRunCode();
                                    setTimeout(onComplete, 1500);
                                }}
                                disabled={isRunning || isLoadingPyodide}
                                className={`px-6 py-2.5 font-black rounded-xl transition-all flex items-center gap-2 text-xs uppercase tracking-widest ${isRunning || isLoadingPyodide
                                    ? 'bg-orange-700 text-orange-300 cursor-not-allowed'
                                    : 'bg-orange-500 hover:bg-orange-400 text-black shadow-[0_0_20px_rgba(249,115,22,0.2)]'
                                    }`}
                            >
                                {isRunning ? (
                                    <Icon icon="lucide:loader-2" width={14} height={14} className="animate-spin" />
                                ) : (
                                    <Play size={14} fill="currentColor" />
                                )}
                                {isRunning ? 'Running...' : 'Submit'}
                            </button>
                            <button
                                onClick={handleRunCode}
                                disabled={isRunning || isLoadingPyodide}
                                className={`px-6 py-2.5 font-bold rounded-xl transition-all flex items-center gap-2 text-xs uppercase tracking-widest border ${isRunning || isLoadingPyodide
                                    ? 'bg-white/5 text-zinc-500 border-zinc-700 cursor-not-allowed'
                                    : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                                    }`}
                            >
                                {isRunning ? (
                                    <Icon icon="lucide:loader-2" width={14} height={14} className="animate-spin" />
                                ) : (
                                    <Zap size={14} />
                                )}
                                {isRunning ? 'Running...' : 'Run'}
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2.5 text-zinc-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                <Target size={14} /> Solution
                            </button>
                            <button
                                onClick={handleResetCode}
                                className="px-4 py-2.5 text-zinc-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                            >
                                <Icon icon="lucide:rotate-ccw" width={14} height={14} /> Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StepAuth = () => {
    const router = useRouter();
    const { loginWithGoogle } = useAuth();
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [promotionalMail, setPromotionalMail] = useState(true);
    const [error, setError] = useState('');

    const handleGoogleLogin = async () => {
        try {
            setError('');
            await loginWithGoogle();
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google');
        }
    };

    return (
        <div className="max-w-md w-full flex flex-col items-center text-center py-6 relative">
            {/* 3D Glassy Logo Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-20 z-0">
                <div
                    className="w-full h-full bg-no-repeat bg-center bg-contain filter blur-[2px] contrast-125 brightness-150 rotate-[15deg] skew-y-3"
                    style={{
                        backgroundImage: 'url("/voicecode-logo.png")',
                        transform: 'perspective(1000px) rotateX(20deg) rotateY(-10deg) translateZ(0)',
                        boxShadow: '0 0 100px rgba(249,115,22,0.1)'
                    }}
                ></div>
                {/* Secondary glass reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-full backdrop-blur-[1px]"></div>
            </div>

            <div className="relative z-10 w-full flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl font-premium-serif mb-3 text-white font-medium tracking-tight">
                    Save your progress
                </h2>
                <p className="text-zinc-500 mb-8 text-sm max-w-xs">
                    Create a profile to save your work and see your full learning path.
                </p>

                <div className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl p-5 mb-8 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Level 1</span>
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">120 / 400 XP</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="w-[30%] h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]"></div>
                    </div>
                </div>

                {error && (
                    <div className="w-full bg-red-900/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm flex items-center justify-center">
                        <AlertCircle className="mr-2" size={16} />
                        {error}
                    </div>
                )}

                <div className={`w-full space-y-3 transition-all duration-500 ${!termsAccepted ? 'opacity-40 grayscale-[0.5] pointer-events-none' : 'opacity-100'}`}>
                    <button
                        onClick={handleGoogleLogin}
                        disabled={!termsAccepted}
                        className="w-full py-3.5 bg-white text-black hover:bg-zinc-100 font-bold rounded-xl transition-all flex items-center justify-center gap-3 text-sm shadow-md"
                    >
                        <Icon icon="logos:google-icon" className="text-lg" />
                        Sign in with Google
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            disabled={true}
                            className="py-3.5 bg-zinc-900/50 border border-white/5 text-zinc-500 cursor-not-allowed font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                            title="Coming soon"
                        >
                            <Github size={18} />
                            Github
                        </button>
                        <button
                            onClick={() => router.push('/login')}
                            disabled={!termsAccepted}
                            className="py-3.5 bg-zinc-900 border border-white/10 text-zinc-300 hover:bg-zinc-800 hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                        >
                            <Mail size={18} />
                            Email
                        </button>
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    <div className="flex items-start gap-3 text-[11px] text-zinc-500 text-left">
                        <button
                            onClick={() => setTermsAccepted(!termsAccepted)}
                            className={`mt-1 w-5 h-5 flex-none rounded-md flex items-center justify-center transition-all ${termsAccepted ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-zinc-900 border border-white/10 hover:border-orange-500/30'}`}
                        >
                            {termsAccepted && <CheckCircle2 size={14} className="text-black" strokeWidth={3} />}
                        </button>
                        <span className="leading-relaxed">
                            I've read and agree to the
                            <button
                                onClick={() => router.push('/terms')}
                                className="mx-1 text-orange-500 hover:text-orange-400 font-bold decoration-orange-500/30 underline-offset-4 font-manrope"
                            >
                                terms
                            </button>
                            of service and privacy policy.
                        </span>
                    </div>
                    <div className="flex items-start gap-3 text-[11px] text-zinc-500 text-left">
                        <button
                            onClick={() => setPromotionalMail(!promotionalMail)}
                            className={`mt-1 w-5 h-5 flex-none rounded-md flex items-center justify-center transition-all ${promotionalMail ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-zinc-900 border border-white/10 hover:border-orange-500/30'}`}
                        >
                            {promotionalMail && <CheckCircle2 size={14} className="text-black" strokeWidth={3} />}
                        </button>
                        <span className="leading-relaxed">Send me helpful coding tips and occasional product updates.</span>
                    </div>
                </div>

                {!termsAccepted && (
                    <div className="mt-6 animate-bounce">
                        <span className="text-[10px] bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full border border-orange-500/20 font-bold uppercase tracking-wider">
                            Action Required
                        </span>
                    </div>
                )}

                <button
                    disabled={true}
                    className="mt-12 text-[10px] text-zinc-700 font-bold uppercase tracking-widest cursor-not-allowed"
                    title="Registration required"
                >
                    Continue as guest
                </button>
            </div>
        </div>
    );
};

const Play = ({ size, fill }: { size: number, fill: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
);

export default OnboardingPage;
