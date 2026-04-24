'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Swords, Clock, ChevronLeft, Loader2, Trophy, Play, Send, CheckCircle, XCircle, User, Maximize2, AlertTriangle, ChevronRight } from 'lucide-react';
import { Panel, Group, Separator, useDefaultLayout } from 'react-resizable-panels';

const PanelGroup = Group as any;
const PanelResizeHandle = Separator as any;

const SUPPORTED_LANGUAGES = [
    { id: 'javascript', name: 'JavaScript', slug: 'javascript', template: 'function solution(input) {\n  // Write your solution here\n  \n}' },
    { id: 'python', name: 'Python 3', slug: 'python', template: 'def solution(input):\n    # Write your solution here\n    pass' },
    { id: 'cpp', name: 'C++', slug: 'cpp', template: '#include <iostream>\n\nvoid solution() {\n    // Write your solution here\n    \n}\n\nint main() {\n    solution();\n    return 0;\n}' },
    { id: 'java', name: 'Java', slug: 'java', template: 'public class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n        \n    }\n}' },
];

interface TestCase {
    input: string;
    expected_output: string;
}

interface BattleQuestion {
    title: string;
    description: string;
    difficulty: string;
    category: string;
    starter_code: string;
    test_cases: TestCase[];
    constraints?: string[];
    hints?: string[];
    time_limit_seconds: number;
}

