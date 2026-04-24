import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { UserStats } from '../types';

interface SkillRadarChartProps {
    stats: UserStats;
}

const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ stats }) => {
    const data = [
        { subject: 'JavaScript', A: stats.skillJs || 0, fullMark: 100 },
        { subject: 'Python', A: stats.skillPython || 0, fullMark: 100 },
        { subject: 'Voice Cmds', A: stats.skillVoice || 0, fullMark: 100 },
        { subject: 'Logic', A: stats.skillLogic || 0, fullMark: 100 },
        { subject: 'Speed', A: stats.skillSpeed || 0, fullMark: 100 },
    ];

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <h3 className="text-zinc-400 mb-4 font-semibold px-6 pt-6">Skill Analysis</h3>
            <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height={250}>
                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
                        <PolarGrid stroke="#3f3f46" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                        <Radar
                            name="Skills"
                            dataKey="A"
                            stroke="#f97316"
                            strokeWidth={2}
                            fill="#f97316"
                            fillOpacity={0.4}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SkillRadarChart;
