import React from 'react';

interface AuthBrace3DProps {
    side: 'left' | 'right';
}

const AuthBrace3D: React.FC<AuthBrace3DProps> = ({ side }) => {
    // Number of layers for the extrusion effect - customized for thickness
    const layers = 28;
    const char = side === 'left' ? '{' : '}';

    // Offset for floating animation variety
    const animationDelay = side === 'left' ? '0s' : '-3s';

    return (
        <div
            className="select-none pointer-events-none absolute top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center p-12"
            style={{
                zIndex: 5,
                perspective: '1000px',
                [side === 'left' ? 'right' : 'left']: 'calc(50% + 280px)', // Gap from center
            }}
        >
            <div
                className="relative preserve-3d"
                style={{
                    animation: `brace-float-3d 8s ease-in-out infinite alternate ${animationDelay}`,
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* 
                  3D Volumetric Stack 
                  Layers 0 to N-1 are the "body" of the extrusion (darker)
                  The last layer is the "face" (brighter)
                */}
                {Array.from({ length: layers }).map((_, index) => {
                    const isFace = index === layers - 1;
                    const zOffset = index * 2; // 2px per layer for thickness

                    return (
                        <span
                            key={index}
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                                ${isFace ? 'text-[#ea580c] drop-shadow-[0_0_15px_rgba(234,88,12,0.6)]' : 'text-[#9a3412]'}`}
                            style={{
                                fontFamily: 'var(--font-outfit), sans-serif',
                                fontSize: 'min(35vw, 600px)', // Massive responsive size
                                lineHeight: 1,
                                fontWeight: 900,
                                transform: `translateZ(${zOffset}px)`,
                                textShadow: isFace ? 'none' : '1px 1px 2px rgba(0,0,0,0.3)', // Subtle shadow for depth
                            }}
                        >
                            {char}
                        </span>
                    );
                })}
            </div>


        </div>
    );
};

export default AuthBrace3D;
