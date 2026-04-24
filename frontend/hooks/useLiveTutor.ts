import { useState, useCallback } from 'react';
import { Progress, Transcript, Lesson } from '../types';

export const useLiveTutor = (
    onStreamMessage: (newTranscript: Transcript) => void,
    onToolCall: (functionCalls: any[]) => Promise<any[]>,
    progress: Progress,
    currentLesson: Lesson | null
) => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isAIPaused, setIsAIPaused] = useState(false);
    const [sessionError, setSessionError] = useState<string | null>(null);

    const startSession = useCallback(() => {
        setIsConnecting(true);
        setTimeout(() => {
            setIsConnecting(false);
            setIsSessionActive(true);
            setIsListening(true);
        }, 1000);
    }, []);

    const stopSession = useCallback(async () => {
        setIsSessionActive(false);
        setIsListening(false);
        setIsSpeaking(false);
    }, []);

    const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);
    const toggleAIPause = useCallback(async () => setIsAIPaused(prev => !prev), []);

    const sendTextMessage = useCallback(async (text: string) => {
        onStreamMessage({ user: text, ai: '', isFinal: false });
        setIsSpeaking(true);
        setTimeout(() => {
            onStreamMessage({ user: text, ai: "This is a demo live tutor response.", isFinal: true });
            setIsSpeaking(false);
        }, 2000);
    }, [onStreamMessage]);

    return {
        isSessionActive,
        isConnecting,
        isSpeaking,
        isListening,
        isMuted,
        isAIPaused,
        startSession,
        stopSession,
        toggleMute,
        toggleAIPause,
        sendTextMessage,
        sessionError
    };
};
