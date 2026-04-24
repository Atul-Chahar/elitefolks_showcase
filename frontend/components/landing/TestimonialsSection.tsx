import React from 'react';

/**
 * TestimonialsSection — preserved for future use.
 * 
 * This section was extracted from the landing page during the performance 
 * optimization pass. To re-enable it, import and add it to CourseSelection.tsx
 * (or wherever the landing page is assembled).
 * 
 * Usage:
 *   import TestimonialsSection from './landing/TestimonialsSection';
 *   // Then in JSX: <TestimonialsSection />
 */

const TestimonialsSection: React.FC = () => {
    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-20 relative z-20">
            <div className="flex flex-col text-center mb-20 items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 mb-6">
                    <i className="fas fa-star text-orange-500 text-xs"></i>
                    <span className="text-xs font-semibold text-orange-200 uppercase tracking-widest font-sans">Testimonials</span>
                </div>
                <h2 className="md:text-7xl text-5xl font-medium text-white tracking-tighter font-manrope mb-6">Proven results,
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500"> delivered</span>
                </h2>
                <p className="text-xl text-gray-400 font-sans max-w-2xl leading-relaxed">
                    See how developers are mastering code faster with EliteFolks's conversational intelligence.
                </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 mb-12 gap-x-6 gap-y-6">

                {/* Left Column: Mixed Cards */}
                <div className="lg:col-span-7 flex flex-col gap-6">

                    {/* Top Wide Card */}
                    <div className="group hover:bg-zinc-900/60 transition-all duration-500 bg-zinc-900/40 rounded-[2.5rem] p-10 relative backdrop-blur-sm border border-white/5">
                        <div className="group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-bl from-orange-500/5 via-transparent to-transparent opacity-0 rounded-[2.5rem] absolute top-0 right-0 bottom-0 left-0"></div>

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                                <h3 className="text-6xl font-semibold text-white tracking-tighter font-geist">
                                    300<span className="align-top text-xs font-normal text-zinc-500 tracking-tighter mt-2 ml-1">ms</span>
                                </h3>
                                <p className="text-lg font-medium text-zinc-300">Average voice-to-code execution latency.</p>
                            </div>

                            <i className="fas fa-quote-left text-3xl text-zinc-700 mb-4"></i>

                            <blockquote className="text-base text-gray-300 font-sans leading-relaxed mb-8">
                                "I thought voice coding was a gimmick until I tried EliteFolks. The latency is practically non-existent. It feels like the AI is reading my mind before I finish speaking."
                            </blockquote>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center">
                                        <i className="fas fa-user-circle text-2xl text-zinc-500"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white font-manrope">Sarah Jenkins</h4>
                                        <p className="text-xs text-zinc-500 font-sans">Frontend Lead, Vercel</p>
                                    </div>
                                </div>
                                <div className="text-zinc-500 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <i className="fas fa-bolt text-2xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Split Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">

                        {/* Card 3 */}
                        <div className="group hover:bg-zinc-900/60 transition-all duration-500 flex flex-col bg-zinc-900/40 rounded-[2.5rem] p-8 relative backdrop-blur-sm justify-between border border-white/5">
                            <div className="relative z-10">
                                <i className="fas fa-heart text-3xl text-zinc-700 mb-4"></i>
                                <p className="text-sm text-gray-300 font-sans leading-relaxed mb-6">
                                    "The accessibility features are game-changing. Being able to code entirely hands-free when my RSI flares up has saved my career."
                                </p>
                            </div>
                            <div className="relative z-10 flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center">
                                        <i className="fas fa-user text-2xl text-zinc-500"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white font-manrope">Alex Chen</h4>
                                        <p className="text-xs text-zinc-500 font-sans">Full Stack Dev</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 4 (Contrast) */}
                        <div className="group overflow-hidden flex flex-col bg-zinc-100 border-white/10 border rounded-[2.5rem] p-8 relative shadow-2xl justify-between">
                            <div className="relative z-10">
                                <i className="fas fa-star text-3xl text-zinc-400 mb-4"></i>
                                <p className="text-sm text-zinc-800 font-medium font-sans leading-relaxed mb-6">
                                    "EliteFolks's context awareness is unreal. It knows exactly which file I'm referencing without me explaining it."
                                </p>
                            </div>
                            <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-zinc-300">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-300 border border-zinc-400 overflow-hidden flex items-center justify-center">
                                        <i className="fas fa-user text-2xl text-zinc-600"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-zinc-900 font-manrope">Emily Davis</h4>
                                        <p className="text-xs text-zinc-500 font-sans">Senior Eng, Google</p>
                                    </div>
                                </div>
                                <div className="text-zinc-400 group-hover:text-zinc-900 transition-colors">
                                    <i className="fab fa-google text-xl"></i>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column: Big Card Carousel */}
                <div className="lg:col-span-5 carousel-container relative">

                    {/* Carousel Item 1 (Dev Speed) */}
                    <div className="carousel-card group flex flex-col hover:bg-zinc-900/60 transition-all duration-500 bg-zinc-900/40 rounded-[2.5rem] p-10 relative backdrop-blur-sm justify-between animate-carousel border border-white/5" style={{ animationDelay: '0s', opacity: 0 }}>
                        <div className="group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 rounded-[2.5rem] absolute top-0 right-0 bottom-0 left-0"></div>

                        <div className="relative z-10">
                            <div className="flex items-baseline gap-2 mb-4">
                                <h3 className="text-8xl font-semibold text-white tracking-tighter font-geist">
                                    10<span className="text-orange-500">x</span></h3>
                            </div>
                            <p className="text-xl font-medium text-zinc-300 border-l-2 border-orange-500 pl-4 mb-12">
                                Increase in development velocity for complex refactors.
                            </p>

                            <i className="fas fa-quote-left text-4xl text-zinc-700 mb-6"></i>

                            <blockquote className="text-lg text-gray-300 font-sans leading-relaxed mb-8">
                                "I refactored my entire legacy codebase in a weekend using EliteFolks. Describing the changes verbally is infinitely faster than typing them out manually."
                            </blockquote>
                        </div>

                        <div className="relative z-10 flex items-center justify-between pt-8 border-t border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center">
                                    <i className="fas fa-user-astronaut text-2xl text-zinc-500"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-white font-manrope">Marcus Neo</h4>
                                    <p className="text-xs text-zinc-500 font-sans">Indiehacker</p>
                                </div>
                            </div>
                            <div className="text-zinc-500 opacity-50 group-hover:opacity-100 transition-opacity">
                                <i className="fas fa-rocket text-2xl"></i>
                            </div>
                        </div>
                    </div>

                    {/* Carousel Item 2 (Accuracy) */}
                    <div className="carousel-card group flex flex-col hover:bg-zinc-900/60 transition-all duration-500 bg-zinc-900/40 rounded-[2.5rem] p-10 relative backdrop-blur-sm justify-between animate-carousel border border-white/5" style={{ animationDelay: '5s', opacity: 0 }}>
                        <div className="group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 rounded-[2.5rem] absolute top-0 right-0 bottom-0 left-0"></div>

                        <div className="relative z-10">
                            <div className="flex items-baseline gap-2 mb-4">
                                <h3 className="text-8xl font-semibold text-white tracking-tighter font-geist">
                                    99<span className="text-green-500">%</span></h3>
                            </div>
                            <p className="text-xl font-medium text-zinc-300 border-l-2 border-green-500 pl-4 mb-12">
                                Syntax accuracy rate on first-pass code generation.
                            </p>

                            <i className="fas fa-quote-left text-4xl text-zinc-700 mb-6"></i>

                            <blockquote className="text-lg text-gray-300 font-sans leading-relaxed mb-8">
                                "I was skeptical about voice dictation for code syntax. But it never misses a bracket. It's actually more accurate than my own typing."
                            </blockquote>
                        </div>

                        <div className="relative z-10 flex items-center justify-between pt-8 border-t border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center">
                                    <i className="fas fa-user-ninja text-2xl text-zinc-500"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-white font-manrope">Sarah Li</h4>
                                    <p className="text-xs text-zinc-500 font-sans">Open Source Maintainer</p>
                                </div>
                            </div>
                            <div className="text-zinc-500 opacity-50 group-hover:opacity-100 transition-opacity">
                                <i className="fas fa-check-circle text-2xl"></i>
                            </div>
                        </div>
                    </div>

                    {/* Carousel Item 3 (Health) */}
                    <div className="carousel-card group flex flex-col hover:bg-zinc-900/60 transition-all duration-500 bg-zinc-900/40 rounded-[2.5rem] p-10 relative backdrop-blur-sm justify-between animate-carousel border border-white/5" style={{ animationDelay: '10s', opacity: 0 }}>
                        <div className="group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 rounded-[2.5rem] absolute top-0 right-0 bottom-0 left-0"></div>

                        <div className="relative z-10">
                            <div className="flex items-baseline gap-2 mb-4">
                                <h3 className="text-8xl font-semibold text-white tracking-tighter font-geist">
                                    0<span className="text-blue-500 text-4xl align-top ml-1">RSI</span></h3>
                            </div>
                            <p className="text-xl font-medium text-zinc-300 border-l-2 border-blue-500 pl-4 mb-12">
                                Reported hand strain after switching to voice coding.
                            </p>

                            <i className="fas fa-quote-left text-4xl text-zinc-700 mb-6"></i>

                            <blockquote className="text-lg text-gray-300 font-sans leading-relaxed mb-8">
                                "EliteFolks isn't just a tool; it's a health-saver. I can code for 8 hours without touching the keyboard. My wrist pain is completely gone."
                            </blockquote>
                        </div>

                        <div className="relative z-10 flex items-center justify-between pt-8 border-t border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/10 overflow-hidden flex items-center justify-center">
                                    <i className="fas fa-user-md text-2xl text-zinc-500"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-white font-manrope">Dr. Arinze</h4>
                                    <p className="text-xs text-zinc-500 font-sans">DevOps Engineer</p>
                                </div>
                            </div>
                            <div className="text-zinc-500 opacity-50 group-hover:opacity-100 transition-opacity">
                                <i className="fas fa-heartbeat text-2xl"></i>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
