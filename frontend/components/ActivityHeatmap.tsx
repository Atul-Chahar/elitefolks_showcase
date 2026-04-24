import React, { useMemo, memo } from 'react';
import { ActivityLog } from '../types';

interface ActivityHeatmapProps {
    activityLog: ActivityLog[];
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = memo(({ activityLog }) => {
    // Generate dates once per mount (or if we wanted to support time travel, dependent on a 'today' prop)
    const days = useMemo(() => {
        const d = [];
        const today = new Date();
        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            d.push(date.toISOString().split('T')[0]);
        }
        return d;
    }, []);

    // Aggregate activity by date for consistent lookup
    const aggregatedActivity = useMemo(() => {
        const map = new Map<string, ActivityLog>();
        activityLog.forEach(log => {
            if (!log.date) return;
            const existing = map.get(log.date);
            if (existing) {
                map.set(log.date, {
                    ...existing,
                    xpEarned: (existing.xpEarned || 0) + (log.xpEarned || 0),
                    lessonsCompleted: (existing.lessonsCompleted || 0) + (log.lessonsCompleted || 0),
                    voiceInteractions: (existing.voiceInteractions || 0) + (log.voiceInteractions || 0),
                    minutesSpent: (existing.minutesSpent || 0) + (log.minutesSpent || 0)
                });
            } else {
                map.set(log.date, { ...log });
            }
        });
        return map;
    }, [activityLog]);

    // Helper to get color based on XP/Intensity
    const getColor = (dateStr: string) => {
        const activity = aggregatedActivity.get(dateStr);
        if (!activity) return 'bg-zinc-800'; // Empty state

        const xp = activity.xpEarned || 0;
        const lessons = activity.lessonsCompleted || 0;
        const voice = activity.voiceInteractions || 0;

        // Intensity score: Each lesson is like 20 XP, each voice like 5 XP
        const score = xp + (lessons * 20) + (voice * 5);

        if (score > 100) return 'bg-orange-500';
        if (score > 50) return 'bg-orange-600';
        if (score > 20) return 'bg-orange-700';
        if (score > 0) return 'bg-orange-900';
        return 'bg-zinc-800';
    };

    const getTooltip = (dateStr: string) => {
        const activity = aggregatedActivity.get(dateStr);
        if (!activity) return `${dateStr}: No activity`;

        const details = [];
        if (activity.xpEarned > 0) details.push(`${activity.xpEarned} XP`);
        if (activity.lessonsCompleted > 0) details.push(`${activity.lessonsCompleted} Lessons`);
        if (activity.voiceInteractions > 0) details.push(`${activity.voiceInteractions} Voice`);

        return `${dateStr}: ${details.join(', ') || 'Activity recorded'}`;
    };

    const months = useMemo(() => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], []);

    return (
        <div className="h-full">
            <h3 className="text-zinc-400 mb-4 font-semibold">Activity (Last 365 Days)</h3>

            {/* Months Header (simplified approximation) */}
            <div className="flex justify-between mb-2 text-xs text-zinc-500 px-1">
                {months.map(m => <span key={m}>{m}</span>)}
            </div>

            {/* Scrollable Container for Mobile */}
            <div className="overflow-x-auto pb-2">
                <div className="flex flex-wrap gap-1 h-32 content-start min-w-[700px] md:min-w-0">
                    {days.map((dateStr) => (
                        <div
                            key={dateStr}
                            title={getTooltip(dateStr)}
                            className={`w-3 h-3 rounded-sm ${getColor(dateStr)} hover:ring-1 ring-white/50 transition-all cursor-default relative group`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex justify-end items-center gap-2 mt-2 text-xs text-zinc-500">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-zinc-800"></div>
                <div className="w-3 h-3 rounded-sm bg-orange-900"></div>
                <div className="w-3 h-3 rounded-sm bg-orange-700"></div>
                <div className="w-3 h-3 rounded-sm bg-orange-600"></div>
                <div className="w-3 h-3 rounded-sm bg-orange-500"></div>
                <span>More</span>
            </div>
        </div>
    );
});

ActivityHeatmap.displayName = 'ActivityHeatmap';

export default ActivityHeatmap;
