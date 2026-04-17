'use client'

import { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useAnimations, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useAvatar } from '@/context/AvatarContext'

// Position where the avatar stands in the exhibition
const AVATAR_POSITION: [number, number, number] = [55, -0.5, -5.5]
const AVATAR_SCALE: [number, number, number] = [1.5, 1.5, 1.5]

export function Avatar() {
  const { isChatOpen, isTalking, openChat } = useAvatar()
  const { scene, animations, nodes } = useGLTF('/ghita.glb')
  
  return (
    <group position={AVATAR_POSITION} scale={AVATAR_SCALE} onClick={(e) => { e.stopPropagation(); openChat() }}>
      <AvatarModel 
        scene={scene} 
        animations={animations} 
        isTalking={isTalking} 
        nodes={nodes}
      />

      {/* interaction hint */}
      {!isChatOpen && (
        <Html position={[0, 2.2, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(167, 208, 179, 0.85)',
            backdropFilter: 'blur(8px)',
            borderRadius: '20px',
            padding: '6px 14px',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px rgba(167, 208, 179, 0.4)',
            animation: 'pulse 2.2s ease-in-out infinite',
          }}>
            💬 Appuyez sur ECHAP pour me parler
          </div>
        </Html>
      )}

      {/* Speaking Indicator */}
      {isTalking && (
        <Html position={[0, 2.4, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.6)', borderRadius: '12px', padding: '6px 12px' }}>
            {[0, 0.15, 0.3].map((delay, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#a7d0b3', animation: `bounce 0.8s ${delay}s ease-in-out infinite alternate` }} />
            ))}
          </div>
        </Html>
      )}
    </group>
  )
}

function AvatarModel({ scene, animations, isTalking, nodes }: any) {
  const groupRef = useRef<THREE.Group>(null!)
  const { actions, mixer } = useAnimations(animations, groupRef)
  
  // State refs for procedural loops
  const blinkState = useRef({ nextBlinkTime: 2, isBlinking: false, blinkStartTime: 0, currentVal: 0 })
  const speechState = useRef({ targetJawOpen: 0, currentJawOpen: 0, lastUpdate: 0 })
  
  const bones = useMemo(() => {
    // Attempt to use explicitly passed nodes from useGLTF if passed properly, else fallback
    const b: Record<string, THREE.Object3D | null> = {
      jaw: (nodes && nodes.jaw) || scene.getObjectByName('jaw') || null,
      eyelid_l: (nodes && nodes.eyelid_l) || scene.getObjectByName('eyelid_l') || null,
      eyelid_r: (nodes && nodes.eyelid_r) || scene.getObjectByName('eyelid_r') || null,
      head: (nodes && nodes.head) || scene.getObjectByName('head') || null,
      neck: (nodes && nodes.neck_01) || scene.getObjectByName('neck_01') || null
    }
    return b
  }, [scene, nodes])

  // Animation Manager
  useEffect(() => {
    if (!actions) return
    
    // Fallback if strict names aren't found
    const idleAction = actions['Idle'] || actions[Object.keys(actions).find((k) => k.toLowerCase().includes('idle')) || Object.keys(actions)[0]]
    const talkAction = actions['Talking'] || actions[Object.keys(actions).find((k) => k.toLowerCase().includes('talk')) || Object.keys(actions)[0]]

    if (idleAction && talkAction) {
      if (isTalking) {
        idleAction.fadeOut(0.5)
        talkAction.reset().fadeIn(0.5).play()
      } else {
        talkAction.fadeOut(0.5)
        idleAction.reset().fadeIn(0.5).play()
      }
    }
  }, [isTalking, actions])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    if (mixer) mixer.update(delta)

    const time = state.clock.elapsedTime
    
    // 1. PROCEDURAL BLINKING
    // A sophisticated organic blink using sine wave mapping
    if (!blinkState.current.isBlinking && time > blinkState.current.nextBlinkTime) {
      blinkState.current.isBlinking = true
      blinkState.current.blinkStartTime = time
    }

    let blinkFactor = 0
    if (blinkState.current.isBlinking) {
      const blinkDuration = 0.15 // Fast physiological blink
      const elapsed = time - blinkState.current.blinkStartTime
      
      if (elapsed > blinkDuration) {
        blinkState.current.isBlinking = false
        // Randomize next blink between 2 to 6 seconds
        blinkState.current.nextBlinkTime = time + 2 + Math.random() * 4
        blinkFactor = 0
      } else {
        // Map 0 -> 1 -> 0 over the duration using sine wave
        const progress = elapsed / blinkDuration
        blinkFactor = Math.sin(progress * Math.PI)
      }
    }

    // Keep smoothed value in state
    blinkState.current.currentVal = THREE.MathUtils.lerp(blinkState.current.currentVal, blinkFactor * 0.22, 0.4)

    // Using absolute assignments instead of += to prevent the "spinning" bug
    // We assume the rest rotation is 0 for these specific bones if not keyed
    if (bones.eyelid_l) bones.eyelid_l.rotation.x = blinkState.current.currentVal
    if (bones.eyelid_r) bones.eyelid_r.rotation.x = blinkState.current.currentVal

    // 2. NATURAL LIP SYNC (Fluid Motion)
    if (isTalking) {
      // Update target jaw opening at a more natural cadence (~8Hz)
      if (time - speechState.current.lastUpdate > 0.12) {
        // Vary between closed (0.05) and wide (0.4)
        speechState.current.targetJawOpen = 0.05 + Math.random() * 0.35
        speechState.current.lastUpdate = time
      }
    } else {
      speechState.current.targetJawOpen = 0
    }

    // Use a smooth lerp to avoid mechanical "snapping"
    // Add a very subtle organic pulse during speech
    const pulse = isTalking ? Math.sin(time * 18) * 0.02 : 0
    
    speechState.current.currentJawOpen = THREE.MathUtils.lerp(
      speechState.current.currentJawOpen, 
      speechState.current.targetJawOpen + pulse, 
      0.18
    )

    // Applying absolute rotation to bone
    if (bones.jaw) bones.jaw.rotation.x = speechState.current.currentJawOpen

    // 3. ORGANIC HEAD MOVEMENT (Tracking & Sway)
    if (bones.head) {
      // Small randomized sway to make it feel alive
      const swayX = Math.sin(time * 0.6) * 0.015
      const swayY = Math.cos(time * 0.4) * 0.02
      
      // Emphasis nods during speech
      const emphasis = isTalking ? Math.max(0, Math.sin(time * 6)) * 0.02 : 0
      
      // We set absolute values for Y to avoid cumulative horizontal turning.
      // For X we add a tiny bit of sway to the natural animated pose (most animations key X)
      // but we wrap it in a clamp to be safe.
      bones.head.rotation.y = swayY
      bones.head.rotation.x = THREE.MathUtils.lerp(bones.head.rotation.x, 0.05 + swayX + emphasis, 0.1)
    }
    if (bones.neck) {
      bones.neck.rotation.y = Math.sin(time * 0.3) * 0.01
    }
  })

  return <primitive ref={groupRef} object={scene} />
}

useGLTF.preload('/ghita.glb')
