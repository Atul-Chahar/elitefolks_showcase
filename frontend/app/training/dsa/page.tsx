import { getServerUser } from '@/lib/appwrite-server';
import { serverDbService as dbService } from '@/services/serverDbService';
import { ChevronLeft, Flame, Target, Network } from 'lucide-react';
import Link from 'next/link';
import QuestionList from '@/components/training/QuestionList';

export default async function DSAPage() {
    const user = await getServerUser();

    let streak = 0;
    let totalSolved = 0;
    let totalQuestions = 0;

    const questions = await dbService.getTrainingQuestions('DSA');
    totalQuestions = questions.length;

    if (user) {
        const stats = await dbService.getUserStats(user.id);
        if (stats) streak = stats.currentStreak || 0;
        totalSolved = await dbService.getTrainingSolvedCount(user.id);
    }

    return (
        <div className="pt-24 min-h-screen bg-[#050505] text-white flex flex-col font-sans relative overflow-hidden">

            {/* Ambient Base Layer */}
            <div className="fixed inset-0 bg-gradient-to-b from-orange-500/[0.03] via-[#050505] to-[#050505] pointer-events-none z-0" />
            <div className="absolute top-0 right-1/4 w-[600px] h-[400px] blur-[120px] rounded-full bg-orange-600/10 pointer-events-none z-0" />

            <div className="w-full max-w-7xl mx-auto px-6 relative z-10 pb-20">

                {/* Top Nav */}
                <div className="mb-12">
                    <Link href="/training" className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors tracking-widest uppercase">
                        <ChevronLeft size={14} /> Return to Base Camp
                    </Link>
                </div>

                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
                    <div className="flex gap-6 items-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.2)] shrink-0">
                            <Network size={40} className="text-orange-500" />
                        </div>
                        <div className="flex flex-col">
                            <div className="inline-flex items-center gap-2 mb-2">
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Live Workspace</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white/90">DSA Library</h1>
                            <p className="text-zinc-500 font-mono text-sm mt-2 max-w-md">
                                Optimize execution. Master algorithmic theory. Every completion impacts your global standing.
                            </p>
                        </div>
                    </div>

                    {/* Section Stats */}
                    <div className="flex gap-4 p-1.5 rounded-2xl bg-[#0A0A0A]/80 border border-white/5 backdrop-blur-xl shrink-0 w-full md:w-auto overflow-x-auto">
                        <div className="px-6 py-3 flex flex-col items-start min-w-[120px]">
                            <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1"><Target size={10} className="text-zinc-400" /> Completion</span>
                            <span className="text-xl font-mono text-white">{totalSolved} / {totalQuestions}</span>
                        </div>
                        <div className="w-px bg-white/5 my-2" />
                        <div className="px-6 py-3 flex flex-col items-start min-w-[120px]">
                            <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1"><Flame size={10} className="text-orange-500" /> Active Streak</span>
                            <span className="text-xl font-mono text-white">{streak} {streak === 1 ? 'Day' : 'Days'}</span>
                        </div>
                    </div>
                </div>

                {/* The Core Table List */}
                <div className="w-full">
                    <QuestionList category="DSA" />
                </div>
            </div>
        </div>
    );
}
