'use client'

import dynamic from 'next/dynamic'
import { Suspense, useState } from 'react'
import { StandsProvider, useStands } from '@/context/StandsContext'
import { AvatarProvider, useAvatar } from '@/context/AvatarContext'
import { Settings, Compass, Layout, LogOut } from 'lucide-react'

// 3D Scene Components
const Scene = dynamic(
  () => import('@/components/exhibition/Scene').then((mod) => mod.Scene),
  { ssr: false }
)

// UI Overlay Components
const Minimap = dynamic(() => import('@/components/exhibition/Minimap').then(mod => mod.Minimap), { ssr: false })
const TeleportNav = dynamic(() => import('@/components/exhibition/TeleportNav').then(mod => mod.TeleportNavigation), { ssr: false })
const AvatarChatPanel = dynamic(() => import('@/components/exhibition/AvatarChatPanel').then(mod => mod.AvatarChatPanel), { ssr: false })
const AdminPanel = dynamic(() => import('@/components/exhibition/AdminPanel').then(mod => mod.AdminPanel), { ssr: false })
const InteractiveModal = dynamic(() => import('@/components/exhibition/InteractiveModal').then(mod => mod.InteractiveModal), { ssr: false })
const ControlsHelper = dynamic(() => import('@/components/exhibition/ControlsHelper').then(mod => mod.ControlsHelper), { ssr: false })
const NavigationTutorial = dynamic(() => import('@/components/exhibition/NavigationTutorial').then(mod => mod.NavigationTutorial), { ssr: false })

export default function ExhibitionPage() {
  return (
    <main style={{ position: 'fixed', inset: 0, backgroundColor: '#0a0a0a', overflow: 'hidden' }}>
      <Suspense fallback={
        <div style={{ 
          position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', 
          alignItems: 'center', justifyContent: 'center', color: '#a7d0b3', 
          fontWeight: 500, gap: '16px' 
        }}>
          <div style={{ 
            width: '48px', height: '48px', border: '2px solid rgba(167, 208, 179, 0.2)', 
            borderTopColor: '#a7d0b3', borderRadius: '50%', animation: 'spin 1s linear infinite' 
          }} />
          Initialisation de l'environnement 3D...
        </div>
      }>
        <StandsProvider>
          <AvatarProvider>
            <ExhibitionUI />
          </AvatarProvider>
        </StandsProvider>
      </Suspense>
    </main>
  )
}

function ExhibitionUI() {
  const { navMode, setNavMode } = useAvatar()
  const { setAdminOpen } = useStands()
  const [cameraPos, setCameraPos] = useState({ x: 55, z: 2 })
  const [cameraRot, setCameraRot] = useState(0)

  const inGuide = navMode === 'guide'

  return (
    <>
      {/* 3D Core */}
      <Scene onCameraUpdate={(pos, rot) => {
        setCameraPos(pos)
        setCameraRot(rot)
      }} />

      {/* UI Layer */}
      <div style={{ 
        pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 10, 
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px' 
      }}>
        {/* TOP UI */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto' }}>
            <Minimap position={cameraPos} rotation={cameraRot} />
          </div>
          
          <div style={{ pointerEvents: 'auto', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <TeleportNav onTeleport={(index) => {
              window.dispatchEvent(new CustomEvent('teleport-to-stand', { detail: { standIndex: index } }))
            }} />

            <button 
              onClick={() => setAdminOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
                background: 'rgba(10, 15, 12, 0.85)', border: '1px solid rgba(167, 208, 179, 0.3)',
                borderRadius: '16px', color: '#a7d0b3', cursor: 'pointer', pointerEvents: 'auto',
                fontSize: '14px', fontWeight: 600, backdropFilter: 'blur(12px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(167, 208, 179, 0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(10, 15, 12, 0.85)'}
            >
              <Settings size={18} />
              Gestion
            </button>
          </div>
        </div>

        {/* BOTTOM UI */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto' }}>
            <ControlsHelper />
          </div>
          
          <div style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-end' }}>
            {/* Exploration Switcher */}
            {inGuide ? (
              <button
                onClick={() => setNavMode('explore')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 32px',
                  background: 'linear-gradient(135deg, #a7d0b3 0%, #6aab7e 100%)',
                  border: 'none', borderRadius: '50px', color: 'black', cursor: 'pointer',
                  fontWeight: 700, fontSize: '15px', boxShadow: '0 10px 30px rgba(107, 171, 126, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(107, 171, 126, 0.6)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(107, 171, 126, 0.4)'
                }}
              >
                <Compass size={20} />
                Lancer l&apos;exploration
              </button>
            ) : (
              <button
                onClick={() => setNavMode('guide')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px', color: 'white', cursor: 'pointer',
                  fontWeight: 600, fontSize: '14px', backdropFilter: 'blur(10px)'
                }}
              >
                <LogOut size={18} />
                Quitter l&apos;exploration
              </button>
            )}
          </div>
        </div>
      </div>

      <AdminPanel />
      {/* Modal & Chat Overlays (Global Positioned) */}
      <AvatarChatPanel />
      <InteractiveModal />
      <NavigationTutorial />
    </>
  )
}
