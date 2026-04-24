'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Trash2, ShieldX, Undo2 } from 'lucide-react';
import ActionCard from './ActionCard';

interface DangerZoneTabProps {
    onResetCourses: () => Promise<void>;
    onDeleteAccount: () => Promise<void>;
    onCancelDeletion?: () => Promise<void>;
    deletionScheduledFor: string | null;
}

const DangerZoneTab: React.FC<DangerZoneTabProps> = ({ onResetCourses, onDeleteAccount, onCancelDeletion, deletionScheduledFor }) => {
    const scheduledDate = deletionScheduledFor ? new Date(deletionScheduledFor) : null;
    const daysRemaining = scheduledDate ? Math.max(0, Math.ceil((scheduledDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Danger Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-red-500/20">
                <div className="relative">
                    {/* Pulsing glow */}
                    <div className="absolute inset-0 bg-red-500/20 rounded-2xl blur-xl animate-pulse" />
                    <div className="relative w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20">
                        <AlertTriangle size={22} className="text-red-500" />
                    </div>
                </div>
                <div>
                    <h2 className="font-[family-name:var(--font-bebas)] text-3xl tracking-wide text-white">Danger Zone</h2>
                    <p className="text-zinc-500 text-sm">
                        Irreversible and destructive actions
                    </p>
                </div>
            </div>

            {/* Pending Deletion Banner */}
            {deletionScheduledFor && scheduledDate && (
                <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full blur-[60px] bg-red-500/20 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                <ShieldX size={20} className="text-red-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-red-400 font-bold text-sm mb-1">Account Deletion Scheduled</h4>
                                <p className="text-red-400/70 text-xs leading-relaxed">
                                    Your account is scheduled for permanent deletion on{' '}
                                    <span className="font-mono font-bold text-red-300">
                                        {scheduledDate.toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                    . You have <span className="font-mono font-bold text-red-300">{daysRemaining} day{daysRemaining !== 1 ? 's' : ''}</span> remaining to cancel.
                                </p>
                                <p className="text-red-400/50 text-[10px] mt-2 uppercase tracking-wider">
                                    All your data, progress, and achievements will be permanently deleted.
                                </p>
                            </div>
                        </div>

                        {onCancelDeletion && (
                            <button
                                onClick={onCancelDeletion}
                                className="w-full mt-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                            >
                                <Undo2 size={16} />
                                Cancel Deletion — Keep My Account
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Reset Courses */}
            <ActionCard
                title="Reset All Courses"
                description="This will reset all your course progress, including completed lessons and module achievements. Your XP and gems will remain intact."
                icon={RefreshCw}
                variant="warning"
                buttonText="Reset Courses"
                onConfirm={onResetCourses}
            />

            {/* Delete Account - Only show if no pending deletion */}
            {!deletionScheduledFor && (
                <ActionCard
                    title="Delete Account"
                    description="Your account will be scheduled for deletion with a 15-day grace period. You can cancel at any time by logging back in. After 15 days, all data is permanently deleted."
                    icon={Trash2}
                    variant="danger"
                    buttonText="Delete Account"
                    requiresTypedConfirmation
                    confirmText="DELETE"
                    confirmPlaceholder="Type DELETE to confirm"
                    onConfirm={onDeleteAccount}
                />
            )}
        </div>
    );
};

export default DangerZoneTab;
