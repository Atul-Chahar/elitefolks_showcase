import React, { useEffect, useState } from 'react';
import { Transcript, Lesson, Course, ChatMessage, ChatSession } from '../types';
import { Mic, MicOff, StopCircle, Bot, Loader2, AlertCircle, Play, Pause, MessageSquare } from 'lucide-react';
import ChatPanel from './ChatPanel';

interface AITutorPanelProps {
    course: Course;
    currentLesson: Lesson | null;
    // Mode
    aiMode: 'voice' | 'chat';
    onAiModeChange: (mode: 'voice' | 'chat') => void;
    // Voice session props
    isSessionActive: boolean;
    isConnecting: boolean;
    isListening: boolean;
    isSpeaking: boolean;
    isMuted: boolean;
    isAIPaused?: boolean;
    isProcessing?: boolean;  // AI thinking / STT in progress
    startSession: () => void;
    stopSession: () => void;
    startListening?: () => void;  // Push-to-talk start
    stopListening?: () => void;   // Push-to-talk stop
    toggleMute: () => void;
    toggleAIPause?: () => void;
    sendTextMessage: (text: string) => void;
    transcript: Transcript;
    sessionError: string | null;
    // Chat props
    chatMessages: ChatMessage[];
    isChatLoading: boolean;
    chatError: string | null;
    onSendChatMessage: (text: string) => void;
    chatSessions: ChatSession[];
    activeSessionId: string | null;
    onLoadSession: (sessionId: string) => void;
    onNewSession: () => void;
    onDeleteSession: (sessionId: string) => void;
}

