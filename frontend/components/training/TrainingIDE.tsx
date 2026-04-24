'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Play, Loader2, RotateCcw, CheckCircle, XCircle, AlertTriangle, Trophy, Zap, Send, Copy, Check, ChevronDown, ChevronUp, Settings, Terminal, FileText, HelpCircle, Tag, Lightbulb, Clock, Cpu, ChevronRight, ArrowLeft } from 'lucide-react';
// @ts-ignore
import { Panel, Group, Separator, useDefaultLayout } from 'react-resizable-panels';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { LanguageConfig, LANGUAGES, getLanguageBySlug } from '@/lib/judge0';
import TurnstileWidget from '@/components/TurnstileWidget';
import { dbService } from '@/services/dbService';
import { useAuth } from '@/contexts/AuthContext';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const PanelGroup = Group as any;
const PanelResizeHandle = Separator as any;

export interface TestCase {
    input: string;
    expected_output: string;
    is_hidden?: boolean;
}

export interface TrainingQuestion {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    category: string;
    starter_code: Record<string, string>;
    test_cases: TestCase[];
}

interface TrainingIDEProps {
    question: TrainingQuestion;
    onSuccess?: () => void;
}

/* ─── Collapsible Hint Component ─── */
function HintAccordion({ index, children }: { index: number; children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-white/5 last:border-b-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-3 px-1 text-sm text-zinc-400 hover:text-zinc-200 transition-colors group"
            >
                <span className="flex items-center gap-2.5 font-medium">
                    <Lightbulb size={14} className="text-amber-500/70" />
                    Hint {index}
                </span>
                <ChevronDown size={14} className={`text-zinc-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-40 opacity-100 pb-3' : 'max-h-0 opacity-0'}`}>
                <div className="pl-7 text-sm text-zinc-400 leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default function TrainingIDE({ question, onSuccess }: TrainingIDEProps) {
    const { user } = useAuth();
    const [language, setLanguage] = useState<LanguageConfig>(LANGUAGES.find(l => l.slug === 'python') || LANGUAGES[0]);
    const [code, setCode] = useState(question.starter_code[language.slug] || language.defaultCode);

    // UI State
    const [leftTab, setLeftTab] = useState<'description' | 'editorial' | 'solutions' | 'submissions' | 'accepted'>('description');
    const [consoleOpen, setConsoleOpen] = useState(false);
    const [consoleTab, setConsoleTab] = useState<'testcases' | 'result'>('testcases');
    const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);
    const [copiedInput, setCopiedInput] = useState(false);
    const [copiedOutput, setCopiedOutput] = useState(false);
    const [isEditorReady, setIsEditorReady] = useState(false);

    // Security / Session State
    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const [showSecurityModal, setShowSecurityModal] = useState(false);

    // Execution State
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSubmittingRef = React.useRef(false);

    // Results
    const [testResults, setTestResults] = useState<{
        passed: boolean;
        is_hidden?: boolean;
        hint?: string | null;
        stdout: string | null;
        stderr: string | null;
        compile_output?: string | null;
        message: string | null;
        expected: string;
        actual_input: string;
        time?: string;
        memory?: number;
    }[]>([]);
    const [executionError, setExecutionError] = useState<string | null>(null);
    const [rewards, setRewards] = useState<{ xp: number, coins: number } | null>(null);

    // Submission result view
    const [submissionResult, setSubmissionResult] = useState<{
        status: string;
        totalCases: number;
        passedCases: number;
        runtimeMs: number;
        memoryMb: number;
        language: string;
        submittedCode: string;
        submittedAt: string;
    } | null>(null);

    const [mounted, setMounted] = useState(false);
    
    const safeStorage = {
        getItem: (key: string) => {
            if (typeof window === 'undefined') return null;
            return localStorage.getItem(key);
        },
        setItem: (key: string, value: string) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, value);
            }
        }
    };

    const { defaultLayout, onLayoutChanged } = useDefaultLayout({ 
        id: 'training-ide-layout',
        storage: safeStorage
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const storedToken = localStorage.getItem('compiler_session_token');
        if (storedToken) setSessionToken(storedToken);
    }, []);

    const handleLanguageChange = (slug: string) => {
        const newLang = getLanguageBySlug(slug);
        if (newLang) {
            setLanguage(newLang);
            setCode(question.starter_code[slug] || newLang.defaultCode);
        }
    };

    const handleTurnstileVerify = async (token: string) => {
        try {
            const res = await fetch('/api/auth/compiler-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ turnstileToken: token })
            });
            const data = await res.json();
            if (data.success && data.sessionToken) {
                setSessionToken(data.sessionToken);
                localStorage.setItem('compiler_session_token', data.sessionToken);
                setShowSecurityModal(false);
            } else {
                alert('Verification failed. Please try again.');
            }
        } catch (e) {
            alert('Security service unavailable.');
        }
    };

    const handleRunTests = async () => {
        if (!sessionToken) {
            setShowSecurityModal(true);
            return;
        }

        setIsRunning(true);
        setConsoleOpen(true);
        setConsoleTab('result');
        setExecutionError(null);
        setTestResults([]);
        setRewards(null);
        setSubmissionResult(null);

        try {
            const res = await fetch('/api/training/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-compiler-session': sessionToken
                },
                body: JSON.stringify({
                    questionId: question.id,
                    code,
                    language: language.slug
                })
            });

            const data = await res.json();

            if (res.status === 401 && data.error?.includes('Session')) {
                setSessionToken(null);
                localStorage.removeItem('compiler_session_token');
                setShowSecurityModal(true);
                setIsRunning(false);
                return;
            }

            if (!res.ok) {
                setExecutionError((data.error || 'Execution failed') + (data.details ? ' : ' + data.details : ''));
                return;
            }

            setTestResults(data.results);
            if (data.rewards) setRewards(data.rewards);

            // Build submission result view data when submitting
            if (isSubmittingRef.current && data.results) {
                const totalTimeMs = data.results.reduce((sum: number, r: any) => sum + (parseFloat(r.time) || 0) * 1000, 0);
                const totalMemMb = data.results.reduce((sum: number, r: any) => sum + ((r.memory || 0) / 1024), 0);
                const avgMemMb = data.results.length > 0 ? totalMemMb / data.results.length : 0;

                setSubmissionResult({
                    status: data.allPassed ? 'Accepted' : 'Wrong Answer',
                    totalCases: data.totalCases || data.results.length,
                    passedCases: data.passedCases || data.results.filter((r: any) => r.passed).length,
                    runtimeMs: Math.round(totalTimeMs),
                    memoryMb: parseFloat(avgMemMb.toFixed(2)),
                    language: language.slug,
                    submittedCode: code,
                    submittedAt: new Date().toISOString(),
                });

                // Show the result in the left panel for all submissions
                setLeftTab('accepted');
            }

            if (data.allPassed) {
                if (onSuccess) onSuccess();
                
                // Log activity
                if (user) {
                    const activityType = question.category.toLowerCase() === 'dsa' ? 'dsa' : 
                                       question.category.toLowerCase() === 'logic' ? 'logic' : 'dsa';

                    dbService.logActivity(user.id, {
                        type: activityType as any,
                        title: question.title,
                        description: `Solved ${question.category} problem: ${question.title}`,
                        result: 'Solved',
                        xp_earned: data.rewards?.xp || 0,
                        coins_earned: data.rewards?.coins || 0,
                        metadata: {
                            language: language.slug,
                            slug: question.id,
                            runtime: Math.round(data.results.reduce((sum: number, r: any) => sum + (parseFloat(r.time) || 0) * 1000, 0))
                        }
                    }).catch(err => console.error("Failed to log training activity", err));
                }
            }
        } catch (err) {
            setExecutionError('Network error or server unavailable.');
        } finally {
            setIsRunning(false);
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        isSubmittingRef.current = true;
        await handleRunTests();
        isSubmittingRef.current = false;
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff.toLowerCase()) {
            case 'easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
            case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
            case 'hard': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
            default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30';
        }
    };

    const getDifficultyTextColor = (diff: string) => {
        switch (diff.toLowerCase()) {
            case 'easy': return 'text-emerald-400';
            case 'medium': return 'text-amber-400';
            case 'hard': return 'text-rose-400';
            default: return 'text-zinc-400';
        }
    };

    const copyToClipboard = (text: string, type: 'input' | 'output') => {
        navigator.clipboard.writeText(text);
        if (type === 'input') { setCopiedInput(true); setTimeout(() => setCopiedInput(false), 2000); }
        else { setCopiedOutput(true); setTimeout(() => setCopiedOutput(false), 2000); }
    };

    const toggleConsole = (tab: 'testcases' | 'result') => {
        if (consoleOpen && consoleTab === tab) setConsoleOpen(false);
        else { setConsoleTab(tab); setConsoleOpen(true); }
    };

    const allPassed = testResults.length > 0 && testResults.every(r => r.passed);
    const passedCount = testResults.filter(r => r.passed).length;
    const visibleTestCases = question.test_cases.filter(tc => !tc.is_hidden);

    /* Custom markdown components for LeetCode-style rendering */
    const markdownComponents = {
        p: ({ children, ...props }: any) => (
            <p className="text-[15px] text-zinc-300 leading-[1.8] mb-5 font-normal" {...props}>{children}</p>
        ),
        strong: ({ children, ...props }: any) => (
            <strong className="text-white font-bold" {...props}>{children}</strong>
        ),
        em: ({ children, ...props }: any) => (
            <em className="text-zinc-200 italic" {...props}>{children}</em>
        ),
        code: ({ children, className, node, ...props }: any) => {
            const isBlock = className?.includes('language-');
            if (isBlock) {
                return <code className="text-[13px] font-mono" {...props}>{children}</code>;
            }
            return <code className="text-[13px] font-mono text-zinc-200 bg-white/[0.06] px-1.5 py-[2px] rounded-[4px] border border-white/[0.08]" {...props}>{children}</code>;
        },
        pre: ({ children, ...props }: any) => (
            <pre className="bg-[#1a1a1d] border border-white/[0.06] rounded-lg p-4 mb-5 overflow-x-auto border-l-[3px] border-l-zinc-600" {...props}>{children}</pre>
        ),
        ul: ({ children, ...props }: any) => (
            <ul className="list-disc list-inside space-y-2 mb-5 ml-1" {...props}>{children}</ul>
        ),
        ol: ({ children, ...props }: any) => (
            <ol className="list-decimal list-inside space-y-2 mb-5 ml-1" {...props}>{children}</ol>
        ),
        li: ({ children, ...props }: any) => (
            <li className="text-[15px] text-zinc-300 leading-[1.8]" {...props}>{children}</li>
        ),
        h1: ({ children, ...props }: any) => (
            <h1 className="text-2xl font-bold text-white mt-8 mb-4" {...props}>{children}</h1>
        ),
        h2: ({ children, ...props }: any) => (
            <h2 className="text-lg font-bold text-white mt-8 mb-3" {...props}>{children}</h2>
        ),
        h3: ({ children, ...props }: any) => (
            <h3 className="text-base font-bold text-white mt-6 mb-2" {...props}>{children}</h3>
        ),
        blockquote: ({ children, ...props }: any) => (
            <blockquote className="border-l-[3px] border-zinc-600 bg-[#1a1a1d] rounded-r-lg pl-4 pr-4 py-3 mb-5 text-[14px] font-mono text-zinc-300 leading-relaxed" {...props}>{children}</blockquote>
        ),
        table: ({ children, ...props }: any) => (
            <div className="overflow-x-auto mb-5 rounded-lg border border-white/[0.06]">
                <table className="w-full text-sm" {...props}>{children}</table>
            </div>
        ),
        th: ({ children, ...props }: any) => (
            <th className="bg-white/[0.04] px-4 py-2.5 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-white/[0.06]" {...props}>{children}</th>
        ),
        td: ({ children, ...props }: any) => (
            <td className="px-4 py-2.5 text-sm font-mono text-zinc-300 border-b border-white/[0.04]" {...props}>{children}</td>
        ),
        hr: () => <hr className="border-white/[0.06] my-8" />,
        a: ({ children, ...props }: any) => (
            <a className="text-blue-400 hover:text-blue-300 underline underline-offset-2 decoration-blue-400/30" {...props}>{children}</a>
        ),
    };

    return (
        <div className="flex w-full h-[calc(100vh-40px)] bg-[#0a0a0a] text-zinc-300 font-sans overflow-hidden relative">
            {/* Security Modal */}
            {showSecurityModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md">
                    <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-black/50">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                <AlertTriangle size={18} className="text-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Security Verification</h3>
                                <p className="text-zinc-500 text-xs">One-time check to enable code execution</p>
                            </div>
                        </div>
                        <div className="flex justify-center bg-black/30 p-5 rounded-xl border border-white/5 min-h-[80px]">
                            <TurnstileWidget onVerify={handleTurnstileVerify} />
                        </div>
                        <button onClick={() => setShowSecurityModal(false)} className="mt-4 text-xs text-zinc-500 hover:text-white transition-colors w-full text-center">Cancel</button>
                    </div>
                </div>
            )}

            <PanelGroup
                id="training-ide-layout"
                orientation="horizontal"
                className="flex-1 flex min-h-0 bg-[#0A0A0A]"
                defaultLayout={defaultLayout}
                onLayoutChanged={onLayoutChanged}
            >
                {/* LEFT PANEL: Description, Editorial, etc. */}
                <Panel defaultSize={40} minSize={25} className="flex flex-col border-r border-white/[0.06] bg-[#0A0A0A] overflow-hidden">
                    {/* Tab Bar — LeetCode style */}
                    <div className="h-10 bg-[#1a1a1d] border-b border-white/[0.06] flex items-center px-4 shrink-0 gap-5 overflow-x-auto">
                        {[
                            { key: 'description', icon: <FileText size={13} />, label: 'Description' },
                            { key: 'editorial', icon: <span className="text-[11px]">📝</span>, label: 'Editorial' },
                            { key: 'solutions', icon: <span className="text-[11px]">💡</span>, label: 'Solutions' },
                            ...(submissionResult ? [{ key: 'accepted', icon: <CheckCircle size={13} className={submissionResult.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'} />, label: submissionResult.status }] : []),
                            { key: 'submissions', icon: <span className="text-[11px]">📊</span>, label: 'Submissions' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setLeftTab(tab.key as any)}
                                className={`flex items-center gap-1.5 text-[13px] font-medium pb-2 pt-2 border-b-2 transition-all whitespace-nowrap ${leftTab === tab.key
                                    ? tab.key === 'accepted' && submissionResult?.status === 'Accepted'
                                        ? 'border-emerald-400 text-emerald-400'
                                        : tab.key === 'accepted'
                                            ? 'border-rose-400 text-rose-400'
                                            : 'border-white text-white'
                                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-auto custom-scrollbar bg-[#1a1a1d]">
                        {leftTab === 'description' && (
                            <div className="px-6 py-6">
                                {/* ─ Title ─ */}
                                <h1 className="text-[26px] font-bold text-white mb-4 leading-tight tracking-tight">
                                    {question.title}
                                </h1>

                                {/* ─ Badges Row ─ */}
                                <div className="flex items-center gap-2 mb-7 flex-wrap">
                                    <span className={`px-2.5 py-[3px] text-xs font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}>
                                        {question.difficulty}
                                    </span>
                                    <button className="flex items-center gap-1.5 px-2.5 py-[3px] text-xs text-zinc-400 hover:text-zinc-200 rounded-full bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.06]">
                                        <Tag size={11} /> Topics
                                    </button>
                                    <button className="flex items-center gap-1.5 px-2.5 py-[3px] text-xs text-zinc-400 hover:text-zinc-200 rounded-full bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.06]">
                                        <Lightbulb size={11} /> Hint
                                    </button>
                                </div>

                                {/* ─ Description Body ─ */}
                                <div className="mb-8">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={markdownComponents}
                                    >
                                        {question.description}
                                    </ReactMarkdown>
                                </div>

                                {/* ─ Example Test Cases (LeetCode-style bordered blocks) ─ */}
                                {visibleTestCases.length > 0 && (
                                    <div className="mb-8">
                                        {visibleTestCases.slice(0, 3).map((tc, idx) => (
                                            <div key={idx} className="mb-6">
                                                <h3 className="text-[15px] font-bold text-white mb-3">Example {idx + 1}:</h3>
                                                <div className="border-l-[3px] border-zinc-600 bg-[#141416] rounded-r-lg pl-5 pr-4 py-4 space-y-1">
                                                    <div className="flex items-start gap-0">
                                                        <span className="text-[14px] font-bold text-white shrink-0 w-[70px]">Input:</span>
                                                        <span className="text-[14px] font-mono text-zinc-300">{tc.input}</span>
                                                    </div>
                                                    <div className="flex items-start gap-0">
                                                        <span className="text-[14px] font-bold text-white shrink-0 w-[70px]">Output:</span>
                                                        <span className="text-[14px] font-mono text-zinc-300">{tc.expected_output}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* ─ Category Tag ─ */}
                                <div className="mb-8 py-3 border-t border-white/[0.06]">
                                    <div className="flex items-center gap-2 py-3">
                                        <Tag size={14} className="text-zinc-500" />
                                        <span className="text-sm text-zinc-400 font-medium">Category:</span>
                                        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-white/[0.04] text-zinc-300 border border-white/[0.06]">
                                            {question.category}
                                        </span>
                                    </div>
                                </div>

                                {/* ─ Hints Accordion ─ */}
                                <div className="border-t border-white/[0.06]">
                                    <HintAccordion index={1}>
                                        Think about what data structure would allow you to check for a complement in O(1) time.
                                    </HintAccordion>
                                    <HintAccordion index={2}>
                                        A hash map can store values you've already seen and their indices.
                                    </HintAccordion>
                                    <HintAccordion index={3}>
                                        For each element, check if the complement (target - current) exists in the hash map.
                                    </HintAccordion>
                                </div>
                            </div>
                        )}

                        {leftTab === 'editorial' && (
                            <div className="px-6 py-8 flex flex-col items-center justify-center h-full text-center">
                                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
                                    <span className="text-2xl">📝</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Editorial</h3>
                                <p className="text-sm text-zinc-500 max-w-xs">Detailed solution explanations and walkthroughs coming soon.</p>
                            </div>
                        )}

                        {leftTab === 'solutions' && (
                            <div className="px-6 py-8 flex flex-col items-center justify-center h-full text-center">
                                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
                                    <span className="text-2xl">💡</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Community Solutions</h3>
                                <p className="text-sm text-zinc-500 max-w-xs">See how other elites solved this problem. Coming soon.</p>
                            </div>
                        )}

                        {leftTab === 'submissions' && (
                            <div className="px-6 py-8 flex flex-col items-center justify-center h-full text-center">
                                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Your Submissions</h3>
                                <p className="text-sm text-zinc-500 max-w-xs">Your past submissions for this problem will appear here.</p>
                            </div>
                        )}

                        {/* ─── ACCEPTED / RESULT VIEW ─── */}
                        {leftTab === 'accepted' && submissionResult && (
                            <div className="px-6 py-5">
                                {/* Back to all submissions */}
                                <button
                                    onClick={() => setLeftTab('description')}
                                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors mb-5"
                                >
                                    <ArrowLeft size={12} /> All Submissions
                                </button>

                                {/* Status Banner */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className={`text-2xl font-bold ${submissionResult.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {submissionResult.status}
                                        </h2>
                                        <span className="text-sm text-zinc-500">
                                            {submissionResult.passedCases} / {submissionResult.totalCases} testcases passed
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                                        <span>submitted at {new Date(submissionResult.submittedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>

                                {/* Editorial / Solution buttons */}
                                {submissionResult.status === 'Accepted' && (
                                    <div className="flex items-center gap-3 mb-8">
                                        <button className="px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-sm text-zinc-300 hover:bg-white/[0.08] transition-colors flex items-center gap-2">
                                            📝 Editorial
                                        </button>
                                        <button className="px-4 py-2 rounded-lg bg-emerald-600 border border-emerald-500/50 text-sm text-white font-bold hover:bg-emerald-500 transition-colors flex items-center gap-2 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                                            ✏️ Solution
                                        </button>
                                    </div>
                                )}

                                {/* Runtime & Memory Cards */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {/* Runtime Card */}
                                    <div className="bg-[#141416] border border-white/[0.06] rounded-xl p-5">
                                        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
                                            <Clock size={14} className="text-zinc-500" /> Runtime
                                        </div>
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-3xl font-black text-white">{submissionResult.runtimeMs}</span>
                                            <span className="text-sm text-zinc-500">ms</span>
                                            <span className="text-zinc-600 mx-1">|</span>
                                            <span className="text-sm">Beats <span className="text-white font-bold">{(Math.random() * 40 + 30).toFixed(2)}%</span></span>
                                        </div>
                                        <div className="text-xs text-emerald-500/70 flex items-center gap-1">
                                            <span>✨</span> Analyze Complexity
                                        </div>
                                    </div>

                                    {/* Memory Card */}
                                    <div className="bg-[#141416] border border-white/[0.06] rounded-xl p-5">
                                        <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
                                            <Cpu size={14} className="text-zinc-500" /> Memory
                                        </div>
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-3xl font-black text-white">{submissionResult.memoryMb}</span>
                                            <span className="text-sm text-zinc-500">MB</span>
                                            <span className="text-zinc-600 mx-1">|</span>
                                            <span className="text-sm">Beats <span className="text-white font-bold">{(Math.random() * 40 + 40).toFixed(2)}%</span> <span className="text-emerald-400">🟢</span></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Distribution Bar */}
                                <div className="mb-8 bg-[#141416] border border-white/[0.06] rounded-xl p-5">
                                    <div className="text-xs text-zinc-500 mb-3">Runtime Distribution</div>
                                    <div className="flex items-end gap-[2px] h-16">
                                        {Array.from({ length: 30 }).map((_, i) => {
                                            const height = i < 3 ? 80 + Math.random() * 20 : Math.random() * 15 + 2;
                                            const isActive = i === 2;
                                            return (
                                                <div
                                                    key={i}
                                                    className={`flex-1 rounded-t-sm transition-colors ${isActive ? 'bg-blue-500' : 'bg-white/[0.06] hover:bg-white/[0.12]'
                                                        }`}
                                                    style={{ height: `${height}%` }}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between text-[10px] text-zinc-600 mt-2 font-mono">
                                        <span>56ms</span><span>1181ms</span><span>2305ms</span><span>3430ms</span><span>4555ms</span><span>5680ms</span><span>6805ms</span><span>7930ms</span>
                                    </div>
                                </div>

                                {/* Submitted Code Preview */}
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
                                        <span>Code</span>
                                        <span className="text-zinc-600">|</span>
                                        <span className="text-white font-medium capitalize">{submissionResult.language === 'cpp' ? 'C++' : submissionResult.language === 'javascript' ? 'JavaScript' : submissionResult.language.charAt(0).toUpperCase() + submissionResult.language.slice(1)}</span>
                                    </div>
                                    <div className="bg-[#141416] border border-white/[0.06] rounded-xl overflow-hidden">
                                        <pre className="p-4 overflow-x-auto text-sm font-mono text-zinc-300 leading-relaxed max-h-[200px] overflow-y-auto custom-scrollbar">
                                            <code>{submissionResult.submittedCode.split('\n').slice(0, 8).map((line, i) => (
                                                <div key={i} className="flex">
                                                    <span className="text-zinc-600 w-8 shrink-0 text-right mr-4 select-none">{i + 1}</span>
                                                    <span>{line}</span>
                                                </div>
                                            ))}</code>
                                        </pre>
                                        {submissionResult.submittedCode.split('\n').length > 8 && (
                                            <div className="border-t border-white/[0.06] py-2 text-center">
                                                <button className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1 mx-auto">
                                                    <ChevronDown size={12} /> View more
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Rewards (if first solve) */}
                                {rewards && (
                                    <div className="mb-8 p-5 bg-gradient-to-r from-orange-500/10 via-purple-500/5 to-orange-500/10 border border-orange-500/20 rounded-xl">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 shrink-0 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                                                <Trophy size={20} />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold text-sm">First Solve Rewards Earned! 🎉</div>
                                                <div className="text-zinc-500 text-xs">Congratulations on solving this challenge.</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-3">
                                            <div className="bg-black/50 px-4 py-2.5 rounded-lg border border-purple-500/20 flex items-center gap-2">
                                                <Zap size={15} className="text-purple-400" fill="currentColor" />
                                                <span className="text-purple-400 font-black text-base">+{rewards.xp} XP</span>
                                            </div>
                                            <div className="bg-black/50 px-4 py-2.5 rounded-lg border border-amber-500/20 flex items-center gap-2">
                                                <span className="text-amber-400">🪙</span>
                                                <span className="text-amber-400 font-black text-base">+{rewards.coins} Coins</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* More Challenges */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-white mb-3">More challenges</h3>
                                    <button
                                        onClick={() => window.history.back()}
                                        className="w-full text-left px-4 py-3 bg-[#141416] border border-white/[0.06] rounded-xl text-sm text-zinc-300 hover:bg-white/[0.04] transition-colors flex items-center justify-between group"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${getDifficultyColor(question.difficulty).split(' ')[0].replace('text-', 'bg-')}`} />
                                            Back to {question.category} Problems
                                        </span>
                                        <ChevronRight size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                                    </button>
                                </div>

                                {/* Notes */}
                                <div>
                                    <textarea
                                        placeholder="Write your notes here"
                                        className="w-full bg-[#141416] border border-white/[0.06] rounded-xl p-4 text-sm text-zinc-300 placeholder:text-zinc-600 resize-none h-24 focus:outline-none focus:ring-1 focus:ring-white/10 transition-all"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Info Bar — LIKE LEETCODE */}
                    <div className="h-9 bg-[#141416] border-t border-white/[0.06] flex items-center justify-between px-5 shrink-0 text-[11px] text-zinc-500">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">👍 <span className="text-zinc-400">—</span></span>
                            <span className="flex items-center gap-1">💬 <span className="text-zinc-400">—</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span>⭐</span>
                            <span>🔗</span>
                        </div>
                    </div>
                </Panel>

                <PanelResizeHandle className="w-[3px] transition-all bg-white/[0.03] hover:bg-orange-500/60 active:bg-orange-500 cursor-col-resize relative group z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-white/10 group-hover:bg-orange-400/50 transition-colors" />
                </PanelResizeHandle>

                {/* ═══════════════════════════════════════════════════════ */}
                {/* RIGHT PANEL: Editor (full) + Bottom Popup              */}
                {/* ═══════════════════════════════════════════════════════ */}
                <Panel defaultSize={60} minSize={30} className="flex flex-col min-w-0 bg-[#1e1e1e] relative">

                    {/* Editor Toolbar — with Run/Submit */}
                    <div className="h-10 bg-[#1e1e1e] border-b border-white/[0.06] flex items-center justify-between px-3 shrink-0 z-20">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <select
                                    value={language.slug}
                                    onChange={(e) => handleLanguageChange(e.target.value)}
                                    className="appearance-none bg-[#2d2d30] text-zinc-300 border border-white/[0.08] rounded-md py-1.5 pl-3 pr-8 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 hover:bg-[#3e3e42] transition-all cursor-pointer"
                                >
                                    <option value="python">Python 3</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                    <option value="go">Go</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCode(question.starter_code[language.slug] || language.defaultCode)}
                                className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 transition-all rounded-md"
                                title="Reset Code"
                            >
                                <RotateCcw size={14} />
                            </button>
                            <button className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 transition-all rounded-md" title="Settings">
                                <Settings size={14} />
                            </button>

                            <div className="w-px h-5 bg-white/10 mx-1" />

                            <button
                                onClick={handleRunTests}
                                disabled={isRunning}
                                className="px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all
                                    bg-white/[0.06] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.1] hover:text-white
                                    disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {isRunning && !isSubmitting ? (
                                    <><Loader2 size={12} className="animate-spin" /> Running...</>
                                ) : (
                                    <><Play size={12} className="fill-current" /> Run</>
                                )}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isRunning}
                                className="px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all
                                    bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/50
                                    shadow-[0_0_12px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]
                                    disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <><Loader2 size={12} className="animate-spin" /> Submitting...</>
                                ) : (
                                    <><Send size={12} /> Submit</>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Code Editor — fills remaining space */}
                    <div className="flex-1 relative min-h-0">
                        {!isEditorReady && (
                            <div className="absolute inset-0 bg-[#1e1e1e] z-10 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 size={24} className="animate-spin text-orange-500" />
                                    <span className="text-xs text-zinc-500 font-mono">Loading editor...</span>
                                </div>
                            </div>
                        )}
                        <Editor
                            height="100%"
                            language={language.monacoLanguage || 'plaintext'}
                            theme="vs-dark"
                            value={code}
                            onChange={(val) => setCode(val || '')}
                            onMount={() => setIsEditorReady(true)}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
                                fontLigatures: true,
                                padding: { top: 16, bottom: 16 },
                                scrollBeyondLastLine: false,
                                smoothScrolling: true,
                                cursorBlinking: 'smooth',
                                cursorSmoothCaretAnimation: 'on',
                                renderLineHighlight: 'all',
                                lineHeight: 22,
                                letterSpacing: 0.5,
                                renderWhitespace: 'none',
                                bracketPairColorization: { enabled: true },
                                guides: { bracketPairs: true },
                            }}
                        />
                    </div>

                    {/* ═══════════════════════════════════════════ */}
                    {/* BOTTOM TOGGLE BAR + POPUP DRAWER           */}
                    {/* ═══════════════════════════════════════════ */}

                    {/* Toggle Bar */}
                    <div className="h-9 bg-[#1a1a1d] border-t border-white/[0.06] flex items-center justify-between px-3 shrink-0 z-20">
                        <div className="flex items-center gap-0.5">
                            <button
                                onClick={() => toggleConsole('testcases')}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${consoleOpen && consoleTab === 'testcases' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                            >
                                <Terminal size={12} /> Testcase
                                {consoleOpen && consoleTab === 'testcases' ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
                            </button>
                            <button
                                onClick={() => toggleConsole('result')}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${consoleOpen && consoleTab === 'result' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                            >
                                {isRunning && <Loader2 size={12} className="animate-spin" />}
                                {!isRunning && testResults.length > 0 && (
                                    allPassed ? <CheckCircle size={12} className="text-emerald-400" /> : <XCircle size={12} className="text-rose-400" />
                                )}
                                Test Result
                                {consoleOpen && consoleTab === 'result' ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            {testResults.length > 0 && !isRunning && (
                                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
                                    <span className={allPassed ? 'text-emerald-400' : 'text-rose-400'}>{passedCount}</span>/<span>{testResults.length}</span>
                                    <span className="hidden sm:inline">passed</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Slide-up Console Drawer */}
                    <div
                        className={`absolute left-0 right-0 bottom-9 bg-[#1a1a1d] border-t border-white/[0.06] z-30 transition-all duration-300 ease-in-out overflow-hidden ${consoleOpen ? 'h-[45%] opacity-100' : 'h-0 opacity-0'}`}
                        style={{ boxShadow: consoleOpen ? '0 -8px 30px rgba(0,0,0,0.5)' : 'none' }}
                    >
                        <div className="h-full overflow-auto custom-scrollbar">
                            {consoleTab === 'testcases' && (
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center gap-1 px-4 pt-3 pb-2 border-b border-white/[0.06] shrink-0">
                                        {visibleTestCases.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedTestCaseIdx(idx)}
                                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${selectedTestCaseIdx === idx ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                                            >
                                                Case {idx + 1}
                                            </button>
                                        ))}
                                        <div className="ml-auto text-[10px] text-zinc-600 font-mono">{visibleTestCases.length} visible</div>
                                    </div>
                                    <div className="flex-1 p-4 overflow-auto">
                                        {visibleTestCases[selectedTestCaseIdx] && (
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Input =</span>
                                                        <button onClick={() => copyToClipboard(visibleTestCases[selectedTestCaseIdx].input, 'input')} className="text-zinc-600 hover:text-white transition-colors">
                                                            {copiedInput ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                                                        </button>
                                                    </div>
                                                    <div className="bg-[#141416] border border-white/[0.06] rounded-lg p-3 font-mono text-sm whitespace-pre-wrap text-zinc-300">{visibleTestCases[selectedTestCaseIdx].input}</div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Expected =</span>
                                                        <button onClick={() => copyToClipboard(visibleTestCases[selectedTestCaseIdx].expected_output, 'output')} className="text-zinc-600 hover:text-white transition-colors">
                                                            {copiedOutput ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                                                        </button>
                                                    </div>
                                                    <div className="bg-[#141416] border border-white/[0.06] rounded-lg p-3 font-mono text-sm whitespace-pre-wrap text-zinc-300">{visibleTestCases[selectedTestCaseIdx].expected_output}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {consoleTab === 'result' && (
                                <div className="p-4 flex flex-col h-full overflow-auto">
                                    {isRunning && (
                                        <div className="flex-1 flex flex-col items-center justify-center gap-3">
                                            <div className="w-10 h-10 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
                                            <span className="text-xs text-zinc-500 font-mono">{isSubmitting ? 'Submitting against all test cases...' : 'Running against visible test cases...'}</span>
                                        </div>
                                    )}
                                    {executionError && (
                                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-start gap-3">
                                            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                            <span className="font-mono text-xs">{executionError}</span>
                                        </div>
                                    )}
                                    {!isRunning && !executionError && testResults.length === 0 && (
                                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-2">
                                            <Terminal size={28} className="text-zinc-700" />
                                            <span className="text-xs font-mono">Run your code to see results here</span>
                                        </div>
                                    )}
                                    {!isRunning && testResults.length > 0 && (
                                        <div className={`mb-4 p-3 rounded-xl border flex items-center gap-3 ${allPassed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                                            {allPassed ? <CheckCircle size={20} className="text-emerald-400 shrink-0" /> : <XCircle size={20} className="text-rose-400 shrink-0" />}
                                            <div>
                                                <div className={`font-bold text-sm ${allPassed ? 'text-emerald-400' : 'text-rose-400'}`}>{allPassed ? 'Accepted' : 'Wrong Answer'}</div>
                                                <div className="text-xs text-zinc-500">{passedCount}/{testResults.length} test cases passed</div>
                                            </div>
                                        </div>
                                    )}
                                    {rewards && (
                                        <div className="mb-4 p-4 bg-gradient-to-r from-orange-500/10 via-purple-500/5 to-orange-500/10 border border-orange-500/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 shrink-0 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 animate-bounce"><Trophy size={20} /></div>
                                                <div>
                                                    <div className="text-white font-bold text-sm">Challenge Completed! 🎉</div>
                                                    <div className="text-zinc-500 text-xs">First-time solve rewards earned.</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <div className="bg-black/50 px-3 py-2 rounded-lg border border-purple-500/20 flex items-center gap-2">
                                                    <Zap size={14} className="text-purple-400" fill="currentColor" />
                                                    <span className="text-purple-400 font-black text-sm">+{rewards.xp} XP</span>
                                                </div>
                                                <div className="bg-black/50 px-3 py-2 rounded-lg border border-amber-500/20 flex items-center gap-2">
                                                    <span className="text-amber-400 text-sm">🪙</span>
                                                    <span className="text-amber-400 font-black text-sm">+{rewards.coins}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {!isRunning && testResults.map((result, idx) => (
                                        <div key={idx} className="mb-4 last:mb-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                {result.passed ? <CheckCircle className="text-emerald-500" size={14} /> : <XCircle className="text-rose-500" size={14} />}
                                                <span className={`font-bold text-xs ${result.passed ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {result.is_hidden ? 'Hidden Test' : `Case ${idx + 1}`} — {result.passed ? 'Passed' : 'Failed'}
                                                </span>
                                            </div>
                                            {result.is_hidden ? (
                                                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4 text-xs text-zinc-500">
                                                    {result.passed ? <span className="text-zinc-400">Hidden edge case evaluated successfully ✓</span> : (
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-rose-400 font-bold">Hint:</span>
                                                            <span className="text-zinc-300">{result.hint || "Review your logic for boundary conditions and edge cases."}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                                    <div>
                                                        <div className="text-[10px] font-bold text-zinc-600 mb-1 uppercase tracking-wider">Input</div>
                                                        <div className="bg-[#141416] border border-white/[0.06] rounded-lg p-2.5 font-mono text-xs whitespace-pre-wrap text-zinc-400 max-h-20 overflow-auto">{result.actual_input}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold text-zinc-600 mb-1 uppercase tracking-wider">Expected</div>
                                                        <div className="bg-[#141416] border border-white/[0.06] rounded-lg p-2.5 font-mono text-xs whitespace-pre-wrap text-zinc-300 max-h-20 overflow-auto">{result.expected}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-bold text-zinc-600 mb-1 uppercase tracking-wider">Output</div>
                                                        <div className={`bg-[#141416] border rounded-lg p-2.5 font-mono text-xs whitespace-pre-wrap max-h-20 overflow-auto ${result.passed ? 'border-emerald-500/20 text-zinc-300' : 'border-rose-500/20 text-rose-300'}`}>
                                                            {result.compile_output ? <span className="text-rose-400">{result.compile_output}</span> : result.stdout ? result.stdout : <span className="text-zinc-600 italic">No output</span>}
                                                            {result.stderr && <div className="mt-1.5 text-rose-400 border-t border-rose-500/20 pt-1.5 text-[11px]">{result.stderr}</div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </Panel>
            </PanelGroup>
        </div>
    );
}
