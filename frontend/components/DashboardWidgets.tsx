
import React, { memo } from 'react';
import { Target, Check, Sparkles } from 'lucide-react';

// --- Types ---
export interface ChartData {
    label: string;
    value: number; // 0-100
}

export interface DailyGoal {
    id: string;
    title: string;
    completed: boolean;
}

// --- Components ---

/**
 * StatCard: Displays a single metric with an icon and label.
 * Inspired by the "Yellow" dashboard top stats.
 */
export const StatCard: React.FC<{
    label: string;
    value: string | number;
    icon: string;
    trend?: string;
}> = memo(({ label, value, icon, trend }) => {
    return (
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden group hover:border-orange-500/20 transition-all cursor-default backdrop-blur-sm">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <i className={`fas ${icon} text-5xl text-orange-500`}></i>
            </div>
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 text-xl mb-3 border border-orange-500/20 shadow-[0_0_15px_-3px_rgba(249,115,22,0.3)]">
                <i className={`fas ${icon}`}></i>
            </div>
            <h3 className="text-3xl font-bold text-white font-manrope">{value}</h3>
            <p className="text-zinc-500 text-sm font-medium uppercase tracking-wide mt-1">{label}</p>
            {trend && (
                <div className="absolute top-4 right-4 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {trend}
                </div>
            )}
        </div>
    );
});
StatCard.displayName = 'StatCard';

/**
 * ActivityChart: A bar chart visualization of learning activity.
 * Inspired by the "Yellow" dashboard graph.
 */
export const ActivityChart: React.FC<{ data: ChartData[] }> = memo(({ data }) => {
    return (
        <div className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8 relative overflow-hidden backdrop-blur-sm">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white font-manrope">Learning Activity</h3>
                    <p className="text-zinc-500 text-sm mt-1">Your daily focus time</p>
                </div>
                <select className="bg-black/30 border border-white/10 text-xs text-gray-400 rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-500/50">
                    <option>This Week</option>
                    <option>Last Week</option>
                </select>
            </div>

            <div className="flex items-end justify-between h-48 gap-2 md:gap-4 relative z-10">
                {/* Y-Axis Lines (Decorative) */}
                <div className="absolute inset-x-0 bottom-0 h-full flex flex-col justify-between pointer-events-none opacity-10">
                    <div className="border-t border-white w-full"></div>
                    <div className="border-t border-white w-full"></div>
                    <div className="border-t border-white w-full"></div>
                    <div className="border-t border-white w-full"></div>
                    <div className="border-t border-white w-full"></div>
                </div>

                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-3 w-full group cursor-default">
                        <div className="relative w-full rounded-t-lg bg-zinc-800/30 overflow-hidden h-[150px] flex items-end">
                            <div
                                className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-lg transition-all duration-1000 ease-out group-hover:from-orange-500 group-hover:to-orange-300 relative"
                                style={{ height: `${item.value}%` }}
                            >
                                {/* Hover Tooltip */}
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 whitespace-nowrap z-20 pointer-events-none">
                                    {item.value} mins
                                </div>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-zinc-500 group-hover:text-white transition-colors uppercase">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});
ActivityChart.displayName = 'ActivityChart';

/**
 * DailyGoalsWidget: A list of daily tasks/achievements.
 * Inspired by the "Purple" dashboard tasks list.
 */
export const DailyGoalsWidget: React.FC<{ goals: DailyGoal[] }> = memo(({ goals }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="space-y-5 flex-grow">
                {goals.map((goal) => (
                    <div key={goal.id} className="group flex items-center gap-4 cursor-default">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-500 ${goal.completed ? 'bg-orange-500 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'border-white/5 bg-zinc-950 group-hover:border-orange-500/30'}`}>
                            {goal.completed ? <Check size={18} className="text-black stroke-[3]" /> : <Target size={18} className="text-zinc-600 group-hover:text-orange-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold tracking-tight truncate transition-colors ${goal.completed ? 'text-zinc-600 line-through' : 'text-zinc-200 group-hover:text-white'}`}>
                                {goal.title}
                            </p>
                            {goal.completed && (
                                <div className="flex items-center gap-1 mt-0.5">
                                    <Sparkles size={10} className="text-orange-500" />
                                    <span className="text-[10px] font-black text-orange-500/80 uppercase tracking-widest">Completed</span>
                                </div>
                            )}
                        </div>
                        {goal.completed && (
                            <div className="flex flex-col items-end shrink-0">
                                <span className="text-xs font-black text-white">+50</span>
                                <span className="text-[8px] font-bold text-zinc-600 uppercase">XP</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button className="mt-8 w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.02] hover:to-white/[0.05]">
                View All Quests
            </button>
        </div>
    );
});
DailyGoalsWidget.displayName = 'DailyGoalsWidget';