const AITutorPanel: React.FC<AITutorPanelProps> = ({
    course,
    currentLesson,
    aiMode,
    onAiModeChange,
    isSessionActive,
    isConnecting,
    isListening,
    isSpeaking,
    isMuted,
    isAIPaused = false,
    isProcessing = false,
    startSession,
    stopSession,
    startListening,
    stopListening,
    toggleMute,
    toggleAIPause,
    sendTextMessage,
    transcript,
    sessionError,
    chatMessages,
    isChatLoading,
    chatError,
    onSendChatMessage,
    chatSessions,
    activeSessionId,
    onLoadSession,
    onNewSession,
    onDeleteSession,
}) => {
    // Keyboard shortcut for Mute (Alt + M)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.code === 'KeyM' && isSessionActive) {
                e.preventDefault();
                toggleMute();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSessionActive, toggleMute]);

    const handleMicClick = () => {
        if (!isSessionActive) {
            startSession();
        }
    };

    // Push-to-talk: hold to record, release to send
    const handleMicPointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        if (!isSessionActive) startSession();
        startListening?.();
    };

    const handleMicPointerUp = () => {
        if (isListening) stopListening?.();
    };

    // Determine mic button state
    let micButtonState: 'idle' | 'connecting' | 'error' | 'active' | 'listening' | 'speaking' | 'muted' = 'idle';
    if (isConnecting) micButtonState = 'connecting';
    else if (sessionError) micButtonState = 'error';
    else if (isSessionActive) {
        if (isMuted) micButtonState = 'muted';
        else if (isSpeaking) micButtonState = 'speaking';
        else if (isListening) micButtonState = 'listening';
        else micButtonState = 'active';
    }

    const getStatusText = () => {
        if (sessionError) return sessionError;
        if (isConnecting) return 'Connecting...';
        if (isProcessing) return 'Processing...';
        if (isSessionActive) {
            if (isMuted) return 'Mic Muted (Alt+M)';
            if (isAIPaused) return 'Session Paused';
            if (isSpeaking) return 'AI Speaking...';
            if (isListening) return 'Listening... (release to send)';
            return 'Hold mic to speak';
        }
        return 'Tap to activate voice';
    };

    // Style classes for mic button
    const getMicButtonClasses = () => {
        const baseClasses = 'w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 relative';

        switch (micButtonState) {
            case 'connecting':
                return `${baseClasses} bg-zinc-700 animate-pulse`;
            case 'error':
                return `${baseClasses} bg-red-500`;
            case 'active':
                return `${baseClasses} bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105 shadow-orange-500/30`;
            case 'listening':
                return `${baseClasses} bg-gradient-to-r from-orange-500 to-red-500 scale-110 shadow-orange-500/50 ring-4 ring-orange-500/20`;
            case 'speaking':
                return `${baseClasses} bg-indigo-500 ring-4 ring-indigo-500/20`;
            case 'muted':
                return `${baseClasses} bg-gray-600 opacity-50`;
            default:
                return `${baseClasses} bg-zinc-800 border border-white/10 hover:bg-zinc-700 hover:border-white/20`;
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#050505] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-500/5 rounded-full blur-[80px]" />
                <div className="absolute inset-0 bg-[#050505] opacity-[0.03] mix-blend-overlay" />
            </div>

            {/* Header with Voice/Chat Toggle */}
            <div className="relative z-10 p-4 border-b border-white/5 bg-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center shadow-lg group">
                        <img
                            src="/voicecode-logo.png"
                            alt="EliteFolks AI"
                            className="w-6 h-6 object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div>
                        <h3 className="text-white font-bold font-manrope tracking-tight">AI Tutor</h3>
                        <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${(aiMode === 'voice' && isSessionActive) || aiMode === 'chat' ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`} />
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                                {aiMode === 'voice' ? (isSessionActive ? 'Voice Active' : 'Voice Mode') : 'Chat Mode'}
                            </p>
                        </div>
                    </div>

                    {/* Voice / Chat Toggle */}
                    <div className="ml-auto flex items-center gap-0.5 bg-white/5 rounded-xl p-1 border border-white/5">
                        <button
                            onClick={() => onAiModeChange('chat')}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${aiMode === 'chat'
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                : 'text-zinc-500 hover:text-white'
                                }`}
                        >
                            <MessageSquare size={12} />
                            Chat
                        </button>
                        <button
                            onClick={() => onAiModeChange('voice')}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${aiMode === 'voice'
                                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                : 'text-zinc-500 hover:text-white'
                                }`}
                        >
                            <Mic size={12} />
                            Voice
                        </button>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* CHAT MODE                                              */}
            {/* ═══════════════════════════════════════════════════════ */}
            {aiMode === 'chat' && (
                <div className="relative z-10 flex-grow min-h-0">
                    <ChatPanel
                        messages={chatMessages}
                        isLoading={isChatLoading}
                        error={chatError}
                        onSendMessage={onSendChatMessage}
                        sessions={chatSessions}
                        activeSessionId={activeSessionId}
                        onLoadSession={onLoadSession}
                        onNewSession={onNewSession}
                        onDeleteSession={onDeleteSession}
                    />
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* VOICE MODE                                             */}
            {/* ═══════════════════════════════════════════════════════ */}
            {aiMode === 'voice' && (
                <>
                    {/* Conversation Area */}
                    <div className="relative z-10 flex-grow p-4 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                        {/* Empty State / Welcome */}
                        {!transcript.user && !transcript.ai && (
                            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                <div className="relative mb-8 group cursor-pointer" onClick={startSession}>
                                    <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full animate-pulse-slow" />
                                    <div className="relative w-24 h-24 rounded-[2rem] bg-gradient-to-br from-zinc-900 to-black border border-white/10 flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                                        <img src="/voicecode-logo.png" alt="AI Logo" className="w-12 h-12 opacity-80 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    {/* Orbiting particles */}
                                    <div className="absolute inset-0 animate-[spin_10s_linear_infinite]">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 w-2 h-2 bg-orange-500 rounded-full blur-[1px]" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3 font-manrope">
                                    How can I help you?
                                </h3>
                                <p className="text-zinc-400 text-sm max-w-xs mb-8 leading-relaxed">
                                    I&apos;m here to explain concepts, debug code, or walk you through complex logic. Just ask!
                                </p>

                                <div className="flex flex-wrap gap-2 justify-center max-w-xs">
                                    {['Explain this concept', 'Write an example', 'Find the bug'].map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => sendTextMessage(suggestion)}
                                            className="px-4 py-2 text-xs font-medium bg-white/5 border border-white/5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all hover:-translate-y-0.5"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* User message */}
                        {transcript.user && (
                            <div className="self-end max-w-[85%] animate-fade-in-up">
                                <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-lg shadow-orange-900/20 text-sm leading-relaxed border border-white/10">
                                    {transcript.user}
                                </div>
                                <div className="text-[10px] text-zinc-500 text-right mt-1 font-medium px-1">You</div>
                            </div>
                        )}

                        {/* AI message */}
                        {transcript.ai && (
                            <div className="self-start max-w-[90%] flex gap-4 animate-fade-in-up">
                                <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-white/5 flex items-center justify-center flex-shrink-0 mt-1">
                                    <img src="/voicecode-logo.png" className="w-4 h-4 opacity-70" alt="AI" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="glass-card bg-[#111]/80 backdrop-blur-xl border-white/5 text-zinc-200 px-5 py-4 rounded-2xl rounded-tl-sm shadow-xl text-sm leading-7">
                                        {transcript.ai}
                                    </div>
                                    <div className="text-[10px] text-zinc-500 font-medium px-1">EliteFolks AI</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mic Controls */}
                    <div className="relative z-20 p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl">
                        {/* Status Indicator */}
                        {isSessionActive && (transcript.user || transcript.ai) && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-zinc-900 border border-white/10 flex items-center gap-2 shadow-xl">
                                <div className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-orange-500 animate-pulse' : isSpeaking ? 'bg-blue-500 animate-bounce' : 'bg-zinc-500'}`} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                    {isListening ? 'Listening' : isSpeaking ? 'Speaking' : 'Ready'}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center justify-between max-w-xs mx-auto">
                            {/* Mute Toggle */}
                            <button
                                onClick={toggleMute}
                                className={`p-3 rounded-xl transition-all duration-300 border ${isMuted
                                    ? 'bg-red-500/10 border-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                                    : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                                    }`}
                                title="Mute (Alt+M)"
                                disabled={!isSessionActive}
                            >
                                {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                            </button>

                            {/* Main Mic Button — push-to-talk: hold to record, release to send */}
                            <button
                                onPointerDown={handleMicPointerDown}
                                onPointerUp={handleMicPointerUp}
                                onPointerLeave={handleMicPointerUp}
                                onClick={handleMicClick}
                                className={`${getMicButtonClasses()} transform transition-all duration-300 active:scale-90 select-none`}
                                title={isSessionActive ? "Hold to speak, release to send" : "Click to activate voice, then hold to speak"}
                            >
                                {(micButtonState === 'connecting' || isProcessing) && <Loader2 size={24} className="text-white animate-spin" />}
                                {micButtonState === 'error' && !isProcessing && <AlertCircle size={24} className="text-white" />}
                                {(micButtonState === 'active' || micButtonState === 'listening' || micButtonState === 'speaking') && !isProcessing && (
                                    <div className="relative">
                                        <span className={`absolute inset-0 rounded-sm opacity-50 ${micButtonState === 'speaking' ? 'animate-ping bg-indigo-400' : 'animate-ping bg-orange-400'}`} />
                                        <Mic size={24} className="text-white relative z-10" />
                                    </div>
                                )}
                                {micButtonState === 'idle' && !isProcessing && <Mic size={24} className="text-white/90" />}
                                {micButtonState === 'muted' && !isProcessing && <MicOff size={24} className="text-white/50" />}
                            </button>

                            {/* Pause/Resume Actions */}
                            <button
                                onClick={toggleAIPause}
                                className={`p-3 rounded-xl transition-all duration-300 border ${isAIPaused
                                    ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                                    : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                                    }`}
                                title={isAIPaused ? "Resume Speaking" : "Pause Speaking"}
                                disabled={!isSessionActive}
                            >
                                {isAIPaused ? <Play size={20} /> : <Pause size={20} />}
                            </button>
                        </div>

                        <p className="text-center text-[10px] text-zinc-600 mt-4 font-medium uppercase tracking-widest opacity-60">
                            {getStatusText()}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default AITutorPanel;
