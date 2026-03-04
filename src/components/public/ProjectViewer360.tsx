"use client";

import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { useRef, useState } from 'react';
import { Maximize2, Minimize2, Info } from 'lucide-react';

interface ProjectViewerProps {
    imageUrl: string;
    projectName: string;
}

export default function ProjectViewer360({ imageUrl, projectName }: ProjectViewerProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showInfo, setShowInfo] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const toggleInfo = () => setShowInfo(!showInfo);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: isFullscreen ? '100vh' : 'calc(100vh - 80px)', // adjust based on layout height
                backgroundColor: '#000',
                overflow: 'hidden'
            }}
        >
            <ReactPhotoSphereViewer
                src={imageUrl}
                height={"100%"}
                width={"100%"}
                littlePlanet={false}
                hideNavbarButton={true} // Customizing UI so we hide default navbar
            />

            {/* Custom Overlay Controls */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                display: 'flex',
                gap: '10px',
                zIndex: 10
            }}>
                <button
                    onClick={toggleInfo}
                    style={{
                        background: 'rgba(15, 23, 42, 0.7)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    title="Afficher/Masquer les infos"
                >
                    <Info size={20} />
                </button>
                <button
                    onClick={toggleFullscreen}
                    style={{
                        background: 'rgba(15, 23, 42, 0.7)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    title="Plein écran"
                >
                    {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
            </div>

            {showInfo && (
                <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '30px',
                    background: 'rgba(15, 23, 42, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    color: 'white',
                    maxWidth: '400px',
                    zIndex: 10,
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{projectName}</h2>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>
                        Glissez avec la souris ou le doigt pour explorer la visite virtuelle à 360°.
                    </p>
                </div>
            )}
        </div>
    );
}
