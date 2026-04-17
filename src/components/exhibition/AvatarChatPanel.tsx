'use client'

import { useRef, useState, useEffect } from 'react'
import { useAvatar } from '@/context/AvatarContext'
import { useAvatarAI, type Message, hasProxyConfigured, transcribeAudio } from '@/hooks/useAvatarAI'
import { Mic, MicOff, Send, X, Bot } from 'lucide-react'

export function AvatarChatPanel() {
  const { isChatOpen, isTalking, closeChat, setTalking, setExpressionAnimation } = useAvatar()
  const { messages, loading, sendMessage, stopSpeaking, currentExpression, currentAnimation } = useAvatarAI(setTalking)
  const [input, setInput] = useState('')
  const [recording, setRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Apply expression/animation to avatar whenever AI response changes
  useEffect(() => {
    if (currentExpression && currentAnimation) {
      setExpressionAnimation(currentExpression, currentAnimation)
    }
  }, [currentExpression, currentAnimation, setExpressionAnimation])

  // Greet on first open
  const hasGreeted = useRef(false)
  useEffect(() => {
    if (isChatOpen && !hasGreeted.current && messages.length === 0) {
      hasGreeted.current = true
      sendMessage('Bonjour, je viens d\'arriver à l\'exposition. Présentez-vous et donnez-moi un aperçu.')
    }
  }, [isChatOpen]) // eslint-disable-line

  const handleSend = () => {
    if (!input.trim() || loading) return
    sendMessage(input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleRecording = async () => {
    if (!hasProxyConfigured) {
      alert("L'utilisation du microphone nécessite un serveur proxy IA configuré. Voir /server/README.md")
      return
    }

    if (recording) {
      // Stop recording
      mediaRecorderRef.current?.stop()
      setRecording(false)
      return
    }

    // Start recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Explicitly set mime type for better compatibility
      const mimeType = 'audio/webm;codecs=opus'
      const options = MediaRecorder.isTypeSupported(mimeType) ? { mimeType } : {}
      
      const mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        // Stop all tracks to release the microphone lock
        stream.getTracks().forEach(track => track.stop())
        
        // Use the actual type provided by the recorder
        const actualType = audioChunksRef.current[0]?.type || 'audio/webm'
        const audioBlob = new Blob(audioChunksRef.current, { type: actualType })
        console.log(`[Audio Debug] Size: ${audioBlob.size} bytes, Type: ${actualType}`)
        
        try {
          // Send blob to OpenAI Whisper API (passing the actual type)
          const transcript = await transcribeAudio(audioBlob)
          if (transcript.trim()) {
            sendMessage(transcript)
          }
        } catch (err) {
          console.error('Whisper transcription failed:', err)
          alert("Erreur lors de la transcription audio.")
        }
      }

      mediaRecorder.start()
      setRecording(true)
      stopSpeaking()
    } catch (err) {
      console.error('Microphone access denied:', err)
      alert("Impossible d'accéder au microphone. Veuillez autoriser l'accès dans votre navigateur.")
    }
  }

  if (!isChatOpen) return null

  return (
    <div
      className="avatar-chat-panel"
      style={{
        position: 'fixed',
        bottom: 100,
        right: 24,
        width: 380,
        maxHeight: 540,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10, 15, 12, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(167, 208, 179, 0.2)',
        borderRadius: 24,
        boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(167,208,179,0.1) inset',
        zIndex: 50,
        overflow: 'hidden',
        fontFamily: '"Inter", "Segoe UI", sans-serif',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 20px',
        borderBottom: '1px solid rgba(167, 208, 179, 0.12)',
        background: 'rgba(167, 208, 179, 0.05)',
      }}>
        {/* Avatar icon */}
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a7d0b3 0%, #6aab7e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(167,208,179,0.4)',
          flexShrink: 0,
        }}>
          <Bot size={20} color="#fff" />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ color: '#e8f5ec', fontWeight: 700, fontSize: 15 }}>Guide SDM</div>
          <div style={{
            fontSize: 12,
            color: isTalking ? '#a7d0b3' : '#6b7c72',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}>
            {isTalking ? (
              <>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#a7d0b3',
                  display: 'inline-block',
                  animation: 'pulse-dot 1s ease-in-out infinite',
                }} />
                En train de parler...
              </>
            ) : loading ? (
              <>
                <span style={{ opacity: 0.6 }}>●</span> Réflexion...
              </>
            ) : (
              <>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: '#a7d0b3',
                  display: 'inline-block',
                }} />
                En ligne
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => { stopSpeaking(); closeChat() }}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#8a9e90',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,80,80,0.2)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 16px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(167,208,179,0.2) transparent',
      }}>
        {messages.length === 0 && !loading && (
          <div style={{
            textAlign: 'center',
            color: '#4a5e52',
            fontSize: 13,
            marginTop: 24,
            lineHeight: 1.6,
          }}>
            Posez une question à votre guide.<br />
            La visite start ici ! 🎉
          </div>
        )}

        {messages.map((msg: Message, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 4, padding: '8px 12px', alignSelf: 'flex-start' }}>
            {[0, 0.2, 0.4].map((d, i) => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#a7d0b3',
                opacity: 0.7,
                animation: `bounce-dot 1s ${d}s ease-in-out infinite alternate`,
              }} />
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(167, 208, 179, 0.1)',
        display: 'flex',
        gap: 8,
        alignItems: 'flex-end',
      }}>
        <button
          onClick={toggleRecording}
          title={recording ? 'Arrêter l\'enregistrement' : 'Parler'}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: `1px solid ${recording ? 'rgba(255,80,80,0.5)' : 'rgba(167,208,179,0.2)'}`,
            background: recording ? 'rgba(255,80,80,0.15)' : 'rgba(167,208,179,0.08)',
            color: recording ? '#ff6060' : '#a7d0b3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s',
            animation: recording ? 'pulse-record 1s ease-in-out infinite' : 'none',
          }}
        >
          {recording ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tapez votre question..."
          rows={1}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(167,208,179,0.15)',
            borderRadius: 14,
            color: '#e0ebe4',
            fontSize: 14,
            padding: '10px 14px',
            resize: 'none',
            outline: 'none',
            fontFamily: 'inherit',
            lineHeight: 1.4,
            maxHeight: 100,
            overflowY: 'auto',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(167,208,179,0.4)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(167,208,179,0.15)')}
        />

        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: 'none',
            background: loading || !input.trim()
              ? 'rgba(167,208,179,0.15)'
              : 'linear-gradient(135deg, #a7d0b3 0%, #6aab7e 100%)',
            color: loading || !input.trim() ? '#4a5e52' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s',
            boxShadow: loading || !input.trim() ? 'none' : '0 4px 16px rgba(107,171,126,0.4)',
          }}
        >
          <Send size={17} />
        </button>
      </div>

      {/* Inline keyframe styles */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes bounce-dot {
          from { transform: translateY(0); }
          to { transform: translateY(-6px); }
        }
        @keyframes pulse-record {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,96,96,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(255,96,96,0); }
        }
      `}</style>
    </div>
  )
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
    }}>
      {!isUser && (
        <div style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a7d0b3, #6aab7e)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginRight: 8,
          marginTop: 2,
        }}>
          <Bot size={14} color="#fff" />
        </div>
      )}
      <div style={{
        maxWidth: '78%',
        padding: '10px 14px',
        borderRadius: isUser
          ? '18px 18px 4px 18px'
          : '18px 18px 18px 4px',
        background: isUser
          ? 'linear-gradient(135deg, rgba(167,208,179,0.25), rgba(107,171,126,0.2))'
          : 'rgba(255,255,255,0.06)',
        border: isUser
          ? '1px solid rgba(167,208,179,0.3)'
          : '1px solid rgba(255,255,255,0.08)',
        color: '#ddeae0',
        fontSize: 14,
        lineHeight: 1.5,
      }}>
        {message.content}
      </div>
    </div>
  )
}
