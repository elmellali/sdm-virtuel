import { useAvatar } from '@/context/AvatarContext'
import { useStands } from '@/context/StandsContext'
import { Maximize2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface MinimapProps {
  position: { x: number; z: number }
  rotation: number
}

export function Minimap({ position, rotation }: MinimapProps) {
  const { navMode } = useAvatar()
  const { stands } = useStands()
  const [isExpanded, setIsExpanded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Map bounds
  const mapBounds = {
    minX: 0, maxX: 110,
    minZ: -65, maxZ: 45,
  }

  // Convert 3D position to 2D map coordinates
  const worldToMap = (x: number, z: number) => {
    const mapWidth = isExpanded ? 320 : 180
    const mapHeight = isExpanded ? 240 : 135
    
    const relX = (x - mapBounds.minX) / (mapBounds.maxX - mapBounds.minX)
    const relZ = (z - mapBounds.minZ) / (mapBounds.maxZ - mapBounds.minZ)
    
    return {
      x: relX * mapWidth,
      y: relZ * mapHeight,
    }
  }

  // Draw minimap
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear
    ctx.clearRect(0, 0, width, height)

    // Background
    ctx.fillStyle = 'rgba(10, 15, 12, 0.85)'
    ctx.fillRect(0, 0, width, height)

    // Border
    ctx.strokeStyle = 'rgba(167, 208, 179, 0.3)'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, width - 2, height - 2)

    // Draw stands
    stands.forEach((_, index) => {
      const row = Math.floor(index / 8)
      const col = index % 8
      const x = 20 + col * 10
      const z = -40 + row * 15

      const mapPos = worldToMap(x, z)
      const standWidth = width / (mapBounds.maxX - mapBounds.minX) * 8
      const standHeight = height / (mapBounds.maxZ - mapBounds.minZ) * 12

      ctx.fillStyle = 'rgba(167, 208, 179, 0.2)'
      ctx.fillRect(mapPos.x - standWidth / 2, mapPos.y - standHeight / 2, standWidth, standHeight)

      ctx.strokeStyle = 'rgba(167, 208, 179, 0.4)'
      ctx.lineWidth = 1
      ctx.strokeRect(mapPos.x - standWidth / 2, mapPos.y - standHeight / 2, standWidth, standHeight)
    })

    // Draw player position
    const playerPos = worldToMap(position.x, position.z)
    
    // Player direction indicator
    const dirLength = 12
    const dirX = playerPos.x + Math.sin(rotation) * dirLength
    const dirY = playerPos.y + Math.cos(rotation) * dirLength

    ctx.strokeStyle = '#a7d0b3'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(playerPos.x, playerPos.y)
    ctx.lineTo(dirX, dirY)
    ctx.stroke()

    // Player dot
    ctx.fillStyle = '#a7d0b3'
    ctx.beginPath()
    ctx.arc(playerPos.x, playerPos.y, 5, 0, Math.PI * 2)
    ctx.fill()

    // Player ring
    ctx.strokeStyle = 'rgba(167, 208, 179, 0.6)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(playerPos.x, playerPos.y, 8, 0, Math.PI * 2)
    ctx.stroke()

  }, [position, rotation, stands, isExpanded])

  if (navMode === 'guide') return null

  const mapWidth = isExpanded ? 320 : 180
  const mapHeight = isExpanded ? 240 : 135

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        width: `${mapWidth}px`,
        height: `${mapHeight}px`,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        border: '1px solid rgba(167, 208, 179, 0.3)',
        backdropFilter: 'blur(8px)',
        zIndex: 20
      }}
    >
      <canvas
        ref={canvasRef}
        width={mapWidth}
        height={mapHeight}
        style={{ width: '100%', height: '100%' }}
      />

      {/* Controls */}
      <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: '6px', borderRadius: '8px', background: 'rgba(0,0,0,0.6)', 
            border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'white'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          title={isExpanded ? 'Réduire' : 'Agrandir'}
        >
          <Maximize2 size={14} />
        </button>
      </div>

      {/* Position label */}
      <div style={{
        position: 'absolute', bottom: '8px', left: '8px', padding: '4px 8px',
        borderRadius: '6px', background: 'rgba(0,0,0,0.6)', color: 'rgba(255,255,255,0.7)',
        fontSize: '10px', fontFamily: 'monospace'
      }}>
        X: {position.x.toFixed(1)} Z: {position.z.toFixed(1)}
      </div>
    </div>
  )
}

export function MinimapToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        pointerEvents: 'auto', padding: '10px', borderRadius: '12px', 
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', transition: 'all 0.3s'
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      title="Basculer Minimap"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '20px', height: '20px', color: 'rgba(255,255,255,0.5)' }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    </button>
  )
}
