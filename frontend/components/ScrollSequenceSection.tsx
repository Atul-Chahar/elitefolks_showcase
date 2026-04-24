"use client";

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollSequenceSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const panel1Ref = useRef<HTMLDivElement>(null);
    const panel2Ref = useRef<HTMLDivElement>(null);
    const panel3Ref = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            const panels = [panel1Ref.current, panel2Ref.current, panel3Ref.current];

            panels.forEach((panel, index) => {
                if (!panel) return;

                gsap.from(panel, {
                    y: 100, // Slide up
                    opacity: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: panel,
                        start: "top 80%", // Trigger when top of panel hits 80% down viewport
                        toggleActions: "play none none reverse",
                    },
                });
            });

            // Parallax the background wrapper slightly
            if (backgroundRef.current) {
                gsap.to(backgroundRef.current, {
                    y: "15%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    }
                });
            }

            // Move the grid lines slowly to simulate "moving forward"
            if (gridRef.current) {
                gsap.to(gridRef.current, {
                    y: "100px",
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1,
                    }
                });
            }

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden flex flex-col items-center justify-center space-y-48 py-32 bg-black border-y border-border/10">

            {/* Premium Animated Background */}
            <div ref={backgroundRef} className="absolute inset-0 w-full h-[150%] -top-[25%] z-0 pointer-events-none select-none overflow-hidden">
                {/* High-visibility Neon Orbs */}
                <div className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] max-w-[1200px] max-h-[1200px] bg-orange-500/30 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-1/4 right-1/4 w-[60vw] h-[60vw] max-w-[1200px] max-h-[1200px] bg-blue-500/30 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[1000px] max-h-[1000px] bg-indigo-500/20 rounded-full blur-[150px] mix-blend-screen" />

                {/* 3D Perspective CSS Grid */}
                <div className="absolute inset-0 [perspective:1000px] flex items-center justify-center">
                    <div
                        ref={gridRef}
                        className="absolute left-1/2 -translate-x-1/2 -top-[50%] w-[400vw] h-[400vh] [transform:rotateX(60deg)_translateY(-10%)] bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_50%,#000_70%,transparent_100%)]"
                    />
                </div>

                {/* Floating Abstract Code Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 font-mono text-white/20 select-none hidden md:block">
                    {/* Left Side Additions */}
                    <div className="absolute top-[35%] left-[5%] text-xl -rotate-12 backdrop-blur-sm px-4 py-2 rounded-lg bg-emerald-500/[0.02] border border-emerald-500/[0.05] shadow-[0_0_15px_rgba(16,185,129,0.1)]">while(true)</div>
                    <div className="absolute bottom-[20%] left-[8%] text-sm px-3 py-1 rounded-md bg-white/[0.02] border border-white/[0.05] shadow-sm rotate-6">const x = 1;</div>
                    <div className="absolute top-[65%] left-[25%] text-2xl font-bold bg-gradient-to-r from-purple-500/20 to-blue-500/20 bg-clip-text text-transparent px-4 py-2 border border-white/[0.02] rounded-lg -rotate-3">await fetch()</div>

                    {/* Original Elements */}
                    <div className="absolute top-[15%] left-[10%] text-xl backdrop-blur-sm px-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05] shadow-[0_0_15px_rgba(255,255,255,0.05)] animate-pulse">&lt;logic /&gt;</div>
                    <div className="absolute top-[45%] right-[15%] text-2xl rotate-12 backdrop-blur-sm px-4 py-2 rounded-lg bg-blue-500/[0.02] border border-blue-500/[0.05] shadow-[0_0_20px_rgba(59,130,246,0.1)]">O(log n)</div>
                    <div className="absolute bottom-[25%] right-[10%] text-3xl font-bold -rotate-6 backdrop-blur-sm px-6 py-3 rounded-lg bg-orange-500/[0.02] border border-orange-500/[0.05] shadow-[0_0_20px_rgba(249,115,22,0.1)] opacity-70">{`{ }`}</div>
                    <div className="absolute top-[75%] right-[25%] text-xl backdrop-blur-sm px-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05] shadow-[0_0_15px_rgba(255,255,255,0.05)] flex items-center justify-center motion-safe:animate-bounce">[0, 1]</div>
                    <div className="absolute top-[30%] left-[75%] text-lg -rotate-12 backdrop-blur-sm px-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05] shadow-[0_0_15px_rgba(255,255,255,0.05)]">function main()</div>
                </div>
            </div>

            {/* Content Panels */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center space-y-48">
                {/* Panel 1: The Problem */}
                <div ref={panel1Ref} className="flex flex-col items-center justify-center text-center px-6">
                    <span className="font-mono text-sm uppercase tracking-[0.3em] text-orange-500 mb-6 border border-orange-500/20 px-4 py-1 rounded-full bg-orange-500/10 backdrop-blur-md">The Old Way</span>
                    <h2 className="text-4xl md:text-7xl tracking-tight text-white mb-6" style={{ fontFamily: 'var(--font-bebas)' }}>
                        WATCHING TUTORIALS <br /> WONT MAKE YOU A <br /> <span className="text-zinc-600">GREAT DEVELOPER.</span>
                    </h2>
                    <p className="max-w-xl mx-auto font-mono text-sm text-zinc-400">
                        The industry is saturated with passive video courses. You don't need another 10-hour video. You need an environment where you are forced to think, fail, and optimize in real-time.
                    </p>
                </div>

                {/* Panel 2: The Solution (Logic Building) */}
                <div ref={panel2Ref} className="flex flex-col items-center justify-center text-center px-6">
                    <span className="font-mono text-sm uppercase tracking-[0.3em] text-blue-500 mb-6 border border-blue-500/20 px-4 py-1 rounded-full bg-blue-500/10 backdrop-blur-md">The EliteFolks Way</span>
                    <h2 className="text-4xl md:text-7xl tracking-tight text-white mb-6" style={{ fontFamily: 'var(--font-bebas)' }}>
                        START WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">LOGIC</span>. <br /> NOT JUST SYNTAX.
                    </h2>
                    <p className="max-w-xl mx-auto font-mono text-sm text-zinc-400 mb-12">
                        Before you write a single line of Python or C++, master the underlying structural algorithms in our visual logic playground. Build the mental models that top tech companies test for.
                    </p>
                </div>

                {/* Panel 3: The Result (1v1 Arena) */}
                <div ref={panel3Ref} className="flex flex-col items-center justify-center text-center px-6">
                    <span className="font-mono text-sm uppercase tracking-[0.3em] text-red-500 mb-6 border border-red-500/20 px-4 py-1 rounded-full bg-red-500/10 backdrop-blur-md">The Ultimate Test</span>
                    <h2 className="text-4xl md:text-7xl tracking-tight text-white mb-6" style={{ fontFamily: 'var(--font-bebas)' }}>
                        PROVE IT IN THE <br /> <span className="text-red-500">1v1 ARENA.</span>
                    </h2>
                    <p className="max-w-xl mx-auto font-mono text-sm text-zinc-400 mb-10">
                        Take your refined logic and go head-to-head. Compete globally against peers or AI in highly optimized, low-latency live coding environments. Rise the ranks.
                    </p>
                    <a href="/login" className="px-10 py-4 border border-white/20 bg-background/50 backdrop-blur-md text-white font-mono uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-colors">
                        Claim Your Username
                    </a>
                </div>
            </div>

        </section>
    );
}

export default ScrollSequenceSection;
