import { useState, useCallback, useRef } from 'react'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface StructuredResponse {
  text: string
  expression: 'happy' | 'neutral' | 'thoughtful' | 'surprised' | 'engaged'
  animation: 'idle' | 'talking' | 'thinking' | 'excited' | 'explaining'
}

// Use proxy endpoint to avoid exposing API keys
const PROXY_URL = process.env.NEXT_PUBLIC_AI_PROXY_URL || 'http://localhost:3001'

// Check if proxy is configured and reachable
export const hasProxyConfigured = !!PROXY_URL

// Fallback scripted responses when proxy is not available
const SCRIPTED_RESPONSES = [
  "Bienvenue à l'exposition virtuelle SDM ! Je suis votre guide. N'hésitez pas à explorer les différents stands.",
  "L'exposition présente les dernières innovations de la Salle Des Marchés. Vous pouvez vous déplacer avec les touches WASD et votre souris.",
  "Chaque stand propose des produits et services uniques. Approchez-vous pour découvrir les détails !",
  "Je suis ravi de vous accueillir ici. Y a-t-il un stand particulier qui vous intéresse ?",
  "Cette exposition virtuelle vous permet de découvrir nos offres depuis chez vous. Profitez bien de la visite !",
]
let scriptedIndex = 0

async function callOpenAI(messages: Message[], structured = false): Promise<string> {
  // Try proxy first, fallback to scripted responses
  try {
    const res = await fetch(`${PROXY_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        max_tokens: structured ? 200 : 150,
        temperature: 0.7,
        structured,
      }),
    })

    if (!res.ok) {
      throw new Error(`Proxy returned ${res.status}`)
    }

    const data = await res.json()
    return data.choices[0].message.content as string
  } catch (e) {
    console.warn('AI proxy unavailable, using scripted responses:', e)
    const response = SCRIPTED_RESPONSES[scriptedIndex % SCRIPTED_RESPONSES.length]
    scriptedIndex++
    return response
  }
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    // Convert blob to base64 for more reliable transport
    const base64Audio = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        const base64 = result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(audioBlob)
    })

    const res = await fetch(`${PROXY_URL}/api/transcribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        audio: base64Audio,
        type: audioBlob.type 
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message || 'Transcription error')
    }

    const data = await res.json()
    return data.text as string
  } catch (e) {
    console.warn('Transcription unavailable. Ensure the AI proxy server is running at:', PROXY_URL)
    throw new Error('Voice transcription failed. Is the AI proxy server (npm run proxy) running?')
  }
}

export function useAvatarAI(onTalkingChange: (talking: boolean) => void) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [currentExpression, setCurrentExpression] = useState<'happy' | 'neutral' | 'thoughtful' | 'surprised' | 'engaged'>('neutral')
  const [currentAnimation, setCurrentAnimation] = useState<'idle' | 'talking' | 'thinking' | 'excited' | 'explaining'>('idle')
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const expressionRef = useRef<'happy' | 'neutral' | 'thoughtful' | 'surprised' | 'engaged'>('neutral')
  const animationRef = useRef<'idle' | 'talking' | 'thinking' | 'excited' | 'explaining'>('idle')

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utteranceRef.current = utterance

    // Voices may load asynchronously - ensure they're available
    const voices = window.speechSynthesis.getVoices()
    const frVoices = voices.filter(v => v.lang.startsWith('fr'))

    // Look for indicative names for female voices
    const femaleVoice = frVoices.find(v =>
        v.name.toLowerCase().includes('julie') ||
        v.name.toLowerCase().includes('marie') ||
        v.name.toLowerCase().includes('hortense') ||
        v.name.toLowerCase().includes('clara') ||
        v.name.toLowerCase().includes('valentine') ||
        v.name.toLowerCase().includes('jeanne') ||
        v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('femme') ||
        v.name.toLowerCase().includes('elsa') ||
        v.name.toLowerCase().includes('anne')
    )

    if (femaleVoice) {
        utterance.voice = femaleVoice
    } else if (frVoices.length > 0) {
        utterance.voice = frVoices[0]
    } else {
        // Ultimate fallback: any available voice, try to force French language
        const anyVoice = voices[0]
        if (anyVoice) utterance.voice = anyVoice
    }

    utterance.lang = 'fr-FR' // Force French language regardless of voice
    utterance.rate = 0.95
    // Lower pitch to sound more masculine, especially if fallback is used
    utterance.pitch = 1.05

    utterance.onstart = () => onTalkingChange(true)
    utterance.onend = () => onTalkingChange(false)
    utterance.onerror = () => onTalkingChange(false)

    window.speechSynthesis.speak(utterance)
  }, [onTalkingChange])

  const sendMessage = useCallback(async (text: string) => {
    if (loading || !text.trim()) return

    const userMsg: Message = { role: 'user', content: text.trim() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      // Use structured response for rich avatar behavior
      const rawReply = await callOpenAI(updatedMessages, true)

      // Try to parse structured response, fallback to plain text
      let reply: StructuredResponse
      try {
        const parsed = JSON.parse(rawReply) as StructuredResponse
        if (parsed.text && parsed.expression && parsed.animation) {
          reply = parsed
        } else {
          throw new Error('Invalid structure')
        }
      } catch {
        // Fallback: treat as plain text with neutral expression
        reply = {
          text: rawReply,
          expression: 'engaged',
          animation: 'talking',
        }
      }

      // Update expression and animation state
      expressionRef.current = reply.expression
      animationRef.current = reply.animation
      setCurrentExpression(reply.expression)
      setCurrentAnimation(reply.animation)

      const assistantMsg: Message = { role: 'assistant', content: reply.text }
      setMessages(prev => [...prev, assistantMsg])
      speak(reply.text)
    } catch (e) {
      console.error('Avatar AI error:', e)
      const errMsg: Message = {
        role: 'assistant',
        content: 'Désolé, je rencontre une difficulté technique. Réessayez dans un instant.',
      }
      setMessages(prev => [...prev, errMsg])
      speak(errMsg.content)
      expressionRef.current = 'surprised'
      animationRef.current = 'thinking'
      setCurrentExpression('surprised')
      setCurrentAnimation('thinking')
    } finally {
      setLoading(false)
    }
  }, [loading, messages, speak])

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel()
    onTalkingChange(false)
  }, [onTalkingChange])

  return { messages, loading, sendMessage, stopSpeaking, currentExpression, currentAnimation }
}