export default function BattleRoomPage() {
    const router = useRouter();
    const params = useParams();
    const battleId = params.battleId as string;
    const { user } = useAuth();

    const [battle, setBattle] = useState<any>(null);
    const [question, setQuestion] = useState<BattleQuestion | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [testResults, setTestResults] = useState<{ passed: boolean; output: string }[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [battleComplete, setBattleComplete] = useState(false);
    const [finalBattle, setFinalBattle] = useState<any>(null);
    const [warningCount, setWarningCount] = useState(0);
    const [showViolationOverlay, setShowViolationOverlay] = useState(false);
    const [violationType, setViolationType] = useState<'focus' | 'fullscreen'>('focus');
    const [hasEnteredArena, setHasEnteredArena] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const hasEnteredArenaRef = useRef(false);

    useEffect(() => {
        hasEnteredArenaRef.current = hasEnteredArena;
    }, [hasEnteredArena]);

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
        id: 'battle-room-layout',
        storage: safeStorage
    });

    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        setMounted(true);

        const triggerViolation = (type: 'focus' | 'fullscreen' | 'dimensions') => {
            if (battleComplete || submitted || !hasEnteredArenaRef.current) return;
            
            setViolationType(type === 'dimensions' ? 'fullscreen' : type);
            setShowViolationOverlay(true);

            setWarningCount(prev => {
                const next = prev + 1;
                if (next >= 3) {
                    handleSubmit();
                }
                return next;
            });
        };

        const checkFullscreen = () => {
            const isFull = !!document.fullscreenElement;
            setIsFullscreen(isFull);
            if (!isFull) {
                triggerViolation('fullscreen');
            } else {
                setShowViolationOverlay(prev => prev ? false : prev);
            }
        };

        const handleFocusLoss = () => {
            triggerViolation('focus');
        };

        const handleDimensions = () => {
            // Detect if window is significantly smaller than screen (split-screen/minimization)
            const isSplit = window.innerWidth < window.screen.width * 0.5 || window.innerHeight < window.screen.height * 0.5;
            if (isSplit && isFullscreen) {
                triggerViolation('dimensions');
            }
        };

        const blockEvents = (e: Event) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        };

        const blockKeyboard = (e: KeyboardEvent) => {
            if (e.key === 'F12') { e.preventDefault(); e.stopImmediatePropagation(); return false; }
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
                e.preventDefault(); e.stopImmediatePropagation(); return false;
            }
            if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) { e.preventDefault(); e.stopImmediatePropagation(); return false; }
        };

        // Block clipboard actions but allow right-click context menu
        document.addEventListener('copy', blockEvents, { capture: true });
        document.addEventListener('paste', blockEvents, { capture: true });
        document.addEventListener('cut', blockEvents, { capture: true });
        
        document.addEventListener('fullscreenchange', checkFullscreen, { capture: true });
        // Use visibilitychange instead of window.blur to prevent false positives from native dropdowns and clicks
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') handleFocusLoss();
        }, { capture: true });
        
        window.addEventListener('resize', handleDimensions, { capture: true });
        document.addEventListener('keydown', blockKeyboard, { capture: true });

        return () => {
            document.removeEventListener('copy', blockEvents, { capture: true });
            document.removeEventListener('paste', blockEvents, { capture: true });
            document.removeEventListener('cut', blockEvents, { capture: true });
            document.removeEventListener('fullscreenchange', checkFullscreen, { capture: true });
            window.removeEventListener('resize', handleDimensions, { capture: true });
            document.removeEventListener('keydown', blockKeyboard, { capture: true });
        };
    }, [battleComplete, submitted, hasEnteredArena]);

    const handleEnterFullscreen = async () => {
        try {
            await document.documentElement.requestFullscreen();
        } catch (err) {
            console.error('Fullscreen request failed:', err);
        }
    };

    const handleLeave = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
        router.push('/training/competitive');
    };

    // Load battle data
    useEffect(() => {
        if (!battleId) return;
        const loadBattle = async () => {
            try {
                const res = await fetch(`/api/battle?id=${battleId}`);
                const data = await res.json();
                if (data.error) { router.push('/training/competitive'); return; }
                setBattle(data);

                if (data.status === 'completed') {
                    setBattleComplete(true);
                    setFinalBattle(data);
                    setLoading(false);
                    return;
                }

                // Load question
                if (data.question_id) {
                    const qRes = await fetch(`/api/battle/question?id=${data.question_id}`);
                    const qData = await qRes.json();

                    let starterCode = qData.starter_code || '// Write your solution here\nfunction solution(input) {\n  \n}';
                    let testCases = qData.test_cases || [];
                    let constraints = qData.constraints || [];
                    let hints = qData.hints || [];

                    try { if (typeof starterCode === 'string') starterCode = JSON.parse(starterCode); } catch { }
                    try { if (typeof testCases === 'string') testCases = JSON.parse(testCases); } catch { }
                    try { if (typeof constraints === 'string') constraints = JSON.parse(constraints); } catch { }
                    try { if (typeof hints === 'string') hints = JSON.parse(hints); } catch { }

                    // If starterCode is an object with language keys, use javascript
                    if (typeof starterCode === 'object' && !Array.isArray(starterCode)) {
                        starterCode = starterCode.javascript || starterCode.js || Object.values(starterCode)[0] || '';
                    }

                    setQuestion({
                        ...qData,
                        starter_code: starterCode as string,
                        test_cases: testCases as TestCase[],
                        constraints: Array.isArray(constraints) ? constraints : [],
                        hints: Array.isArray(hints) ? hints : [],
                    });
                    setCode(starterCode as string);
                    setTimeLeft(qData.time_limit_seconds || 900);
                    setStartTime(Date.now());
                } else {
                    // No question assigned — use a default
                    const defaultQ: BattleQuestion = {
                        title: 'Two Sum',
                        description: 'Given an array of numbers and a target, return the indices of the two numbers that add up to the target.\n\nExample:\nInput: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]\nExplanation: nums[0] + nums[1] = 2 + 7 = 9',
                        difficulty: 'Easy',
                        category: 'Arrays',
                        starter_code: '// Solve: Two Sum\n// Given nums array and target, return indices of two numbers that add up to target\n\nfunction twoSum(nums, target) {\n  // Your code here\n  \n}\n\n// Test\nconsole.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]',
                        test_cases: [
                            { input: 'twoSum([2,7,11,15], 9)', expected_output: '[0,1]' },
                            { input: 'twoSum([3,2,4], 6)', expected_output: '[1,2]' },
                        ],
                        constraints: [
                            '2 <= nums.length <= 10^4',
                            '-10^9 <= nums[i] <= 10^9',
                            '-10^9 <= target <= 10^9'
                        ],
                        hints: [
                            'Try a brute force approach first.',
                            'Can you use a hash map to reduce time complexity to O(n)?'
                        ],
                        time_limit_seconds: 900,
                    };
                    setQuestion(defaultQ);
                    setCode(defaultQ.starter_code);
                    setTimeLeft(900);
                    setStartTime(Date.now());
                }
            } catch (err) {
                console.error('Failed to load battle:', err);
            } finally {
                setLoading(false);
            }
        };
        loadBattle();
    }, [battleId, router]);

    // Timer countdown
    useEffect(() => {
        if (loading || battleComplete || submitted || timeLeft <= 0 || !hasEnteredArena) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(); // Auto-submit on timeout
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [loading, battleComplete, submitted]);

    // Poll for opponent status
    useEffect(() => {
        if (!battleId || battleComplete || !user) return;
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/battle?id=${battleId}`);
                const data = await res.json();
                setBattle(data);
                if (data.status === 'completed') {
                    setBattleComplete(true);
                    setFinalBattle(data);

                    // Log activity
                    const isPlayerA = user.id === data.player_a_id;
                    const won = data.winner_id === user.id;
                    const draw = data.winner_id === 'draw' || (!data.winner_id && data.status === 'completed');
                    
                    const dbService = (await import('@/services/dbService')).dbService;
                    dbService.logActivity(user.id, {
                        type: 'battle',
                        title: won ? 'Victory in 1V1 Battle' : draw ? 'Draw in 1V1 Battle' : 'Defeat in 1V1 Battle',
                        result: won ? 'won' : draw ? 'draw' : 'lost',
                        xp_earned: won ? 50 : draw ? 20 : 10,
                        metadata: {
                            battleId,
                            difficulty: data.difficulty,
                            opponentId: isPlayerA ? data.player_b_id : data.player_a_id,
                            duration: data.ended_at ? Math.floor((new Date(data.ended_at).getTime() - new Date(data.created_at).getTime()) / 1000) : 0
                        }
                    });

                    clearInterval(interval);
                }
            } catch { }
        }, 3000);
        return () => clearInterval(interval);
    }, [battleId, battleComplete, user]);

    const handleLanguageChange = (langSlug: string) => {
        if (submitted) return;
        setSelectedLanguage(langSlug);
        
        // Get template for new language
        const langInfo = SUPPORTED_LANGUAGES.find(l => l.slug === langSlug);
        let starterCode = langInfo?.template || '';

        // Check if question has language-specific starter code
        if (question?.starter_code) {
            try {
                const qStarter = typeof question.starter_code === 'string' 
                    ? JSON.parse(question.starter_code) 
                    : question.starter_code;
                
                if (qStarter[langSlug]) starterCode = qStarter[langSlug];
            } catch { }
        }

        setCode(starterCode);
    };

    const runCode = async () => {
        setRunning(true);
        setTestResults([]);
        try {
            const res = await fetch('/api/code/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language: selectedLanguage }),
            });
            const data = await res.json();
            const output = data.stdout || data.stderr || data.compile_output || 'No output';
            setTestResults([{ passed: !data.stderr && !data.compile_output, output: output.trim() }]);
        } catch {
            setTestResults([{ passed: false, output: 'Execution failed' }]);
        } finally {
            setRunning(false);
        }
    };

    const handleSubmit = async () => {
        if (submitted || !user || !battleId) return;
        setSubmitting(true);

        const elapsedMs = Date.now() - startTime;
        const isPlayerA = battle?.player_a_id === user.id;

        // Run against test cases
        let passedCount = 0;
        const totalTests = question?.test_cases?.length || 0;

        if (totalTests > 0) {
            for (const tc of question!.test_cases) {
                try {
                    // For JS, wrap in console.log
                    let testCode = code;
                    if (selectedLanguage === 'javascript' || selectedLanguage === 'typescript') {
                        testCode = `${code}\nconsole.log(JSON.stringify(${tc.input}));`;
                    } else if (selectedLanguage === 'python') {
                        testCode = `import json\n${code}\nprint(json.dumps(${tc.input}))`;
                    }

                    const res = await fetch('/api/code/execute', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code: testCode, language: selectedLanguage }),
                    });
                    const data = await res.json();
                    const actualOutput = (data.stdout || '').trim();
                    const expectedOutput = tc.expected_output.trim();

                    // Normalize both outputs (remove whitespace) for robust comparison
                    const normalizedActual = actualOutput.replace(/\s/g, '');
                    const normalizedExpected = expectedOutput.replace(/\s/g, '');

                    if (normalizedActual === normalizedExpected) {
                        passedCount++;
                    }
                } catch { }
            }
        } else {
            passedCount = 1; // If no test cases, just count as passed
        }

        // Update battle session
        const updates: Record<string, any> = {};
        if (isPlayerA) {
            updates.player_a_code = code;
            updates.player_a_time_ms = elapsedMs;
            updates.player_a_passed = passedCount;
        } else {
            updates.player_b_code = code;
            updates.player_b_time_ms = elapsedMs;
            updates.player_b_passed = passedCount;
        }

        try {
            // Fetch latest battle state to check if opponent already submitted
            const latestRes = await fetch(`/api/battle?id=${battleId}`);
            const latestBattle = await latestRes.json();

            const otherSubmitted = isPlayerA
                ? latestBattle.player_b_time_ms !== null && latestBattle.player_b_time_ms !== undefined
                : latestBattle.player_a_time_ms !== null && latestBattle.player_a_time_ms !== undefined;

            if (otherSubmitted) {
                // Both have submitted — determine winner
                const aPassed = isPlayerA ? passedCount : (latestBattle.player_a_passed || 0);
                const bPassed = isPlayerA ? (latestBattle.player_b_passed || 0) : passedCount;
                const aTime = isPlayerA ? elapsedMs : (latestBattle.player_a_time_ms || 999999);
                const bTime = isPlayerA ? (latestBattle.player_b_time_ms || 999999) : elapsedMs;

                let winnerId = '';
                if (aPassed > bPassed) winnerId = latestBattle.player_a_id;
                else if (bPassed > aPassed) winnerId = latestBattle.player_b_id;
                else if (aTime < bTime) winnerId = latestBattle.player_a_id;
                else if (bTime < aTime) winnerId = latestBattle.player_b_id;
                // else draw

                updates.status = 'completed';
                updates.winner_id = winnerId;
                updates.ended_at = new Date().toISOString();
            }

            await fetch('/api/battle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update', battleId, updates }),
            }).catch(() => {
                // Fallback: directly update via GET polling
            });

            // Direct Appwrite update via a different approach — use the existing API
            // For now, just update locally
            setBattle((prev: any) => ({ ...prev, ...updates }));
        } catch (err) {
            console.error('Submit error:', err);
        }

        setSubmitted(true);
        setSubmitting(false);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const isPlayerA = battle?.player_a_id === user?.id;
    const opponentSubmitted = isPlayerA
        ? (battle?.player_b_time_ms !== null && battle?.player_b_time_ms !== undefined && battle?.player_b_time_ms > 0)
        : (battle?.player_a_time_ms !== null && battle?.player_a_time_ms !== undefined && battle?.player_a_time_ms > 0);

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-t-2 border-emerald-500 animate-spin" />
                <Swords size={24} className="absolute inset-0 m-auto text-emerald-500 animate-pulse" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-500/60">Loading Battle...</span>
        </div>
    );

    // Battle completed view
    if (battleComplete && finalBattle) {
        const won = finalBattle.winner_id === user?.id;
        const draw = !finalBattle.winner_id;

        return (
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center relative overflow-hidden">
                <div className="fixed inset-0 pointer-events-none">
                    <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[120px] rounded-[100%] opacity-20 ${won ? 'bg-yellow-500' : draw ? 'bg-blue-500' : 'bg-red-500'}`} />
                </div>

                <div className="relative z-10 text-center max-w-lg mx-auto px-4">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border-2 ${won ? 'bg-yellow-500/10 border-yellow-500/30' : draw ? 'bg-blue-500/10 border-blue-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                        <Trophy size={40} className={won ? 'text-yellow-400' : draw ? 'text-blue-400' : 'text-red-400'} />
                    </div>

                    <h1 className="font-[family-name:var(--font-bebas)] text-6xl md:text-8xl tracking-wider mb-4">
                        {won ? 'VICTORY' : draw ? 'DRAW' : 'DEFEAT'}
                    </h1>

                    <p className="text-zinc-400 mb-8 font-mono text-sm">
                        {won ? 'You solved it faster with more test cases passed!' : draw ? 'Both players performed equally!' : 'Your opponent was faster this time.'}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">You</p>
                            <p className="text-xl font-black font-mono">
                                {isPlayerA ? (finalBattle.player_a_passed || 0) : (finalBattle.player_b_passed || 0)} passed
                            </p>
                            <p className="text-xs text-zinc-500 font-mono">
                                {formatTime(Math.floor((isPlayerA ? (finalBattle.player_a_time_ms || 0) : (finalBattle.player_b_time_ms || 0)) / 1000))}
                            </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Opponent</p>
                            <p className="text-xl font-black font-mono">
                                {isPlayerA ? (finalBattle.player_b_passed || 0) : (finalBattle.player_a_passed || 0)} passed
                            </p>
                            <p className="text-xs text-zinc-500 font-mono">
                                {formatTime(Math.floor((isPlayerA ? (finalBattle.player_b_time_ms || 0) : (finalBattle.player_a_time_ms || 0)) / 1000))}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/training/competitive')}
                        className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-sm uppercase tracking-widest active:scale-95 transition-all"
                    >
                        Back to Arena
                    </button>
                </div>
            </div>
        );
    }

    if (!mounted) return <div className="h-screen bg-[#050505]" />;

    if (!hasEnteredArena) {
        return (
            <div className="flex flex-col h-screen bg-[#050505] items-center justify-center p-6 text-center">
                <div className="max-w-md w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                        <Maximize2 size={32} className="text-emerald-500" />
                    </div>
                    
                    <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-widest">
                        Enter Battle Arena
                    </h2>
                    
                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                        To maintain a fair environment, 1V1 battles require full-screen mode. Copying, pasting, and leaving the window are strictly prohibited.
                    </p>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8 text-left">
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-xs text-zinc-300">
                                <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                                <span>Do not exit full-screen mode</span>
                            </li>
                            <li className="flex items-start gap-3 text-xs text-zinc-300">
                                <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                                <span>Do not switch tabs or applications</span>
                            </li>
                            <li className="flex items-start gap-3 text-xs text-zinc-300">
                                <AlertTriangle size={14} className="text-orange-400 shrink-0 mt-0.5" />
                                <span className="text-orange-200">3 violations will result in automatic submission</span>
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={async () => {
                            try {
                                await document.documentElement.requestFullscreen();
                                setHasEnteredArena(true);
                            } catch (err) {
                                console.error('Fullscreen request failed:', err);
                            }
                        }}
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    >
                        Enter Full Screen & Start
                    </button>
                    <button
                        onClick={() => router.push('/training/competitive')}
                        className="w-full mt-3 py-3 text-zinc-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors"
                    >
                        Cancel & Return
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[#050505] overflow-hidden">
            {/* Violation Overlay */}
            {showViolationOverlay && !battleComplete && !submitted && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 text-center">
                    <div className="max-w-md w-full bg-[#0A0A0A] border border-red-500/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} className="text-red-500 animate-pulse" />
                        </div>
                        
                        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">
                            Security Violation Detected
                        </h2>
                        
                        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                            {violationType === 'focus' 
                                ? `You have switched tabs or applications. This is strictly prohibited during 1V1 battles.`
                                : `You have exited fullscreen mode. The battle arena must remain in full view at all times.`
                            }
                        </p>

                        <div className="bg-white/5 rounded-xl p-4 mb-8">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1">Warning Status</p>
                            <div className="flex justify-center gap-2">
                                {[1, 2, 3].map(i => (
                                    <div 
                                        key={i} 
                                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                                            i <= warningCount ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-white/10'
                                        }`} 
                                    />
                                ))}
                            </div>
                            <p className="text-xs font-bold text-red-500 mt-3 font-mono">
                                {warningCount >= 3 ? 'AUTO-SUBMITTING...' : `Warning #${warningCount} of 2`}
                            </p>
                        </div>

                        {warningCount < 3 && (
                            <button
                                onClick={() => {
                                    handleEnterFullscreen();
                                    setShowViolationOverlay(false);
                                }}
                                className="w-full py-4 bg-white text-black font-black rounded-xl text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all active:scale-95"
                            >
                                Resume Battle (Fullscreen)
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Leave Confirmation Modal */}
            {showLeaveModal && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 text-center">
                    <div className="max-w-md w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(255,255,255,0.05)] relative overflow-hidden">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} className="text-red-500" />
                        </div>

                        <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-widest">
                            Leave Arena?
                        </h2>
                        
                        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                            Are you sure you want to leave? Your opponent might win by default and your progress will be lost.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => setShowLeaveModal(false)}
                                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-colors"
                            >
                                Stay in Battle
                            </button>
                            <button
                                onClick={async () => {
                                    if (document.fullscreenElement) {
                                        try {
                                            await document.exitFullscreen();
                                        } catch(e) {}
                                    }
                                    router.push('/training/competitive');
                                }}
                                className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-black rounded-xl text-xs uppercase tracking-widest transition-colors border border-red-500/20"
                            >
                                Leave Arena
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top bar */}
            <div className="h-12 bg-[#0A0A0A] flex items-center justify-between px-4 border-b border-white/10 shrink-0 relative z-20">
                <button onClick={() => setShowLeaveModal(true)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                    <ChevronLeft size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest font-mono hidden sm:inline">Leave</span>
                </button>

                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                        (battle?.difficulty || question?.difficulty)?.toLowerCase() === 'easy' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : (battle?.difficulty || question?.difficulty)?.toLowerCase() === 'hard'
                        ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                    }`}>
                        {(() => {
                            const diff = (battle?.difficulty || question?.difficulty || 'medium').toLowerCase();
                            if (diff === 'easy') return 'Scout';
                            if (diff === 'hard') return 'Legend';
                            return 'Warrior';
                        })()}
                    </span>
                    <span className="text-sm font-bold text-white tracking-wider truncate max-w-[200px] sm:max-w-md">
                        {question?.title || 'Battle Question'}
                    </span>
                </div>

                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg font-mono font-black text-sm ${timeLeft < 60 ? 'bg-red-500/20 text-red-400 animate-pulse' : timeLeft < 180 ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-zinc-300'}`}>
                    <Clock size={14} />
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Main split layout */}
            <PanelGroup 
                id="battle-room-layout" 
                orientation="horizontal" 
                className="flex-1 flex min-h-0"
                defaultLayout={defaultLayout}
                onLayoutChanged={onLayoutChanged}
            >
                {/* Left: Question + Opponent status */}
                <Panel defaultSize={35} minSize={25} className="border-r border-white/10 flex flex-col bg-[#0A0A0A] overflow-hidden">
                    {/* Question panel */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        <div>
                            <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-3">
                                <Swords size={12} />
                                Battle Problem
                            </div>
                            <h2 className="text-2xl font-black text-white mb-4 tracking-wide">{question?.title}</h2>
                            <div className="text-zinc-300 text-sm font-mono leading-7 whitespace-pre-wrap mb-8 bg-white/[0.02] p-4 border border-white/5 rounded-xl">
                                {question?.description}
                            </div>

                            {/* Constraints Section */}
                            {question?.constraints && question.constraints.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <AlertTriangle size={14} className="text-emerald-500/70" /> Constraints
                                    </h4>
                                    <ul className="space-y-2 bg-black/40 border border-white/5 rounded-xl p-4">
                                        {question.constraints.map((c, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs font-mono text-zinc-400">
                                                <span className="text-emerald-500/50 mt-1">•</span>
                                                <span className="bg-white/[0.03] px-1.5 py-0.5 rounded text-zinc-300">{c}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Hints Section */}
                            {question?.hints && question.hints.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Hints</h4>
                                    <div className="space-y-2">
                                        {question.hints.map((h, i) => (
                                            <div key={i} className="group bg-white/5 border border-white/5 rounded-lg p-3 hover:border-emerald-500/30 transition-all cursor-default relative overflow-hidden">
                                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                                <p className="text-[11px] font-mono text-zinc-400 relative z-10 leading-relaxed">
                                                    {h}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Test cases preview */}
                        {question?.test_cases && question.test_cases.length > 0 && (
                            <div className="mb-8 p-4 bg-black/20 border border-white/[0.03] rounded-2xl">
                                <h4 className="text-[11px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Play size={14} className="text-blue-400/70" /> Example Test Cases
                                </h4>
                                <div className="space-y-4">
                                    {question.test_cases.map((tc, i) => (
                                        <div key={i} className="bg-[#111] rounded-xl p-5 border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="mb-4 flex flex-col gap-2">
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Input:</span>
                                                <span className="text-[13px] text-zinc-300 font-mono bg-black/60 border border-white/5 px-3 py-2 rounded-lg">{tc.input}</span>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Expected Output:</span>
                                                <span className="text-[13px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/10 px-3 py-2 rounded-lg">{tc.expected_output}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Opponent status footer */}
                    <div className="h-14 shrink-0 border-t border-white/10 px-4 flex items-center">
                        <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                    <User size={14} className="text-orange-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-white">Opponent</p>
                                    <p className="text-[10px] text-zinc-500 font-mono truncate">
                                        {battle?.status === 'waiting' ? 'Waiting to join...' : opponentSubmitted ? 'Submitted!' : 'Coding...'}
                                    </p>
                                </div>
                            </div>
                            {opponentSubmitted && (
                                <div className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-[10px] text-orange-400 font-bold uppercase tracking-widest">
                                    Done
                                </div>
                            )}
                        </div>
                    </div>
                </Panel>

                <PanelResizeHandle className="w-1.5 bg-[#050505] border-x border-white/5 hover:bg-emerald-500/20 transition-colors cursor-col-resize z-50 flex items-center justify-center group relative">
                    <div className="w-0.5 h-12 bg-white/20 rounded-full group-hover:bg-emerald-400/60 transition-colors" />
                </PanelResizeHandle>

                {/* Right: Code editor + Output */}
                <Panel defaultSize={65} minSize={25} className="flex flex-col min-w-0">
                    {/* Code editor */}
                    <div className="flex-1 min-h-0 relative">
                        <div className="absolute top-2 left-4 flex items-center gap-2 z-10">
                            <select
                                value={selectedLanguage}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                disabled={submitted}
                                className="bg-[#1A1A1A] text-[10px] font-mono text-zinc-400 uppercase tracking-widest px-2 py-1 rounded border border-white/5 outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
                            >
                                {SUPPORTED_LANGUAGES.map(lang => (
                                    <option key={lang.id} value={lang.slug}>{lang.name}</option>
                                ))}
                            </select>
                        </div>
                        <textarea
                            ref={textareaRef}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            disabled={submitted}
                            spellCheck={false}
                            className="w-full h-full bg-[#111] text-[#E5E7EB] font-mono text-[14px] leading-[1.7] p-6 pt-16 resize-none outline-none border-none focus:ring-0 disabled:opacity-50 selection:bg-emerald-500/20"
                            style={{ tabSize: 4 }}
                            onKeyDown={(e) => {
                                if (e.key === 'Tab') {
                                    e.preventDefault();
                                    const start = e.currentTarget.selectionStart;
                                    const end = e.currentTarget.selectionEnd;
                                    setCode(code.substring(0, start) + '  ' + code.substring(end));
                                    setTimeout(() => {
                                        if (textareaRef.current) {
                                            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
                                        }
                                    });
                                }
                            }}
                        />
                    </div>

                    {/* Output panel */}
                    {testResults.length > 0 && (
                        <div className="h-44 shrink-0 border-t border-white/10 bg-[#0A0A0A] overflow-y-auto p-5 custom-scrollbar relative shadow-[inset_0_20px_20px_-20px_rgba(0,0,0,0.5)]">
                            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">
                                <Maximize2 size={12} /> Console Output
                            </div>
                            {testResults.map((r, i) => (
                                <div key={i} className="flex items-start gap-2 mb-1">
                                    {r.passed ? <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" /> : <XCircle size={14} className="text-red-500 mt-0.5 shrink-0" />}
                                    <pre className="text-xs font-mono text-zinc-400 whitespace-pre-wrap">{r.output}</pre>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Bottom action bar */}
                    <div className="h-16 shrink-0 border-t border-white/10 bg-black/60 backdrop-blur-lg flex items-center justify-between px-6 z-20">
                        <button
                            onClick={runCode}
                            disabled={running || submitted}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-30"
                        >
                            {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                            Run
                        </button>

                        {submitted ? (
                            <div className="flex items-center gap-2 text-emerald-400">
                                <CheckCircle size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">Submitted — Waiting for opponent</span>
                            </div>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
                            >
                                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                Submit Solution
                            </button>
                        )}
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
}
