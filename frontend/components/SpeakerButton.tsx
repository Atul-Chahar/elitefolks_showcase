import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

interface SpeakerButtonProps {
    text: string;
    className?: string;
    size?: number;
}

const SpeakerButton: React.FC<SpeakerButtonProps> = ({ text, className = "", size = 18 }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [speed, setSpeed] = useState(1); // 1x, 1.5x, 2x

    const toggleSpeed = (e: React.MouseEvent) => {
        e.stopPropagation();
        const speeds = [1, 1.5, 2];
        const nextIndex = (speeds.indexOf(speed) + 1) % speeds.length;
        const newSpeed = speeds[nextIndex];
        setSpeed(newSpeed);

        // If currently speaking, restart with new speed
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            speak(newSpeed);
        }
    };

    const speak = (currentSpeed = speed) => {
        if (!window.speechSynthesis) {
            console.error("Speech synthesis not supported");
            return;
        }

        if (isSpeaking && currentSpeed === speed) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        // Clean up markdown before speaking
        const cleanText = text
            .replace(/[#*`_~]/g, '') // Remove markdown symbols
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Keep link text, remove URL
            .replace(/!\[[^\]]*\]\([^\)]+\)/g, '') // Remove images
            .trim();

        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = currentSpeed;

        // Find a good natural voice if possible
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v =>
            v.name.includes('Google') || v.name.includes('Natural') || v.lang.startsWith('en-US')
        );
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsLoading(false);
        };
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => {
            setIsSpeaking(false);
            setIsLoading(false);
        };

        setIsLoading(true);
        window.speechSynthesis.speak(utterance);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            {/* Speed Toggle - now more integrated and always available when relevant */}
            <button
                onClick={toggleSpeed}
                className="flex items-center justify-center px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-[10px] font-bold text-zinc-400 hover:text-orange-400 transition-all"
                title="Change playback speed"
            >
                {speed}x
            </button>

            {/* Speaker Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    speak();
                }}
                className={`p-2 rounded-lg transition-all duration-200 border ${isSpeaking
                    ? 'bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                    : 'bg-zinc-800/80 text-zinc-300 border-white/10 hover:bg-zinc-700 hover:text-white hover:border-orange-500/50'
                    }`}
                title={isSpeaking ? "Stop Speaking" : "Listen to this"}
            >
                {isLoading ? (
                    <Loader2 size={size} className="animate-spin" />
                ) : isSpeaking ? (
                    <VolumeX size={size} />
                ) : (
                    <Volume2 size={size} />
                )}
            </button>
        </div>
    );
};

export default SpeakerButton;
