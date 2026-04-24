import React from 'react';
import {
    FaSignal, FaWifi, FaBatteryFull, FaArrowLeft, FaEllipsisH,
    FaRobot, FaUser, FaKeyboard, FaMicrophone, FaPaperPlane,
    FaTrophy, FaArrowRight, FaMagic, FaBug, FaBook,
    FaExternalLinkAlt, FaCog
} from 'react-icons/fa';
import { FaReact, FaJs } from 'react-icons/fa6';

const MobileDemoSection: React.FC = () => {
    return (
        <section className="z-20 overflow-hidden w-full max-w-7xl mx-auto px-6 py-20 relative">

            {/* Background Large Typography */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full select-none pointer-events-none z-0">
                <h2 className="text-[12vw] leading-none font-bold text-white/[0.03] text-center whitespace-nowrap font-manrope tracking-tighter">
                    MOBILE EDITOR
                </h2>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">

                {/* Left Column: Text Content */}
                <div className="lg:col-span-4 flex flex-col justify-center order-2 lg:order-1">
                    <div className="flex items-center gap-2 mb-6 opacity-60">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        <span className="text-xs font-mono text-gray-400 tracking-widest">02/04</span>
                    </div>

                    <h3 className="leading-[1.1] uppercase md:text-6xl text-4xl font-normal text-white tracking-tight font-manrope mb-8">
                        Coding
                        Unbound
                        <span className="text-gray-500 block">Freedom &amp;</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-200">Speed</span>
                    </h3>

                    <div className="hidden lg:block h-px w-24 bg-white/10 mt-4"></div>
                </div>

                {/* Center Column: Phone Mockup (Chat Interface) */}
                <div className="lg:col-span-4 flex order-1 lg:order-2 lg:py-0 pt-12 pb-12 relative justify-center">
                    {/* Glow Effect */}
                    <div className="-translate-x-1/2 -translate-y-1/2 blur-[100px] pointer-events-none bg-orange-500/20 w-64 h-96 rounded-full absolute top-1/2 left-1/2 will-change-transform"></div>

                    {/* Phone Frame */}
                    <div className="border-[1px] overflow-hidden bg-zinc-950 w-[330px] h-[660px] z-10 border-zinc-800 rounded-[3.5rem] ring-white/10 ring-1 relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">

                        {/* Dynamic Island */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 h-[32px] w-[110px] bg-black rounded-full z-50 flex items-center justify-between px-3 transition-all duration-500 hover:w-[140px] group/island will-change-transform">
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1.5">
                                <div className="w-4 h-4 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/5"></div>
                            </div>
                        </div>

                        {/* Status Bar */}
                        <div className="absolute top-4 left-0 w-full px-8 flex justify-between items-center z-40 text-[10px] font-semibold text-white/90 tracking-wide">
                            <span>9:41</span>
                            <div className="flex gap-1.5 items-center">
                                <FaSignal />
                                <FaWifi />
                                <FaBatteryFull />
                            </div>
                        </div>

                        {/* App Content */}
                        <div className="flex flex-col z-10 bg-gradient-to-b from-zinc-900 to-black w-full h-full pt-16 relative">

                            {/* Header */}
                            <div className="flex z-10 mb-6 px-6 relative items-center justify-between">
                                <button className="flex hover:bg-white/10 transition-colors text-white/70 bg-white/5 w-8 h-8 rounded-full items-center justify-center border border-white/5">
                                    <FaArrowLeft className="text-xs" />
                                </button>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
                                    <span className="text-sm font-semibold text-white tracking-wide">EliteFolks AI</span>
                                </div>
                                <button className="flex hover:bg-white/10 transition-colors text-white/70 bg-white/5 w-8 h-8 rounded-full items-center justify-center border border-white/5">
                                    <FaEllipsisH className="text-xs" />
                                </button>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-4">
                                {/* AI Message */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/20 flex-shrink-0">
                                        <FaRobot className="text-orange-500 text-xs" />
                                    </div>
                                    <div className="bg-zinc-800/80 rounded-2xl rounded-tl-none p-3 border border-white/5 max-w-[85%]">
                                        <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                                            I've analyzed your component. The <span className="text-orange-400 font-mono">useEffect</span> dependency array is missing <span className="text-orange-400 font-mono">userData</span>. Should I fix it?
                                        </p>
                                    </div>
                                </div>

                                {/* User Message */}
                                <div className="flex gap-3 flex-row-reverse">
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 flex-shrink-0">
                                        <FaUser className="text-white text-xs" />
                                    </div>
                                    <div className="bg-orange-500/20 rounded-2xl rounded-tr-none p-3 border border-orange-500/20 max-w-[85%]">
                                        <p className="text-xs text-orange-100 font-sans leading-relaxed">
                                            Yes, please fix it and explain why that causes a bug.
                                        </p>
                                    </div>
                                </div>

                                {/* AI Message */}
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/20 flex-shrink-0">
                                        <FaRobot className="text-orange-500 text-xs" />
                                    </div>
                                    <div className="bg-zinc-800/80 rounded-2xl rounded-tl-none p-3 border border-white/5 max-w-[85%]">
                                        <p className="text-xs text-zinc-300 font-sans leading-relaxed mb-2">
                                            Done. Without it, the effect references stale data from the first render. Here represents the fix:
                                        </p>
                                        <div className="bg-black/50 rounded-lg p-2 font-mono text-[10px] text-zinc-400 border border-white/5">
                                            <span className="text-purple-400">useEffect</span>(() =&gt; {'{'}<br />
                                            &nbsp;&nbsp;fetchData(userData.id);<br />
                                            {'}'}, [<span className="text-green-400">userData</span>]);
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Voice Input Controls */}
                            <div className="p-6 bg-zinc-900/80 backdrop-blur-md border-t border-white/5 rounded-t-[2.5rem]">
                                <div className="flex items-center justify-center gap-6 mb-6">
                                    <button className="w-10 h-10 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
                                        <FaKeyboard />
                                    </button>
                                    <button className="w-16 h-16 rounded-full bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)] flex items-center justify-center text-white hover:scale-105 transition-transform">
                                        <FaMicrophone className="text-2xl" />
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
                                        <FaPaperPlane />
                                    </button>
                                </div>
                                <p className="text-center text-[10px] text-zinc-500 uppercase tracking-widest">Listening...</p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right Column: Cards */}
                <div className="lg:col-span-4 flex flex-col gap-5 lg:items-end order-3 justify-center relative z-10">

                    {/* Card 1: Stats */}
                    <div className="transition-transform duration-500 hover:scale-[1.01] text-left bg-gradient-to-br from-white/10 to-white/0 w-full max-w-sm rounded-3xl p-5 shadow-2xl backdrop-blur-xl border border-white/10 will-change-transform">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 p-0.5 shadow-lg shadow-orange-500/20">
                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                                    <FaTrophy className="text-orange-500" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white tracking-tight font-manrope">Daily Streak</h3>
                                <p className="text-xs font-medium text-zinc-400 font-sans">Level 5 · Apprentice</p>
                            </div>
                            <div className="ml-auto">
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></div>
                            </div>
                        </div>

                        <div className="flex justify-between gap-2 mb-5">
                            <div className="flex flex-col flex-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 font-sans">XP Today</span>
                                <span className="text-sm font-semibold text-white font-geist">1,250</span>
                            </div>
                            <div className="flex flex-col flex-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 font-sans">Fixes</span>
                                <span className="text-sm font-semibold text-white font-geist">14</span>
                            </div>
                            <div className="flex flex-col flex-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                                <span className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 font-sans">Time</span>
                                <span className="text-sm font-semibold text-white font-geist">2.4h</span>
                            </div>
                        </div>

                        <button className="flex gap-2 w-full rounded-full py-2.5 items-center justify-center bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-xs font-medium text-white">
                            View Profile <FaArrowRight className="text-[10px]" />
                        </button>
                    </div>

                    {/* Card 2: Quick Commands */}
                    <div className="transition-transform duration-500 hover:scale-[1.01] text-left bg-gradient-to-br from-white/10 to-white/0 w-full max-w-sm rounded-3xl p-5 shadow-xl backdrop-blur-xl border border-white/10 will-change-transform">
                        <p className="text-sm text-zinc-400 leading-relaxed mb-4 font-sans">
                            Control your entire development environment with simple natural language commands.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-zinc-300 bg-white/5 border border-white/5 rounded-full px-2.5 py-1">
                                <FaMagic className="text-orange-400" /> Refactor
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-zinc-300 bg-white/5 border border-white/5 rounded-full px-2.5 py-1">
                                <FaBug className="text-orange-400" /> Debug
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-zinc-300 bg-white/5 border border-white/5 rounded-full px-2.5 py-1">
                                <FaBook className="text-orange-400" /> Explain
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 flex items-center justify-between rounded-xl bg-zinc-950/50 border border-white/5 px-3 py-2 hover:border-white/20 transition-colors group">
                                <span className="text-xs text-zinc-300 font-medium font-sans">Docs</span>
                                <FaExternalLinkAlt className="text-[10px] text-zinc-500 group-hover:text-white" />
                            </button>
                            <button className="flex-1 flex items-center justify-between rounded-xl bg-zinc-950/50 border border-white/5 px-3 py-2 hover:border-white/20 transition-colors group">
                                <span className="text-xs text-zinc-300 font-medium font-sans">Settings</span>
                                <FaCog className="text-[10px] text-zinc-500 group-hover:text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Card 3: Recent Sessions */}
                    <div className="transition-transform duration-500 hover:scale-[1.01] text-left bg-gradient-to-br from-white/10 to-white/0 w-full max-w-sm rounded-3xl p-5 shadow-xl backdrop-blur-xl border border-white/10 will-change-transform">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-sans">Recent Sessions</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></div>
                            </div>
                            <button className="text-[10px] font-medium text-zinc-400 hover:text-white transition-colors font-sans underline decoration-zinc-700 underline-offset-2">View all</button>
                        </div>
                        <div className="space-y-2">
                            <div className="group rounded-xl bg-zinc-950/50 border border-white/5 p-2.5 flex items-center gap-3 hover:bg-white/[0.02] hover:border-white/10 transition-colors cursor-pointer">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                    <FaReact className="text-blue-400" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-medium text-zinc-200 truncate font-geist">React Hooks Mastery</span>
                                    <span className="text-[10px] text-zinc-500 font-mono">15m ago · 98% Accuracy</span>
                                </div>
                            </div>
                            <div className="group rounded-xl bg-zinc-950/50 border border-white/5 p-2.5 flex items-center gap-3 hover:bg-white/[0.02] hover:border-white/10 transition-colors cursor-pointer">
                                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                                    <FaJs className="text-yellow-400" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-medium text-zinc-200 truncate font-geist">Async/Await Basics</span>
                                    <span className="text-[10px] text-zinc-500 font-mono">2h ago · Completed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default MobileDemoSection;
