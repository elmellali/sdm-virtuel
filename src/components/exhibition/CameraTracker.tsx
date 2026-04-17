import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

// This component tracks the camera position and rotation for the minimap
export function CameraTracker({ onCameraUpdate }: { onCameraUpdate: (pos: { x: number; z: number }, rot: number) => void }) {
  const { camera } = useThree()
  const lastUpdate = useRef(0)

  useFrame((state) => {
    // Update at a reasonable rate (not every frame to avoid performance issues)
    const now = state.clock.getElapsedTime()
    if (now - lastUpdate.current > 0.1) { // 100ms
      lastUpdate.current = now
      
      const position = {
        x: camera.position.x,
        z: camera.position.z,
      }
      
      // Get rotation from camera quaternion
      const euler = new THREE.Euler(0, 0, 0, 'YXZ')
      euler.setFromQuaternion(camera.quaternion)
      const rotation = euler.y // Y-axis rotation (horizontal look direction)
      
      onCameraUpdate(position, rotation)
    }
  })

  return null
}
