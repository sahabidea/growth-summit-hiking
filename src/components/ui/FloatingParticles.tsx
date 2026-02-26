"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingParticlesProps {
    count?: number;
    color?: string;
    glowColor?: string;
}

export const FloatingParticles = ({
    count = 20,
    color = "bg-amber-200",
    glowColor = "rgba(251, 191, 36, 0.5)"
}: FloatingParticlesProps) => {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        const generated = [...Array(count)].map(() => ({
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scaleMiddle: Math.random() * 0.5 + 0.5,
            duration: Math.random() * 15 + 15,
            delay: Math.random() * 5,
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`
        }));
        setParticles(generated);
    }, [count]);

    if (!particles.length) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((p, i) => (
                <motion.div
                    key={i}
                    className={`absolute ${color} rounded-full mix-blend-screen opacity-20`}
                    initial={{
                        x: p.x,
                        y: p.y,
                        opacity: 0,
                        scale: 0
                    }}
                    animate={{
                        y: [null, -100],
                        opacity: [0, 0.4, 0],
                        scale: [0, p.scaleMiddle, 0]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear",
                    }}
                    style={{
                        width: p.width,
                        height: p.height,
                        boxShadow: `0 0 10px ${glowColor}`
                    }}
                />
            ))}
        </div>
    );
};
