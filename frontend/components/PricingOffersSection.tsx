"use client";

import React from 'react';
import Link from 'next/link';
import { OffersParticles } from './OffersParticles';

export function PricingOffersSection() {
    return (
        <section className="relative w-full min-h-screen flex flex-col md:flex-row overflow-hidden bg-black border-t border-border/20 z-10">
            {/* Offer 1: Learners (Courses) */}
            <div className="flex-1 relative group bg-zinc-950/20 p-12 lg:p-24 flex flex-col items-center justify-center text-center overflow-hidden transition-colors hover:bg-zinc-900/30">
                {/* 3D Canvas Background */}
                <OffersParticles shape="bracket" color="#f97316" />

                <div className="relative z-10 w-full flex flex-col items-center pointer-events-none">
                    <span className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-foreground mb-4 border border-border/30 px-3 py-1 rounded-full bg-background/50 backdrop-blur-md">
                        Learn by doing
                    </span>

                    <h3 className="text-3xl md:text-5xl tracking-tight text-white mb-2 font-sans font-medium">
                        Courses
                    </h3>
                    <p className="font-sans text-sm text-muted-foreground mb-12">
                        Master the fundamentals
                    </p>

                    {/* Empty space to let dots be visible */}
                    <div className="w-full h-48 mb-8"></div>

                    <Link href="/courses" className="pointer-events-auto inline-flex items-center justify-center font-mono text-xs uppercase tracking-[0.2em] bg-white text-black hover:bg-zinc-200 px-10 py-4 transition-all duration-300 w-full max-w-[240px] rounded-full shadow-xl shadow-orange-500/10">
                        Explore Courses
                    </Link>
                </div>
            </div>

            {/* Offer 2: Arena (Competitive) */}
            <div className="flex-1 relative group bg-zinc-950/20 p-12 lg:p-24 flex flex-col items-center justify-center text-center overflow-hidden transition-colors hover:bg-zinc-900/30 border-t md:border-t-0 md:border-l border-border/10">
                {/* 3D Canvas Background */}
                <OffersParticles shape="circles" color="#ef4444" />

                <div className="relative z-10 w-full flex flex-col items-center pointer-events-none">
                    <span className="inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-foreground mb-4 border border-border/30 px-3 py-1 rounded-full bg-background/50 backdrop-blur-md">
                        The ultimate test
                    </span>

                    <h3 className="text-3xl md:text-5xl tracking-tight text-white mb-2 font-sans font-medium">
                        1v1 Arena
                    </h3>
                    <p className="font-sans text-sm text-muted-foreground mb-12">
                        Prove your skills in real-time
                    </p>

                    {/* Empty space to let dots be visible */}
                    <div className="w-full h-48 mb-8"></div>

                    <Link href="/training" className="pointer-events-auto inline-flex items-center justify-center font-mono text-xs uppercase tracking-[0.2em] bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/40 px-10 py-4 transition-all duration-300 w-full max-w-[240px] rounded-full shadow-lg">
                        Enter Arena
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default PricingOffersSection;
