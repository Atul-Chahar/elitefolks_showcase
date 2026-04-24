'use client';

import React from 'react';
import { User, Globe, AlertTriangle, ShieldCheck, Crown, LucideIcon } from 'lucide-react';

type TabType = 'profile' | 'subscription' | 'security' | 'site' | 'danger';

interface Tab {
    id: TabType;
    label: string;
    icon: LucideIcon;
    isDanger?: boolean;
}

const tabs: Tab[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'subscription', label: 'Subscription', icon: Crown },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'site', label: 'Site Settings', icon: Globe },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, isDanger: true },
];

interface SettingsSidebarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeTab, onTabChange }) => {
    return (
        <nav className="space-y-2">
            {tabs.map((tab, index) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;

                const activeClasses = tab.isDanger
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-lg shadow-red-500/5'
                    : 'bg-gradient-to-r from-orange-500/15 to-orange-600/10 text-orange-400 border border-orange-500/20 shadow-lg shadow-orange-500/5';

                const inactiveClasses = 'text-zinc-400 hover:text-white hover:bg-zinc-900/60 border border-transparent';

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium 
                            transition-all duration-300 group backdrop-blur-sm
                            ${isActive ? activeClasses : inactiveClasses}
                        `}
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <Icon
                            size={18}
                            className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                        />
                        <span className="tracking-wide">{tab.label}</span>

                        {/* Active indicator dot */}
                        {isActive && !tab.isDanger && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        )}
                        {isActive && tab.isDanger && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        )}
                    </button>
                );
            })}
        </nav>
    );
};

export default SettingsSidebar;
export type { TabType };
