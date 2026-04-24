'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
    const { user } = useAuth();
    const currentYear = new Date().getFullYear();
    const brandName = "ELITEFOLKS";
    const pathname = usePathname();
    const sectionRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            if (gridRef.current) {
                const columns = gridRef.current.querySelectorAll(":scope > div");
                gsap.from(columns, {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                });
            }

            if (bottomRef.current) {
                gsap.from(bottomRef.current, {
                    y: 20,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: bottomRef.current,
                        start: "top 95%",
                        toggleActions: "play none none reverse",
                    },
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <footer ref={sectionRef} className="relative w-full mt-32 pt-24 pb-12 overflow-hidden border-t border-border/10 bg-transparent">
            {/* 1. Background Gradient Overlay */}
            <div className="absolute inset-0 bg-transparent pointer-events-none z-0" />



            {/* 3. Ambient Orbs */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="absolute bottom-20 left-20 w-[300px] h-[300px] bg-emerald-600/5 blur-[100px] rounded-full pointer-events-none z-0" />

            <div className="w-full px-6 md:px-12 z-10 relative">

                {/* Top Section: CTA & Links */}
                <div className="flex flex-col lg:flex-row justify-between items-start mb-24 lg:mb-32">
                    {/* Tagline / CTA (incorporating Loss Aversion & Social Proof) */}
                    <div className="mb-16 lg:mb-0 max-w-lg">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/10 bg-orange-500/5 backdrop-blur-md mb-6">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                            <span className="text-[10px] font-semibold text-orange-200 uppercase tracking-widest font-sans">Ready for the future?</span>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-[var(--font-bebas)] tracking-tight leading-tight mb-4 text-white">
                            DON'T FALL BEHIND. <br />
                            <span className="text-zinc-500">START COMPILING <span className="text-orange-500">TODAY</span>.</span>
                        </h3>
                        <p className="text-muted-foreground font-mono text-xs max-w-md leading-relaxed mb-8">
                            Join a community of developers shipping code faster. Immediate access to our interactive AI training arena. Zero friction.
                        </p>
                        <Link
                            href={user ? "/training" : "/signup"}
                            onClick={(e) => {
                                if (pathname === '/training' && user) {
                                    e.preventDefault();
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }}
                            className="inline-flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] bg-foreground text-background hover:bg-accent hover:text-white px-8 py-3 transition-all duration-300"
                        >
                            Enter Arena Free
                        </Link>
                    </div>

                    {/* Navigation Columns - Merged Editorial Style */}
                    <div ref={gridRef} className="w-full lg:w-auto grid grid-cols-2 md:grid-cols-4 gap-x-12 lg:gap-x-16 gap-y-12">
                        {/* Platform */}
                        <div className="flex flex-col gap-4">
                            <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Platform</h4>
                            <Link href="/dashboard" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors">Dashboard</Link>
                            <Link href="/training" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors">Training</Link>
                            <Link href="/courses" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors">Courses</Link>
                            <Link href="/compiler" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors">Compiler</Link>
                        </div>

                        {/* Resources */}
                        <div className="flex flex-col gap-4">
                            <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Resources</h4>
                            <Link href="/documentation" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors">Documentation</Link>
                            <Link href="/community" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors">Community</Link>
                            <Link href="/pricing" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors">Pricing</Link>
                        </div>

                        {/* Compilers */}
                        <div className="flex flex-col gap-4">
                            <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Compilers</h4>
                            <Link href="/compiler/python" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors">Python</Link>
                            <Link href="/compiler/javascript" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors">JavaScript</Link>
                            <Link href="/compiler/typescript" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors">TypeScript</Link>
                            <Link href="/compiler/cpp" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors">C++</Link>
                        </div>

                        {/* Socials & Support */}
                        <div className="flex flex-col gap-4">
                            <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Connect</h4>
                            <a href="mailto:support@elitefolks.com" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors">Email</a>
                            <a href="https://twitter.com/elitefolks" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors">Twitter/X</a>
                            <a href="https://github.com/Atul-Chahar/EliteFolks" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors">GitHub</a>
                        </div>
                    </div>
                </div>

                {/* MASSIVE BRAND TEXT - From old Footer */}
                <div className="w-full border-t border-white/5 pt-10 md:pt-16 pb-10 md:pb-16 flex justify-between items-center select-none overflow-hidden px-2 relative group mt-12">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1/2 bg-gradient-to-b from-orange-500/0 via-orange-500/5 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    {brandName.split('').map((char, index) => (
                        <span
                            key={index}
                            className="text-[11vw] sm:text-[11vw] leading-none font-bold tracking-tighter text-zinc-800/50 group-hover:text-white transition-colors duration-700 cursor-default transform group-hover:scale-105 origin-center relative z-10 mix-blend-overlay font-[var(--font-bebas)]"
                        >
                            {char}
                        </span>
                    ))}
                </div>

                {/* Bottom Bar: Logo & Legal - Editorial Style */}
                <div ref={bottomRef} className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border/20">
                    {/* Brand/Copyright */}
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                            © {currentYear} EliteFolks. All rights reserved.
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground hidden md:block">
                            Train AI, Build Code, Learn Faster.
                        </p>
                    </div>

                    {/* Legal Links */}
                    <div className="flex gap-8">
                        {['About', 'Privacy', 'Terms'].map((item) => (
                            <Link key={item} href={`/${item.toLowerCase()}`} className="text-muted-foreground hover:text-foreground text-[10px] transition-colors font-mono uppercase tracking-widest">{item}</Link>
                        ))}
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
