'use client'

import { useState } from 'react'
import { X, Info, MousePointer2, Keyboard } from 'lucide-react'
import { useAvatar } from '@/context/AvatarContext'

export function ControlsHelper() {
  const [isVisible, setIsVisible] = useState(true)
  const { navMode, setNavMode } = useAvatar()
  const inGuide = navMode === 'guide'

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          pointerEvents: 'auto', padding: '12px', borderRadius: '12px', 
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', transition: 'all 0.3s'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        title="Afficher les contrôles"
      >
        <Info size={20} color="rgba(255,255,255,0.7)" />
      </button>
    )
  }

  return (
    <div
      style={{
        pointerEvents: 'auto', zIndex: 20, borderRadius: '16px', overflow: 'hidden', 
        boxShadow: '0 32px 64px rgba(0,0,0,0.5)', width: '280px',
        background: 'rgba(10, 15, 12, 0.9)',
        border: '1px solid rgba(167, 208, 179, 0.3)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' 
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#a7d0b3', margin: 0 }}>
          {inGuide ? 'Guide de Visite' : 'Contrôles d\'Exploration'}
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{ 
            padding: '6px', borderRadius: '8px', background: 'transparent', 
            border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' 
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'white'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          <X size={16} />
        </button>
      </div>

      {/* Controls List */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {inGuide ? (
          /* Guide Mode Info */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <MousePointer2 size={18} color="#a7d0b3" style={{ marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '12px', color: 'white', fontWeight: 600, margin: '0 0 4px' }}>Mode Guide</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.4 }}>
                  La caméra est fixée sur l&apos;avatar. Posez vos questions via le chat.
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setNavMode('explore')}
              style={{
                width: '100%', padding: '10px', borderRadius: '8px', 
                background: 'rgba(167, 208, 179, 0.2)', border: '1px solid rgba(167, 208, 179, 0.4)',
                color: '#a7d0b3', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(167, 208, 179, 0.3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(167, 208, 179, 0.2)'}
            >
              Passer en Exploration Libre
            </button>
          </div>
        ) : (
          /* Explore Mode Controls */
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Déplacement</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <ControlRow keys={['W', 'A', 'S', 'D']} description="Se déplacer" />
                <ControlRow keys={['Shift']} description="Courir" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Caméra</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <ControlRow keys={['Souris']} description="Regarder autour" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Actions</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <ControlRow keys={['Échap']} description="Retour au Guide" />
                <ControlRow keys={['Clic']} description="Interagir" />
              </div>
            </div>
          </>
        )}

        {/* Tips */}
        <div style={{ marginTop: '4px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4, margin: 0 }}>
            💡 <span style={{ color: 'rgba(255,255,255,0.7)' }}>Astuce:</span> Cliquez sur les médias pour les agrandir
          </p>
        </div>
      </div>
    </div>
  )
}

function ControlRow({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        {keys.map((key, i) => (
          <kbd
            key={i}
            style={{
              padding: '2px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', 
              border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)', 
              fontSize: '10px', fontFamily: 'monospace'
            }}
          >
            {key}
          </kbd>
        ))}
      </div>
      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{description}</span>
    </div>
  )
}
