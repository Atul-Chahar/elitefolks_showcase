import React from 'react';
import Link from 'next/link';

export const metadata = {
    title: 'Authentication Error | EliteFolks',
    description: 'There was an error signing you in. Please try again.',
};

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl space-y-6">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold font-[family-name:var(--font-outfit)]">
                    Authentication Failed
                </h1>

                <p className="text-zinc-400 text-sm leading-relaxed">
                    We encountered an issue while trying to sign you in. The authentication code may have expired, or there could be a temporary issue. Please try again.
                </p>

                <div className="pt-4">
                    <Link
                        href="/login"
                        className="inline-block w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-orange-500/20"
                    >
                        Return to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
