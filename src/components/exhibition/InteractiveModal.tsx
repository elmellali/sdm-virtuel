import { useAvatar } from '@/context/AvatarContext'
import { useStands } from '@/context/StandsContext'
import { X, PlayCircle, FileText, Monitor } from 'lucide-react'

export function InteractiveModal() {
  const { activeModal, closeModal } = useAvatar()
  const { stands } = useStands()

  if (!activeModal) return null

  const { modalId, standIndex, contentType } = activeModal
  const stand = standIndex !== undefined ? stands[standIndex] : null

  // Determine content source from stand configuration
  let contentSrc: string | undefined
  let contentTypeFinal: 'video' | 'image' | 'info' = 'info'
  let title = 'Contenu du Stand'
  let desc = 'Informations sur le stand'

  if (stand) {
    // Get content based on type (tv, desk, picture)
    if (contentType === 'tv') {
      contentSrc = stand.tvContent
      contentTypeFinal = stand.tvType === 'video' ? 'video' : 'image'
      title = `${stand.name} - Écran TV`
      desc = 'Contenu vidéo du stand'
    } else if (contentType === 'desk') {
      contentSrc = stand.deskContent
      contentTypeFinal = stand.deskType === 'video' ? 'video' : 'image'
      title = `${stand.name} - Écran Bureau`
      desc = 'Contenu du bureau du stand'
    } else if (contentType === 'picture') {
      contentSrc = stand.pictureContent
      contentTypeFinal = stand.pictureType === 'video' ? 'video' : 'image'
      title = `${stand.name} - Affiche`
      desc = 'Affiche du stand'
    }
  }

  // Fallback for hardcoded modal IDs (backward compatibility)
  if (!stand && modalId === 'main-tv') {
    contentSrc = '/0001-1021.mp4'
    contentTypeFinal = 'video'
    title = 'Présentation SDM'
    desc = 'Découvrez notre vidéo de présentation diffusée sur le grand écran.'
  } else if (!stand && modalId === 'poster-1') {
    contentSrc = '/Fiche technique (1).png'
    contentTypeFinal = 'image'
    title = 'Fiche Technique'
    desc = 'Informations techniques et détails de notre offre.'
  }

  // If no content found
  if (!contentSrc && !stand) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <div className="bg-white/10 border border-white/20 p-8 rounded-2xl flex flex-col items-center">
          <p className="text-white">Contenu introuvable pour : {modalId}</p>
          <button onClick={closeModal} className="mt-4 px-4 py-2 bg-white/20 rounded-lg text-white">Fermer</button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100, display: 'flex', 
        alignItems: 'center', justifyContent: 'center', padding: '16px',
        background: 'rgba(10, 15, 12, 0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={closeModal} // Click background to close
    >
      {/* Modal Container */}
      <div
        style={{
          position: 'relative', width: '100%', maxWidth: '896px', maxHeight: '100%', 
          display: 'flex', flexDirection: 'column', borderRadius: '24px', 
          overflow: 'hidden', boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
          background: 'rgba(20, 26, 22, 0.95)',
          border: '1px solid rgba(167, 208, 179, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', 
          background: 'rgba(255,255,255,0.05)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {contentTypeFinal === 'video' ? <PlayCircle className="text-[#a7d0b3]" /> : contentTypeFinal === 'image' ? <FileText className="text-[#a7d0b3]" /> : <Monitor className="text-[#a7d0b3]" />}
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.025em', color: 'white', margin: 0 }}>{title}</h2>
          </div>
          <button
            onClick={closeModal}
            style={{ 
              padding: '8px', borderRadius: '50%', background: 'transparent', 
              border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' 
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)', e.currentTarget.style.color = 'white')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'row', background: 'rgba(0,0,0,0.4)' }}>

          {/* Main Media Area */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', position: 'relative', minHeight: '300px' }}>
            {contentTypeFinal === 'video' && contentSrc && (
              <video
                src={contentSrc}
                controls
                autoPlay
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}
              />
            )}

            {contentTypeFinal === 'image' && contentSrc && (
              <img
                src={contentSrc}
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}
              />
            )}

            {contentTypeFinal === 'info' && (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
                <p style={{ fontSize: '18px' }}>Aucun média disponible pour ce stand</p>
              </div>
            )}
          </div>

          {/* Side Info Panel */}
          <div style={{ width: '320px', padding: '32px', background: 'rgba(255,255,255,0.05)', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#a7d0b3', marginBottom: '12px' }}>{title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6 }}>
              {desc}
            </p>

            {stand && (
              <div style={{ marginTop: '16px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                <p>Stand: {stand.name}</p>
              </div>
            )}

            <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={closeModal}
                style={{
                  width: '100%', padding: '12px', borderRadius: '12px', fontWeight: 600, 
                  transition: 'all 0.2s', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', 
                  color: 'white', cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Fermer et continuer
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
