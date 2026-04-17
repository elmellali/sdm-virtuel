'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { Leva } from 'leva'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Exhibition } from './Exhibition'
import { NavigationControls } from './FirstPersonControls'
import { Avatar } from './Avatar'
import { CameraTracker } from './CameraTracker'
import { PointerLockEnabler } from './PointerLockEnabler'

export function Scene({ onCameraUpdate }: { onCameraUpdate: (pos: { x: number; z: number }, rot: number) => void }) {
    return (
        <Canvas
            camera={{ position: [55, 1.55, -1.5], fov: 50, near: 0.05, far: 500 }}
            shadows
            gl={{ antialias: false }}
        >
            <color attach="background" args={['#0a0a0a']} />

            {/* Soft ambient light to let baked shadows and HDRI pop */}
            <ambientLight intensity={0.4} />

            {/* Broad directional light for general illumination */}
            <directionalLight
                position={[10, 20, 10]}
                intensity={0.7}
                castShadow
                shadow-mapSize={2048}
                shadow-camera-far={200}
                shadow-bias={-0.0001}
                shadow-camera-left={-100}
                shadow-camera-right={100}
                shadow-camera-top={100}
                shadow-camera-bottom={-100}
            />
            
            <pointLight position={[55, 5, 5]} intensity={0.5} color="#a7d0b3" distance={50} />
            <pointLight position={[20, 10, -30]} intensity={0.3} color="#fff" distance={100} />

            <Suspense fallback={null}>
                {/* Custom HDRI for photorealistic reflections */}
                <Environment files="/hdri_sky_809.jpg" background={false} environmentIntensity={1.5} />
                <Exhibition />
                <Avatar />
                <ContactShadows position={[0, -0.01, 0]} opacity={0.5} scale={100} blur={2.5} far={10} />
            </Suspense>


            <NavigationControls />
            <PointerLockEnabler />
            
            {/* Camera tracker for minimap */}
            <CameraTracker onCameraUpdate={onCameraUpdate} />
        </Canvas>
    )
}

// Leva panel - only shown in dev mode
export function AvatarDebugWrapper() {
    return (
        process.env.NODE_ENV === 'development' && (
            <>
                <Leva
                    hidden={false}
                    collapsed={true}
                    theme={{
                        colors: {
                            elevation3: '#1a1a1a',
                            accent1: '#a7d0b3',
                            accent2: '#6aab7e',
                        }
                    }}
                />
            </>
        )
    )
}
