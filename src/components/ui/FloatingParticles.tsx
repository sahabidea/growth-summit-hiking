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
    glowColor = "rgba(251, 191, 36, 0.5)" // Amber glow
}: FloatingParticlesProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[...Array(count)].map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute ${color} rounded-full mix-blend-screen opacity-20`}
                    initial={{
                        x: `${Math.random() * 100}%`,
                        y: `${Math.random() * 100}%`,
                        opacity: 0,
                        scale: 0
                    }}
                    animate={{
                        y: [null, -100], // Drift upwards
                        opacity: [0, 0.4, 0],
                        scale: [0, Math.random() * 0.5 + 0.5, 0] // Varied scale
                    }}
                    transition={{
                        duration: Math.random() * 15 + 15, // Slow, floaty
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "linear",
                    }}
                    style={{
                        width: `${Math.random() * 6 + 2}px`,
                        height: `${Math.random() * 6 + 2}px`,
                        boxShadow: `0 0 10px ${glowColor}`
                    }}
                />
            ))}
        </div>
    );
};
