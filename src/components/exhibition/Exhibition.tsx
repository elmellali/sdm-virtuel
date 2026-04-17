import { Suspense, useState, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useStands, type StandConfig } from '@/context/StandsContext'
import { useAvatar } from '@/context/AvatarContext'
import type { ThreeEvent } from '@react-three/fiber'
import { Text, Billboard, useGLTF, Float } from '@react-three/drei'

// Identifiers for media surfaces - strictly matching TV screens
const TV_PATTERN = 'tv'
const MEDIA_TARGETS = ['plane', 'cube', 'screen', 'poster', 'led', 'display', 'tv', 'monitor']

function classifyDisplay(y: number, height: number): 'tv' | 'desk' | 'picture' {
    if (height > 1.2 || y > 3.0) return 'picture'
    if (height > 0.45 || y > 0.8) return 'tv'
    return 'desk'
}

function StandLabel({ title, position }: { title: string, position: [number, number, number] }) {
    return (
        <Billboard position={position}>
            <Float speed={2} rotationIntensity={0.05} floatIntensity={0.4}>
                {/* Clean Semi-Transparent Background */}
                <mesh position={[0, 0, -0.01]}>
                    <planeGeometry args={[title.length * 0.18 + 0.6, 0.45]} />
                    <meshBasicMaterial 
                        color="#0a0f0c" 
                        transparent 
                        opacity={0.9}
                        side={THREE.DoubleSide}
                        depthTest={false}
                    />
                </mesh>
                
                {/* High Contrast Text */}
                <Text
                    fontSize={0.22}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="#a7d0b3"
                    material-toneMapped={false}
                    depthTest={false}
                >
                    {title}
                </Text>
            </Float>
        </Billboard>
    )
}

function ExhibitionContent({ hall, stand, media, stands }: any) {
    const { openModal } = useAvatar()
    const [processed, setProcessed] = useState(false)
    const tvLabelsRef = useRef<{ pos: [number, number, number], name: string, id: string }[]>([])
    
    // We process the scene once
    const processedScenes = useMemo(() => {
        if (!hall?.scene || !stand?.scene || !media?.scene) return null
        
        const hScene = hall.scene.clone()
        const sScene = stand.scene.clone()
        const mScene = media.scene.clone()
        
        const loader = new THREE.TextureLoader()
        const labels: { pos: [number, number, number], name: string, id: string }[] = []
        
        // 1. Find reference stand positions for mapping
        const standOrigins: { pos: THREE.Vector3, index: number }[] = []
        sScene.traverse((node: any) => {
            if (node.name.toLowerCase().includes('stand')) {
                node.updateWorldMatrix(true, true)
                const pos = new THREE.Vector3()
                node.getWorldPosition(pos)
                standOrigins.push({ pos, index: 0 })
            }
        })
        
        standOrigins.sort((a, b) => {
            if (Math.abs(a.pos.z - b.pos.z) > 1) return a.pos.z - b.pos.z
            return a.pos.x - b.pos.x
        })
        standOrigins.forEach((s, i) => { s.index = i })

        // 2. Process Media & Identify TV positions for labels
        mScene.traverse((mesh: any) => {
            if (!mesh.isMesh) return
            const name = mesh.name.toLowerCase()
            const isMedia = MEDIA_PATTERNS.some(p => name.includes(p))
            if (!isMedia) return
            
            mesh.updateWorldMatrix(true, true)
            const worldPos = new THREE.Vector3()
            mesh.getWorldPosition(worldPos)
            
            // Find nearest stand index
            let nearest = standOrigins[0]
            if (standOrigins.length > 0) {
                let minDist = Infinity
                standOrigins.forEach(s => {
                    const d = worldPos.distanceTo(s.pos)
                    if (d < minDist) { minDist = d; nearest = s }
                })
            }
            const standIndex = nearest?.index || 0
            const config = stands[standIndex]
            if (!config) return

            const box = new THREE.Box3().setFromObject(mesh)
            const size = new THREE.Vector3(); box.getSize(size)
            const displayType = classifyDisplay(worldPos.y, size.y)
            
            mesh.userData.standIndex = standIndex
            mesh.userData.displayType = displayType

            // Map and Apply texture
            const url = displayType === 'picture' ? config.pictureContent : displayType === 'tv' ? config.tvContent : config.deskContent
            const type = displayType === 'picture' ? config.pictureType : displayType === 'tv' ? config.tvType : config.deskType

            if (url && type === 'image') {
                const tex = loader.load(url)
                tex.flipY = false; tex.colorSpace = THREE.SRGBColorSpace
                mesh.material = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide, toneMapped: false })
            }

            // 3. Create label specifically for "TV" objects (under the screen)
            if (name.includes(TV_PATTERN)) {
                // Position label at the bottom of the TV mesh, with a clear offset forward (+0.6)
                labels.push({
                    pos: [worldPos.x, worldPos.y - (size.y / 2) - 0.15, worldPos.z + (worldPos.z > 0 ? 0.6 : -0.6)],
                    name: stands[standIndex]?.name || `Stand ${standIndex + 1}`,
                    id: mesh.uuid
                })
            }
        })

        console.log(`[Exhibition] Generated ${labels.length} stand labels.`)
        tvLabelsRef.current = labels
        return { hScene, sScene, mScene }
    }, [hall, stand, media, stands])

    useEffect(() => {
        if (processedScenes) setProcessed(true)
    }, [processedScenes])

    if (!processedScenes) return null

    const onInteraction = (e: ThreeEvent<MouseEvent>) => {
        const mesh = e.object as any
        if (mesh.userData?.standIndex !== undefined) {
            e.stopPropagation()
            openModal({
                modalId: `m-${mesh.userData.standIndex}-${mesh.userData.displayType}`,
                standIndex: mesh.userData.standIndex,
                contentType: mesh.userData.displayType
            })
        }
    }

    return (
        <group onClick={onInteraction}>
            <primitive object={processedScenes.hScene} />
            <primitive object={processedScenes.sScene} />
            <primitive object={processedScenes.mScene} />
            
            {processedScenes && tvLabelsRef.current.map((l) => (
                <StandLabel key={l.id} title={l.name} position={l.pos} />
            ))}
        </group>
    )
}

export function Exhibition() {
    const { stands } = useStands()
    const hall = useGLTF('/hall.glb')
    const stand = useGLTF('/Stand.glb')
    const media = useGLTF('/allmedia.glb')

    return (
        <Suspense fallback={null}>
            <ExhibitionContent hall={hall} stand={stand} media={media} stands={stands} />
        </Suspense>
    )
}

const MEDIA_PATTERNS = ['plane', 'cube', 'screen', 'poster', 'led', 'display', 'tv', 'monitor']

useGLTF.preload(['/hall.glb', '/Stand.glb', '/allmedia.glb'])
