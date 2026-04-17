import { useStands } from '@/context/StandsContext'
import { X, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useMemo, useEffect, useCallback } from 'react'

interface TeleportNavProps {
  onTeleport: (standIndex: number) => void
}

export function TeleportNavigation({ onTeleport }: TeleportNavProps) {
  const { stands } = useStands()
  const [isOpen, setIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const standsPerPage = 8

  const totalPages = Math.ceil(stands.length / standsPerPage)
  
  const visibleStands = useMemo(() => {
    const start = currentPage * standsPerPage
    return stands.slice(start, start + standsPerPage)
  }, [stands, currentPage])

  // Listen for teleport events from FirstPersonControls
  useEffect(() => {
    const handleTeleportEvent = (event: Event) => {
      const customEvent = event as CustomEvent
      if (customEvent.detail && customEvent.detail.standIndex !== undefined) {
        handleTeleport(customEvent.detail.standIndex)
      }
    }

    window.addEventListener('teleport-to-stand', handleTeleportEvent)
    return () => window.removeEventListener('teleport-to-stand', handleTeleportEvent)
  }, [])

  const getStandPosition = (index: number) => {
    const row = Math.floor(index / 8)
    const col = index % 8
    return `Ligne ${row + 1}, Col ${col + 1}`
  }

  const handleTeleport = useCallback((standIndex: number) => {
    setIsOpen(false)
    onTeleport(standIndex)
  }, [onTeleport])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '8px', 
          borderRadius: '12px', padding: '12px 20px', fontSize: '14px', fontWeight: 'bold', 
          color: 'white', transition: 'all 0.3s', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', 
          backdropFilter: 'blur(12px)', border: '1px solid rgba(167,208,179,0.3)',
          background: 'rgba(167,208,179,0.15)', cursor: 'pointer'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(167,208,179,0.25)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(167,208,179,0.15)'}
      >
        <MapPin className="w-4 h-4 text-[#a7d0b3]" />
        <span style={{ color: '#a7d0b3' }}>Navigation Rapide</span>
      </button>
    )
  }

  return (
    <div
      style={{
        pointerEvents: 'auto', position: 'absolute', zIndex: 30, 
        bottom: '100px', left: '50%', transform: 'translateX(-50%)',
        width: 'min(90vw, 800px)', maxHeight: '70vh', borderRadius: '24px', 
        overflow: 'hidden', boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
        background: 'rgba(10, 15, 12, 0.95)',
        border: '1px solid rgba(167, 208, 179, 0.3)',
        backdropFilter: 'blur(16px)',
        display: 'flex', flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' 
      }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#a7d0b3', margin: 0 }}>Navigation Rapide</h2>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px', margin: 0 }}>Sélectionnez un stand pour vous y téléporter</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{ 
            padding: '8px', borderRadius: '8px', background: 'transparent', 
            border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' 
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <X size={20} />
        </button>
      </div>

      {/* Stand Grid */}
      <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: '12px' 
        }}>
          {visibleStands.map((stand, index) => {
            const globalIndex = currentPage * standsPerPage + index
            
            return (
              <button
                key={stand.id}
                onClick={() => handleTeleport(globalIndex)}
                style={{
                  padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', 
                  background: 'rgba(255,255,255,0.05)', cursor: 'pointer', textAlign: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <MapPin style={{ width: '20px', height: '20px', color: 'rgba(255,255,255,0.4)' }} />
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                    {stand.name}
                  </p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                    {getStandPosition(globalIndex)}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' 
          }}>
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', 
                borderRadius: '8px', background: 'rgba(255,255,255,0.05)', cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 0 ? 0.3 : 1, border: 'none', color: 'white', fontSize: '14px'
              }}
            >
              <ChevronLeft size={16} />
              Précédent
            </button>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '8px', fontSize: '14px', 
                    fontWeight: 500, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                    background: page === currentPage ? 'rgba(167,208,179,0.3)' : 'rgba(255,255,255,0.05)',
                    color: page === currentPage ? '#a7d0b3' : 'rgba(255,255,255,0.5)'
                  }}
                >
                  {page + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', 
                borderRadius: '8px', background: 'rgba(255,255,255,0.05)', cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages - 1 ? 0.3 : 1, border: 'none', color: 'white', fontSize: '14px'
              }}
            >
              Suivant
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
