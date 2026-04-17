'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from '@/app/site/home.module.css'
import Particles from './Particles'
import { Layout, Building2, Palmtree } from 'lucide-react'

const BACKGROUNDS = [
    {
        id: 'villa',
        name: 'Villa Prestige',
        url: '/hero_villa.png',
        icon: Palmtree
    },
    {
        id: 'expo',
        name: 'Centre d\'Exposition',
        url: '/hero_expo.png',
        icon: Building2
    }
]

export default function HeroSection() {
    const [activeBg, setActiveBg] = useState(BACKGROUNDS[0])

    // Preload images
    useEffect(() => {
        BACKGROUNDS.forEach(bg => {
            const img = new Image()
            img.src = bg.url
        })

        const saved = localStorage.getItem('sdm-hero-bg')
        if (saved) {
            const found = BACKGROUNDS.find(b => b.id === saved)
            if (found) setActiveBg(found)
        }
    }, [])

    const handleSwitch = (bg: typeof BACKGROUNDS[0]) => {
        setActiveBg(bg)
        localStorage.setItem('sdm-hero-bg', bg.id)
    }

    return (
        <section className={styles.hero}>
            {/* Background Layers */}
            {BACKGROUNDS.map(bg => (
                <div 
                    key={bg.id}
                    className={styles.heroBackground}
                    style={{ 
                        backgroundImage: `url(${bg.url})`,
                        opacity: activeBg.id === bg.id ? 1 : 0
                    }}
                />
            ))}
            
            <div className={styles.heroOverlay}></div>
            
            <Particles count={30} />
            <div className={styles.heroGlow}></div>

            <div className={`glass-panel ${styles.heroCard} animate-fade-in-up`}>
                <h1 className={`${styles.heroTitle} animate-fade-in-up delay-100`}>SDM virtuel</h1>
                <p className={`${styles.heroSubtitle} animate-fade-in-up delay-200`}>
                    Le salon virtuel des promoteurs<br />immobiliers au Maroc
                </p>
                <p className={`${styles.heroText} animate-fade-in-up delay-300`}>
                    Explorez les projets résidentiels, villas et appartements<br />des meilleurs promoteurs en immersion totale.
                </p>
                <div className={`animate-fade-in-up delay-400`}>
                    <Link href="/contact" className={styles.heroButton}>Exposer vos projets</Link>
                </div>
            </div>

            {/* Background Switcher UI */}
            <div className={styles.themeSwitcher}>
                {BACKGROUNDS.map(bg => {
                    const Icon = bg.icon
                    return (
                        <button
                            key={bg.id}
                            onClick={() => handleSwitch(bg)}
                            className={`${styles.themeBtn} ${activeBg.id === bg.id ? styles.themeBtnActive : ''}`}
                            aria-label={`Switch to ${bg.name}`}
                        >
                            <div className={styles.themeBtnLabel}>{bg.name}</div>
                            <Icon size={18} color={activeBg.id === bg.id ? '#3BE8B0' : 'white'} />
                        </button>
                    )
                })}
            </div>
        </section>
    )
}
