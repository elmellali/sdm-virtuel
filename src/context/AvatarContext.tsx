'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type NavMode = 'guide' | 'explore'
export type AvatarExpression = 'happy' | 'neutral' | 'thoughtful' | 'surprised' | 'engaged'
export type AvatarAnimation = 'idle' | 'talking' | 'thinking' | 'excited' | 'explaining'

export interface ModalContext {
  modalId: string
  standIndex?: number
  exhibitorName?: string
  contentType: 'tv' | 'desk' | 'picture'
}

interface AvatarContextType {
  // Navigation
  navMode: NavMode
  setNavMode: (mode: NavMode) => void

  // Chat
  isChatOpen: boolean
  isTalking: boolean
  openChat: () => void
  closeChat: () => void
  setTalking: (val: boolean) => void

  // Expression & Animation state (from AI response)
  currentExpression: AvatarExpression
  currentAnimation: AvatarAnimation
  setExpressionAnimation: (exp: AvatarExpression, anim: AvatarAnimation) => void

  // Interactive Modals
  activeModal: ModalContext | null
  openModal: (context: ModalContext | string | null) => void
  closeModal: () => void
}

const AvatarContext = createContext<AvatarContextType | null>(null)

export function AvatarProvider({ children }: { children: ReactNode }) {
  const [navMode, setNavModeState] = useState<NavMode>('guide')
  const [isChatOpen, setIsChatOpen] = useState(true) // open by default in guide mode
  const [isTalking, setIsTalking] = useState(false)
  const [activeModal, setActiveModal] = useState<ModalContext | null>(null)
  const [currentExpression, setCurrentExpression] = useState<AvatarExpression>('neutral')
  const [currentAnimation, setCurrentAnimation] = useState<AvatarAnimation>('idle')

  const setNavMode = useCallback((mode: NavMode) => {
    setNavModeState(mode)
    if (mode === 'guide') {
      setIsChatOpen(true)  // auto-open chat when returning to guide
    } else {
      setIsChatOpen(false) // close chat when exploring
    }
  }, [])

  const openModal = useCallback((context: ModalContext | string | null) => {
    if (context === null) {
      setActiveModal(null)
    } else if (typeof context === 'string') {
      // Backward compatibility: support string IDs
      setActiveModal({ modalId: context, contentType: 'tv' })
    } else {
      setActiveModal(context)
    }
  }, [])

  return (
    <AvatarContext.Provider value={{
      navMode,
      setNavMode,
      isChatOpen,
      isTalking,
      openChat: () => setIsChatOpen(true),
      closeChat: () => setIsChatOpen(false),
      setTalking: setIsTalking,
      currentExpression,
      currentAnimation,
      setExpressionAnimation: (exp: AvatarExpression, anim: AvatarAnimation) => {
        setCurrentExpression(exp)
        setCurrentAnimation(anim)
      },
      activeModal,
      openModal,
      closeModal: () => setActiveModal(null)
    }}>
      {children}
    </AvatarContext.Provider>
  )
}

export function useAvatar() {
  const ctx = useContext(AvatarContext)
  if (!ctx) throw new Error('useAvatar must be inside AvatarProvider')
  return ctx
}
