'use client';

import React from 'react';
import { Bell, Globe, Sparkles } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';

interface SiteSettings {
    soundEnabled: boolean;
    notificationsEnabled: boolean;
    darkMode: boolean;
}

interface SiteSettingsTabProps {
    settings: SiteSettings;
    onToggle: (key: keyof SiteSettings) => void;
}

const SiteSettingsTab: React.FC<SiteSettingsTabProps> = ({ settings, onToggle }) => {
    return (
        <div className="space-y-10 animate-fade-in">
            {/* Notifications Section */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl flex items-center justify-center">
                        <Bell size={18} className="text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wide text-white">Notifications</h3>
                        <p className="text-zinc-500 text-xs">Control how you receive updates</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <ToggleSwitch
                        enabled={settings.notificationsEnabled}
                        onToggle={() => onToggle('notificationsEnabled')}
                        label="Email Notifications"
                        description="Receive updates about your progress and achievements via email"
                    />
                </div>
            </section>

            {/* Experience Section */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl flex items-center justify-center">
                        <Sparkles size={18} className="text-purple-400" />
                    </div>
                    <div>
                        <h3 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wide text-white">Experience</h3>
                        <p className="text-zinc-500 text-xs">Customize your learning environment</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <ToggleSwitch
                        enabled={settings.soundEnabled}
                        onToggle={() => onToggle('soundEnabled')}
                        label="Sound Effects"
                        description="Enable sounds for lesson completion, XP gains, and achievements"
                    />
                </div>
            </section>

            {/* Coming Soon */}
            <div className="pt-6 border-t border-zinc-800/50">
                <div className="flex items-center justify-center gap-3 py-8">
                    <Globe size={16} className="text-zinc-600" />
                    <p className="text-zinc-600 text-sm italic">More settings coming soon...</p>
                </div>
            </div>
        </div>
    );
};

export default SiteSettingsTab;
