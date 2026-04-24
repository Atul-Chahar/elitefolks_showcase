'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { authService } from '../../../services/authService';
import AuthBackground3D from '../../../components/AuthBackground3D';
import AuthBrace3D from '../../../components/AuthBrace3D';

const ResetPasswordPage: React.FC = () => {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            await authService.updatePassword(password);
            setIsSuccess(true);
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to update password. The reset link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center relative overflow-hidden bg-black selection:bg-orange-500/30 font-sans">
            {/* 3D Background Assets */}
            <AuthBackground3D />
            <AuthBrace3D side="left" />
            <AuthBrace3D side="right" />

            {/* Background Atmosphere */}
            <div className="grid-bg absolute inset-0 opacity-20 pointer-events-none z-[1]" aria-hidden="true" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_80%)] pointer-events-none z-[1]" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-[1]" />

            <div className="w-full max-w-md relative z-10 flex flex-col items-center">
                <div className="w-full rounded-[2.5rem] p-[1px] bg-gradient-to-b from-white/10 to-transparent relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />

                    <div className="bg-black/60 backdrop-blur-md rounded-[2.4rem] p-8 md:p-10 relative overflow-hidden border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 mb-6">
                                <ShieldCheck size={12} className="text-orange-500 animate-pulse" />
                                <span className="text-[10px] font-black text-orange-200 uppercase tracking-widest font-mono">New Credentials</span>
                            </div>
                            <h1 className="font-[family-name:var(--font-bebas)] text-5xl md:text-6xl tracking-wider text-white mb-2 leading-none uppercase italic">
                                NEW <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">PASSWORD</span>
                            </h1>
                            <p className="text-zinc-500 text-xs font-medium uppercase tracking-[0.2em]">
                                {isSuccess ? 'Password updated successfully' : 'Set your new access key'}
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 text-[11px] font-mono leading-relaxed flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0"></span>
                                {error}
                            </div>
                        )}

                        {isSuccess ? (
                            <div className="space-y-6">
                                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-xl text-sm leading-relaxed flex items-start gap-3">
                                    <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold mb-1">Password updated!</p>
                                        <p className="text-emerald-400/80 text-xs">
                                            Your password has been successfully changed. Redirecting to your dashboard...
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="w-6 h-6 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin"></div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">New Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-orange-500 text-zinc-600 transition-colors">
                                            <Lock size={16} />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white font-mono text-xs focus:outline-none focus:border-orange-500/50 transition-all duration-300 placeholder:text-zinc-700"
                                            placeholder="MIN_6_CHARS"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Confirm Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-orange-500 text-zinc-600 transition-colors">
                                            <Lock size={16} />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white font-mono text-xs focus:outline-none focus:border-orange-500/50 transition-all duration-300 placeholder:text-zinc-700"
                                            placeholder="CONFIRM_PASSWORD"
                                        />
                                    </div>
                                </div>

                                {/* Password strength indicator */}
                                {password.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${password.length >= level * 3
                                                            ? level <= 1 ? 'bg-red-500' : level <= 2 ? 'bg-yellow-500' : level <= 3 ? 'bg-orange-500' : 'bg-emerald-500'
                                                            : 'bg-zinc-800'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-wider">
                                            {password.length < 6 ? 'Too short' : password.length < 8 ? 'Fair' : password.length < 12 ? 'Strong' : 'Excellent'}
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center relative overflow-hidden transition-all duration-300 ${isLoading ? 'bg-zinc-900 border border-white/5 text-zinc-600 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-500 text-black shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:scale-[1.02] active:scale-[0.98]'}`}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin"></div>
                                            <span>Updating...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span>Update Password</span>
                                            <ArrowRight size={16} />
                                        </div>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
