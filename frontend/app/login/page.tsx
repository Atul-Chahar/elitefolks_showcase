'use client';

import React, { useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import TurnstileWidget from '../../components/TurnstileWidget';
import AuthBackground3D from '../../components/AuthBackground3D';
import AuthBrace3D from '../../components/AuthBrace3D';

const LoginContent: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, loginWithGoogle, loginWithGithub } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

    // Capture verbose errors from OAuth redirect
    React.useEffect(() => {
        const errorParam = searchParams.get('error');
        const msgParam = searchParams.get('msg');
        const codeParam = searchParams.get('code');

        if (errorParam || msgParam) {
            setError(`${msgParam || errorParam} ${codeParam ? `(Code: ${codeParam})` : ''}`);
        }
    }, [searchParams]);

    const handleTurnstileVerify = useCallback((token: string) => {
        setTurnstileToken(token);
    }, []);

    const handleTurnstileExpire = useCallback(() => {
        setTurnstileToken(null);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!turnstileToken) {
            setError('Please complete the human verification.');
            return;
        }

        setIsLoading(true);

        try {
            // Verify Turnstile token server-side
            const verifyRes = await fetch('/api/verify-turnstile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: turnstileToken }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
                setError(verifyData.error || 'Human verification failed.');
                setIsLoading(false);
                return;
            }

            const loginResult = await login(email, password);
            if (loginResult?.isNewUser) {
                router.push('/courses');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (!turnstileToken) {
            setError('Please complete the human verification first.');
            return;
        }
        try {
            setError('');
            // Verify Turnstile token server-side
            const verifyRes = await fetch('/api/verify-turnstile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: turnstileToken }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
                setError(verifyData.error || 'Human verification failed.');
                return;
            }
            await loginWithGoogle();
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with Google');
        }
    }

    const handleGithubLogin = async () => {
        if (!turnstileToken) {
            setError('Please complete the human verification first.');
            return;
        }
        try {
            setError('');
            const verifyRes = await fetch('/api/verify-turnstile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: turnstileToken }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
                setError(verifyData.error || 'Human verification failed.');
                return;
            }
            await loginWithGithub();
        } catch (err: any) {
            setError(err.message || 'Failed to sign in with GitHub');
        }
    }


    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center relative overflow-hidden bg-black selection:bg-orange-500/30 font-sans">
            {/* 3D Background Assets - Restored */}
            <AuthBackground3D />
            <AuthBrace3D side="left" />
            <AuthBrace3D side="right" />

            {/* Background Atmosphere - Layered Grid */}
            <div className="grid-bg absolute inset-0 opacity-20 pointer-events-none z-[1]" aria-hidden="true" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_80%)] pointer-events-none z-[1]" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-[1]" />

            <div className="w-full max-w-md relative z-10 flex flex-col items-center">
                {/* ─── Login card ─── */}
                <div className="w-full rounded-[2.5rem] p-[1px] bg-gradient-to-b from-white/10 to-transparent relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />

                    <div className="bg-black/60 backdrop-blur-md rounded-[2.4rem] p-8 md:p-10 relative overflow-hidden border border-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 mb-6">
                                <ShieldCheck size={12} className="text-orange-500 animate-pulse" />
                                <span className="text-[10px] font-black text-orange-200 uppercase tracking-widest font-mono">Secure Access Port</span>
                            </div>
                            <h1 className="font-[family-name:var(--font-bebas)] text-6xl tracking-wider text-white mb-2 leading-none uppercase italic pr-2">
                                WELCOME <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 pr-2">ELITES</span>
                            </h1>
                            <p className="text-zinc-500 text-xs font-medium uppercase tracking-[0.2em]">Sign in to continue your journey</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 text-[11px] font-mono leading-relaxed flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0"></span>
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* OAuth Buttons */}
                            <div className="space-y-3">
                                {/* Google Button */}
                                <button
                                    onClick={handleGoogleLogin}
                                    type="button"
                                    disabled={!turnstileToken}
                                    className={`w-full bg-white text-black py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center transition-all duration-300 relative overflow-hidden group/btn ${!turnstileToken ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
                                    <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Continue with Google
                                </button>

                                {/* GitHub Button */}
                                <button
                                    onClick={handleGithubLogin}
                                    type="button"
                                    disabled={!turnstileToken}
                                    className={`w-full bg-[#24292e] text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center transition-all duration-300 relative overflow-hidden group/ghbtn border border-white/10 ${!turnstileToken ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-[#2f363d] hover:scale-[1.02] hover:border-white/20 active:scale-[0.98]'}`}
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/ghbtn:translate-x-full transition-transform duration-700"></span>
                                    <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                    Continue with GitHub
                                </button>
                            </div>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full h-px bg-white/5"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]">
                                    <span className="px-4 bg-black text-zinc-600">Transmission Port</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Identify (Email)</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-orange-500 text-zinc-600 transition-colors">
                                            <Mail size={16} />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white font-mono text-xs focus:outline-none focus:border-orange-500/50 transition-all duration-300 placeholder:text-zinc-700"
                                            placeholder="USER_IDENTIFIER@MAIL.EXE"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">Access Key (Password)</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-orange-500 text-zinc-600 transition-colors">
                                            <Lock size={16} />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white font-mono text-xs focus:outline-none focus:border-orange-500/50 transition-all duration-300 placeholder:text-zinc-700"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end -mt-2">
                                    <Link href="/auth/forgot-password" className="text-[10px] font-bold text-orange-500/70 hover:text-orange-400 transition-colors uppercase tracking-wider">
                                        Forgot Password?
                                    </Link>
                                </div>

                                <div className="pt-2">
                                    <TurnstileWidget
                                        onVerify={handleTurnstileVerify}
                                        onExpire={handleTurnstileExpire}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !turnstileToken}
                                    className={`w-full py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center relative overflow-hidden transition-all duration-300 ${isLoading || !turnstileToken ? 'bg-zinc-900 border border-white/5 text-zinc-600 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-500 text-black shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:scale-[1.02] active:scale-[0.98]'}`}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin"></div>
                                            <span>Verifying...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span>Engage Session</span>
                                            <ArrowRight size={16} />
                                        </div>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <p className="text-center text-zinc-600 mt-10 text-[10px] font-black uppercase tracking-[0.3em]">
                    New to the elite?{' '}
                    <Link href="/signup" className="text-orange-500 hover:text-orange-400 transition-colors ml-2 underline underline-offset-4 decoration-orange-500/30">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

const LoginPage: React.FC = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
};

export default LoginPage;
