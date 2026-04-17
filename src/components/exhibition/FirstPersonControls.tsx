'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useAvatar } from '@/context/AvatarContext'

// Constants
const GUIDE_POS = new THREE.Vector3(55, 1.6, -1.5)
const GUIDE_TARGET = new THREE.Vector3(55, 1.5, -5.5)
const EXPLORE_START = new THREE.Vector3(55, 1.3, 2.0)
const EYE_HEIGHT = 1.3
const MOVE_SPEED = 10.0
const SPRINT_MULTIPLIER = 1.8
const HEAD_BOB_AMOUNT = 0.04
const HEAD_BOB_SPEED = 8
const COLLISION_BOUNDS = { minX: 5, maxX: 105, minZ: -60, maxZ: 40 }
const PLAYER_RADIUS = 0.4

export function NavigationControls() {
  const { camera, scene } = useThree()
  const { navMode, setNavMode } = useAvatar()
  const inGuide = navMode === 'guide'

  // Ref-based state to avoid re-renders
  const moveState = useRef({ forward: false, backward: false, left: false, right: false, sprint: false })
  const mouseRotation = useRef({ x: 0, y: 0 })
  const bobTime = useRef(0)
  
  // Teleport state
  const isTeleporting = useRef(false)
  const teleportStart = useRef(new THREE.Vector3())
  const teleportTargetPos = useRef(new THREE.Vector3())
  const teleportProgress = useRef(0)

  // Math objects (pooled)
  const tempVec1 = useRef(new THREE.Vector3())
  const tempVec2 = useRef(new THREE.Vector3())
  const tempQuat = useRef(new THREE.Quaternion())
  const tempMat = useRef(new THREE.Matrix4())
  const raycaster = useRef(new THREE.Raycaster())

  // Initialization & Listeners
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!document.pointerLockElement || inGuide) return
      const sensitivity = 0.002
      mouseRotation.current.y -= e.movementX * sensitivity
      mouseRotation.current.x -= e.movementY * sensitivity
      mouseRotation.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, mouseRotation.current.x))
    }
    document.addEventListener('mousemove', onMouseMove)
    return () => document.removeEventListener('mousemove', onMouseMove)
  }, [inGuide])

  // Movement Frame Loop
  useFrame((_, delta) => {
    // 1. Guide Mode handling
    if (inGuide) {
      camera.position.lerp(GUIDE_POS, 0.06)
      tempMat.current.lookAt(camera.position, GUIDE_TARGET, camera.up)
      tempMat.current.decompose(tempVec1.current, tempQuat.current, tempVec2.current)
      camera.quaternion.slerp(tempQuat.current, 0.06)
      mouseRotation.current.x = 0
      mouseRotation.current.y = 0
      return
    }

    // 2. Apply Mouse Rotation
    camera.rotation.order = 'YXZ'
    camera.rotation.y = mouseRotation.current.y
    camera.rotation.x = mouseRotation.current.x

    // 3. Teleporting
    if (isTeleporting.current) {
        teleportProgress.current += delta * 1.5
        if (teleportProgress.current >= 1) {
          camera.position.copy(teleportTargetPos.current)
          isTeleporting.current = false
          return
        }
        const eased = teleportProgress.current
        camera.position.lerpVectors(teleportStart.current, teleportTargetPos.current, eased)
        camera.position.y = EYE_HEIGHT
        return
    }

    // 4. Keyboard Movement
    delta = Math.min(delta, 0.05)
    const speed = MOVE_SPEED * (moveState.current.sprint ? SPRINT_MULTIPLIER : 1)
    
    const fwd = tempVec1.current.set(0, 0, -1).applyQuaternion(camera.quaternion)
    fwd.y = 0; fwd.normalize()
    const rgt = tempVec2.current.set(1, 0, 0).applyQuaternion(camera.quaternion)
    rgt.y = 0; rgt.normalize()

    const moveDelta = new THREE.Vector3()
    if (moveState.current.forward) moveDelta.addScaledVector(fwd, speed * delta)
    if (moveState.current.backward) moveDelta.addScaledVector(fwd, -speed * delta)
    if (moveState.current.right) moveDelta.addScaledVector(rgt, speed * delta)
    if (moveState.current.left) moveDelta.addScaledVector(rgt, -speed * delta)

    if (moveDelta.length() > 0) {
      const proposedPos = camera.position.clone().add(moveDelta)
      proposedPos.y = EYE_HEIGHT

      // Static Bounds Check
      if (proposedPos.x > COLLISION_BOUNDS.minX && proposedPos.x < COLLISION_BOUNDS.maxX &&
          proposedPos.z > COLLISION_BOUNDS.minZ && proposedPos.z < COLLISION_BOUNDS.maxZ) {
          
          // Collision Raycast
          raycaster.current.set(camera.position, moveDelta.normalize())
          const intersects = raycaster.current.intersectObject(scene, true)
          if (intersects.length === 0 || intersects[0].distance > 1.0) {
            camera.position.copy(proposedPos)
          }
      }

      // Head Bob
      bobTime.current += delta * HEAD_BOB_SPEED
      camera.position.y = EYE_HEIGHT + Math.sin(bobTime.current) * HEAD_BOB_AMOUNT
    } else {
      camera.position.y = EYE_HEIGHT
      bobTime.current = 0
    }
  })

  // Keyboard Event Listeners
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (inGuide) return
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': moveState.current.forward = true; break
        case 'KeyS': case 'ArrowDown': moveState.current.backward = true; break
        case 'KeyA': case 'ArrowLeft': moveState.current.left = true; break
        case 'KeyD': case 'ArrowRight': moveState.current.right = true; break
        case 'ShiftLeft': case 'ShiftRight': moveState.current.sprint = true; break
        case 'Escape': setNavMode('guide'); break
      }
    }
    const up = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': moveState.current.forward = false; break
        case 'KeyS': case 'ArrowDown': moveState.current.backward = false; break
        case 'KeyA': case 'ArrowLeft': moveState.current.left = false; break
        case 'KeyD': case 'ArrowRight': moveState.current.right = false; break
        case 'ShiftLeft': case 'ShiftRight': moveState.current.sprint = false; break
      }
    }
    window.addEventListener('keydown', down); window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [inGuide, setNavMode])

  // Simple Mode Toggle
  useEffect(() => {
    if (inGuide) {
        if (document.pointerLockElement) document.exitPointerLock()
    } else {
        camera.position.copy(EXPLORE_START)
        camera.lookAt(55, 1.3, -5)
    }
  }, [inGuide, camera])

  return null // No longer using PointerLockControls component!
}
