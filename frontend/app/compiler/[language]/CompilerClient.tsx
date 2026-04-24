'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
    Play, Terminal, ChevronDown, RotateCcw, Maximize2, Loader2,
    Columns, Rows, ChevronRight, Settings, FileCode, Search,
    GitBranch, Box, MoreVertical
} from 'lucide-react';
// @ts-ignore
import { Panel, Group, Separator, useDefaultLayout } from 'react-resizable-panels';

const PanelGroup = Group as any;
const PanelResizeHandle = Separator as any;
import { LanguageConfig, LANGUAGES, getLanguageBySlug } from '@/lib/judge0';
import TurnstileWidget from '@/components/TurnstileWidget';

// Dynamic import for Editor to avoid SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface CompilerClientProps {
    initialLanguage: LanguageConfig;
}

export default function CompilerClient({ initialLanguage }: CompilerClientProps) {
    const router = useRouter();
    const [language, setLanguage] = useState<LanguageConfig>(initialLanguage);
    const [code, setCode] = useState(initialLanguage.defaultCode);
    const [output, setOutput] = useState<{ stdout: string | null; stderr: string | null; message: string | null } | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [stdin, setStdin] = useState('');
    const [showStdin, setShowStdin] = useState(false);

    // UI State
    const [activeSidebarItem, setActiveSidebarItem] = useState('explorer');

    // Security / Session State
    const [sessionToken, setSessionToken] = useState<string | null>(null);
    const [showSecurityModal, setShowSecurityModal] = useState(false);

    // Layout State
    const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('horizontal'); // Default: Horizontal
    const [isConsoleOpen, setIsConsoleOpen] = useState(true); // Default: Open

    // Hydration & Toggle Safe State
    const [isMounted, setIsMounted] = useState(false);
    const [isEditorReady, setIsEditorReady] = useState(false);

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
        id: 'compiler-layout',
        storage: safeStorage
    });

    // Load session and layout from local storage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('compiler_session_token');
        if (storedToken) setSessionToken(storedToken);

        const storedLayout = localStorage.getItem('compiler_layout_mode');
        if (storedLayout === 'horizontal' || storedLayout === 'vertical') {
            setLayoutMode(storedLayout);
        }

        setIsMounted(true);
        // Start the editor slightly after hydration to guarantee layout box is calculated
        setTimeout(() => setIsEditorReady(true), 50);
    }, []);

    const toggleLayout = (mode: 'vertical' | 'horizontal') => {
        if (layoutMode === mode) return;

        // Safely unmount Monaco to prevent the Duplicate Definition web-worker crash
        setIsEditorReady(false);
        setLayoutMode(mode);
        localStorage.setItem('compiler_layout_mode', mode);

        // Allow React a tick to completely destroy the old PanelGroup DOM before mounting the new one
        setTimeout(() => setIsEditorReady(true), 50);
    };

    const handleLanguageChange = (slug: string) => {
        const newLang = getLanguageBySlug(slug);
        if (newLang) {
            setLanguage(newLang);
            setCode(newLang.defaultCode); // Optional: Reset code on language change? Or keep it?
            router.push(`/compiler/${slug}`);
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

    const handleRun = async () => {
        // Security Check
        if (!sessionToken) {
            setShowSecurityModal(true);
            return;
        }

        setIsRunning(true);
        if (!isConsoleOpen) setIsConsoleOpen(true); // Auto-open console
        setOutput(null);

        try {
            const res = await fetch('/api/code/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-compiler-session': sessionToken
                },
                body: JSON.stringify({
                    code,
                    language: language.slug,
                    stdin: stdin.trim() ? stdin : undefined
                })
            });

            const data = await res.json();

            // Handle session expiry explicitly
            if (res.status === 401 && data.sessionExpired) {
                setSessionToken(null);
                localStorage.removeItem('compiler_session_token');
                setShowSecurityModal(true);
                setIsRunning(false);
                return;
            }

            if (!res.ok) {
                setOutput({ stdout: null, stderr: data.error || 'Execution failed', message: null });
            } else {
                setOutput({
                    stdout: data.stdout,
                    stderr: data.stderr,
                    message: data.message
                });
            }
        } catch (err) {
            setOutput({ stdout: null, stderr: 'Network error or server unavailable.', message: null });
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="flex flex-1 w-full bg-[#0E0E0E] text-zinc-400 overflow-hidden font-sans min-h-0">
            {/* Security Modal */}
            {showSecurityModal && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#18181b] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold mb-2 font-outfit text-white">Security Verification</h3>
                        <p className="text-zinc-400 mb-6 text-sm">Please verify you are human to execute code.</p>
                        <div className="flex justify-center bg-black/20 p-4 rounded-xl min-h-[80px]">
                            <TurnstileWidget
                                onVerify={handleTurnstileVerify}
                            />
                        </div>
                        <button
                            onClick={() => setShowSecurityModal(false)}
                            className="mt-4 text-xs text-zinc-500 hover:text-white underline w-full text-center"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Language Sidebar */}
            <div className="w-[52px] bg-[#111113] flex flex-col items-center border-r border-white/[0.06] z-20 overflow-y-auto overflow-x-hidden custom-scrollbar shrink-0">
                <div className="flex flex-col items-center w-full py-3 gap-1">
                    {[
                        { slug: 'python', label: 'PY', tooltip: 'Python' },
                        { slug: 'javascript', label: 'JS', tooltip: 'JavaScript' },
                        { slug: 'typescript', label: 'TS', tooltip: 'TypeScript' },
                        { slug: 'java', label: '☕', tooltip: 'Java', emoji: true },
                        { slug: 'cpp', label: 'C++', tooltip: 'C++' },
                        { slug: 'c-gcc-9', label: 'C', tooltip: 'C' },
                        { slug: 'csharp', label: 'C#', tooltip: 'C#' },
                        { slug: 'go', label: 'Go', tooltip: 'Go' },
                        { slug: 'rust', label: 'Rs', tooltip: 'Rust' },
                        { slug: 'kotlin', label: 'Kt', tooltip: 'Kotlin' },
                        { slug: 'ruby', label: 'Rb', tooltip: 'Ruby' },
                        { slug: 'php', label: 'php', tooltip: 'PHP' },
                    ].map((lang) => {
                        const isActive = language.slug === lang.slug;
                        return (
                            <button
                                key={lang.slug}
                                onClick={() => handleLanguageChange(lang.slug)}
                                title={lang.tooltip}
                                className={`
                                    w-10 h-10 rounded-lg flex items-center justify-center mx-auto transition-all duration-200 group relative
                                    ${isActive
                                        ? 'bg-white/[0.1] text-white shadow-sm'
                                        : 'bg-transparent text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05]'
                                    }
                                `}
                            >
                                {/* Active indicator bar */}
                                {isActive && (
                                    <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]" />
                                )}
                                <span className={`font-bold ${lang.emoji ? 'text-base' : 'text-[11px]'} leading-none select-none tracking-tight`}>
                                    {lang.label}
                                </span>
                                {/* Tooltip */}
                                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#1a1a1d] border border-white/10 rounded-md text-[11px] text-white font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                                    {lang.tooltip}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 relative overflow-hidden min-h-0">

                {/* Header / Toolbar */}
                <div className="h-14 border-b border-white/5 bg-[#0E0E0E]/80 backdrop-blur-xl flex items-center justify-between px-4 z-20 shrink-0 relative">
                    <div className="flex items-center gap-4">
                        {/* Breadcrumbs / File Name */}
                        <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                            <span className="text-blue-500"><FileCode size={16} /></span>
                            <span>main.{language.extension || 'txt'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Language Selector */}
                        <div className="relative group">
                            <select
                                value={language.slug}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className="appearance-none bg-[#1F1F22] text-zinc-300 border border-white/5 rounded-md py-1.5 pl-3 pr-8 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500/50 hover:bg-[#27272a] transition-all cursor-pointer min-w-[140px]"
                            >
                                {LANGUAGES.map(lang => (
                                    <option key={lang.id} value={lang.slug}>
                                        {lang.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronRight className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none rotate-90" size={12} />
                        </div>

                        {/* Stdin Toggle */}
                        <button
                            className={`p-2 rounded-md transition-colors ${showStdin ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                            onClick={() => setShowStdin(!showStdin)}
                            title="Standard Input"
                        >
                            <kbd className="text-[10px] border border-zinc-700 rounded px-1.5 py-0.5 font-sans font-bold pointer-events-none">STDIN</kbd>
                        </button>

                        {/* Layout Toggles */}
                        <div className="flex items-center bg-[#1F1F22] rounded-md p-0.5 border border-white/5">
                            <button
                                onClick={() => toggleLayout('horizontal')}
                                className={`p-1 rounded transition-all ${layoutMode === 'horizontal' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                title="Side by Side"
                            >
                                <Columns size={14} />
                            </button>
                            <button
                                onClick={() => toggleLayout('vertical')}
                                className={`p-1 rounded transition-all ${layoutMode === 'vertical' ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                title="Stacked"
                            >
                                <Rows size={14} />
                            </button>
                        </div>

                        <button
                            onClick={handleRun}
                            disabled={isRunning}
                            className={`
                                relative overflow-hidden group rounded-md px-4 py-1.5 font-medium text-xs transition-all duration-300 flex items-center gap-2
                                ${isRunning
                                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                                    : 'bg-green-600 text-white hover:bg-green-500 border border-green-500/50 shadow-[0_0_15px_rgba(22,163,74,0.2)]'
                                }
                            `}
                        >
                            {isRunning ? (
                                <Loader2 className="animate-spin" size={14} />
                            ) : (
                                <Play size={14} className="fill-current" />
                            )}
                            {isRunning ? 'Running...' : 'Run Code'}
                        </button>

                        <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                    </div>
                </div>

                {/* Main Resizable Area - Flex Grow to Ensure Fill */}
                <div className="flex-1 w-full relative min-h-0">
                    {isMounted && isEditorReady ? (
                        <PanelGroup
                            key={layoutMode}
                            id="compiler-layout"
                            orientation={layoutMode === 'horizontal' ? 'horizontal' : 'vertical'}
                            className="h-full w-full"
                            defaultLayout={defaultLayout}
                            onLayoutChanged={onLayoutChanged}
                        >
                            {/* Editor Panel */}
                            <Panel defaultSize={60} minSize={20} className="flex flex-col relative bg-[#0E0E0E]">
                                <div className="flex-1 relative group/editor">
                                    <Editor
                                        height="100%"
                                        language={language.monacoLanguage || 'plaintext'}
                                        theme="vs-dark"
                                        value={code}
                                        onChange={(val) => setCode(val || '')}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            padding: { top: 16, bottom: 16 },
                                            lineNumbers: 'on',
                                            renderLineHighlight: 'all',
                                            scrollbar: {
                                                vertical: 'visible',
                                                horizontal: 'visible',
                                                useShadows: false,
                                                verticalScrollbarSize: 10,
                                                horizontalScrollbarSize: 10
                                            }
                                        }}
                                    />

                                    {/* Stdin Overlay (Floating) */}
                                    {showStdin && (
                                        <div className="absolute bottom-4 right-4 w-[400px] h-48 bg-[#18181b] border border-white/10 rounded-lg shadow-2xl z-30 flex flex-col animate-in slide-in-from-bottom-5 zoom-in-95 duration-200">
                                            <div className="flex items-center justify-between px-3 py-2 bg-white/5 border-b border-white/5 rounded-t-lg">
                                                <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Standard Input</span>
                                                <button onClick={() => setShowStdin(false)} className="text-zinc-500 hover:text-white transition-colors">
                                                    <ChevronDown size={14} />
                                                </button>
                                            </div>
                                            <textarea
                                                value={stdin}
                                                onChange={(e) => setStdin(e.target.value)}
                                                className="flex-1 bg-transparent text-zinc-300 p-3 font-mono text-sm resize-none outline-none focus:ring-0 placeholder:text-zinc-700"
                                                placeholder="Enter input here..."
                                            />
                                        </div>
                                    )}
                                </div>
                            </Panel>

                            {/* Resize Handle */}
                            {isConsoleOpen && (
                                <PanelResizeHandle className={`bg-[#0E0E0E] hover:bg-blue-500/50 transition-colors z-10 flex items-center justify-center ${layoutMode === 'horizontal' ? 'w-1 cursor-col-resize border-x border-white/5' : 'h-1 cursor-row-resize border-y border-white/5'}`} />
                            )}

                            {/* Console Panel */}
                            {isConsoleOpen && (
                                <Panel defaultSize={40} minSize={10} className="flex flex-col relative bg-[#0E0E0E]">
                                    <div className="flex-1 bg-[#0E0E0E] flex flex-col min-h-0">
                                        {/* Console Header */}
                                        <div className="h-9 bg-[#18181b] flex items-center justify-between px-3 border-b border-white/5 shrink-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Console</span>
                                                <span className="px-1.5 py-0.5 rounded-full bg-white/5 text-[10px] text-zinc-500">Bash</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setOutput(null)}
                                                    className="p-1 text-zinc-500 hover:text-white transition-colors rounded hover:bg-white/5"
                                                    title="Clear Console"
                                                >
                                                    <RotateCcw size={12} />
                                                </button>
                                                <button
                                                    onClick={() => setIsConsoleOpen(false)}
                                                    className="p-1 text-zinc-500 hover:text-white transition-colors rounded hover:bg-white/5"
                                                    title="Minimize Console"
                                                >
                                                    <ChevronDown size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Console Output */}
                                        <div className="flex-1 overflow-auto p-4 font-mono text-sm whitespace-pre-wrap bg-[#0c0c0c] text-zinc-300 selection:bg-blue-500/30">
                                            {!output && !isRunning && <span className="text-zinc-700 italic">Ready to execute. Press Run to start...</span>}
                                            {isRunning && (
                                                <div className="flex items-center gap-2 text-zinc-500">
                                                    <Loader2 size={14} className="animate-spin" />
                                                    <span>Compiling and executing...</span>
                                                </div>
                                            )}

                                            {output?.message && (
                                                <div className="text-yellow-500/80 mb-2 pb-2 border-b border-white/5">
                                                    <span className="font-bold">System:</span> {output.message}
                                                </div>
                                            )}

                                            {output?.stdout}

                                            {output?.stderr && (
                                                <div className="text-red-400 mt-2 border-t border-red-500/20 pt-2">
                                                    <span className="font-bold text-red-500">Error:</span>
                                                    <br />
                                                    {output.stderr}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Panel>
                            )}
                        </PanelGroup>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#0E0E0E]">
                            <Loader2 className="animate-spin text-zinc-500" size={24} />
                        </div>
                    )}

                    {/* Collapsed Console Trigger */}
                    {!isConsoleOpen && (
                        <div
                            className={`absolute bg-[#18181b] border-white/10 z-20 cursor-pointer hover:bg-[#202023] transition-colors flex items-center justify-between px-3
                                ${layoutMode === 'horizontal'
                                    ? 'right-0 top-0 bottom-0 w-8 flex-col py-3 border-l'
                                    : 'bottom-0 left-0 right-0 h-8 flex-row border-t'
                                }
                            `}
                            onClick={() => setIsConsoleOpen(true)}
                        >
                            <span className={`text-[10px] font-bold text-zinc-500 uppercase tracking-wider ${layoutMode === 'horizontal' ? '[writing-mode:vertical-rl] rotate-180' : ''}`}>
                                Console
                            </span>
                            <Maximize2 size={12} className="text-zinc-500" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper Component for Sidebar Icons
function SidebarIcon({ icon, active, onClick, tooltip }: { icon: React.ReactNode, active: boolean, onClick: () => void, tooltip: string }) {
    return (
        <button
            onClick={onClick}
            title={tooltip}
            className={`
                p-3 w-full flex justify-center transition-all duration-200 relative
                ${active
                    ? 'text-white'
                    : 'text-zinc-600 hover:text-zinc-300'
                }
            `}
        >
            {active && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
            )}
            {icon}
        </button>
    );
}

