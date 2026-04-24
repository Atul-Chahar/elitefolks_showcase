import { useState, useCallback, useEffect, useRef } from 'react';
import { ChatMessage, ChatSession, Lesson } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useChatTutor = (
    courseId: string,
    currentLesson: Lesson | null,
    getEditorCode: () => string,
    onToolCall?: (toolCalls: any[]) => void
) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const prevLessonIdRef = useRef<string | null>(null);

    const loadSession = useCallback(async (sessionId: string) => {
        const session = sessions.find(s => s.id === sessionId);
        setMessages(session?.messages || []);
        setActiveSessionId(sessionId);
    }, [sessions]);

    const createSession = useCallback(async (firstMessage: string): Promise<string | null> => {
        const title = firstMessage.length > 50 ? firstMessage.substring(0, 47) + '...' : firstMessage;
        const tempId = `session-${Date.now()}`;
        const newSession: ChatSession = {
            id: tempId,
            courseId,
            lessonId: currentLesson?.id,
            title,
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(tempId);
        return tempId;
    }, [courseId, currentLesson]);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isLoading) return;
        setError(null);
        setIsLoading(true);

        let sessionId = activeSessionId;
        if (!sessionId) {
            sessionId = await createSession(text);
        }

        const userMsg: ChatMessage = {
            id: `temp-user-${Date.now()}`,
            sessionId: sessionId as string,
            role: 'user',
            content: text,
            createdAt: new Date().toISOString(),
        };
        const updatedMessagesWithUser = [...messages, userMsg];
        setMessages(updatedMessagesWithUser);

        // Dummy showcase delay
        setTimeout(() => {
            const aiMsg: ChatMessage = {
                id: `temp-ai-${Date.now()}`,
                sessionId: sessionId as string,
                role: 'ai',
                content: "👋 Hi! This is a showcase demo of the AI Tutor. Usually, I'd analyze your code and guide you towards the solution for this lesson without giving away the answer!",
                createdAt: new Date().toISOString(),
            };
            setMessages([...updatedMessagesWithUser, aiMsg]);
            setIsLoading(false);
        }, 1500);

    }, [isLoading, activeSessionId, messages, createSession]);

    const startNewSession = useCallback(() => {
        setMessages([]);
        setActiveSessionId(null);
        setError(null);
    }, []);

    const deleteSession = useCallback(async (sessionId: string) => {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        if (activeSessionId === sessionId) {
            startNewSession();
        }
    }, [activeSessionId, startNewSession]);

    const addVoiceTurn = useCallback(async (userText: string, aiText: string) => {
        if (!userText && !aiText) return;
        let sessionId = activeSessionId || await createSession(userText || 'Voice Conversation');
        if (!sessionId) return;

        const newMessages: ChatMessage[] = [];
        if (userText) newMessages.push({ id: `voice-user-${Date.now()}`, sessionId, role: 'user', content: userText, createdAt: new Date().toISOString() });
        if (aiText) newMessages.push({ id: `voice-ai-${Date.now()}`, sessionId, role: 'ai', content: aiText, createdAt: new Date().toISOString() });

        setMessages(prev => [...prev, ...newMessages]);
    }, [activeSessionId, createSession]);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        sessions,
        activeSessionId,
        loadSession,
        startNewSession,
        deleteSession,
        addVoiceTurn,
    };
};
