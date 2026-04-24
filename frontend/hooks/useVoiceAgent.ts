import { useState, useRef, useCallback, useEffect } from 'react';
import { Transcript, Lesson } from '../types';

export interface VoiceAgentToolCall {
    name: string;
    args: Record<string, string>;
}

export const useVoiceAgent = (
    onStreamMessage: (t: Transcript) => void,
    onToolCall: (toolCalls: VoiceAgentToolCall[]) => void,
    currentLesson: Lesson | null,
    courseTitle: string,
    getEditorCode: () => string,
    userId: string | null = null,
) => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isAIPaused, setIsAIPaused] = useState(false);
    const [sessionError, setSessionError] = useState<string | null>(null);

    const startSession = useCallback(() => setIsSessionActive(true), []);
    
    const stopSession = useCallback(() => {
        setIsSessionActive(false);
        setIsListening(false);
        setIsSpeaking(false);
        setIsProcessing(false);
    }, []);

    const toggleAIPause = () => setIsAIPaused(!isAIPaused);
    const toggleMute = () => setIsMuted(!isMuted);

    const startListening = useCallback(() => {
        setIsListening(true);
        setIsSessionActive(true);
    }, []);

    const stopListening = useCallback(() => {
        setIsListening(false);
        setIsProcessing(true);
        // Simulate response time
        setTimeout(() => {
            setIsProcessing(false);
            onStreamMessage({
                user: "This is a dummy voice recording.",
                ai: "This is a dummy voice reply for the showcase environment.",
                isFinal: true
            });
            setIsSpeaking(true);
            setTimeout(() => setIsSpeaking(false), 3000);
        }, 1500);
    }, [onStreamMessage]);

    const sendTextMessage = useCallback(async (text: string) => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            onStreamMessage({ user: text, ai: "This is a text reply in the voice agent panel.", isFinal: true });
        }, 1000);
    }, [onStreamMessage]);

    return {
        isSessionActive,
        isConnecting,
        isListening,
        isSpeaking,
        isMuted,
        isAIPaused,
        isProcessing,
        sessionError,
        startSession,
        stopSession,
        startListening,
        stopListening,
        toggleMute,
        toggleAIPause,
        sendTextMessage,
    };
};
