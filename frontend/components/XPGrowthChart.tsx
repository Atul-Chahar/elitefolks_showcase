import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ActivityLog } from '../types';

interface XPGrowthChartProps {
    activityLog: ActivityLog[];
}

const XPGrowthChart: React.FC<XPGrowthChartProps> = ({ activityLog }) => {
    // Process data to get cumulative XP over a continuous 30-day timeline
    const data = useMemo(() => {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);

        // Ensure log is sorted chronologically
        const sortedLog = [...activityLog].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Calculate the base XP before the 30-day window to set the starting floor correctly
        let cumulativeXP = 0;
        const pastLogs = sortedLog.filter(log => new Date(log.date) < thirtyDaysAgo);
        pastLogs.forEach(entry => {
            cumulativeXP += Number(entry.xpEarned || 0);
        });

        const chartData = [];

        // Map recent logs for quick lookup by date string (YYYY-MM-DD)
        const recentLogsMap = new Map();
        sortedLog.forEach(log => {
            // Support both full ISO strings and YYYY-MM-DD
            const normalizedDate = log.date.split('T')[0];
            const current = recentLogsMap.get(normalizedDate) || 0;
            recentLogsMap.set(normalizedDate, current + Number(log.xpEarned || 0));
        });

        // Generate a data point for every single day in the last 30 days
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Add today's earnings to the running total if any
            if (recentLogsMap.has(dateStr)) {
                cumulativeXP += recentLogsMap.get(dateStr);
            }

            chartData.push({
                date: dateStr,
                xp: cumulativeXP
            });
        }

        return chartData;
    }, [activityLog]);

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-full h-[250px] bg-white/5 animate-pulse rounded-xl" />;

    // ALWAYS render the authentic chart, even if it's a flatline at 0 XP
    return (
        <div className="h-full">
            <h3 className="text-zinc-400 mb-6 font-semibold px-6 pt-6 italic text-sm uppercase tracking-wider">XP Growth (Last 30 Days)</h3>
            <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: '#71717a', fontSize: 10 }}
                            tickFormatter={(val) => val.substring(5)} // Show MM-DD
                        />
                        <YAxis tick={{ fill: '#71717a', fontSize: 10 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }}
                            itemStyle={{ color: '#f97316' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="xp"
                            stroke="#f97316"
                            fillOpacity={1}
                            fill="url(#colorXp)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default XPGrowthChart;
