import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
    onFinished: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinished }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Random increments for realistic feel
                return prev + Math.random() * 15;
            });
        }, 150);

        // Force minimum display time of 2s
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
                onFinished();
            }, 500); // Wait for exit animation
        }, 2000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [onFinished]);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
            <div className="relative flex flex-col items-center gap-8">
                {/* 3D Pulsing Core */}
                <div className="relative w-24 h-24">
                    {/* Outer Rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 animate-[spin_3s_linear_infinite]"></div>
                    <div className="absolute inset-2 rounded-full border-2 border-orange-500/40 animate-[spin_4s_linear_infinite_reverse]"></div>

                    {/* Glowing Core */}
                    <div className="absolute inset-0 m-auto w-12 h-12 bg-orange-500 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute inset-0 m-auto w-8 h-8 bg-white rounded-full blur-md"></div>
                </div>

                {/* Text & Progress */}
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-2xl font-bold text-white tracking-tighter font-manrope">
                        VOICE<span className="text-orange-500">CODE</span>
                    </h2>
                    <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500 transition-all duration-300 ease-out"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">
                        Initializing System... {Math.round(Math.min(progress, 100))}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
