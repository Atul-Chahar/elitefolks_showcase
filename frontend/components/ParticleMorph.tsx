import React from 'react';

export function ParticleMorphHero() {
    return (
        <div className="relative w-full overflow-hidden flex flex-col items-center justify-center py-32 border-b border-border/20 z-10">
            <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/10 bg-orange-500/5 mb-6">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-orange-500 animate-[pulse_2s_ease-in-out_infinite]"></span>
                    <span className="text-[10px] font-semibold text-orange-200 uppercase tracking-widest font-mono">Platform Evolution</span>
                </div>

                <h1 className="text-5xl md:text-7xl tracking-tight mb-8" style={{ fontFamily: 'var(--font-bebas)' }}>
                    MASTER THE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">ELEMENTS OF CODE</span>
                </h1>

                <p className="mt-8 font-mono text-sm text-muted-foreground max-w-md mx-auto px-6">
                    Experience a fluid journey from raw algorithms to podium mastery. We've redesigned our entire infrastructure to serve your growth.
                </p>
            </div>
        </div>
    );
}

export default ParticleMorphHero;
