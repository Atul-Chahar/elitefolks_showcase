'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Swords, Copy, Users, ChevronLeft, Loader2, Trophy, Clock, Zap, Shield, ChevronRight } from 'lucide-react';

export default function CompetitivePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [inviteCode, setInviteCode] = useState('');
    const [createdCode, setCreatedCode] = useState('');
    const [creating, setCreating] = useState(false);
    const [joining, setJoining] = useState(false);
    const [autoJoining, setAutoJoining] = useState(false);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [waitingBattleId, setWaitingBattleId] = useState('');

    // Poll for opponent joining
    useEffect(() => {
        if (!waitingBattleId) return;
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/battle?id=${waitingBattleId}`);
                const data = await res.json();
                if (data.status === 'active') {
                    router.push(`/training/competitive/${waitingBattleId}`);
                }
            } catch { }
        }, 2000);
        return () => clearInterval(interval);
    }, [waitingBattleId, router]);

    const handleCreate = async () => {
        if (!user) { router.push('/login'); return; }
        setCreating(true);
        setError('');
        try {
            const res = await fetch('/api/battle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create', difficulty }),
            });
            const data = await res.json();
            if (data.error) { setError(data.error); return; }
            setCreatedCode(data.inviteCode);
            setWaitingBattleId(data.battleId);
        } catch {
            setError('Failed to create battle. Try again.');
        } finally {
            setCreating(false);
        }
    };

    const handleJoin = async () => {
        if (!user) { router.push('/login'); return; }
        if (!inviteCode.trim()) { setError('Enter an invite code'); return; }
        setJoining(true);
        setError('');
        try {
            const res = await fetch('/api/battle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'join', inviteCode: inviteCode.trim() }),
            });
            const data = await res.json();
            if (data.error) { setError(data.error); return; }
            router.push(`/training/competitive/${data.battleId}`);
        } catch {
            setError('Failed to join battle. Try again.');
        } finally {
            setJoining(false);
        }
    };

    const handleAutoJoin = async () => {
        if (!user) { router.push('/login'); return; }
        setAutoJoining(true);
        setError('');
        try {
            const res = await fetch('/api/battle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'auto-join', difficulty }),
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
                return;
            }
            router.push(`/training/competitive/${data.battleId}`);
        } catch {
            setError('Failed to auto-join. Try again.');
        } finally {
            setAutoJoining(false);
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(createdCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="pt-24 min-h-screen bg-[#050505] text-white overflow-hidden font-sans relative">
            {/* Background effects */}
            <div className="grid-bg fixed inset-0 opacity-20 pointer-events-none z-0" aria-hidden="true" />
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[150px] rounded-[100%] opacity-15 bg-emerald-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/90" />
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10 pb-24">
                {/* Back nav */}
                <button onClick={() => router.push('/training')} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest font-mono">Back to Forge</span>
                </button>

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md mb-6">
                        <Swords className="text-emerald-400" size={14} />
                        <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-[0.2em]">Competitive Arena</span>
                    </div>
                    <h1 className="font-[family-name:var(--font-bebas)] text-6xl md:text-8xl tracking-wider">
                        1v1 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">BATTLE</span>
                    </h1>
                    <p className="text-zinc-400 max-w-lg mx-auto mt-4 text-sm font-mono">
                        Challenge a friend to a real-time coding duel. Same problem. Same timer. Who solves it faster wins.
                    </p>
                </div>

                {/* Waiting for opponent screen */}
                {createdCode && (
                    <div className="max-w-lg mx-auto mb-12">
                        <div className="rounded-[2rem] p-[1px] bg-gradient-to-b from-emerald-500/30 to-transparent">
                            <div className="bg-[#0A0A0A]/90 backdrop-blur-xl rounded-[1.95rem] p-10 border border-emerald-500/10 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/10 blur-[80px] rounded-full" />

                                <div className="relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                                        <Users className="text-emerald-400 animate-pulse" size={28} />
                                    </div>

                                    <h3 className="text-xl font-black uppercase tracking-wider mb-2">Waiting for Opponent</h3>
                                    <p className="text-zinc-500 text-sm mb-8">Share this code with your opponent to start the battle</p>

                                    <div className="flex items-center justify-center gap-3 mb-6">
                                        <div className="bg-black border-2 border-emerald-500/40 rounded-xl px-8 py-4">
                                            <span className="text-3xl font-mono font-black tracking-[0.5em] text-emerald-400">{createdCode}</span>
                                        </div>
                                        <button
                                            onClick={copyCode}
                                            className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-colors"
                                        >
                                            <Copy size={20} className={copied ? 'text-emerald-300' : 'text-emerald-500'} />
                                        </button>
                                    </div>
                                    {copied && <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Copied!</p>}

                                    <div className="flex items-center justify-center gap-2 text-zinc-600 mt-4">
                                        <Loader2 size={14} className="animate-spin" />
                                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Scanning for opponent...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Difficulty Selector */}
                {!createdCode && (
                    <div className="max-w-xl mx-auto mb-12 animate-fade-in-up">
                        <div className="flex flex-col items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                                Select Challenge Intensity
                            </span>
                            <div className="flex p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl w-full">
                                <button
                                    onClick={() => setDifficulty('easy')}
                                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                        difficulty === 'easy' 
                                        ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                                        : 'text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/5'
                                    }`}
                                >
                                    <Shield size={16} />
                                    Scout
                                </button>
                                <button
                                    onClick={() => setDifficulty('medium')}
                                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                        difficulty === 'medium' 
                                        ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                                        : 'text-zinc-500 hover:text-blue-400 hover:bg-blue-500/5'
                                    }`}
                                >
                                    <Swords size={16} />
                                    Warrior
                                </button>
                                <button
                                    onClick={() => setDifficulty('hard')}
                                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                        difficulty === 'hard' 
                                        ? 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                                        : 'text-zinc-500 hover:text-purple-400 hover:bg-purple-500/5'
                                    }`}
                                >
                                    <Trophy size={16} />
                                    Legend
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main action cards */}
                {!createdCode && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
                        {/* Auto Join */}
                        <div
                            className="group relative rounded-[2rem] p-1 glass-card cursor-pointer transition-all duration-500 hover:-translate-y-2"
                            onClick={handleAutoJoin}
                        >
                            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl rounded-[1.9rem] p-8 h-[420px] flex flex-col border border-white/5 transition-colors duration-500 group-hover:border-blue-500/50 relative overflow-hidden">
                                {/* Background Accent element */}
                                <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full blur-[80px] bg-gradient-to-br from-blue-500 to-indigo-600 opacity-20 group-hover:opacity-40 transition-opacity duration-700" />

                                {/* Icon & Top label */}
                                <div className="flex justify-between items-start w-full relative z-10 mb-8">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                                        <Zap size={48} className="text-blue-400" />
                                    </div>
                                    <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                                            Public Match
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 flex-grow pt-4">
                                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-500 transition-all duration-300">
                                        Quick Match
                                    </h2>
                                    <p className="text-zinc-400 text-sm leading-relaxed font-light">
                                        Instantly join any open battle room waiting for an opponent.
                                    </p>
                                </div>

                                {/* Footer Action */}
                                <div className="mt-auto relative z-10 pt-6 border-t border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                                        <span className="text-sm font-bold uppercase tracking-wider text-blue-400">
                                            {autoJoining ? 'Searching...' : 'Auto Join'}
                                        </span>
                                        <ChevronRight size={16} className="text-blue-400" />
                                    </div>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 transition-colors duration-300 group-hover:bg-gradient-to-r from-blue-500 to-indigo-600">
                                        {autoJoining ? <Loader2 size={16} className="text-white animate-spin" /> : <Zap size={16} className="text-white opacity-50 group-hover:opacity-100" />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Create battle */}
                        <div
                            className="group relative rounded-[2rem] p-1 glass-card cursor-pointer transition-all duration-500 hover:-translate-y-2"
                            onClick={handleCreate}
                        >
                            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl rounded-[1.9rem] p-8 h-[420px] flex flex-col border border-white/5 transition-colors duration-500 group-hover:border-emerald-500/50 relative overflow-hidden">
                                {/* Background Accent element */}
                                <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full blur-[80px] bg-gradient-to-br from-emerald-500 to-teal-600 opacity-20 group-hover:opacity-40 transition-opacity duration-700" />

                                {/* Icon & Top label */}
                                <div className="flex justify-between items-start w-full relative z-10 mb-8">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                                        <Swords size={48} className="text-emerald-400" />
                                    </div>
                                    <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                                            Private Room
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 flex-grow pt-4">
                                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-500 transition-all duration-300">
                                        Create Battle
                                    </h2>
                                    <p className="text-zinc-400 text-sm leading-relaxed font-light">
                                        Start a new battle room and share the invite code with your friend.
                                    </p>
                                </div>

                                {/* Footer Action */}
                                <div className="mt-auto relative z-10 pt-6 border-t border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                                        <span className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                                            {creating ? 'Creating...' : 'Start Battle'}
                                        </span>
                                        <ChevronRight size={16} className="text-emerald-400" />
                                    </div>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 transition-colors duration-300 group-hover:bg-gradient-to-r from-emerald-500 to-teal-600">
                                        {creating ? <Loader2 size={16} className="text-white animate-spin" /> : <Zap size={16} className="text-white opacity-50 group-hover:opacity-100" />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Join battle */}
                        <div
                            className="group relative rounded-[2rem] p-1 glass-card cursor-default transition-all duration-500 hover:-translate-y-2"
                        >
                            <div className="bg-[#0A0A0A]/80 backdrop-blur-xl rounded-[1.9rem] p-8 h-[420px] flex flex-col border border-white/5 transition-colors duration-500 group-hover:border-orange-500/50 relative overflow-hidden">
                                {/* Background Accent element */}
                                <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full blur-[80px] bg-gradient-to-br from-orange-500 to-red-600 opacity-20 group-hover:opacity-40 transition-opacity duration-700" />

                                {/* Icon & Top label */}
                                <div className="flex justify-between items-start w-full relative z-10 mb-8">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(249,115,22,0.4)] group-hover:shadow-[0_0_50px_rgba(249,115,22,0.6)] transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                                        <Users size={48} className="text-orange-400" />
                                    </div>
                                    <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                                            Join Code
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative z-10 flex-grow pt-1">
                                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-500 transition-all duration-300">
                                        Join Battle
                                    </h2>
                                    <p className="text-zinc-400 text-sm leading-relaxed font-light mb-4">
                                        Enter an invite code to join an existing battle room.
                                    </p>
                                    
                                    <input
                                        type="text"
                                        placeholder="ENTER CODE"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                        maxLength={6}
                                        className="w-full bg-black/50 border-2 border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 text-center font-mono font-black text-lg tracking-[0.3em] text-orange-400 outline-none transition-colors placeholder:text-zinc-700 placeholder:tracking-widest placeholder:text-sm"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>

                                {/* Footer Action */}
                                <div 
                                    className="mt-6 relative z-10 pt-6 border-t border-white/10 flex items-center justify-between cursor-pointer group/join"
                                    onClick={handleJoin}
                                >
                                    <div className="flex items-center gap-2 group-hover/join:gap-4 transition-all duration-300">
                                        <span className="text-sm font-bold uppercase tracking-wider text-orange-400">
                                            {joining ? 'Connecting...' : 'Connect'}
                                        </span>
                                        <ChevronRight size={16} className="text-orange-400" />
                                    </div>
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 transition-colors duration-300 group-hover/join:bg-gradient-to-r from-orange-500 to-red-600">
                                        {joining ? <Loader2 size={16} className="text-white animate-spin" /> : <Zap size={16} className="text-white opacity-50 group-hover/join:opacity-100" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error display */}
                {error && (
                    <div className="max-w-lg mx-auto mb-8">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-6 py-4 text-center">
                            <p className="text-red-400 text-sm font-bold">{error}</p>
                        </div>
                    </div>
                )}

                {/* How it works */}
                <div className="max-w-3xl mx-auto">
                    <h3 className="text-center text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-8">How It Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: <Swords size={20} />, title: 'Challenge', desc: 'Create a room or join with a code' },
                            { icon: <Clock size={20} />, title: 'Compete', desc: 'Solve the same DSA problem under a timer' },
                            { icon: <Trophy size={20} />, title: 'Victory', desc: 'Fastest correct solution wins XP & rank' },
                        ].map((step, i) => (
                            <div key={i} className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                                    {step.icon}
                                </div>
                                <h4 className="font-black text-sm mb-2 uppercase tracking-wider">{step.title}</h4>
                                <p className="text-zinc-600 text-xs font-mono">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
