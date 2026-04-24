import React from 'react';
import { Swords, Code, Book, Trophy, Zap, Clock, ChevronRight, Star, Target } from 'lucide-react';

interface Activity {
    id: string;
    type: 'battle' | 'contest' | 'dsa' | 'logic' | 'lesson';
    title: string;
    description?: string;
    result?: string;
    xp_earned?: number;
    coins_earned?: number;
    metadata?: any;
    created_at: string;
}

interface UnifiedActivityHistoryProps {
    activities: Activity[];
    loading?: boolean;
}

const UnifiedActivityHistory: React.FC<UnifiedActivityHistoryProps> = ({ activities, loading }) => {
    const getActivityIcon = (type: Activity['type'], result?: string) => {
        switch (type) {
            case 'battle':
                return <Swords className={result === 'won' ? "text-yellow-400" : "text-zinc-400"} size={18} />;
            case 'dsa':
                return <Code className="text-blue-400" size={18} />;
            case 'lesson':
                return <Book className="text-green-400" size={18} />;
            case 'contest':
                return <Trophy className="text-purple-400" size={18} />;
            case 'logic':
                return <Zap className="text-orange-400" size={18} />;
            default:
                return <Target className="text-zinc-400" size={18} />;
        }
    };

    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-white/5 rounded-xl border border-white/5" />
                ))}
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Clock className="text-zinc-500" size={24} />
                </div>
                <h3 className="text-zinc-300 font-bold mb-1 uppercase tracking-wider">No Activity Yet</h3>
                <p className="text-zinc-500 text-sm max-w-[200px]">Start training or join a battle to see your history here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {activities.map((activity) => (
                <div 
                    key={activity.id}
                    className="group relative overflow-hidden bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all duration-300 active:scale-[0.98]"
                >
                    {/* Shadow/Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    <div className="flex items-center gap-4 relative z-10">
                        {/* Icon Container */}
                        <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/5 group-hover:border-white/20 transition-colors`}>
                            {getActivityIcon(activity.type, activity.result)}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0 py-0.5">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <h4 className="text-[13px] font-bold text-zinc-100 truncate group-hover:text-orange-400 transition-colors tracking-tight">
                                    {activity.title}
                                </h4>
                                <span className="text-[9px] font-black text-zinc-500 whitespace-nowrap uppercase tracking-widest bg-zinc-900/50 px-2 py-0.5 rounded-md border border-white/5">
                                    {formatTimeAgo(activity.created_at)}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {activity.description && (
                                    <p className="text-[11px] text-zinc-500 truncate max-w-[180px] font-medium leading-none">
                                        {activity.description}
                                    </p>
                                )}
                                <div className="flex items-center gap-2 ml-auto">
                                    {activity.xp_earned ? (
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                                            <Star size={10} className="text-orange-400" />
                                            <span className="text-[10px] font-bold text-orange-400">+{activity.xp_earned}XP</span>
                                        </div>
                                    ) : null}
                                    {activity.coins_earned ? (
                                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20">
                                            <Zap size={10} className="text-yellow-400" />
                                            <span className="text-[10px] font-bold text-yellow-400">+{activity.coins_earned}</span>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {/* Action Hint */}
                        <ChevronRight className="shrink-0 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" size={16} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UnifiedActivityHistory;
