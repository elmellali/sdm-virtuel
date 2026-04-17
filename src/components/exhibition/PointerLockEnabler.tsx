'use client'

import { useThree } from '@react-three/fiber'
import { useState, useEffect } from 'react'
import { Html } from '@react-three/drei'
import { MousePointer2 } from 'lucide-react'

export function PointerLockEnabler() {
  const { gl } = useThree()
  const [isLocked, setIsLocked] = useState(false)

  useEffect(() => {
    const onChange = () => {
      setIsLocked(!!document.pointerLockElement)
    }
    document.addEventListener('pointerlockchange', onChange)
    return () => document.removeEventListener('pointerlockchange', onChange)
  }, [])

  const requestLock = () => {
    try {
      // Browsers require a short cooldown after exiting pointer lock
      const promise = gl.domElement.requestPointerLock() as any
      if (promise && typeof promise.catch === 'function') {
        promise.catch((err: any) => {
          if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
            console.warn('Pointer lock request denied (cooldown or gesture required)')
          }
        })
      }
    } catch (err) {
      console.warn('Pointer lock failed synchronously')
    }
  }

  if (isLocked) return null

  return (
    <Html fullscreen>
      <div 
        style={{ 
          position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 100, pointerEvents: 'none' 
        }}
      >
        <button
          onClick={requestLock}
          style={{
            pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '12px', 
            padding: '16px 24px', borderRadius: '16px', color: 'white', 
            fontWeight: 600, fontSize: '14px', boxShadow: '0 32px 64px rgba(0,0,0,0.6)', 
            transition: 'all 0.3s', cursor: 'pointer',
            background: 'rgba(10, 15, 12, 0.9)',
            border: '1px solid rgba(167, 208, 179, 0.4)',
            backdropFilter: 'blur(16px)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MousePointer2 className="w-5 h-5 text-[#a7d0b3]" />
          <span style={{ color: '#a7d0b3' }}>Cliquez pour activer le contrôle souris</span>
        </button>
      </div>
    </Html>
  )
}
