'use client';

import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, Loader2, CheckCircle } from 'lucide-react';

interface SecurityTabProps {
    userEmail: string;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ userEmail }) => {
    // Change Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Change Email State
    const [newEmail, setNewEmail] = useState('');
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }

        setPasswordLoading(true);
        try {
            const { account } = await import('../../../lib/appwrite');
            await account.updatePassword(newPassword, currentPassword || undefined);

            setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setPasswordMessage({ type: 'error', text: error.message || 'Failed to update password.' });
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleChangeEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailMessage(null);

        if (!newEmail.trim() || !newEmail.includes('@')) {
            setEmailMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return;
        }

        if (newEmail === userEmail) {
            setEmailMessage({ type: 'error', text: 'New email is the same as current email.' });
            return;
        }

        setEmailLoading(true);
        try {
            const { account } = await import('../../../lib/appwrite');
            await account.updateEmail(newEmail, '');

            setEmailMessage({ type: 'success', text: 'Email updated! You may need to verify the new email.' });
            setNewEmail('');
        } catch (error: any) {
            setEmailMessage({ type: 'error', text: error.message || 'Failed to update email.' });
        } finally {
            setEmailLoading(false);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Security Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-zinc-800/50">
                <div className="relative">
                    <div className="absolute inset-0 bg-orange-500/10 rounded-2xl blur-xl" />
                    <div className="relative w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                        <ShieldCheck size={22} className="text-orange-500" />
                    </div>
                </div>
                <div>
                    <h2 className="font-[family-name:var(--font-bebas)] text-3xl tracking-wide text-white">Security</h2>
                    <p className="text-zinc-500 text-sm">
                        Manage your password and email
                    </p>
                </div>
            </div>

            {/* Change Password Section */}
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Lock size={14} className="text-orange-500" />
                    Change Password
                </h3>

                {passwordMessage && (
                    <div className={`p-4 rounded-xl text-sm border flex items-center gap-3 animate-fade-in ${passwordMessage.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                        {passwordMessage.type === 'success' ? <CheckCircle size={16} /> : <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                        {passwordMessage.text}
                    </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Min 6 characters"
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-all duration-300 placeholder:text-zinc-700"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm password"
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-all duration-300 placeholder:text-zinc-700"
                        />
                    </div>

                    {/* Password strength indicator */}
                    {newPassword.length > 0 && (
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map((level) => (
                                <div
                                    key={level}
                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${newPassword.length >= level * 3
                                        ? level <= 1 ? 'bg-red-500' : level <= 2 ? 'bg-yellow-500' : level <= 3 ? 'bg-orange-500' : 'bg-emerald-500'
                                        : 'bg-zinc-800'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="px-6 py-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {passwordLoading ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                        Update Password
                    </button>
                </form>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-800/50" />

            {/* Change Email Section */}
            <div className="space-y-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Mail size={14} className="text-orange-500" />
                    Change Email
                </h3>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-1">Current Email</p>
                    <p className="text-white text-sm font-mono">{userEmail || 'Not set'}</p>
                </div>

                {emailMessage && (
                    <div className={`p-4 rounded-xl text-sm border flex items-center gap-3 animate-fade-in ${emailMessage.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                        {emailMessage.type === 'success' ? <CheckCircle size={16} /> : <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                        {emailMessage.text}
                    </div>
                )}

                <form onSubmit={handleChangeEmail} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">New Email Address</label>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                            placeholder="new@email.com"
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-orange-500/50 transition-all duration-300 placeholder:text-zinc-700"
                        />
                    </div>

                    <p className="text-[10px] text-zinc-600 leading-relaxed">
                        A confirmation link will be sent to both your current and new email address. You must confirm on both to complete the change.
                    </p>

                    <button
                        type="submit"
                        disabled={emailLoading}
                        className="px-6 py-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {emailLoading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                        Update Email
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SecurityTab;
