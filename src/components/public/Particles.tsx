"use client";

import { useEffect, useState } from "react";
import styles from "./particles.module.css";

export default function Particles({ count = 25 }: { count?: number }) {
    const [particles, setParticles] = useState<{ id: number; size: number; left: string; animationDuration: string; animationDelay: string }[]>([]);

    useEffect(() => {
        const newParticles = Array.from({ length: count }).map((_, i) => ({
            id: i,
            size: Math.random() * 5 + 2, // 2px to 7px
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 15 + 15}s`, // 15s to 30s for slow float
            animationDelay: `${Math.random() * 10}s`, // staggered starts
        }));
        setParticles(newParticles);
    }, [count]);

    if (particles.length === 0) return null; // Avoid hydration mismatch

    return (
        <div className={styles.particles}>
            {particles.map((p) => (
                <div
                    key={p.id}
                    className={styles.particle}
                    style={{
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        left: p.left,
                        bottom: "-20px",
                        animationDuration: p.animationDuration,
                        animationDelay: p.animationDelay,
                    }}
                />
            ))}
        </div>
    );
}
