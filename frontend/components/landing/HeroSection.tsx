import React from 'react';
import Link from 'next/link';
import { StaticIcon } from '../../utils/courseIcons';

interface HeroSectionProps {
    enableAnimations?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ enableAnimations = true }) => {
    // Base class for animated elements - usually hidden initially if not animating
    const getAnimClass = (base: string, anim: string) => {
        return enableAnimations ? `${base} ${anim}` : `${base} opacity-0`;
    };

    return (
        <section className="min-h-screen flex flex-col md:pt-20 overflow-hidden w-full pt-32 relative items-center justify-center"
            style={{ maskImage: 'linear-gradient(180deg, transparent, black 0%, black 95%, transparent)', WebkitMaskImage: 'linear-gradient(180deg, transparent, black 0%, black 95%, transparent)' }}>

            {/* Background Effects */}
            <div className="absolute inset-0 -z-20">
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120%] h-[80%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-zinc-900/20 to-black"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            {/* Grid/Curtain Structure */}
            <div className="absolute inset-0 w-full h-full grid grid-cols-1 md:grid-cols-7 gap-0 -z-10 pointer-events-none">
                <div className={`relative h-full hidden md:block border-r border-white/5 delay-1 ${enableAnimations ? 'col-anim' : 'opacity-0'}`}>
                    <div className="absolute bottom-0 left-0 right-0 bg-black h-[75%] border-t border-white/10 shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.8)]"></div>
                </div>
                <div className={`relative h-full hidden md:block border-r border-white/5 delay-2 ${enableAnimations ? 'col-anim' : 'opacity-0'}`}>
                    <div className="absolute bottom-0 left-0 right-0 bg-black h-[65%] border-t border-white/10 shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.8)]"></div>
                </div>
                <div className={`relative h-full hidden md:block border-r border-white/5 delay-3 ${enableAnimations ? 'col-anim' : 'opacity-0'}`}>
                    <div className="absolute bottom-0 left-0 right-0 bg-black h-[55%] border-t border-white/10 shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.8)]"></div>
                </div>
                <div className={`relative h-full border-r border-white/5 md:border-none delay-4 ${enableAnimations ? 'col-anim' : 'opacity-0'}`}>
                    <div className="absolute bottom-0 left-0 right-0 bg-black h-[45%] border-t border-white/10 shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.8)]"></div>
                    <div className="absolute top-[20%] left-0 right-0 h-[30%] bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                </div>
                <div className={`relative h-full hidden md:block border-l border-white/5 delay-5 ${enableAnimations ? 'col-anim' : 'opacity-0'}`}>
                    <div className="absolute bottom-0 left-0 right-0 bg-black h-[55%] border-t border-white/10 shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.8)]"></div>
                </div>
                <div className={`relative h-full hidden md:block border-l border-white/5 delay-6 ${enableAnimations ? 'col-anim' : 'opacity-0'}`}>
                    <div className="absolute bottom-0 left-0 right-0 bg-black h-[65%] border-t border-white/10 shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.8)]"></div>
                </div>
                <div className={`relative h-full hidden md:block border-l border-white/5 delay-7 ${enableAnimations ? 'col-anim' : 'opacity-0'}`}>
                    <div className="absolute bottom-0 left-0 right-0 bg-black h-[75%] border-t border-white/10 shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.8)]"></div>
                </div>
            </div>

            {/* Content Container */}
            <div className="text-center max-w-5xl z-10 mt-24 mr-auto mb-24 ml-auto pr-6 pl-6 relative">

                {/* Badge */}
                <div className={getAnimClass("animate-on-scroll inline-flex transition-transform hover:scale-105 cursor-pointer group animate bg-gradient-to-br from-white/10 to-white/0 rounded-full mb-10 pt-1.5 pr-3 pb-1.5 pl-3 backdrop-blur-sm gap-x-2 gap-y-2 items-center", "[animation:fadeSlideIn_1s_ease-out_0.8s_both]")}
                    style={{ position: 'relative', '--border-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.1))', '--border-radius-before': '9999px' } as React.CSSProperties}
                    suppressHydrationWarning>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-[#F97316] shadow-[0_0_10px_rgba(249,115,22,0.5)] group-hover:animate-pulse"></span>
                    <span className="text-xs font-medium text-gray-300 tracking-wide group-hover:text-white transition-colors font-sans">AI-Powered Coding Assistant v1.0</span>
                </div>

                {/* Heading */}
                <h1 className={getAnimClass("animate-on-scroll animate flex flex-wrap justify-center gap-x-[0.25em] gap-y-2 leading-[1.1] md:text-8xl cursor-default text-6xl font-medium tracking-tighter font-manrope mb-8", "[animation:fadeSlideIn_1s_ease-out_1s_both]")}>
                    <span className="inline-flex bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 opacity-60">Master</span>

                    <span className="group inline-flex flex-wrap justify-center gap-x-[0.25em] cursor-pointer select-none">
                        {/* Word: code */}
                        <span className="inline-flex">
                            {['c', 'o', 'd', 'e'].map((char, i) => (
                                <span key={i} className="relative inline-block overflow-hidden h-[1.1em]">
                                    <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50" style={{ transitionDelay: `${i * 25}ms` }}>{char}</span>
                                    <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 text-[#F97316] absolute top-0 left-0 translate-y-full" style={{ transitionDelay: `${i * 25}ms` }}>{char}</span>
                                </span>
                            ))}
                        </span>
                    </span>

                    <span className="inline-flex bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 opacity-60">with</span>
                    <span className="inline-flex bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 opacity-60">your</span>
                    <span className="inline-flex bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50 opacity-60">voice</span>
                </h1>

                {/* Subtext */}
                <p className={getAnimClass("animate-on-scroll leading-relaxed md:text-2xl text-xl text-gray-400 tracking-normal max-w-3xl mr-auto mb-12 ml-auto animate font-manrope font-medium", "[animation:fadeSlideIn_1s_ease-out_1.2s_both]")}>
                    The conversational coding companion. From explaining complex concepts to real-time debugging, learn faster by talking to your code.
                </p>

                {/* Animated Shiny CTA Button */}
                <div className={getAnimClass("animate-on-scroll flex flex-col md:flex-row items-center justify-center gap-6 mb-12 animate", "[animation:fadeSlideIn_1s_ease-out_1.4s_both]")}>
                    <Link href="/onboarding" className="group flex overflow-hidden uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.5)] focus:outline-none text-sm font-medium text-white tracking-widest font-geist rounded-full pt-5 pr-12 pb-5 pl-12 relative items-center justify-center">
                        {/* Full Border Beam */}
                        <div className="absolute inset-0 -z-20 rounded-full overflow-hidden p-[1px]">
                            <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#F97316_360deg)]" style={{ animation: 'beam-spin 3s linear infinite' }}></div>
                            <div className="absolute inset-[1px] rounded-full bg-black"></div>
                        </div>

                        {/* Inner Background & Effects */}
                        <div className="-z-10 overflow-hidden bg-zinc-950 rounded-full absolute top-[2px] right-[2px] bottom-[2px] left-[2px]">
                            <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/60 to-transparent"></div>
                            <div className="opacity-30 mix-blend-overlay absolute top-0 right-0 bottom-0 left-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '12px 12px', animation: 'dots-move 8s linear infinite' }} suppressHydrationWarning></div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-[#F97316]/10 blur-2xl rounded-full pointer-events-none transition-colors duration-500 group-hover:bg-[#F97316]/30"></div>
                        </div>

                        {/* Content */}
                        <span className="relative z-10 text-white/90 transition-colors group-hover:text-white font-sans">Start your elite journey</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right relative z-10 ml-2 transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </Link>
                </div>

                {/* Secondary Link */}
                <div className={getAnimClass("animate-on-scroll flex flex-col animate mt-32 mb-20 gap-x-4 gap-y-4 items-center", "[animation:fadeSlideIn_1s_ease-out_1.6s_both]")}>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest font-sans">Trusted by modern developers</p>
                    <Link href="/courses" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white border-b border-transparent hover:border-white transition-all pb-0.5 group font-sans">
                        See the curriculum
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </Link>
                </div>
            </div>

            {/* Logos Footer */}
            <div className={getAnimClass("animate-on-scroll relative z-20 w-full max-w-6xl mx-auto px-6 pb-12 md:pb-20 animate", "[animation:fadeSlideIn_1s_ease-out_1.8s_both]")}>
                <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] opacity-40 grayscale hover:grayscale-0 transition-all duration-700 group">
                    <div className="flex items-center justify-center md:justify-start [&_div]:mx-8 w-max animate-infinite-scroll">
                        <div className="group flex items-center gap-2">
                            <StaticIcon icon="simple-icons:javascript" className="text-3xl text-white" />
                            <span className="font-medium text-lg text-white font-sans">JavaScript</span>
                        </div>
                        <div className="group flex items-center gap-2">
                            <StaticIcon icon="simple-icons:python" className="text-3xl text-white" />
                            <span className="font-medium text-lg text-white font-sans">Python</span>
                        </div>
                        <div className="group flex items-center gap-2">
                            <StaticIcon icon="simple-icons:go" className="text-3xl text-white" />
                            <span className="font-medium text-lg text-white font-sans">Go</span>
                        </div>
                        <div className="group flex items-center gap-2">
                            <StaticIcon icon="simple-icons:cplusplus" className="text-3xl text-white" />
                            <span className="font-medium text-lg text-white font-sans">C++</span>
                        </div>
                        <div className="group flex items-center gap-2">
                            <StaticIcon icon="fontisto:java" className="text-3xl text-white" />
                            <span className="font-medium text-lg text-white font-sans">Java</span>
                        </div>
                        <div className="group flex items-center gap-2">
                            <StaticIcon icon="simple-icons:typescript" className="text-3xl text-white" />
                            <span className="font-medium text-lg text-white font-sans">TypeScript</span>
                        </div>

                        {/* Duplicate Items */}
                        <div className="group flex items-center gap-2">
                            <StaticIcon icon="simple-icons:javascript" className="text-3xl text-white" />
                            <span className="font-medium text-lg text-white font-sans">JavaScript</span>
                        </div>
                        <div className="group flex items-center gap-2">
                            <StaticIcon icon="simple-icons:python" className="text-3xl text-white" />
                            <span className="font-medium text-lg text-white font-sans">Python</span>
                        </div>
                        <div className="group flex items-center gap-2">
                            <StaticIcon icon="simple-icons:go" className="text-3xl text-white" />
                            <span className="font-medium text-lg text-white font-sans">Go</span>
                        </div>
                        <div className="group flex items-center gap-2">
                            <StaticIcon icon="simple-icons:cplusplus" className="text-3xl text-white" />
                            <span className="font-medium text-lg text-white font-sans">C++</span>
                        </div>
                        <div className="group flex items-center gap-2">
                            <StaticIcon icon="fontisto:java" className="text-3xl text-white" />
                            <span className="font-medium text-lg text-white font-sans">Java</span>
                        </div>
                        <div className="group flex items-center gap-2">
                            <StaticIcon icon="simple-icons:typescript" className="text-3xl text-white" />
                            <span className="font-medium text-lg text-white font-sans">TypeScript</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;


