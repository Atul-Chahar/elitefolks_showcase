import React from 'react';
import { FaMicrophoneLines, FaWaveSquare, FaBolt, FaBug, FaGraduationCap } from 'react-icons/fa6';

const FeaturesSection: React.FC = () => {
    return (
        <section id="features" className="z-20 overflow-hidden w-full max-w-7xl mx-auto px-6 py-32 relative">

            <div className="mb-24">
                <h2 className="text-5xl md:text-7xl font-medium text-white tracking-tighter font-manrope mb-8 leading-[1.1]">
                    Coding at the speed of <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">sound.</span>
                </h2>
                <p className="text-xl text-zinc-400 font-sans max-w-2xl leading-relaxed">
                    EliteFolks transforms your spoken intent into syntactically correct code, managing boilerplate and logic so you can focus on architecture.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <div className="group relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-10 hover:bg-zinc-900/60 transition-all duration-500 overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:opacity-40 transition-opacity">
                        <FaMicrophoneLines className="text-9xl text-orange-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-8 border border-white/5">
                            <FaWaveSquare className="text-orange-500 text-2xl" />
                        </div>
                        <h3 className="text-3xl font-medium text-white font-manrope mb-4">Natural Language Processing</h3>
                        <p className="text-zinc-500 font-sans leading-relaxed max-w-md">
                            Our advanced NLP engine understands context, nuance, and programming jargon. Just describe what you want, and watch the code generate in real-time.
                        </p>
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="group relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-10 hover:bg-zinc-900/60 transition-all duration-500 overflow-hidden">
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full group-hover:bg-orange-500/20 transition-all"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-8 border border-white/5">
                            <FaBolt className="text-white text-2xl" />
                        </div>
                        <h3 className="text-3xl font-medium text-white font-manrope mb-4">Instant Execution</h3>
                        <p className="text-zinc-500 font-sans leading-relaxed">
                            Run and test snippets immediately. No context switching between IDE and documentation.
                        </p>
                    </div>
                </div>

                {/* Feature 3 */}
                <div className="group relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-10 hover:bg-zinc-900/60 transition-all duration-500 overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-8 border border-white/5">
                            <FaBug className="text-white text-2xl" />
                        </div>
                        <h3 className="text-3xl font-medium text-white font-manrope mb-4">Live Debugging</h3>
                        <p className="text-zinc-500 font-sans leading-relaxed">
                            Encounter an error? Just ask "What went wrong?" and get an instant, conversational explanation and fix.
                        </p>
                    </div>
                </div>

                {/* Feature 4 */}
                <div className="group relative bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-10 hover:bg-zinc-900/60 transition-all duration-500 overflow-hidden md:col-span-2">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-8 border border-white/5">
                                <FaGraduationCap className="text-orange-500 text-2xl" />
                            </div>
                            <h3 className="text-3xl font-medium text-white font-manrope mb-4">Interactive Curriculum</h3>
                            <p className="text-zinc-500 font-sans leading-relaxed">
                                Structured courses that adapt to your pace. Learn JavaScript, Python, and React through hands-on voice-guided exercises.
                            </p>
                        </div>
                        <div className="bg-zinc-950/50 rounded-2xl p-6 border border-white/5 font-mono text-sm text-zinc-400">
                            <div className="flex gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                            </div>
                            <div className="space-y-2">
                                <p><span className="text-purple-400">const</span> <span className="text-blue-400">greeting</span> = <span className="text-orange-400">"Hello, EliteFolks!"</span>;</p>
                                <p><span className="text-purple-400">function</span> <span className="text-blue-400">speak</span>() {'{'}</p>
                                <p className="pl-4"><span className="text-zinc-500">// Just say it...</span></p>
                                <p className="pl-4">console.<span className="text-yellow-400">log</span>(greeting);</p>
                                <p>{'}'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
