'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'

const TUTORIAL_STEPS = [
  {
    title: 'Bienvenue dans l\'Exposition Virtuelle SDM',
    content: 'Explorez 40 stands présentant des produits et services innovants dans un environnement 3D immersif.',
    icon: '🎉',
  },
  {
    title: 'Mode Guide',
    content: 'Commencez en Mode Guide où votre assistant IA peut vous aider à naviguer et répondre aux questions sur l\'exposition.',
    icon: '💬',
  },
  {
    title: 'Mode Exploration',
    content: 'Passez en Mode Exploration pour vous déplacer librement. Utilisez les touches WASD pour marcher et la souris pour regarder.',
    icon: '🧭',
  },
  {
    title: 'Interagir avec les Médias',
    content: 'Cliquez sur n\'importe quel écran TV, affiche ou bureau pour voir le contenu en détail. Chaque stand a des médias uniques!',
    icon: '🖱️',
  },
  {
    title: 'Navigation Rapide',
    content: 'Utilisez le bouton Navigation Rapide pour vous téléporter directement à n\'importe quel stand. La minimap montre votre position.',
    icon: '📍',
  },
  {
    title: 'Contrôles',
    content: 'WASD/Flèches: Se déplacer | Shift: Courir | Souris: Regarder | Échap: Retour au Guide | Clic: Interagir',
    icon: '⌨️',
  },
]

export function NavigationTutorial() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false)

  useEffect(() => {
    const hasSeen = localStorage.getItem('sdm_tutorial_seen')
    if (!hasSeen) {
      // Show after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      setHasSeenTutorial(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('sdm_tutorial_seen', 'true')
    setHasSeenTutorial(true)
  }

  const handleSkip = () => {
    handleClose()
  }

  if (hasSeenTutorial || !isVisible) return null

  const step = TUTORIAL_STEPS[currentStep]
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1

  return (
    <div style={{ 
      position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', 
      alignItems: 'center', justifyContent: 'center', padding: '16px', 
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' 
    }}>
      <div
        style={{
          position: 'relative', maxWidth: '448px', width: '100%', 
          borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          background: 'rgba(10, 15, 12, 0.95)',
          border: '1px solid rgba(167, 208, 179, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          style={{
            position: 'absolute', top: '16px', right: '16px', padding: '6px', 
            borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', 
            border: 'none', cursor: 'pointer', zIndex: 10
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'white'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          <X size={18} />
        </button>

        {/* Progress bar */}
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)' }}>
          <div
            style={{ 
              height: '100%', background: '#a7d0b3', transition: 'all 0.3s ease',
              width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` 
            }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {/* Icon */}
          <div style={{ fontSize: '48px', marginBottom: '24px', textAlign: 'center' }}>{step.icon}</div>

          {/* Title */}
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '12px', textAlign: 'center' }}>{step.title}</h2>

          {/* Description */}
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px', textAlign: 'center' }}>{step.content}</p>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            {/* Previous */}
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', 
                borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)',
                border: 'none', cursor: currentStep === 0 ? 'not-allowed' : 'pointer', opacity: currentStep === 0 ? 0.3 : 1,
                fontSize: '14px', fontWeight: 500
              }}
            >
              <ChevronLeft size={16} />
              Retour
            </button>

            {/* Step indicator */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {TUTORIAL_STEPS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === currentStep ? '24px' : '8px', height: '8px', 
                    borderRadius: '4px', background: i === currentStep ? '#a7d0b3' : 'rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>

            {/* Next/Finish */}
            <button
              onClick={handleNext}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
                borderRadius: '12px', color: 'white', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #a7d0b3 0%, #6aab7e 100%)',
                boxShadow: '0 4px 12px rgba(107,171,126,0.3)',
                fontSize: '14px', fontWeight: 600
              }}
            >
              {isLastStep ? 'Commencer' : 'Suivant'}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
