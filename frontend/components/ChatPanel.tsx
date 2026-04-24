'use client';

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../types';
import { Send, Loader2, Code2, Copy, Check, AlertCircle, Sparkles, History, Trash2 } from 'lucide-react';

// ─── Memoized Message Bubble ─────────────────────────────────────
const MessageBubble = memo(({ message }: { message: ChatMessage }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback((code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, []);

    if (message.role === 'user') {
        return (
            <div className="self-end max-w-[85%] animate-fade-in-up">
                <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-lg shadow-orange-900/20 text-sm leading-relaxed border border-white/10">
                    {message.content}
                </div>
                {message.codeContext && (
                    <div className="flex items-center gap-1 justify-end mt-1 px-1">
                        <Code2 size={10} className="text-zinc-600" />
                        <span className="text-[10px] text-zinc-600">Code attached</span>
                    </div>
                )}
                <div className="text-[10px] text-zinc-500 text-right mt-0.5 font-medium px-1">You</div>
            </div>
        );
    }

    return (
        <div className="self-start max-w-[90%] flex gap-3 animate-fade-in-up">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/5 flex items-center justify-center flex-shrink-0 mt-1">
                <img src="/voicecode-logo.png" className="w-4 h-4 opacity-70" alt="AI" />
            </div>
            <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="glass-card bg-[#111]/80 backdrop-blur-xl border border-white/5 text-zinc-200 px-5 py-4 rounded-2xl rounded-tl-sm shadow-xl text-sm leading-7 overflow-hidden">
                    <div className="prose prose-invert prose-sm max-w-none
                        prose-headings:text-white prose-headings:font-bold prose-headings:mb-2 prose-headings:mt-4
                        prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:my-2
                        prose-a:text-orange-400 prose-a:no-underline hover:prose-a:underline
                        prose-code:text-orange-300 prose-code:bg-orange-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-code:font-jetbrains prose-code:before:content-none prose-code:after:content-none
                        prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/5 prose-pre:rounded-xl prose-pre:my-3 prose-pre:overflow-x-auto
                        prose-li:text-zinc-300 prose-li:my-0.5
                        prose-strong:text-white
                        prose-em:text-zinc-400
                        prose-blockquote:border-orange-500/30 prose-blockquote:bg-orange-500/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1
                    ">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                pre: ({ children }) => (
                                    <div className="relative group">
                                        <button
                                            onClick={() => {
                                                const text = (children as any)?.props?.children;
                                                if (typeof text === 'string') handleCopy(text);
                                            }}
                                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 z-10"
                                            title="Copy code"
                                        >
                                            {copied ? <Check size={12} /> : <Copy size={12} />}
                                        </button>
                                        <pre className="!bg-[#0a0a0a] !border-white/5">{children}</pre>
                                    </div>
                                ),
                                code: ({ className, children, ...props }) => {
                                    const isInline = !className;
                                    if (isInline) {
                                        return <code className="text-orange-300 bg-orange-500/10 px-1.5 py-0.5 rounded-md text-xs font-jetbrains" {...props}>{children}</code>;
                                    }
                                    return <code className={`${className} font-jetbrains text-xs`} {...props}>{children}</code>;
                                }
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                </div>
                <div className="text-[10px] text-zinc-500 font-medium px-1">EliteFolks AI</div>
            </div>
        </div>
    );
}, (prev, next) => prev.message.id === next.message.id && prev.message.content === next.message.content);

MessageBubble.displayName = 'MessageBubble';

// ─── Typing Indicator ────────────────────────────────────────────
const TypingIndicator = () => (
    <div className="self-start flex gap-3 animate-fade-in-up">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/5 flex items-center justify-center flex-shrink-0 mt-1">
            <img src="/voicecode-logo.png" className="w-4 h-4 opacity-70" alt="AI" />
        </div>
        <div className="glass-card bg-[#111]/80 backdrop-blur-xl border border-white/5 px-5 py-4 rounded-2xl rounded-tl-sm shadow-xl">
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    </div>
);

// ─── Chat History Item ───────────────────────────────────────────
interface ChatSession {
    id: string;
    title: string;
    updatedAt: string;
}

