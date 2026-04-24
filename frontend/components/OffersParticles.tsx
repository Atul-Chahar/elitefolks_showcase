"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';

const PARTICLE_COUNT = 1500;

// Generate `{ }` Brackets
const bracketPositions = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
    const isLeft = Math.random() > 0.5;
    const sign = isLeft ? -1 : 1;
    const y = (Math.random() - 0.5) * 6;

    let xOffset = 1.5 * sign;

    // Tips bend inward towards center
    if (Math.abs(y) > 2) {
        xOffset -= (Math.abs(y) - 2) * 0.5 * sign;
    }
    // Middle bends outward away from center
    if (Math.abs(y) < 0.5) {
        xOffset += (0.5 - Math.abs(y)) * sign;
    }

    const noiseX = (Math.random() - 0.5) * 0.4;
    const noiseY = (Math.random() - 0.5) * 0.4;
    const noiseZ = (Math.random() - 0.5) * 0.4;

    bracketPositions[i * 3] = xOffset + noiseX;
    bracketPositions[i * 3 + 1] = y + noiseY;
    bracketPositions[i * 3 + 2] = noiseZ;
}

// Generate Ring of Circles
const circlesPositions = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
    // 6 circles
    const circleIndex = Math.floor(Math.random() * 6);
    const angleOffset = (circleIndex / 6) * Math.PI * 2;

    // Position of the circle center
    const cx = Math.cos(angleOffset) * 2.5;
    const cy = Math.sin(angleOffset) * 2.5;

    // Point on the circle
    const pointAngle = Math.random() * Math.PI * 2;
    const radius = 1.0;

    const noiseX = (Math.random() - 0.5) * 0.2;
    const noiseY = (Math.random() - 0.5) * 0.2;
    const noiseZ = (Math.random() - 0.5) * 0.2;

    circlesPositions[i * 3] = cx + (Math.cos(pointAngle) * radius) + noiseX;
    circlesPositions[i * 3 + 1] = cy + (Math.sin(pointAngle) * radius) + noiseY;
    circlesPositions[i * 3 + 2] = noiseZ;
}

function Particles({ shape, color, isHovered, mouseRef }: { shape: 'bracket' | 'circles', color: string, isHovered: boolean, mouseRef: React.MutableRefObject<{ x: number, y: number }> }) {
    const pointsRef = useRef<THREE.Points>(null);
    const targetGeometry = shape === 'bracket' ? bracketPositions : circlesPositions;

    // A completely scattered fixed geometry to retreat to
    const randomGeometry = useMemo(() => {
        const arr = new Float32Array(PARTICLE_COUNT * 3);
        for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
            // Give them a wider bounding box to spread out completely
            arr[i * 3] = (Math.random() - 0.5) * 20;
            arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return arr;
    }, []);

    // Initialize scattered
    const currentPositions = useMemo(() => {
        const arr = new Float32Array(randomGeometry); // copy start pos
        return arr;
    }, [randomGeometry]);

    const velocities = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;

        // Gentle rotation
        pointsRef.current.rotation.y = THREE.MathUtils.lerp(pointsRef.current.rotation.y, (mouseRef.current.x * 0.2), 0.05);
        pointsRef.current.rotation.x = THREE.MathUtils.lerp(pointsRef.current.rotation.x, -(mouseRef.current.y * 0.2), 0.05);

        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const activeTarget = isHovered ? targetGeometry : randomGeometry;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;

            // Adding a small drifting effect based on time if NOT hovered, so they don't look completely frozen
            let tx = activeTarget[i3];
            let ty = activeTarget[i3 + 1];
            let tz = activeTarget[i3 + 2];

            if (!isHovered) {
                tx += Math.sin(state.clock.elapsedTime * 0.5 + i) * 1.5;
                ty += Math.cos(state.clock.elapsedTime * 0.5 + i) * 1.5;
            }

            // Assembly speed: fast scatter, slow gathering
            const springForce = isHovered ? 0.005 : 0.015;
            const damp = 0.90;

            const mouseX = mouseRef.current.x * 7;
            const mouseY = mouseRef.current.y * 7;
            const dx = positions[i3] - mouseX;
            const dy = positions[i3 + 1] - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let repelX = 0, repelY = 0;
            // Only repel if hovering
            if (isHovered && dist < 1.5) {
                const force = (1.5 - dist) * 0.05;
                repelX = (dx / dist) * force;
                repelY = (dy / dist) * force;
            }

            velocities[i3] += (tx - positions[i3]) * springForce + repelX;
            velocities[i3 + 1] += (ty - positions[i3 + 1]) * springForce + repelY;
            velocities[i3 + 2] += (tz - positions[i3 + 2]) * springForce;

            velocities[i3] *= damp;
            velocities[i3 + 1] *= damp;
            velocities[i3 + 2] *= damp;

            positions[i3] += velocities[i3];
            positions[i3 + 1] += velocities[i3 + 1];
            positions[i3 + 2] += velocities[i3 + 2];
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <Points ref={pointsRef} positions={currentPositions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color={color}
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                opacity={0.6}
            />
        </Points>
    );
}

export function OffersParticles({ shape, color }: { shape: 'bracket' | 'circles', color: string }) {
    const mouseRef = useRef({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        // Calculate relative to the container center
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mouseRef.current.x = (x / rect.width) * 2 - 1;
        mouseRef.current.y = -(y / rect.height) * 2 + 1;
    };

    const handleMouseLeave = () => {
        mouseRef.current.x = 0;
        mouseRef.current.y = 0;
        setIsHovered(false);
    };

    return (
        <div
            className="absolute inset-0 z-0 overflow-hidden pointer-events-auto"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setIsHovered(true)}
        >
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
                <Particles shape={shape} color={color} isHovered={isHovered} mouseRef={mouseRef} />
            </Canvas>
        </div>
    );
}
