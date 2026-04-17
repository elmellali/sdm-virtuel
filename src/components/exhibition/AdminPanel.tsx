'use client'

import { useState } from 'react'
import { useStands, type StandConfig } from '@/context/StandsContext'
import { X, Tv, Monitor, Image as ImageIcon, Settings } from 'lucide-react'

export function AdminPanel() {
    const { stands, updateStand, isAdminOpen, setAdminOpen } = useStands()
    const [selectedStand, setSelectedStand] = useState<StandConfig | null>(null)

    if (!isAdminOpen) return null

    const handleUpdate = (field: keyof StandConfig, value: string) => {
        if (!selectedStand) return
        
        // For name field, just update the name without type detection
        if (field === 'name') {
            updateStand(selectedStand.id, { name: value })
            setSelectedStand(prev => prev ? { ...prev, name: value } : null)
            return
        }
        
        const isVideo = value.endsWith('.mp4') || value.endsWith('.webm')
        const typeField = field.replace('Content', 'Type') as keyof StandConfig

        updateStand(selectedStand.id, {
            [field]: value,
            [typeField]: isVideo ? 'video' : 'image'
        })

        // Update local state for immediate UI feedback
        setSelectedStand(prev => prev ? {
            ...prev,
            [field]: value,
            [typeField]: isVideo ? 'video' : 'image'
        } : null)
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000, display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '16px',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', pointerEvents: 'auto'
        }}>
            <div style={{
                background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px', width: '100%', maxWidth: '896px', maxHeight: '85vh',
                boxShadow: '0 32px 64px rgba(0,0,0,0.5)', overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(24,24,27,0.5)'
                }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Settings className="w-5 h-5 text-[#a7d0b3]" />
                            Gestion de l'Exposition
                        </h2>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', margin: 0 }}>Configurez les médias de chaque stand</p>
                    </div>
                    <button
                        onClick={() => setAdminOpen(false)}
                        style={{
                            padding: '8px', borderRadius: '8px', background: 'transparent',
                            border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'white'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                    {/* Stand List */}
                    <div style={{ width: '33.333333%', borderRight: '1px solid rgba(255,255,255,0.1)', overflowY: 'auto', background: 'rgba(24,24,27,0.3)', padding: '16px' }}>
                        <p style={{ fontSize: '10px', fontWeight: 'bold', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 8px 8px' }}>Liste des Stands</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {stands.map(stand => (
                                <button
                                    key={stand.id}
                                    onClick={() => setSelectedStand(stand)}
                                    style={{
                                        width: '100%', textAlign: 'left', padding: '12px 16px',
                                        borderRadius: '12px', transition: 'all 0.2s', border: 'none', cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        background: selectedStand?.id === stand.id ? '#a7d0b3' : 'transparent',
                                        color: selectedStand?.id === stand.id ? 'black' : 'rgba(255,255,255,0.7)',
                                        boxShadow: selectedStand?.id === stand.id ? '0 10px 15px -3px rgba(167,208,179,0.2)' : 'none'
                                    }}
                                    onMouseEnter={e => {
                                        if (selectedStand?.id !== stand.id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                                    }}
                                    onMouseLeave={e => {
                                        if (selectedStand?.id !== stand.id) e.currentTarget.style.background = 'transparent'
                                    }}
                                >
                                    <span style={{ fontWeight: 600, fontSize: '14px' }}>Stand #{stand.id}</span>
                                    {selectedStand?.id === stand.id && <div style={{ width: '6px', height: '6px', backgroundColor: 'black', borderRadius: '50%' }} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stand Details Editor */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '32px', background: 'rgba(24,24,27,0.1)' }}>
                        {selectedStand ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '24px' }}>Configuration: {selectedStand.name} (Stand {selectedStand.id})</h3>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        {/* Exposer Name Section */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#a7d0b3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                Nom de l'Exposant
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedStand.name}
                                                onChange={(e) => handleUpdate('name', e.target.value)}
                                                style={{
                                                    width: '100%', background: 'rgba(39,39,42,0.5)', border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '14px', fontWeight: 'bold',
                                                    boxSizing: 'border-box'
                                                }}
                                                placeholder="Company Name"
                                            />
                                        </div>

                                        {/* TV Section */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#a7d0b3', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Tv size={16} />
                                                Case Télévision (TV)
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedStand.tvContent}
                                                onChange={(e) => handleUpdate('tvContent', e.target.value)}
                                                style={{
                                                    width: '100%', background: 'rgba(39,39,42,0.5)', border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                                placeholder="/video.mp4 or /image.jpg"
                                            />
                                            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', margin: 0 }}>Supporte .mp4 pour vidéo, .jpg/png pour image</p>
                                        </div>

                                        {/* Screen Desk Section */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#a7d0b3', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Monitor size={16} />
                                                Écran du Bureau
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedStand.deskContent}
                                                onChange={(e) => handleUpdate('deskContent', e.target.value)}
                                                style={{
                                                    width: '100%', background: 'rgba(39,39,42,0.5)', border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '14px', fontFamily: 'monospace',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                        </div>

                                        {/* Picture Section */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#a7d0b3', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <ImageIcon size={16} />
                                                Poster Mural
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedStand.pictureContent}
                                                onChange={(e) => handleUpdate('pictureContent', e.target.value)}
                                                style={{
                                                    width: '100%', background: 'rgba(39,39,42,0.5)', border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '14px',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '16px' }}>
                                    <div style={{ flex: 1, padding: '16px', borderRadius: '12px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', color: 'rgba(191,219,254,0.7)', fontSize: '12px' }}>
                                        Note: Les changements sont appliqués instantanément et sauvegardés dans votre navigateur.
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: 0.3 }}>
                                <div style={{ marginBottom: '16px', padding: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}>
                                    <Settings className="w-12 h-12" />
                                </div>
                                <p style={{ fontSize: '18px', fontWeight: 500, color: 'white' }}>Sélectionnez un stand pour commencer</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}