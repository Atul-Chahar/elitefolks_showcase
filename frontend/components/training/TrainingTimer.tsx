'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Clock, Edit2, Check, AlertTriangle, Play, Pause, RotateCcw } from 'lucide-react';

export default function TrainingTimer() {
    const [isEditing, setIsEditing] = useState(false);
    const [editMinutes, setEditMinutes] = useState('15');

    // Time in seconds
    const [timeLeft, setTimeLeft] = useState(15 * 60);
    const [isRunning, setIsRunning] = useState(true);
    const [timeUp, setTimeUp] = useState(false);

    // To play an alert sound optionally, or just show the popup.
    // For now we'll just show the popup.

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        setTimeUp(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timeLeft <= 0 && isRunning) {
            setIsRunning(false);
            setTimeUp(true);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, timeLeft]);

    const handleSaveEdit = () => {
        const parsed = parseInt(editMinutes, 10);
        if (!isNaN(parsed) && parsed > 0) {
            setTimeLeft(parsed * 60);
            setTimeUp(false);
            setIsRunning(true);
        } else {
            // Revert invalid edit
            setEditMinutes(Math.floor(timeLeft / 60).toString());
        }
        setIsEditing(false);
    };

    const handleReset = () => {
        const parsed = parseInt(editMinutes, 10);
        if (!isNaN(parsed) && parsed > 0) {
            setTimeLeft(parsed * 60);
        } else {
            setTimeLeft(15 * 60);
        }
        setTimeUp(false);
        setIsRunning(false); // keep it paused until they play, or true if we want auto-play. Let's auto-play.
        setIsRunning(true);
    };

    const togglePause = () => {
        if (!timeUp) {
            setIsRunning(!isRunning);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-md text-sm text-zinc-300 font-mono">
                <Clock size={14} className="text-orange-400" />
                {isEditing ? (
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            min="1"
                            max="120"
                            className="w-12 bg-black text-white border border-white/20 rounded px-1 outline-none text-center"
                            value={editMinutes}
                            onChange={(e) => setEditMinutes(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit();
                            }}
                            autoFocus
                        />
                        <span className="text-xs text-zinc-500">m</span>
                        <button onClick={handleSaveEdit} className="text-green-400 hover:text-green-300 ml-1">
                            <Check size={14} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <span className={timeLeft <= 60 && isRunning ? 'text-red-400 animate-pulse font-bold' : !isRunning && !timeUp ? 'text-orange-400 opacity-80' : ''}>
                            {formatTime(timeLeft)}
                        </span>

                        <div className="flex items-center gap-0.5 border-l border-white/10 pl-2 ml-1">
                            <button
                                onClick={togglePause}
                                className={`transition-colors p-1 rounded hover:bg-white/10 ${isRunning ? 'text-zinc-400 hover:text-white' : 'text-orange-400 hover:text-orange-300'}`}
                                title={isRunning ? "Pause Timer" : "Start Timer"}
                            >
                                {isRunning ? <Pause size={12} /> : <Play size={12} />}
                            </button>
                            <button
                                onClick={handleReset}
                                className="text-zinc-500 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                                title="Reset Timer"
                            >
                                <RotateCcw size={12} />
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(true);
                                    setEditMinutes(Math.floor(timeLeft / 60).toString());
                                    setIsRunning(false); // Pause while editing
                                }}
                                className="text-zinc-500 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                                title="Edit Timer Duration"
                            >
                                <Edit2 size={12} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* TIME UP FULL SCREEN POPUP */}
            {timeUp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
                    <div className="bg-[#111] border border-red-500/30 p-8 rounded-2xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={40} className="text-red-500" />
                        </div>
                        <h2 className="text-4xl font-black text-white mb-2 tracking-widest font-bebas">TIME UP!</h2>
                        <p className="text-zinc-400 mb-8 font-mono text-sm">You didn't submit an accepted solution in time. You can edit the timer to restart your run.</p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setTimeUp(false);
                                    setIsEditing(true);
                                    setEditMinutes('15');
                                }}
                                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors border border-white/10"
                            >
                                Edit Time
                            </button>
                            <button
                                onClick={() => {
                                    setTimeLeft(15 * 60);
                                    setTimeUp(false);
                                    setIsRunning(true);
                                }}
                                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-500"
                            >
                                Retry (15m)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
