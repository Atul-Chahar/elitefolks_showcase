import React from 'react';
import {
    Database,
    Clock,
    ShieldCheck,
    Server
} from 'lucide-react';
import { StaticIcon } from '../utils/courseIcons';

export const CareerPathSection: React.FC = () => {
    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-24 relative z-20">

            {/* Header */}
            <div className="text-center mb-16 relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 mb-6">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-[#F97316] animate-pulse"></span>
                    <span className="text-xs font-semibold text-orange-200 uppercase tracking-widest font-sans">Career Path</span>
                </div>
                <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter font-manrope mb-6">
                    A proven path to a <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-200">back-end career</span>
                </h2>
                <p className="text-xl text-zinc-400 font-sans max-w-2xl mx-auto leading-relaxed">
                    Industry-vetted curriculum designed to take you from zero to job-ready.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                {/* Top Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Tech Stack Card */}
                    <div className="md:col-span-2 group relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 hover:bg-zinc-900/60 transition-all duration-700 overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
                            <Server size={200} className="text-orange-500" />
                        </div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full group-hover:bg-orange-500/20 transition-all duration-700"></div>

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="mb-12">
                                <h3 className="text-3xl font-bold text-white font-manrope mb-4 group-hover:text-orange-400 transition-colors">
                                    Master the Modern Stack
                                </h3>
                                <p className="text-gray-400 text-lg font-sans max-w-lg leading-relaxed">
                                    Learn back-end technologies like <span className="text-white">Python, Go, and SQL</span> alongside DevOps essentials.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-5 items-center">
                                {[
                                    { icon: "logos:python", name: "Python" },
                                    { icon: "logos:go", name: "Go" },
                                    { icon: "logos:javascript", name: "JS" },
                                    { icon: "logos:docker-icon", name: "Docker" },
                                    { icon: "logos:kubernetes", name: "K8s" },
                                    { icon: "logos:git-icon", name: "Git" },
                                    { icon: "logos:bash-icon", name: "Bash" }
                                ].map((tech, i) => (
                                    <div key={tech.name}
                                        className="group/icon flex flex-col items-center gap-2"
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-zinc-950/50 border border-white/5 flex items-center justify-center group-hover/icon:border-orange-500/30 group-hover/icon:bg-zinc-900 transition-all duration-300 transform group-hover/icon:-translate-y-1 group-hover/icon:shadow-[0_10px_20px_-10px_rgba(249,115,22,0.3)]">
                                            <StaticIcon icon={tech.icon} className="text-2xl grayscale group-hover/icon:grayscale-0 transition-all" />
                                        </div>
                                    </div>
                                ))}
                                <div className="w-14 h-14 rounded-2xl bg-zinc-950/50 border border-white/5 flex items-center justify-center group-hover:border-orange-500/30 transition-all">
                                    <Database size={24} className="text-zinc-500 group-hover:text-orange-400 transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Time Card */}
                    <div className="md:col-span-1 group relative bg-zinc-900/40 border border-white/5 hover:border-orange-500/20 rounded-[2.5rem] p-8 md:p-12 transition-all duration-700 overflow-hidden flex flex-col justify-center text-left">
                        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 rounded-[2rem] bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-orange-500/10">
                                <Clock className="text-orange-500" size={36} />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-6xl font-bold text-white font-geist tracking-tighter">
                                    12 <span className="text-2xl text-zinc-600 font-medium">Months</span>
                                </h3>
                                <p className="text-gray-400 text-lg font-sans leading-relaxed">
                                    Average time to completion for part-time students.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Card - Refund Guarantee */}
                <div className="w-full group relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-10 md:p-16 hover:bg-zinc-900/60 transition-all duration-700 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full group-hover:bg-orange-500/10 transition-all duration-1000"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 justify-between">
                        <div className="text-center md:text-left flex-1">
                            <div className="mb-6 inline-flex items-center gap-2 text-orange-400/80">
                                <ShieldCheck size={28} className="group-hover:scale-110 transition-transform" />
                                <span className="font-bold tracking-[0.2em] uppercase text-xs text-orange-400">Satisfaction Guaranteed</span>
                            </div>

                            <h3 className="text-3xl md:text-5xl font-bold text-white font-manrope mb-6 tracking-tight">
                                Zero risk. <span className="text-zinc-500">Cancel anytime.</span>
                            </h3>

                            <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
                                We're confident in our curriculum. Not happy? Get a full refund within 30 days — no questions asked.
                            </p>
                        </div>

                        <div className="shrink-0">
                            <div className="w-32 h-32 rounded-full border-2 border-white/5 flex items-center justify-center relative group-hover:border-orange-500/20 transition-all duration-700">
                                <div className="absolute inset-2 rounded-full border border-orange-500/20 animate-[spin_10s_linear_infinite]"></div>
                                <div className="text-orange-500 font-bold text-xl">100%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default CareerPathSection;
