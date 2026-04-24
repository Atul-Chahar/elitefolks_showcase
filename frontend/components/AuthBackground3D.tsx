'use client';

import React, { useEffect, useRef } from 'react';

/* ─────────────────────────── tiny particle canvas ─────────────────────────── */
const ParticleCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        const particles: {
            x: number; y: number; r: number;
            vx: number; vy: number;
            alpha: number; twinkleSpeed: number; twinkleOffset: number;
        }[] = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Create particles
        const COUNT = 60;
        for (let i = 0; i < COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.8 + 0.4,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                alpha: Math.random() * 0.6 + 0.1,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinkleOffset: Math.random() * Math.PI * 2,
            });
        }

        let t = 0;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            t += 1;

            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;

                // wrap edges
                if (p.x < -5) p.x = canvas.width + 5;
                if (p.x > canvas.width + 5) p.x = -5;
                if (p.y < -5) p.y = canvas.height + 5;
                if (p.y > canvas.height + 5) p.y = -5;

                const twinkle = Math.sin(t * p.twinkleSpeed + p.twinkleOffset) * 0.5 + 0.5;
                const a = p.alpha * twinkle;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(251, 146, 60, ${a})`;
                ctx.fill();

                // tiny glow
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
                const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
                g.addColorStop(0, `rgba(234, 88, 12, ${a * 0.3})`);
                g.addColorStop(1, 'rgba(234, 88, 12, 0)');
                ctx.fillStyle = g;
                ctx.fill();
            }

            animationId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
        />
    );
};

/* ────────────────────── floating 3‑D shapes (pure CSS) ────────────────────── */
const shapes = [
    // Hexagons
    { type: 'hexagon', size: 60, x: '10%', y: '15%', delay: '0s', duration: '18s', color: 'rgba(234, 88, 12, 0.12)' },
    { type: 'hexagon', size: 40, x: '85%', y: '20%', delay: '3s', duration: '22s', color: 'rgba(251, 146, 60, 0.10)' },
    { type: 'hexagon', size: 50, x: '75%', y: '75%', delay: '8s', duration: '20s', color: 'rgba(234, 88, 12, 0.08)' },
    // Cubes
    { type: 'cube', size: 35, x: '20%', y: '70%', delay: '2s', duration: '24s', color: 'rgba(251, 146, 60, 0.10)' },
    { type: 'cube', size: 28, x: '90%', y: '50%', delay: '5s', duration: '19s', color: 'rgba(234, 88, 12, 0.08)' },
    // Brackets (code symbol)
    { type: 'bracket', size: 44, x: '50%', y: '10%', delay: '1s', duration: '21s', color: 'rgba(251, 146, 60, 0.14)' },
    { type: 'bracket', size: 36, x: '30%', y: '85%', delay: '6s', duration: '25s', color: 'rgba(234, 88, 12, 0.10)' },
    // Triangles
    { type: 'triangle', size: 45, x: '65%', y: '40%', delay: '4s', duration: '23s', color: 'rgba(251, 146, 60, 0.07)' },
    { type: 'triangle', size: 30, x: '8%', y: '50%', delay: '7s', duration: '17s', color: 'rgba(234, 88, 12, 0.09)' },
    // Rings
    { type: 'ring', size: 55, x: '45%', y: '80%', delay: '9s', duration: '26s', color: 'rgba(251, 146, 60, 0.08)' },
    { type: 'ring', size: 38, x: '15%', y: '35%', delay: '11s', duration: '20s', color: 'rgba(234, 88, 12, 0.06)' },
];

const ShapeElement: React.FC<(typeof shapes)[0]> = ({ type, size, x, y, delay, duration, color }) => {
    const style: React.CSSProperties = {
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        animationDelay: delay,
        animationDuration: duration,
    };

    if (type === 'hexagon') {
        return (
            <div className="auth-shape auth-shape-float" style={style}>
                <svg viewBox="0 0 100 100" width={size} height={size}>
                    <polygon
                        points="50,2 93,25 93,75 50,98 7,75 7,25"
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                    />
                </svg>
            </div>
        );
    }

    if (type === 'cube') {
        return (
            <div className="auth-shape auth-shape-float" style={{ ...style, perspective: '200px' }}>
                <div
                    className="auth-cube-inner"
                    style={{
                        width: size,
                        height: size,
                        transformStyle: 'preserve-3d',
                        animationDelay: delay,
                        animationDuration: duration,
                    }}
                >
                    {/* Front */}
                    <div style={{
                        position: 'absolute', width: size, height: size,
                        border: `1.5px solid ${color}`,
                        transform: `translateZ(${size / 2}px)`,
                        background: color.replace(/[\d.]+\)$/, '0.03)'),
                    }} />
                    {/* Back */}
                    <div style={{
                        position: 'absolute', width: size, height: size,
                        border: `1.5px solid ${color}`,
                        transform: `translateZ(-${size / 2}px) rotateY(180deg)`,
                        background: color.replace(/[\d.]+\)$/, '0.02)'),
                    }} />
                    {/* Left */}
                    <div style={{
                        position: 'absolute', width: size, height: size,
                        border: `1.5px solid ${color}`,
                        transform: `rotateY(-90deg) translateZ(${size / 2}px)`,
                        background: color.replace(/[\d.]+\)$/, '0.02)'),
                    }} />
                    {/* Right */}
                    <div style={{
                        position: 'absolute', width: size, height: size,
                        border: `1.5px solid ${color}`,
                        transform: `rotateY(90deg) translateZ(${size / 2}px)`,
                        background: color.replace(/[\d.]+\)$/, '0.02)'),
                    }} />
                </div>
            </div>
        );
    }

    if (type === 'bracket') {
        return (
            <div className="auth-shape auth-shape-float" style={style}>
                <svg viewBox="0 0 60 80" width={size * 0.75} height={size}>
                    <text
                        x="50%" y="50%"
                        dominantBaseline="central"
                        textAnchor="middle"
                        fill={color}
                        fontSize="56"
                        fontFamily="'JetBrains Mono', monospace"
                        fontWeight="300"
                    >
                        {'{ }'}
                    </text>
                </svg>
            </div>
        );
    }

    if (type === 'triangle') {
        return (
            <div className="auth-shape auth-shape-float" style={style}>
                <svg viewBox="0 0 100 100" width={size} height={size}>
                    <polygon
                        points="50,5 95,90 5,90"
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                    />
                </svg>
            </div>
        );
    }

    if (type === 'ring') {
        return (
            <div className="auth-shape auth-shape-float" style={style}>
                <svg viewBox="0 0 100 100" width={size} height={size}>
                    <circle
                        cx="50" cy="50" r="42"
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeDasharray="8 6"
                    />
                </svg>
            </div>
        );
    }

    return null;
};

/* ─────────────────────────── main background comp ─────────────────────────── */
const AuthBackground3D: React.FC = () => {
    return (
        <div className="auth-bg-wrapper" aria-hidden="true">
            {/* Base gradient */}
            <div className="absolute inset-0" style={{
                background: `
                    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(234, 88, 12, 0.08) 0%, transparent 60%),
                    radial-gradient(ellipse 60% 50% at 20% 80%, rgba(251, 146, 60, 0.05) 0%, transparent 50%),
                    radial-gradient(ellipse 50% 40% at 80% 60%, rgba(234, 88, 12, 0.04) 0%, transparent 50%),
                    #000000
                `,
                zIndex: 0,
            }} />

            {/* Perspective grid floor */}
            <div className="auth-grid-floor" />

            {/* Glowing orbs */}
            <div className="auth-orb auth-orb-1" />
            <div className="auth-orb auth-orb-2" />
            <div className="auth-orb auth-orb-3" />

            {/* Particle canvas */}
            <ParticleCanvas />

            {/* Floating 3D shapes */}
            {shapes.map((s, i) => (
                <ShapeElement key={i} {...s} />
            ))}

            {/* Top/bottom vignette */}
            <div className="absolute inset-0 pointer-events-none" style={{
                background: `
                    linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.7) 100%)
                `,
                zIndex: 5,
            }} />
        </div>
    );
};

export default AuthBackground3D;