const ChatHistoryItem = memo(({ session, isActive, onLoad, onDelete }: {
    session: ChatSession;
    isActive: boolean;
    onLoad: () => void;
    onDelete: () => void;
}) => (
    <div
        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all group flex items-center gap-2 ${isActive
                ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400'
                : 'hover:bg-white/5 text-zinc-400 hover:text-white border border-transparent'
            }`}
    >
        <button 
            onClick={onLoad}
            className="flex flex-1 items-center gap-2 min-w-0"
        >
            <Sparkles size={12} className="flex-shrink-0 opacity-50" />
            <span className="text-xs font-medium truncate flex-1">{session.title}</span>
        </button>
        <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 rounded text-zinc-500 hover:text-red-400 transition-all flex-shrink-0"
            title="Delete chat"
        >
            <Trash2 size={12} />
        </button>
    </div>
));

ChatHistoryItem.displayName = 'ChatHistoryItem';

// ─── Main ChatPanel Component ────────────────────────────────────
interface ChatPanelProps {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
    onSendMessage: (text: string) => void;
    sessions: ChatSession[];
    activeSessionId: string | null;
    onLoadSession: (sessionId: string) => void;
    onNewSession: () => void;
    onDeleteSession: (sessionId: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
    messages,
    isLoading,
    error,
    onSendMessage,
    sessions,
    activeSessionId,
    onLoadSession,
    onNewSession,
    onDeleteSession,
}) => {
    const [input, setInput] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current && messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
            if (isNearBottom || isLoading) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [messages, isLoading]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
        }
    }, [input]);

    const handleSubmit = useCallback((e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;
        onSendMessage(input.trim());
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [input, isLoading, onSendMessage]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit]);

    const suggestions = [
        { text: 'Explain this code', icon: '🔍' },
        { text: 'Help me fix the bug', icon: '🐛' },
        { text: 'What should I learn next?', icon: '🎯' },
        { text: 'Write an example', icon: '✨' },
    ];

    return (
        <div className="h-full flex relative overflow-hidden">
            {/* History Sidebar */}
            <div className={`absolute inset-y-0 left-0 z-30 w-64 bg-[#080808] border-r border-white/5 transform transition-transform duration-300 ease-out flex flex-col ${showHistory ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-3 border-b border-white/5 flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Chat History</h4>
                    <button
                        onClick={onNewSession}
                        className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg hover:bg-orange-500/20 transition-all"
                    >
                        + New
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {sessions.length === 0 ? (
                        <p className="text-zinc-600 text-xs text-center py-8">No chat history yet</p>
                    ) : (
                        sessions.map(session => (
                            <ChatHistoryItem
                                key={session.id}
                                session={session}
                                isActive={session.id === activeSessionId}
                                onLoad={() => { onLoadSession(session.id); setShowHistory(false); }}
                                onDelete={() => onDeleteSession(session.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Overlay */}
            {showHistory && (
                <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
            )}

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Messages / Empty State */}
                <div ref={messagesContainerRef} className="flex-grow p-4 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                    {messages.length === 0 && !isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full animate-pulse-slow" />
                                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 flex items-center justify-center shadow-2xl">
                                    <img src="/voicecode-logo.png" alt="AI Logo" className="w-10 h-10 opacity-80" />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 font-manrope">Chat with AI Tutor</h3>
                            <p className="text-zinc-500 text-xs max-w-xs mb-6 leading-relaxed">
                                Ask questions about your code, request explanations, or get help debugging. The AI can see your code editor!
                            </p>

                            <div className="grid grid-cols-2 gap-2 max-w-xs w-full">
                                {suggestions.map((s) => (
                                    <button
                                        key={s.text}
                                        onClick={() => onSendMessage(s.text)}
                                        className="px-3 py-2.5 text-xs font-medium bg-white/5 border border-white/5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all hover:-translate-y-0.5 text-left flex items-center gap-2"
                                    >
                                        <span>{s.icon}</span>
                                        <span>{s.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map(msg => (
                                <MessageBubble key={msg.id} message={msg} />
                            ))}
                            {isLoading && <TypingIndicator />}
                        </>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mx-4 mb-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 animate-fade-in">
                        <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                        <span className="text-xs text-red-300">{error}</span>
                    </div>
                )}

                {/* Input Area */}
                <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-xl">
                    <form onSubmit={handleSubmit} className="flex items-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowHistory(!showHistory)}
                            className={`p-2.5 rounded-xl transition-all border flex-shrink-0 ${showHistory
                                    ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                                    : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                                }`}
                            title="Chat History"
                        >
                            <History size={16} />
                        </button>

                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about your code..."
                                rows={1}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 resize-none focus:outline-none focus:border-orange-500/30 focus:ring-1 focus:ring-orange-500/20 transition-all font-jetbrains leading-relaxed"
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className={`p-2.5 rounded-xl transition-all border flex-shrink-0 ${input.trim() && !isLoading
                                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 active:scale-95'
                                    : 'bg-white/5 border-white/5 text-zinc-600 cursor-not-allowed'
                                }`}
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        </button>
                    </form>

                    <p className="text-center text-[10px] text-zinc-700 mt-2 font-medium">
                        AI can see your code editor • Shift+Enter for new line
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;
